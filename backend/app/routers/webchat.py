from typing import Optional

from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.models.agent import Agent
from app.models.tenant import Tenant
from app.services import ai_service, conversation_service, customer_service
from app.services.tenant_service import get_tenant_by_slug
from app.utils.dependencies import get_db

router = APIRouter()


class WebChatRequest(BaseModel):
    tenant_slug: Optional[str] = None
    agent_slug: Optional[str] = None
    channel: str = "web"
    session_id: str
    text: str


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
        if not tenant:
            raise HTTPException(status_code=404, detail="Tenant not found")

        agent_type = "customer_service"

    customer = customer_service.get_or_create_customer(
        db, tenant_id=tenant.id, channel=payload.channel, external_id=payload.session_id
    )

    conversation = conversation_service.create_conversation(
        db, tenant_id=tenant.id, customer_id=customer.id, channel=payload.channel, agent_type=agent_type
    )

    user_message = conversation_service.add_message(db, conversation_id=conversation.id, sender="user", text=payload.text)
    reply_text = ai_service.generate_reply(tenant, conversation.agent_type, [payload.text])
    ai_message = conversation_service.add_message(db, conversation_id=conversation.id, sender="ai", text=reply_text)

    return {
        "reply": reply_text,
        "conversation_id": str(conversation.id),
        "customer_id": str(customer.id),
    }
