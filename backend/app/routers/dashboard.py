from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.conversation import Conversation
from app.models.customer import Customer
from app.models.channel_identity import ChannelIdentity
from app.models.user import User
from app.schemas.dashboard import TenantDashboardResponse, TenantLimits, TenantUsage
from app.services.plan_limits import PLAN_LIMITS
from app.utils.dependencies import get_current_user, get_db

router = APIRouter()


@router.get("/me", response_model=TenantDashboardResponse)
def get_tenant_dashboard(
    db: Session = Depends(get_db), current_user=Depends(get_current_user)
):
    tenant = current_user.tenant
    plan_type = (tenant.plan_type or "starter").lower()
    limits_data = PLAN_LIMITS.get(plan_type, PLAN_LIMITS["starter"])

    tenant_id = tenant.id
    conversations_count = (
        db.query(func.count(Conversation.id))
        .filter(Conversation.tenant_id == tenant_id)
        .scalar()
    )
    customers_count = (
        db.query(func.count(Customer.id)).filter(Customer.tenant_id == tenant_id).scalar()
    )
    channels_count = (
        db.query(func.count(ChannelIdentity.id))
        .filter(ChannelIdentity.tenant_id == tenant_id)
        .scalar()
    )
    seats_count = db.query(func.count(User.id)).filter(User.tenant_id == tenant_id).scalar()

    limits = TenantLimits(**limits_data)
    usage = TenantUsage(
        conversations=conversations_count or 0,
        customers=customers_count or 0,
        channels=channels_count or 0,
        seats=seats_count or 0,
    )

    return TenantDashboardResponse(
        tenant_name=tenant.name,
        plan_type=tenant.plan_type,
        billing_status=tenant.billing_status,
        trial_ends_at=tenant.trial_ends_at,
        limits=limits,
        usage=usage,
    )
