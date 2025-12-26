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
   STRIPE_PRICE_BASIC=
   STRIPE_PRICE_GROWTH=
   STRIPE_PRICE_PREMIUM=
   FRONTEND_BASE_URL=http://localhost:3000
   RESEND_API_KEY=
   RESEND_FROM_EMAIL="OnDuty <no-reply@alwaysonduty.ai>"
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
- Create products/prices in Stripe and populate the `STRIPE_PRICE_*` env vars with the price IDs for basic, growth, and premium.
- `STRIPE_PRICE_STARTER` is still accepted as a legacy alias for `STRIPE_PRICE_BASIC`, but prefer `STRIPE_PRICE_BASIC`.
- Set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` from your Stripe dashboard.
- `FRONTEND_BASE_URL` is used for Checkout success/cancel URLs.
- On Render, set `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_BASIC`, `STRIPE_PRICE_GROWTH`, and `STRIPE_PRICE_PREMIUM`.

## Transactional email (Resend)
- Set `RESEND_API_KEY` and `RESEND_FROM_EMAIL` to enable signup, verification, and reset notifications.
- Emails are queued in FastAPI background tasks. If keys are missing, requests still succeed but no emails are sent.

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
- `bcrypt` is pinned to a 3.x release because `passlib` expects the legacy `__about__` metadata; redeploy/reinstall after pull
  to ensure the correct wheel is used.
