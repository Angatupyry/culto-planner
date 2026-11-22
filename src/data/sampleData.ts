import { addDays, nextSunday, today } from '../lib/dates';
import type { Service, ServiceItem, Song } from './types';

// Lyrics are placeholders on purpose — the real ones get pasted in the app.
const lyrics = (title: string) =>
  `[Estrofa 1]\nLetra de «${title}»\n\n[Coro]\nPega aquí la letra completa\n\n[Estrofa 2]\n…`;

export const sampleSongs: Song[] = [
  { id: 'sample-1', title: 'Grande es tu fidelidad', song_key: 'G', duration_seconds: 270 },
  { id: 'sample-2', title: 'Sublime gracia', song_key: 'D', duration_seconds: 225 },
  { id: 'sample-3', title: 'Santo, santo, santo', song_key: 'E', duration_seconds: 240 },
  { id: 'sample-4', title: 'Castillo fuerte', song_key: 'C', duration_seconds: 200 },
  { id: 'sample-5', title: 'Oh, qué amigo nos es Cristo', song_key: 'A', duration_seconds: 230 },
  { id: 'sample-6', title: 'Cuán grande es Él', song_key: 'F', duration_seconds: 310 },
  { id: 'sample-7', title: 'Al Rey de los siglos', song_key: 'Bb', duration_seconds: 175 },
].map((song) => ({ ...song, lyrics: lyrics(song.title) }));

const songDuration = (id: string) => sampleSongs.find((s) => s.id === id)!.duration_seconds;

/** Dates are relative to today so the demo always has upcoming and past days. */
export function buildSampleServices(): { services: Service[]; items: ServiceItem[] } {
  const sunday = nextSunday(addDays(today(), 1));
  const service = (id: string, service_date: string): Service => ({
    id,
    service_date,
    label: 'Culto de la mañana',
    start_time: '09:00:00',
    duration_minutes: 60,
    notes: null,
  });

  const services = [
    service('sample-day-1', sunday),
    service('sample-day-2', addDays(sunday, 7)),
    service('sample-day-0', nextSunday(addDays(today(), -7))),
  ];

  let counter = 0;
  const song = (service_id: string, song_id: string, priority: 'must' | 'optional' = 'must') =>
    ({
      id: `sample-item-${++counter}`,
      service_id,
      kind: 'song',
      position: counter,
      duration_seconds: songDuration(song_id),
      song_id,
      title: null,
      priority,
      performer: null,
      status: 'planned',
      added_live: false,
    }) satisfies ServiceItem;
  const special = (service_id: string, performer: string, minutes: number) =>
    ({
      id: `sample-item-${++counter}`,
      service_id,
      kind: 'special',
      position: counter,
      duration_seconds: minutes * 60,
      song_id: null,
      title: null,
      priority: 'must',
      performer,
      status: 'planned',
      added_live: false,
    }) satisfies ServiceItem;

  const items: ServiceItem[] = [
    // Next Sunday: fits in the hour.
    song('sample-day-1', 'sample-1'),
    song('sample-day-1', 'sample-3'),
    special('sample-day-1', 'Hna. María', 5),
    special('sample-day-1', 'Coro de jóvenes', 6),
    song('sample-day-1', 'sample-4', 'optional'),
    special('sample-day-1', 'Hno. Pedro', 5),
    song('sample-day-1', 'sample-6'),
    special('sample-day-1', 'Dúo Benítez', 5),
    // The Sunday after: too many specials, runs over.
    song('sample-day-2', 'sample-2'),
    song('sample-day-2', 'sample-5'),
    song('sample-day-2', 'sample-3'),
    ...['Hna. Rosa', 'Hno. Juan', 'Familia Ortiz', 'Coro de niños', 'Hna. Ana'].map((p) =>
      special('sample-day-2', p, 7),
    ),
    special('sample-day-2', 'Hno. Pedro', 5),
    special('sample-day-2', 'Coro de jóvenes', 6),
    special('sample-day-2', 'Dúo Benítez', 5),
    song('sample-day-2', 'sample-7', 'optional'),
    // Last Sunday.
    song('sample-day-0', 'sample-1'),
    special('sample-day-0', 'Hna. María', 5),
    song('sample-day-0', 'sample-2'),
  ];

  return { services, items };
}
