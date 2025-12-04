from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.models.tenant import Tenant

def slugify(name: str) -> str:
    return name.strip().lower().replace(" ", "-")

def create_tenant(db: Session, name: str, plan_type: str, slug: Optional[str] = None) -> Tenant:
    tenant = Tenant(
        name=name,
        slug=slug or slugify(name),
        plan_type=plan_type or "starter",
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
