# ExpenseAutopsy — Comprehensive Project Report

**Generated:** 2026-05-04 | **Team:** PERSISTENCE | **Event:** SummerHacks 2026

---

## 1. Product Identity

**Name:** ExpenseAutopsy
**Tagline:** A brutal financial accountability protocol that dissects bad spending habits and forces discipline through smart contracts.
**Platform:** Web Application (Mobile-responsive Dashboard)
**Target Users:** Gen-Z, young professionals struggling with impulse buying and "doom-spending."

### 1.1 The Problem
Most personal finance apps passively track expenses with pie charts but fail to change behavior. There are no real consequences for failing to stick to a budget.

### 1.2 The Solution
ExpenseAutopsy acts as a harsh financial trainer. It:
1. **Autopsies** spending using AI to find psychological triggers ("Trigger Genome").
2. **Calculates** the devastating long-term compound loss of poor habits ("5-Year Loss").
3. **Enforces** discipline via a Smart Contract "Commitment Protocol" where users stake real ETH that gets locked/burned if they fail to improve.

---

## 2. Technology Stack

### 2.1 Frontend
| Technology | Version | Purpose |
|---|---|---|
| Next.js (App Router) | 16.2.4 | Core framework, SSR, file-based routing |
| React | 19.2.4 | UI rendering |
| TypeScript | ^5 | Type safety |
| Tailwind CSS | v4 | Styling (Binance.US inspired design system) |
| Zustand | 5.0.12 | Client state management (3 stores) |
| Framer Motion | 12.38.0 | Animations and transitions |
| Recharts | 3.8.1 | Money Mirror & trajectory charts |
| ethers.js | 6.16.0 | Web3 wallet interactions |
| @supabase/supabase-js | 2.103.3 | Database client (profiles, challenges, expenses, triggers) |
| @supabase/ssr | 0.10.2 | Server-side Supabase |
| Lucide React | 1.8.0 | Icons |
| Radix UI | 1.4.3 | Accessible primitives |
| shadcn | 4.3.0 | Component library |
| react-countup | 6.5.3 | Animated number displays |
| Sonner | 2.0.7 | Toast notifications |
| Groq SDK | 0.3.2 | Additional AI capabilities |
| OGL | 1.0.11 | WebGL effects (Aurora component) |
| Fonts | Inter, Geist, Geist Mono | Typography via next/font/google |

### 2.2 Backend
| Technology | Purpose |
|---|---|
| FastAPI | Python web framework (v3.0.0) |
| Uvicorn | ASGI server (port 8001) |
| LangGraph | AI pipeline orchestration (StateGraph) |
| langchain-community | LLM integrations |
| google-generativeai | Gemini 1.5 Pro / Flash for analysis & vision OCR |
| Pydantic | Request/response validation, strict JSON enforcement |
| Supabase (Python) | Database persistence |
| web3.py | Blockchain anchoring (Sepolia testnet) |
| RapidFuzz | Fuzzy merchant name matching |
| faster-whisper | Audio transcription capability |
| python-multipart | File upload handling |
| sse-starlette | Server-Sent Events |
| python-dotenv | Environment variable management |
| langgraph-checkpoint-sqlite + aiosqlite | Graph state checkpointing |

### 2.3 Infrastructure & External Services
| Service | Role |
|---|---|
| Supabase (PostgreSQL) | Primary database — profiles, expenses, challenges, blockchain_transactions, leaderboard, streaks, activities, triggers, statements |
| Sepolia Testnet | Ethereum testnet for blockchain anchoring |
| Setu Account Aggregator | RBI AA sandbox for bank data fetching (currently mock) |
| Google Gemini API | LLM for all AI analysis |

