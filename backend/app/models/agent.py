import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, String, JSON
from sqlalchemy.dialects.postgresql import UUID

from app.db import Base


class Agent(Base):
    __tablename__ = "agents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)

    name = Column(String(100), nullable=False)
    slug = Column(String(120), nullable=False, unique=True)

    status = Column(String(20), nullable=False, default="draft")  # draft | active | disabled
    # Type of agent: customer service vs sales
    agent_type = Column(
        String(20),
        nullable=False,
        default="customer_service",  # customer_service | sales
    )

    # For later: which provider/model this agent uses
    model_provider = Column(String(50), nullable=False, default="groq")
    model_name = Column(String(100), nullable=False, default="llama-3.1-70b")

    # How this agent is trained; we start with prompt-only
    training_mode = Column(
        String(30),
        nullable=False,
        default="prompt_only",  # prompt_only | sft | prompt_plus_sft
    )

    # Four forms, stored as JSON blobs
    job_and_company_profile = Column(JSON, nullable=False)   # step 1 (required)
    customer_profile = Column(JSON, nullable=False)          # step 2 (required)
    data_profile = Column(JSON, nullable=True)               # step 3 (optional)
    allowed_websites = Column(JSON, nullable=True)           # step 4 (optional)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )
