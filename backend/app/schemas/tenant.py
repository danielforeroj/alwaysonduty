from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class TenantBase(BaseModel):
    name: str
    slug: str
    plan_type: str


class TenantCreate(BaseModel):
    name: str
    slug: str
    plan_type: str = "starter"


class TenantOut(TenantBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
