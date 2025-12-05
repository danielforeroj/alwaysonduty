from typing import Optional

from pydantic import BaseModel


class CheckoutRequest(BaseModel):
    plan_type: str
    trial_mode: Optional[str] = "with_card"


class CheckoutResponse(BaseModel):
    checkout_url: str
