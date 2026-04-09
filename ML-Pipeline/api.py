import json
import os
from urllib import error, parse, request

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import uvicorn

load_dotenv()
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1|0\.0\.0\.0|172\.\d+\.\d+\.\d+)(:\d+)?$",
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Query(BaseModel):
    text: str


class ChatRequest(BaseModel):
    message: str
    mode: str | None = None
    history: list[dict[str, str]] = Field(default_factory=list)
    llm: str | None = "gemini"


@app.post("/similarity")
def similarity(query: Query):
    try:
        from similarity.predict import find_similar_businesses
        return {
            "similarBusinesses": find_similar_businesses(query.text)
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Similarity service error: {exc}")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/")
def root():
    return {
        "status": "ok",
        "message": "Caduceus FastAPI backend is running.",
        "health": "/health",
        "chatbot": "/chatbot",
        "docs": "/docs",
    }


@app.post("/chatbot")
def chatbot(chat: ChatRequest):
    if not chat.message or not chat.message.strip():
        raise HTTPException(status_code=400, detail="Message is required.")

    system_context = (
        "You are Caduceus AI, a CRM assistant. "
        "Respond in concise, practical, and actionable language."
    )
    if chat.mode == "think":
        system_context += " Use clear step-by-step reasoning in your answer."
    elif chat.mode == "search":
        system_context += " Focus on discovery-style suggestions and key findings."

    contents = [
        {
            "role": "user",
            "parts": [{"text": system_context}],
        }
    ]

    for item in chat.history:
        role = item.get("role", "user")
        text = item.get("content", "").strip()
        if not text:
            continue
        contents.append({"role": role, "parts": [{"text": text}]})

    contents.append(
        {
            "role": "user",
            "parts": [{"text": chat.message.strip()}],
        }
    )

    target_llm = (chat.llm or "gemini").strip().lower()
    if target_llm == "openai":
        return _chatbot_openai(contents)
    return _chatbot_gemini(contents)


def _chatbot_gemini(contents: list[dict]):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured.")

    models_to_try = ["gemini-3.1-pro-preview", "gemini-2.0-flash"]
    base_payload = {
        "contents": contents,
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 1024,
        },
    }

    last_error = None
    for model in models_to_try:
        endpoint = (
            "https://generativelanguage.googleapis.com/v1beta/models/"
            f"{model}:generateContent?key={parse.quote(api_key)}"
        )
        req = request.Request(
            endpoint,
            data=json.dumps(base_payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )

        try:
            with request.urlopen(req, timeout=40) as response:
                raw = response.read().decode("utf-8")
                data = json.loads(raw)
            text = (
                data.get("candidates", [{}])[0]
                .get("content", {})
                .get("parts", [{}])[0]
                .get("text", "")
                .strip()
            )
            if text:
                return {"reply": text}
            last_error = "Empty response from Gemini."
        except error.HTTPError as exc:
            detail = exc.read().decode("utf-8")
            last_error = f"Gemini HTTP {exc.code}: {detail}"
            if exc.code == 503:
                continue
            if exc.code in (400, 401, 403, 404):
                raise HTTPException(status_code=exc.code, detail=detail)
        except Exception as exc:
            last_error = str(exc)

    return {
        "reply": (
            "The AI service is temporarily busy. Please try again in a few seconds."
            if last_error
            else "Unable to generate a response right now. Please try again."
        )
    }


def _chatbot_openai(contents: list[dict]):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return {"reply": "OpenAI API key is not configured. Please set OPENAI_API_KEY in .env."}

    messages = []
    for item in contents:
        role = item.get("role", "user")
        text = (
            item.get("parts", [{}])[0].get("text", "").strip()
            if isinstance(item.get("parts"), list)
            else ""
        )
        if not text:
            continue
        if role == "model":
            role = "assistant"
        if role not in ("user", "assistant", "system"):
            role = "user"
        messages.append({"role": role, "content": text})

    payload = {
        "model": "gpt-4.1-mini",
        "messages": messages,
        "temperature": 0.7,
    }
    req = request.Request(
        "https://api.openai.com/v1/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        method="POST",
    )

    try:
        with request.urlopen(req, timeout=45) as response:
            raw = response.read().decode("utf-8")
            data = json.loads(raw)
        text = (
            data.get("choices", [{}])[0]
            .get("message", {})
            .get("content", "")
            .strip()
        )
        if text:
            return {"reply": text}
        return {"reply": "Unable to generate a response right now. Please try again."}
    except error.HTTPError as exc:
        _ = exc.read().decode("utf-8")
        return {"reply": "OpenAI is unavailable right now. Check your OpenAI API key and try again."}
    except Exception:
        return {"reply": "Failed to contact OpenAI right now. Please try again."}


if __name__ == "__main__":
    uvicorn.run("api:app", host="127.0.0.1", port=8000, reload=False)