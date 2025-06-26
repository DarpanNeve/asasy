from pydantic import BaseModel
from typing import Optional, List

class PlanResponse(BaseModel):
    id: str
    name: str
    description: str
    price_inr: int
    price_rupees: float
    duration_days: int
    reports_limit: Optional[int]
    features: List[str]
    is_popular: bool
    highlight_text: Optional[str] = None
    badge_text: Optional[str] = None