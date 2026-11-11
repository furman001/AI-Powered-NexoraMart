import os
import uuid
from datetime import datetime


from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    status,
)
from sqlalchemy.orm import Session


from app.api.v1.dependencies import get_current_admin
from app.core.database import get_db
from app.models.setting import SiteSetting
from app.schemas.setting import (
    SiteSettingResponse,
    SiteSettingUpdate,
)




router = APIRouter(
    prefix="/settings",
    tags=["Settings"],
)




UPLOAD_DIR = "uploads"
LOGO_DIR = os.path.join(
    UPLOAD_DIR,
    "logos",
)




def get_site_setting(db: Session):
    setting = (
        db.query(SiteSetting)
        .first()
    )


    if not setting:
        setting = SiteSetting(
            site_name="NexoraMart",
            logo_url=None,
        )


        db.add(setting)
        db.commit()
        db.refresh(setting)


    return setting




@router.get(
    "/public",
    response_model=SiteSettingResponse,
)
def get_public_site_settings(
    db: Session = Depends(get_db),
):
    return get_site_setting(db)




@router.patch(
    "/admin/update",
    response_model=SiteSettingResponse,
)
def update_site_settings(
    settings_data: SiteSettingUpdate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    setting = get_site_setting(db)


    setting.site_name = (
        settings_data.site_name.strip()
    )


    db.commit()
    db.refresh(setting)


    return setting




@router.post(
    "/admin/logo",
    response_model=SiteSettingResponse,
)
async def upload_site_logo(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    allowed_types = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/svg+xml",
    ]


    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only JPG, PNG, WEBP, or SVG images are allowed",
        )


    os.makedirs(LOGO_DIR, exist_ok=True)


    file_extension = os.path.splitext(
        file.filename
    )[1].lower()


    if not file_extension:
        file_extension = ".png"


    file_name = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(
        LOGO_DIR,
        file_name,
    )


    with open(file_path, "wb") as saved_file:
        content = await file.read()
        saved_file.write(content)


    logo_url = f"/uploads/logos/{file_name}"


    setting = get_site_setting(db)
    setting.logo_url = logo_url


    db.commit()
    db.refresh(setting)


    return setting




@router.delete(
    "/admin/logo",
    response_model=SiteSettingResponse,
)
def delete_site_logo(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    setting = get_site_setting(db)


    setting.logo_url = None


    db.commit()
    db.refresh(setting)


    return setting