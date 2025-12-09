from typing import List
from uuid import UUID

from fastapi import APIRouter, BackgroundTasks, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.models.agent import Agent
from app.models.agent_document import AgentDocument
from app.schemas.agent import AgentCreate, AgentUpdate, AgentResponse, KnowledgeDocumentMetadata
from app.services import email_service
from app.utils.dependencies import get_current_user, get_db

router = APIRouter()


def _slugify(name: str) -> str:
    base = name.strip().lower()
    base = "-".join(part for part in base.split() if part)
    return base or "agent"


def _ensure_unique_slug(db: Session, tenant_id, base_slug: str) -> str:
    slug = base_slug
    counter = 2
    while (
        db.query(Agent)
        .filter(Agent.slug == slug, Agent.tenant_id == tenant_id)
        .first()
        is not None
    ):
        slug = f"{base_slug}-{counter}"
        counter += 1
    return slug


@router.get("", response_model=List[AgentResponse])
def list_agents(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    agents = (
        db.query(Agent)
        .filter(Agent.tenant_id == current_user.tenant.id)
        .order_by(Agent.created_at.desc())
        .all()
    )
    return agents


@router.post("", response_model=AgentResponse, status_code=status.HTTP_201_CREATED)
def create_agent(
    payload: AgentCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    tenant_id = current_user.tenant.id

    base_slug = payload.slug or _slugify(payload.name)
    slug = _ensure_unique_slug(db, tenant_id=tenant_id, base_slug=base_slug)

    agent = Agent(
        tenant_id=tenant_id,
        name=payload.name,
        slug=slug,
        status=payload.status,
        job_and_company_profile=payload.job_and_company_profile.dict(),
        customer_profile=payload.customer_profile.dict(),
        data_profile=payload.data_profile.dict() if payload.data_profile else None,
        allowed_websites=[w.dict() for w in (payload.allowed_websites or [])],
    )
    db.add(agent)
    db.commit()
    db.refresh(agent)

    # Notify tenant user via email (Resend)
    background_tasks.add_task(
        email_service.send_agent_configuration_email,
        current_user,
        current_user.tenant,
        agent,
    )

    return agent


@router.get("/{agent_id}", response_model=AgentResponse)
def get_agent(
    agent_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    agent = (
        db.query(Agent)
        .filter(Agent.id == agent_id, Agent.tenant_id == current_user.tenant.id)
        .first()
    )
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent


@router.put("/{agent_id}", response_model=AgentResponse)
def update_agent(
    agent_id: UUID,
    payload: AgentUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    agent = (
        db.query(Agent)
        .filter(Agent.id == agent_id, Agent.tenant_id == current_user.tenant.id)
        .first()
    )
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    if payload.name is not None:
        agent.name = payload.name
    if payload.status is not None:
        agent.status = payload.status
    if payload.job_and_company_profile is not None:
        agent.job_and_company_profile = payload.job_and_company_profile.dict()
    if payload.customer_profile is not None:
        agent.customer_profile = payload.customer_profile.dict()
    if payload.data_profile is not None:
        agent.data_profile = payload.data_profile.dict()
    if payload.allowed_websites is not None:
        agent.allowed_websites = [w.dict() for w in payload.allowed_websites]

    db.commit()
    db.refresh(agent)
    return agent


@router.delete("/{agent_id}", response_model=AgentResponse)
def disable_agent(
    agent_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    agent = (
        db.query(Agent)
        .filter(Agent.id == agent_id, Agent.tenant_id == current_user.tenant.id)
        .first()
    )
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    agent.status = "disabled"
    db.commit()
    db.refresh(agent)
    return agent


# -------- Documents --------

@router.get("/{agent_id}/documents", response_model=List[KnowledgeDocumentMetadata])
def list_agent_documents(
    agent_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    agent = (
        db.query(Agent)
        .filter(Agent.id == agent_id, Agent.tenant_id == current_user.tenant.id)
        .first()
    )
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    docs = (
        db.query(AgentDocument)
        .filter(AgentDocument.agent_id == agent_id)
        .order_by(AgentDocument.created_at.desc())
        .all()
    )
    return [
        KnowledgeDocumentMetadata(
            id=doc.id,
            filename=doc.filename,
            content_type=doc.content_type,
            size_bytes=doc.size_bytes,
        )
        for doc in docs
    ]


MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB


@router.post("/{agent_id}/documents", response_model=KnowledgeDocumentMetadata)
async def upload_agent_document(
    agent_id: UUID,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    agent = (
        db.query(Agent)
        .filter(Agent.id == agent_id, Agent.tenant_id == current_user.tenant.id)
        .first()
    )
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    data = await file.read()
    if len(data) > MAX_DOCUMENT_SIZE_BYTES:
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")

    doc = AgentDocument(
        agent_id=agent.id,
        filename=file.filename,
        content_type=file.content_type or "application/octet-stream",
        size_bytes=len(data),
        data=data,
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    return KnowledgeDocumentMetadata(
        id=doc.id,
        filename=doc.filename,
        content_type=doc.content_type,
        size_bytes=doc.size_bytes,
    )


@router.delete("/{agent_id}/documents/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_agent_document(
    agent_id: UUID,
    document_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    agent = (
        db.query(Agent)
        .filter(Agent.id == agent_id, Agent.tenant_id == current_user.tenant.id)
        .first()
    )
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    doc = (
        db.query(AgentDocument)
        .filter(AgentDocument.id == document_id, AgentDocument.agent_id == agent_id)
        .first()
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    db.delete(doc)
    db.commit()
    return None
