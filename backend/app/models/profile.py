from datetime import datetime

from sqlalchemy import Column, DateTime, Enum, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(
        UUID(as_uuid=True),
        ForeignKey("auth.users.id", ondelete="CASCADE"),
        primary_key=True,
    )
    full_name = Column(String, nullable=False, default="")
    email = Column(String, nullable=True)
    phone = Column(String)
    status = Column(
        Enum("active", "inactive", "blocked", name="account_status"),
        nullable=False,
        default="active",
    )
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=datetime.utcnow,
    )
    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=datetime.utcnow,
    )

    roles = relationship(
        "AppRole",
        back_populates="profile",
        foreign_keys="AppRole.user_id",
        primaryjoin="Profile.id == AppRole.user_id",
        cascade="all, delete-orphan",
    )