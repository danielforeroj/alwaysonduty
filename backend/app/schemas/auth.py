from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr


class SignupRequest(BaseModel):
    name: str
    business_name: str
    email: EmailStr
    password: str
    plan_type: str = "starter"
    trial_mode: Optional[str] = "with_card"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TenantInfo(BaseModel):
    id: UUID
    name: str
    slug: str
    plan_type: str
    billing_status: Optional[str] = None
    trial_mode: Optional[str] = None
    trial_ends_at: Optional[datetime] = None

    class Config:
        orm_mode = True


class UserInfo(BaseModel):
    id: UUID
    email: EmailStr
    role: str
    tenant_id: UUID
    created_at: datetime

    class Config:
        orm_mode = True


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    tenant: TenantInfo
    user: UserInfo
