# 00 — Build Plan (Optimized)

## Overview

This build plan defines the execution roadmap for **ExpenseAutopsy**, moving from its current highly-developed MVP state into a production-hardened platform.

The system is no longer a greenfield project. The core AI engine (12-node LangGraph), the frontend dashboard (Next.js + Zustand), and the database schema (Supabase) are already built. This roadmap focuses on migrating mock integrations to live production systems and hardening the architecture.

---

## Phase 1 — Authentication Migration (Clerk)
*Currently, the app uses a custom Supabase OTP flow. We are migrating to Clerk for robust session management.*

### UNIT 01A — Frontend Clerk Integration
- Wrap `app/layout.tsx` with `<ClerkProvider>`
- Replace custom `LoginCard.tsx` with Clerk UI components or custom Clerk headless flow
- Protect `(dashboard)` routes using Clerk Middleware

### UNIT 01B — Backend Auth Middleware
- Implement FastAPI middleware to verify Clerk JWTs (`Authorization: Bearer <token>`)
- Sync Clerk `user_id` with Supabase `profiles` table automatically on first login

---

## Phase 2 — Smart Contract Escrow (Live Web3)
*Currently, `anchor_to_chain()` simulates an escrow by sending a 0-ETH transaction. We need a real smart contract.*

### UNIT 02A — Solidity Contract Deployment
- Write and deploy an `ExpenseEscrow.sol` contract on Sepolia
- Features: Lock funds, Unlock funds (if verified), Burn funds (if failed)

### UNIT 02B — Backend Contract Integration
- Update `web3_helper.py` to interact with the deployed contract using `web3.py` ABI
- Update `/api/challenge/create` to trigger the contract lock

---

## Phase 3 — Live Account Aggregator (Setu/Finvu)
*Currently, the Setu integration uses a mocked Sandbox JSON.*

### UNIT 03A — Production AA Integration
- Replace mock Anumati URLs with live Setu/Finvu FIU consent flows
- Implement webhook listener in `/api/webhook/setu` to parse real ReBIT standard JSON payloads
- Ensure `pii_masking.py` correctly handles live banking data before sending to Gemini

---

## Phase 4 — Async Infrastructure Hardening
*Currently, the LangGraph pipeline runs in an in-memory `threading.Thread`. If the server restarts, analysis is lost.*

### UNIT 04A — Async Task Queue
- Integrate Celery (with Redis) or advanced `asyncio` queues for the `expense_graph` execution
- Update `/api/expense-analysis/status/{id}` to poll the Redis/Celery task state instead of a local Python dict

---

## Phase 5 — Feature Completion

### UNIT 05A — Month 2 Verification Logic
- Update `/api/verify/submit` to run a mini-LangGraph pipeline comparing Month 1 vs Month 2 data
- Calculate actual percentage reduction and trigger the Web3 Escrow unlock/burn accordingly

### UNIT 05B — WhatsApp Bot (Optional)
- Implement Twilio/Meta API for proactive "Trigger Genome" warnings via WhatsApp
