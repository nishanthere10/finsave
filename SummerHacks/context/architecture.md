# Architecture Context

This document outlines the system architecture for **ExpenseAutopsy**.

## System Boundaries

1. **Frontend (Next.js App Router)**
   - Acts as the presentation layer and state container.
   - Communicates with the backend exclusively via Next.js API routes (BFF pattern) to avoid exposing backend URLs to the client.
2. **Backend (FastAPI)**
   - The core logic engine (running on port 8001).
   - Handles AI orchestration, blockchain anchoring, and bank data parsing.
3. **Database (Supabase)**
   - The single source of truth for persistent data (profiles, expenses, challenges, leaderboard).
4. **AI Engine (Gemini + LangGraph)**
   - Stateless analysis engine triggered by the backend.

---

## Core Components

### 1. LangGraph Pipeline (The Brain)
Defined in `backend/graph/expense_graph.py`, this is a 12-node state machine that processes user banking data.
- **State Schema:** `ExpenseGraphState` (TypedDict with 30 fields including `raw_input`, `savings_score`, `monthly_waste`, `agent_analysis`).
- **Flow:** Intake → Vision OCR (optional) → Parsing → Categorization → Spending Calc → Score Calc → Projection → Mirror Prediction → Habit Analysis → Trigger Psych → Trend Forecasting → Coaching.
- **Execution:** Currently executed in a background thread; accessed via polling.

### 2. Authentication (Migrating to Clerk)
- Frontend handles user sessions via `@clerk/nextjs`.
- Backend verifies Clerk JWT tokens for protected routes.

### 3. State Management (Frontend)
Zustand is used strictly for client-side state, divided into 3 stores:
1. `useAnalysisStore`: Manages the AI pipeline progress and results.
2. `useDashboardStore`: Holds all dashboard metrics (waste, 5-year loss, insights).
3. `useAppStore`: Persisted global state (e.g., wallet address).

### 4. Web3 Escrow
- **Current:** `backend/web3_helper.py` sends a 0-ETH transaction on Sepolia containing a SHA-256 hash of the challenge.
- **Target:** A deployed Solidity contract handling true ETH locking and burning based on backend verification signatures.

---

## API Contracts

All backend APIs should follow a standard RESTful structure:
- `POST /api/expense-analysis/submit` -> Returns `payload_id`
- `GET /api/expense-analysis/status/{id}` -> Returns `status` and `result` object.
- `POST /api/challenge/create` -> Creates DB entry and anchors to chain.
- `POST /api/verify/submit` -> Verifies Month 2 data against Month 1.
