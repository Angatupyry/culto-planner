import type { SongRow } from '../lib/database.types';

export type Song = Pick<SongRow, 'id' | 'title' | 'lyrics' | 'song_key' | 'duration_seconds'>;

/** What the song form sends: no id means "create". */
export type SongDraft = Omit<Song, 'id'> & { id?: string };

export interface SongsRepository {
  list(): Promise<Song[]>;
  save(draft: SongDraft): Promise<Song>;
  remove(id: string): Promise<void>;
}
