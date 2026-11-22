import { Link } from 'react-router-dom';
import type { ServiceSummary } from '../../data';
import { formatServiceDate, formatTime } from '../../lib/dates';
import { timeStatus } from '../../styles/theme';
import styles from './ServiceCard.module.css';

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

function statusChip(service: ServiceSummary) {
  const total = service.duration_minutes * 60;
  if (service.usedSeconds === 0) return { text: 'Sin plan', tone: 'empty' as const };
  const status = timeStatus(service.usedSeconds, total);
  const diff = Math.round(Math.abs(total - service.usedSeconds) / 60);
  if (status === 'late') return { text: `Se pasa ${diff} min`, tone: status };
  if (status === 'tight') return { text: 'Justo', tone: status };
  return { text: diff === 0 ? 'Justo' : `Sobran ${diff} min`, tone: status };
}

export function ServiceCard({ service }: { service: ServiceSummary }) {
  const chip = statusChip(service);
  const usedMinutes = Math.round(service.usedSeconds / 60);
  const fill = Math.min(100, (service.usedSeconds / (service.duration_minutes * 60)) * 100);
  const time = formatTime(service.start_time);

  return (
    <Link to={`/dias/${service.id}`} className={styles.card}>
      <div className={styles.top}>
        <div className={styles.heading}>
          <span className={styles.date}>{formatServiceDate(service.service_date)}</span>
          <span className={styles.label}>
            {service.label}
            {time && ` · ${time}`}
          </span>
        </div>
        <span className={styles.chip} data-tone={chip.tone}>
          {chip.text}
        </span>
      </div>

      <div className={styles.counts}>
        <span>{plural(service.songCount, 'alabanza', 'alabanzas')}</span>
        <span>{plural(service.specialCount, 'especial', 'especiales')}</span>
      </div>

      <div className={styles.meter}>
        <div className={styles.track}>
          <div className={styles.fill} data-tone={chip.tone} style={{ width: `${fill}%` }} />
        </div>
        <span className={styles.minutes}>
          {usedMinutes} de {service.duration_minutes} min
        </span>
      </div>
    </Link>
  );
}
