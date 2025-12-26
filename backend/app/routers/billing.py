from datetime import datetime
import logging

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
import stripe

from app.config import get_settings
from app.models.tenant import Tenant
from app.models.user import User
from app.schemas.billing import CheckoutRequest, CheckoutResponse
from app.services import email_service
from app.utils.dependencies import get_current_user, get_db

router = APIRouter()
logger = logging.getLogger(__name__)


def _get_price_id(plan_type: str, settings):
    mapping = {
        "basic": settings.stripe_price_basic,
        "growth": settings.stripe_price_growth,
        "premium": settings.stripe_price_premium,
        "starter": settings.stripe_price_basic,
    }
    return mapping.get(plan_type)


def _normalize_plan_type(plan_type: str | None) -> str:
    if plan_type and plan_type.lower() == "starter":
        return "basic"
    return (plan_type or "basic").lower()


def _validate_stripe_settings(settings, require_prices: bool = True) -> str | None:
    missing = []
    if not settings.stripe_secret_key:
        missing.append("STRIPE_SECRET_KEY")
    if require_prices:
        if not settings.stripe_price_basic:
            missing.append("STRIPE_PRICE_BASIC")
        if not settings.stripe_price_growth:
            missing.append("STRIPE_PRICE_GROWTH")
        if not settings.stripe_price_premium:
            missing.append("STRIPE_PRICE_PREMIUM")
    if missing:
        message = f"Stripe is not configured. Missing {', '.join(missing)} env vars."
        logger.error(message)
        return message
    return None


@router.post("/checkout", response_model=CheckoutResponse)
async def create_checkout_session(
    payload: CheckoutRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    settings = get_settings()
    config_error = _validate_stripe_settings(settings, require_prices=True)
    if config_error:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=config_error)

    price_id = _get_price_id(payload.plan_type, settings)
    if not price_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid plan type")

    stripe.api_key = settings.stripe_secret_key

    tenant: Tenant = current_user.tenant  # type: ignore
    if not tenant:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Tenant not found")

    if not tenant.stripe_customer_id:
        customer = stripe.Customer.create(
            email=current_user.email,
            name=tenant.name,
            metadata={"tenant_id": str(tenant.id)},
        )
        tenant.stripe_customer_id = customer.id
        db.add(tenant)
        db.commit()
        db.refresh(tenant)

    session_params = {
        "mode": "subscription",
        "customer": tenant.stripe_customer_id,
        "line_items": [{"price": price_id, "quantity": 1}],
        "success_url": f"{settings.frontend_base_url}/billing/success?session_id={{CHECKOUT_SESSION_ID}}",
        "cancel_url": f"{settings.frontend_base_url}/billing/cancel",
    }

    if payload.trial_mode == "with_card":
        session_params["subscription_data"] = {"trial_period_days": 15}

    try:
        session = stripe.checkout.Session.create(**session_params)
    except Exception as exc:  # pragma: no cover - external service call
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)) from exc

    return CheckoutResponse(checkout_url=session.url)


@router.post("/portal")
async def create_billing_portal_session(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    settings = get_settings()
    config_error = _validate_stripe_settings(settings, require_prices=False)
    if config_error:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=config_error)

    stripe.api_key = settings.stripe_secret_key

    tenant: Tenant = current_user.tenant  # type: ignore
    if not tenant:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Tenant not found")

    if not tenant.stripe_customer_id:
        customer = stripe.Customer.create(
            email=current_user.email,
            name=tenant.name,
            metadata={"tenant_id": str(tenant.id)},
        )
        tenant.stripe_customer_id = customer.id
        db.add(tenant)
        db.commit()
        db.refresh(tenant)

    try:
        portal_session = stripe.billing_portal.Session.create(
            customer=tenant.stripe_customer_id,
            return_url=f"{settings.frontend_base_url}/billing",
        )
    except Exception as exc:  # pragma: no cover - external service call
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)) from exc

    return {"url": portal_session.url}


@router.post("/webhook", include_in_schema=False)
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    settings = get_settings()
    if not settings.stripe_webhook_secret or not settings.stripe_secret_key:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Stripe webhook not configured")

    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    stripe.api_key = settings.stripe_secret_key
    try:
        event = stripe.Webhook.construct_event(
            payload=payload, sig_header=sig_header, secret=settings.stripe_webhook_secret
        )
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Webhook signature verification failed") from exc

    if event.get("type") == "checkout.session.completed":
        session = event["data"]["object"]
        customer_id = session.get("customer")
        subscription_id = session.get("subscription")

        tenant = db.query(Tenant).filter(Tenant.stripe_customer_id == customer_id).first()
        if tenant:
            tenant.stripe_subscription_id = subscription_id
            tenant.billing_status = "active"
            db.add(tenant)
            db.commit()

            primary_user = db.query(User).filter(User.tenant_id == tenant.id).order_by(User.id.asc()).first()
            if primary_user:
                email_service.send_plan_subscription_email(
                    primary_user, tenant, _normalize_plan_type(tenant.plan_type)
                )
    elif event.get("type") == "invoice.payment_succeeded":
        invoice = event["data"]["object"]
        customer_id = invoice.get("customer")

        if customer_id:
            tenant = db.query(Tenant).filter(Tenant.stripe_customer_id == customer_id).first()
            if tenant:
                tenant.billing_status = "active"
                db.add(tenant)
                db.commit()

                primary_user = (
                    db.query(User).filter(User.tenant_id == tenant.id).order_by(User.id.asc()).first()
                )
                if primary_user:
                    email_service.send_renewal_notification_email(
                        primary_user,
                        tenant,
                        _normalize_plan_type(tenant.plan_type),
                        renewal_date=datetime.utcnow(),
                    )

    return {"received": True}
