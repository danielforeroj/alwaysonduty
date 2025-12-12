import secrets
from datetime import datetime, timedelta

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.token import EmailVerificationToken, PasswordResetToken
from app.models.tenant import Tenant
from app.models.user import User
from app.schemas.auth import LoginRequest, SignupRequest
from app.services.tenant_service import create_tenant, slugify
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
    normalized_email = payload.email.strip().lower()
    existing = db.query(User).filter(User.email == normalized_email).first()
    if existing:
        raise ValueError("A user with this email already exists.")

    trial_mode = payload.trial_mode or "with_card"
    trial_days = 15 if trial_mode == "with_card" else 3
    base_slug = slugify(payload.business_name)

    existing_tenant = db.query(Tenant).filter(Tenant.slug == base_slug).first()
    trial_ends_at = datetime.utcnow() + timedelta(days=trial_days)
    if existing_tenant and existing_tenant.is_special_permissioned:
        if existing_tenant.trial_days_override:
            trial_ends_at = datetime.utcnow() + timedelta(days=existing_tenant.trial_days_override)
        if existing_tenant.card_required is not None:
            trial_mode = "with_card" if existing_tenant.card_required else "no_card"

    tenant = create_tenant(
        db,
        name=payload.business_name,
        plan_type=payload.plan_type,
        slug=base_slug,
        trial_mode=trial_mode,
        trial_ends_at=trial_ends_at,
        billing_status="trial",
        is_special_permissioned=existing_tenant.is_special_permissioned if existing_tenant else False,
        trial_days_override=existing_tenant.trial_days_override if existing_tenant else None,
        card_required=existing_tenant.card_required if existing_tenant else None,
    )
    user = User(
        tenant_id=tenant.id,
        email=normalized_email,
        name=payload.name,
        hashed_password=hash_password(payload.password),
        role="TENANT_ADMIN",
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        # Clean up the tenant if user creation failed to avoid orphan tenants.
        db.delete(tenant)
        db.commit()
        raise ValueError("A user with this email already exists.") from exc

    db.refresh(user)
    verification_token = _create_email_verification_token(db, user)
    access_token = create_access_token({"sub": str(user.id), "tenant_id": str(tenant.id)})
    return access_token, tenant, user, verification_token.token


def login(db: Session, payload: LoginRequest):
    normalized_email = payload.email.strip().lower()
    user = db.query(User).filter(User.email == normalized_email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        return None, None, None

    if not user.is_active:
        return None, None, None

    tenant_id = user.tenant_id
    user.last_login = datetime.utcnow()
    db.add(user)
    db.commit()
    db.refresh(user)
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


def request_password_reset(db: Session, email: str, allowed_roles: set[str] | None = None):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None, None

    if allowed_roles is not None and user.role not in allowed_roles:
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
