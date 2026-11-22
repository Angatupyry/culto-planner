/**
 * Design tokens — single source of truth.
 * Mirrors src/styles/tokens.css so the same values can be reused
 * in JS (charts, inline styles) or a future React Native app.
 */
export const colors = {
  primary: '#3346D3',
  primaryPressed: '#2535A8',
  primarySoft: '#E8EBFC',
  ink: '#15171C',
  muted: '#5B6070',
  bg: '#F5F6F8',
  surface: '#FFFFFF',
  border: '#E3E5EA',
  onTime: '#1E7A4C',
  onTimeSoft: '#E6F2EC',
  tight: '#A65A00',
  tightSoft: '#FBEFE0',
  late: '#B42318',
  lateSoft: '#FDECEA',
  special: '#8A4FD6',
  specialSoft: '#F3ECFC',
  specialInk: '#6A35B0',
  liveBg: '#0E1014',
  liveSurface: '#171A21',
  liveText: '#F2F3F5',
  liveMuted: '#B5BAC6',
} as const;

export const space = { 1: 4, 2: 8, 3: 12, 4: 16, 6: 24, 8: 32 } as const;

export const radius = { sm: 8, md: 12, lg: 16, sheet: 20, pill: 999 } as const;

export const font = {
  family: "'Plus Jakarta Sans Variable', system-ui, sans-serif",
  display: { size: 28, weight: 800 },
  title: { size: 20, weight: 700 },
  body: { size: 16, weight: 400 },
  label: { size: 13, weight: 600 },
  lyrics: { size: 26, weight: 600, lineHeight: 1.4 },
  timer: { size: 44, weight: 800 },
} as const;

/** Minimum touch target in px. */
export const touch = 44;

export type TimeStatus = 'onTime' | 'tight' | 'late';

/** Plan status from used vs. available minutes. "tight" = within the last 5%. */
export function timeStatus(usedSeconds: number, totalSeconds: number): TimeStatus {
  if (usedSeconds > totalSeconds) return 'late';
  if (usedSeconds > totalSeconds * 0.95) return 'tight';
  return 'onTime';
}
