from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from typing import Optional
from datetime import datetime, timedelta
import razorpay
import hmac
import hashlib
import traceback

from app.core.security import get_current_user
from app.core.config import settings
from app.models.user import User, Subscription, SubscriptionStatus
from app.models.plan import Plan
from app.schemas.subscription import (
    SubscriptionCreate,
    SubscriptionResponse,
    OrderCreate,
    OrderResponse,
    PaymentVerification
)

router = APIRouter()

# Initialize Razorpay client globally
razorpay_client = None

try:
    razorpay_client = razorpay.Client(
        auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
    )
except Exception as e:
    print(f"Failed to initialize Razorpay client: {e}")

def generate_receipt(user_id: str, plan_id: str) -> str:
    try:
        timestamp = str(int(datetime.utcnow().timestamp()))
        base_receipt = f"sub_{user_id[:8]}_{plan_id[:8]}_{timestamp}"
        
        if len(base_receipt) > 40:
            import hashlib
            hash_obj = hashlib.md5(base_receipt.encode())
            return f"sub_{hash_obj.hexdigest()[:32]}"
        
        return base_receipt
    except Exception as e:
        traceback.print_exc()
        raise

@router.post("/create-order", response_model=OrderResponse)
async def create_subscription_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_user)
):
    global razorpay_client
    
    try:
        if not razorpay_client:
            # Auto-initialize if not loaded
            razorpay_client = razorpay.Client(
                auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
            )
        
        plan = await Plan.get(order_data.plan_id)
        if not plan or not plan.is_active:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Plan not found"
            )
        
        receipt = generate_receipt(str(current_user.id), str(plan.id))
        
        order_data_razorpay = {
            "amount": plan.price_inr,
            "currency": "INR",
            "receipt": receipt,
            "notes": {
                "user_id": str(current_user.id),
                "plan_id": str(plan.id),
                "plan_name": plan.name
            }
        }
        
        order = razorpay_client.order.create(order_data_razorpay)
        
        return OrderResponse(
            order_id=order["id"],
            amount=order["amount"],
            currency=order["currency"],
            plan={
                "id": str(plan.id),
                "name": plan.name,
                "duration_days": plan.duration_days
            }
        )
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create order: {str(e)}"
        )

@router.post("/verify-payment")
async def verify_payment(
    payment_data: PaymentVerification,
    current_user: User = Depends(get_current_user)
):
    try:
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
        
        payment = razorpay_client.payment.fetch(payment_data.razorpay_payment_id)
        order = razorpay_client.order.fetch(payment_data.razorpay_order_id)
        
        if payment["status"] != "captured":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Payment not captured"
            )
        
        plan_id = order["notes"]["plan_id"]
        plan = await Plan.get(plan_id)
        
        if not plan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Plan not found"
            )
        
        if current_user.current_subscription_id:
            existing_subscription = await Subscription.get(current_user.current_subscription_id)
            if existing_subscription:
                existing_subscription.status = SubscriptionStatus.CANCELLED
                await existing_subscription.save()
        
        subscription = Subscription(
            user_id=str(current_user.id),
            plan_id=str(plan.id),
            razorpay_payment_id=payment_data.razorpay_payment_id,
            razorpay_subscription_id=payment_data.razorpay_order_id,
            status=SubscriptionStatus.ACTIVE,
            active_until=datetime.utcnow() + timedelta(days=plan.duration_days)
        )
        
        await subscription.insert()
        
        current_user.current_subscription_id = str(subscription.id)
        await current_user.save()
        
        return {"message": "Subscription activated successfully"}
        
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Payment verification failed: {str(e)}"
        )

@router.get("/current", response_model=Optional[SubscriptionResponse])
async def get_current_subscription(current_user: User = Depends(get_current_user)):
    try:
        subscription = await current_user.get_current_subscription()
        if not subscription:
            return None
        
        plan = await Plan.get(subscription.plan_id)
        
        return SubscriptionResponse(
            id=str(subscription.id),
            plan_id=subscription.plan_id,
            plan_name=plan.name if plan else "Unknown",
            status=subscription.status,
            active_until=subscription.active_until,
            created_at=subscription.created_at
        )
    except Exception as e:
        traceback.print_exc()
        raise

@router.delete("/cancel")
async def cancel_subscription(current_user: User = Depends(get_current_user)):
    try:
        if not current_user.current_subscription_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No active subscription found"
            )
        
        subscription = await Subscription.get(current_user.current_subscription_id)
        if not subscription:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Subscription not found"
            )
        
        subscription.status = SubscriptionStatus.CANCELLED
        subscription.updated_at = datetime.utcnow()
        await subscription.save()
        
        current_user.current_subscription_id = None
        await current_user.save()
        
        return {"message": "Subscription cancelled successfully"}
    except Exception as e:
        traceback.print_exc()
        raise

@router.get("", response_model=list[SubscriptionResponse])
async def get_user_subscriptions(current_user: User = Depends(get_current_user)):
    try:
        subscriptions = await Subscription.find({"user_id": str(current_user.id)}).sort([("created_at", -1)]).to_list()
        
        result = []
        for subscription in subscriptions:
            plan = await Plan.get(subscription.plan_id)
            result.append(SubscriptionResponse(
                id=str(subscription.id),
                plan_id=subscription.plan_id,
                plan_name=plan.name if plan else "Unknown",
                status=subscription.status,
                active_until=subscription.active_until,
                created_at=subscription.created_at
            ))
        
        return result
    except Exception as e:
        traceback.print_exc()
        raise