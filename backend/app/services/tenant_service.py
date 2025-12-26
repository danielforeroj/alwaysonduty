from datetime import datetime
from typing import Optional
import re

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.config import get_settings
from app.models.tenant import Tenant

settings = get_settings()


def slugify(name: str) -> str:
    base = re.sub(r"[^a-zA-Z0-9\s-]", "", name).strip().lower()
    base = re.sub(r"\s+", "-", base)
    return base or "tenant"

def create_tenant(
    db: Session,
    name: str,
    plan_type: str,
    slug: Optional[str] = None,
    trial_mode: Optional[str] = None,
    trial_ends_at: Optional[datetime] = None,
    billing_status: str = "trial",
    stripe_customer_id: Optional[str] = None,
    stripe_subscription_id: Optional[str] = None,
    is_special_permissioned: bool = False,
    trial_days_override: Optional[int] = None,
    card_required: Optional[bool] = None,
) -> Tenant:
    base_slug = slug or slugify(name)
    candidate = base_slug
    suffix = 1

    while True:
        tenant = Tenant(
            name=name,
            slug=candidate,
            plan_type=plan_type or "basic",
            trial_mode=trial_mode,
            trial_ends_at=trial_ends_at,
            billing_status=billing_status,
            stripe_customer_id=stripe_customer_id,
            stripe_subscription_id=stripe_subscription_id,
            is_special_permissioned=is_special_permissioned,
            trial_days_override=trial_days_override,
            card_required=card_required,
        )
        db.add(tenant)
        try:
            db.commit()
            db.refresh(tenant)
            return tenant
        except IntegrityError:
            db.rollback()
            candidate = f"{base_slug}-{suffix}"
            suffix += 1

def get_tenant_by_slug(db: Session, slug: str) -> Optional[Tenant]:
    return db.query(Tenant).filter(Tenant.slug == slug).first()


def ensure_demo_tenant(db: Session) -> Tenant:
    slug = settings.demo_tenant_slug or "onduty-demo"
    tenant = get_tenant_by_slug(db, slug)
    if tenant:
        return tenant

    name = settings.demo_tenant_name or "OnDuty Demo"
    return create_tenant(
        db,
        name=name,
        plan_type="demo",
        slug=slug,
        billing_status="active",
        trial_mode="no_trial",
        is_special_permissioned=True,
        card_required=False,
    )
