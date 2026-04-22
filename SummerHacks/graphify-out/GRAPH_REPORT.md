# Graph Report - .  (2026-04-22)

## Corpus Check
- Corpus is ~35,909 words - fits in a single context window. You may not need a graph.

## Summary
- 284 nodes · 302 edges · 23 communities detected
- Extraction: 68% EXTRACTED · 32% INFERRED · 0% AMBIGUOUS · INFERRED: 97 edges (avg confidence: 0.68)
- Token cost: 5,000 input · 1,000 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Core Analysis Engine & Graph Nodes|Core Analysis Engine & Graph Nodes]]
- [[_COMMUNITY_Account Aggregator & Data Ingestion|Account Aggregator & Data Ingestion]]
- [[_COMMUNITY_Web3 Escrow & Leaderboard|Web3 Escrow & Leaderboard]]
- [[_COMMUNITY_Frontend Dashboard & Supabase|Frontend Dashboard & Supabase]]
- [[_COMMUNITY_API Endpoints & OCR Services|API Endpoints & OCR Services]]
- [[_COMMUNITY_Product Design & Requirements|Product Design & Requirements]]
- [[_COMMUNITY_AI Merchant Categorization|AI Merchant Categorization]]
- [[_COMMUNITY_Authentication & API Routing|Authentication & API Routing]]
- [[_COMMUNITY_Advanced AI Insights|Advanced AI Insights]]
- [[_COMMUNITY_PII Masking & Data Parsing|PII Masking & Data Parsing]]
- [[_COMMUNITY_Frontend Theme & Context|Frontend Theme & Context]]
- [[_COMMUNITY_AI Prompt Engineering|AI Prompt Engineering]]
- [[_COMMUNITY_Workflow Orchestration|Workflow Orchestration]]
- [[_COMMUNITY_Computer Vision Processing|Computer Vision Processing]]
- [[_COMMUNITY_Application State Definitions|Application State Definitions]]
- [[_COMMUNITY_Server Lifecycle|Server Lifecycle]]
- [[_COMMUNITY_Data Intake Processing|Data Intake Processing]]
- [[_COMMUNITY_Auth Components|Auth Components]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]

