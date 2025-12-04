from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from uuid import UUID

from app.schemas.customer import CustomerOut
from app.services import customer_service
from app.utils.dependencies import get_current_user, get_db

router = APIRouter()


@router.get("", response_model=list[CustomerOut])
def list_customers(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    customers = customer_service.list_customers(db, tenant_id=current_user.tenant.id, page=page, page_size=page_size)
    return customers


@router.get("/{customer_id}", response_model=CustomerOut)
def get_customer_detail(
    customer_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    customer = customer_service.get_customer(db, tenant_id=current_user.tenant.id, customer_id=customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer
