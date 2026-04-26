from beanie import Document
from pydantic import Field, EmailStr
from typing import Optional
from datetime import datetime
from enum import Enum


class TechCategory(str, Enum):
    AGRITECH = "AgriTech"
    BIOTECH = "BioTech"
    CLEANTECH = "CleanTech"
    DEEPTECH = "DeepTech"
    EDTECH = "EdTech"
    HEALTHTECH = "HealthTech"
    INFOTECH = "InfoTech"
    MEDTECH = "MedTech"
    MANUFACTURING = "Manufacturing"
    OTHER = "Other"


class IPStatus(str, Enum):
    PATENT_FILED = "Patent Filed"
    PATENT_GRANTED = "Patent Granted"
    PROVISIONAL = "Provisional Application"
    TRADE_SECRET = "Trade Secret"
    COPYRIGHT = "Copyright"
    NONE = "No IP Protection"


class TRLLevel(str, Enum):
    TRL1 = "TRL 1 - Basic Research"
    TRL2 = "TRL 2 - Technology Concept"
    TRL3 = "TRL 3 - Proof of Concept"
    TRL4 = "TRL 4 - Lab Validation"
    TRL5 = "TRL 5 - Relevant Environment"
    TRL6 = "TRL 6 - Prototype Demo"
    TRL7 = "TRL 7 - System Prototype"
    TRL8 = "TRL 8 - System Complete"
    TRL9 = "TRL 9 - Proven System"


class InvestmentStage(str, Enum):
    PRE_SEED = "Pre-Seed"
    SEED = "Seed"
    SERIES_A = "Series A"
    SERIES_B = "Series B"
    GROWTH = "Growth Stage"
    ANY = "Any Stage"


class TicketSize(str, Enum):
    SMALL = "< ₹25L"
    MEDIUM = "₹25L – ₹1Cr"
    LARGE = "₹1Cr – ₹5Cr"
    XLARGE = "₹5Cr – ₹25Cr"
    ENTERPRISE = "₹25Cr+"


class PrototypeType(str, Enum):
    ELECTRONIC = "Electronic / Hardware"
    MECHANICAL = "Mechanical / Structural"
    SOFTWARE = "Software / Digital MVP"
    CAD = "3D Model / CAD"
    CHEMICAL = "Chemical / Material"
    OTHER = "Other"


class PrototypeBudget(str, Enum):
    SMALL = "< ₹1L"
    MEDIUM = "₹1L – ₹5L"
    LARGE = "₹5L – ₹20L"
    XLARGE = "₹20L – ₹50L"
    ENTERPRISE = "₹50L+"


class PrototypeTimeline(str, Enum):
    MONTH1 = "< 1 month"
    MONTHS3 = "1 – 3 months"
    MONTHS6 = "3 – 6 months"
    MONTHS12 = "6 – 12 months"
    BEYOND = "> 12 months"


class InvestorRegistration(Document):
    full_name: str = Field(..., min_length=2, max_length=100)
    organization: str = Field(..., min_length=2, max_length=200)
    designation: Optional[str] = Field(None, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=8, max_length=20)
    country: str = Field(default="India", min_length=2, max_length=100)
    investor_type: Optional[str] = Field(None, max_length=100)
    investment_focus: TechCategory = Field(default=TechCategory.OTHER)
    investment_stage: InvestmentStage
    ticket_size: TicketSize
    areas_of_interest: Optional[str] = Field(None, max_length=1000)
    message: Optional[str] = Field(None, max_length=1000)
    submitted_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "investor_registrations"
        indexes = ["email", "submitted_at", [("submitted_at", -1)]]


class TechnologySubmission(Document):
    technology_title: str = Field(..., min_length=3, max_length=200)
    inventor_name: str = Field(..., min_length=2, max_length=100)
    organization: str = Field(..., min_length=2, max_length=200)
    email: EmailStr
    phone: str = Field(..., min_length=8, max_length=20)
    country: str = Field(..., min_length=2, max_length=100)
    category: TechCategory
    ip_status: IPStatus
    trl_level: TRLLevel
    description: str = Field(..., min_length=20, max_length=2000)
    problem_solved: str = Field(..., min_length=10, max_length=1000)
    unique_value: str = Field(..., min_length=10, max_length=1000)
    seeking: str = Field(..., min_length=2, max_length=200)
    additional_info: Optional[str] = Field(None, max_length=2000)
    submitted_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "technology_submissions"
        indexes = ["email", "category", "submitted_at", [("submitted_at", -1)]]


class PrototypeInquiry(Document):
    full_name: str = Field(..., min_length=2, max_length=100)
    organization: Optional[str] = Field(None, max_length=200)
    email: EmailStr
    phone: str = Field(..., min_length=8, max_length=20)
    tech_description: str = Field(..., min_length=20, max_length=2000)
    prototype_type: PrototypeType
    budget_range: PrototypeBudget
    timeline: PrototypeTimeline
    message: Optional[str] = Field(None, max_length=1000)
    submitted_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "prototype_inquiries"
        indexes = ["email", "submitted_at", [("submitted_at", -1)]]


class InvestorDraft(Document):
    email: Optional[str] = None
    step_reached: int = Field(default=1)
    data: dict = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "investor_drafts"
        indexes = ["email", "created_at"]


class TechnologyDraft(Document):
    email: Optional[str] = None
    step_reached: int = Field(default=1)
    data: dict = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "technology_drafts"
        indexes = ["email", "created_at"]
