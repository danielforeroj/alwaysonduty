from datetime import datetime

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


def _get_price_id(plan_type: str, settings):
    mapping = {
        "starter": settings.stripe_price_starter,
        "growth": settings.stripe_price_growth,
        "premium": settings.stripe_price_premium,
    }
    return mapping.get(plan_type)


@router.post("/checkout", response_model=CheckoutResponse)
async def create_checkout_session(
    payload: CheckoutRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    settings = get_settings()
    if not settings.stripe_secret_key:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Stripe is not configured")

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
        "cancel_url": f"{settings.frontend_base_url}/billing/cancelled",
    }

    if payload.trial_mode == "with_card":
        session_params["subscription_data"] = {"trial_period_days": 15}

    try:
        session = stripe.checkout.Session.create(**session_params)
    except Exception as exc:  # pragma: no cover - external service call
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)) from exc

    return CheckoutResponse(checkout_url=session.url)


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
                    primary_user, tenant, tenant.plan_type or "starter"
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
                        tenant.plan_type or "starter",
                        renewal_date=datetime.utcnow(),
                    )

    return {"received": True}
