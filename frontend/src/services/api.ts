/**
 * Leafora API service
 * Thin axios-style wrapper. Mirrors the JSX project's `services/api.js` so
 * a real backend can drop in without changing pages/components.
 *
 * Backend resilience: every call is wrapped in try/catch and falls back to
 * deterministic mock data so the UI never crashes if the ML model, weather
 * provider, or DB endpoints are unavailable / change shape.
 */
import type { DiseaseResult } from "@/components/result/DiseaseCard";
import type { ScanHistoryItem } from "@/components/common/HistoryList";

const API_BASE = import.meta.env.PROD ? "/_/backend" : ((import.meta.env.VITE_API_URL as string | undefined) ?? "");

async function safeFetch<T>(path: string, init?: RequestInit, fallback?: T): Promise<T> {
  if (!API_BASE) return fallback as T;
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
      ...init,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[Leafora API] ${path} failed, using fallback`, err);
    return fallback as T;
  }
}

/** Predict disease from an uploaded image. Backend should accept multipart/form-data. */
export async function predictDisease(file: File): Promise<DiseaseResult> {
  const fallback: DiseaseResult = {
    name: "Tomato Late Blight",
    confidence: 0.943,
    severity: "high",
    description:
      "Late blight is caused by the oomycete Phytophthora infestans. It spreads rapidly in cool, wet conditions and can destroy entire crops within days if untreated.",
    treatment: [
      "Remove and destroy all infected plant parts immediately",
      "Apply copper-based fungicide every 7-10 days",
      "Improve air circulation by spacing plants properly",
      "Avoid overhead watering — use drip irrigation instead",
    ],
    prevention: [
      "Use certified disease-free seeds and transplants",
      "Practice 3-year crop rotation with non-solanaceous crops",
      "Mulch around plants to prevent soil splash",
      "Monitor weather — apply preventive fungicide before wet periods",
    ],
    isHealthy: false,
  };

  if (!API_BASE) return fallback;

  try {
    const form = new FormData();
    form.append("image", file);
    const res = await fetch(`${API_BASE}/predict`, { method: "POST", body: form });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return normalizePrediction(data, fallback);
  } catch (err) {
    console.warn("[Leafora API] /predict failed, using fallback", err);
    return fallback;
  }
}

/** Normalize possibly-changing backend shape into our DiseaseResult contract. */
function normalizePrediction(raw: any, fallback: DiseaseResult): DiseaseResult {
  if (!raw || typeof raw !== "object") return fallback;
  const confidence = Number(raw.confidence ?? raw.score ?? raw.probability ?? fallback.confidence);
  const severity: DiseaseResult["severity"] =
    raw.severity === "low" || raw.severity === "medium" || raw.severity === "high"
      ? raw.severity
      : confidence > 0.8 ? "high" : confidence > 0.5 ? "medium" : "low";
  return {
    name: String(raw.name ?? raw.disease ?? raw.label ?? fallback.name),
    confidence: isFinite(confidence) ? Math.max(0, Math.min(1, confidence)) : fallback.confidence,
    severity,
    description: String(raw.description ?? raw.summary ?? fallback.description),
    treatment: Array.isArray(raw.treatment) ? raw.treatment.map(String) : fallback.treatment,
    prevention: Array.isArray(raw.prevention) ? raw.prevention.map(String) : fallback.prevention,
    isHealthy: Boolean(raw.isHealthy ?? raw.healthy ?? false),
  };
}

/** Fetch the user's past scans. */
export async function fetchHistory(): Promise<ScanHistoryItem[]> {
  const fallback: ScanHistoryItem[] = [
    { id: "1", plantName: "Tomato", disease: "Late Blight", date: "Apr 5, 2026", severity: "high", imageUrl: "https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=200&h=200&fit=crop", isHealthy: false },
    { id: "2", plantName: "Rose", disease: "Black Spot", date: "Apr 3, 2026", severity: "medium", imageUrl: "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=200&h=200&fit=crop", isHealthy: false },
    { id: "3", plantName: "Basil", disease: "Healthy", date: "Apr 1, 2026", severity: "low", imageUrl: "https://images.unsplash.com/photo-1629157282184-91d0cdab2e24?w=200&h=200&fit=crop", isHealthy: true },
    { id: "4", plantName: "Pepper", disease: "Bacterial Spot", date: "Mar 28, 2026", severity: "medium", imageUrl: "https://images.unsplash.com/photo-1583286814809-a96c0b3e8d20?w=200&h=200&fit=crop", isHealthy: false },
  ];
  return safeFetch<ScanHistoryItem[]>("/history", undefined, fallback);
}

export interface WeatherData {
  temp: number;
  humidity: number;
  condition: string;
  wind: number;
  risk: string;
  location: string;
}

/** Fetch weather + disease risk context. */
export async function fetchWeather(lat?: number, lon?: number): Promise<WeatherData> {
  const fallback: WeatherData = { temp: 24, humidity: 65, condition: "Partly Cloudy", wind: 12, risk: "Low disease risk today", location: "Local" };
  const qs = lat != null && lon != null ? `?lat=${lat}&lon=${lon}` : "";
  return safeFetch<WeatherData>(`/weather${qs}`, undefined, fallback);
}
