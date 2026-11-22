import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../lib/database.types';
import type { Song, SongDraft, SongsRepository } from './types';

const columns = 'id, title, lyrics, song_key, duration_seconds';

export class SupabaseSongsRepository implements SongsRepository {
  private readonly db: SupabaseClient<Database>;

  constructor(db: SupabaseClient<Database>) {
    this.db = db;
  }

  async list(): Promise<Song[]> {
    const { data, error } = await this.db.from('songs').select(columns).order('title');
    if (error) throw error;
    return data;
  }

  async save(draft: SongDraft): Promise<Song> {
    const { data, error } = await this.db.from('songs').upsert(draft).select(columns).single();
    if (error) throw error;
    return data;
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.db.from('songs').delete().eq('id', id);
    if (error) throw error;
  }
}
