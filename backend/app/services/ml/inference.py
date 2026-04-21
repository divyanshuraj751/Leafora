from PIL import Image

def preprocess(image: Image.Image) -> None:
    pass

def predict(image: Image.Image) -> dict:
    # Since Vercel Serverless doesn't support the 1.5GB+ size of TensorFlow,
    # inference has been mocked. You can swap this for Gemini Vision API later.
    return {
        "disease": "Tomato Bacterial Spot (Simulated)",
        "confidence": 95.5,
    }