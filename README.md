# Leafora 🌿

**Leafora** is an intelligent plant‑health assistant that combines a FastAPI backend with a modern React frontend. It uses a machine‑learning model to identify plant diseases from images, enriches the diagnosis with real‑time weather data, and provides expert advice via Gemini AI.

---

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Running Locally](#running-locally)
- [API Overview](#api-overview)
- [Deploying the Model](#deploying-the-model)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Disease detection** – Upload a leaf image and get a prediction with confidence.
- **Weather‑aware advice** – Real‑time weather data tailors the treatment suggestions.
- **AI‑generated guidance** – Gemini‑2.0‑flash crafts farmer‑friendly explanations.
- **Vercel‑ready** – Frontend can be deployed to Vercel; the model is served from a cloud‑hosted URL.
- **Intuitive UI** – Glass‑morphism navigation, subtle animations, and a custom leaf logo.

---

## Demo

> *The live demo is hosted at* `https://leafora.vercel.app` *(replace with your Vercel URL after deployment).*  

---

## Project Structure

```
leafora/
├─ backend/                # FastAPI server
│  ├─ app/
│  │  ├─ api/            # Route definitions (chat, weather, analyze)
│  │  ├─ services/       # AI, ML, external integrations
│  │  ├─ utils/          # Helper utilities (label map, etc.)
│  │  └─ main.py         # Application entry point
│  └─ requirements.txt   # Python dependencies
├─ frontend/               # React + Vite + Tailwind
│  ├─ src/
│  │  ├─ assets/         # Images, leaf.svg logo
│  │  ├─ components/     # UI components (Navbar, Footer, etc.)
│  │  ├─ pages/          # Home, Result, NotFound
│  │  └─ App.tsx         # Root component
│  └─ vite.config.ts      # Vite configuration
├─ ml/                     # Model files (kept in cloud, only placeholder here)
├─ docs/                   # Documentation (this README, API, CONTRIBUTING…)
└─ .env                    # Environment variables (API keys, model URL)
```

---

## Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your‑username/leafora.git
   cd leafora
   ```
2. **Backend**
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```
   Create a `.env` file (copy from `.env.example`) and fill in:
   - `GEMINI_API_KEY`
   - `WEATHER_API_KEY`
   - `MODEL_URL` – URL to the model file hosted on Vercel or any static bucket.
3. **Frontend**
   ```bash
   cd ../frontend
   npm install
   ```
   Add the same environment variables to `frontend/.env` if you need them at build time.

---

## Running Locally

### Backend
```bash
uvicorn backend.app.main:app --reload
```
The API will be available at `http://127.0.0.1:8000`.

### Frontend
```bash
npm run dev
```
Open `http://localhost:5173` to view the UI.

---

## API Overview

The backend exposes three main groups of endpoints:

| Group | Path | Description |
|-------|------|-------------|
| **Analyze** | `/analyze` | Accepts an image, runs the ML model, and returns disease, confidence, and weather data. |
| **Chat** | `/chat` | Sends a prompt + conversation history to Gemini and returns a concise, farmer‑friendly response. |
| **Weather** | `/weather` | Retrieves current weather for a given latitude/longitude (or defaults to Delhi) and returns a risk assessment. |

All routes return JSON and are documented automatically via FastAPI's OpenAPI UI (`/docs`).

---

## Deploying the Model

The model is stored in a public bucket (e.g., Vercel static assets). The backend loads it lazily:
```python
MODEL_URL = os.getenv("MODEL_URL")
# download if not present locally, cache, then load with keras.models.load_model
```
When you push a new `.h5` file to the bucket, the backend will automatically fetch the latest version on the next request – no code change required.

---

## Contributing

We welcome contributions! Please read our [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines on:
- Setting up a development environment.
- Running tests (`pytest` for backend, `npm test` for frontend).
- Submitting pull requests.
- Code style – we use **Black** for Python and **Prettier** for TypeScript.

---

*Happy planting!* 🌱
