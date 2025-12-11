import logging

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config import get_settings
from app.models.user import User
from app.schemas.auth import (
    AuthResponse,
    LoginRequest,
    RequestPasswordReset,
    ResetPasswordRequest,
    SignupRequest,
    TenantInfo,
    UserInfo,
    VerifyEmailRequest,
)
from app.services import auth_service, email_service
from app.utils.dependencies import get_current_user, get_db
from app.utils.security import create_access_token

router = APIRouter()

logger = logging.getLogger(__name__)


settings = get_settings()


@router.post("/signup", response_model=AuthResponse)
def signup(
    payload: SignupRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    try:
        token, tenant, user, verification_token = auth_service.signup(db, payload)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )
    except Exception as exc:
        logger.exception("Signup failed while creating tenant")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not create tenant: {exc}",
        )
    background_tasks.add_task(email_service.send_account_creation_email, user, tenant)
    background_tasks.add_task(
        email_service.send_email_verification_email,
        user,
        verification_token,
        settings.frontend_base_url,
    )
    return AuthResponse(
        access_token=token,
        tenant=TenantInfo.from_orm(tenant),
        user=UserInfo.from_orm(user),
    )


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    token, tenant, user = auth_service.login(db, payload)
    if not token or not tenant or not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid credentials")
    return AuthResponse(
        access_token=token,
        tenant=TenantInfo.from_orm(tenant),
        user=UserInfo.from_orm(user),
    )


@router.get("/me", response_model=AuthResponse)
def me(current_user=Depends(get_current_user)):
    token = create_access_token({"sub": str(current_user.id), "tenant_id": str(current_user.tenant.id)})
    return AuthResponse(
        access_token=token,
        tenant=TenantInfo.from_orm(current_user.tenant),
        user=UserInfo.from_orm(current_user),
    )


@router.post("/verify-email")
def verify_email(payload: VerifyEmailRequest, db: Session = Depends(get_db)):
    ok = auth_service.verify_email(db, payload.token)
    if not ok:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token.",
        )
    return {"detail": "Email verified successfully."}


@router.post("/request-password-reset")
def request_password_reset(
    payload: RequestPasswordReset,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    normalized_email = payload.email.strip().lower()
    user = db.query(User).filter(User.email == normalized_email).first()
    if user and user.role == "SUPER_ADMIN":
        return {"detail": "Super admin password resets must be requested at /super-admin/forgot-password."}

    user, token = auth_service.request_password_reset(db, normalized_email)
    if user and token:
        background_tasks.add_task(
            email_service.send_password_reset_email, user, token, settings.frontend_base_url
        )
    return {"detail": "If that email exists, a reset link has been sent."}


@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    ok = auth_service.reset_password(db, payload.token, payload.new_password)
    if not ok:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token.",
        )
    return {"detail": "Password has been reset successfully."}
