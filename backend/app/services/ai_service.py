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
        logger.warning("GROQ_API_KEY is not configured; returning demo response.")
        return "This is a demo response from the OnDuty agent."

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
        return (
            "I'm having trouble answering right now. "
            "Please try again in a moment or ask to speak with a human."
        )
