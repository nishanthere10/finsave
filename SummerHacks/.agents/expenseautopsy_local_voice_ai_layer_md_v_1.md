# local-voice-ai-layer.md

# ExpenseAutopsy Local Voice + AI Layer Implementation

## Objective

Replace the existing cloud-based LLM layer with a fully local AI stack that is compliant with hackathon rules.

The new system should support:
- Open-ended transaction-related chat
- Voice input
- Voice output
- Emotional coaching
- Savings explanations
- Spending category lookups
- Future value explanations
- Personalized recommendations

This implementation should integrate cleanly with the existing FastAPI backend and Next.js frontend.

---

# 1. Final Architecture

```text
Frontend Chat UI
    ↓
Microphone Input
    ↓
Speech-to-Text
    ↓
FastAPI Chat Endpoint
    ↓
Intent Detection Layer
    ↓
Transaction Retrieval Layer
    ↓
Local Phi-3 Model via Ollama
    ↓
Text Response
    ↓
Browser Speech Synthesis
```

---

# 2. Model Selection

## Primary Local Model

Use:

- Phi-3 Mini through Ollama

Reason:
- Good reasoning quality
- Lightweight
- Fast enough on CPU
- Easy to run locally
- Works well for short financial answers

Install:

```bash
ollama pull phi3
```

Run:

```bash
ollama run phi3
```

Optional backup model:

- Gemma 2B

---

# 3. Speech-to-Text Layer

## Recommended Tool

Use:

- faster-whisper

Reason:
- Faster than regular Whisper
- Better for CPU machines
- Good enough for short finance questions

Install:

```bash
pip install faster-whisper
```

Example:

```python
from faster_whisper import WhisperModel

model = WhisperModel("base")

segments, info = model.transcribe("audio.wav")
text = " ".join([segment.text for segment in segments])
```

Recommended model sizes:

- CPU laptop: `base`
- GPU laptop: `small` or `medium`

---

# 4. Text-to-Speech Layer

## Recommended Approach

Use browser speech synthesis.

Reason:
- Faster than backend TTS
- Easier to implement
- No additional backend load
- Better for demo

Frontend example:

```ts
const utterance = new SpeechSynthesisUtterance(responseText)
window.speechSynthesis.speak(utterance)
```

Optional backend alternative:

- pyttsx3

But browser speech synthesis should be the default.

---

# 5. Chat Strategy

The chat should feel open-ended, but internally it should use structured retrieval.

Do not let the local model invent financial answers from scratch.

Instead:

1. User asks natural-language question
2. Backend detects intent
3. Backend fetches relevant transaction values
4. Local model converts data into a natural answer

---

# 6. Supported Intent Categories

## Core Intents

```python
INTENTS = {
    "highest_spending_category": [
        "where do i spend the most",
        "what is my highest spending category",
        "which category costs me the most"
    ],
    "category_spend_lookup": [
        "how much do i spend on food delivery",
        "how much do i spend on shopping",
        "how much do i spend on subscriptions"
    ],
    "monthly_waste": [
        "how much money do i waste every month",
        "what is my monthly waste"
    ],
    "future_value": [
        "how much money will i lose in 5 years",
        "what is the future value of my spending"
    ],
    "savings_score": [
        "what is my savings score",
        "why is my savings score low"
    ],
    "recommendation": [
        "what should i reduce first",
        "what is my worst spending habit"
    ],
    "improvement_check": [
        "am i improving",
        "did i save money this month"
    ]
}
```

---

# 7. Backend Folder Structure

```text
backend/
  ├── ai/
  │   ├── intent_detector.py
  │   ├── prompt_builder.py
  │   ├── response_generator.py
  │   ├── voice_transcriber.py
  │   └── chat_context_builder.py
  ├── routes/
  │   └── chat.py
  ├── services/
  │   ├── ollama_service.py
  │   ├── speech_service.py
  │   └── retrieval_service.py
  └── schemas/
      └── chat.py
```

