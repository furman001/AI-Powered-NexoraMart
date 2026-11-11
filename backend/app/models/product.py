import uuid
from datetime import datetime
from decimal import Decimal


from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import ENUM, JSONB, UUID
from sqlalchemy.orm import relationship


from app.core.database import Base
from app.models.review import ProductReview




product_status_enum = ENUM(
    "draft",
    "published",
    "hidden",
    "archived",
    name="product_status",
    create_type=False,
)




class Product(Base):
    __tablename__ = "products"


    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )


    category_id = Column(
        UUID(as_uuid=True),
        ForeignKey("categories.id"),
        nullable=True,
    )


    brand_id = Column(
        UUID(as_uuid=True),
        nullable=True,
    )


    name = Column(Text, nullable=False)
    slug = Column(Text, nullable=False, unique=True)
    sku = Column(Text, nullable=True)
    short_description = Column(Text, nullable=True)
    description = Column(Text, nullable=True)


    status = Column(
        "status",
        product_status_enum,
        nullable=False,
        server_default="draft",
    )


    regular_price = Column(
        Numeric(12, 2),
        nullable=False,
    )


    sale_price = Column(
        Numeric(12, 2),
        nullable=True,
    )


    cost_price = Column(
        Numeric(12, 2),
        nullable=False,
        default=0,
    )


    tax_rate = Column(
        Numeric(5, 2),
        nullable=False,
        default=Decimal("0.00"),
    )


    stock_quantity = Column(
        Integer,
        nullable=False,
        default=0,
    )


    low_stock_threshold = Column(
        Integer,
        nullable=False,
        default=5,
    )


    is_featured = Column(
        Boolean,
        nullable=False,
        default=False,
    )


    track_inventory = Column(
        Boolean,
        nullable=False,
        default=True,
    )


    weight_kg = Column(
        Numeric(10, 3),
        nullable=True,
    )


    specifications = Column(
        JSONB,
        nullable=False,
        default=dict,
    )


    seo_title = Column(Text, nullable=True)
    seo_description = Column(Text, nullable=True)


    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=datetime.utcnow,
    )


    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )


    price = Column(
        Numeric(12, 2),
        nullable=True,
    )


    stock = Column(
        Integer,
        nullable=True,
        default=0,
    )


    image_url = Column(
        String(500),
        nullable=True,
    )


    images = Column(
        JSONB,
        nullable=False,
        default=list,
    )


    video_url = Column(
        String(500),
        nullable=True,
    )


    is_active = Column(
        Boolean,
        nullable=True,
        default=True,
    )


    category = relationship(
        "Category",
        back_populates="products",
    )


    reviews = relationship(
        "ProductReview",
        back_populates="product",
        cascade="all, delete-orphan",
    )


    questions = relationship(
        "ProductQuestion",
        back_populates="product",
        cascade="all, delete-orphan",
    )
    