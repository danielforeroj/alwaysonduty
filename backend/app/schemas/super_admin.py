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
    owner_name: Optional[str] = None
    owner_email: Optional[str] = None
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
    agent_count: int = 0
    user_count: int = 0

    class Config:
        orm_mode = True


class TenantListResponse(BaseModel):
    items: List[TenantListItem]
    pagination: Pagination


class TenantDetail(TenantListItem):
    total_conversations: int = 0
    total_messages: int = 0
    primary_contact_email: Optional[str] = None


class TenantUpdateRequest(BaseModel):
    plan_type: Optional[str] = None
    billing_status: Optional[str] = None  # trial, active, paused, cancelled
    trial_mode: Optional[str] = None
    is_special_permissioned: Optional[bool] = None
    trial_days_override: Optional[int] = None
    card_required: Optional[bool] = None


class CreateTenantRequest(BaseModel):
    name: str = Field(..., min_length=2)
    plan_type: str = "basic"
    slug: Optional[str] = None
    trial_mode: Optional[str] = "no_card"
    trial_days_override: Optional[int] = None
    is_special_permissioned: bool = True
    card_required: Optional[bool] = False
    billing_status: Optional[str] = "trial"
    contact_name: Optional[str] = None
    contact_email: EmailStr
    contact_password: str = Field(..., min_length=6)


class UserListItem(BaseModel):
    id: UUID
    email: str
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


class ChatUserListItem(BaseModel):
    id: UUID
    tenant_id: UUID
    tenant_name: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    source: Optional[str] = None
    created_at: datetime
    last_seen_at: Optional[datetime] = None
    total_conversations: int = 0
    total_messages: int = 0

    class Config:
        orm_mode = True


class ChatUserListResponse(BaseModel):
    items: List[ChatUserListItem]
    pagination: Pagination


class ChatUserConversation(BaseModel):
    id: UUID
    agent_name: Optional[str] = None
    agent_type: Optional[str] = None
    created_at: datetime
    message_count: int = 0
    last_message_at: Optional[datetime] = None


class ChatUserDetail(ChatUserListItem):
    conversations: List[ChatUserConversation] = Field(default_factory=list)


class UnifiedUserListItem(BaseModel):
    id: UUID
    user_type: str  # "platform" or "chat"
    tenant_id: Optional[UUID] = None
    tenant_name: Optional[str] = None

    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

    role: Optional[str] = None
    is_active: Optional[bool] = None
    email_verified: Optional[bool] = None
    last_login: Optional[datetime] = None

    source: Optional[str] = None
    last_seen_at: Optional[datetime] = None

    created_at: datetime

    class Config:
        orm_mode = True


class UnifiedUserListResponse(BaseModel):
    items: List[UnifiedUserListItem]
    pagination: Pagination
