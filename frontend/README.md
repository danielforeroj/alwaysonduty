# OnDuty Frontend

Next.js + Tailwind app for the OnDuty SaaS experience.

## Quickstart
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Copy `.env.local.example` to `.env.local` and set:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```
4. Visit the app at `http://localhost:3000`.

## Routes
- Landing page: `/`
- Demo chat: `/try`
- Signup: `/signup`
- Login: `/login`
- Dashboard (requires token in localStorage): `/dashboard`
