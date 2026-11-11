from uuid import UUID


from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session


from app.api.v1.dependencies import get_current_admin
from app.core.database import get_db
from app.models.support import SupportMessage
from app.schemas.support import (
    SupportMessageCreate,
    SupportMessageResponse,
)



router = APIRouter(
    prefix="/support",
    tags=["Support"],
)




@router.post(
    "/messages",
    response_model=SupportMessageResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_support_message(
    message_data: SupportMessageCreate,
    db: Session = Depends(get_db),
):
    message = SupportMessage(
        customer_name=message_data.customer_name.strip(),
        customer_email=message_data.customer_email.strip(),
        subject=message_data.subject.strip(),
        message_text=message_data.message_text.strip(),
        status="new",
    )


    db.add(message)
    db.commit()
    db.refresh(message)


    return message




@router.get(
    "/admin/messages",
    response_model=list[SupportMessageResponse],
)
def get_all_support_messages(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    messages = (
        db.query(SupportMessage)
        .order_by(SupportMessage.created_at.desc())
        .all()
    )


    return messages




@router.patch(
    "/admin/messages/{message_id}/read",
    response_model=SupportMessageResponse,
)
def mark_message_as_read(
    message_id: UUID,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    message = (
        db.query(SupportMessage)
        .filter(SupportMessage.id == message_id)
        .first()
    )


    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Support message not found",
        )


    message.status = "read"


    db.commit()
    db.refresh(message)


    return message




@router.delete(
    "/admin/messages/{message_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_support_message(
    message_id: UUID,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    message = (
        db.query(SupportMessage)
        .filter(SupportMessage.id == message_id)
        .first()
    )


    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Support message not found",
        )


    db.delete(message)
    db.commit()


    return None