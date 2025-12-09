from datetime import datetime, timedelta
from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.channel_identity import ChannelIdentity
from app.models.conversation import Conversation
from app.models.customer import Customer
from app.models.message import Message
from app.models.user import User
from app.schemas.dashboard import (
    ChannelBreakdown,
    DashboardBreakdown,
    DashboardMetricsResponse,
    DashboardTimeseries,
    PlanDetails,
    UsageMetrics,
)
from app.services.plan_limits import get_plan_limits
from app.utils.dependencies import get_current_user, get_db

router = APIRouter()


def _start_of_current_month() -> datetime:
    now = datetime.utcnow()
    return now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)


@router.get("/metrics", response_model=DashboardMetricsResponse)
def get_dashboard_metrics(
    db: Session = Depends(get_db), current_user=Depends(get_current_user)
):
    tenant = current_user.tenant
    plan_type = (tenant.plan_type or "starter").lower()
    limits = get_plan_limits(plan_type)

    start_month = _start_of_current_month()
    start_30_days = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0) - timedelta(
        days=29
    )

    tenant_id = tenant.id

    current_month_conversations = (
        db.query(func.count(Conversation.id))
        .filter(
            Conversation.tenant_id == tenant_id,
            Conversation.started_at >= start_month,
        )
        .scalar()
        or 0
    )

    current_month_messages = (
        db.query(func.count(Message.id))
        .join(Conversation, Message.conversation_id == Conversation.id)
        .filter(
            Conversation.tenant_id == tenant_id,
            Message.created_at >= start_month,
        )
        .scalar()
        or 0
    )

    customers_count = (
        db.query(func.count(Customer.id)).filter(Customer.tenant_id == tenant_id).scalar() or 0
    )

    connected_channels_count = (
        db.query(func.count(ChannelIdentity.id))
        .filter(ChannelIdentity.tenant_id == tenant_id)
        .scalar()
        or 0
    )

    seats_used = db.query(func.count(User.id)).filter(User.tenant_id == tenant_id).scalar() or 0

    daily_rows: List[tuple] = (
        db.query(func.date(Conversation.started_at), func.count(Conversation.id))
        .filter(
            Conversation.tenant_id == tenant_id,
            Conversation.started_at >= start_30_days,
        )
        .group_by(func.date(Conversation.started_at))
        .order_by(func.date(Conversation.started_at))
        .all()
    )
    daily_conversations_last_30_days = [
        {"date": row[0], "count": row[1]} for row in daily_rows
    ]

    channel_rows: List[tuple] = (
        db.query(Conversation.channel, func.count(Conversation.id))
        .filter(Conversation.tenant_id == tenant_id)
        .group_by(Conversation.channel)
        .all()
    )
    conversations_by_channel = [
        ChannelBreakdown(channel=row[0], count=row[1]) for row in channel_rows
    ]

    plan = PlanDetails(
        name=plan_type,
        billing_status=tenant.billing_status,
        trial_ends_at=tenant.trial_ends_at,
        monthly_conversations_limit=limits["monthly_conversations_limit"],
        brands_limit=limits["brands_limit"],
        seats_included=limits["seats_included"],
        channels_included=limits["channels_included"],
    )

    usage = UsageMetrics(
        current_month_conversations=current_month_conversations,
        current_month_messages=current_month_messages,
        customers_count=customers_count,
        connected_channels_count=connected_channels_count,
        seats_used=seats_used,
    )

    timeseries = DashboardTimeseries(
        daily_conversations_last_30_days=daily_conversations_last_30_days
    )

    breakdown = DashboardBreakdown(conversations_by_channel=conversations_by_channel)

    return DashboardMetricsResponse(
        plan=plan,
        usage=usage,
        timeseries=timeseries,
        breakdown=breakdown,
    )
