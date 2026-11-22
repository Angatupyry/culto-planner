import type { ServiceItemRow, ServiceRow, SongRow } from '../lib/database.types';

// ── Songs ────────────────────────────────────────────────────────────

export type Song = Pick<SongRow, 'id' | 'title' | 'lyrics' | 'song_key' | 'duration_seconds'>;

/** What the song form sends: no id means "create". */
export type SongDraft = Omit<Song, 'id'> & { id?: string };

export interface SongsRepository {
  list(): Promise<Song[]>;
  save(draft: SongDraft): Promise<Song>;
  remove(id: string): Promise<void>;
}

// ── Services (worship days) ──────────────────────────────────────────

export type Service = Pick<
  ServiceRow,
  'id' | 'service_date' | 'label' | 'start_time' | 'duration_minutes' | 'notes'
>;

export type ServiceDraft = Omit<Service, 'id'> & { id?: string };

export type ServiceItem = Pick<
  ServiceItemRow,
  | 'id'
  | 'service_id'
  | 'kind'
  | 'position'
  | 'duration_seconds'
  | 'song_id'
  | 'title'
  | 'priority'
  | 'performer'
  | 'status'
  | 'added_live'
>;

/** A service plus the totals the Home cards need. */
export type ServiceSummary = Service & {
  songCount: number;
  specialCount: number;
  usedSeconds: number;
};

export interface ServicesRepository {
  /** All services, newest date first, with item totals. */
  list(): Promise<ServiceSummary[]>;
  get(id: string): Promise<Service | null>;
  save(draft: ServiceDraft): Promise<Service>;
  remove(id: string): Promise<void>;
}

/** Shared by both repositories so the totals are computed the same way. */
export function summarize(
  service: Service,
  items: Pick<ServiceItem, 'kind' | 'duration_seconds' | 'status'>[],
): ServiceSummary {
  const planned = items.filter((i) => i.status !== 'skipped');
  return {
    ...service,
    songCount: planned.filter((i) => i.kind === 'song').length,
    specialCount: planned.filter((i) => i.kind === 'special').length,
    usedSeconds: planned.reduce((sum, i) => sum + i.duration_seconds, 0),
  };
}
