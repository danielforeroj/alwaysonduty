import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import (
    agents,
    auth,
    billing,
    conversations,
    customers,
    dashboard,
    end_user_verification,
    health,
    super_admin,
    webchat,
)
from app.services.super_admin_seed import ensure_super_admins

app = FastAPI(title="OnDuty API")

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://alwaysonduty.io",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.alwaysonduty\.io",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    try:
        ensure_super_admins()
    except Exception:
        logging.getLogger(__name__).exception("Failed to seed super admin users")

app.include_router(health.router)
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(billing.router, prefix="/api/billing", tags=["billing"])
app.include_router(webchat.router, prefix="/api/webchat", tags=["webchat"])
app.include_router(
    end_user_verification.router,
    prefix="/api/end-user-verification",
    tags=["end-user-verification"],
)
app.include_router(conversations.router, prefix="/api/conversations", tags=["conversations"])
app.include_router(customers.router, prefix="/api/customers", tags=["customers"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(agents.router, prefix="/api/agents", tags=["agents"])
app.include_router(super_admin.router, prefix="/api/super-admin", tags=["super-admin"])


@app.get("/")
async def root():
    return {"message": "OnDuty API"}
