from datetime import timedelta
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.models.agent import Agent
from app.models.tenant import Tenant
from app.schemas.customer import CustomerOut
from app.services import verification_service
from app.services.tenant_service import ensure_demo_tenant, get_tenant_by_slug
from app.utils.dependencies import get_db
from app.utils.security import create_access_token, decode_token
from app.config import get_settings

router = APIRouter()
settings = get_settings()


class InitiateVerificationRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    tenant_slug: Optional[str] = None
    agent_slug: Optional[str] = None
    source: Optional[str] = "public_agent"


class InitiateVerificationResponse(BaseModel):
    verification_token: str
    customer_id: UUID


class ConfirmVerificationRequest(BaseModel):
    verification_token: str
    code: str


class ConfirmVerificationResponse(BaseModel):
    unlock_token: str
    customer: CustomerOut


def _resolve_tenant(db: Session, tenant_slug: Optional[str], agent_slug: Optional[str]) -> Tenant:
    tenant: Optional[Tenant] = None
    if agent_slug:
        agent = (
            db.query(Agent)
            .filter(Agent.slug == agent_slug, Agent.status != "disabled")
            .first()
        )
        if not agent:
            raise HTTPException(status_code=404, detail="Agent not found")
        tenant = db.query(Tenant).filter(Tenant.id == agent.tenant_id).first()
    elif tenant_slug:
        tenant = get_tenant_by_slug(db, tenant_slug)
        if not tenant and tenant_slug == settings.demo_tenant_slug:
            tenant = ensure_demo_tenant(db)
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    return tenant


@router.post("/initiate", response_model=InitiateVerificationResponse)
def initiate_verification(payload: InitiateVerificationRequest, db: Session = Depends(get_db)):
    tenant = _resolve_tenant(db, payload.tenant_slug, payload.agent_slug)

    verification, _, customer = verification_service.create_verification(
        db,
        tenant_id=tenant.id,
        email=payload.email,
        first_name=payload.first_name,
        last_name=payload.last_name,
        phone=payload.phone,
        source=payload.source,
    )

    token = create_access_token(
        {"verification_id": str(verification.id)}, expires_delta=timedelta(minutes=20)
    )

    return {"verification_token": token, "customer_id": customer.id}


@router.post("/confirm", response_model=ConfirmVerificationResponse)
def confirm_verification(payload: ConfirmVerificationRequest, db: Session = Depends(get_db)):
    data = decode_token(payload.verification_token)
    if not data or "verification_id" not in data:
        raise HTTPException(status_code=400, detail="Invalid verification token")

    customer = verification_service.validate_code(db, data["verification_id"], payload.code)
    if not customer:
        raise HTTPException(status_code=400, detail="Invalid or expired code")

    unlock_token = create_access_token(
        {
            "customer_id": str(customer.id),
            "tenant_id": str(customer.tenant_id),
            "scope": "end_user",
        },
        expires_delta=timedelta(hours=48),
    )

    return {"unlock_token": unlock_token, "customer": customer}
