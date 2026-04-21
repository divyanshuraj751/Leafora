import numpy as np
from PIL import Image

from app.utils.label_map import label_map
from app.services.ml.model_loader import get_model

IMG_SIZE = 256


def preprocess(image: Image.Image) -> np.ndarray:
    image = image.convert("RGB").resize((IMG_SIZE, IMG_SIZE))
    arr = np.array(image)
    # Model was trained with OpenCV (BGR), so convert RGB -> BGR
    arr = arr[:, :, ::-1].copy()
    arr = arr.reshape(1, IMG_SIZE, IMG_SIZE, 3)
    return arr


def predict(image: Image.Image) -> dict:
    model = get_model()
    img = preprocess(image)
    preds = model.predict(img, verbose=0)

    class_idx = int(np.argmax(preds[0]))
    confidence = float(np.max(preds[0]))

    return {
        "disease": label_map.get(class_idx, "Unknown"),
        "confidence": round(confidence * 100, 1),
    }