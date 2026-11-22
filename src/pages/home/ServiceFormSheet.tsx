import { useState, type FormEvent } from 'react';
import { Icon } from '../../components/Icon';
import { Sheet } from '../../components/Sheet';
import ui from '../../components/ui.module.css';
import type { Service, ServiceDraft } from '../../data';
import styles from './ServiceFormSheet.module.css';

const STEP = 5; // minutes per −/+ tap
const MIN_DURATION = 15;

interface ServiceFormSheetProps {
  open: boolean;
  /** Prefilled date for a new day, e.g. the next free Sunday. */
  defaultDate: string;
  onClose: () => void;
  onSave: (draft: ServiceDraft) => Promise<Service>;
}

export function ServiceFormSheet(props: ServiceFormSheetProps) {
  return (
    <Sheet open={props.open} title="Nuevo día" onClose={props.onClose}>
      {props.open && <ServiceForm {...props} />}
    </Sheet>
  );
}

function ServiceForm({ defaultDate, onClose, onSave }: ServiceFormSheetProps) {
  const [date, setDate] = useState(defaultDate);
  const [label, setLabel] = useState('Culto de la mañana');
  const [startTime, setStartTime] = useState('09:00');
  const [duration, setDuration] = useState(60);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSave({
        service_date: date,
        label: label.trim() || 'Culto',
        start_time: startTime ? `${startTime}:00` : null,
        duration_minutes: duration,
        notes: null,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Algo salió mal, intenta de nuevo');
      setSaving(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.row}>
        <div className={ui.field}>
          <label htmlFor="service-date" className={ui.label}>
            Fecha
          </label>
          <input
            id="service-date"
            type="date"
            className={ui.input}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className={ui.field}>
          <label htmlFor="service-time" className={ui.label}>
            Hora de inicio
          </label>
          <input
            id="service-time"
            type="time"
            className={ui.input}
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
      </div>

      <div className={ui.field}>
        <label htmlFor="service-label" className={ui.label}>
          Nombre
        </label>
        <input
          id="service-label"
          className={ui.input}
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          autoComplete="off"
        />
      </div>

      <div className={ui.field}>
        <span className={ui.label} id="service-duration-label">
          Tiempo para coordinar
        </span>
        <div className={styles.stepper} role="group" aria-labelledby="service-duration-label">
          <button
            type="button"
            aria-label="Restar 5 minutos"
            onClick={() => setDuration((d) => Math.max(MIN_DURATION, d - STEP))}
          >
            <Icon name="minus" size={20} />
          </button>
          <output aria-live="polite">{duration} min</output>
          <button
            type="button"
            aria-label="Sumar 5 minutos"
            onClick={() => setDuration((d) => d + STEP)}
          >
            <Icon name="plus" size={20} />
          </button>
        </div>
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <button type="submit" className={ui.button} disabled={saving}>
        {saving ? 'Creando…' : 'Crear y planificar'}
      </button>
    </form>
  );
}