## God Nodes (most connected - your core abstractions)
1. `GET()` - 30 edges
2. `ExpenseGraphState` - 28 edges
3. `ExpenseAnalysisRequest` - 13 edges
4. `verify_month_2()` - 6 edges
5. `ExpenseAnalysisResponse` - 6 edges
6. `parse_rebit_transactions()` - 6 edges
7. `ExpenseAutopsy` - 6 edges
8. `get_setu_access_token()` - 5 edges
9. `anchor_to_chain()` - 5 edges
10. `create_challenge()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `HDFC Bank Logo` --mock_source--> `ExpenseAutopsy`  [INFERRED]
  hdfclogo.png → prd.md
- `expense_graph.py -- LangGraph StateGraph for the ExpenseAutopsy pipeline. Inclu` --uses--> `ExpenseGraphState`  [INFERRED]
  C:\Users\kirti\OneDrive\Desktop\FINAL-VERSION\SummerHacks\backend\graph\expense_graph.py → C:\Users\kirti\OneDrive\Desktop\FINAL-VERSION\SummerHacks\backend\schemas\graph_state.py
- `Skip the rest of the pipeline if intake validation failed.` --uses--> `ExpenseGraphState`  [INFERRED]
  C:\Users\kirti\OneDrive\Desktop\FINAL-VERSION\SummerHacks\backend\graph\expense_graph.py → C:\Users\kirti\OneDrive\Desktop\FINAL-VERSION\SummerHacks\backend\schemas\graph_state.py
- `Construct and compile the unified expense analysis StateGraph.` --uses--> `ExpenseGraphState`  [INFERRED]
  C:\Users\kirti\OneDrive\Desktop\FINAL-VERSION\SummerHacks\backend\graph\expense_graph.py → C:\Users\kirti\OneDrive\Desktop\FINAL-VERSION\SummerHacks\backend\schemas\graph_state.py
- `advanced_insights_node.py -- Final node mapping insights and generating projecti` --uses--> `ExpenseGraphState`  [INFERRED]
  C:\Users\kirti\OneDrive\Desktop\FINAL-VERSION\SummerHacks\backend\graph\nodes\advanced_insights_node.py → C:\Users\kirti\OneDrive\Desktop\FINAL-VERSION\SummerHacks\backend\schemas\graph_state.py

## Hyperedges (group relationships)
- **Core App Architecture** — req_fastapi, req_gemini, req_supabase, req_web3 [INFERRED 0.90]

## Communities

### Community 0 - "Core Analysis Engine & Graph Nodes"
Cohesion: 0.06
Nodes (19): categorization_node(), Map merchants to categories., coaching_node(), Generate emotional coaching message., habit_analyst_node(), mirror_prediction_node(), projection_node(), Calculate 5-year financial impact based on dynamic parsing logic. (+11 more)

### Community 1 - "Account Aggregator & Data Ingestion"
Cohesion: 0.11
Nodes (25): BaseModel, ExpenseAnalysisRequest, ExpenseGraphState, _extract_merchant(), parse_rebit_transactions(), rebit_parser.py -- Transforms ReBIT-schema bank transactions into the clean for, Extract merchant name from UPI narration string.      Examples:         "UPI-, Convert ReBIT-schema transactions into clean expense records.      Filters out (+17 more)

### Community 2 - "Web3 Escrow & Leaderboard"
Cohesion: 0.08
Nodes (19): ChallengeCreateRequest, ChallengeResponse, create_challenge(), challenge.py -- FastAPI router for Challenge + Web3 anchoring integration., Create a new challenge and anchor the hash to the blockchain., get_db_client(), fetch_activities(), fetch_leaderboard() (+11 more)

### Community 3 - "Frontend Dashboard & Supabase"
Cohesion: 0.09
Nodes (6): handleConfirmEscrow(), handleSubmit(), update(), createChallenge(), createProfile(), updateChallengeProgress()

### Community 4 - "API Endpoints & OCR Services"
Cohesion: 0.17
Nodes (12): ExpenseAnalysisResponse, get_expense_status(), expense_analysis.py -- FastAPI router for ExpenseAutopsy endpoints., Allow main.py to inject the shared stores., Execute the expense analysis graph in a background thread., _run_expense_graph(), set_stores(), submit_expense_analysis() (+4 more)

### Community 5 - "Product Design & Requirements"
Cohesion: 0.18
Nodes (11): Algorithmic Accountability, HDFC Bank Logo, Commitment Protocol, ExpenseAutopsy, Goal Cohorts, Money Mirror, Savings Score, Stake & Discipline (+3 more)

### Community 6 - "AI Merchant Categorization"
Cohesion: 0.22
Nodes (8): llm_categorize_transactions(), categorization_agent.py -- Use an LLM to accurately categorize Indian bank trans, Map each transaction to a category using LLM, with fallback., categorize_merchant(), categorize_transactions(), merchant_mapper.py -- Map merchant names to spending categories.  Uses hardcod, Return the category for a given merchant name.      Lookup: exact match -> par, Add a 'category' field to each transaction dict.

### Community 7 - "Authentication & API Routing"
Cohesion: 0.22
Nodes (6): POST(), get_setu_access_token(), invalidate_token(), setu_auth.py -- Setu Account Aggregator sandbox authentication.  Exchanges cli, Exchange SETU_CLIENT_ID + SETU_SECRET for a bearer token., Clear cached token (e.g. on 401 responses).

### Community 8 - "Advanced AI Insights"
Cohesion: 0.25
Nodes (6): advanced_insights_node(), advanced_insights_node.py -- Final node mapping insights and generating projecti, Generate emotional coaching, behavioral insights, and pass raw data through., generate_advanced_insights(), advanced_insights_service.py -- Extract comprehensive behavioral insights via Gr, Generate all specialized emotional and behavioral AI insights in a single LLM pa

### Community 9 - "PII Masking & Data Parsing"
Cohesion: 0.25
Nodes (6): parsing_node(), parsing_node.py -- Extract transactions from raw statement text or vision output, Parse raw_input into structured transaction dicts., mask_pii(), pii_masking.py -- Sanitize sensitive data before LLM processing.  Removes UPI, Strip PII from raw UPI statement text.

### Community 10 - "Frontend Theme & Context"
Cohesion: 0.29
Nodes (3): useThemeContext(), ThemeToggle(), useTheme()

### Community 11 - "AI Prompt Engineering"
Cohesion: 0.33
Nodes (5): ExpertThought, PanelVerdict, prompts.py — Master "Simulated Crew" system prompt & Pydantic output schemas., One expert's contribution to the debate., Aggregated output from the simulated 3-expert panel.

### Community 12 - "Workflow Orchestration"
Cohesion: 0.33
Nodes (5): build_expense_graph(), expense_graph.py -- LangGraph StateGraph for the ExpenseAutopsy pipeline. Inclu, Skip the rest of the pipeline if intake validation failed., Construct and compile the unified expense analysis StateGraph., _route_after_intake()

### Community 13 - "Computer Vision Processing"
Cohesion: 0.33
Nodes (4): If the raw_input looks like a base64 image or a specifically flagged file,, vision_node(), extract_transactions_from_image(), Use Gemini 1.5 Flash to extract transaction text from a bank statement image.

### Community 14 - "Application State Definitions"
Cohesion: 0.4
Nodes (4): AppState, state.py -- Flat LangGraph state for the Evergreen Mantra Trust-Verify-Act pipel, Single source of truth shared across all Evergreen Mantra graph nodes., TypedDict

### Community 16 - "Server Lifecycle"
Cohesion: 0.5
Nodes (1): main.py — ExpenseAutopsy Unified FastAPI Backend. Now consolidated with Challen

### Community 17 - "Data Intake Processing"
Cohesion: 0.5
Nodes (3): intake_node(), intake_node.py -- Validates and stores user inputs into graph state., Validate goal, stipend, and raw_input. Reject invalid submissions.

### Community 19 - "Auth Components"
Cohesion: 0.83
Nodes (3): getFormattedPhone(), handleSendOTP(), handleVerifyOTP()

### Community 21 - "Community 21"
Cohesion: 1.0
Nodes (1): category_constants.py -- Hardcoded merchant-to-category map and category lists.

### Community 60 - "Community 60"
Cohesion: 1.0
Nodes (1): Font Trichotomy

### Community 61 - "Community 61"
Cohesion: 1.0
Nodes (1): FastAPI

### Community 62 - "Community 62"
Cohesion: 1.0
Nodes (1): Supabase

### Community 63 - "Community 63"
Cohesion: 1.0
Nodes (1): ICICI Bank Logo

## Knowledge Gaps
- **48 isolated node(s):** `main.py — ExpenseAutopsy Unified FastAPI Backend. Now consolidated with Challen`, `prompts.py — Master "Simulated Crew" system prompt & Pydantic output schemas.`, `One expert's contribution to the debate.`, `Aggregated output from the simulated 3-expert panel.`, `setu_auth.py -- Setu Account Aggregator sandbox authentication.  Exchanges cli` (+43 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Server Lifecycle`** (4 nodes): `main.py`, `health_check()`, `lifespan()`, `main.py — ExpenseAutopsy Unified FastAPI Backend. Now consolidated with Challen`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (2 nodes): `category_constants.py`, `category_constants.py -- Hardcoded merchant-to-category map and category lists.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 60`** (1 nodes): `Font Trichotomy`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 61`** (1 nodes): `FastAPI`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 62`** (1 nodes): `Supabase`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 63`** (1 nodes): `ICICI Bank Logo`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `GET()` connect `Core Analysis Engine & Graph Nodes` to `Account Aggregator & Data Ingestion`, `API Endpoints & OCR Services`, `AI Merchant Categorization`, `Authentication & API Routing`, `Advanced AI Insights`, `PII Masking & Data Parsing`, `Workflow Orchestration`, `Computer Vision Processing`, `Data Intake Processing`?**
  _High betweenness centrality (0.250) - this node is a cross-community bridge._