### 2.4 Environment Variables Required
**Backend (.env):**
- `GEMINI_API_KEY` — Google Gemini API key
- `SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `SUPABASE_KEY` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — Supabase anon key
- `WEB3_RPC_URL` — Ethereum RPC endpoint (default: `https://rpc.sepolia.org`)
- `WALLET_PRIVATE_KEY` — Private key for on-chain transactions
- `WEB3_CHAIN_ID` — Chain ID (default: `11155111` for Sepolia)
- `ESCROW_WALLET_ADDRESS` — Destination wallet for escrow stakes
- `SETU_CLIENT_ID` — Setu AA client ID
- `SETU_SECRET` — Setu AA client secret

**Frontend (.env.local):**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 3. File & Folder Structure

### 3.1 Backend (`backend/`)
```
backend/
├── .env                          # Environment variables (gitignored)
├── .env.example                  # Template for .env
├── .gitignore                    # Python-specific ignores
├── .python-version               # Python version pin
├── main.py                       # FastAPI entrypoint — app factory, CORS, router registration, health check
├── prompts.py                    # "Simulated Crew" system prompt + Pydantic schemas (ExpertThought, PanelVerdict)
├── setu_auth.py                  # Setu AA token exchange (client credentials → bearer token, with caching)
├── state.py                      # Legacy AppState TypedDict (Trust-Verify-Act pipeline)
├── web3_helper.py                # anchor_to_chain() — SHA-256 hash → 0-ETH self-tx on Sepolia
├── test_pipeline.py              # Pipeline test script
├── requirements.txt              # Pip dependencies
├── pyproject.toml                # Project metadata
├── uv.lock                       # UV package manager lockfile
│
├── graph/                        # LangGraph pipeline
│   ├── __init__.py
│   ├── expense_graph.py          # build_expense_graph() — StateGraph definition, 12 nodes, conditional routing
│   └── nodes/                    # Individual pipeline nodes
│       ├── __init__.py
│       ├── intake_node.py        # Validates goal, stipend, raw_input; rejects invalid submissions
│       ├── vision_node.py        # Gemini 1.5 Flash OCR for bank statement images
│       ├── parsing_node.py       # Extracts structured transactions from raw text
│       ├── categorization_node.py# Maps merchants to spending categories
│       ├── spending_node.py      # Calculates spending breakdown, monthly waste
│       ├── savings_score_node.py # Proprietary savings score (0-100)
│       ├── projection_node.py    # 5-year compound interest loss calculation
│       ├── mirror_prediction_node.py    # "Money Mirror" future trajectory prediction
│       ├── habit_analyst_node.py        # Identifies good habits from transaction patterns
│       ├── trigger_psych_node.py        # "Trigger Genome" — psychological spending triggers
│       ├── trend_forecaster_node.py     # Spending trend detection and forecasting
│       ├── structural_coach_node.py     # AI structural coaching recommendations
│       ├── coaching_node.py             # Emotional coaching message generation
│       └── advanced_insights_node.py    # Aggregates all advanced behavioral insights
│
├── routes/                       # FastAPI routers
│   ├── __init__.py
│   ├── expense_analysis.py       # POST /api/expense-analysis/submit, GET /api/expense-analysis/status/{id}
│   ├── setu_aa.py                # POST /api/consent/create, GET /api/consent/status/{id}, POST /api/webhook/setu
│   ├── challenge.py              # POST /api/challenge/create — creates challenge + Web3 escrow lock
│   ├── verification.py           # POST /api/verify/submit — Month 2 verification, escrow unlock, streak update
│   └── leaderboard.py            # GET /api/leaderboard/, GET /api/leaderboard/activity
│
├── schemas/                      # Pydantic models
│   ├── __init__.py
│   ├── graph_state.py            # ExpenseGraphState TypedDict — the LangGraph state schema (30 fields)
│   ├── expense_analysis.py       # ExpenseAnalysisRequest, ExpenseAnalysisResponse
│   └── user.py                   # UserOnboardRequest, UserProfileResponse
│
├── services/                     # Business logic services
│   ├── __init__.py
│   ├── advanced_insights_service.py  # generate_advanced_insights() — single LLM pass for all behavioral insights
│   ├── categorization_agent.py       # llm_categorize_transactions() — LLM-based merchant categorization
│   ├── merchant_mapper.py            # categorize_merchant() — hardcoded + fuzzy match fallback
│   ├── pii_masking.py                # mask_pii() — strips UPI IDs, account numbers before LLM
│   ├── rebit_parser.py               # parse_rebit_transactions() — ReBIT JSON → clean expense records
│   ├── savings_score.py              # Savings score calculation logic
│   └── vision_service.py             # extract_transactions_from_image() — Gemini Flash vision
│
└── utils/                        # Shared utilities
    ├── __init__.py
    ├── db.py                     # get_db_client() — Supabase client singleton (raises on missing config)
    ├── category_constants.py     # Hardcoded merchant-to-category map and category lists
    └── ocr.py                    # extract_text_from_base64() — base64 file → text extraction
```

