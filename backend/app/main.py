from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.api.routes.analyze import router as analyze_router
from app.api.routes.chat import router as chat_router
from app.api.routes.weather import router as weather_router
from app.services.ml.model_loader import init_model


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_model()
    yield

app = FastAPI(title="Leafora API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze_router)
app.include_router(chat_router)
app.include_router(weather_router)

@app.get("/")
def root():
    return {"status": "Leafora API running"}