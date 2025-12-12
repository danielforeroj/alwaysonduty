from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class CustomerOut(BaseModel):
    id: UUID
    first_name: Optional[str]
    last_name: Optional[str]
    full_name: Optional[str]
    primary_phone: Optional[str]
    email: Optional[str]
    source: Optional[str]
    last_seen_at: Optional[datetime]
    created_at: datetime

    class Config:
        orm_mode = True
