/** Title-case a disease label coming from the ML model. */
export const formatDiseaseName = (raw: string): string =>
  raw
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

export const severityColor = (s: "low" | "medium" | "high"): string =>
  s === "high" ? "destructive" : s === "medium" ? "sun" : "leaf";
