import { useCallback, useEffect, useState } from 'react';
import { songsRepository, type Song, type SongDraft } from '../data';

const byTitle = (a: Song, b: Song) => a.title.localeCompare(b.title, 'es');

export function useSongs() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setSongs((await songsRepository.list()).sort(byTitle));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudieron cargar las alabanzas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const save = useCallback(async (draft: SongDraft) => {
    const saved = await songsRepository.save(draft);
    setSongs((current) => [...current.filter((s) => s.id !== saved.id), saved].sort(byTitle));
    return saved;
  }, []);

  const remove = useCallback(async (id: string) => {
    await songsRepository.remove(id);
    setSongs((current) => current.filter((s) => s.id !== id));
  }, []);

  return { songs, loading, error, reload, save, remove };
}
