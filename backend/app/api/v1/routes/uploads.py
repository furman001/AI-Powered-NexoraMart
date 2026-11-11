import uuid

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
    status,
)

from app.api.v1.dependencies import get_current_admin
from app.core.supabase_client import supabase
from app.models.profile import Profile

router = APIRouter(
    prefix="/uploads",
    tags=["Uploads"],
    dependencies=[Depends(get_current_admin)],
)

ALLOWED_IMAGE_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
}

ALLOWED_VIDEO_TYPES = {
    "video/mp4",
    "video/webm",
    "video/quicktime",
}


@router.post("/product-images")
async def upload_product_images(
    files: list[UploadFile] = File(...),
    current_admin: Profile = Depends(get_current_admin),
):
    uploaded_urls = []

    for file in files:
        file_extension = file.filename.split(".")[-1].lower()
        file_path = f"products/images/{uuid.uuid4()}.{file_extension}"

        file_bytes = await file.read()

        supabase.storage.from_("product-images").upload(
            path=file_path,
            file=file_bytes,
            file_options={
                "content-type": file.content_type,
                "upsert": "false",
            },
        )

        public_url = supabase.storage.from_(
            "product-images"
        ).get_public_url(file_path)

        uploaded_urls.append(public_url)

    return {
        "image_urls": uploaded_urls,
    }


@router.post("/product-video")
async def upload_product_video(
    file: UploadFile = File(...),
    current_admin: Profile = Depends(get_current_admin),
):
    if file.content_type not in ALLOWED_VIDEO_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only MP4, WebM, or MOV videos are allowed",
        )

    file_extension = file.filename.split(".")[-1].lower()
    file_path = f"products/videos/{uuid.uuid4()}.{file_extension}"

    file_bytes = await file.read()

    try:
        supabase.storage.from_("product-videos").upload(
            path=file_path,
            file=file_bytes,
            file_options={
                "content-type": file.content_type,
                "upsert": "false",
            },
        )
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to upload video",
        ) from error

    public_url = supabase.storage.from_(
        "product-videos"
    ).get_public_url(file_path)

    return {
        "video_url": public_url,
    }