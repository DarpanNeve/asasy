from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from typing import Optional

from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    get_current_user,
    verify_token,
)
from app.core.rate_limiter import limiter
from app.services.email_service import send_otp_email
from app.services.oauth_service import verify_google_token
from app.models.user import User, OAuthProvider
from app.schemas.auth import (
    UserSignup,
    UserLogin,
    TokenResponse,
    EmailVerification,
    GoogleAuth,
    RefreshTokenRequest,
)
from app.schemas.user import UserResponse
import secrets
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/signup", response_model=dict)
@limiter.limit("5/minute")
async def signup(request: Request, user_data: UserSignup):
    """User registration"""
    # Check if user already exists
    existing_user = await User.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    # Generate verification code
    verification_code = str(secrets.randbelow(900000) + 100000)  # 6-digit code
    verification_expires = datetime.utcnow() + timedelta(minutes=10)

    # Create user
    user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=get_password_hash(user_data.password),
        oauth_provider=OAuthProvider.EMAIL,
        email_verification_code=verification_code,
        email_verification_expires=verification_expires,
    )

    await user.insert()
    print("otp ", verification_code)
    # Send verification email
    try:
        await send_otp_email(user.email, verification_code, user.name)
    except Exception as e:
        logger.error(f"Failed to send verification email: {e}")
        # Don't fail registration if email sending fails

    return {
        "message": "User created successfully. Please verify your email.",
        "email": user.email,
    }


@router.post("/login", response_model=TokenResponse)
@limiter.limit("10/minute")
async def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends()):
    """User login"""
    # Find user
    user = await User.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user.password_hash):  # type: ignore
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Account is disabled"
        )

    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please verify your email address first",
        )

    # Update last login
    user.update_last_login()
    await user.save()

    # Create tokens
    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = create_refresh_token({"sub": str(user.id)})
    # Convert the ObjectId to a string
    user_dict = user.__dict__  # Assuming 'user' is a MongoDB document object
    user_dict["id"] = str(user_dict["id"])  # Convert ObjectId to string

    user_response = UserResponse.from_orm(user_dict)
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user=user_response,
    )


@router.post("/verify-email-otp", response_model=dict)
@limiter.limit("10/minute")
async def verify_email_otp(request: Request, verification: EmailVerification):
    """Verify email with OTP"""
    user = await User.find_one({"email": verification.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    if user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already verified"
        )
    if user.email_verification_expires == None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already verified"
        )
    # Check verification code
    if (
        not user.email_verification_code
        or user.email_verification_code != verification.otp
        or user.email_verification_expires < datetime.utcnow()
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification code",
        )

    # Mark as verified
    user.is_verified = True
    user.email_verification_code = None
    user.email_verification_expires = None
    user.updated_at = datetime.utcnow()

    await user.save()

    return {"message": "Email verified successfully"}


@router.post("/google", response_model=TokenResponse)
@limiter.limit("10/minute")
async def google_auth(request: Request, google_data: GoogleAuth):
    """Google OAuth authentication"""
    try:
        # Verify Google token and get user info
        google_user = await verify_google_token(google_data.credential)

        # Find or create user
        user = await User.find_one({"email": google_user["email"]})

        if user:
            # Update OAuth info if needed
            if user.oauth_provider != OAuthProvider.GOOGLE:
                user.oauth_provider = OAuthProvider.GOOGLE
                user.oauth_id = google_user["sub"]
                user.is_verified = True  # Google accounts are pre-verified
                await user.save()
        else:
            # Create new user
            user = User(
                name=google_user["name"],
                email=google_user["email"],
                oauth_provider=OAuthProvider.GOOGLE,
                oauth_id=google_user["sub"],
                is_verified=True,
            )
            await user.insert()

        # Update last login
        user.update_last_login()
        await user.save()

        # Create tokens
        access_token = create_access_token({"sub": str(user.id)})
        refresh_token = create_refresh_token({"sub": str(user.id)})

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            user=UserResponse.from_orm(user),
        )

    except Exception as e:
        logger.error(f"Google auth error: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Google token"
        )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_access_token(refresh_data: RefreshTokenRequest):
    """Refresh access token"""
    try:
        payload = verify_token(refresh_data.refresh_token)
        user_id = payload.get("sub")

        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token"
            )

        user = await User.get(user_id)
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive",
            )

        # Create new access token
        access_token = create_access_token({"sub": str(user.id)})

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_data.refresh_token,
            token_type="bearer",
            user=UserResponse.from_orm(user),
        )

    except Exception as e:
        logger.error(f"Token refresh error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token"
        )


@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    """User logout (client should remove tokens)"""
    return {"message": "Logged out successfully"}


@router.post("/resend-verification")
@limiter.limit("3/minute")
async def resend_verification(request: Request, email: str):
    """Resend email verification code"""
    user = await User.find_one({"email": email})
    if not user:
        # Don't reveal if email exists
        return {"message": "If the email exists, a verification code has been sent"}

    if user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already verified"
        )

    # Generate new verification code
    verification_code = str(secrets.randbelow(900000) + 100000)
    verification_expires = datetime.utcnow() + timedelta(minutes=10)

    user.email_verification_code = verification_code
    user.email_verification_expires = verification_expires
    await user.save()

    # Send verification email
    try:
        await send_otp_email(user.email, verification_code, user.name)
    except Exception as e:
        logger.error(f"Failed to send verification email: {e}")

    return {"message": "Verification code sent"}
