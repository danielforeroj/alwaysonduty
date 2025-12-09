from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class CustomerOut(BaseModel):
    id: UUID
    full_name: Optional[str]
    primary_phone: Optional[str]
    email: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True
