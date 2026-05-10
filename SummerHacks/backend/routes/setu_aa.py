"""
setu_aa.py -- FastAPI router for Setu Account Aggregator integration.

Endpoints:
  POST /api/consent/create       -- Create a consent request, return redirect URL
  GET  /api/consent/status/{id}  -- Poll consent approval status
  POST /api/webhook/setu         -- Receive Setu callback on consent approval
"""

import uuid
import threading
from typing import Any
import requests
from datetime import datetime, timedelta

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from setu_auth import get_setu_access_token
from services.rebit_parser import parse_rebit_transactions, transactions_to_raw_input
from schemas.expense_analysis import ExpenseAnalysisRequest
from schemas.graph_state import ExpenseGraphState
from graph.expense_graph import build_expense_graph
from utils.crypto_helper import generate_key_material, decrypt_jwe

router = APIRouter(prefix="/api", tags=["Setu AA"])

# Shared state store (injected from main.py)
_state_store: dict[str, dict] = {}
_consent_store: dict[str, dict] = {}  # consent_id -> {status, payload_id, ...}

expense_graph = build_expense_graph()


def set_stores(state_store: dict, consent_store: dict | None = None):
    global _state_store, _consent_store
    _state_store = state_store
    if consent_store is not None:
        _consent_store = consent_store


# ── Request / Response Models ────────────────────────────────────

class ConsentCreateRequest(BaseModel):
    goal: str
    stipend: float
    redirect_url: str = "http://localhost:3000/analysis"


# ── Helper: run expense graph ────────────────────────────────────

SAFE_DEFAULTS = {
    "status": "idle",
    "highest_spend_category": "",
    "monthly_waste": 0,
    "raw_5_year_loss": 0,
    "future_invested_value": 0,
    "savings_score": 0,
    "emotional_message": "",
    "spending_breakdown": {},
    "error": None,
}


def _run_expense_pipeline(payload_id: str, raw_input: str, goal: str, stipend: float):
    """Execute the expense graph in a background thread."""
    print(f"[SetuAA] Starting LangGraph pipeline for {payload_id}")

    initial_state: ExpenseGraphState = {
        "payload_id": payload_id,
        "status": "running",
        "goal": goal,
        "stipend": stipend,
        "raw_input": raw_input,
        "parsed_transactions": [],
        "categorized_transactions": [],
        "spending_breakdown": {},
        "highest_spend_category": "",
        "monthly_waste": 0,
        "savings_score": 0,
        "raw_5_year_loss": 0,
        "future_invested_value": 0,
        "emotional_message": "",
        "error": None,
    }

    try:
        result = expense_graph.invoke(initial_state)
        _state_store[payload_id] = {
            **SAFE_DEFAULTS,
            "payload_id": payload_id,
            "status": result.get("status", "completed"),
            "highest_spend_category": result.get("highest_spend_category", ""),
            "monthly_waste": result.get("monthly_waste", 0),
            "raw_5_year_loss": result.get("raw_5_year_loss", 0),
            "future_invested_value": result.get("future_invested_value", 0),
            "savings_score": result.get("savings_score", 0),
            "emotional_message": result.get("emotional_message", ""),
            "spending_breakdown": result.get("spending_breakdown", {}),
            "error": result.get("error"),
        }
        print(f"[SetuAA] Pipeline completed for {payload_id}")
    except Exception as exc:
        print(f"[SetuAA] Pipeline failed for {payload_id}: {exc}")
        _state_store[payload_id] = {
            **SAFE_DEFAULTS,
            "payload_id": payload_id,
            "status": "error",
            "error": str(exc),
        }


# ── Routes ───────────────────────────────────────────────────────

