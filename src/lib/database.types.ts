// Hand-written to match supabase/migrations/20261122000000_init.sql.
// Once the project is linked, regenerate with: pnpm db:types

type Timestamp = string;

export type ItemKind = 'song' | 'special';
export type Priority = 'must' | 'optional';
export type ItemStatus = 'planned' | 'done' | 'skipped';

type Table<Row, Insert> = {
  Row: Row;
  Insert: Insert;
  Update: Partial<Insert>;
  Relationships: [];
};

export interface SongRow {
  id: string;
  title: string;
  lyrics: string;
  song_key: string | null;
  duration_seconds: number;
  created_by: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface ServiceRow {
  id: string;
  service_date: string; // YYYY-MM-DD
  label: string;
  start_time: string | null; // HH:MM:SS
  duration_minutes: number;
  notes: string | null;
  created_by: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface ServiceItemRow {
  id: string;
  service_id: string;
  kind: ItemKind;
  position: number;
  duration_seconds: number;
  song_id: string | null;
  title: string | null;
  priority: Priority;
  performer: string | null;
  status: ItemStatus;
  added_live: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}

type Generated = 'id' | 'created_at' | 'updated_at' | 'created_by';

export interface Database {
  public: {
    Tables: {
      songs: Table<
        SongRow,
        Omit<SongRow, Generated | 'lyrics' | 'duration_seconds' | 'song_key'> &
          Partial<Pick<SongRow, 'id' | 'lyrics' | 'duration_seconds' | 'song_key'>>
      >;
      services: Table<
        ServiceRow,
        Pick<ServiceRow, 'service_date'> &
          Partial<Omit<ServiceRow, Generated | 'service_date'>> &
          Partial<Pick<ServiceRow, 'id'>>
      >;
      service_items: Table<
        ServiceItemRow,
        Pick<ServiceItemRow, 'service_id' | 'kind' | 'position' | 'duration_seconds'> &
          Partial<Omit<ServiceItemRow, Generated | 'service_id' | 'kind' | 'position' | 'duration_seconds'>> &
          Partial<Pick<ServiceItemRow, 'id'>>
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
