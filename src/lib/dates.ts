/** Dates are stored as local "YYYY-MM-DD" strings, never as UTC instants. */

export function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function fromDateString(value: string): Date {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function today(): string {
  return toDateString(new Date());
}

export function addDays(value: string, days: number): string {
  const date = fromDateString(value);
  date.setDate(date.getDate() + days);
  return toDateString(date);
}

/** The next Sunday on or after `from` (today counts if it is Sunday). */
export function nextSunday(from: string = today()): string {
  const day = fromDateString(from).getDay(); // 0 = Sunday
  return addDays(from, (7 - day) % 7);
}

const longFormat = new Intl.DateTimeFormat('es', {
  weekday: 'long',
  day: 'numeric',
  month: 'short',
});

/** "2026-11-29" → "Domingo 29 nov" */
export function formatServiceDate(value: string): string {
  const text = longFormat.format(fromDateString(value)).replace(',', '').replace('.', '');
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** "09:00:00" → "9:00" */
export function formatTime(value: string | null): string | null {
  if (!value) return null;
  const [h, m] = value.split(':');
  return `${Number(h)}:${m}`;
}
