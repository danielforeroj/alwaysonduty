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
from app.models.customer import Customer
from app.models.message import Message
from app.models.tenant import Tenant
from app.models.user import User
from app.schemas.auth import RequestPasswordReset
from app.schemas.super_admin import (
    AgentDetail,
    AgentListItem,
    AgentListResponse,
    CreateTenantRequest,
    CreateUserRequest,
    ChatUserDetail,
    ChatUserListItem,
    ChatUserListResponse,
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
from app.services.tenant_service import create_tenant as create_tenant_service
from app.utils.dependencies import get_db, require_super_admin
from app.utils.security import hash_password

router = APIRouter(prefix="", tags=["super-admin"])
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
    try:
        total_tenants = db.query(func.count(Tenant.id)).scalar() or 0
        total_users = db.query(func.count(User.id)).scalar() or 0
        total_agents = db.query(func.count(Agent.id)).scalar() or 0
        total_conversations = db.query(func.count(Conversation.id)).scalar() or 0

        recent_tenants = [
            t.name for t in db.query(Tenant).order_by(Tenant.created_at.desc()).limit(5)
        ]
        recent_users = [
            u.email for u in db.query(User).order_by(User.created_at.desc()).limit(5)
        ]

        return OverviewMetrics(
            total_tenants=total_tenants,
            total_users=total_users,
            total_agents=total_agents,
            total_conversations=total_conversations,
            recent_tenants=recent_tenants,
            recent_users=recent_users,
        )
    except Exception:
        logger.exception("Failed to compute super admin overview metrics")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to load overview metrics",
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
    try:
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
        tenant_ids = [t.id for t in items]

        agent_counts = {
            tenant_id: count
            for tenant_id, count in db.query(Agent.tenant_id, func.count(Agent.id))
            .filter(Agent.tenant_id.in_(tenant_ids))
            .group_by(Agent.tenant_id)
            .all()
        }

        user_counts = {
            tenant_id: count
            for tenant_id, count in db.query(User.tenant_id, func.count(User.id))
            .filter(User.tenant_id.in_(tenant_ids))
            .group_by(User.tenant_id)
            .all()
        }

        owners: dict[UUID, Optional[User]] = {}
        if tenant_ids:
            for u in (
                db.query(User)
                .filter(User.tenant_id.in_(tenant_ids), User.role == "TENANT_ADMIN")
                .order_by(User.tenant_id, User.created_at.asc())
                .all()
            ):
                if u.tenant_id not in owners:
                    owners[u.tenant_id] = u

            missing_owner_ids = [tid for tid in tenant_ids if tid not in owners]
            if missing_owner_ids:
                for u in (
                    db.query(User)
                    .filter(User.tenant_id.in_(missing_owner_ids))
                    .order_by(User.tenant_id, User.created_at.asc())
                    .all()
                ):
                    if u.tenant_id not in owners:
                        owners[u.tenant_id] = u

        payload_items = [
            TenantListItem(
                id=t.id,
                owner_name=(owners.get(t.id).name if owners.get(t.id) else None),
                owner_email=(owners.get(t.id).email if owners.get(t.id) else None),
                name=t.name,
                slug=t.slug,
                plan_type=t.plan_type,
                billing_status=t.billing_status,
                trial_mode=t.trial_mode,
                trial_ends_at=t.trial_ends_at,
                is_special_permissioned=t.is_special_permissioned,
                trial_days_override=t.trial_days_override,
                card_required=t.card_required,
                created_at=t.created_at,
                agent_count=agent_counts.get(t.id, 0),
                user_count=user_counts.get(t.id, 0),
            )
            for t in items
        ]
        return TenantListResponse(
            items=payload_items, pagination={"total": total, "page": page, "page_size": page_size}
        )
    except Exception:
        logger.exception("Failed to list tenants")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to list tenants"
        )


