import { useState, type FormEvent } from 'react';
import { Icon } from '../../components/Icon';
import { Sheet } from '../../components/Sheet';
import ui from '../../components/ui.module.css';
import type { Song, SongDraft } from '../../data';
import { formatDuration } from '../../lib/format';
import styles from './SongFormSheet.module.css';

const KEYS = ['C', 'C#', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const STEP = 15; // seconds per −/+ tap
const MIN_DURATION = 30;

interface SongFormSheetProps {
  open: boolean;
  /** Song to edit; undefined means "new song". */
  song?: Song;
  onClose: () => void;
  onSave: (draft: SongDraft) => Promise<unknown>;
  onDelete: (id: string) => Promise<unknown>;
}

export function SongFormSheet(props: SongFormSheetProps) {
  return (
    <Sheet
      open={props.open}
      title={props.song ? 'Editar alabanza' : 'Nueva alabanza'}
      onClose={props.onClose}
    >
      {/* Keyed so the form state starts fresh for each song. */}
      {props.open && <SongForm key={props.song?.id ?? 'new'} {...props} />}
    </Sheet>
  );
}

function SongForm({ song, onClose, onSave, onDelete }: SongFormSheetProps) {
  const [title, setTitle] = useState(song?.title ?? '');
  const [songKey, setSongKey] = useState(song?.song_key ?? '');
  const [duration, setDuration] = useState(song?.duration_seconds ?? 240);
  const [lyrics, setLyrics] = useState(song?.lyrics ?? '');
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (action: () => Promise<unknown>) => {
    setSaving(true);
    setError(null);
    try {
      await action();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Algo salió mal, intenta de nuevo');
      setSaving(false);
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    void run(() =>
      onSave({
        id: song?.id,
        title: title.trim(),
        song_key: songKey || null,
        duration_seconds: duration,
        lyrics: lyrics.trim(),
      }),
    );
  };

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={ui.field}>
        <label htmlFor="song-title" className={ui.label}>
          Título
        </label>
        <input
          id="song-title"
          className={ui.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoComplete="off"
        />
      </div>

      <div className={styles.row}>
        <div className={ui.field}>
          <label htmlFor="song-key" className={ui.label}>
            Tono
          </label>
          <select
            id="song-key"
            className={ui.input}
            value={songKey}
            onChange={(e) => setSongKey(e.target.value)}
          >
            <option value="">—</option>
            {KEYS.map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </div>

        <div className={ui.field}>
          <span className={ui.label} id="song-duration-label">
            Duración aprox.
          </span>
          <div className={styles.stepper} role="group" aria-labelledby="song-duration-label">
            <button
              type="button"
              aria-label="Restar 15 segundos"
              onClick={() => setDuration((d) => Math.max(MIN_DURATION, d - STEP))}
            >
              <Icon name="minus" size={20} />
            </button>
            <output aria-live="polite">{formatDuration(duration)}</output>
            <button
              type="button"
              aria-label="Sumar 15 segundos"
              onClick={() => setDuration((d) => d + STEP)}
            >
              <Icon name="plus" size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className={ui.field}>
        <label htmlFor="song-lyrics" className={ui.label}>
          Letra
        </label>
        <textarea
          id="song-lyrics"
          className={ui.textarea}
          rows={10}
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          aria-describedby="song-lyrics-hint"
        />
        <span id="song-lyrics-hint" className={ui.hint}>
          Marca las secciones entre corchetes, por ejemplo [Coro] o [Estrofa 2].
        </span>
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <div className={styles.actions}>
        {song && (
          <button
            type="button"
            className={ui.buttonDanger}
            disabled={saving}
            onClick={() =>
              confirmDelete ? void run(() => onDelete(song.id)) : setConfirmDelete(true)
            }
          >
            {confirmDelete ? '¿Eliminar?' : 'Eliminar'}
          </button>
        )}
        <button type="submit" className={`${ui.button} ${styles.grow}`} disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}
