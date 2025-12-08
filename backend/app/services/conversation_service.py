from typing import List, Optional, Tuple
from sqlalchemy.orm import Session

from app.models.conversation import Conversation
from app.models.message import Message


def create_conversation(db: Session, tenant_id, customer_id, channel: str, agent_type: str = "cs") -> Conversation:
    conversation = Conversation(
        tenant_id=tenant_id,
        customer_id=customer_id,
        channel=channel,
        agent_type=agent_type,
        status="open",
    )
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    return conversation


def add_message(db: Session, conversation_id, sender: str, text: str, meta: Optional[str] = None) -> Message:
    message = Message(conversation_id=conversation_id, sender=sender, text=text, meta=meta)
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


def list_conversations(db: Session, tenant_id, page: int = 1, page_size: int = 20) -> List[Conversation]:
    offset = (page - 1) * page_size
    return (
        db.query(Conversation)
        .filter(Conversation.tenant_id == tenant_id)
        .order_by(Conversation.started_at.desc())
        .offset(offset)
        .limit(page_size)
        .all()
    )


def get_conversation(db: Session, tenant_id, conversation_id) -> Optional[Conversation]:
    return (
        db.query(Conversation)
        .filter(Conversation.tenant_id == tenant_id, Conversation.id == conversation_id)
        .first()
    )
