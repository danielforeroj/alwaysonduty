from typing import List, Literal, Optional
from uuid import UUID
from pydantic import BaseModel, HttpUrl, Field
from datetime import datetime


AgentType = Literal["customer_service", "sales"]


# ---------- Step 1: Job + Company ----------

class JobAndCompanyProfile(BaseModel):
    # Agent basics
    agent_name: str = Field(..., max_length=100)

    primary_goal: Literal[
        "reduce_support_load",
        "increase_sales",
        "qualify_leads",
        "internal_assistant",
        "other",
    ]
    primary_goal_other: Optional[str] = None

    success_metrics: List[
        Literal[
            "fewer_support_tickets",
            "more_calls_booked",
            "more_revenue_per_chat",
            "faster_response_times",
            "higher_csat",
            "other",
        ]
    ] = []
    success_metrics_other: Optional[str] = None

    # Environment – for now we only actually support web widget
    environment_primary: Literal["web_widget"]
    environment_future: List[
        Literal["whatsapp", "telegram", "email", "internal_tools"]
    ] = []

    # What the agent is allowed to do (powers/tools)
    allowed_actions: List[
        Literal[
            "answer_faqs",
            "capture_leads",
            "book_appointments_light",
            "take_simple_orders",
            "route_to_human",
            "tag_conversations",
        ]
    ] = []

    # Constraints / policies
    escalation_rules: str = ""  # when to escalate to human
    hard_constraints: str = ""  # e.g. no refunds above X, no medical/legal/financial advice

    # Company info
    company_name: str
    company_website: Optional[HttpUrl] = None
    industry: Optional[str] = None
    short_description: Optional[str] = None
    mission: Optional[str] = None
    vision: Optional[str] = None


# ---------- Step 2: Customers & Tone ----------

class CustomerSegment(BaseModel):
    name: str
    description: Optional[str] = None

class CustomerProfile(BaseModel):
    target_segments: List[CustomerSegment] = []
    regions: List[str] = []      # e.g. ["LATAM", "US & Canada"]
    countries: List[str] = []    # optional finer grain
    languages: List[str] = []    # ["es", "en", "pt"]

    tone_style: Literal[
        "very_formal",
        "professional_friendly",
        "casual_human",
        "playful",
        "bilingual",
    ]
    tone_notes: Optional[str] = None

    typical_intents: List[
        Literal[
            "pricing_questions",
            "booking_appointments",
            "technical_support",
            "order_status",
            "complaints",
            "product_recommendations",
            "other",
        ]
    ] = []
    typical_intents_other: Optional[str] = None

    cultural_dos: Optional[str] = None
    cultural_donts: Optional[str] = None


# ---------- Step 3: Data / Knowledge (optional) ----------

class DataProfile(BaseModel):
    strategy_notes: Optional[str] = None  # e.g. “Use FAQ + product catalog first”
    authoritative_doc_ids: List[UUID] = []
    out_of_date_notes: Optional[str] = None


# ---------- Documents (upload/list) ----------

class KnowledgeDocumentMetadata(BaseModel):
    id: UUID
    filename: str
    content_type: str
    size_bytes: int

    class Config:
        orm_mode = True


# ---------- Step 4: Allowed Websites (optional) ----------

class AllowedWebsite(BaseModel):
    url: HttpUrl
    label: Optional[str] = None
    trust_level: Literal["reference_only", "authoritative"] = "reference_only"


# ---------- Agent base + CRUD ----------

class AgentBase(BaseModel):
    name: str
    slug: Optional[str] = None
    status: Literal["draft", "active", "disabled"] = "draft"
    agent_type: AgentType = "customer_service"

    job_and_company_profile: JobAndCompanyProfile
    customer_profile: CustomerProfile
    data_profile: Optional[DataProfile] = None
    allowed_websites: Optional[List[AllowedWebsite]] = None


class AgentCreate(AgentBase):
    pass


class AgentUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    status: Optional[Literal["draft", "active", "disabled"]] = None
    agent_type: Optional[AgentType] = None

    job_and_company_profile: Optional[JobAndCompanyProfile] = None
    customer_profile: Optional[CustomerProfile] = None
    data_profile: Optional[DataProfile] = None
    allowed_websites: Optional[List[AllowedWebsite]] = None


class AgentResponse(AgentBase):
    id: UUID
    tenant_id: UUID
    model_provider: str
    model_name: str
    training_mode: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
