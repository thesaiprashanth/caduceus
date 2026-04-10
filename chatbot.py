from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    role: str   # "user" | "assistant" | "system"
    content: str

class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    mode: str | None = None
    llm: str | None = None

OLLAMA_URL = "http://127.0.0.1:11434/api/chat"

@app.get("/")
async def root():
    return {"message": "FastAPI server running."}

@app.post("/chatbot")
async def chatbot(request: ChatRequest):
    try:
        # System prompt (IMPORTANT)
        messages = [
    {
        "role": "system",
        "content": (
            "You are Hermes, a reliable CRM AI assistant and startup consultant.\n\n"
            "Guidelines:\n"
            "- Give accurate, fact-based answers only. No guessing or hallucination.\n"
            "- Keep responses concise (max 5–7 points or under 200 words).\n"
            "- Always provide step-by-step, actionable advice that a business can implement immediately.\n"
            "- Focus on CRM, sales funnels, customer retention, automation, and business growth.\n"
            "- Prioritize practical execution over theory.\n"
            "- Use clear structure (numbered steps or bullet points).\n"
            "- Ask for clarification if the query is unclear.\n"
            "- Do not add filler or repeat the question.\n\n"
            "Tone: Professional, direct, and efficient, like a startup consultant."
        )
    }
]

        # Append incoming messages (history + current user message)
        for msg in request.messages:
            messages.append({"role": msg.role, "content": msg.content})

        payload = {
            "model": "llama3.2",
            "messages": messages,
            "stream": False
        }

        response = requests.post(OLLAMA_URL, json=payload)
        response.raise_for_status()

        data = response.json()
        reply = data.get("message", {}).get("content", "")

        return {"reply": reply}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)