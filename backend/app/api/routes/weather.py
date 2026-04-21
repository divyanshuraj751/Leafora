import os
import httpx
from fastapi import APIRouter, Query, HTTPException
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/weather", tags=["Weather"])

WEATHER_API_KEY = os.environ.get("WEATHER_API_KEY")

@router.get("")
async def get_weather(lat: float = Query(None), lon: float = Query(None)):
    if not WEATHER_API_KEY:
        raise HTTPException(status_code=500, detail="WEATHER_API_KEY not configured")
    
    # Default to generic location if not provided
    q_lat = lat if lat is not None else 28.6139
    q_lon = lon if lon is not None else 77.2090
    
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={q_lat}&lon={q_lon}&appid={WEATHER_API_KEY}&units=metric"
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code != 200:
             print("Weather API error:", response.text)
             raise HTTPException(status_code=500, detail="Could not fetch weather data")
        
        data = response.json()
        
        temp = round(data.get("main", {}).get("temp", 0))
        humidity = data.get("main", {}).get("humidity", 0)
        condition = data.get("weather", [{}])[0].get("main", "Clear")
        wind = round(data.get("wind", {}).get("speed", 0) * 3.6)
        location = data.get("name", "Local")
        
        if humidity > 80 and temp > 20:
             risk = "High fungal disease risk today"
        elif humidity > 60:
             risk = "Moderate plant stress risk"
        else:
             risk = "Low disease risk today"
        
        return {
            "temp": temp,
            "humidity": humidity,
            "condition": condition,
            "wind": wind,
            "risk": risk,
            "location": location
        }
