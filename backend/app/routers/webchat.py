from typing import Optional
from datetime import datetime

from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.models.agent import Agent
from app.models.customer import Customer
from app.models.tenant import Tenant
from app.config import get_settings
from app.services import ai_service, conversation_service, customer_service
from app.services.tenant_service import ensure_demo_tenant, get_tenant_by_slug
from app.utils import security
from app.utils.dependencies import get_db

router = APIRouter()
settings = get_settings()


class WebChatRequest(BaseModel):
    tenant_slug: Optional[str] = None
    agent_slug: Optional[str] = None
    channel: str = "web"
    session_id: str
    text: str
    end_user_token: Optional[str] = None


@router.post("/send")
def send_message(payload: WebChatRequest, db: Session = Depends(get_db)):
    tenant: Optional[Tenant] = None
    agent: Optional[Agent] = None

    if payload.agent_slug:
        agent = (
            db.query(Agent)
            .filter(Agent.slug == payload.agent_slug, Agent.status != "disabled")
            .first()
        )
        if not agent:
            raise HTTPException(status_code=404, detail="Agent not found")

        tenant = db.query(Tenant).filter(Tenant.id == agent.tenant_id).first()
        if not tenant:
            raise HTTPException(status_code=404, detail="Tenant not found")

        agent_type = agent.agent_type or "customer_service"
    else:
        if not payload.tenant_slug:
            raise HTTPException(status_code=400, detail="tenant_slug or agent_slug is required")

        tenant = get_tenant_by_slug(db, payload.tenant_slug)
        if not tenant and payload.tenant_slug == settings.demo_tenant_slug:
            tenant = ensure_demo_tenant(db)
        if not tenant:
            raise HTTPException(status_code=404, detail="Tenant not found")

        agent_type = "customer_service"

    customer = None
    if payload.end_user_token:
        data = security.decode_token(payload.end_user_token)
        if not data or data.get("tenant_id") != str(tenant.id):
            raise HTTPException(status_code=401, detail="Invalid end-user token")
        customer = db.query(Customer).filter_by(id=data.get("customer_id")).first()
        if not customer:
            raise HTTPException(status_code=401, detail="Customer not found")

    if not customer:
        customer = customer_service.get_or_create_customer(
            db, tenant_id=tenant.id, channel=payload.channel, external_id=payload.session_id
        )

    customer.last_seen_at = datetime.utcnow()
    db.add(customer)
    db.commit()

    conversation = conversation_service.create_conversation(
        db, tenant_id=tenant.id, customer_id=customer.id, channel=payload.channel, agent_type=agent_type
    )

    user_message = conversation_service.add_message(db, conversation_id=conversation.id, sender="user", text=payload.text)
    reply_text = ai_service.generate_reply(
        tenant,
        conversation.agent_type,
        [payload.text],
        agent=agent,
    )
    ai_message = conversation_service.add_message(db, conversation_id=conversation.id, sender="ai", text=reply_text)

    return {
        "reply": reply_text,
        "conversation_id": str(conversation.id),
        "customer_id": str(customer.id),
    }
