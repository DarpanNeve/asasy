from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
from app.models.user import SubscriptionStatus

class SubscriptionCreate(BaseModel):
    plan_id: str

class OrderCreate(BaseModel):
    plan_id: str

class OrderResponse(BaseModel):
    order_id: str
    amount: int
    currency: str
    plan: Dict[str, Any]

class PaymentVerification(BaseModel):
    razorpay_payment_id: str
    razorpay_order_id: str
    razorpay_signature: str

class SubscriptionResponse(BaseModel):
    id: str
    plan_id: str
    plan_name: str
    status: SubscriptionStatus
    active_until: datetime
    created_at: datetime