from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class TenantLimits(BaseModel):
    conversations: int
    brands: int
    seats: int
    channels: int


class TenantUsage(BaseModel):
    conversations: int
    customers: int
    channels: int
    seats: int


class TenantDashboardResponse(BaseModel):
    tenant_name: str
    plan_type: str
    billing_status: Optional[str]
    trial_ends_at: Optional[datetime]
    limits: TenantLimits
    usage: TenantUsage

    class Config:
        orm_mode = True
