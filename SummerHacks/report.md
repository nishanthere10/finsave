# ExpenseAutopsy — Comprehensive Project Report

**Generated:** 2026-05-07 | **Team:** PERSISTENCE | **Event:** SummerHacks 2026

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
| Next.js (App Router) | 15.0+ | Core framework, SSR, file-based routing |
| React | 19.0+ | UI rendering |
| Clerk | ^5 | User Authentication & Session Management (Migrating from Supabase OTP) |
| Tailwind CSS | v4 | Styling (High-contrast minimalist design system) |
| Zustand | 5.0.12 | Client state management (Analysis, Dashboard, App stores) |
| Framer Motion | 12.38.0 | Animations and transitions |
| Recharts | 3.8.1 | Money Mirror & trajectory charts |
| ethers.js | 6.16.0 | Web3 wallet interactions |
| @supabase/supabase-js | 2.103.3 | Database client (profiles, challenges, statements) |
| Lucide React | 1.8.0 | Icons |

### 2.2 Backend
| Technology | Purpose |
|---|---|
| FastAPI | Python web framework (port 8001) |
| LangGraph | AI pipeline orchestration (12-node StateGraph) |
| Google Gemini | Gemini 2.0 Flash / Pro for analysis & vision OCR |
| Pydantic | Strict schema enforcement for AI outputs |
| Supabase (Python) | Database persistence |
| web3.py | Smart contract interaction (Sepolia testnet) |
| Rahasya (JWE) | Secure decryption of ReBIT banking payloads |

### 2.3 Smart Contracts
| Technology | Purpose |
|---|---|
| Solidity | ^0.8.24 | ExpenseEscrow contract for fund locking |
| Hardhat | Development and deployment environment |
| OpenZeppelin | Secure contract standards |

---

## 3. File & Folder Structure

### 3.1 Backend (`backend/`)
```
backend/
├── main.py                       # Unified FastAPI entrypoint
├── graph/                        # LangGraph orchestration
│   ├── expense_graph.py          # 12-node pipeline definition
│   └── nodes/                    # intake, vision, parsing, categorization, etc.
├── routes/                       # API Routers (expense_analysis, setu_aa, challenge, verify, leaderboard)
├── services/                     # Business logic (categorization_agent, rebit_parser, vision_service)
├── schemas/                      # Pydantic & TypedDict models (graph_state, expense_analysis)
├── utils/                        # auth (Clerk verification), db (Supabase), crypto (JWE/Rahasya)
└── web3_helper.py                # Live contract integration for lockStake/resolveSuccess/resolveFailure
```

### 3.2 Smart Contracts (`smart-contracts/`)
```
smart-contracts/
├── contracts/
│   └── ExpenseEscrow.sol         # Solidity Escrow logic (Lock, Unlock, Burn)
├── scripts/
│   └── deploy.js                 # Sepolia deployment script
└── hardhat.config.ts             # Hardhat configuration
```

### 3.3 Frontend (`my-app/`)
```
my-app/
├── app/                          # App Router (dashboard, analysis, commit, verify)
├── components/                   # UI components (Aurora, Dashboard, Auth)
├── lib/                          # Zustand stores, Supabase client, context
└── feature-specs/                # Documentation for Auth, UI, and Web3 features
```

---

## 4. System Architecture — Deep Dive

### 4.1 AI Brain (LangGraph Pipeline)
The backend executes a **12-node pipeline** for every autopsy:
1. **Intake**: Validates user inputs.
2. **Vision**: OCR for bank statement images (Gemini Flash).
3. **Parsing**: Structures raw text into transactions.
4. **Categorization**: LLM-based classification (Food, Rent, Waste, etc.).
5. **Spending**: Calculates monthly waste metrics.
6. **Savings Score**: Computes proprietary 0-100 accountability score.
7. **Projection**: Calculates 5-year opportunity cost.
8. **Mirror**: Predicts future financial trajectory.
9. **Habits/Triggers/Trends**: Behavioral profiling and "Trigger Genome" extraction.
10. **Coaching**: Generates the "Future Self" emotional message.

### 4.2 Web3 Commitment Protocol
The **ExpenseEscrow.sol** contract is the mechanical heart of the discipline protocol:
- **lockStake(challengeId)**: Users stake ETH to activate a challenge.
- **resolveSuccess(challengeId)**: Admin (Backend) returns ETH if Month 2 goals are met.
- **resolveFailure(challengeId)**: Admin burns ETH to a dead address (`0x...dEaD`) if goals are missed.

### 4.3 Data Ingestion (Setu AA)
Supports secure Indian banking data via the **Account Aggregator (AA)** framework:
- **Consent**: User approves data sharing via Anumati.
- **Decryption**: Backend handles JWE decryption using Rahasya (ECC) key pairs.
- **Parsing**: Converts ReBIT-standard JSON into the AI-ready internal state.

---

## 5. Current Implementation Status

### ✅ Completed
- **12-Node LangGraph Engine**: Fully functional and integrated with Gemini.
- **Unified FastAPI Backend**: Consolidated routers for all core modules.
- **Next.js Dashboard**: High-fidelity UI with 11+ specialized pages.
- **Solidity Escrow Contract**: Written and ready for Sepolia deployment.
- **Account Aggregator Webhook**: Handling both mock and live-schema payloads.

### 🏗️ In Progress
- **Clerk Migration**: Moving authentication from Supabase OTP to Clerk.
- **Live Escrow Deployment**: Transitioning from simulated anchoring to live contract execution.
- **Production AA Integration**: Replacing sandbox mocks with live FIU fetch flows.

---

## 6. Graphify Architectural Audit
**Graph Snapshot:** 284 nodes · 302 edges · 23 communities

**Key Findings:**
- **Centrality**: `ExpenseGraphState` is the most critical node, acting as the stateful bridge for all 12 pipeline nodes.
- **Connectivity**: High betweenness for `verify_month_2()`, highlighting its role as the critical logic point where AI analysis meets blockchain execution.
- **Modular Health**: Clear separation between AI processing (Community 0) and Data Ingestion (Community 1).

---

## 7. Roadmap & Recommendations
1. **Async Hardening**: Migrate background threads to Celery/Redis to prevent state loss on server restart.
2. **PII Hardening**: Finalize the `pii_masking.py` logic to ensure zero banking credentials reach the LLM provider.
3. **WhatsApp Nudges**: Implement the proactive notification bot for "Trigger Genome" warnings.
