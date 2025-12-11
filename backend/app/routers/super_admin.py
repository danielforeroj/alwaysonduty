import logging
import secrets
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.config import get_settings
from app.models.agent import Agent
from app.models.conversation import Conversation
from app.models.message import Message
from app.models.tenant import Tenant
from app.models.user import User
from app.schemas.auth import RequestPasswordReset
from app.schemas.super_admin import (
    AgentDetail,
    AgentListItem,
    AgentListResponse,
    CreateUserRequest,
    OverviewMetrics,
    TenantDetail,
    TenantListItem,
    TenantListResponse,
    TenantUpdateRequest,
    UpdateAgentRequest,
    UpdateUserRequest,
    UserListItem,
    UserListResponse,
)
from app.services import auth_service, email_service
from app.utils.dependencies import get_db, require_super_admin
from app.utils.security import hash_password

router = APIRouter(prefix="/super-admin", tags=["super-admin"])
logger = logging.getLogger(__name__)
settings = get_settings()


def _paginate(query, page: int, page_size: int):
    total = query.count()
    items = query.offset((page - 1) * page_size).limit(page_size).all()
    return items, total


@router.post("/request-password-reset")
def request_super_admin_password_reset(
    payload: RequestPasswordReset,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    normalized_email = payload.email.strip().lower()
    user, token = auth_service.request_password_reset(
        db, normalized_email, allowed_roles={"SUPER_ADMIN"}
    )
    if not user:
        logger.warning(
            "Super admin password reset requested for non-existing or non-super-admin email: %s",
            normalized_email,
        )
    if user and token:
        background_tasks.add_task(
            email_service.send_password_reset_email,
            user,
            token,
            settings.frontend_base_url,
            "super-admin/reset-password",
        )
    return {"detail": "If that super admin email exists, a reset link has been sent."}


@router.get("/overview", response_model=OverviewMetrics)
def get_overview(db: Session = Depends(get_db), _: User = Depends(require_super_admin)):
    total_tenants = db.query(func.count(Tenant.id)).scalar() or 0
    total_users = db.query(func.count(User.id)).scalar() or 0
    total_agents = db.query(func.count(Agent.id)).scalar() or 0
    total_conversations = db.query(func.count(Conversation.id)).scalar() or 0

    recent_tenants = [t.name for t in db.query(Tenant).order_by(Tenant.created_at.desc()).limit(5)]
    recent_users = [u.email for u in db.query(User).order_by(User.created_at.desc()).limit(5)]

    return OverviewMetrics(
        total_tenants=total_tenants,
        total_users=total_users,
        total_agents=total_agents,
        total_conversations=total_conversations,
        recent_tenants=recent_tenants,
        recent_users=recent_users,
    )


@router.get("/tenants", response_model=TenantListResponse)
def list_tenants(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = Query(None, description="Filter by billing status"),
    plan: Optional[str] = Query(None, description="Filter by plan type"),
    special: Optional[bool] = Query(None, description="Filter special permissioned"),
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    query = db.query(Tenant)
    if search:
        term = f"%{search.lower()}%"
        query = query.filter(func.lower(Tenant.name).like(term) | func.lower(Tenant.slug).like(term))
    if status:
        query = query.filter(Tenant.billing_status == status)
    if plan:
        query = query.filter(Tenant.plan_type == plan)
    if special is not None:
        query = query.filter(Tenant.is_special_permissioned == special)

    items, total = _paginate(query.order_by(Tenant.created_at.desc()), page, page_size)
    payload = [TenantListItem.from_orm(t) for t in items]
    return TenantListResponse(items=payload, pagination={"total": total, "page": page, "page_size": page_size})


@router.get("/tenants/{tenant_id}", response_model=TenantDetail)
def tenant_detail(
    tenant_id: UUID,
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    if not tenant:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tenant not found")

    agent_count = db.query(func.count(Agent.id)).filter(Agent.tenant_id == tenant_id).scalar() or 0
    user_count = db.query(func.count(User.id)).filter(User.tenant_id == tenant_id).scalar() or 0
    total_conversations = (
        db.query(func.count(Conversation.id)).filter(Conversation.tenant_id == tenant_id).scalar() or 0
    )
    total_messages = (
        db.query(func.count(Message.id))
        .join(Conversation, Message.conversation_id == Conversation.id)
        .filter(Conversation.tenant_id == tenant_id)
        .scalar()
        or 0
    )

    detail = TenantDetail.from_orm(tenant)
    detail.agent_count = agent_count
    detail.user_count = user_count
    detail.total_conversations = total_conversations
    detail.total_messages = total_messages
    return detail


@router.patch("/tenants/{tenant_id}", response_model=TenantDetail)
def update_tenant(
    tenant_id: UUID,
    payload: TenantUpdateRequest,
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    if not tenant:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tenant not found")

    if payload.is_special_permissioned is not None:
        tenant.is_special_permissioned = payload.is_special_permissioned
    if payload.trial_days_override is not None:
        tenant.trial_days_override = payload.trial_days_override
    if payload.card_required is not None:
        tenant.card_required = payload.card_required

    db.add(tenant)
    db.commit()
    db.refresh(tenant)
    return tenant_detail(tenant_id, db)


@router.get("/users", response_model=UserListResponse)
def list_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    role: Optional[str] = None,
    tenant_id: Optional[UUID] = None,
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    query = db.query(User, Tenant.name.label("tenant_name")).join(Tenant, Tenant.id == User.tenant_id)
    if search:
        term = f"%{search.lower()}%"
        query = query.filter(func.lower(User.email).like(term))
    if role:
        query = query.filter(User.role == role)
    if tenant_id:
        query = query.filter(User.tenant_id == tenant_id)

    total = query.count()
    rows = query.order_by(User.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
    items = [
        UserListItem(
            id=row.User.id,
            email=row.User.email,
            role=row.User.role,
            tenant_id=row.User.tenant_id,
            tenant_name=row.tenant_name,
            is_active=row.User.is_active,
            created_at=row.User.created_at,
            last_login=row.User.last_login,
            email_verified=row.User.email_verified,
        )
        for row in rows
    ]
    return UserListResponse(items=items, pagination={"total": total, "page": page, "page_size": page_size})


@router.post("/users", response_model=UserListItem, status_code=status.HTTP_201_CREATED)
def create_user(
    payload: CreateUserRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists")

    tenant = db.query(Tenant).filter(Tenant.id == payload.tenant_id).first()
    if not tenant:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tenant not found")

    hashed = hash_password(payload.temporary_password or secrets.token_urlsafe(8))
    user = User(
        tenant_id=tenant.id,
        email=payload.email.lower(),
        hashed_password=hashed,
        role=payload.role,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # send password reset/invite
    _, token = auth_service.request_password_reset(db, user.email)
    if token:
        background_tasks.add_task(
            email_service.send_password_reset_email, user, token, settings.frontend_base_url
        )

    return UserListItem(
        id=user.id,
        email=user.email,
        role=user.role,
        tenant_id=user.tenant_id,
        tenant_name=tenant.name,
        is_active=user.is_active,
        created_at=user.created_at,
        last_login=user.last_login,
        email_verified=user.email_verified,
    )


@router.patch("/users/{user_id}", response_model=UserListItem)
def update_user(
    user_id: UUID,
    payload: UpdateUserRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_super_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if payload.role and payload.role == "SUPER_ADMIN" and current_user.role != "SUPER_ADMIN":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only SUPER_ADMIN can promote users")

    if payload.role and user.role == "SUPER_ADMIN" and payload.role != "SUPER_ADMIN":
        super_count = db.query(func.count(User.id)).filter(User.role == "SUPER_ADMIN", User.is_active == True).scalar() or 0
        if super_count <= 1:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot remove the last SUPER_ADMIN")

    if payload.role:
        user.role = payload.role
    if payload.is_active is not None:
        user.is_active = payload.is_active

    db.add(user)
    db.commit()
    db.refresh(user)

    tenant = db.query(Tenant).filter(Tenant.id == user.tenant_id).first()
    return UserListItem(
        id=user.id,
        email=user.email,
        role=user.role,
        tenant_id=user.tenant_id,
        tenant_name=tenant.name if tenant else "",
        is_active=user.is_active,
        created_at=user.created_at,
        last_login=user.last_login,
        email_verified=user.email_verified,
    )


@router.get("/agents", response_model=AgentListResponse)
def list_agents(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    tenant_id: Optional[UUID] = None,
    agent_type: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    query = db.query(Agent, Tenant.name.label("tenant_name")).join(Tenant, Tenant.id == Agent.tenant_id)
    if tenant_id:
        query = query.filter(Agent.tenant_id == tenant_id)
    if agent_type:
        query = query.filter(Agent.agent_type == agent_type)
    if status:
        query = query.filter(Agent.status == status)

    total = query.count()
    rows = query.order_by(Agent.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
    items = [
        AgentListItem(
            id=row.Agent.id,
            name=row.Agent.name,
            agent_type=row.Agent.agent_type,
            tenant_id=row.Agent.tenant_id,
            tenant_name=row.tenant_name,
            status=row.Agent.status,
            created_at=row.Agent.created_at,
            last_active_at=None,
        )
        for row in rows
    ]
    return AgentListResponse(items=items, pagination={"total": total, "page": page, "page_size": page_size})


@router.get("/agents/{agent_id}", response_model=AgentDetail)
def get_agent(agent_id: UUID, db: Session = Depends(get_db), _: User = Depends(require_super_admin)):
    row = db.query(Agent, Tenant.name.label("tenant_name")).join(Tenant, Tenant.id == Agent.tenant_id).filter(Agent.id == agent_id).first()
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")

    total_conversations = (
        db.query(func.count(Conversation.id)).filter(Conversation.agent_id == agent_id).scalar() or 0
    )
    total_messages = (
        db.query(func.count(Message.id))
        .join(Conversation, Message.conversation_id == Conversation.id)
        .filter(Conversation.agent_id == agent_id)
        .scalar()
        or 0
    )

    detail = AgentDetail(
        id=row.Agent.id,
        name=row.Agent.name,
        agent_type=row.Agent.agent_type,
        tenant_id=row.Agent.tenant_id,
        tenant_name=row.tenant_name,
        status=row.Agent.status,
        created_at=row.Agent.created_at,
        last_active_at=None,
        total_conversations=total_conversations,
        total_messages=total_messages,
    )
    return detail


@router.patch("/agents/{agent_id}", response_model=AgentDetail)
def update_agent(
    agent_id: UUID,
    payload: UpdateAgentRequest,
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")

    if payload.status:
        agent.status = payload.status

    db.add(agent)
    db.commit()
    db.refresh(agent)

    return get_agent(agent_id, db)
