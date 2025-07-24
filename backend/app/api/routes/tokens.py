from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, Request
from typing import List
import razorpay
import hmac
import hashlib
import traceback
import requests  # <-- Added import

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


# +++ START: New Helper Functions for Currency Conversion +++

def get_currency_from_ip(ip: str) -> str:
    """
    Fetches the currency code from the user's IP address using a free geolocation API.
    Defaults to 'USD' on failure or for local testing.
    """
    # Use a public IP for testing, as '127.0.0.1' won't provide geo-data.
    if ip == "127.0.0.1":
        ip = "8.8.8.8"  # Using Google's public DNS for demonstration purposes.

    try:
        # Using ip-api.com, a free, no-key-required service for IP geolocation.
        response = requests.get(f"http://ip-api.com/json/{ip}?fields=status,message,currency", timeout=5)
        response.raise_for_status()
        data = response.json()
        if data.get("status") == "success" and data.get("currency"):
            # Ensure the currency is supported by Razorpay, otherwise fallback.
            # A comprehensive list is here: https://razorpay.com/docs/payments/international-payments/
            # For this example, we assume common currencies are fine.
            return data["currency"]
    except requests.RequestException as e:
        print(f"IP Geolocation failed for IP {ip}: {e}")

    return "USD"  # Fallback currency


def get_exchange_rate(base_currency: str, target_currency: str) -> float:
    """
    Fetches the exchange rate from ExchangeRate-API.
    Returns 1.0 on failure, effectively keeping the base currency price.
    """
    if base_currency == target_currency:
        return 1.0

    try:
        api_key = settings.EXCHANGE_RATE_API_KEY
        if not api_key:
            raise ValueError("EXCHANGE_RATE_API_KEY is not configured in settings.")

        url = f"https://v6.exchangerate-api.com/v6/{api_key}/latest/{base_currency}"
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        data = response.json()

        if data.get("result") == "success" and target_currency in data.get("conversion_rates", {}):
            return data["conversion_rates"][target_currency]
    except (requests.RequestException, ValueError) as e:
        print(f"Exchange rate fetch failed for {base_currency} to {target_currency}: {e}")

    return 1.0  # Fallback rate


# +++ END: New Helper Functions +++


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
            price_usd=package.price_usd,
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
        request: Request,  # <-- Injected Request to get client IP
        current_user: User = Depends(get_current_user)
):
    """Create a Razorpay order for token purchase with automatic currency conversion."""
    try:
        razorpay_client = get_razorpay_client()

        package = await TokenPackage.get(order_data.package_id)
        if not package or not package.is_active:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Token package not found"
            )

        pricing = package.get_pricing_details()
        base_price_usd = pricing["total_price"]

        # --- Currency Conversion Logic ---
        client_ip = request.client.host
        target_currency = get_currency_from_ip(client_ip)

        exchange_rate = get_exchange_rate("USD", target_currency)
        if exchange_rate == 1.0:
            target_currency = "USD"  # Revert to USD if conversion fails

        # Calculate amount in the smallest unit of the target currency (e.g., paise, cents)
        final_amount_local = int((base_price_usd * exchange_rate) * 100)
        final_currency = target_currency
        # --- End of Logic ---

        import time
        receipt = f"token_{str(current_user.id)[:8]}_{str(package.id)[:8]}_{int(time.time())}"

        order_data_razorpay = {
            "amount": final_amount_local,
            "currency": final_currency,
            "receipt": receipt,
            "notes": {
                "user_id": str(current_user.id),
                "package_id": str(package.id),
                "package_name": package.name,
                "tokens": str(package.tokens),
                "total_price_usd": str(pricing["total_price"]),
                "target_currency": final_currency,
                "exchange_rate": str(exchange_rate)
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
                "pricing": pricing  # Still shows original USD pricing for user reference
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

        package_id = order["notes"]["package_id"]
        package = await TokenPackage.get(package_id)

        if not package:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Token package not found"
            )

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
        transactions = await TokenTransaction.find({"user_id": str(current_user.id)}).sort(
            [("created_at", -1)]).to_list()

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
        # It's better to return a proper HTTP exception for the last endpoint as well
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch transactions: {str(e)}"
        )