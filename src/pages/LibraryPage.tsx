import { useMemo, useState } from 'react';
import { Icon } from '../components/Icon';
import ui from '../components/ui.module.css';
import type { Song } from '../data';
import { useSongs } from '../hooks/useSongs';
import { formatDuration, normalize } from '../lib/format';
import styles from './LibraryPage.module.css';
import { SongFormSheet } from './library/SongFormSheet';

/** null = sheet closed, {} = new song, { song } = editing that song. */
type Editing = { song?: Song } | null;

export function LibraryPage() {
  const { songs, loading, error, reload, save, remove } = useSongs();
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Editing>(null);

  const visible = useMemo(() => {
    const q = normalize(query);
    if (!q) return songs;
    return songs.filter((s) => normalize(s.title).includes(q) || normalize(s.lyrics).includes(q));
  }, [songs, query]);

  return (
    <section className={`container ${styles.page}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>Biblioteca</h1>
        <button
          type="button"
          className={ui.iconButton}
          aria-label="Agregar alabanza"
          onClick={() => setEditing({})}
        >
          <Icon name="plus" />
        </button>
      </header>

      <label className={styles.search}>
        <Icon name="search" size={18} />
        <span className="visually-hidden">Buscar alabanzas</span>
        <input
          type="search"
          placeholder="Buscar por título o letra"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      {error ? (
        <div className={styles.state} role="alert">
          <p>{error}</p>
          <button type="button" className={ui.buttonSecondary} onClick={() => void reload()}>
            Reintentar
          </button>
        </div>
      ) : loading ? (
        <p className={styles.state}>Cargando…</p>
      ) : songs.length === 0 ? (
        <div className={styles.state}>
          <p>Todavía no hay alabanzas.</p>
          <button type="button" className={ui.button} onClick={() => setEditing({})}>
            Agregar la primera
          </button>
        </div>
      ) : (
        <>
          <p className={styles.count}>
            {query ? `${visible.length} de ${songs.length} alabanzas` : `${songs.length} alabanzas`}
          </p>
          {visible.length === 0 ? (
            <p className={styles.state}>Nada coincide con «{query}».</p>
          ) : (
            <ul className={styles.list}>
              {visible.map((song) => (
                <li key={song.id}>
                  <button
                    type="button"
                    className={styles.item}
                    onClick={() => setEditing({ song })}
                  >
                    <span className={styles.key}>
                      <span className="visually-hidden">Tono </span>
                      {song.song_key ?? '—'}
                    </span>
                    <span className={styles.songTitle}>{song.title}</span>
                    <span className={styles.duration}>{formatDuration(song.duration_seconds)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <SongFormSheet
        open={editing !== null}
        song={editing?.song}
        onClose={() => setEditing(null)}
        onSave={save}
        onDelete={remove}
      />
    </section>
  );
}
