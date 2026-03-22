from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
from app.models.token import TokenPackageType, TokenTransactionStatus

class TokenPackageResponse(BaseModel):
    id: str
    name: str
    package_type: TokenPackageType
    tokens: int
    price_usd: float
    description: str

class TokenPurchaseCreate(BaseModel):
    package_id: str

class TokenOrderResponse(BaseModel):
    order_id: str
    amount: int
    currency: str
    package: Dict[str, Any]

class TokenPaymentVerification(BaseModel):
    razorpay_payment_id: str
    razorpay_order_id: str
    razorpay_signature: str

class UserTokenBalanceResponse(BaseModel):
    total_tokens: int
    used_tokens: int
    available_tokens: int
    updated_at: datetime

class TokenTransactionResponse(BaseModel):
    id: str
    package_name: str
    tokens_purchased: int
    amount_paid: int
    amount_rupees: float
    status: TokenTransactionStatus
    created_at: datetime
    completed_at: Optional[datetime] = None