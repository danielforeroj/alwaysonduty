import uuid
from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.dialects.postgresql import UUID

from app.db import Base


class Tenant(Base):
    __tablename__ = "tenants"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False)
    plan_type = Column(String, default="basic", nullable=False)
    stripe_customer_id = Column(String, nullable=True)
    stripe_subscription_id = Column(String, nullable=True)
    billing_status = Column(String, default="trial", nullable=False)
    trial_mode = Column(String, nullable=True)
    trial_ends_at = Column(DateTime, nullable=True)
    is_special_permissioned = Column(Boolean, nullable=False, default=False)
    trial_days_override = Column(Integer, nullable=True)
    card_required = Column(Boolean, nullable=True, default=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