- **Why does `_run_expense_graph()` connect `API Endpoints & OCR Services` to `Core Analysis Engine & Graph Nodes`, `Web3 Escrow & Leaderboard`?**
  _High betweenness centrality (0.137) - this node is a cross-community bridge._
- **Why does `verify_month_2()` connect `Web3 Escrow & Leaderboard` to `Frontend Dashboard & Supabase`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **Are the 27 inferred relationships involving `GET()` (e.g. with `get_setu_access_token()` and `_route_after_intake()`) actually correct?**
  _`GET()` has 27 INFERRED edges - model-reasoned connections that need verification._
- **Are the 26 inferred relationships involving `ExpenseGraphState` (e.g. with `expense_graph.py -- LangGraph StateGraph for the ExpenseAutopsy pipeline. Inclu` and `Skip the rest of the pipeline if intake validation failed.`) actually correct?**
  _`ExpenseGraphState` has 26 INFERRED edges - model-reasoned connections that need verification._
- **Are the 11 inferred relationships involving `ExpenseAnalysisRequest` (e.g. with `expense_analysis.py -- FastAPI router for ExpenseAutopsy endpoints.` and `Allow main.py to inject the shared stores.`) actually correct?**
  _`ExpenseAnalysisRequest` has 11 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `verify_month_2()` (e.g. with `get_db_client()` and `anchor_to_chain()`) actually correct?**
  _`verify_month_2()` has 3 INFERRED edges - model-reasoned connections that need verification._