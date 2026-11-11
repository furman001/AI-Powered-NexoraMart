import uuid
from datetime import datetime


from sqlalchemy import (
    Column,
    DateTime,
    String,
)
from sqlalchemy.dialects.postgresql import UUID


from app.core.database import Base




class SiteSetting(Base):
    __tablename__ = "site_settings"


    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )


    site_name = Column(
        String(200),
        nullable=False,
        default="NexoraMart",
    )


    logo_url = Column(
        String(500),
        nullable=True,
    )


    updated_at = Column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )