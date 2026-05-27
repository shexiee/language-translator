export type HistoryEntry = {
  id: string;
  sourceLang: string;
  targetLang: string;
  sourceText: string;
  translatedText: string;
  timestamp: string;
};

const KEY = "vocumi:history:v1";
const MAX_ENTRIES = 50;

export function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHistory(entries: HistoryEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
  } catch {
    // ignore quota errors
  }
}

export function appendHistory(entry: Omit<HistoryEntry, "id" | "timestamp">): HistoryEntry[] {
  const existing = loadHistory();
  const next: HistoryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };
  const updated = [next, ...existing].slice(0, MAX_ENTRIES);
  saveHistory(updated);
  return updated;
}

export function removeHistory(id: string): HistoryEntry[] {
  const updated = loadHistory().filter((entry) => entry.id !== id);
  saveHistory(updated);
  return updated;
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
