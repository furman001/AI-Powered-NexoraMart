from datetime import datetime
from uuid import UUID


from pydantic import BaseModel, Field




class ReviewCreate(BaseModel):
    customer_name: str = Field(
        min_length=1,
        max_length=200,
    )


    rating: int = Field(
        ge=1,
        le=5,
    )


    comment: str | None = None




class ReviewResponse(BaseModel):
    id: UUID
    product_id: UUID
    customer_name: str
    rating: int
    comment: str | None
    is_approved: bool
    created_at: datetime


    class Config:
        from_attributes = True