### 3.2 Frontend (`my-app/`)
```
my-app/
├── .env.local                    # Supabase env vars (gitignored)
├── package.json                  # Dependencies & scripts (dev on port 3002)
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── postcss.config.mjs            # PostCSS + Tailwind
├── eslint.config.mjs             # ESLint configuration
├── components.json               # shadcn/ui configuration
├── DESIGN.md                     # Binance.US inspired design system specification
│
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout — Inter/Geist fonts, ThemeProvider, dark mode script
│   ├── page.tsx                  # Landing page (30KB — full marketing/onboarding page)
│   ├── globals.css               # Global styles & Tailwind imports
│   ├── favicon.ico
│   │
│   ├── login/
│   │   └── page.tsx              # Phone OTP login page
│   │
│   ├── onboarding/
│   │   └── page.tsx              # Goal definition + stipend input (11KB)
│   │
│   ├── data-source/
│   │   └── page.tsx              # Bank selection (HDFC/ICICI mock AA) (8.5KB)
│   │
│   ├── commit/
│   │   └── page.tsx              # Smart contract commitment signing (21KB)
│   │
│   ├── (dashboard)/              # Route group — shared Sidebar + Navbar layout
│   │   ├── layout.tsx            # Dashboard shell — Sidebar + Navbar + scrollable main
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Main dashboard — metrics, score, waste, 5-year loss (23.5KB)
│   │   ├── analysis/
│   │   │   └── page.tsx          # AI analysis pipeline view — processing state (21KB)
│   │   ├── insights/
│   │   │   └── page.tsx          # Detailed AI insights — habits, triggers, coaching (5KB)
│   │   ├── money-mirror/
│   │   │   └── page.tsx          # Money Mirror trajectory chart (5.5KB)
│   │   ├── trajectory/
│   │   │   └── page.tsx          # Financial trajectory visualization (4KB)
│   │   ├── network/
│   │   │   └── page.tsx          # Goal cohort leaderboard + activity feed (14KB)
│   │   ├── protocol/
│   │   │   └── page.tsx          # Commitment protocol management (6KB)
│   │   ├── stake/
│   │   │   └── page.tsx          # ETH staking interface (3KB)
│   │   ├── verify/
│   │   │   └── page.tsx          # Month 2 verification — upload & compare (19KB)
│   │   ├── streaks/
│   │   │   └── page.tsx          # Streak tracking display (8KB)
│   │   └── settings/
│   │       └── page.tsx          # User settings (3KB)
│   │
│   └── api/                      # Next.js API routes (BFF proxy layer)
│       ├── analysis/
│       │   ├── submit/           # Proxies to backend /api/expense-analysis/submit
│       │   ├── status/           # Proxies to backend /api/expense-analysis/status
│       │   └── approve/          # Consent approval proxy
│       └── leaderboard/
│           ├── route.ts          # Proxies to backend /api/leaderboard
│           └── activity/         # Proxies to backend /api/leaderboard/activity
│
├── components/
│   ├── Aurora.tsx                # WebGL aurora background effect (OGL-based)
│   ├── auth/
│   │   ├── LoginCard.tsx         # Phone login UI with OTP flow
│   │   ├── OTPInput.tsx          # 6-digit OTP input component
│   │   └── PhoneInput.tsx        # Phone number input with formatting
│   ├── dashboard/
│   │   ├── Sidebar.tsx           # Navigation sidebar (8.8KB) — all dashboard routes
│   │   ├── Navbar.tsx            # Top navigation bar (5.3KB) — search, notifications
│   │   ├── Header.tsx            # Page header component
│   │   ├── AnalyticsCharts.tsx   # Spending breakdown charts (Recharts)
│   │   ├── MoneyMirrorChart.tsx  # Money Mirror trajectory chart (Recharts)
│   │   ├── BankSelectionModal.tsx # Bank selection modal for AA flow
│   │   └── TransactionPreviewModal.tsx # Transaction preview before analysis
│   └── layout/
│       ├── Navbar.tsx            # Landing page navbar
│       └── ThemeToggle.tsx       # Light/dark theme toggle
│
├── lib/
│   ├── supabase.ts               # Supabase client + helper functions (createProfile, saveExpenses, createChallenge, etc.)
│   ├── banks.ts                  # Bank configuration data
│   ├── utils.ts                  # cn() utility (clsx + tailwind-merge)
│   ├── context/
│   │   └── ThemeContext.tsx       # React context for theme (light/dark) with localStorage persistence
│   ├── hooks/
│   │   └── useTheme.ts           # useTheme hook (re-exports context)
│   └── store/
│       ├── useAnalysisStore.ts   # Analysis pipeline state (file, goal, stipend, payloadId, status, result)
│       ├── useDashboardStore.ts  # Dashboard metrics (score, waste, loss, insights, breakdown, challenge)
│       └── useAppStore.ts        # App-wide state (walletAddress) — persisted to localStorage
│
├── types/
│   └── analysis.ts               # TypeScript interfaces (AnalysisResult, Challenge, UserProfile, Trigger)
│
└── public/
    ├── sample.json               # Sample transaction data for demo
    └── logos/
        ├── hdfc.png              # HDFC Bank logo
        └── icici.svg             # ICICI Bank logo
```

