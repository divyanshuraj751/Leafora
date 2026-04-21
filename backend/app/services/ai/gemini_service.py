import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def generate_response(disease: str, confidence: float, weather: str) -> str:
    prompt = f"""
You are an expert agronomist advising a farmer.

Detected disease : {disease}
Model confidence : {confidence}%
Current weather  : {weather}

Respond in simple, farmer-friendly language. Provide:
1. Cause of this disease
2. Immediate treatment (organic option + chemical option)
3. Prevention for next season
4. One weather-specific tip based on current conditions

Keep the total response under 200 words.
"""
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
        )
        return response.text
    except Exception as e:
        print(f"Gemini API error: {e}")
        return f"AI analysis unavailable. Detected: {disease} with {confidence}% confidence."