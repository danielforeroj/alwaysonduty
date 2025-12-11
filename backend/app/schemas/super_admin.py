from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class Pagination(BaseModel):
    total: int
    page: int
    page_size: int


class OverviewMetrics(BaseModel):
    total_tenants: int
    total_users: int
    total_agents: int
    total_conversations: int
    recent_tenants: List[str] = Field(default_factory=list)
    recent_users: List[str] = Field(default_factory=list)


class TenantListItem(BaseModel):
    id: UUID
    name: str
    slug: str
    plan_type: str
    billing_status: str
    trial_mode: Optional[str] = None
    trial_ends_at: Optional[datetime] = None
    is_special_permissioned: bool = False
    trial_days_override: Optional[int] = None
    card_required: Optional[bool] = None
    created_at: datetime

    class Config:
        orm_mode = True


class TenantListResponse(BaseModel):
    items: List[TenantListItem]
    pagination: Pagination


class TenantDetail(TenantListItem):
    agent_count: int = 0
    user_count: int = 0
    total_conversations: int = 0
    total_messages: int = 0


class TenantUpdateRequest(BaseModel):
    is_special_permissioned: Optional[bool] = None
    trial_days_override: Optional[int] = None
    card_required: Optional[bool] = None


class UserListItem(BaseModel):
    id: UUID
    email: EmailStr
    role: str
    tenant_id: UUID
    tenant_name: str
    is_active: bool
    created_at: datetime
    last_login: Optional[datetime] = None
    email_verified: bool = False

    class Config:
        orm_mode = True


class UserListResponse(BaseModel):
    items: List[UserListItem]
    pagination: Pagination


class CreateUserRequest(BaseModel):
    email: EmailStr
    role: str
    tenant_id: UUID
    temporary_password: Optional[str] = None


class UpdateUserRequest(BaseModel):
    role: Optional[str] = None
    is_active: Optional[bool] = None


class AgentListItem(BaseModel):
    id: UUID
    name: str
    agent_type: Optional[str]
    tenant_id: UUID
    tenant_name: str
    status: str
    created_at: datetime
    last_active_at: Optional[datetime] = None

    class Config:
        orm_mode = True


class AgentListResponse(BaseModel):
    items: List[AgentListItem]
    pagination: Pagination


class AgentDetail(AgentListItem):
    total_conversations: int = 0
    total_messages: int = 0


class UpdateAgentRequest(BaseModel):
    status: Optional[str] = None
