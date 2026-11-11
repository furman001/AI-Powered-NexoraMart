from datetime import datetime
from uuid import UUID


from pydantic import BaseModel, EmailStr, Field




class SupportMessageCreate(BaseModel):
    customer_name: str = Field(
        min_length=1,
        max_length=200,
    )


    customer_email: EmailStr


    subject: str = Field(
        min_length=1,
        max_length=255,
    )


    message_text: str = Field(
        min_length=1,
        max_length=3000,
    )




class SupportMessageResponse(BaseModel):
    id: UUID
    customer_name: str
    customer_email: str
    subject: str
    message_text: str
    status: str
    created_at: datetime


    class Config:
        from_attributes = True