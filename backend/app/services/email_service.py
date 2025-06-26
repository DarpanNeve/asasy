import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
import httpx
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)

async def send_otp_email(email: str, otp: str, name: str) -> bool:
    """Send OTP email using msg91 or SMTP"""
    try:
        if settings.MSG91_API_KEY:
            return await send_msg91_email(email, otp, name)
        elif settings.SMTP_HOST:
            return await send_smtp_email(email, otp, name)
        else:
            logger.warning("No email service configured")
            return False
    except Exception as e:
        logger.error(f"Failed to send OTP email: {e}")
        return False

async def send_msg91_email(email: str, otp: str, name: str) -> bool:
    """Send email using msg91 service"""
    try:
        url = "https://control.msg91.com/api/v5/email/send"
        
        payload = {
            "to": [{"email": email, "name": name}],
            "from": {"email": "noreply@asasy.com", "name": "Asasy"},
            "domain": "asasy.com",
            "template_id": settings.MSG91_TEMPLATE_ID,
            "variables": {
                "name": name,
                "otp": otp
            }
        }
        
        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "authkey": settings.MSG91_API_KEY
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, headers=headers)
            
        if response.status_code == 200:
            logger.info(f"OTP email sent successfully to {email}")
            return True
        else:
            logger.error(f"msg91 API error: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        logger.error(f"msg91 email error: {e}")
        return False

async def send_smtp_email(email: str, otp: str, name: str) -> bool:
    """Send email using SMTP"""
    try:
        # Create message
        message = MIMEMultipart("alternative")
        message["Subject"] = "Verify your Asasy account"
        message["From"] = settings.SMTP_USER
        message["To"] = email
        
        # Create HTML content
        html = f"""
        <html>
          <body>
            <h2>Welcome to Asasy!</h2>
            <p>Hi {name},</p>
            <p>Thank you for signing up. Please use the following OTP to verify your email address:</p>
            <h3 style="color: #2563eb; font-size: 24px; letter-spacing: 2px;">{otp}</h3>
            <p>This OTP will expire in 10 minutes.</p>
            <p>If you didn't create an account, please ignore this email.</p>
            <br>
            <p>Best regards,<br>The Asasy Team</p>
          </body>
        </html>
        """
        
        # Create text content
        text = f"""
        Welcome to Asasy!
        
        Hi {name},
        
        Thank you for signing up. Please use the following OTP to verify your email address:
        
        {otp}
        
        This OTP will expire in 10 minutes.
        
        If you didn't create an account, please ignore this email.
        
        Best regards,
        The Asasy Team
        """
        
        # Add parts to message
        part1 = MIMEText(text, "plain")
        part2 = MIMEText(html, "html")
        
        message.attach(part1)
        message.attach(part2)
        
        # Send email
        context = ssl.create_default_context()
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls(context=context)
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_USER, email, message.as_string())
        
        logger.info(f"SMTP email sent successfully to {email}")
        return True
        
    except Exception as e:
        logger.error(f"SMTP email error: {e}")
        return False