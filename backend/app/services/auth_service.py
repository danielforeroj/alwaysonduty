from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.auth import LoginRequest, SignupRequest
from app.services.tenant_service import create_tenant, slugify
from app.utils.security import create_access_token, hash_password, verify_password


def signup(db: Session, payload: SignupRequest):
    tenant = create_tenant(db, name=payload.business_name, plan_type=payload.plan_type)
    user = User(
        tenant_id=tenant.id,
        email=payload.email,
        hashed_password=hash_password(payload.password),
        role="admin",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token({"sub": str(user.id), "tenant_id": str(tenant.id)})
    return token, tenant, user


def login(db: Session, payload: LoginRequest):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        return None, None, None

    tenant_id = user.tenant_id
    token = create_access_token({"sub": str(user.id), "tenant_id": str(tenant_id)})
    tenant = user.tenant if hasattr(user, "tenant") else None
    if tenant is None:
        from app.models.tenant import Tenant

        tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    return token, tenant, user