---

## 4. System Architecture — Deep Dive

### 4.1 Backend AI Engine (LangGraph Pipeline)

The core backend is a **12-node LangGraph StateGraph** defined in `graph/expense_graph.py`. All nodes share a single `ExpenseGraphState` TypedDict with 30 fields.

**Pipeline Flow:**
```
START → intake_node →[conditional]→ vision_node → parsing_node → categorization_node
  → spending_node → savings_score_node → projection_node → mirror_prediction_node
  → habit_analyst_node → trigger_psych_node → trend_forecaster_node
  → structural_coach_node → END
```

**Conditional Routing:** After `intake_node`, `_route_after_intake()` checks if `state["status"] == "error"`. If so, the pipeline short-circuits to END. Otherwise, it proceeds to `vision_node`.

**Node Responsibilities:**
| Node | Function |
|---|---|
| `intake_node` | Validates goal, stipend, raw_input. Rejects invalid submissions by setting status=error |
| `vision_node` | If raw_input is a base64 image, uses Gemini 1.5 Flash to OCR bank statement |
| `parsing_node` | Extracts structured transaction dicts from raw text |
| `categorization_node` | Maps merchants to categories (hardcoded map → fuzzy match → LLM fallback) |
| `spending_node` | Calculates spending breakdown by category, identifies monthly waste |
| `savings_score_node` | Computes proprietary savings score (0-100) |
| `projection_node` | Calculates 5-year compound loss at 8% inflation-adjusted rate |
| `mirror_prediction_node` | Generates "Money Mirror" future trajectory prediction |
| `habit_analyst_node` | Identifies good financial habits from patterns |
| `trigger_psych_node` | Identifies psychological spending triggers ("Trigger Genome") |
| `trend_forecaster_node` | Detects spending trends and forecasts |
| `structural_coach_node` | Generates structural coaching recommendations |

