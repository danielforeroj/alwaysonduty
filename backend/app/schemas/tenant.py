from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class TenantBase(BaseModel):
    name: str
    slug: str
    plan_type: str
    billing_status: Optional[str] = None
    trial_mode: Optional[str] = None
    trial_ends_at: Optional[datetime] = None


class TenantCreate(BaseModel):
    name: str
    slug: str
    plan_type: str = "basic"
    billing_status: Optional[str] = "trial"
    trial_mode: Optional[str] = None
    trial_ends_at: Optional[datetime] = None
    stripe_customer_id: Optional[str] = None
    stripe_subscription_id: Optional[str] = None


class TenantOut(TenantBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
