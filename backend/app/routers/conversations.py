from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from uuid import UUID

from app.schemas.conversation import ConversationDetail, ConversationOut
from app.services import conversation_service
from app.utils.dependencies import get_current_user, get_db

router = APIRouter()


@router.get("", response_model=list[ConversationOut])
def list_conversations(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    conversations = conversation_service.list_conversations(
        db, tenant_id=current_user.tenant.id, page=page, page_size=page_size
    )
    return conversations


@router.get("/{conversation_id}", response_model=ConversationDetail)
def get_conversation_detail(
    conversation_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    conversation = conversation_service.get_conversation(
        db, tenant_id=current_user.tenant.id, conversation_id=conversation_id
    )
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversation
