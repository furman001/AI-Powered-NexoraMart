from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, Field

from enum import Enum

class ProductStatus(str, Enum):
    draft = "draft"
    published = "published"
    archived = "archived"


class ProductCreate(BaseModel):
    category_id: UUID
    name: str = Field(min_length=1, max_length=200)
    description: str | None = None
    price: Decimal = Field(gt=0)
    cost_price: Decimal = Field(default=0, ge=0)
    stock: int = Field(ge=0, default=0)
    image_url: str | None = None
    images: list[str] = []
    video_url: str | None = None
    is_active: bool = True


class ProductUpdate(BaseModel):
    category_id: UUID | None = None
    name: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = None
    price: Decimal | None = Field(default=None, gt=0)
    cost_price: Decimal | None = Field(default=None, ge=0)
    stock: int | None = Field(default=None, ge=0)
    image_url: str | None = None
    images: list[str] | None = None
    video_url: str | None = None
    status: ProductStatus | None = None
    model_url: str | None = None
    is_active: bool | None = None
    


class ProductResponse(BaseModel):
    id: UUID
    category_id: UUID | None = None
    name: str
    slug: str
    description: str | None = None
    status: ProductStatus
    regular_price: Decimal
    price: Decimal | None = None
    cost_price: Decimal | None = None
    tax_rate: Decimal | None = None
    stock_quantity: int
    stock: int | None = None
    image_url: str | None = None
    images: list[str] = []
    video_url: str | None = None
    is_active: bool | None = None
    created_at: datetime
    updated_at: datetime
    average_rating: float | None = None
    review_count: int = 0