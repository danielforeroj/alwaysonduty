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
- Forgot password: `/forgot-password`
- Reset password: `/reset-password?token=...`
- Verify email: `/verify-email?token=...`
- Dashboard (requires token in localStorage): `/dashboard`

## Deploying on Vercel
- Set the project root directory to `frontend`.
- Configure the environment variable in Vercel:
  - `NEXT_PUBLIC_API_BASE_URL` pointing to your public backend URL (e.g., `https://your-backend.example.com`).
- Redeploy to propagate the new configuration.
