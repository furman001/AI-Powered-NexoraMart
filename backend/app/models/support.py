import uuid
from datetime import datetime


from sqlalchemy import (
    Column,
    DateTime,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import UUID


from app.core.database import Base




class SupportMessage(Base):
    __tablename__ = "support_messages"


    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )


    customer_name = Column(
        String(200),
        nullable=False,
    )


    customer_email = Column(
        String(255),
        nullable=False,
    )


    subject = Column(
        String(255),
        nullable=False,
    )


    message_text = Column(
        Text,
        nullable=False,
    )


    status = Column(
        String(50),
        nullable=False,
        default="new",
    )


    created_at = Column(
        DateTime(timezone=True),
        default=datetime.utcnow,
    )