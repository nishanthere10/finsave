# Summary: Clerk Authentication Migration (Phase 01)

This document provides a detailed technical breakdown of the migration from legacy Supabase phone-based authentication to **Clerk Managed Authentication**. 

## 🎯 The Objective
Transition the ExpenseAutopsy platform to a production-grade, secure authentication system that eliminates client-side vulnerabilities (like `localStorage` reliance) and enforces server-side identity verification via JWTs (JSON Web Tokens).

---

## 🏗️ Architectural Overview
The system now uses a **Server-Side Verification** model:
1. **Frontend:** Clerk handles the login/session. It provides a JWT to the client.
2. **Next.js Proxy:** Client calls Next.js `/api/*` routes. Next.js extracts the session token.
3. **Backend:** Next.js forwards the token to FastAPI. FastAPI verifies the token's signature against Clerk's public keys (JWKS) and extracts the `user_id`.

---

## 💻 Frontend Changes (Next.js)

### 1. Root Integration & Theme
- **File:** `my-app/app/layout.tsx`
- **Change:** Wrapped the entire application in `<ClerkProvider>`.
- **Learning:** Configured `appearance` to match the **Binance.US aesthetic** (Dark mode, `#F0B90B` primary yellow), ensuring the auth UI feels native to the app.

### 2. Route Protection (Middleware)
- **File:** `my-app/middleware.ts`
- **Change:** Implemented `clerkMiddleware` to protect all routes under `/(dashboard)/*`.
- **Learning:** This prevents unauthenticated users from even hitting the dashboard page logic, redirecting them to login automatically.

### 3. Identity Management (LocalStorage Purge)
- **Files:** `app/onboarding/page.tsx`, `app/commit/page.tsx`, `components/dashboard/Header.tsx`
- **Change:** Removed `localStorage.getItem("ea_user_id")`. Replaced it with the `useUser()` hook from `@clerk/nextjs`.
- **Learning:** Using `localStorage` for IDs is insecure as it can be easily manipulated. `useUser()` provides a reactive, server-validated user object.

### 4. API Proxy Hardening
- **File:** `app/api/analysis/submit/route.ts`
- **Change:** Used `auth()` to get the `userId` server-side and forwarded the session token to the backend in the `Authorization` header.
- **Learning:** By using server-side `auth()`, we ensure the `userId` sent to the backend is the one actually logged in, not a spoofed ID from a client request body.

---

## 🐍 Backend Changes (FastAPI)

### 1. JWT Verification Middleware
- **File:** `backend/utils/auth.py`
- **Change:** Created `verify_clerk_token()`. It fetches Clerk's public keys from `/.well-known/jwks.json`, verifies the JWT signature, and checks the expiration.
- **Learning:** This is the "Gold Standard" for security. The backend doesn't need to call Clerk for every request; it can verify the token cryptographically using the public keys.

### 2. Route Protection (Dependency Injection)
- **Files:** `backend/routes/*.py`
- **Change:** Added `user_id: str = Depends(verify_clerk_token)` to every sensitive endpoint.
- **Learning:** FastAPI's `Depends` system automatically runs the verification logic. If the token is missing or invalid, it returns `401 Unauthorized` before the route logic even executes.

### 3. Removing "Body-Based" User IDs
- **Change:** Removed `user_id` from Pydantic request models. 
- **Learning:** We no longer trust the client to tell us who they are in the JSON body. We trust only the `sub` claim inside the verified JWT.

---

## 🔄 The Sync Mechanism (Clerk → Supabase)
- **File:** `app/api/webhook/clerk/route.ts`
- **Mechanism:** A Webhook listener using `svix` for signature verification.
- **Action:** When a user signs up on Clerk, Clerk sends a "user.created" event. Our webhook catches this and automatically inserts a new row into the Supabase `profiles` table.
- **Result:** Keeps our application database in sync with the Auth provider without manual intervention.

---

## 🔑 Key Learnings for Implementation
1. **Never trust the client:** Always verify identity on the server using headers, not request bodies.
2. **JWKS is efficient:** Verifying JWTs locally using public keys is much faster than making an API call to Clerk for every request.
3. **Middleware is the first line of defense:** Use it to gate-keep sensitive UI segments.
4. **Webhooks provide loose coupling:** They allow you to use a specialized Auth service (Clerk) while maintaining your own user data in your own DB (Supabase).

---

## 🚀 Final State
The application is now **Enterprise Secure**. All existing dashboard features (Analysis, Challenges, Leaderboard) are fully functional but now require a valid Clerk session to operate.