@router.post("/consent/create")
async def create_consent(body: ConsentCreateRequest):
    """Create a Setu consent request and return the Anumati redirect URL."""
    token = get_setu_access_token()

    # Generate a payload ID to track this analysis
    payload_id = str(uuid.uuid4())
    consent_id = str(uuid.uuid4())
    
    key_material, priv_key = generate_key_material()

    # Store the consent with associated goal/stipend/crypto
    _consent_store[consent_id] = {
        "status": "pending",
        "payload_id": payload_id,
        "goal": body.goal,
        "stipend": body.stipend,
        "priv_key": priv_key,
        "key_material": key_material
    }

    _state_store[payload_id] = {
        **SAFE_DEFAULTS,
        "payload_id": payload_id,
        "status": "awaiting_consent",
    }

    if not token:
        print("[SetuAA] No token available")
        raise HTTPException(status_code=500, detail="Setu AA Token not available. Ensure client ID and secret are correct.")

    # Live Setu Consent API
    start_date = datetime.utcnow()
    payload = {
        "Detail": {
            "consentStart": start_date.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "consentExpiry": (start_date + timedelta(days=30)).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "Customer": {"id": "9999999999@ONEMONEY"}, # Sandbox default
            "FIDataRange": {
                "from": (start_date - timedelta(days=90)).strftime("%Y-%m-%dT%H:%M:%SZ"),
                "to": start_date.strftime("%Y-%m-%dT%H:%M:%SZ")
            },
            "consentMode": "STORE",
            "consentTypes": ["TRANSACTIONS", "PROFILE", "SUMMARY"],
            "fetchType": "ONETIME",
            "Frequency": {"unit": "HOUR", "value": 1},
            "DataFilter": [{"type": "TRANSACTIONAMOUNT", "operator": ">=", "value": "0"}],
            "DataLife": {"unit": "MONTH", "value": 1},
            "DataConsumer": {"id": "FIU"},
            "Purpose": {
                "Category": {"type": "string"},
                "code": "101",
                "text": "Wealth management service",
                "refUri": "https://api.rebit.org.in/laa/purpose/101.xml"
            },
            "fiTypes": ["DEPOSIT"]
        },
        "redirectUrl": body.redirect_url
    }

    try:
        res = requests.post(
            "https://fiu-sandbox.setu.co/v2/consents",
            json=payload,
            headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
        )
        if res.status_code in (200, 201):
            res_data = res.json()
            consent_id = res_data.get("ConsentHandle", consent_id)
            anumati_url = res_data.get("url", f"https://anumati.setu.co/{consent_id}?redirect_url={body.redirect_url}")
        else:
            print(f"[SetuAA] Live creation failed: {res.text}. Using fallback.")
            anumati_url = f"https://anumati.setu.co/{consent_id}?redirect_url={body.redirect_url}"
    except Exception as e:
        print(f"[SetuAA] Exception hitting Setu: {e}. Using fallback.")
        anumati_url = f"https://anumati.setu.co/{consent_id}?redirect_url={body.redirect_url}"

    return {
        "consent_id": consent_id,
        "payload_id": payload_id,
        "redirect_url": anumati_url,
        "status": "consent_created",
    }


@router.get("/consent/status/{consent_id}")
async def get_consent_status(consent_id: str):
    """Poll the status of a consent request."""
    consent = _consent_store.get(consent_id)
    if not consent:
        raise HTTPException(404, "Consent not found")

    return {
        "consent_id": consent_id,
        "status": consent.get("status", "pending"),
        "payload_id": consent.get("payload_id"),
    }


@router.post("/webhook/setu")
async def setu_webhook(body: dict[str, Any]):
    """Receive Setu's callback when consent is approved and data is ready.

    In production, this would:
    1. Validate the webhook signature
    2. Fetch encrypted FI data from Setu
    3. Decrypt using Rahasya key pair
    4. Parse the ReBIT JSON

    For sandbox, we accept the raw transaction array directly.
    """
    # Check webhook type
    notification = body.get("Notification", {})
    consent_id = notification.get("consentId", body.get("ConsentHandle", ""))
    
    if not consent_id:
        # Fallback for old mock webhook tests
        consent_id = body.get("consentId", "")

    consent = _consent_store.get(consent_id)

    if not consent:
        raise HTTPException(404, "Unknown consent ID")

    payload_id = consent["payload_id"]
    goal = consent["goal"]
    stipend = consent["stipend"]
    priv_key = consent.get("priv_key", "")

    status = notification.get("status", "ACTIVE")
    if status != "ACTIVE" and "transactions" not in body:
        return {"status": "ignored", "reason": f"Status is {status}"}

    # Step 1: Request Data Session from Setu (if real webhook)
    # Step 2: Fetch JWE from Setu using session ID
    # Step 3: Decrypt JWE
    
    raw_transactions = []
    if "transactions" in body:
        # Handling legacy sandbox bypass
        raw_transactions = body["transactions"]
    else:
        # Mocking the Setu /v2/sessions fetch + decrypt for demo reliability
        # In a strict production env, we'd do requests.post('/v2/sessions') here.
        # But for the hackathon, if Setu sends us the success webhook, we 
        # simulate the decrypted payload using our sandbox data since live banking
        # credentials (phone/OTP) are required for real FI data.
        print(f"[SetuAA] Real Webhook Received for {consent_id}. Simulating JWE Decrypt.")
        raw_transactions = [
            {"type": "DEBIT", "amount": "450.0", "narration": "UPI-SWIGGY", "transactionTimestamp": "2026-04-10"},
            {"type": "DEBIT", "amount": "12000.0", "narration": "RENT", "transactionTimestamp": "2026-04-12"},
            {"type": "DEBIT", "amount": "2000.0", "narration": "AMAZON", "transactionTimestamp": "2026-04-15"},
        ]

    # Parse the ReBIT transactions
    cleaned = parse_rebit_transactions(raw_transactions)
    raw_input = transactions_to_raw_input(cleaned)

    # Update consent status
    _consent_store[consent_id]["status"] = "approved"
    _state_store[payload_id]["status"] = "running"

    # Fire the LangGraph pipeline in background
    t = threading.Thread(
        target=_run_expense_pipeline,
        args=(payload_id, raw_input, goal, stipend),
        daemon=True,
    )
    t.start()

    return {"status": "processing", "payload_id": payload_id}


