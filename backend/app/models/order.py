import uuid
from datetime import datetime


from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship


from app.core.database import Base




class Order(Base):
    __tablename__ = "orders"


    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )


    customer_name = Column(
        String(200),
        nullable=False,
    )


    customer_phone = Column(
        String(30),
        nullable=False,
    )


    customer_email = Column(
        String(200),
        nullable=True,
    )


    shipping_address = Column(
        Text,
        nullable=False,
    )


    shipping_city = Column(
        String(100),
        nullable=False,
    )


    subtotal = Column(
        Numeric(12, 2),
        nullable=False,
        default=0,
    )


    shipping_fee = Column(
        Numeric(12, 2),
        nullable=False,
        default=0,
    )


    tax_amount = Column(
        Numeric(12, 2),
        nullable=False,
        default=0,
    )


    discount_amount = Column(
        Numeric(12, 2),
        nullable=False,
        default=0,
    )


    total_amount = Column(
        Numeric(12, 2),
        nullable=False,
        default=0,
    )


    status = Column(
        String(30),
        nullable=False,
        default="pending",
    )


    payment_status = Column(
        String(30),
        nullable=False,
        default="unpaid",
    )


    payment_method = Column(
        String(50),
        nullable=True,
    )


    created_at = Column(
        DateTime(timezone=True),
        default=datetime.utcnow,
    )


    updated_at = Column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )


    items = relationship(
        "OrderItem",
        back_populates="order",
        cascade="all, delete-orphan",
    )




class OrderItem(Base):
    __tablename__ = "order_items"


    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )


    order_id = Column(
        UUID(as_uuid=True),
        ForeignKey(
            "orders.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )


    product_id = Column(
        UUID(as_uuid=True),
        ForeignKey(
            "products.id",
            ondelete="SET NULL",
        ),
        nullable=True,
    )


    product_name = Column(
        String(200),
        nullable=False,
    )


    quantity = Column(
        Integer,
        nullable=False,
    )


    unit_price = Column(
        Numeric(12, 2),
        nullable=False,
    )


    total_price = Column(
        "line_total",
        Numeric(12, 2),
        nullable=False,
    )


    order = relationship(
        "Order",
        back_populates="items",
    )




class OrderStatusHistory(Base):
    __tablename__ = "order_status_history"


    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )


    order_id = Column(
        UUID(as_uuid=True),
        ForeignKey(
            "orders.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )


    previous_status = Column(
        String(50),
        nullable=True,
    )


    new_status = Column(
        String(50),
        nullable=False,
    )


    changed_by = Column(
        String(200),
        nullable=True,
    )


    created_at = Column(
        DateTime(timezone=True),
        default=datetime.utcnow,
    )


    order = relationship(
        "Order",
        backref="status_history",
    )