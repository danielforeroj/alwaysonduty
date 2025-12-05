# OnDuty Backend

FastAPI backend for the multi-tenant OnDuty platform.

## Prerequisites
- Python 3.10+
- Postgres connection string (e.g. from Supabase)

## Quickstart
1. Create and activate a virtual environment.
2. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
3. Copy `.env.example` to `.env` and set values for:
   ```env
   DATABASE_URL=
   BACKEND_JWT_SECRET=
   BACKEND_JWT_ALGORITHM=HS256
   STRIPE_SECRET_KEY=
   STRIPE_WEBHOOK_SECRET=
   STRIPE_PRICE_STARTER=
   STRIPE_PRICE_GROWTH=
   STRIPE_PRICE_PREMIUM=
   FRONTEND_BASE_URL=http://localhost:3000
   ```
   Use your own Postgres connection string and a long random JWT secret. Stripe keys and price IDs are optional but required for checkout.
4. Run database migrations:
   ```bash
   alembic upgrade head
   ```
5. Start the API server:
   ```bash
   uvicorn app.main:app --reload
   ```

## Stripe setup
- Create products/prices in Stripe and populate the `STRIPE_PRICE_*` env vars with the price IDs for starter, growth, and premium.
- Set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` from your Stripe dashboard.
- `FRONTEND_BASE_URL` is used for Checkout success/cancel URLs.

## Health Check
The service exposes a simple readiness endpoint:
```
GET /health -> {"status": "ok"}
```

## CORS
`app/main.py` enables CORS for local development (e.g., `http://localhost:3000`). Update the `origins` list there if you host the frontend elsewhere.

## Notes
- JWT settings and database URLs are only loaded from environment variables; no secrets are committed.
- The demo webchat endpoint returns a stubbed AI reply for now.
- Dependencies pin Pydantic below version 2 to match the current settings import style.
