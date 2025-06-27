from fastapi import APIRouter, Request, HTTPException, status
from fastapi.responses import JSONResponse
import hmac
import hashlib
import json
import logging

from app.core.config import settings
from app.models.user import Subscription, SubscriptionStatus
from app.models.plan import Plan

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/razorpay")
async def razorpay_webhook(request: Request):
    """Handle Razorpay webhook events"""
    try:
        # Get the raw body
        body = await request.body()
        
        # Verify webhook signature
        signature = request.headers.get("X-Razorpay-Signature")
        if not signature:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing webhook signature"
            )
        
        # Verify signature
        expected_signature = hmac.new(
            settings.RAZORPAY_WEBHOOK_SECRET.encode(),
            body,
            hashlib.sha256
        ).hexdigest()
        
        if not hmac.compare_digest(signature, expected_signature):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid webhook signature"
            )
        
        # Parse webhook data
        webhook_data = json.loads(body)
        event = webhook_data.get("event")
        payload = webhook_data.get("payload", {})
        
        logger.info(f"Received Razorpay webhook: {event}")
        
        # Handle different webhook events
        if event == "payment.captured":
            await handle_payment_captured(payload)
        elif event == "payment.failed":
            await handle_payment_failed(payload)
        elif event == "subscription.cancelled":
            await handle_subscription_cancelled(payload)
        elif event == "subscription.completed":
            await handle_subscription_completed(payload)
        else:
            logger.info(f"Unhandled webhook event: {event}")
        
        return JSONResponse({"status": "success"})
        
    except Exception as e:
        logger.error(f"Webhook processing error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Webhook processing failed"
        )

async def handle_payment_captured(payload):
    """Handle successful payment capture"""
    payment = payload.get("payment", {})
    payment_id = payment.get("id")
    order_id = payment.get("order_id")
    
    logger.info(f"Payment captured: {payment_id} for order: {order_id}")
    
    # Find subscription by payment ID
    subscription = await Subscription.find_one({"razorpay_payment_id": payment_id})
    if subscription:
        subscription.status = SubscriptionStatus.ACTIVE
        await subscription.save()
        logger.info(f"Subscription {subscription.id} activated")

async def handle_payment_failed(payload):
    """Handle failed payment"""
    payment = payload.get("payment", {})
    payment_id = payment.get("id")
    
    logger.info(f"Payment failed: {payment_id}")
    
    # Find subscription by payment ID and mark as failed
    subscription = await Subscription.find_one({"razorpay_payment_id": payment_id})
    if subscription:
        subscription.status = SubscriptionStatus.CANCELLED
        await subscription.save()
        logger.info(f"Subscription {subscription.id} marked as cancelled due to payment failure")

async def handle_subscription_cancelled(payload):
    """Handle subscription cancellation"""
    subscription_data = payload.get("subscription", {})
    razorpay_subscription_id = subscription_data.get("id")
    
    logger.info(f"Subscription cancelled: {razorpay_subscription_id}")
    
    # Find and update subscription
    subscription = await Subscription.find_one({"razorpay_subscription_id": razorpay_subscription_id})
    if subscription:
        subscription.status = SubscriptionStatus.CANCELLED
        await subscription.save()
        logger.info(f"Subscription {subscription.id} cancelled")

async def handle_subscription_completed(payload):
    """Handle subscription completion"""
    subscription_data = payload.get("subscription", {})
    razorpay_subscription_id = subscription_data.get("id")
    
    logger.info(f"Subscription completed: {razorpay_subscription_id}")
    
    # Find and update subscription
    subscription = await Subscription.find_one({"razorpay_subscription_id": razorpay_subscription_id})
    if subscription:
        subscription.status = SubscriptionStatus.EXPIRED
        await subscription.save()
        logger.info(f"Subscription {subscription.id} marked as expired")