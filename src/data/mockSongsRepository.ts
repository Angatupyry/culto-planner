import { sampleSongs } from './sampleData';
import type { Song, SongDraft, SongsRepository } from './types';

const STORAGE_KEY = 'culto-planner:songs';

/**
 * Demo repository used until Supabase is configured.
 * Keeps songs in localStorage so edits survive a reload on this browser.
 */
export class MockSongsRepository implements SongsRepository {
  private cache: Song[] | null = null;

  private get songs(): Song[] {
    this.cache ??= this.read();
    return this.cache;
  }

  private read(): Song[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as Song[];
    } catch {
      // Storage unavailable or corrupt: fall back to the sample data.
    }
    return sampleSongs;
  }

  private write(songs: Song[]) {
    this.cache = songs;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(songs));
    } catch {
      // Private mode or full storage: changes last until reload.
    }
  }

  async list() {
    return [...this.songs];
  }

  async save(draft: SongDraft) {
    const song: Song = { ...draft, id: draft.id ?? crypto.randomUUID() };
    const exists = this.songs.some((s) => s.id === song.id);
    this.write(
      exists ? this.songs.map((s) => (s.id === song.id ? song : s)) : [...this.songs, song],
    );
    return song;
  }

  async remove(id: string) {
    this.write(this.songs.filter((s) => s.id !== id));
  }
}
