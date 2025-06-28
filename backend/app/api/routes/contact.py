from fastapi import APIRouter, HTTPException, status, Request
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
import logging

from app.core.rate_limiter import limiter

logger = logging.getLogger(__name__)
router = APIRouter(
    prefix="/contact",
    tags=["Contact"],
)

class ContactSubmission(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=10, max_length=20)
    message: str = Field(..., min_length=10, max_length=1000)

# In-memory storage for demo purposes
# In production, you'd want to store this in MongoDB
contact_submissions = []

@router.post("/")
@limiter.limit("5/minute")
async def submit_contact_form(request: Request, submission: ContactSubmission):
    """Submit contact form for RTTP consultation"""
    try:
        # Create submission record
        submission_data = {
            "id": len(contact_submissions) + 1,
            "name": submission.name,
            "email": submission.email,
            "phone": submission.phone,
            "message": submission.message,
            "submitted_at": datetime.utcnow().isoformat(),
            "status": "new"
        }
        
        # Store submission (in production, save to MongoDB)
        contact_submissions.append(submission_data)
        
        logger.info(f"Contact form submitted by {submission.email}")
        
        # In production, you might want to:
        # 1. Send notification email to admin
        # 2. Send confirmation email to user
        # 3. Create a ticket in your support system
        
        return {
            "message": "Thank you for your inquiry! We will get back to you soon.",
            "submission_id": submission_data["id"]
        }
        
    except Exception as e:
        logger.error(f"Contact form submission error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to submit contact form. Please try again."
        )

@router.get("/submissions")
async def get_contact_submissions():
    """Get all contact submissions (admin only in production)"""
    try:
        # Sort by submission date, newest first
        sorted_submissions = sorted(
            contact_submissions, 
            key=lambda x: x["submitted_at"], 
            reverse=True
        )
        return sorted_submissions
    except Exception as e:
        logger.error(f"Error fetching contact submissions: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch contact submissions"
        )

@router.get("/export")
async def export_contact_submissions():
    """Export contact submissions as CSV (admin only in production)"""
    try:
        import csv
        import io
        from fastapi.responses import StreamingResponse
        
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow(['ID', 'Name', 'Email', 'Phone', 'Message', 'Submitted At', 'Status'])
        
        # Write data
        for submission in contact_submissions:
            writer.writerow([
                submission['id'],
                submission['name'],
                submission['email'],
                submission['phone'],
                submission['message'],
                submission['submitted_at'],
                submission['status']
            ])
        
        output.seek(0)
        
        return StreamingResponse(
            io.BytesIO(output.getvalue().encode()),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=contact_submissions.csv"}
        )
        
    except Exception as e:
        logger.error(f"Error exporting contact submissions: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to export contact submissions"
        )