import httpx
import logging
from enum import Enum
from typing import Optional

from app.core.config import settings

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Internal helper: single MSG91 send call (template-only, no raw body/subject)
# ---------------------------------------------------------------------------

async def _msg91_send(template_id: str, to_email: str, to_name: str, variables: dict) -> bool:
    """
    Send a MSG91 template email.
    MSG91 prohibits 'body' and 'subject' when 'template_id' is provided.
    All dynamic content must be passed as 'variables'.
    """
    try:
        payload = {
            "to": [{"email": to_email, "name": to_name}],
            "from": {
                "email": settings.MSG91_FROM_EMAIL or "noreply@assesme.com",
                "name": "Assesme",
            },
            "domain": settings.MSG91_DOMAIN or "assesme.com",
            "template_id": template_id,
            "variables": variables,
        }
        headers = {
            "Content-Type": "application/json",
            "Authkey": settings.MSG91_API_KEY,
        }
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://control.msg91.com/api/v5/email/send",
                json=payload,
                headers=headers,
            )
        if response.status_code == 200:
            logger.info(f"MSG91 email sent to {to_email} via template '{template_id}'")
            return True
        logger.error(f"MSG91 error {response.status_code}: {response.text}")
        return False
    except Exception as e:
        logger.error(f"MSG91 send error: {e}")
        return False


# ---------------------------------------------------------------------------
# OTP email
# ---------------------------------------------------------------------------

async def send_otp_email(email: str, otp: str, name: str) -> bool:
    """Send OTP email using MSG91 template."""
    try:
        if settings.MSG91_API_KEY:
            if not settings.MSG91_TEMPLATE_ID:
                logger.error("MSG91_TEMPLATE_ID is required for OTP emails")
                return False
            return await _msg91_send(
                template_id=settings.MSG91_TEMPLATE_ID,
                to_email=email,
                to_name=name,
                variables={"name": name, "otp": otp, "company_name": "Assesme"},
            )
        logger.warning("MSG91 not configured, using fallback")
        return await _send_fallback_email(email, otp, name)
    except Exception as e:
        logger.error(f"Failed to send OTP email: {e}")
        return False


async def _send_fallback_email(email: str, otp: str, name: str) -> bool:
    """Log OTP when MSG91 is not configured (dev/test only)."""
    logger.info(f"FALLBACK EMAIL — OTP for {email} ({name}): {otp}")
    return True


# ---------------------------------------------------------------------------
# Welcome email
# ---------------------------------------------------------------------------

async def send_welcome_email(email: str, name: str) -> bool:
    """Send welcome email after successful verification."""
    try:
        if not settings.MSG91_API_KEY:
            logger.info(f"Welcome email (fallback) to {email}")
            return True
        template_id = settings.MSG91_WELCOME_TEMPLATE_ID or settings.MSG91_TEMPLATE_ID
        if not template_id:
            logger.error("MSG91_WELCOME_TEMPLATE_ID is required for welcome emails")
            return False
        return await _msg91_send(
            template_id=template_id,
            to_email=email,
            to_name=name,
            variables={"name": name, "company_name": "Assesme"},
        )
    except Exception as e:
        logger.error(f"Welcome email error: {e}")
        return False


# ---------------------------------------------------------------------------
# Password reset email
# ---------------------------------------------------------------------------

async def send_password_reset_email(email: str, name: str, reset_token: str) -> bool:
    """Send password reset email."""
    try:
        reset_link = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
        if not settings.MSG91_API_KEY:
            logger.info(f"Password reset (fallback) to {email}: {reset_link}")
            return True
        template_id = settings.MSG91_PASSWORD_RESET_TEMPLATE_ID or settings.MSG91_TEMPLATE_ID
        if not template_id:
            logger.error("MSG91_PASSWORD_RESET_TEMPLATE_ID is required")
            return False
        return await _msg91_send(
            template_id=template_id,
            to_email=email,
            to_name=name,
            variables={"name": name, "reset_link": reset_link, "company_name": "Assesme"},
        )
    except Exception as e:
        logger.error(f"Password reset email error: {e}")
        return False


# ---------------------------------------------------------------------------
# Helpers for form field normalisation
# ---------------------------------------------------------------------------

def _normalize_form_value(value) -> str:
    if value is None:
        return "Not provided"
    if isinstance(value, Enum):
        return str(value.value)
    if isinstance(value, bool):
        return "Yes" if value else "No"
    if isinstance(value, list):
        return ", ".join(_normalize_form_value(i) for i in value) if value else "Not provided"
    s = str(value).strip()
    return s if s else "Not provided"


