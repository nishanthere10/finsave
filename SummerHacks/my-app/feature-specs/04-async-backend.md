## VERSION 2


# Lightweight Celery + Redis Integration (ExpenseAutopsy)

# Objective

Implement a minimal, production-clean async processing layer for the LangGraph + Gemini AI pipeline using:
- Celery
- Redis
- Supabase status polling

This implementation is intentionally lightweight.

We are NOT building:
- distributed infrastructure,
- Kubernetes workers,
- retry orchestration,
- websocket streaming,
- enterprise queues.

We ARE building:
- non-blocking AI processing,
- stable request lifecycle,
- async LangGraph execution,
- clean architectural separation.

---

# Final Architecture

```txt
Frontend
   ↓
FastAPI Route
   ↓
Queue Celery Task
   ↓
Immediate Response (PENDING)
   ↓
Redis Broker
   ↓
Celery Worker
   ↓
LangGraph + Gemini
   ↓
Supabase Persistence
   ↓
Frontend Polling
```

---

# STEP 1 — Install Dependencies

Inside backend environment:

```bash
pip install celery redis
```

Optional monitoring:

```bash
pip install flower
```

---

# STEP 2 — Run Redis

## Docker Command

```bash
docker run -p 6379:6379 -d redis
```

Verify:

```bash
docker ps
```

Expected:
- Redis container running
- Port 6379 exposed

---

# STEP 3 — Create Celery Application

## File

```txt
backend/celery_app.py
```

## Code

```python
from celery import Celery

celery = Celery(
    "expense_autopsy",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/1"
)

celery.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
)
```

---

# STEP 4 — Create Async Task

## File

```txt
backend/tasks.py
```

## Code

```python
from celery_app import celery
from graph.expense_graph import build_expense_graph
from utils.db import supabase

@celery.task(name="analyze_expenses")
def analyze_expenses(
    raw_transactions,
    goal,
    stipend,
    user_id,
    payload_id
):

    try:

        # -----------------------------------
        # Update Status → PROCESSING
        # -----------------------------------

        supabase.table("analyses").update({
            "status": "PROCESSING"
        }).eq("payload_id", payload_id).execute()

        # -----------------------------------
        # Build Graph
        # -----------------------------------

        graph = build_expense_graph()

        # -----------------------------------
        # Execute LangGraph
        # -----------------------------------

        result = graph.invoke({
            "transactions": raw_transactions,
            "goal": goal,
            "stipend": stipend,
            "user_id": user_id,
            "payload_id": payload_id
        })

        # -----------------------------------
        # Save Final Result
        # -----------------------------------

        supabase.table("analyses").update({
            "status": "COMPLETED",
            "result_json": result
        }).eq("payload_id", payload_id).execute()

        return {
            "status": "SUCCESS"
        }

    except Exception as e:

        supabase.table("analyses").update({
            "status": "FAILED",
            "error_message": str(e)
        }).eq("payload_id", payload_id).execute()

        raise e
```

---

# STEP 5 — Create Analysis Table Structure

## Recommended Fields

```txt
id
user_id
payload_id
status
result_json
error_message
created_at
updated_at
completed_at
```

---

# STEP 6 — Refactor FastAPI Route

## File

```txt
backend/routes/expense_analysis.py
```

---

# BEFORE (REMOVE THIS)

```python
result = graph.invoke(data)
```

Never run heavy AI processing directly inside request handlers anymore.

---

# AFTER

## Code

```python
from fastapi import APIRouter
from tasks import analyze_expenses
from utils.db import supabase
import uuid

router = APIRouter()

@router.post("/analyze")

async def analyze(payload: dict):

    payload_id = str(uuid.uuid4())

    # -----------------------------------
    # Create Initial Analysis Record
    # -----------------------------------

    supabase.table("analyses").insert({
        "payload_id": payload_id,
        "user_id": payload["user_id"],
        "status": "PENDING"
    }).execute()

    # -----------------------------------
    # Queue Celery Task
    # -----------------------------------

    analyze_expenses.delay(
        payload["transactions"],
        payload["goal"],
        payload["stipend"],
        payload["user_id"],
        payload_id
    )

    # -----------------------------------
    # Immediate Response
    # -----------------------------------

    return {
        "payload_id": payload_id,
        "status": "PENDING"
    }
```

---

# STEP 7 — Create Status Endpoint

## Code

```python
@router.get("/analysis/status/{payload_id}")

async def analysis_status(payload_id: str):

    result = supabase.table("analyses") \
        .select("*") \
        .eq("payload_id", payload_id) \
        .single() \
        .execute()

    return result.data
```

---

# STEP 8 — Frontend Polling Logic

## Frontend Flow

### 1. Submit Analysis

Backend returns:

```json
{
  "payload_id": "...",
  "status": "PENDING"
}
```

---

### 2. Poll Every 2–5 Seconds

```txt
/api/analysis/status/{payload_id}
```

---

### 3. UI States

| Status | UI |
|---|---|
| PENDING | Preparing analysis |
| PROCESSING | Running AI analysis |
| COMPLETED | Navigate to dashboard |
| FAILED | Show retry/error UI |

---

# STEP 9 — Run The System

## Terminal 1 — FastAPI

```bash
python main.py
```

---

## Terminal 2 — Celery Worker

```bash
celery -A celery_app worker --loglevel=info
```

---

# OPTIONAL — Flower Monitoring

Run:

```bash
celery -A celery_app flower
```

Open:

```txt
http://localhost:5555
```

---

# IMPORTANT ARCHITECTURAL RULES

# 1. Supabase Is Source Of Truth

Celery should NEVER become the main state store.

Use:
- Supabase for status,
- Supabase for results,
- Supabase for persistence.

Celery only executes tasks.

---

# 2. Keep Blockchain Separate

DO NOT:
- lock ETH,
- resolve escrow,
- burn funds,

inside Celery tasks yet.

Blockchain operations should remain:
- explicit,
- auditable,
- isolated.

---

# 3. Only Asyncify AI Processing

Do NOT move:
- auth,
- dashboard APIs,
- challenge CRUD,
- lightweight routes,

into Celery.

Only:
- LangGraph,
- Gemini,
- OCR,
- expensive AI tasks.

---

# 4. Add Failure Handling

Every task should:
- catch exceptions,
- update FAILED state,
- store error messages.

Never silently fail.

---

# 5. Keep It Lightweight

DO NOT IMPLEMENT:
- Kubernetes
- RabbitMQ
- multi-worker orchestration
- retries
- websocket streaming
- distributed scheduling
- task chains
- priority queues

This phase is only:
- async execution foundation.

---

# Recommended Folder Structure

```txt
backend/
├── celery_app.py
├── tasks.py
├── graph/
├── routes/
├── utils/
└── schemas/
```

---

# Success Criteria

Implementation is complete when:

- API requests return immediately
- LangGraph runs asynchronously
- Frontend polling works
- Results persist in Supabase
- Failed tasks update status correctly
- FastAPI no longer blocks during analysis
- Redis + Celery run locally with minimal setup

---

# Final Philosophy

This implementation is NOT about:
- scaling to millions of users,
- enterprise distributed systems,
- infrastructure complexity.

It IS about:
- clean async architecture,
- non-blocking AI processing,
- stable backend behavior,
- future scalability foundation.