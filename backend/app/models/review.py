import uuid
from datetime import datetime


from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship


from app.core.database import Base




class ProductReview(Base):
    __tablename__ = "product_reviews"


    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )


    product_id = Column(
        UUID(as_uuid=True),
        ForeignKey(
            "products.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )


    customer_name = Column(
        String(200),
        nullable=False,
    )


    rating = Column(
        Integer,
        nullable=False,
    )


    comment = Column(
        Text,
        nullable=True,
    )


    is_approved = Column(
        Boolean,
        default=True,
        nullable=False,
    )


    created_at = Column(
        DateTime(timezone=True),
        default=datetime.utcnow,
    )


    product = relationship(
        "Product",
        back_populates="reviews",
    )