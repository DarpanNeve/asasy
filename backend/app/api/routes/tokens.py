from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from typing import List
import razorpay
import hmac
import hashlib
import traceback

from app.core.security import get_current_user
from app.core.config import settings
from app.models.user import User
from app.models.token import TokenPackage, TokenTransaction, UserTokenBalance, TokenTransactionStatus
from app.schemas.token import (
    TokenPackageResponse,
    TokenPurchaseCreate,
    TokenOrderResponse,
    TokenPaymentVerification,
    UserTokenBalanceResponse
)

router = APIRouter()

def get_razorpay_client():
    """Get or create Razorpay client"""
    try:
        return razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Payment gateway initialization failed: {str(e)}"
        )

@router.get("/packages", response_model=List[TokenPackageResponse])
async def get_token_packages():
    """Get all available token packages"""
    packages = await TokenPackage.find({"is_active": True}).sort([("sort_order", 1)]).to_list()
    
    return [
        TokenPackageResponse(
            id=str(package.id),
            name=package.name,
            package_type=package.package_type,
            tokens=package.tokens,
            price_inr=package.price_inr,
            price_rupees=package.price_rupees,
            description=package.description
        )
        for package in packages
    ]

@router.get("/balance", response_model=UserTokenBalanceResponse)
async def get_user_token_balance(current_user: User = Depends(get_current_user)):
    """Get user's current token balance"""
    balance = await current_user.get_token_balance()
    
    return UserTokenBalanceResponse(
        total_tokens=balance.total_tokens,
        used_tokens=balance.used_tokens,
        available_tokens=balance.available_tokens,
        updated_at=balance.updated_at
    )

@router.post("/purchase/create-order", response_model=TokenOrderResponse)
async def create_token_purchase_order(
    order_data: TokenPurchaseCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a Razorpay order for token purchase"""
    try:
        razorpay_client = get_razorpay_client()
        
        package = await TokenPackage.get(order_data.package_id)
        if not package or not package.is_active:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Token package not found"
            )
        
        # Generate receipt ID
        import time
        receipt = f"token_{str(current_user.id)[:8]}_{str(package.id)[:8]}_{int(time.time())}"
        
        order_data_razorpay = {
            "amount": package.price_inr,
            "currency": "INR",
            "receipt": receipt,
            "notes": {
                "user_id": str(current_user.id),
                "package_id": str(package.id),
                "package_name": package.name,
                "tokens": str(package.tokens)
            }
        }
        
        order = razorpay_client.order.create(order_data_razorpay)
        
        return TokenOrderResponse(
            order_id=order["id"],
            amount=order["amount"],
            currency=order["currency"],
            package={
                "id": str(package.id),
                "name": package.name,
                "tokens": package.tokens,
                "price_rupees": package.price_rupees
            }
        )
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create order: {str(e)}"
        )

@router.post("/purchase/verify-payment")
async def verify_token_payment(
    payment_data: TokenPaymentVerification,
    current_user: User = Depends(get_current_user)
):
    """Verify token purchase payment"""
    try:
        razorpay_client = get_razorpay_client()
        
        # Verify signature
        generated_signature = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode(),
            f"{payment_data.razorpay_order_id}|{payment_data.razorpay_payment_id}".encode(),
            hashlib.sha256
        ).hexdigest()
        
        if generated_signature != payment_data.razorpay_signature:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid payment signature"
            )
        
        # Fetch payment and order details
        payment = razorpay_client.payment.fetch(payment_data.razorpay_payment_id)
        order = razorpay_client.order.fetch(payment_data.razorpay_order_id)
        
        if payment["status"] != "captured":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Payment not captured"
            )
        
        # Get package details
        package_id = order["notes"]["package_id"]
        package = await TokenPackage.get(package_id)
        
        if not package:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Token package not found"
            )
        
        # Create transaction record
        transaction = TokenTransaction(
            user_id=str(current_user.id),
            package_id=str(package.id),
            package_name=package.name,
            tokens_purchased=package.tokens,
            amount_paid=payment["amount"],
            razorpay_payment_id=payment_data.razorpay_payment_id,
            razorpay_order_id=payment_data.razorpay_order_id,
            razorpay_signature=payment_data.razorpay_signature,
            status=TokenTransactionStatus.COMPLETED,
            completed_at=datetime.utcnow()
        )
        
        await transaction.insert()
        
        # Add tokens to user balance
        await current_user.add_tokens(package.tokens)
        
        return {"message": "Token purchase completed successfully", "tokens_added": package.tokens}
        
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Payment verification failed: {str(e)}"
        )

@router.get("/transactions")
async def get_user_token_transactions(current_user: User = Depends(get_current_user)):
    """Get user's token transaction history"""
    try:
        transactions = await TokenTransaction.find({"user_id": str(current_user.id)}).sort([("created_at", -1)]).to_list()
        
        result = []
        for transaction in transactions:
            result.append({
                "id": str(transaction.id),
                "package_name": transaction.package_name,
                "tokens_purchased": transaction.tokens_purchased,
                "amount_paid": transaction.amount_paid,
                "amount_rupees": transaction.amount_paid / 100 if transaction.amount_paid else 0,
                "status": transaction.status,
                "created_at": transaction.created_at.isoformat(),
                "completed_at": transaction.completed_at.isoformat() if transaction.completed_at else None
            })
        
        return result
    except Exception as e:
        traceback.print_exc()
        raise