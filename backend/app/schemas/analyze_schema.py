from pydantic import BaseModel


class AnalyzeResponse(BaseModel):
    disease: str
    confidence: float
    weather: str
    ai_response: str