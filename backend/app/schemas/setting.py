from datetime import datetime
from uuid import UUID


from pydantic import BaseModel, Field




class SiteSettingResponse(BaseModel):
    id: UUID
    site_name: str
    logo_url: str | None
    updated_at: datetime


    class Config:
        from_attributes = True




class SiteSettingUpdate(BaseModel):
    site_name: str = Field(
        min_length=1,
        max_length=200,
    )