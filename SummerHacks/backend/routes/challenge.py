"""
challenge.py -- FastAPI router for Challenge + Web3 anchoring integration.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from utils.db import get_db_client
import uuid

router = APIRouter(prefix="/api/challenge", tags=["Challenge"])

_state_store = {}

def set_stores(state_store: dict):
    global _state_store
    _state_store = state_store

class ChallengeCreateRequest(BaseModel):
    user_id: str
    goal: str
    commitment: str
    penalty_days: int
    tx_hash: str
    wallet_address: str

class ChallengeResponse(BaseModel):
    challenge_id: str
    tx_hash: str
    status: str

@router.post("/create", response_model=ChallengeResponse)
async def create_challenge(body: ChallengeCreateRequest):
    """Create a new challenge and anchor the hash to the blockchain."""
    challenge_id = str(uuid.uuid4())
    
    # Fire a REAL on-chain transaction for the escrow lock
    from web3_helper import anchor_to_chain
    try:
        tx_hash = anchor_to_chain({
            "type": "escrow_lock",
            "challenge_id": challenge_id,
            "goal": body.goal,
            "commitment": body.commitment,
            "penalty_days": body.penalty_days,
        }, stake_amount_eth=0.0)
    except Exception as e:
        print(f"[Challenge] Web3 anchor failed: {e}")
        tx_hash = f"0x_FAILED_{str(e)[:20]}"

    db = get_db_client()
    if db:
        try:
            dummy_user_id = '00000000-0000-0000-0000-000000000000'
            db.table("challenges").insert({
                "id": challenge_id,
                "user_id": dummy_user_id,
                "challenge_duration": body.penalty_days,
                "target_reduction_percentage": 30,
                "status": "active"
            }).execute()

            db.table("blockchain_transactions").insert({
                "user_id": dummy_user_id,
                "challenge_id": challenge_id,
                "tx_hash": tx_hash,
                "transaction_type": "escrow_lock"
            }).execute()
            print(f"[Challenge] DB persistence successful for {challenge_id}")
        except Exception as dbe:
            print(f"[Challenge] DB persistence failed (non-blocking): {dbe}")

    return ChallengeResponse(
        challenge_id=challenge_id,
        tx_hash=tx_hash,
        status="active"
    )
