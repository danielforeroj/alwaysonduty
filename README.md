# OnDuty

Minimal SaaS skeleton for the OnDuty multi-tenant AI support platform.

## Project Structure

- `backend/` — FastAPI, Postgres models, and API routes.
- `frontend/` — Next.js + Tailwind marketing site, auth, and dashboard.

## Getting Started

### Backend
1. Create a virtual environment.
2. Install deps: `pip install -r backend/requirements.txt`.
3. Copy `backend/.env.example` to `backend/.env` and set env vars.
4. Run migrations: `cd backend && alembic upgrade head`.
5. Start API: `uvicorn app.main:app --reload` (from `backend/`).

### Frontend
1. `cd frontend && npm install`.
2. Copy `.env.local.example` to `.env.local` and set `NEXT_PUBLIC_API_BASE_URL`.
3. Run `npm run dev`.

Backend API is expected at `http://localhost:8000` and frontend at `http://localhost:3000`.
