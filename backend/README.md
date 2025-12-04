# OnDuty Backend

FastAPI backend for the multi-tenant OnDuty platform.

## Setup

1. Create and activate a virtual environment.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Copy `.env.example` to `.env` and set values for:
   - `DATABASE_URL`
   - `BACKEND_JWT_SECRET`
   - `BACKEND_JWT_ALGORITHM`

## Database & Migrations

Ensure your `DATABASE_URL` points to a Postgres instance.
Run database migrations:

```bash
alembic upgrade head
```

## Running the Server

Start the development server with:

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.
