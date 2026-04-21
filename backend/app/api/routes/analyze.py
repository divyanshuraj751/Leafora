from fastapi import APIRouter, UploadFile, File, HTTPException
from PIL import Image
import io

from app.services.ml.inference import predict
from app.services.ai.gemini_service import generate_response
from app.services.external.weather_service import get_weather
from app.schemas.analyze_schema import AnalyzeResponse

router = APIRouter()


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(file: UploadFile = File(...)):

    if file.content_type not in ("image/jpeg", "image/png", "image/webp"):
        raise HTTPException(status_code=400, detail="Upload a JPEG or PNG image.")

    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")

    result = predict(image)
    weather = get_weather()
    ai_response = generate_response(
        result["disease"],
        result["confidence"],
        weather,
    )

    return AnalyzeResponse(
        disease=result["disease"],
        confidence=result["confidence"],
        weather=weather,
        ai_response=ai_response,
    )