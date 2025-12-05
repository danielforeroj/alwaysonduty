from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.models.tenant import Tenant

def slugify(name: str) -> str:
    return name.strip().lower().replace(" ", "-")

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
) -> Tenant:
    tenant = Tenant(
        name=name,
        slug=slug or slugify(name),
        plan_type=plan_type or "starter",
        trial_mode=trial_mode,
        trial_ends_at=trial_ends_at,
        billing_status=billing_status,
        stripe_customer_id=stripe_customer_id,
        stripe_subscription_id=stripe_subscription_id,
    )
    db.add(tenant)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise
    db.refresh(tenant)
    return tenant

def get_tenant_by_slug(db: Session, slug: str) -> Optional[Tenant]:
    return db.query(Tenant).filter(Tenant.slug == slug).first()
