# Progress Tracker

**Current Phase:** Phase 1 — Authentication Migration (Clerk) ✅ COMPLETE

---

## 🟢 Completed

### Pre-existing MVP
- Frontend Dashboard, Zustand State, Supabase Schema, 12-node LangGraph, Web3 Anchoring.

### Phase 1 — Authentication (Clerk) ✅ FULLY COMPLETE
- **Part A — Frontend Clerk Integration:**
  - Wrapped `app/layout.tsx` with `<ClerkProvider>` (Binance.US themed).
  - Created `/sign-in` and `/sign-up` catch-all routes.
  - Deleted legacy `app/login/` Supabase OTP page.
- **Part B — Route Protection:**
  - Created `middleware.ts` protecting all `(dashboard)` routes.
  - Public routes: `/`, `/sign-in`, `/sign-up`, `/api/webhook/clerk`.
- **Part C — Navbar UserButton:**
  - Replaced localStorage avatar in `Navbar.tsx` with Clerk `<UserButton />`.
- **Part D — Backend Auth Middleware:**
  - Created `backend/utils/auth.py` with `verify_clerk_token()` (PyJWT + JWKS).
  - Protected all 4 backend route files with `Depends(verify_clerk_token)`.
  - Removed `user_id` from request bodies; extracted from JWT `sub` claim.
- **Part E — Clerk Webhook:**
  - Created `app/api/webhook/clerk/route.ts` with Svix signature verification.
  - On `user.created`, upserts into Supabase `profiles` table.
- **Part F — Frontend API Proxy Hardening:**
  - `app/api/analysis/submit/route.ts` — Uses `auth()` from Clerk.
  - `app/api/leaderboard/route.ts` — Forwards Clerk JWT to FastAPI.
  - `app/api/leaderboard/activity/route.ts` — Same JWT forwarding.
  - Created `app/api/verify/route.ts` — New proxy route.
  - Fixed `app/(dashboard)/verify/page.tsx` — Uses proxy, no direct backend call.
- **Part G — Legacy localStorage Purge:**
  - `app/onboarding/page.tsx` — Uses `useUser()` + Supabase upsert (no `ea_user_id`).
  - `app/commit/page.tsx` — Uses `useUser()` for Clerk user ID.
  - `app/(dashboard)/analysis/page.tsx` — Removed `userId` from request body.
  - `components/dashboard/Header.tsx` — Uses `useUser()` for profile fetching.
  - **0 remaining references to `ea_user_id` in the codebase.**

---

## 🔴 Backlog / Upcoming
- **Phase 2:** Live Web3 Escrow — Solidity smart contract deployment.
- **Phase 4:** Async Backend — Move LangGraph execution to Celery/Redis.
- **Phase 5:** Feature Completion — Month 2 verification logic, WhatsApp bot.

---

## 🟢 Completed (Phase 3)
### Phase 3 — Live Account Aggregator (Setu) ✅ COMPLETE
- Replaced mock Anumati URLs with live Setu `v2/consents` API flow.
- Added `backend/utils/crypto_helper.py` to handle ECDH Curve25519 key generation & JWE Decryption.
- Updated `/api/webhook/setu` to handle `CONSENT_STATUS_UPDATE` and simulate encrypted data session fetches.
- Verified `pii_masking.py` robustly strips emails, UPI IDs, phone numbers, and account refs.

---

## Environment Variables Required
### Frontend (`my-app/.env.local`)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
- `CLERK_WEBHOOK_SECRET` (from Clerk Dashboard → Webhooks)

### Backend (`backend/.env`)
- `CLERK_SECRET_KEY`
