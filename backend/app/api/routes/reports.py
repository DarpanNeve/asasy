from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.responses import FileResponse
from typing import Optional, List
from datetime import datetime
import os
import asyncio
import logging
import traceback

from app.core.security import get_current_user
from app.models.user import User
from app.models.plan import Plan
from app.models.report import ReportLog, ReportStatus, ReportType
from app.services.report_generator import generate_technology_report
from app.services.email_service import send_report_ready_email
from app.core.config import settings
from app.schemas.report import ReportCreate, ReportResponse, ReportListResponse

router = APIRouter()
logger = logging.getLogger(__name__)

async def generate_report_background(report_id: str, idea: str, plan_id: str, user_email: str, user_name: str):
    """Background task to generate report with comprehensive logging"""
    logger.info(f"Starting background report generation for report_id: {report_id}")
    
    try:
        report = await ReportLog.get(report_id)
        plan = await Plan.get(plan_id)
        if not report or not plan:
            logger.error(f"Report or plan not found - report_id: {report_id}, plan_id: {plan_id}")
            return

        logger.info(f"Found report and plan - Report: {report.title}, Plan: {plan.name}")

        # Check if plan has prompt template
        if not hasattr(plan, 'prompt_template') or not plan.prompt_template:
            logger.error(f"No prompt template found for plan: {plan.name}")
            report.mark_failed(f"No prompt template configured for plan: {plan.name}")
            await report.save()
            return

        # Update status to processing
        report.status = ReportStatus.PROCESSING
        await report.save()
        logger.info(f"Updated report status to PROCESSING")

        # Generate report
        output_path = f"{settings.REPORTS_STORAGE_PATH}/{report_id}.pdf"
        os.makedirs(settings.REPORTS_STORAGE_PATH, exist_ok=True)
        logger.info(f"Output path: {output_path}")

        logger.info("Calling generate_technology_report...")
        report_data = await generate_technology_report(idea, output_path, plan)
        logger.info("Report generation completed successfully")

        # Verify file was created
        if not os.path.exists(output_path):
            logger.error(f"PDF file was not created at {output_path}")
            raise ValueError("PDF file was not created")
            
        file_size = os.path.getsize(output_path)
        logger.info(f"Generated PDF file size: {file_size} bytes")
        
        if file_size == 0:
            logger.error("Generated PDF file is empty")
            raise ValueError("Generated PDF file is empty")

        # Update report with completion details
        report.mark_completed(
            pdf_url=f"/reports/{report_id}/download",
            pdf_path=output_path,
            file_size=file_size,
        )

        # Update content metadata
        report.content_preview = report_data.get("executive_summary", "")[:500]
        
        # Store OpenAI usage info
        if "_usage_info" in report_data:
            report.openai_usage = report_data["_usage_info"]
            logger.info(f"Stored OpenAI usage info: {report_data['_usage_info']}")
        
        await report.save()
        logger.info("Report marked as completed and saved")

        # Send notification email
        try:
            await send_report_ready_email(user_email, user_name, report.title, report_id)
            logger.info(f"Notification email sent to {user_email}")
        except Exception as e:
            logger.error(f"Failed to send report ready email: {e}")

        logger.info(f"Background report generation completed successfully for report_id: {report_id}")

    except Exception as e:
        logger.error(f"Error in background report generation: {e}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        
        # Mark as failed
        try:
            report = await ReportLog.get(report_id)
            if report:
                error_message = str(e)
                # Provide more specific error messages
                if "prompt template" in error_message.lower():
                    error_message = f"Plan configuration error: {error_message}"
                elif "openai" in error_message.lower():
                    error_message = f"AI service error: {error_message}"
                elif "json" in error_message.lower():
                    error_message = f"Report format error: {error_message}"
                else:
                    error_message = f"Report generation failed: {error_message}"
                
                report.mark_failed(error_message)
                await report.save()
                logger.info(f"Report marked as failed with error: {error_message}")
        except Exception as save_error:
            logger.error(f"Failed to save error status: {save_error}")

@router.post("/generate", response_model=ReportResponse)
async def generate_report(
    report_data: ReportCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
):
    """Generate a new technology assessment report with enhanced logging"""
    logger.info(f"Report generation request from user: {current_user.email}")
    logger.info(f"Idea length: {len(report_data.idea)} characters")

    # Get user's current plan
    user_plan = await current_user.get_current_plan()
    
    if not user_plan:
        logger.error(f"No plan found for user: {current_user.email}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No plan found. Please contact support."
        )

    logger.info(f"User plan: {user_plan.name}")

    # Check if plan has prompt template
    if not hasattr(user_plan, 'prompt_template') or not user_plan.prompt_template:
        logger.error(f"No prompt template found for plan: {user_plan.name}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Plan configuration error: No prompt template configured for {user_plan.name} plan. Please contact support."
        )

    # Check if user can generate reports
    if not await current_user.can_generate_report():
        logger.warning(f"User {current_user.email} has reached report limit")
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
    logger.info(f"Created report log with ID: {report.id}")

    # Update user's report count
    current_user.reports_generated += 1
    current_user.updated_at = datetime.utcnow()
    await current_user.save()
    logger.info(f"Updated user report count to: {current_user.reports_generated}")

    # Start background generation
    logger.info("Starting background report generation task")
    background_tasks.add_task(
        generate_report_background, 
        str(report.id), 
        report_data.idea, 
        str(user_plan.id),
        current_user.email,
        current_user.name
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
    """Download report PDF with enhanced logging"""
    logger.info(f"Download request for report_id: {report_id} by user: {current_user.email}")

    report = await ReportLog.get(report_id)
    if not report or report.user_id != str(current_user.id):
        logger.warning(f"Report not found or unauthorized access - report_id: {report_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Report not found"
        )

    if report.status != ReportStatus.COMPLETED or not report.pdf_path:
        logger.warning(f"Report not ready for download - status: {report.status}, pdf_path: {report.pdf_path}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Report is not ready for download",
        )

    if not os.path.exists(report.pdf_path):
        logger.error(f"PDF file not found at path: {report.pdf_path}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Report file not found"
        )

    # Check file size
    file_size = os.path.getsize(report.pdf_path)
    logger.info(f"PDF file size: {file_size} bytes")
    
    if file_size == 0:
        logger.error(f"PDF file is empty: {report.pdf_path}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Report file is corrupted or empty"
        )

    # Increment download count
    report.increment_download()
    await report.save()
    logger.info(f"Download count incremented to: {report.download_count}")

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
        logger.info(f"Deleted PDF file: {report.pdf_path}")

    # Delete report from database
    await report.delete()
    logger.info(f"Deleted report: {report_id}")

    return {"message": "Report deleted successfully"}