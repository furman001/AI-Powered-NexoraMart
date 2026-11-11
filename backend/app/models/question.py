import uuid
from datetime import datetime


from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship


from app.core.database import Base




class ProductQuestion(Base):
    __tablename__ = "product_questions"


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


    question_text = Column(
        Text,
        nullable=False,
    )


    status = Column(
        String(50),
        nullable=False,
        default="pending",
    )


    created_at = Column(
        DateTime(timezone=True),
        default=datetime.utcnow,
    )


    product = relationship(
        "Product",
        back_populates="questions",
    )


    answers = relationship(
        "ProductAnswer",
        back_populates="question",
        cascade="all, delete-orphan",
   )




class ProductAnswer(Base):
    __tablename__ = "product_answers"


    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )


    question_id = Column(
        UUID(as_uuid=True),
        ForeignKey(
            "product_questions.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )


    answered_by = Column(
        String(200),
        nullable=False,
    )


    answer_text = Column(
        Text,
        nullable=False,
    )


    created_at = Column(
        DateTime(timezone=True),
        default=datetime.utcnow,
    )


    question = relationship(
        "ProductQuestion",
        back_populates="answers",
    )