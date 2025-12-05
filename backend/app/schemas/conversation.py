from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel


class MessageOut(BaseModel):
    id: UUID
    sender: str
    text: str
    metadata: Optional[str] = None
    created_at: datetime

    class Config:
        orm_mode = True


class ConversationOut(BaseModel):
    id: UUID
    channel: str
    agent_type: str
    status: str
    started_at: datetime
    ended_at: Optional[datetime]
    customer_id: UUID

    class Config:
        orm_mode = True


class ConversationDetail(ConversationOut):
    messages: List[MessageOut] = []
