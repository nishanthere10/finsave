# 01 — Authentication Migration (Clerk)

## Goal

Migrate the existing frontend Supabase OTP authentication flow (`app/login/page.tsx`) to a robust, managed Clerk authentication system. Secure both the Next.js frontend routes and the FastAPI backend endpoints using Clerk JWTs.

---

## Design

Authentication must adhere to the **Binance.US aesthetic**:
- Overwrite Clerk's default appearance variables to match the dark theme (`#1E2026` background, `#F0B90B` primary button).
- Ensure a seamless, highly professional auth modal.

### Navigation Behavior
- Unauthenticated users → Redirected to `/` (Landing Page) or `/sign-in`
- Authenticated users → Directed to `/(dashboard)/dashboard`

---

## Implementation Plan

### Part A — Clean Up Legacy Auth
1. Remove or refactor `app/login/page.tsx` which currently holds the Supabase phone OTP flow.
2. Remove unused Supabase Auth utility functions from `lib/supabase.ts` (keep the DB functions for profiles/expenses).

### Part B — Frontend (Clerk Integration)
1. Install `@clerk/nextjs` (Done).
2. Wrap the root `app/layout.tsx` with `<ClerkProvider>`.
3. Configure `ClerkProvider` appearance:
   ```javascript
   appearance={{
     variables: {
       colorPrimary: '#F0B90B',
       colorBackground: '#1E2026',
       colorText: 'white'
     }
   }}
   ```
4. Implement `middleware.ts` at the root of `my-app/`:
   - Make `/`, `/sign-in`, `/sign-up`, and `/api/webhook/clerk` public.
   - Protect all `/(dashboard)/*` routes.
5. Add `<UserButton />` to `components/dashboard/Navbar.tsx`.

### Part C — Backend (FastAPI Auth Middleware)
1. Install Clerk Python SDK or JWT verification library (e.g., `PyJWT`, `cryptography`) in `backend/`.
2. Create `backend/utils/auth.py` with a dependency function `verify_clerk_token()`.
   - Extracts the `Authorization: Bearer <token>` header.
   - Verifies the JWT against Clerk's JWKS endpoint.
   - Returns the Clerk `user_id`.
3. Apply this dependency to protected routes in `backend/routes/` (e.g., `/api/challenge/create`, `/api/expense-analysis/submit`).

### Part D — User Sync (Webhook)
1. Implement a Clerk Webhook endpoint in Next.js (`app/api/webhook/clerk/route.ts`).
2. On `user.created` event, insert a new record into the Supabase `profiles` table to keep DB integrity intact.

---

## Dependencies
- `@clerk/nextjs`
- `PyJWT` & `cryptography` (for backend verification)
- `svix` (for webhook signature verification)

---

## Verification Checklist
- [ ] User can sign in via Clerk (OTP/OAuth).
- [ ] Unauthenticated users are kicked out of `/dashboard`.
- [ ] Clerk theme perfectly matches the app's dark mode.
- [ ] Next.js `middleware.ts` correctly protects the dashboard.
- [ ] FastAPI backend successfully extracts and verifies the Clerk JWT.
- [ ] New Clerk users are synced to the Supabase `profiles` table.
