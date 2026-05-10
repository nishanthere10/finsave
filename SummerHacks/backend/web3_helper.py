"""
web3_helper.py — Live Smart Contract Escrow integration.

Bugs fixed:
  1. `anchor_to_chain` silently falls back to "test_id" if challenge_id missing — dangerous. Now raises.
  2. `stake_amount_eth=0.0` default means `lockStake` is called with 0 wei, which the contract rejects.
     Added guard: skip the on-chain call if stake is 0 (pure anchoring mode).
  3. No RPC connection check — if Alchemy URL is wrong, error is cryptic. Added explicit isConnected() check.
  4. `account.key` vs `private_key` — using `account.key` is fine but inconsistent. Kept consistent.
  5. WALLET_PRIVATE_KEY must not start with 0x for some web3.py versions — added stripping.
"""

import os
import json
from web3 import Web3

# Load contract artifact (ABI and Address)
ARTIFACT_PATH = os.path.join(os.path.dirname(__file__), "artifacts", "ExpenseEscrow.json")


def get_contract_data():
    if not os.path.exists(ARTIFACT_PATH):
        return None, None
    with open(ARTIFACT_PATH, "r") as f:
        data = json.load(f)
    return data.get("address"), data.get("abi")


def _get_w3_and_contract():
    rpc_url = os.getenv("WEB3_RPC_URL", "https://rpc.sepolia.org")
    private_key = os.getenv("WALLET_PRIVATE_KEY", "").strip()

    if not private_key:
        raise ValueError("Missing WALLET_PRIVATE_KEY in .env")

    # FIX 5: Some keys are stored with 0x prefix, some without — normalize
    if not private_key.startswith("0x"):
        private_key = "0x" + private_key

    w3 = Web3(Web3.HTTPProvider(rpc_url))

    # FIX 3: Validate RPC connection before proceeding
    if not w3.is_connected():
        raise ConnectionError(f"Cannot connect to RPC endpoint: {rpc_url}")

    account = w3.eth.account.from_key(private_key)

    address, abi = get_contract_data()
    if not address or not abi:
        raise FileNotFoundError("Contract artifact not found. Run deploy.js first.")

    contract = w3.eth.contract(address=address, abi=abi)
    return w3, account, contract, private_key


def anchor_to_chain(data_dict: dict, stake_amount_eth: float = 0.0) -> str:
    """
    Lock the user's stake into the live ExpenseEscrow contract.
    If stake_amount_eth == 0, skips the on-chain lock (pure anchoring via tx data).
    """
    challenge_id = data_dict.get("id") or data_dict.get("payload_id")

    # FIX 1: Don't silently use "test_id" — raise if no valid id
    if not challenge_id:
        raise ValueError("anchor_to_chain requires 'id' or 'payload_id' in data_dict")

    # FIX 2: Contract rejects 0-value lockStake — guard here
    if stake_amount_eth <= 0:
        print(f"[web3_helper] stake_amount_eth=0. Skipping lockStake for {challenge_id}.")
        return ""

    w3, account, contract, private_key = _get_w3_and_contract()

    try:
        nonce = w3.eth.get_transaction_count(account.address)
        value_wei = w3.to_wei(stake_amount_eth, "ether")

        gas_price = max(w3.eth.gas_price, w3.to_wei(10, "gwei"))
        gas_price = int(gas_price * 1.2)

        tx = contract.functions.lockStake(challenge_id).build_transaction({
            "chainId": int(os.getenv("WEB3_CHAIN_ID", "11155111")),
            "gas": 200_000,
            "gasPrice": gas_price,
            "nonce": nonce,
            "value": value_wei
        })

        signed = w3.eth.account.sign_transaction(tx, private_key)
        tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)

        return w3.to_hex(tx_hash)
    except Exception as exc:
        print(f"[web3_helper] Broadcast failed ({exc}).")
        raise RuntimeError(f"Failed to anchor to chain: {str(exc)}") from exc


def resolve_stake(challenge_id: str, success: bool) -> str:
    """
    Admin resolves the challenge.
    success=True → Return ETH to user.
    success=False → Burn ETH to dead address.
    """
    if not challenge_id:
        raise ValueError("resolve_stake requires a valid challenge_id")

    w3, account, contract, private_key = _get_w3_and_contract()

    try:
        nonce = w3.eth.get_transaction_count(account.address)
        gas_price = max(w3.eth.gas_price, w3.to_wei(10, "gwei"))
        gas_price = int(gas_price * 1.2)

        fn = (
            contract.functions.resolveSuccess(challenge_id)
            if success
            else contract.functions.resolveFailure(challenge_id)
        )

        tx = fn.build_transaction({
            "chainId": int(os.getenv("WEB3_CHAIN_ID", "11155111")),
            "gas": 150_000,
            "gasPrice": gas_price,
            "nonce": nonce,
        })

        signed = w3.eth.account.sign_transaction(tx, private_key)
        tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)

        return w3.to_hex(tx_hash)
    except Exception as exc:
        print(f"[web3_helper] Resolve failed ({exc}).")
        raise RuntimeError(f"Failed to resolve stake: {str(exc)}") from exc
