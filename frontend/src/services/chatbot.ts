/**
 * Leafora chatbot service. Backend should expose POST /chat that accepts
 * { prompt, history } and returns { reply: string }. Falls back to a small
 * canned response set so the UI never breaks if Gemini is down.
 */
const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? "";

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

const fallbackReplies = [
  "Based on the symptoms you described, this could be a fungal infection. Try a copper-based fungicide and improve air circulation.",
  "Yellowing leaves often mean overwatering, nutrient deficiency, or pests. Check soil moisture and the underside of leaves.",
  "Neem oil (2 tbsp per gallon) every 7–14 days is an effective organic treatment for many common plant diseases.",
  "Proper spacing, base watering, and crop rotation are your best preventive measures.",
];

export async function sendMessage(prompt: string, history: ChatTurn[] = []): Promise<string> {
  if (!API_BASE) {
    await new Promise((r) => setTimeout(r, 900));
    return fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
  }
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, history }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return String(data.reply ?? data.message ?? data.text ?? fallbackReplies[0]);
  } catch (err) {
    console.warn("[Leafora chatbot] /chat failed, using fallback", err);
    return fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
  }
}
