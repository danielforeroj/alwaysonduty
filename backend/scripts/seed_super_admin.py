from datetime import datetime

from app.db import SessionLocal
from app.models.tenant import Tenant
from app.models.user import User
from app.services.tenant_service import create_tenant
from app.utils.security import hash_password

SUPER_ADMIN_EMAILS = {
    "hello@danielforeroj.com": "Pepito",
    "danielforero2017@gmail.com": "Janice2018",
}


def seed_super_admin():
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
            user = db.query(User).filter(User.email == email).first()
            if not user:
                user = User(
                    tenant_id=tenant.id,
                    email=email,
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
                if not user.email_verified:
                    user.email_verified = True
                    user.email_verified_at = datetime.utcnow()
                    updated = True
                if updated:
                    db.add(user)
                    db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed_super_admin()