def _flatten_variables(data: dict) -> dict:
    """Return a flat dict of str→str suitable for MSG91 variables."""
    return {k: _normalize_form_value(v) for k, v in data.items()}


# ---------------------------------------------------------------------------
# Investor confirmation
# ---------------------------------------------------------------------------

async def send_investor_confirmation_email(email: str, name: str, submission_data: dict) -> bool:
    if not settings.MSG91_API_KEY:
        logger.info(f"Investor confirmation (fallback) to {email}")
        return True
    template_id = settings.MSG91_INVESTOR_TEMPLATE_ID
    if not template_id:
        logger.error("MSG91_INVESTOR_TEMPLATE_ID is required")
        return False
    variables = {"name": name, "company_name": "Assesme"}
    variables.update(_flatten_variables(submission_data))
    return await _msg91_send(template_id=template_id, to_email=email, to_name=name, variables=variables)


# ---------------------------------------------------------------------------
# Technology confirmation
# ---------------------------------------------------------------------------

async def send_technology_confirmation_email(email: str, name: str, tech_title: str, submission_data: dict) -> bool:
    if not settings.MSG91_API_KEY:
        logger.info(f"Technology confirmation (fallback) to {email}")
        return True
    template_id = settings.MSG91_TECHNOLOGY_TEMPLATE_ID
    if not template_id:
        logger.error("MSG91_TECHNOLOGY_TEMPLATE_ID is required")
        return False
    variables = {"name": name, "technology_title": tech_title, "company_name": "Assesme"}
    variables.update(_flatten_variables(submission_data))
    return await _msg91_send(template_id=template_id, to_email=email, to_name=name, variables=variables)


# ---------------------------------------------------------------------------
# Prototype confirmation
# ---------------------------------------------------------------------------

async def send_prototype_confirmation_email(email: str, name: str, submission_data: dict) -> bool:
    if not settings.MSG91_API_KEY:
        logger.info(f"Prototype confirmation (fallback) to {email}")
        return True
    template_id = settings.MSG91_PROTOTYPE_TEMPLATE_ID
    if not template_id:
        logger.error("MSG91_PROTOTYPE_TEMPLATE_ID is required")
        return False
    variables = {"name": name, "company_name": "Assesme"}
    variables.update(_flatten_variables(submission_data))
    return await _msg91_send(template_id=template_id, to_email=email, to_name=name, variables=variables)


# ---------------------------------------------------------------------------
# Contact confirmation
# ---------------------------------------------------------------------------

async def send_contact_confirmation_email(
    email: str,
    name: str,
    reason: Optional[str],
    phone: str,
    message: str,
) -> bool:
    if not settings.MSG91_API_KEY:
        logger.info(f"Contact confirmation (fallback) to {email}")
        return True
    template_id = settings.MSG91_CONTACT_USER_TEMPLATE_ID
    if not template_id:
        logger.error("MSG91_CONTACT_USER_TEMPLATE_ID is required")
        return False
    return await _msg91_send(
        template_id=template_id,
        to_email=email,
        to_name=name,
        variables={
            "name": name,
            "email": email,
            "phone": phone or "Not provided",
            "reason": reason or "General inquiry",
            "message": message,
            "support_email": settings.SUPPORT_EMAIL or "support@assesme.com",
            "company_name": "Assesme",
        },
    )


# ---------------------------------------------------------------------------
# Report ready
# ---------------------------------------------------------------------------

async def send_report_ready_email(email: str, name: str, report_title: str, report_id: str) -> bool:
    """Send notification when a report is ready."""
    try:
        if not settings.MSG91_API_KEY:
            logger.info(f"Report ready (fallback) to {email} for report {report_id}")
            return True
        template_id = settings.MSG91_REPORT_TEMPLATE_ID or settings.MSG91_TEMPLATE_ID
        if not template_id:
            logger.error("MSG91_REPORT_TEMPLATE_ID is required")
            return False
        return await _msg91_send(
            template_id=template_id,
            to_email=email,
            to_name=name,
            variables={
                "name": name,
                "report_title": report_title,
                "report_id": report_id,
                "company_name": "Assesme",
            },
        )
    except Exception as e:
        logger.error(f"Report ready email error: {e}")
        return False