**"Simulated Crew" Prompt System (`prompts.py`):**
A single LLM call simulates a 3-expert panel debate:
1. **The Oracle of Compound Interest** — Calculates 5-year cost of habits
2. **The Goal-Oriented Mentor** — Compares waste to stated financial goal
3. **The Future Self** — Emotional 2-sentence warning from 2030

Output is enforced via Pydantic `PanelVerdict` schema (exactly 3 `ExpertThought` objects, compounded cost, future self message, comparison metric, confidence score, flagged reasons).

### 4.2 API Architecture

**Backend FastAPI (port 8001):**

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/health` | GET | Health check — returns engine version, vision/AA status |
| `/api/expense-analysis/submit` | POST | Accepts `ExpenseAnalysisRequest`, spawns background thread for graph execution, returns `payload_id` |
| `/api/expense-analysis/status/{id}` | GET | Polls analysis status, returns full `ExpenseAnalysisResponse` with all insights |
| `/api/consent/create` | POST | Creates Setu AA consent request, returns Anumati redirect URL |
| `/api/consent/status/{id}` | GET | Polls consent approval status |
| `/api/webhook/setu` | POST | Receives Setu callback, parses ReBIT transactions, fires LangGraph pipeline |
| `/api/challenge/create` | POST | Creates challenge, anchors escrow lock on-chain, persists to Supabase |
| `/api/verify/submit` | POST | Month 2 verification — compares spending, unlocks escrow, updates streak/leaderboard |
| `/api/leaderboard/` | GET | Fetches leaderboard from Supabase (filterable by community) |
| `/api/leaderboard/activity` | GET | Fetches recent positive financial actions feed |

**Execution Model:** Analysis runs in a **background thread** (`threading.Thread(daemon=True)`). The frontend polls `/status/{payload_id}` until `status == "completed"`.

**Blockchain Anchoring:** After graph completion, `anchor_to_chain()` sends a 0-ETH self-transaction on Sepolia with the SHA-256 hash of the analysis payload in the `data` field. The `tx_hash` is stored and returned to the frontend.

### 4.3 Frontend Architecture

**Routing Strategy:** Next.js App Router with a `(dashboard)` route group that wraps all authenticated pages in a shared layout (Sidebar + Navbar).

**State Management (3 Zustand Stores):**

1. **`useAnalysisStore`** — Tracks the analysis pipeline: `uploadedFile`, `selectedGoal`, `stipend`, `payloadId`, `status` (idle/uploading/running/completed/error), `analysisResult`
2. **`useDashboardStore`** — Dashboard display metrics: `savingsScore`, `monthlyWaste`, `fiveYearLoss`, `potentialValue`, AI insight fields (`insight`, `goodHabits`, `triggerGenome`, `mirrorPrediction`, `trendDetection`), `spendingBreakdown`, `beforeAfterProjection`, active `challenge`
3. **`useAppStore`** — Persistent app state: `walletAddress` (persisted to localStorage under key `expense-autopsy-app-state`)

**Supabase Client (`lib/supabase.ts`)** — Direct DB functions used from frontend:
- `createProfile()`, `getProfile()` — User profiles
- `saveExpenses()`, `getExpenses()` — Expense records
- `createChallenge()`, `getActiveChallenge()`, `updateChallengeProgress()` — Challenges
- `saveTriggers()`, `getTriggers()` — Spending triggers

**Theme System:** `ThemeContext` + `useTheme` hook with localStorage persistence. Supports light/dark modes with a flash-prevention script in `<head>`.

### 4.4 Database Schema (Supabase Tables)
| Table | Key Columns | Purpose |
|---|---|---|
| `profiles` | id, name, email, wallet_address, monthly_income, financial_goal | User profiles |
| `expenses` | user_id, amount, category, description, opportunity_cost_5yr, source, payload_id | Transaction records |
| `statements` | user_id, raw_text, parsed_transactions | Raw statement storage |
| `challenges` | id, user_id, challenge_duration, target_reduction_percentage, status | Active commitment challenges |
| `blockchain_transactions` | user_id, challenge_id, tx_hash, transaction_type (escrow_lock/escrow_unlock) | On-chain tx records |
| `leaderboard` | user_id, savings_score, streak_days, reduction_percentage, community_name | Rankings |
| `streaks` | user_id, streak_days | Discipline streak tracking |
| `activities` | created_at, ... | Live feed of positive financial actions |
| `triggers` | user_id, pattern, predicted_time, notification_sent | Spending trigger patterns |

---

## 5. User Flow — Step by Step

### Step 1: Landing Page (`/`)
Full marketing page (30KB) with value proposition, feature highlights, and CTA to begin.

### Step 2: Login (`/login`)
Phone-based OTP authentication via `LoginCard` → `PhoneInput` → `OTPInput` components.

### Step 3: Onboarding (`/onboarding`)
User defines financial goal (e.g., "Buy a Laptop") and monthly stipend/income.

### Step 4: Data Source (`/data-source`)
User selects bank (HDFC/ICICI logos). Triggers mock Setu AA consent flow. Backend creates consent request via `POST /api/consent/create`, returns Anumati redirect URL.

### Step 5: Analysis (`/(dashboard)/analysis`)
- Frontend submits to `POST /api/expense-analysis/submit` with goal, stipend, raw_input
- Backend spawns background thread running the 12-node LangGraph pipeline
- Frontend polls `GET /api/expense-analysis/status/{payload_id}` until completion
- Pipeline: intake → vision OCR → parsing → categorization → spending → score → projection → mirror → habits → triggers → trends → coaching

### Step 6: Dashboard Reveal (`/(dashboard)/dashboard`)
User sees: Savings Score (0-100), Monthly Waste (₹), 5-Year Loss (₹), Future Invested Value (₹), Highest Spend Category, Spending Breakdown chart, Emotional "Future Self" Message.

### Step 7: Deep Insights (`/(dashboard)/insights`)
Detailed AI insights: Good Habits list, Trigger Genome analysis, Trend Detection, Before/After Projection.

### Step 8: Money Mirror (`/(dashboard)/money-mirror`)
Trajectory chart showing current savings curve vs. ideal curve if waste is eliminated.

### Step 9: Commitment Protocol (`/(dashboard)/protocol` → `/commit`)
User signs a smart contract commitment. Backend calls `POST /api/challenge/create` → `anchor_to_chain()` sends escrow lock transaction on Sepolia → persists to `challenges` + `blockchain_transactions` tables.

### Step 10: Verification (`/(dashboard)/verify`)
Month 2: User uploads new statement. Backend runs `POST /api/verify/submit` → compares spending → if 30% reduction achieved: escrow unlocked, streak incremented, leaderboard score bumped by 15 points.

### Step 11: Network (`/(dashboard)/network`)
Goal-specific leaderboard (filterable by community) + live activity feed of peer achievements.

---

## 6. Design System Summary

Binance.US inspired (`DESIGN.md`):
- **Colors:** Two-tone white (`#FFFFFF`) / near-black (`#222126`). Single accent: Binance Yellow (`#F0B90B`). Semantic: Green (`#0ECB81`) for positive, Red (`#F6465D`) for negative.
- **Typography:** Inter + Geist fonts, weights 500-700 for authority. Display: 60px/700, Body: 16px/500.
- **Shapes:** Pill buttons (50px radius) for CTAs, 12px radius for cards, 8px for inputs.
- **Shadows:** Ultra-light (5% opacity) for trust. Cards: `rgba(32,32,37,0.05) 0px 3px 5px`.
- **Theme:** Light/dark mode with localStorage persistence and flash-prevention.

