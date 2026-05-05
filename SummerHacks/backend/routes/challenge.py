"""
challenge.py -- FastAPI router for Challenge + Web3 anchoring integration.
"""

from fastapi import APIRouter, Depends
from utils.auth import verify_clerk_token
from pydantic import BaseModel
from utils.db import get_db_client
import uuid

router = APIRouter(prefix="/api/challenge", tags=["Challenge"])

_state_store = {}

def set_stores(state_store: dict):
    global _state_store
    _state_store = state_store

class ChallengeCreateRequest(BaseModel):
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
async def create_challenge(body: ChallengeCreateRequest, user_id: str = Depends(verify_clerk_token)):
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
        raise Exception(f"Web3 anchor failed: {e}")

    db = get_db_client()
    if db:
        try:
            # user_id is already verified from the Clerk JWT
                
            db.table("challenges").insert({
                "id": challenge_id,
                "user_id": user_id,
                "challenge_duration": body.penalty_days,
                "target_reduction_percentage": 30,
                "status": "active"
            }).execute()

            db.table("blockchain_transactions").insert({
                "user_id": user_id,
                "challenge_id": challenge_id,
                "tx_hash": tx_hash,
                "transaction_type": "escrow_lock"
            }).execute()
            print(f"[Challenge] DB persistence successful for {challenge_id}")
        except Exception as dbe:
            print(f"[Challenge] DB persistence failed: {dbe}")
            raise Exception("Database persistence failed")
    else:
        raise Exception("Database client unavailable")

    return ChallengeResponse(
        challenge_id=challenge_id,
        tx_hash=tx_hash,
        status="active"
    )
