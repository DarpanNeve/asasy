from fastapi import APIRouter, HTTPException, status, Request, Depends
from typing import Optional
from datetime import datetime
import logging

from app.core.rate_limiter import limiter
from app.models.onboarding import (
    InvestorRegistration, TechnologySubmission, PrototypeInquiry,
    InvestorDraft, TechnologyDraft,
)
from app.schemas.onboarding import (
    InvestorPayload,
    TechnologyPayload,
    PrototypePayload,
    DraftPayload,
    DraftUpdatePayload,
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


async def delete_investor_drafts(draft_id: Optional[str], email: Optional[str]):
    if draft_id:
        try:
            draft = await InvestorDraft.get(draft_id)
            if draft:
                await draft.delete()
        except Exception as err:
            logger.warning(f"Investor draft cleanup by id failed ({draft_id}): {err}")
    if email:
        try:
            await InvestorDraft.find({"email": email}).delete()
        except Exception as err:
            logger.warning(f"Investor draft cleanup by email failed ({email}): {err}")


async def delete_technology_drafts(draft_id: Optional[str], email: Optional[str]):
    if draft_id:
        try:
            draft = await TechnologyDraft.get(draft_id)
            if draft:
                await draft.delete()
        except Exception as err:
            logger.warning(f"Technology draft cleanup by id failed ({draft_id}): {err}")
    if email:
        try:
            await TechnologyDraft.find({"email": email}).delete()
        except Exception as err:
            logger.warning(f"Technology draft cleanup by email failed ({email}): {err}")


@router.post("/investors/draft")
@limiter.limit("20/minute")
async def create_investor_draft(request: Request, payload: DraftPayload):
    try:
        draft = InvestorDraft(
            email=payload.email,
            step_reached=payload.step_reached,
            data=payload.data,
        )
        await draft.insert()
        return {"draft_id": str(draft.id)}
    except Exception as e:
        logger.error(f"Investor draft create error: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to save draft.")


@router.patch("/investors/draft/{draft_id}")
@limiter.limit("30/minute")
async def update_investor_draft(request: Request, draft_id: str, payload: DraftUpdatePayload):
    try:
        draft = await InvestorDraft.get(draft_id)
        if not draft:
            raise HTTPException(status_code=404, detail="Draft not found.")
        draft.step_reached = payload.step_reached
        draft.data.update(payload.data)
        draft.updated_at = datetime.utcnow()
        await draft.save()
        return {"draft_id": draft_id, "step_reached": draft.step_reached}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Investor draft update error: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update draft.")


@router.post("/technologies/draft")
@limiter.limit("20/minute")
async def create_technology_draft(request: Request, payload: DraftPayload):
    try:
        draft = TechnologyDraft(
            email=payload.email,
            step_reached=payload.step_reached,
            data=payload.data,
        )
        await draft.insert()
        return {"draft_id": str(draft.id)}
    except Exception as e:
        logger.error(f"Technology draft create error: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to save draft.")


@router.patch("/technologies/draft/{draft_id}")
@limiter.limit("30/minute")
async def update_technology_draft(request: Request, draft_id: str, payload: DraftUpdatePayload):
    try:
        draft = await TechnologyDraft.get(draft_id)
        if not draft:
            raise HTTPException(status_code=404, detail="Draft not found.")
        draft.step_reached = payload.step_reached
        draft.data.update(payload.data)
        draft.updated_at = datetime.utcnow()
        await draft.save()
        return {"draft_id": draft_id, "step_reached": draft.step_reached}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Technology draft update error: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update draft.")


@router.delete("/investors/draft/{draft_id}")
@limiter.limit("30/minute")
async def remove_investor_draft(request: Request, draft_id: str):
    draft = await InvestorDraft.get(draft_id)
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found.")
    await draft.delete()
    return {"message": "Draft removed."}


@router.delete("/technologies/draft/{draft_id}")
@limiter.limit("30/minute")
async def remove_technology_draft(request: Request, draft_id: str):
    draft = await TechnologyDraft.get(draft_id)
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found.")
    await draft.delete()
    return {"message": "Draft removed."}


@router.post("/investors")
@limiter.limit("5/minute")
async def register_investor(request: Request, payload: InvestorPayload):
    try:
        payload_dict = payload.model_dump(exclude={"draft_id"})
        record = InvestorRegistration(**payload_dict)
        await record.insert()
        await delete_investor_drafts(payload.draft_id, payload.email)
        await send_investor_confirmation_email(
            payload.email,
            payload.full_name,
            payload_dict,
        )
        logger.info(f"Investor registered: {payload.email}")
        return {"message": "Thank you for registering. We'll be in touch shortly."}
    except Exception as e:
        logger.error(f"Investor registration error: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Registration failed. Please try again.")


@router.post("/technologies")
@limiter.limit("5/minute")
async def submit_technology(request: Request, payload: TechnologyPayload):
    try:
        payload_dict = payload.model_dump(exclude={"draft_id"})
        record = TechnologySubmission(**payload_dict)
        await record.insert()
        await delete_technology_drafts(payload.draft_id, payload.email)
        await send_technology_confirmation_email(
            payload.email,
            payload.inventor_name,
            payload.technology_title,
            payload_dict,
        )
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
        await send_prototype_confirmation_email(
            payload.email,
            payload.full_name,
            payload.model_dump(),
        )
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
                "linkedin": r.linkedin,
                "country": r.country,
                "investor_type": r.investor_type,
                "investment_focus": r.investment_focus,
                "investment_stage": r.investment_stage,
                "ticket_size": r.ticket_size,
                "sectors": r.sectors,
                "geography_preference": r.geography_preference,
                "num_investments": r.num_investments,
                "years_experience": r.years_experience,
                "past_investments_desc": r.past_investments_desc,
                "beyond_funding": r.beyond_funding,
                "roi_horizon": r.roi_horizon,
                "areas_of_interest": r.areas_of_interest,
                "eligibility_confirmations": r.eligibility_confirmations,
                "declaration_confirmed": r.declaration_confirmed,
                "message": r.message,
                "submitted_at": r.submitted_at.isoformat(),
            }
            for r in records
        ]
    except Exception as e:
        logger.error(f"Error fetching investors: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to fetch investor registrations.")


