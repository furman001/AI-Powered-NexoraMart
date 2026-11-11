from fastapi import Request
import os

from decimal import Decimal

import stripe

from dotenv import load_dotenv

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.models.order import Order
from sqlalchemy.orm import Session



load_dotenv()



stripe.api_key = os.getenv("STRIPE_SECRET_KEY")



router = APIRouter(
    prefix="/payments",
    tags=["Payments"],
)



class CheckoutRequest(BaseModel):
    order_id: str



@router.post("/create-checkout-session")
def create_checkout_session(
    checkout_data: CheckoutRequest,
    db: Session = Depends(get_db),
):
    order = (
        db.query(Order)
        .options(selectinload(Order.items))
        .filter(Order.id == checkout_data.order_id)
        .first()
    )


    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )


    if order.payment_status == "paid":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This order has already been paid",
        )


    if not order.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This order has no items",
        )


    frontend_url = os.getenv(
        "FRONTEND_URL",
        "http://localhost:5173",
    )


    try:
        checkout_session = stripe.checkout.Session.create(
            mode="payment",
            customer_email=order.customer_email,
            client_reference_id=str(order.id),
            success_url=(
                f"{frontend_url}/payment-success"
                f"?order_id={order.id}"
            ),
            cancel_url=(
                f"{frontend_url}/payment-cancelled"
                f"?order_id={order.id}"
            ),
            line_items=[
                {
                    "quantity": item.quantity,
                    "price_data": {
                        "currency": "pkr",
                        "unit_amount": int(
                            item.unit_price * 100
                        ),
                        "product_data": {
                            "name": item.product_name,
                        },
                    },
                }
                for item in order.items
            ],
            metadata={
                "order_id": str(order.id),
            },
        )
    except Exception as stripe_error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not create payment session: {stripe_error}",
        )


    return {
        "checkout_url": checkout_session.url,
        "order_id": str(order.id),
    }

@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    db: Session = Depends(get_db),
):
    payload = await request.body()
    signature = request.headers.get("stripe-signature")

    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

    if not webhook_secret:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Stripe webhook secret is not configured",
        )

    try:
        event = stripe.Webhook.construct_event(
            payload,
            signature,
            webhook_secret,
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid Stripe webhook signature",
        )

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]

        order_id = (
            session.get("metadata", {}).get("order_id")
            or session.get("client_reference_id")
        )

        if order_id:
            order = (
                db.query(Order)
                .filter(Order.id == order_id)
                .first()
            )

            if order:
                order.payment_status = "paid"
                order.payment_method = "card"

                db.commit()

    return {"received": True}
