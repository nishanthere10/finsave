"""
leaderboard.py -- FastAPI router for fetching leaderboard data.
"""

from fastapi import APIRouter, HTTPException, Depends
from utils.auth import verify_clerk_token
from utils.db import get_db_client

router = APIRouter(prefix="/api/leaderboard", tags=["Leaderboard"])

_state_store = {}

def set_stores(state_store: dict):
    global _state_store
    _state_store = state_store

@router.get("/")
async def fetch_leaderboard(limit: int = 10, community: str = None, user_id: str = Depends(verify_clerk_token)):
    """
    Fetch the latest leaderboard data from Supabase.
    Falls back to mock data if DB is unavailable.
    """
    db = get_db_client()

    if db:
        try:
            # Query the leaderboard table, ordered by savings_score descending
            query = db.table("leaderboard").select("*")
            if community:
                query = query.eq("community_name", community)
            
            response = query.order("savings_score", desc=True).limit(limit).execute()
            
            if hasattr(response, 'data') and len(response.data) > 0:
                print(f"[Leaderboard] Fetched {len(response.data)} records from Supabase.")
                
                # Add virtual rank
                ranked = []
                for i, row in enumerate(response.data):
                    row["rank"] = i + 1
                    ranked.append(row)
                return ranked
            else:
                print("[Leaderboard] Supabase query returned no data.")
                return []
        except Exception as e:
            print(f"[Leaderboard] Supabase error: {e}")
            raise HTTPException(status_code=500, detail="Database connection failed")

    raise HTTPException(status_code=500, detail="Database client unavailable")

@router.get("/activity")
async def fetch_activities(limit: int = 5, user_id: str = Depends(verify_clerk_token)):
    """
    Simulate a live feed of positive financial actions across the network.
    """
    db = get_db_client()
    if db:
        try:
            # Query the activities table
            # Assuming a generic activities table exists. If not, it will gracefully return [].
            query = db.table("activities").select("*").order("created_at", desc=True).limit(limit)
            response = query.execute()
            
            if hasattr(response, 'data') and len(response.data) > 0:
                return response.data
            else:
                return []
        except Exception as e:
            print(f"[Leaderboard Activity] Supabase error: {e}")
            raise HTTPException(status_code=500, detail="Database connection failed")

    raise HTTPException(status_code=500, detail="Database client unavailable")
