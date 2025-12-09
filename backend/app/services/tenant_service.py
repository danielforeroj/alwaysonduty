from datetime import datetime
from typing import Optional
import re

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.tenant import Tenant


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
) -> Tenant:
    base_slug = slug or slugify(name)
    candidate = base_slug
    suffix = 1

    while True:
        tenant = Tenant(
            name=name,
            slug=candidate,
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
            db.refresh(tenant)
            return tenant
        except IntegrityError:
            db.rollback()
            candidate = f"{base_slug}-{suffix}"
            suffix += 1

def get_tenant_by_slug(db: Session, slug: str) -> Optional[Tenant]:
    return db.query(Tenant).filter(Tenant.slug == slug).first()
