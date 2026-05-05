# Code Standards

## General Architecture

- Follow the established Trust-Verify-Act pipeline.
- Maintain strict separation between Next.js (Frontend), FastAPI (Backend), Supabase (Database), and Web3 (Anchoring).
- Prefer clarity over cleverness — code should be easy to understand and maintain.

## Python & FastAPI (Backend)

- Use **Pydantic** strictly for all request/response schemas and LLM structured outputs (e.g., `ExpenseAnalysisRequest`, `PanelVerdict`).
- LangGraph state (`ExpenseGraphState`) is the single source of truth for the pipeline. Do not mutate state outside of defined nodes.
- Fast, non-blocking APIs: Any long-running task (like the 12-node AI graph) must be pushed to a background thread (or async queue) immediately after validation.
- All errors must be logged and handled gracefully, returning a standard `{"status": "error", "message": "..."}` JSON response.

## Next.js (Frontend)

- Default to Server Components where possible, but use `'use client'` aggressively in the `(dashboard)` route group where Zustand and Web3 interactions occur.
- Keep route handlers (`app/api/...`) strictly as proxy layers to hide the FastAPI backend URL from the browser.
- **State Management:** Use **Zustand** (`lib/store/*`) exclusively for complex client-side state. Do not use React Context unless absolutely necessary (like `ThemeProvider`).

## Styling (Binance.US Theme)

- Use design tokens defined in `ui-context.md`.
- Primary Accent: `#F0B90B` (Binance Yellow). Do not introduce new accent colors.
- Use utility-first styling (Tailwind CSS). Avoid arbitrary values unless strictly necessary (e.g., `h-[500px]`).
- Follow the established glassmorphism + dark mode brutalist hierarchy. Pill buttons (`rounded-full`) for CTAs, 12px rounding (`rounded-xl`) for cards.

## Data and Storage (Supabase)

- Supabase PostgreSQL is the single source of truth.
- Do not bypass the FastAPI backend to write directly to Supabase from the frontend unless it is a purely client-side interaction (like profile creation during auth).
- All AI analysis outputs must eventually sync back to Supabase.

## Web3 & Blockchain

- Keep blockchain interactions isolated in `backend/web3_helper.py`.
- Never expose private keys (`WALLET_PRIVATE_KEY`) to the frontend or git history.
- Ensure all Web3 operations handle RPC timeouts and gas limits gracefully.
