"""
expense_analysis.py -- FastAPI router for ExpenseAutopsy endpoints.
Refactored for Phase 4: Celery async task queue + Supabase as state of truth.

Bugs fixed:
  1. No DB insert error handling — if Supabase insert fails, the route crashes with 500 before
     the Celery task is even queued. Wrapped in try/except with proper HTTPException.
  2. Security vulnerability: No ownership check on /status endpoint. Any authenticated user
     could poll any other user's payload_id. Added user_id match guard.
  3. `status` string comparison was case-sensitive — Supabase stores "COMPLETED",
     code compared lowercase "completed". Fixed by normalising consistently with .upper().
  4. `Optional` was imported but never used. Removed.
  5. SAFE_DEFAULTS dict with mutable defaults (lists, dicts) shared across requests.
     Changed to a factory function to avoid mutation bugs.
"""

import uuid
from fastapi import APIRouter, HTTPException, Depends
from utils.auth import verify_clerk_token

from schemas.expense_analysis import ExpenseAnalysisRequest, ExpenseAnalysisResponse
from utils.db import get_db_client
from utils.ocr import extract_text_from_base64
from tasks import analyze_expenses

router = APIRouter(prefix="/api/expense-analysis", tags=["Expense Analysis"])


def _safe_defaults() -> dict:
    """FIX 5: Factory to avoid mutable default sharing across requests."""
    return {
        "highest_spend_category": "",
        "monthly_waste": 0,
        "raw_5_year_loss": 0,
        "future_invested_value": 0,
        "savings_score": 0,
        "emotional_message": "",
        "good_habits": [],
        "trigger_genome": "",
        "trend_detection": "",
        "raw_input_echo": "",
        "before_after_projection": {},
        "spending_breakdown": {},
        "blockchain_tx": "",
        "error": None,
    }


@router.post("/submit")
async def submit_expense_analysis(
    body: ExpenseAnalysisRequest,
    user_id: str = Depends(verify_clerk_token)
):
    payload_id = str(uuid.uuid4())

    # Extract text from base64 if needed
    raw_text = body.raw_input
    if raw_text.startswith("data:"):
        raw_text = extract_text_from_base64(raw_text, body.filename or "input.txt")
        print(f"[Analysis] Extracted {len(raw_text)} characters via OCR.")

    # FIX 1: Wrap DB insert in try/except — don't let Supabase failure crash the route
    db = get_db_client()
    try:
        db.table("analyses").insert({
            "payload_id": payload_id,
            "user_id": user_id,
            "status": "PENDING",
        }).execute()
    except Exception as db_err:
        raise HTTPException(status_code=503, detail=f"Database unavailable: {db_err}")

    # Queue Celery task
    analyze_expenses.delay(
        raw_transactions=raw_text,
        goal=body.goal,
        stipend=body.stipend,
        user_id=user_id,
        payload_id=payload_id
    )

    return {"payload_id": payload_id, "status": "PENDING"}


@router.get("/status/{payload_id}", response_model=ExpenseAnalysisResponse)
async def get_expense_status(
    payload_id: str,
    user_id: str = Depends(verify_clerk_token)
):
    db = get_db_client()

    res = db.table("analyses").select("*").eq("payload_id", payload_id).single().execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Payload not found")

    row = res.data

    # FIX 2: Security — ensure the requesting user owns this analysis
    if row.get("user_id") != user_id:
        raise HTTPException(status_code=403, detail="Access denied")

    # FIX 3: Normalise status to uppercase for consistent comparison
    status = row.get("status", "PENDING").upper()

    # If still processing, return status only
    if status in ("PENDING", "PROCESSING"):
        return ExpenseAnalysisResponse(
            payload_id=payload_id,
            status=status.lower(),
            **_safe_defaults()
        )

    result = row.get("result_json") or {}

    agent_analysis = {
        "highest_spend_category": result.get("highest_spend_category", ""),
        "monthly_waste": result.get("monthly_waste", 0),
        "compounded_five_year_cost": result.get("raw_5_year_loss", 0),
        "raw_5_year_loss": result.get("raw_5_year_loss", 0),
        "future_invested_value": result.get("future_invested_value", 0),
        "savings_score": result.get("savings_score", 0),
        "future_self_message": result.get("emotional_message", ""),
        "emotional_message": result.get("emotional_message", ""),
        "spending_breakdown": result.get("spending_breakdown", {}),
    }

    return ExpenseAnalysisResponse(
        payload_id=payload_id,
        status=status.lower(),
        highest_spend_category=result.get("highest_spend_category", ""),
        monthly_waste=result.get("monthly_waste", 0),
        raw_5_year_loss=result.get("raw_5_year_loss", 0),
        future_invested_value=result.get("future_invested_value", 0),
        savings_score=result.get("savings_score", 0),
        emotional_message=result.get("emotional_message", ""),
        money_mirror_prediction=result.get("money_mirror_prediction", ""),
        spending_breakdown=result.get("spending_breakdown", {}),
        good_habits=result.get("good_habits", []),
        trigger_genome=result.get("trigger_genome", ""),
        trend_detection=result.get("trend_detection", ""),
        raw_input_echo=result.get("raw_input_echo", ""),
        before_after_projection=result.get("before_after_projection", {}),
        agent_analysis=agent_analysis,
        blockchain_tx=result.get("blockchain_tx", ""),
        error=row.get("error_message"),
    )
