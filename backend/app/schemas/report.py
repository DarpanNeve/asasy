from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models.report import ReportStatus, ReportType


class ReportCreate(BaseModel):
    idea: str = Field(
        ..., min_length=50, max_length=5000, description="Technology idea or concept"
    )


class ReportResponse(BaseModel):
    id: str
    title: str
    status: ReportStatus
    created_at: datetime
    idea: Optional[str] = None
    pdf_url: Optional[str] = None
    message: Optional[str] = None


class ReportListResponse(BaseModel):
    reports: list[ReportResponse]
    total: int
    page: int
    pages: int
