# AI Workflow Rules

## Approach

Build this project using a strict spec-driven workflow. Context files define what to build, how to build it, and the current system state. All implementation must follow these definitions exactly.

The AI acts as an execution engine. It must not infer behavior, redesign systems, or introduce new architecture without explicit permission. Every implementation must be traceable to a defined spec or context file.

## ExpenseAutopsy Specific Rules

1. **LangGraph Pipeline Constraints:**
   - Do NOT add new nodes to the AI pipeline without first updating the `ExpenseGraphState` in `backend/schemas/graph_state.py`.
   - Ensure the "Simulated Crew" prompting structure remains intact (Oracle, Mentor, Future Self).

2. **Frontend UI Constraints:**
   - When generating new UI, do NOT invent new Tailwind color classes. Stick to `bg-background`, `text-foreground`, and the Binance Yellow (`#F0B90B`).
   - If adding new state, use the existing Zustand stores (`useDashboardStore`, `useAnalysisStore`). Do NOT create a new store unless absolutely required.

3. **Backend API Constraints:**
   - All external endpoints must be proxied through the Next.js API layer. The frontend should never directly call `http://localhost:8001`.

## When to Split Work

Split an implementation step if it combines:
- UI changes and backend/API changes
- Multiple unrelated LangGraph nodes
- Database migrations and external API integrations

If a change cannot be verified end-to-end quickly, the scope is too broad — split it.

## Protected Files

Do not modify the following unless explicitly instructed:
- `components/ui/*` — generated UI library components (shadcn/ui)
- `backend/prompts.py` — The core system prompt is highly tuned; do not alter without explicit approval.
- `my-app/CLAUDE.md` — Workflow manifest.

## Keeping Docs in Sync

Update context files whenever changes affect:
- System architecture or boundaries
- Storage model decisions (Supabase schemas)
- LangGraph node additions/removals
- API contracts
