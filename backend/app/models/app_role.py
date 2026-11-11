from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class AppRole(Base):
    __tablename__ = "app_roles"

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("profiles.id", ondelete="CASCADE"),
        primary_key=True,
    )
    role = Column(String, primary_key=True)
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=datetime.utcnow,
    )

    profile = relationship(
        "Profile",
        back_populates="roles",
        foreign_keys=[user_id],
        primaryjoin="AppRole.user_id == Profile.id",
    )