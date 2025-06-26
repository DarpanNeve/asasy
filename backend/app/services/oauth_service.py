from google.auth.transport import requests
from google.oauth2 import id_token
from typing import Dict, Any
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)

async def verify_google_token(credential: str) -> Dict[str, Any]:
    """Verify Google OAuth token and return user info"""
    try:
        # Verify the token
        idinfo = id_token.verify_oauth2_token(
            credential, 
            requests.Request(), 
            settings.GOOGLE_CLIENT_ID
        )
        
        # Verify the issuer
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')
        
        # Extract user information
        user_info = {
            'sub': idinfo['sub'],
            'email': idinfo['email'],
            'name': idinfo.get('name', ''),
            'picture': idinfo.get('picture', ''),
            'email_verified': idinfo.get('email_verified', False)
        }
        
        logger.info(f"Google token verified for user: {user_info['email']}")
        return user_info
        
    except ValueError as e:
        logger.error(f"Google token verification failed: {e}")
        raise ValueError(f"Invalid Google token: {e}")
    except Exception as e:
        logger.error(f"Unexpected error during Google token verification: {e}")
        raise ValueError("Failed to verify Google token")