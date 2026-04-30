from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Any, Dict

from app.models.onboarding import (
    TechCategory,
    IPStatus,
    TRLLevel,
    InvestmentStage,
    TicketSize,
    PrototypeType,
    PrototypeBudget,
    PrototypeTimeline,
)


class InvestorPayload(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    organization: str = Field(..., min_length=2, max_length=200)
    designation: Optional[str] = Field(None, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=8, max_length=20)
    linkedin: Optional[str] = Field(None, max_length=500)
    country: str = Field(default="India", min_length=2, max_length=100)
    investor_type: Optional[str] = Field(None, max_length=100)
    investment_focus: TechCategory = TechCategory.OTHER
    investment_stage: InvestmentStage
    ticket_size: TicketSize
    sectors: List[str] = Field(default_factory=list)
    geography_preference: Optional[str] = Field(None, max_length=100)
    num_investments: Optional[str] = Field(None, max_length=50)
    years_experience: Optional[str] = Field(None, max_length=50)
    past_investments_desc: Optional[str] = Field(None, max_length=2000)
    beyond_funding: List[str] = Field(default_factory=list)
    roi_horizon: Optional[str] = Field(None, max_length=50)
    areas_of_interest: Optional[str] = Field(None, max_length=1000)
    eligibility_confirmations: Optional[List[bool]] = None
    declaration_confirmed: Optional[bool] = None
    message: Optional[str] = Field(None, max_length=1000)
    draft_id: Optional[str] = None


class TechnologyPayload(BaseModel):
    technology_title: str = Field(..., min_length=3, max_length=200)
    inventor_name: str = Field(..., min_length=2, max_length=100)
    co_founder: Optional[str] = Field(None, max_length=200)
    organization: str = Field(..., min_length=2, max_length=200)
    email: EmailStr
    phone: str = Field(..., min_length=8, max_length=20)
    linkedin: Optional[str] = Field(None, max_length=500)
    website: Optional[str] = Field(None, max_length=500)
    country: str = Field(..., min_length=2, max_length=100)
    category: TechCategory
    tech_type: Optional[str] = Field(None, max_length=100)
    domains: List[str] = Field(default_factory=list)
    ip_status: IPStatus
    trl_level: TRLLevel
    description: str = Field(..., min_length=20, max_length=2000)
    problem_solved: str = Field(..., min_length=10, max_length=1000)
    unique_value: str = Field(..., min_length=10, max_length=1000)
    current_stage: Optional[str] = Field(None, max_length=100)
    working_prototype: Optional[str] = Field(None, max_length=50)
    tested_with_users: Optional[str] = Field(None, max_length=50)
    pilot_done: Optional[str] = Field(None, max_length=50)
    pilot_details: Optional[str] = Field(None, max_length=1000)
    revenue_status: Optional[str] = Field(None, max_length=100)
    business_model_defined: Optional[str] = Field(None, max_length=50)
    target_market_size: Optional[str] = Field(None, max_length=100)
    patent_filed: Optional[str] = Field(None, max_length=50)
    proprietary_tech: Optional[str] = Field(None, max_length=50)
    competitive_advantage: Optional[str] = Field(None, max_length=1000)
    funding_required: Optional[str] = Field(None, max_length=100)
    equity_offered: Optional[str] = Field(None, max_length=50)
    use_of_funds_desc: Optional[str] = Field(None, max_length=1000)
    seeking: str = Field(..., min_length=2, max_length=200)
    full_time_founder: Optional[str] = Field(None, max_length=100)
    experience_level: Optional[str] = Field(None, max_length=100)
    eligibility_confirmations: Optional[List[bool]] = None
    declaration_confirmed: Optional[bool] = None
    additional_info: Optional[str] = Field(None, max_length=2000)
    draft_id: Optional[str] = None


class PrototypePayload(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    organization: Optional[str] = Field(None, max_length=200)
    email: EmailStr
    phone: str = Field(..., min_length=8, max_length=20)
    tech_description: str = Field(..., min_length=20, max_length=2000)
    prototype_type: PrototypeType
    current_stage: Optional[str] = Field(None, max_length=200)
    budget_range: PrototypeBudget
    timeline: PrototypeTimeline
    message: Optional[str] = Field(None, max_length=1000)


class DraftPayload(BaseModel):
    email: Optional[str] = None
    step_reached: int = 1
    data: Dict[str, Any] = Field(default_factory=dict)


class DraftUpdatePayload(BaseModel):
    step_reached: int
    data: Dict[str, Any]
