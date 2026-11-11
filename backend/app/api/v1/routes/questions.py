from uuid import UUID


from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session, selectinload


from app.api.v1.dependencies import get_current_admin
from app.core.database import get_db
from app.models.product import Product
from app.models.question import (
    ProductAnswer,
    ProductQuestion,
)
from app.schemas.question import (
    AnswerCreate,
    AnswerResponse,
    QuestionCreate,
    QuestionResponse,
)



router = APIRouter(
    prefix="/questions",
    tags=["Questions"],
)




@router.get(
    "/products/{product_id}",
    response_model=list[QuestionResponse],
)
def get_product_questions(
    product_id: UUID,
    db: Session = Depends(get_db),
):
    questions = (
        db.query(ProductQuestion)
        .options(
            selectinload(ProductQuestion.answers)
        )
        .filter(
            ProductQuestion.product_id == product_id,
            ProductQuestion.status == "answered",
        )
        .order_by(ProductQuestion.created_at.desc())
        .all()
    )


    return questions




@router.post(
    "/products/{product_id}",
    response_model=QuestionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_product_question(
    product_id: UUID,
    question_data: QuestionCreate,
    db: Session = Depends(get_db),
):
    product = (
        db.query(Product)
        .filter(
            Product.id == product_id,
            Product.status == "published",
            Product.is_active == True,
        )
        .first()
    )


    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )


    question = ProductQuestion(
        product_id=product_id,
        customer_name=question_data.customer_name.strip(),
        question_text=question_data.question_text.strip(),
        status="pending",
    )


    db.add(question)
    db.commit()
    db.refresh(question)


    return question




@router.get(
    "/admin/all",
    response_model=list[QuestionResponse],
)
def get_all_questions(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    questions = (
        db.query(ProductQuestion)
        .options(
            selectinload(ProductQuestion.answers)
        )
        .order_by(ProductQuestion.created_at.desc())
        .all()
    )


    return questions




@router.post(
    "/admin/{question_id}/answers",
    response_model=AnswerResponse,
    status_code=status.HTTP_201_CREATED,
)
def answer_question(
    question_id: UUID,
    answer_data: AnswerCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    question = (
        db.query(ProductQuestion)
        .filter(ProductQuestion.id == question_id)
        .first()
    )


    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found",
        )


    answer = ProductAnswer(
        question_id=question_id,
        answered_by=answer_data.answered_by.strip(),
        answer_text=answer_data.answer_text.strip(),
    )


    question.status = "answered"


    db.add(answer)
    db.commit()
    db.refresh(answer)


    return answer




@router.patch(
    "/admin/{question_id}/hide",
    response_model=QuestionResponse,
)
def hide_question(
    question_id: UUID,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    question = (
        db.query(ProductQuestion)
        .filter(ProductQuestion.id == question_id)
        .first()
    )


    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found",
        )


    question.status = "hidden"


    db.commit()
    db.refresh(question)


    return question




@router.delete(
    "/admin/{question_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_question(
    question_id: UUID,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    question = (
        db.query(ProductQuestion)
        .filter(ProductQuestion.id == question_id)
        .first()
    )


    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found",
        )


    db.delete(question)
    db.commit()


    return None