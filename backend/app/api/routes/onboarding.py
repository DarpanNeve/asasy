from fastapi import APIRouter, HTTPException, status, Request, Depends
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
import logging

from app.core.rate_limiter import limiter
from app.models.onboarding import (
    InvestorRegistration, TechnologySubmission, PrototypeInquiry,
    TechCategory, IPStatus, TRLLevel, InvestmentStage, TicketSize,
    PrototypeType, PrototypeBudget, PrototypeTimeline,
)
from app.services.email_service import (
    send_investor_confirmation_email,
    send_technology_confirmation_email,
    send_prototype_confirmation_email,
)
from app.models.user import User
from app.core.security import require_admin

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/onboarding", tags=["Onboarding"])


class InvestorPayload(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    organization: str = Field(..., min_length=2, max_length=200)
    designation: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=8, max_length=20)
    country: str = Field(..., min_length=2, max_length=100)
    investment_focus: TechCategory
    investment_stage: InvestmentStage
    ticket_size: TicketSize
    areas_of_interest: Optional[str] = Field(None, max_length=1000)
    message: Optional[str] = Field(None, max_length=1000)


class TechnologyPayload(BaseModel):
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


class PrototypePayload(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    organization: Optional[str] = Field(None, max_length=200)
    email: EmailStr
    phone: str = Field(..., min_length=8, max_length=20)
    tech_description: str = Field(..., min_length=20, max_length=2000)
    prototype_type: PrototypeType
    budget_range: PrototypeBudget
    timeline: PrototypeTimeline
    message: Optional[str] = Field(None, max_length=1000)


@router.post("/investors")
@limiter.limit("5/minute")
async def register_investor(request: Request, payload: InvestorPayload):
    try:
        record = InvestorRegistration(**payload.model_dump())
        await record.insert()
        await send_investor_confirmation_email(payload.email, payload.full_name)
        logger.info(f"Investor registered: {payload.email}")
        return {"message": "Thank you for registering. We'll be in touch shortly."}
    except Exception as e:
        logger.error(f"Investor registration error: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Registration failed. Please try again.")


@router.post("/technologies")
@limiter.limit("5/minute")
async def submit_technology(request: Request, payload: TechnologyPayload):
    try:
        record = TechnologySubmission(**payload.model_dump())
        await record.insert()
        await send_technology_confirmation_email(payload.email, payload.inventor_name, payload.technology_title)
        logger.info(f"Technology submitted: {payload.technology_title} by {payload.email}")
        return {"message": "Your technology has been submitted. Our team will review and contact you soon."}
    except Exception as e:
        logger.error(f"Technology submission error: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Submission failed. Please try again.")


@router.post("/prototype")
@limiter.limit("5/minute")
async def submit_prototype_inquiry(request: Request, payload: PrototypePayload):
    try:
        record = PrototypeInquiry(**payload.model_dump())
        await record.insert()
        await send_prototype_confirmation_email(payload.email, payload.full_name)
        logger.info(f"Prototype inquiry submitted by {payload.email}")
        return {"message": "Your inquiry has been received. Our prototyping team will reach out within 48 hours."}
    except Exception as e:
        logger.error(f"Prototype inquiry error: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Submission failed. Please try again.")


@router.get("/investors")
async def get_investors(admin: User = Depends(require_admin)):
    try:
        records = await InvestorRegistration.find_all().sort(-InvestorRegistration.submitted_at).to_list()
        return [
            {
                "id": str(r.id),
                "full_name": r.full_name,
                "organization": r.organization,
                "designation": r.designation,
                "email": r.email,
                "phone": r.phone,
                "country": r.country,
                "investment_focus": r.investment_focus,
                "investment_stage": r.investment_stage,
                "ticket_size": r.ticket_size,
                "areas_of_interest": r.areas_of_interest,
                "message": r.message,
                "submitted_at": r.submitted_at.isoformat(),
            }
            for r in records
        ]
    except Exception as e:
        logger.error(f"Error fetching investors: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to fetch investor registrations.")


@router.get("/technologies")
async def get_technologies(admin: User = Depends(require_admin)):
    try:
        records = await TechnologySubmission.find_all().sort(-TechnologySubmission.submitted_at).to_list()
        return [
            {
                "id": str(r.id),
                "technology_title": r.technology_title,
                "inventor_name": r.inventor_name,
                "organization": r.organization,
                "email": r.email,
                "phone": r.phone,
                "country": r.country,
                "category": r.category,
                "ip_status": r.ip_status,
                "trl_level": r.trl_level,
                "description": r.description,
                "problem_solved": r.problem_solved,
                "unique_value": r.unique_value,
                "seeking": r.seeking,
                "submitted_at": r.submitted_at.isoformat(),
            }
            for r in records
        ]
    except Exception as e:
        logger.error(f"Error fetching technologies: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to fetch technology submissions.")


@router.get("/technologies/stats")
async def get_technology_stats():
    try:
        records = await TechnologySubmission.find_all().to_list()
        category_counts: dict = {}
        for r in records:
            cat = r.category.value if hasattr(r.category, "value") else str(r.category)
            category_counts[cat] = category_counts.get(cat, 0) + 1
        return {
            "total": len(records),
            "by_category": [{"category": k, "count": v} for k, v in sorted(category_counts.items(), key=lambda x: -x[1])],
        }
    except Exception as e:
        logger.error(f"Error fetching technology stats: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to fetch statistics.")


@router.get("/prototype")
async def get_prototype_inquiries(admin: User = Depends(require_admin)):
    try:
        records = await PrototypeInquiry.find_all().sort(-PrototypeInquiry.submitted_at).to_list()
        return [
            {
                "id": str(r.id),
                "full_name": r.full_name,
                "organization": r.organization,
                "email": r.email,
                "phone": r.phone,
                "tech_description": r.tech_description,
                "prototype_type": r.prototype_type,
                "budget_range": r.budget_range,
                "timeline": r.timeline,
                "message": r.message,
                "submitted_at": r.submitted_at.isoformat(),
            }
            for r in records
        ]
    except Exception as e:
        logger.error(f"Error fetching prototype inquiries: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to fetch prototype inquiries.")
