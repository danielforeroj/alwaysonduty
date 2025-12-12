from datetime import datetime
import logging

from app.db import SessionLocal
from app.models.tenant import Tenant
from app.models.user import User
from app.services.tenant_service import create_tenant
from app.utils.security import hash_password

SUPER_ADMIN_EMAILS = {
    "hello@danielforeroj.com": "Pepito",
    "danielforero2017@gmail.com": "Janice2018",
}

logger = logging.getLogger(__name__)


def ensure_super_admins() -> None:
    """Ensure platform-level super admin accounts and tenant exist."""
    db = SessionLocal()
    try:
        tenant = db.query(Tenant).filter(Tenant.slug == "onduty").first()
        if not tenant:
            tenant = create_tenant(
                db,
                name="OnDuty Platform",
                plan_type="platform",
                slug="onduty",
                billing_status="active",
                trial_mode="no_trial",
                is_special_permissioned=True,
                card_required=False,
            )

        for email, temp_password in SUPER_ADMIN_EMAILS.items():
            normalized_email = email.strip().lower()
            user = db.query(User).filter(User.email == normalized_email).first()
            if not user:
                user = User(
                    tenant_id=tenant.id,
                    email=normalized_email,
                    hashed_password=hash_password(temp_password),
                    role="SUPER_ADMIN",
                    is_active=True,
                    email_verified=True,
                    email_verified_at=datetime.utcnow(),
                )
                db.add(user)
                db.commit()
                db.refresh(user)
            else:
                updated = False
                if user.role != "SUPER_ADMIN":
                    user.role = "SUPER_ADMIN"
                    updated = True
                if not user.is_active:
                    user.is_active = True
                    updated = True
                if not user.email_verified:
                    user.email_verified = True
                    user.email_verified_at = datetime.utcnow()
                    updated = True
                if updated:
                    db.add(user)
                    db.commit()
    except Exception:
        logger.exception("Failed to ensure super admin users")
        raise
    finally:
        db.close()
