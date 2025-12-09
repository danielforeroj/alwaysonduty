export type AgentStatus = "draft" | "active" | "disabled";

export interface JobAndCompanyProfile {
  agent_name: string;
  primary_goal:
    | "reduce_support_load"
    | "increase_sales"
    | "qualify_leads"
    | "internal_assistant"
    | "other";
  primary_goal_other?: string | null;

  success_metrics: (
    | "fewer_support_tickets"
    | "more_calls_booked"
    | "more_revenue_per_chat"
    | "faster_response_times"
    | "higher_csat"
    | "other"
  )[];
  success_metrics_other?: string | null;

  environment_primary: "web_widget";
  environment_future: ("whatsapp" | "telegram" | "email" | "internal_tools")[];

  allowed_actions: (
    | "answer_faqs"
    | "capture_leads"
    | "book_appointments_light"
    | "take_simple_orders"
    | "route_to_human"
    | "tag_conversations"
  )[];

  escalation_rules: string;
  hard_constraints: string;

  company_name: string;
  company_website?: string | null;
  industry?: string | null;
  short_description?: string | null;
  mission?: string | null;
  vision?: string | null;
}

export interface CustomerSegment {
  name: string;
  description?: string | null;
}

export interface CustomerProfile {
  target_segments: CustomerSegment[];
  regions: string[];
  countries: string[];
  languages: string[];

  tone_style:
    | "very_formal"
    | "professional_friendly"
    | "casual_human"
    | "playful"
    | "bilingual";
  tone_notes?: string | null;

  typical_intents: (
    | "pricing_questions"
    | "booking_appointments"
    | "technical_support"
    | "order_status"
    | "complaints"
    | "product_recommendations"
    | "other"
  )[];
  typical_intents_other?: string | null;

  cultural_dos?: string | null;
  cultural_donts?: string | null;
}

export interface DataProfile {
  strategy_notes?: string | null;
  authoritative_doc_ids: string[];
  out_of_date_notes?: string | null;
}

export interface AllowedWebsite {
  url: string;
  label?: string | null;
  trust_level: "reference_only" | "authoritative";
}

export interface Agent {
  id: string;
  tenant_id: string;
  name: string;
  slug: string;
  status: AgentStatus;
  model_provider: string;
  model_name: string;
  training_mode: string;
  job_and_company_profile: JobAndCompanyProfile;
  customer_profile: CustomerProfile;
  data_profile?: DataProfile | null;
  allowed_websites?: AllowedWebsite[] | null;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeDocumentMetadata {
  id: string;
  filename: string;
  content_type: string;
  size_bytes: number;
}
