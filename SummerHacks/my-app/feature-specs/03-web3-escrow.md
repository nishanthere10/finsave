# Feature Spec 03: Live Web3 Escrow (Phase 2)

## Context & Objective
Currently, the application simulates the Web3 "brutal accountability" feature by sending a 0-ETH transaction to the user's own wallet and saving the transaction hash. To fulfill the core promise of ExpenseAutopsy, we must deploy a live Solidity smart contract on the Sepolia Testnet. This contract will actually lock user funds and enforce financial consequences.

## Requirements

### 1. Smart Contract (`ExpenseEscrow.sol`)
- **State Variables:**
  - `admin`: The address of the backend wallet (only admin can resolve challenges).
  - `challenges`: A mapping of `challengeId` (string/bytes32) to an `Escrow` struct.
  - `Escrow` struct:
    - `user`: address of the user.
    - `amount`: uint256 (amount locked).
    - `isResolved`: boolean.
- **Functions:**
  - `lockStake(string memory challengeId)`: `payable`. Locks the `msg.value` into the contract. Emits a `StakeLocked` event.
  - `resolveSuccess(string memory challengeId)`: `onlyAdmin`. Sends the locked ETH back to the `user`. Sets `isResolved = true`. Emits `StakeReturned`.
  - `resolveFailure(string memory challengeId)`: `onlyAdmin`. Sends the locked ETH to the `address(0)` (burn address) or a designated treasury. Sets `isResolved = true`. Emits `StakeBurned`.

### 2. Setup & Deployment (Hardhat)
- Initialize a Hardhat project in a new root-level directory: `/smart-contracts`.
- Write tests for the `ExpenseEscrow` contract ensuring only the admin can resolve stakes.
- Deploy the contract to the **Sepolia Testnet**.
- Save the resulting Contract Address and ABI into the backend for integration.

### 3. Backend Integration (`backend/web3_helper.py`)
- Load the Contract ABI and Address.
- **Refactor `anchor_to_chain`:** Instead of a generic 0-ETH transaction, it must build a transaction calling `contract.functions.lockStake(payload_id).build_transaction(...)`.
- **Add `resolve_stake(payload_id: str, success: bool)`:** A new function that calls either `resolveSuccess` or `resolveFailure` on the contract, depending on the month 2 analysis results.

### 4. API Route Update
- **File:** `backend/routes/challenge.py` (or wherever the commit logic resides).
- Ensure the API correctly passes the ETH amount to the `web3_helper` when a challenge is created.
- Ensure the transaction hash is saved to the database.

## Security Considerations
- The backend's private key (`WALLET_PRIVATE_KEY` in `.env`) must correspond to the `admin` address that deployed the contract.
- The contract must prevent users from calling `resolveSuccess` on their own challenges.