---

# 8. API Endpoints

## POST `/api/chat/query`

Purpose:
Handle transaction-related chat requests.

Request:

```json
{
  "payload_id": "abc123",
  "question": "What is my highest spending category?"
}
```

Response:

```json
{
  "intent": "highest_spending_category",
  "answer": "Your highest spending category is food delivery.",
  "speak_text": "Your highest spending category is food delivery."
}
```

---

## POST `/api/chat/transcribe`

Purpose:
Convert uploaded audio into text.

Request:
- Multipart audio file upload

Response:

```json
{
  "text": "What is my highest spending category?"
}
```

---

# 9. Intent Detection Logic

Use hybrid detection:

1. Keyword matching
2. Fuzzy matching
3. Optional local model fallback

Recommended libraries:

```bash
pip install rapidfuzz
```

Example:

```python
from rapidfuzz import fuzz
```

Fallback behavior:

- If intent confidence is low, use Phi-3 to classify intent
- If still unclear, return:

```text
I could not understand that question. Try asking about your spending, savings score, or future value.
```

---

# 10. Retrieval Layer

Use existing analysis result JSON.

Example source:

```json
{
  "highest_spend_category": "Food Delivery",
  "monthly_waste": 4500,
  "raw_5_year_loss": 270000,
  "future_invested_value": 320000,
  "savings_score": 78,
  "spending_breakdown": {
    "Food Delivery": 4500,
    "Shopping": 2100,
    "Travel": 1000
  }
}
```

The retrieval layer should map intent → correct value.

Example:

```python
if intent == "highest_spending_category":
    return analysis["highest_spend_category"]
```

---

# 11. Ollama Prompt Strategy

Do not send raw transaction history into the model.

Send only summarized structured values.

Example prompt:

```text
You are a financial coach for Indian students.

Question: What is my highest spending category?

Relevant Data:
- Highest Spend Category: Food Delivery
- Monthly Waste: 4500 INR
- Savings Score: 78

Generate a short answer under 25 words.
Be clear, friendly, and actionable.
```

Example output:

```text
Your highest spending category is food delivery, which is also the biggest reason your savings score is low.
```

---

# 12. Frontend Integration

## Components Needed

```text
components/chat/
  ├── ChatCard.tsx
  ├── ChatInput.tsx
  ├── VoiceButton.tsx
  ├── ChatBubble.tsx
  └── VoicePlaybackButton.tsx
```

---

# 13. Frontend Chat Flow

```text
User speaks or types
    ↓
Frontend sends text/audio to backend
    ↓
Backend transcribes audio if needed
    ↓
Backend detects intent
    ↓
Backend retrieves relevant values
    ↓
Backend sends structured prompt to Phi-3
    ↓
Backend returns final answer
    ↓
Frontend displays answer
    ↓
Browser reads answer aloud
```

---

# 14. Error Handling

The chat system must never crash if:
- Audio transcription fails
- Intent is unclear
- Ollama is offline
- Phi-3 returns empty output
- Retrieval data is missing

Fallback rules:

```text
Unknown intent → Ask user to rephrase
Missing data → Return default answer
Model failure → Use rule-based response
Speech failure → Show text-only response
```

Default fallback response:

```text
I could not find enough transaction data to answer that question.
```

---

# 15. Performance Optimizations

For CPU laptops:

- Use Phi-3 Mini only
- Use faster-whisper base model
- Limit prompts to small structured summaries
- Limit answer length to 25 words
- Avoid long chat memory
- Keep only last 2–3 chat turns in context

---

# 16. Acceptance Criteria

The feature is complete when:

1. User can ask questions by text
2. User can ask questions by voice
3. Audio converts into text correctly
4. Intent detection works correctly
5. Retrieval layer fetches correct values
6. Phi-3 generates clean responses
7. Browser reads answers aloud
8. Errors do not crash the UI
9. Chat remains fast on CPU
10. All logic works without cloud APIs

