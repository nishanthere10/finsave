"""
web3_helper.py — Live Smart Contract Escrow integration.

Interacts with the ExpenseEscrow.sol contract deployed on Sepolia.
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
    private_key = os.getenv("WALLET_PRIVATE_KEY", "")
    
    if not private_key:
        raise Exception("Missing WALLET_PRIVATE_KEY in .env")

    w3 = Web3(Web3.HTTPProvider(rpc_url))
    account = w3.eth.account.from_key(private_key)
    
    address, abi = get_contract_data()
    if not address or not abi:
        raise Exception("Contract artifact not found. Please deploy first.")
        
    contract = w3.eth.contract(address=address, abi=abi)
    return w3, account, contract

def anchor_to_chain(data_dict: dict, stake_amount_eth: float = 0.0) -> str:
    """
    Lock the user's stake into the live ExpenseEscrow contract.
    """
    challenge_id = data_dict.get("id", "test_id")
    
    w3, account, contract = _get_w3_and_contract()
    
    # We shouldn't lock from backend unless the backend is funding it.
    # Actually, if the user sends ETH, they should do it from frontend.
    # But for seamless demo, backend admin can sponsor the lock (or we just log the creation).
    # Since Phase 2 demands we call `lockStake(challengeId)` payable.
    
    try:
        nonce = w3.eth.get_transaction_count(account.address)
        value_wei = w3.to_wei(stake_amount_eth, "ether")
        
        gas_price = max(w3.eth.gas_price, w3.to_wei(10, "gwei"))
        gas_price = int(gas_price * 1.2)
        
        # Build transaction to call `lockStake`
        tx = contract.functions.lockStake(challenge_id).build_transaction({
            "chainId": int(os.getenv("WEB3_CHAIN_ID", "11155111")),
            "gas": 200_000,
            "gasPrice": gas_price,
            "nonce": nonce,
            "value": value_wei
        })
        
        signed = w3.eth.account.sign_transaction(tx, account.key)
        tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
        
        return w3.to_hex(tx_hash)
    except Exception as exc:
        print(f"[web3_helper] Broadcast failed ({exc}).")
        raise Exception(f"Failed to anchor to chain: {str(exc)}")

def resolve_stake(challenge_id: str, success: bool) -> str:
    """
    Admin resolves the challenge. success=True (Return ETH), success=False (Burn ETH).
    """
    w3, account, contract = _get_w3_and_contract()
    
    try:
        nonce = w3.eth.get_transaction_count(account.address)
        gas_price = max(w3.eth.gas_price, w3.to_wei(10, "gwei"))
        gas_price = int(gas_price * 1.2)
        
        fn = contract.functions.resolveSuccess(challenge_id) if success else contract.functions.resolveFailure(challenge_id)
        
        tx = fn.build_transaction({
            "chainId": int(os.getenv("WEB3_CHAIN_ID", "11155111")),
            "gas": 150_000,
            "gasPrice": gas_price,
            "nonce": nonce,
        })
        
        signed = w3.eth.account.sign_transaction(tx, account.key)
        tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
        
        return w3.to_hex(tx_hash)
    except Exception as exc:
        print(f"[web3_helper] Resolve failed ({exc}).")
        raise Exception(f"Failed to resolve stake: {str(exc)}")
