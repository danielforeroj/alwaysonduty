from datetime import date, datetime
from typing import List, Optional

from pydantic import BaseModel


class PlanDetails(BaseModel):
    name: str
    billing_status: Optional[str]
    trial_ends_at: Optional[datetime]
    monthly_conversations_limit: int
    brands_limit: int
    seats_included: int
    channels_included: int


class UsageMetrics(BaseModel):
    current_month_conversations: int
    current_month_messages: int
    customers_count: int
    connected_channels_count: int
    seats_used: int


class DailyConversationCount(BaseModel):
    date: date
    count: int


class ChannelBreakdown(BaseModel):
    channel: str
    count: int


class DashboardTimeseries(BaseModel):
    daily_conversations_last_30_days: List[DailyConversationCount]


class DashboardBreakdown(BaseModel):
    conversations_by_channel: List[ChannelBreakdown]


class DashboardMetricsResponse(BaseModel):
    plan: PlanDetails
    usage: UsageMetrics
    timeseries: DashboardTimeseries
    breakdown: DashboardBreakdown

    class Config:
        orm_mode = True
