import hashlib
import os
from datetime import datetime, timedelta
from typing import Optional, Tuple

from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.models.end_user_verification import EndUserVerification
from app.services import customer_service, email_service

CODE_TTL_MINUTES = 15


def _hash_code(code: str) -> str:
    return hashlib.sha256(code.encode("utf-8")).hexdigest()


def _generate_code() -> str:
    return f"{int.from_bytes(os.urandom(2), 'big') % 10000:04d}"


def create_verification(
    db: Session,
    tenant_id,
    email: str,
    first_name: Optional[str],
    last_name: Optional[str],
    phone: Optional[str],
    source: Optional[str] = None,
) -> Tuple[EndUserVerification, str, Customer]:
    customer = customer_service.get_or_create_customer_by_email(
        db,
        tenant_id=tenant_id,
        email=email,
        first_name=first_name,
        last_name=last_name,
        phone=phone,
        source=source,
    )

    code = _generate_code()
    verification = EndUserVerification(
        customer_id=customer.id,
        code_hash=_hash_code(code),
        expires_at=datetime.utcnow() + timedelta(minutes=CODE_TTL_MINUTES),
    )
    db.add(verification)
    db.commit()
    db.refresh(verification)

    email_service.send_end_user_verification_code(customer, code)

    return verification, code, customer


def validate_code(db: Session, verification_id, code: str) -> Optional[Customer]:
    verification = (
        db.query(EndUserVerification)
        .filter(EndUserVerification.id == verification_id)
        .first()
    )
    if not verification:
        return None
    if verification.consumed_at or verification.expires_at < datetime.utcnow():
        return None

    if verification.code_hash != _hash_code(code):
        return None

    verification.consumed_at = datetime.utcnow()
    db.add(verification)
    db.commit()
    db.refresh(verification)
    return verification.customer
