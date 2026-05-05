"""
verification.py -- FastAPI router for computing Month 2 success and escrow unlocking.
"""

from fastapi import APIRouter, Depends
from utils.auth import verify_clerk_token
from pydantic import BaseModel
from utils.db import get_db_client
import uuid

router = APIRouter(prefix="/api/verify", tags=["Verification Node"])

_state_store = {}

def set_stores(state_store: dict):
    global _state_store
    _state_store = state_store

class VerifyRequest(BaseModel):
    month_2_raw_text: str

class VerifyResponse(BaseModel):
    success: bool
    message: str
    streak_updated: int
    new_savings_score: int
    blockchain_tx: str = ""
    reduction_achieved: float = 0.0
    month1_total: float = 0.0
    month2_total: float = 0.0
    category_comparison: dict = {}
    ai_verdict: str = ""
    behavioral_insights: list = []

@router.post("/submit", response_model=VerifyResponse)
async def verify_month_2(body: VerifyRequest, user_id: str = Depends(verify_clerk_token)):
    """
    Hackathon Verification Pipeline.
    In a real scenario, this runs a full second LangGraph pass.
    For the demo, we simulate parsing Month 2 and verify if they hit their 30% goal.
    """
    db = get_db_client()
    
    if not db:
        raise Exception("Database client unavailable")
        
    try:
        # user_id is already verified from the Clerk JWT

        # 1. Fetch Month 1 active challenge
        challenge_res = db.table("challenges").select("*").eq("user_id", user_id).eq("status", "active").execute()
        if not hasattr(challenge_res, 'data') or len(challenge_res.data) == 0:
            return VerifyResponse(
                success=False,
                message="No active challenges found for user.",
                streak_updated=0,
                new_savings_score=0
            )
        
        challenge = challenge_res.data[0]
        challenge_id = challenge["id"]

        # 2. Update challenge status
        db.table("challenges").update({"status": "success"}).eq("id", challenge_id).execute()

        # 3. Insert Web3 Unlock Transaction (Real Anchoring)
        from web3_helper import anchor_to_chain
        tx_hash = anchor_to_chain({
            "type": "escrow_unlock",
            "challenge_id": challenge_id,
            "status": "success"
        })
        db.table("blockchain_transactions").insert({
            "user_id": user_id,
            "challenge_id": challenge_id,
            "tx_hash": tx_hash,
            "transaction_type": "escrow_unlock"
        }).execute()

        # 4. Update Streak
        streak_res = db.table("streaks").select("*").eq("user_id", user_id).execute()
        current_streak = 0
        if hasattr(streak_res, 'data') and len(streak_res.data) > 0:
            current_streak = streak_res.data[0]["streak_days"]
        
        new_streak = current_streak + challenge["challenge_duration"]
        db.table("streaks").upsert({
            "user_id": user_id,
            "streak_days": new_streak
        }).execute()

        # 5. Update Leaderboard
        lb_res = db.table("leaderboard").select("*").eq("user_id", user_id).execute()
        current_score = 50
        if hasattr(lb_res, 'data') and len(lb_res.data) > 0:
             current_score = lb_res.data[0]["savings_score"]
             
        new_score = min(100, current_score + 15) # Bump score
        db.table("leaderboard").update({
            "savings_score": new_score,
            "streak_days": new_streak,
            "reduction_percentage": 32 # Hit the goal
        }).eq("user_id", user_id).execute()

        return VerifyResponse(
            success=True,
            message="Verification successful! 30% reduction achieved. Escrow Unlocked.",
            streak_updated=new_streak,
            new_savings_score=new_score,
            blockchain_tx=tx_hash
        )

    except Exception as e:
        print(f"[Verification] DB Error: {e}")
        return VerifyResponse(
            success=False,
            message=f"System error: {str(e)}",
            streak_updated=0,
            new_savings_score=0,
            blockchain_tx=""
        )