---

## 7. Graphify Architectural Analysis

**Source:** `graphify-out/GRAPH_REPORT.md` (284 nodes, 302 edges, 23 communities)
**Extraction Quality:** 68% EXTRACTED, 32% INFERRED (97 inferred edges, avg confidence 0.68)

### 7.1 God Nodes (Most Connected)
| Node | Edges | Role |
|---|---|---|
| `GET()` | 30 | Cross-community bridge (betweenness: 0.250) — connects 9 communities |
| `ExpenseGraphState` | 28 | Central state schema — every pipeline node depends on it |
| `ExpenseAnalysisRequest` | 13 | API entry point schema |
| `verify_month_2()` | 6 | Bridges Web3 Escrow ↔ Frontend Dashboard |
| `parse_rebit_transactions()` | 6 | Data ingestion bridge |

### 7.2 Key Communities
1. **Core Analysis Engine & Graph Nodes** (19 nodes, cohesion 0.06) — All LangGraph pipeline nodes
2. **Account Aggregator & Data Ingestion** (25 nodes, cohesion 0.11) — ReBIT parsing, state schemas
3. **Web3 Escrow & Leaderboard** (19 nodes, cohesion 0.08) — Challenge creation, blockchain anchoring
4. **API Endpoints & OCR Services** (12 nodes, cohesion 0.17) — FastAPI routes, background execution
5. **AI Merchant Categorization** (8 nodes, cohesion 0.22) — LLM + fuzzy + hardcoded categorization
6. **Advanced AI Insights** (6 nodes, cohesion 0.25) — Behavioral profiling services
7. **Workflow Orchestration** (5 nodes, cohesion 0.33) — Graph building and conditional routing

