from beanie import Document
from pydantic import Field, EmailStr
from typing import Optional
from datetime import datetime
from enum import Enum

class ContactStatus(str, Enum):
    NEW = "new"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"

class ContactSubmission(Document):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=8, max_length=20)
    message: str = Field(..., min_length=4, max_length=1000)
    status: ContactStatus = ContactStatus.NEW
    
    # Metadata
    submitted_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    
    # Admin notes
    admin_notes: Optional[str] = None
    assigned_to: Optional[str] = None
    
    class Settings:
        name = "contact_submissions"
        indexes = [
            "email",
            "status",
            "submitted_at",
            [("submitted_at", -1)],
        ]