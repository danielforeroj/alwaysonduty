# OnDuty

Minimal SaaS skeleton for the OnDuty multi-tenant AI support platform.

## Project Structure
- `backend/` — FastAPI, Postgres models, and API routes.
- `frontend/` — Next.js + Tailwind marketing site, auth, and dashboard.

## Backend: run locally
1. `cd backend`
2. Create a virtual environment and install deps: `pip install -r requirements.txt`
3. Copy `.env.example` to `.env` and set:
   - `DATABASE_URL` (your Supabase/Postgres URL)
   - `BACKEND_JWT_SECRET` (long random string)
   - `BACKEND_JWT_ALGORITHM` (e.g., `HS256`)
4. Apply migrations: `alembic upgrade head`
5. Start the API: `uvicorn app.main:app --reload`
6. Sanity check: `GET http://localhost:8000/health` returns `{ "status": "ok" }`

## Frontend: run locally
1. `cd frontend`
2. Copy `.env.local.example` to `.env.local` and set `NEXT_PUBLIC_API_BASE_URL` (e.g., `http://localhost:8000`).
3. Install deps: `npm install`
4. Run the dev server: `npm run dev`
5. Open `http://localhost:3000` and browse:
   - `/` landing
   - `/try` demo chat (expects a tenant slug like `demo` to exist on the backend)
   - `/signup` and `/login`
   - `/dashboard` (requires stored JWT)

## Notes
- No secrets are committed; fill in your own environment values.
- CORS is preconfigured for local development. Update the origins in `backend/app/main.py` if hosting frontend elsewhere.
- The AI reply for webchat is stubbed for now.
