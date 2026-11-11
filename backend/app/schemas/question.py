from datetime import datetime
from uuid import UUID


from pydantic import BaseModel, Field




class QuestionCreate(BaseModel):
    customer_name: str = Field(
        min_length=1,
        max_length=200,
    )


    question_text: str = Field(
        min_length=1,
        max_length=1000,
    )




class AnswerCreate(BaseModel):
    answered_by: str = Field(
        min_length=1,
        max_length=200,
    )


    answer_text: str = Field(
        min_length=1,
        max_length=2000,
    )




class AnswerResponse(BaseModel):
    id: UUID
    question_id: UUID
    answered_by: str
    answer_text: str
    created_at: datetime


    class Config:
        from_attributes = True




class QuestionResponse(BaseModel):
    id: UUID
    product_id: UUID
    customer_name: str
    question_text: str
    status: str
    created_at: datetime
    answers: list[AnswerResponse] = []


    class Config:
        from_attributes = True