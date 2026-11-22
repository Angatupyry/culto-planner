/**
 * Tiny localStorage wrapper for the demo repositories.
 * Every access is guarded: storage can be missing, full or blocked.
 */
export function loadJson<T>(key: string, fallback: () => T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    // Unavailable or corrupt: use the fallback.
  }
  return fallback();
}

export function saveJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private mode or full storage: changes last until reload.
  }
}
