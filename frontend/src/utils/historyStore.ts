import type { DiseaseResult } from "@/components/result/DiseaseCard";

export interface LocalScan {
  id: string;
  date: string; // ISO
  preview: string; // dataURL
  result: DiseaseResult;
}

const KEY = "leafora.history.v1";

export function getHistory(): LocalScan[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LocalScan[];
  } catch {
    return [];
  }
}

export function saveScan(scan: LocalScan) {
  const list = getHistory();
  list.unshift(scan);
  // cap at 30 entries to avoid bloating localStorage
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, 30)));
}

export function getScan(id: string): LocalScan | undefined {
  return getHistory().find((s) => s.id === id);
}

export function clearHistory() {
  localStorage.removeItem(KEY);
}