@router.get("/investors/drafts")
async def get_investor_drafts(admin: User = Depends(require_admin)):
    try:
        records = await InvestorDraft.find_all().sort(-InvestorDraft.updated_at).to_list()
        return [
            {
                "id": str(r.id),
                "email": r.email,
                "step_reached": r.step_reached,
                "data": r.data,
                "created_at": r.created_at.isoformat(),
                "updated_at": r.updated_at.isoformat(),
            }
            for r in records
        ]
    except Exception as e:
        logger.error(f"Error fetching investor drafts: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to fetch investor drafts.")


@router.get("/technologies")
async def get_technologies(admin: User = Depends(require_admin)):
    try:
        records = await TechnologySubmission.find_all().sort(-TechnologySubmission.submitted_at).to_list()
        return [
            {
                "id": str(r.id),
                "technology_title": r.technology_title,
                "inventor_name": r.inventor_name,
                "co_founder": r.co_founder,
                "organization": r.organization,
                "email": r.email,
                "phone": r.phone,
                "linkedin": r.linkedin,
                "website": r.website,
                "country": r.country,
                "category": r.category,
                "tech_type": r.tech_type,
                "domains": r.domains,
                "ip_status": r.ip_status,
                "trl_level": r.trl_level,
                "description": r.description,
                "problem_solved": r.problem_solved,
                "unique_value": r.unique_value,
                "current_stage": r.current_stage,
                "working_prototype": r.working_prototype,
                "tested_with_users": r.tested_with_users,
                "pilot_done": r.pilot_done,
                "pilot_details": r.pilot_details,
                "revenue_status": r.revenue_status,
                "business_model_defined": r.business_model_defined,
                "target_market_size": r.target_market_size,
                "patent_filed": r.patent_filed,
                "proprietary_tech": r.proprietary_tech,
                "competitive_advantage": r.competitive_advantage,
                "funding_required": r.funding_required,
                "equity_offered": r.equity_offered,
                "use_of_funds_desc": r.use_of_funds_desc,
                "seeking": r.seeking,
                "full_time_founder": r.full_time_founder,
                "experience_level": r.experience_level,
                "eligibility_confirmations": r.eligibility_confirmations,
                "declaration_confirmed": r.declaration_confirmed,
                "additional_info": r.additional_info,
                "submitted_at": r.submitted_at.isoformat(),
            }
            for r in records
        ]
    except Exception as e:
        logger.error(f"Error fetching technologies: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to fetch technology submissions.")


@router.get("/technologies/drafts")
async def get_technology_drafts(admin: User = Depends(require_admin)):
    try:
        records = await TechnologyDraft.find_all().sort(-TechnologyDraft.updated_at).to_list()
        return [
            {
                "id": str(r.id),
                "email": r.email,
                "step_reached": r.step_reached,
                "data": r.data,
                "created_at": r.created_at.isoformat(),
                "updated_at": r.updated_at.isoformat(),
            }
            for r in records
        ]
    except Exception as e:
        logger.error(f"Error fetching technology drafts: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to fetch technology drafts.")


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


@router.get("/investors/stats")
async def get_investor_stats():
    try:
        records = await InvestorRegistration.find_all().to_list()
        type_counts: dict = {}
        for r in records:
            key = r.investor_type if r.investor_type else "Other"
            type_counts[key] = type_counts.get(key, 0) + 1
        return {
            "total": len(records),
            "by_type": [{"type": k, "count": v} for k, v in sorted(type_counts.items(), key=lambda x: -x[1])],
        }
    except Exception as e:
        logger.error(f"Error fetching investor stats: {e}")
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
                "current_stage": r.current_stage,
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
