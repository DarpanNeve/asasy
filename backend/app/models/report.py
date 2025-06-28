from beanie import Document, Indexed
from pydantic import Field
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum

class ReportType(str, Enum):
    TECHNOLOGY_ASSESSMENT = "technology_assessment"
    MARKET_ANALYSIS = "market_analysis"
    COMPETITIVE_ANALYSIS = "competitive_analysis"
    CUSTOM = "custom"

class ReportStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class ReportLog(Document):
    user_id: Indexed(str) = Field(..., description="User who generated the report")
    
    # Report details
    report_type: ReportType = ReportType.TECHNOLOGY_ASSESSMENT
    title: str = Field(..., description="Report title")
    idea: str = Field(..., description="Original idea/input for the report")
    
    # Plan information
    plan_id: str = Field(..., description="Plan used for this report")
    plan_name: str = Field(..., description="Plan name for display")
    plan_type: Optional[str] = Field(None, description="Type of analysis performed")
    
    # Generation status
    status: ReportStatus = ReportStatus.PENDING
    error_message: Optional[str] = None
    
    # File storage
    pdf_url: Optional[str] = None
    pdf_path: Optional[str] = None
    file_size: Optional[int] = None
    
    # AI generation details with token usage
    openai_usage: Optional[Dict[str, Any]] = Field(None, description="OpenAI API usage details including token counts")
    generation_time: Optional[float] = None  # seconds
    
    # Content metadata
    content_preview: Optional[str] = None
    page_count: Optional[int] = None
    word_count: Optional[int] = None
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    
    # Analytics
    download_count: int = 0
    last_downloaded: Optional[datetime] = None
    
    # Metadata
    metadata: Dict[str, Any] = Field(default_factory=dict)
    
    class Settings:
        name = "reports"
        indexes = [
            "user_id",
            "status",
            "report_type",
            "plan_id",
            "created_at",
            [("user_id", 1), ("created_at", -1)],
            [("user_id", 1), ("status", 1)],
        ]
    
    def mark_completed(self, pdf_url: str, pdf_path: str, file_size: int):
        """Mark report as completed"""
        self.status = ReportStatus.COMPLETED
        self.pdf_url = pdf_url
        self.pdf_path = pdf_path
        self.file_size = file_size
        self.completed_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
    
    def mark_failed(self, error_message: str):
        """Mark report as failed"""
        self.status = ReportStatus.FAILED
        self.error_message = error_message
        self.updated_at = datetime.utcnow()
    
    def increment_download(self):
        """Increment download count"""
        self.download_count += 1
        self.last_downloaded = datetime.utcnow()
    
    def dict_for_user(self) -> dict:
        """Return report dict for user consumption"""
        return self.dict(exclude={
            "pdf_path",
            "metadata"
        })