### 7.3 Knowledge Gaps & Risks
- **48 isolated nodes** with ≤1 connection — possible missing edges or undocumented components
- **Thin communities** (Server Lifecycle, category_constants, Font Trichotomy) — too small for meaningful clusters
- **High inference count** on `GET()` (27 inferred edges) and `ExpenseGraphState` (26 inferred edges) — need verification

---

## 8. Current Issues & Improvement Recommendations

### 8.1 Production Readiness
1. **Mock AA Integration:** Setu consent flow returns simulated Anumati URLs. Need live Setu/Finvu sandbox API for real bank JSON.
2. **Web3 Simulation:** `anchor_to_chain()` is real (sends actual Sepolia transactions), but the "Escrow" is a simple wallet transfer, not a smart contract. Need actual Solidity escrow contract deployment.
3. **In-Memory State:** `_state_store` and `_consent_store` are Python dicts — lost on server restart. Should migrate to Redis or database-backed state.

### 8.2 Architecture
4. **Thread-Based Execution:** Background analysis uses `threading.Thread`. Should migrate to async task queue (Celery, or native asyncio) for production scale.
5. **Duplicate Graph Compilation:** Both `expense_analysis.py` and `setu_aa.py` call `build_expense_graph()` independently. Should share a single compiled graph instance.
6. **CORS Wildcard:** `allow_origins=["*"]` is acceptable for development but must be restricted for production.

### 8.3 Feature Gaps
7. **Verification Logic:** Month 2 verification currently auto-approves with a hardcoded 32% reduction. Needs actual Month 2 LangGraph pass comparing real transactions.
8. **WhatsApp Bot:** Planned but not implemented — proactive spending trigger notifications.
9. **Live Wallet Connection:** Frontend has `ethers.js` but no MetaMask/WalletConnect integration for real staking.

### 8.4 Code Quality
10. **Legacy State File:** `backend/state.py` defines `AppState` for an "Evergreen Mantra" pipeline — appears to be leftover from an earlier design iteration. The active state is `ExpenseGraphState`.
11. **Missing Error Boundaries:** Frontend pages lack React error boundaries for graceful failure handling.
12. **No Authentication Middleware:** Backend routes don't validate user sessions — `user_id` is trusted from request body.
