from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.auth import AuthResponse, LoginRequest, SignupRequest, TenantInfo, UserInfo
from app.services import auth_service
from app.utils.dependencies import get_current_user, get_db
from app.utils.security import create_access_token

router = APIRouter()


@router.post("/signup", response_model=AuthResponse)
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    try:
        token, tenant, user = auth_service.signup(db, payload)
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Could not create tenant")
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
