 # use whatever path your project already ha
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.v1.dependencies import get_current_admin
from app.core.database import get_db
from app.core.security import create_access_token
from app.core.supabase_client import supabase
from app.models.app_role import AppRole
from app.models.profile import Profile
from app.schemas.auth import (
    AdminProfileResponse,
    TokenResponse,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/token", response_model=TokenResponse)
def admin_login_for_swagger(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    try:
        auth_response = supabase.auth.sign_in_with_password(
            {
                "email": form_data.username,
                "password": form_data.password,
            }
        )
    except Exception as error:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        ) from error

    user = auth_response.user

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    profile = (
        db.query(Profile)
        .filter(Profile.id == user.id)
        .first()
    )

    admin_role = (
        db.query(AppRole)
        .filter(
            AppRole.user_id == user.id,
            AppRole.role == "admin",
        )
        .first()
    )

    if not profile or not admin_role:
        raise HTTPException(
            status_code=403,
            detail="Admin access required",
        )

    access_token = create_access_token(
        subject=str(user.id),
        role="admin",
    )

    return TokenResponse(
        access_token=access_token,
        expires_in=3600,
    )


@router.get("/me", response_model=AdminProfileResponse)
def get_admin_profile(
    current_admin: Profile = Depends(get_current_admin),
):
    return AdminProfileResponse(
        id=str(current_admin.id),
        email=current_admin.email or "",
        full_name=current_admin.full_name or "",
        role="admin",
    )