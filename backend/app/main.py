from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, billing, conversations, customers, health, webchat

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
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(billing.router, prefix="/api/billing", tags=["billing"])
app.include_router(webchat.router, prefix="/api/webchat", tags=["webchat"])
app.include_router(conversations.router, prefix="/api/conversations", tags=["conversations"])
app.include_router(customers.router, prefix="/api/customers", tags=["customers"])


@app.get("/")
async def root():
    return {"message": "OnDuty API"}
