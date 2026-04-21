import os
import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/chat", tags=["Chat"])

class ChatTurn(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    prompt: str
    history: Optional[List[ChatTurn]] = []

SYSTEM_PROMPT = """You are an expert plant pathologist and botanist named Leafora Expert. 
Your goal is to help users identify, prevent, and treat plant diseases, and give general botanical advice. 
You are helpful, concise, and friendly. Do not answer questions outside of plants, gardening, or agriculture."""

@router.post("")
async def chat_with_leafora(req: ChatRequest):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not set.")
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={api_key}"
    
    contents = []
    for turn in req.history:
        role = "user" if turn.role == "user" else "model"
        contents.append({
            "role": role,
            "parts": [{"text": turn.content}]
        })
    
    contents.append({
        "role": "user",
        "parts": [{"text": req.prompt}]
    })

    payload = {
        "system_instruction": {
            "parts": {
                "text": SYSTEM_PROMPT
            }
        },
        "contents": contents,
        "generationConfig": {
            "temperature": 0.7,
            "topP": 0.95,
            "topK": 40,
            "maxOutputTokens": 1024
        }
    }
    
    headers = {"Content-Type": "application/json"}
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, json=payload, headers=headers)
            
            if response.status_code != 200:
                print("Gemini REST API Error:", response.text)
                raise HTTPException(status_code=response.status_code, detail="Gemini API returned an error")
            
            data = response.json()
            reply = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
            
            if not reply:
                raise ValueError("Could not extract text from Gemini response structure")
                
            return {"reply": reply}
            
    except Exception as e:
         print(f"Gemini API Error: {e}")
         raise HTTPException(status_code=500, detail=str(e))
