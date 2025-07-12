from fastapi import APIRouter, Request, HTTPException, status
from fastapi.responses import JSONResponse
import hmac
import hashlib
import json
import logging
from datetime import datetime

from app.core.config import settings
from app.models.token import TokenTransaction, TokenTransactionStatus, TokenPackage
from app.models.user import User

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/razorpay")
async def razorpay_webhook(request: Request):
    """Handle Razorpay webhook events for token purchases"""
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
            await handle_token_payment_captured(payload)
        elif event == "payment.failed":
            await handle_token_payment_failed(payload)
        elif event == "order.paid":
            await handle_token_order_paid(payload)
        else:
            logger.info(f"Unhandled webhook event: {event}")
        
        return JSONResponse({"status": "success"})
        
    except Exception as e:
        logger.error(f"Webhook processing error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Webhook processing failed"
        )

async def handle_token_payment_captured(payload):
    """Handle successful token payment capture"""
    payment = payload.get("payment", {})
    payment_id = payment.get("id")
    order_id = payment.get("order_id")
    amount = payment.get("amount")
    
    logger.info(f"Token payment captured: {payment_id} for order: {order_id}, amount: {amount}")
    
    try:
        # Find existing transaction by payment ID or order ID
        transaction = await TokenTransaction.find_one({
            "$or": [
                {"razorpay_payment_id": payment_id},
                {"razorpay_order_id": order_id}
            ]
        })
        
        if not transaction:
            logger.warning(f"No transaction found for payment {payment_id} or order {order_id}")
            return
        
        # Update transaction status
        transaction.status = TokenTransactionStatus.COMPLETED
        transaction.razorpay_payment_id = payment_id
        transaction.completed_at = datetime.utcnow()
        transaction.updated_at = datetime.utcnow()
        await transaction.save()
        
        # Add tokens to user balance
        user = await User.get(transaction.user_id)
        if user:
            await user.add_tokens(transaction.tokens_purchased)
            logger.info(f"Added {transaction.tokens_purchased} tokens to user {user.email}")
        else:
            logger.error(f"User not found for transaction {transaction.id}")
        
        logger.info(f"Token transaction {transaction.id} completed successfully")
        
    except Exception as e:
        logger.error(f"Error processing token payment capture: {e}")

async def handle_token_payment_failed(payload):
    """Handle failed token payment"""
    payment = payload.get("payment", {})
    payment_id = payment.get("id")
    order_id = payment.get("order_id")
    error_code = payment.get("error_code")
    error_description = payment.get("error_description")
    
    logger.info(f"Token payment failed: {payment_id} for order: {order_id}")
    logger.info(f"Error: {error_code} - {error_description}")
    
    try:
        # Find transaction by payment ID or order ID
        transaction = await TokenTransaction.find_one({
            "$or": [
                {"razorpay_payment_id": payment_id},
                {"razorpay_order_id": order_id}
            ]
        })
        
        if not transaction:
            logger.warning(f"No transaction found for failed payment {payment_id}")
            return
        
        # Update transaction status to failed
        transaction.status = TokenTransactionStatus.FAILED
        transaction.razorpay_payment_id = payment_id
        transaction.updated_at = datetime.utcnow()
        await transaction.save()
        
        logger.info(f"Token transaction {transaction.id} marked as failed")
        
    except Exception as e:
        logger.error(f"Error processing token payment failure: {e}")

async def handle_token_order_paid(payload):
    """Handle when a token order is fully paid"""
    order = payload.get("order", {})
    order_id = order.get("id")
    amount_paid = order.get("amount_paid")
    amount_due = order.get("amount_due")
    
    logger.info(f"Token order paid: {order_id}, paid: {amount_paid}, due: {amount_due}")
    
    # Only process if fully paid
    if amount_due == 0:
        try:
            # Find transaction by order ID
            transaction = await TokenTransaction.find_one({"razorpay_order_id": order_id})
            
            if not transaction:
                logger.warning(f"No transaction found for order {order_id}")
                return
            
            # If not already completed, mark as completed
            if transaction.status != TokenTransactionStatus.COMPLETED:
                transaction.status = TokenTransactionStatus.COMPLETED
                transaction.completed_at = datetime.utcnow()
                transaction.updated_at = datetime.utcnow()
                await transaction.save()
                
                # Add tokens to user balance
                user = await User.get(transaction.user_id)
                if user:
                    await user.add_tokens(transaction.tokens_purchased)
                    logger.info(f"Added {transaction.tokens_purchased} tokens to user {user.email}")
                
                logger.info(f"Token order {order_id} completed via order.paid webhook")
            
        except Exception as e:
            logger.error(f"Error processing token order paid: {e}")

@router.post("/razorpay/test")
async def test_webhook():
    """Test endpoint to verify webhook is working"""
    return {"status": "webhook endpoint is working", "timestamp": datetime.utcnow().isoformat()}

@router.get("/health")
async def webhook_health():
    """Health check for webhook endpoint"""
    return {
        "status": "healthy",
        "service": "token_webhook",
        "timestamp": datetime.utcnow().isoformat()
    }