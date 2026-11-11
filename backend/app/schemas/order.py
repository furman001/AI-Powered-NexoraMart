from datetime import datetime
from decimal import Decimal
from uuid import UUID


from enum import Enum


from pydantic import (
    BaseModel,
    EmailStr,
    Field,
)




class OrderStatus(str, Enum):
    pending = "pending"
    confirmed = "confirmed"
    processing = "processing"
    shipped = "shipped"
    delivered = "delivered"
    cancelled = "cancelled"




class OrderStatusUpdate(BaseModel):
    status: OrderStatus




class OrderItemCreate(BaseModel):
    product_id: UUID
    quantity: int = Field(gt=0)
    price: Decimal = Field(gt=0)




class OrderCreate(BaseModel):
    customer_name: str = Field(
        min_length=1,
        max_length=200,
    )


    customer_phone: str = Field(
        min_length=5,
        max_length=30,
    )


    customer_email: EmailStr | None = None


    shipping_address: str = Field(
        min_length=5,
    )


    shipping_city: str = Field(
        min_length=1,
        max_length=100,
    )


    items: list[OrderItemCreate]




class OrderItemResponse(BaseModel):
    id: UUID
    product_id: UUID | None
    product_name: str
    quantity: int
    unit_price: Decimal
    total_price: Decimal


    class Config:
        from_attributes = True




class OrderResponse(BaseModel):
    id: UUID
    customer_name: str
    customer_phone: str
    customer_email: EmailStr | None = None
    shipping_address: str
    shipping_city: str
    subtotal: Decimal
    shipping_fee: Decimal
    tax_amount: Decimal
    discount_amount: Decimal
    total_amount: Decimal
    status: str
    payment_status: str
    payment_method: str | None
    created_at: datetime
    items: list[OrderItemResponse]


    class Config:
        from_attributes = True




class OrderStatusHistoryResponse(BaseModel):
    id: UUID
    order_id: UUID
    previous_status: str | None
    new_status: str
    changed_by: str | None
    created_at: datetime


    class Config:
        from_attributes = True