import os
import requests
from dotenv import load_dotenv

load_dotenv()

WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")


def get_weather(city: str = "Prayagraj") -> str:
    try:
        url = (
            f"http://api.openweathermap.org/data/2.5/weather"
            f"?q={city}&appid={WEATHER_API_KEY}&units=metric"
        )
        res = requests.get(url, timeout=5)
        data = res.json()

        desc = data["weather"][0]["description"]
        temp = data["main"]["temp"]
        humidity = data["main"]["humidity"]

        return f"{desc}, {temp}°C, humidity {humidity}%"

    except Exception:
        return "weather unavailable"