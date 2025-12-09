from typing import List

from app.config import get_settings

settings = get_settings()


def generate_reply(tenant, agent_type: str, messages: List[str]) -> str:
    """
    Generate a reply for the given tenant and agent_type.

    For now, this is a stubbed demo implementation.
    Soon, this will:
    - Look up the right Agent configuration for the tenant/agent_type.
    - Build a system prompt via build_agent_system_prompt(agent).
    - Call Groq using settings.groq_api_key and agent.model_name.

    DO NOT integrate external Groq HTTP calls yet.
    """
    # TODO: integrate Groq API using settings.groq_api_key and build_agent_system_prompt
    return "This is a demo response from the OnDuty agent."
