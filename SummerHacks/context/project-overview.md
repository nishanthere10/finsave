# Project Overview

## Product Definition
**ExpenseAutopsy** is a brutal financial accountability protocol. It dissects bad spending habits and forces discipline through a combination of AI psychological profiling and smart contract commitments. 

Unlike traditional finance apps that passively track expenses, ExpenseAutopsy enforces consequences for failing to stick to a budget.

## Core Features (Implemented)
1. **The Autopsy (AI Pipeline):** Parses bank statements to identify "doom-spending" and calculates the "5-Year Loss" (the compound interest lost due to bad habits).
2. **Trigger Genome:** AI identifies the psychological triggers behind impulsive purchases (e.g., "Late-night food delivery after stressful workdays").
3. **Money Mirror:** A trajectory chart showing the user's current financial path vs. their potential path if waste is eliminated.
4. **Commitment Protocol (Web3):** Users stake real ETH. If they fail to reduce their spending by a target percentage in Month 2, the ETH is locked/burned.

## Target Audience
Gen-Z and young professionals who suffer from impulse buying, doom-spending, and lack the discipline to adhere to passive budgeting apps.

## Scope for Current Iteration
The focus is now on **hardening the MVP for production**:
- Migrating to robust authentication (Clerk).
- Implementing the true Solidity Escrow Contract (instead of a simulated transfer).
- Connecting live Account Aggregator APIs.
- Ensuring the backend can scale via async task queues.