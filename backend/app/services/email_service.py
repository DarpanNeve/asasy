import httpx
import logging
from typing import Optional

from app.core.config import settings

logger = logging.getLogger(__name__)

async def send_otp_email(email: str, otp: str, name: str) -> bool:
    """Send OTP email using MSG91"""
    try:
        if settings.MSG91_API_KEY and settings.MSG91_TEMPLATE_ID:
            return await send_msg91_email(email, otp, name)
        else:
            logger.warning("MSG91 not configured, using fallback email")
            return await send_fallback_email(email, otp, name)
    except Exception as e:
        logger.error(f"Failed to send OTP email: {e}")
        return False

async def send_msg91_email(email: str, otp: str, name: str) -> bool:
    """Send email using MSG91 Email service"""
    try:
        url = "https://control.msg91.com/api/v5/email/send"
        
        headers = {
            "Content-Type": "application/json",
            "Authkey": settings.MSG91_API_KEY
        }

        payload = {
            "to": [{
                "email": email,
                "name": name
            }],
            "from": {
                "email": settings.MSG91_FROM_EMAIL,
                "name": "Assesme AI"
            },
            "domain": settings.MSG91_DOMAIN,
            "template_id": settings.MSG91_TEMPLATE_ID,
            "variables": {
                "company_name": "Assesme",
                "otp": otp
            },
            "mail_type_id": 1
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, headers=headers)
            
        if response.status_code == 200:
            logger.info(f"OTP email sent successfully to {email} via MSG91")
            return True
        else:
            logger.error(f"MSG91 API error: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        logger.error(f"MSG91 email error: {e}")
        return False

async def send_fallback_email(email: str, otp: str, name: str) -> bool:
    """Fallback email method when MSG91 is not available"""
    try:
        # For development/testing - just log the OTP
        logger.info(f"FALLBACK EMAIL - OTP for {email} ({name}): {otp}")
        
        # In production, you could integrate with another email service here
        # For now, we'll just return True to allow the flow to continue
        return True
        
    except Exception as e:
        logger.error(f"Fallback email error: {e}")
        return False

async def send_welcome_email(email: str, name: str) -> bool:
    """Send welcome email after successful verification"""
    try:
        if not settings.MSG91_API_KEY or not settings.MSG91_TEMPLATE_ID:
            logger.info(f"Welcome email would be sent to {email} ({name})")
            return True
            
        url = "https://control.msg91.com/api/v5/email/send"
        
        headers = {
            "Content-Type": "application/json",
            "Authkey": settings.MSG91_API_KEY
        }
        
        email_subject = "Welcome to Asasy - Start Generating Reports!"
        email_body = f"""
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin-bottom: 10px;">Welcome to Asasy!</h1>
            </div>
            
            <div style="background-color: #f8fafc; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
              <h2 style="color: #1e293b; margin-bottom: 20px;">Hi {name},</h2>
              <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Your email has been successfully verified! You can now start using Asasy to generate AI-powered technology assessment reports.
              </p>
              
              <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1e40af; margin-bottom: 15px;">🎉 What's Next?</h3>
                <ul style="color: #475569; margin: 0; padding-left: 20px;">
                  <li style="margin-bottom: 8px;">Generate your first free technology assessment report</li>
                  <li style="margin-bottom: 8px;">Explore our different report formats and plans</li>
                  <li style="margin-bottom: 8px;">Connect with RTTP experts for personalized guidance</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://asasy.com/dashboard" style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  Start Generating Reports
                </a>
              </div>
            </div>
            
            <div style="text-align: center; color: #64748b; font-size: 12px;">
              <p>Best regards,<br>The Asasy Team</p>
            </div>
          </body>
        </html>
        """
        
        payload = {
            "to": [
                {
                    "email": email,
                    "name": name
                }
            ],
            "from": {
                "email": settings.MSG91_FROM_EMAIL or "noreply@asasy.com",
                "name": "Asasy"
            },
            "domain": settings.MSG91_DOMAIN or "asasy.com",
            "template_id": settings.MSG91_WELCOME_TEMPLATE_ID or settings.MSG91_TEMPLATE_ID,
            "subject": email_subject,
            "body": email_body,
            "variables": {
                "name": name
            }
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, headers=headers)
            
        if response.status_code == 200:
            logger.info(f"Welcome email sent successfully to {email}")
            return True
        else:
            logger.error(f"MSG91 welcome email error: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        logger.error(f"Welcome email error: {e}")
        return False

async def send_report_ready_email(email: str, name: str, report_title: str, report_id: str) -> bool:
    """Send notification when report is ready"""
    try:
        if not settings.MSG91_API_KEY or not settings.MSG91_TEMPLATE_ID:
            logger.info(f"Report ready email would be sent to {email} for report {report_id}")
            return True
            
        url = "https://control.msg91.com/api/v5/email/send"
        
        headers = {
            "Content-Type": "application/json",
            "Authkey": settings.MSG91_API_KEY
        }
        
        email_subject = f"Your Report is Ready - {report_title}"
        email_body = f"""
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin-bottom: 10px;">Report Ready!</h1>
            </div>
            
            <div style="background-color: #f8fafc; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
              <h2 style="color: #1e293b; margin-bottom: 20px;">Hi {name},</h2>
              <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Great news! Your technology assessment report "<strong>{report_title}</strong>" has been generated and is ready for download.
              </p>
              
              <div style="background-color: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #166534; margin-bottom: 15px;">📊 Your Report Includes:</h3>
                <ul style="color: #475569; margin: 0; padding-left: 20px;">
                  <li style="margin-bottom: 8px;">Comprehensive technology analysis</li>
                  <li style="margin-bottom: 8px;">Market opportunity assessment</li>
                  <li style="margin-bottom: 8px;">IP landscape overview</li>
                  <li style="margin-bottom: 8px;">Commercialization recommendations</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://asasy.com/reports" style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  View & Download Report
                </a>
              </div>
            </div>
            
            <div style="text-align: center; color: #64748b; font-size: 12px;">
              <p>Best regards,<br>The Asasy Team</p>
            </div>
          </body>
        </html>
        """
        
        payload = {
            "to": [
                {
                    "email": email,
                    "name": name
                }
            ],
            "from": {
                "email": settings.MSG91_FROM_EMAIL or "noreply@asasy.com",
                "name": "Asasy"
            },
            "domain": settings.MSG91_DOMAIN or "asasy.com",
            "template_id": settings.MSG91_REPORT_TEMPLATE_ID or settings.MSG91_TEMPLATE_ID,
            "subject": email_subject,
            "body": email_body,
            "variables": {
                "name": name,
                "report_title": report_title,
                "report_id": report_id
            }
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, headers=headers)
            
        if response.status_code == 200:
            logger.info(f"Report ready email sent successfully to {email}")
            return True
        else:
            logger.error(f"MSG91 report ready email error: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        logger.error(f"Report ready email error: {e}")
        return False