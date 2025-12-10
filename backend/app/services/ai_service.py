from typing import List, Optional
import logging

from groq import Groq

from app.config import get_settings
from app.db import SessionLocal
from app.models.agent import Agent
from app.services.agent_prompt_service import build_agent_system_prompt

logger = logging.getLogger(__name__)

settings = get_settings()


def _get_active_agent_for_tenant(tenant_id) -> Optional[Agent]:
    """
    Return the most recent active Agent for this tenant.
    If none is active, return the most recent Agent for the tenant, or None.
    """
    session = SessionLocal()
    try:
        query = (
            session.query(Agent)
            .filter(Agent.tenant_id == tenant_id, Agent.status == "active")
            .order_by(Agent.created_at.desc())
        )
        agent = query.first()
        if not agent:
            agent = (
                session.query(Agent)
                .filter(Agent.tenant_id == tenant_id)
                .order_by(Agent.created_at.desc())
                .first()
            )
        return agent
    finally:
        session.close()


def _fallback_reply(agent: Optional[Agent], tenant, messages: List[str]) -> str:
    """Provide a graceful response when Groq is unavailable or fails.

    We avoid vendor-specific language and instead echo back context we have
    locally so the end user still gets a helpful reply.
    """
    last_message = next((m for m in reversed(messages) if m), "")
    company_name = None
    agent_name = None
    primary_goal = None

    if agent:
        agent_name = agent.name
        company_name = agent.job_and_company_profile.get("company_name")
        primary_goal = agent.job_and_company_profile.get("primary_goal")

    if not company_name:
        company_name = getattr(tenant, "name", None) or "this business"

    prompt_closure = (
        f"Thanks for reaching out to {company_name}. "
        "I'm here to help with questions and share details about what we do."
    )

    if last_message:
        return (
            f"{prompt_closure} You mentioned: '{last_message}'. "
            "Let me share the most relevant information I have and, if needed, "
            "I can connect you with a human teammate."
        )

    if agent_name or primary_goal:
        goal_text = f" My focus is on {primary_goal.replace('_', ' ')}." if primary_goal else ""
        name_text = f" I'm {agent_name}," if agent_name else ""
        return f"{prompt_closure}{name_text}{goal_text} How can I help today?"

    return f"{prompt_closure} How can I help today?"


def generate_reply(tenant, agent_type: str, messages: List[str]) -> str:
    """
    Generate a reply for the given tenant and agent_type using Groq.

    - Looks up the most recent active Agent for the tenant.
    - Builds a system prompt from that Agent (if found).
    - Calls Groq's Chat Completions API with the system prompt + user messages.

    Notes:
    - `agent_type` is kept for future routing (customer_service vs sales), but is
      not yet used to filter agents.
    - If GROQ_API_KEY is not set or the API call fails, we return a safe fallback
      demo message instead of raising.
    """
    if not settings.groq_api_key:
        logger.warning("GROQ_API_KEY is not configured; using local fallback reply.")
        agent = _get_active_agent_for_tenant(tenant.id)
        return _fallback_reply(agent, tenant, messages)

    client = Groq(api_key=settings.groq_api_key)

    agent = _get_active_agent_for_tenant(tenant.id)
    if agent:
        system_prompt = build_agent_system_prompt(agent)
        model_name = agent.model_name or settings.groq_default_model
    else:
        company_name = getattr(tenant, "name", "this business")
        system_prompt = (
            f"You are OnDuty, an AI assistant for {company_name}. "
            "Respond helpfully, accurately, and concisely."
        )
        model_name = settings.groq_default_model

    # Build Groq messages: one system message + one user message per input string.
    groq_messages = [{"role": "system", "content": system_prompt}]
    for text in messages:
        if not text:
            continue
        groq_messages.append({"role": "user", "content": text})

    if len(groq_messages) == 1:
        # No user content; just return a generic message.
        return "Hi! How can I help you today?"

    try:
        completion = client.chat.completions.create(
            model=model_name,
            messages=groq_messages,
        )
        return completion.choices[0].message.content
    except Exception as exc:
        logger.exception("Groq chat.completions.create failed: %s", exc)
        return _fallback_reply(agent, tenant, messages)
