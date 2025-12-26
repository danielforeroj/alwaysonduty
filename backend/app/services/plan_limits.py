PLAN_LIMITS = {
    "basic": {
        "monthly_conversations_limit": 200,
        "brands_limit": 1,
        "seats_included": 1,
        "channels_included": 1,
    },
    "growth": {
        "monthly_conversations_limit": 500,
        "brands_limit": 2,
        "seats_included": 3,
        "channels_included": 2,
    },
    "premium": {
        "monthly_conversations_limit": 1000,
        "brands_limit": 3,
        "seats_included": 5,
        "channels_included": 3,
    },
}


def get_plan_limits(plan_type: str):
    normalized = (plan_type or "basic").lower()
    if normalized == "starter":
        normalized = "basic"
    return PLAN_LIMITS.get(normalized, PLAN_LIMITS["basic"])
