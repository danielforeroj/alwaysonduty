import secrets
from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.models.token import EmailVerificationToken, PasswordResetToken
from app.models.user import User
from app.schemas.auth import LoginRequest, SignupRequest
from app.services.tenant_service import create_tenant
from app.utils.security import create_access_token, hash_password, verify_password


def _create_email_verification_token(db: Session, user: User) -> EmailVerificationToken:
    token_str = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(days=2)
    token = EmailVerificationToken(
        user_id=user.id,
        token=token_str,
        expires_at=expires_at,
        used=False,
    )
    db.add(token)
    db.commit()
    db.refresh(token)
    return token


def signup(db: Session, payload: SignupRequest):
    trial_mode = payload.trial_mode or "with_card"
    trial_days = 15 if trial_mode == "with_card" else 3
    trial_ends_at = datetime.utcnow() + timedelta(days=trial_days)

    tenant = create_tenant(
        db,
        name=payload.business_name,
        plan_type=payload.plan_type,
        trial_mode=trial_mode,
        trial_ends_at=trial_ends_at,
        billing_status="trial",
    )
    user = User(
        tenant_id=tenant.id,
        email=payload.email,
        hashed_password=hash_password(payload.password),
        role="admin",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    verification_token = _create_email_verification_token(db, user)
    access_token = create_access_token({"sub": str(user.id), "tenant_id": str(tenant.id)})
    return access_token, tenant, user, verification_token.token


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


def verify_email(db: Session, token_str: str) -> bool:
    token = (
        db.query(EmailVerificationToken)
        .filter(EmailVerificationToken.token == token_str)
        .first()
    )
    if not token or token.used or token.expires_at < datetime.utcnow():
        return False

    user = token.user
    user.email_verified = True
    user.email_verified_at = datetime.utcnow()
    token.used = True

    db.add(user)
    db.add(token)
    db.commit()
    return True


def request_password_reset(db: Session, email: str):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None, None

    reset_token = PasswordResetToken(
        user_id=user.id,
        token=secrets.token_urlsafe(32),
        expires_at=datetime.utcnow() + timedelta(hours=1),
        used=False,
    )
    db.add(reset_token)
    db.commit()
    db.refresh(reset_token)
    return user, reset_token.token


def reset_password(db: Session, token_str: str, new_password: str) -> bool:
    token = (
        db.query(PasswordResetToken).filter(PasswordResetToken.token == token_str).first()
    )
    if not token or token.used or token.expires_at < datetime.utcnow():
        return False

    user = token.user
    user.hashed_password = hash_password(new_password)
    token.used = True
    db.add(user)
    db.add(token)
    db.commit()
    return True
