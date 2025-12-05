from typing import Optional
from sqlalchemy.orm import Session

from app.models.channel_identity import ChannelIdentity
from app.models.customer import Customer

def get_or_create_customer(db: Session, tenant_id, channel: str, external_id: str) -> Customer:
    identity = (
        db.query(ChannelIdentity)
        .filter(
            ChannelIdentity.tenant_id == tenant_id,
            ChannelIdentity.channel == channel,
            ChannelIdentity.external_id == external_id,
        )
        .first()
    )
    if identity:
        customer = identity.customer
    else:
        customer = Customer(tenant_id=tenant_id)
        db.add(customer)
        db.commit()
        db.refresh(customer)
        identity = ChannelIdentity(
            tenant_id=tenant_id,
            customer_id=customer.id,
            channel=channel,
            external_id=external_id,
        )
        db.add(identity)
        db.commit()
        db.refresh(identity)
    return customer

def list_customers(db: Session, tenant_id, page: int = 1, page_size: int = 20):
    offset = (page - 1) * page_size
    return (
        db.query(Customer)
        .filter(Customer.tenant_id == tenant_id)
        .order_by(Customer.created_at.desc())
        .offset(offset)
        .limit(page_size)
        .all()
    )

def get_customer(db: Session, tenant_id, customer_id) -> Optional[Customer]:
    return (
        db.query(Customer)
        .filter(Customer.tenant_id == tenant_id, Customer.id == customer_id)
        .first()
    )