@router.post("/tenants", response_model=TenantDetail, status_code=status.HTTP_201_CREATED)
def create_tenant_super_admin(
    payload: CreateTenantRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    normalized_email = payload.contact_email.strip().lower()
    existing = db.query(User).filter(User.email == normalized_email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists")

    tenant = create_tenant_service(
        db=db,
        name=payload.name,
        plan_type=payload.plan_type,
        slug=payload.slug,
        trial_mode=payload.trial_mode,
        billing_status=payload.billing_status or "trial",
        is_special_permissioned=payload.is_special_permissioned,
        trial_days_override=payload.trial_days_override,
        card_required=payload.card_required,
    )

    user = User(
        tenant_id=tenant.id,
        email=normalized_email,
        name=payload.contact_name,
        hashed_password=hash_password(payload.contact_password),
        role="TENANT_ADMIN",
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    verification_token = auth_service._create_email_verification_token(db, user)  # type: ignore[attr-defined]
    background_tasks.add_task(email_service.send_account_creation_email, user, tenant)
    background_tasks.add_task(
        email_service.send_email_verification_email,
        user,
        verification_token.token,
        settings.frontend_base_url,
    )

    agent_count = db.query(func.count(Agent.id)).filter(Agent.tenant_id == tenant.id).scalar() or 0
    user_count = db.query(func.count(User.id)).filter(User.tenant_id == tenant.id).scalar() or 0
    total_conversations = (
        db.query(func.count(Conversation.id)).filter(Conversation.tenant_id == tenant.id).scalar() or 0
    )
    total_messages = (
        db.query(func.count(Message.id))
        .join(Conversation, Message.conversation_id == Conversation.id)
        .filter(Conversation.tenant_id == tenant.id)
        .scalar()
        or 0
    )
    primary_user = (
        db.query(User).filter(User.tenant_id == tenant.id).order_by(User.created_at.asc()).first()
    )

    detail = TenantDetail.from_orm(tenant)
    detail.agent_count = agent_count
    detail.user_count = user_count
    detail.total_conversations = total_conversations
    detail.total_messages = total_messages
    detail.primary_contact_email = primary_user.email if primary_user else None
    detail.owner_name = primary_user.name if primary_user else None
    detail.owner_email = primary_user.email if primary_user else None
    return detail


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

    primary_user = (
        db.query(User)
        .filter(User.tenant_id == tenant_id, User.role == "TENANT_ADMIN")
        .order_by(User.created_at.asc())
        .first()
    )
    if not primary_user:
        primary_user = (
            db.query(User).filter(User.tenant_id == tenant_id).order_by(User.created_at.asc()).first()
        )

    detail = TenantDetail.from_orm(tenant)
    detail.agent_count = agent_count
    detail.user_count = user_count
    detail.total_conversations = total_conversations
    detail.total_messages = total_messages
    detail.primary_contact_email = primary_user.email if primary_user else None
    detail.owner_name = primary_user.name if primary_user else None
    detail.owner_email = primary_user.email if primary_user else None
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

    if payload.plan_type is not None:
        tenant.plan_type = payload.plan_type

    if payload.billing_status is not None:
        tenant.billing_status = payload.billing_status

    if payload.trial_mode is not None:
        tenant.trial_mode = payload.trial_mode

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
    try:
        query = db.query(User, Tenant.name.label("tenant_name")).join(Tenant, Tenant.id == User.tenant_id)
        if search:
            term = f"%{search.lower()}%"
            query = query.filter(func.lower(User.email).like(term))
        if role:
            query = query.filter(User.role == role)
        if tenant_id:
            query = query.filter(User.tenant_id == tenant_id)

        total = query.count()
        rows = (
            query.order_by(User.created_at.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
            .all()
        )
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
        return UserListResponse(
            items=items, pagination={"total": total, "page": page, "page_size": page_size}
        )
    except Exception:
        logger.exception("Failed to list users")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to list users"
        )


@router.get("/users/{user_id}", response_model=UserListItem)
def get_user(
    user_id: UUID,
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
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


@router.get("/chat-users", response_model=ChatUserListResponse)
def list_chat_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    tenant_id: Optional[UUID] = None,
    search: Optional[str] = None,
    source: Optional[str] = None,
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    try:
        query = db.query(Customer, Tenant.name.label("tenant_name")).join(
            Tenant, Tenant.id == Customer.tenant_id
        )
        if tenant_id:
            query = query.filter(Customer.tenant_id == tenant_id)
        if search:
            term = f"%{search.lower()}%"
            query = query.filter(func.lower(Customer.email).like(term))
        if source:
            query = query.filter(Customer.source == source)

        total = query.count()
        rows = (
            query.order_by(Customer.created_at.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
            .all()
        )

        customer_ids = [row.Customer.id for row in rows]
        conversation_counts = {}
        message_counts = {}
        if customer_ids:
            conversation_counts = {
                cid: count
                for cid, count in db.query(Conversation.customer_id, func.count(Conversation.id))
                .filter(Conversation.customer_id.in_(customer_ids))
                .group_by(Conversation.customer_id)
                .all()
            }
            message_counts = {
                cid: count
                for cid, count in db.query(Conversation.customer_id, func.count(Message.id))
                .join(Message, Message.conversation_id == Conversation.id)
                .filter(Conversation.customer_id.in_(customer_ids))
                .group_by(Conversation.customer_id)
                .all()
            }

        items = [
            ChatUserListItem(
                id=row.Customer.id,
                tenant_id=row.Customer.tenant_id,
                tenant_name=row.tenant_name,
                first_name=row.Customer.first_name,
                last_name=row.Customer.last_name,
                email=row.Customer.email,
                phone=row.Customer.primary_phone,
                source=row.Customer.source,
                created_at=row.Customer.created_at,
                last_seen_at=row.Customer.last_seen_at,
                total_conversations=conversation_counts.get(row.Customer.id, 0),
                total_messages=message_counts.get(row.Customer.id, 0),
            )
            for row in rows
        ]
        return ChatUserListResponse(
            items=items, pagination={"total": total, "page": page, "page_size": page_size}
        )
    except Exception:
        logger.exception("Failed to list chat users")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to list chat users",
        )


@router.get("/chat-users/{chat_user_id}", response_model=ChatUserDetail)
def get_chat_user(
    chat_user_id: UUID,
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    try:
        row = (
            db.query(Customer, Tenant.name.label("tenant_name"))
            .join(Tenant, Tenant.id == Customer.tenant_id)
            .filter(Customer.id == chat_user_id)
            .first()
        )
        if not row:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat user not found")

        conversations = (
            db.query(
                Conversation.id,
                Conversation.started_at,
                Conversation.agent_type,
                Conversation.agent_id,
                Agent.name.label("agent_name"),
                func.count(Message.id).label("message_count"),
                func.max(Message.created_at).label("last_message_at"),
            )
            .outerjoin(Agent, Agent.id == Conversation.agent_id)
            .outerjoin(Message, Message.conversation_id == Conversation.id)
            .filter(Conversation.customer_id == chat_user_id)
            .group_by(
                Conversation.id,
                Conversation.started_at,
                Conversation.agent_type,
                Conversation.agent_id,
                Agent.name,
            )
            .order_by(Conversation.started_at.desc())
            .all()
        )

        message_total = sum(conv.message_count or 0 for conv in conversations)

        return ChatUserDetail(
            id=row.Customer.id,
            tenant_id=row.Customer.tenant_id,
            tenant_name=row.tenant_name,
            first_name=row.Customer.first_name,
            last_name=row.Customer.last_name,
            email=row.Customer.email,
            phone=row.Customer.primary_phone,
            source=row.Customer.source,
            created_at=row.Customer.created_at,
            last_seen_at=row.Customer.last_seen_at,
            total_conversations=len(conversations),
            total_messages=message_total,
            conversations=[
                {
                    "id": conv.id,
                    "agent_name": conv.agent_name,
                    "agent_type": conv.agent_type,
                    "created_at": conv.started_at,
                    "message_count": conv.message_count or 0,
                    "last_message_at": conv.last_message_at,
                }
                for conv in conversations
            ],
        )
    except HTTPException:
        raise
    except Exception:
        logger.exception("Failed to load chat user")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to load chat user")


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
