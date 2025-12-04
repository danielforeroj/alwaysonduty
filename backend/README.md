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
   ```
   Use your own Postgres connection string and a long random JWT secret.
4. Run database migrations:
   ```bash
   alembic upgrade head
   ```
5. Start the API server:
   ```bash
   uvicorn app.main:app --reload
   ```

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
