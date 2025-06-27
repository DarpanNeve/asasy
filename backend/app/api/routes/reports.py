from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.responses import FileResponse
from typing import Optional, List
from datetime import datetime
import os
import asyncio

from app.core.security import get_current_user
from app.models.user import User
from app.models.plan import Plan
from app.models.report import ReportLog, ReportStatus, ReportType
from app.services.report_generator import generate_technology_report
from app.core.config import settings
from app.schemas.report import ReportCreate, ReportResponse, ReportListResponse

router = APIRouter()


async def generate_report_background(report_id: str, idea: str, plan_id: str):
    """Background task to generate report"""
    try:
        report = await ReportLog.get(report_id)
        plan = await Plan.get(plan_id)
        if not report or not plan:
            return

        # Update status to processing
        report.status = ReportStatus.PROCESSING
        await report.save()

        # Generate report
        output_path = f"{settings.REPORTS_STORAGE_PATH}/{report_id}.pdf"
        os.makedirs(settings.REPORTS_STORAGE_PATH, exist_ok=True)

        report_data = await generate_technology_report(idea, output_path, plan)

        # Update report with completion details
        file_size = os.path.getsize(output_path) if os.path.exists(output_path) else 0
        report.mark_completed(
            pdf_url=f"/reports/{report_id}/download",
            pdf_path=output_path,
            file_size=file_size,
        )

        # Update content metadata
        report.content_preview = report_data.get("executive_summary", "")[:500]
        await report.save()

    except Exception as e:
        # Mark as failed
        report = await ReportLog.get(report_id)
        if report:
            report.mark_failed(str(e))
            await report.save()


@router.post("/generate", response_model=ReportResponse)
async def generate_report(
    report_data: ReportCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
):
    """Generate a new technology assessment report"""

    # Get user's current plan
    user_plan = None
    if current_user.current_subscription_id:
        subscription = await current_user.get_current_subscription()
        if subscription:
            user_plan = await Plan.get(subscription.plan_id)
    
    # If no subscription, use Basic (free) plan
    if not user_plan:
        user_plan = await Plan.find_one({"name": "Basic", "is_active": True})
        if not user_plan:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Basic plan not found. Please contact support."
            )

    # Check if user can generate reports
    if not await current_user.can_generate_report():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You have reached your report generation limit. Please upgrade your subscription.",
        )

    # Create report log
    report = ReportLog(
        user_id=str(current_user.id),
        title=f"Technology Assessment: {report_data.idea[:50]}...",
        idea=report_data.idea,
        report_type=ReportType.TECHNOLOGY_ASSESSMENT,
        status=ReportStatus.PENDING,
        plan_id=str(user_plan.id),
        plan_name=user_plan.name,
    )

    await report.insert()

    # Update user's report count
    current_user.reports_generated += 1
    await current_user.save()

    # Start background generation
    background_tasks.add_task(
        generate_report_background, str(report.id), report_data.idea, str(user_plan.id)
    )

    return ReportResponse(
        id=str(report.id),
        title=report.title,
        status=report.status,
        created_at=report.created_at,
        plan_name=user_plan.name,
        plan_type=user_plan.report_type,
        message=f"Report generation started using {user_plan.name} plan. You will be notified when complete.",
    )


@router.get("", response_model=ReportListResponse)
async def get_reports(
    page: int = 1,
    limit: int = 10,
    status: Optional[ReportStatus] = None,
    current_user: User = Depends(get_current_user),
):
    """Get user's reports with pagination"""

    # Build query
    query = {"user_id": str(current_user.id)}
    if status:
        query["status"] = status

    # Calculate skip
    skip = (page - 1) * limit

    # Get reports
    reports = (
        await ReportLog.find(query)
        .sort([("created_at", -1)])
        .skip(skip)
        .limit(limit)
        .to_list()
    )
    total = await ReportLog.find(query).count()

    # Calculate pages
    pages = (total + limit - 1) // limit

    return ReportListResponse(
        reports=[
            ReportResponse(
                id=str(report.id),
                title=report.title,
                status=report.status,
                created_at=report.created_at,
                idea=report.idea,
                pdf_url=report.pdf_url,
                plan_name=getattr(report, 'plan_name', 'Unknown'),
                plan_type=getattr(report, 'plan_type', 'Unknown'),
            )
            for report in reports
        ],
        total=total,
        page=page,
        pages=pages,
    )


@router.get("/recent")
async def get_recent_reports(
    limit: int = 5, current_user: User = Depends(get_current_user)
):
    """Get user's recent reports"""

    reports = (
        await ReportLog.find({"user_id": str(current_user.id)})
        .sort([("created_at", -1)])
        .limit(limit)
        .to_list()
    )

    return [report.dict_for_user() for report in reports]


@router.get("/{report_id}")
async def get_report(report_id: str, current_user: User = Depends(get_current_user)):
    """Get a specific report"""

    report = await ReportLog.get(report_id)
    if not report or report.user_id != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Report not found"
        )

    return report.dict_for_user()


@router.get("/{report_id}/download")
async def download_report(
    report_id: str, current_user: User = Depends(get_current_user)
):
    """Download report PDF"""

    report = await ReportLog.get(report_id)
    if not report or report.user_id != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Report not found"
        )

    if report.status != ReportStatus.COMPLETED or not report.pdf_path:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Report is not ready for download",
        )

    if not os.path.exists(report.pdf_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Report file not found"
        )

    # Increment download count
    report.increment_download()
    await report.save()

    return FileResponse(
        path=report.pdf_path,
        filename=f"{report.title}.pdf",
        media_type="application/pdf",
    )


@router.delete("/{report_id}")
async def delete_report(report_id: str, current_user: User = Depends(get_current_user)):
    """Delete a report"""

    report = await ReportLog.get(report_id)
    if not report or report.user_id != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Report not found"
        )

    # Delete PDF file if exists
    if report.pdf_path and os.path.exists(report.pdf_path):
        os.remove(report.pdf_path)

    # Delete report from database
    await report.delete()

    return {"message": "Report deleted successfully"}