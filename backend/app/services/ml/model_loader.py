import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

import tensorflow as tf

_model = None
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "ml", "models", "plant_disease_model.h5")


def init_model():
    global _model
    if _model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(
                f"Model not found at {MODEL_PATH}. "
                "Run fix_model.py first to generate it."
            )
        _model = tf.keras.models.load_model(MODEL_PATH)
        print(f"✅ Model loaded — output classes: {_model.output_shape[-1]}")


def get_model():
    if _model is None:
        raise RuntimeError("Model not loaded — call init_model() first.")
    return _model