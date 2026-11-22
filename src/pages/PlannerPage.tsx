import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { servicesRepository, type Service } from '../data';
import { formatServiceDate, formatTime } from '../lib/dates';
import styles from './PlannerPage.module.css';

// Header only for now — the plan itself (songs, specials, time bar) is the next branch.
export function PlannerPage() {
  const { serviceId = '' } = useParams();
  const [service, setService] = useState<Service | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    servicesRepository
      .get(serviceId)
      .then((s) => active && setService(s))
      .catch(() => active && setService(null));
    return () => {
      active = false;
    };
  }, [serviceId]);

  const time = service ? formatTime(service.start_time) : null;

  return (
    <section className={`container ${styles.page}`}>
      <header className={styles.header}>
        <Link to="/" className={styles.back} aria-label="Volver a los días">
          <Icon name="back" />
        </Link>
        {service && (
          <div className={styles.heading}>
            <h1 className={styles.title}>{formatServiceDate(service.service_date)}</h1>
            <span className={styles.meta}>
              {service.label}
              {time && ` · ${time}`} · {service.duration_minutes} min
            </span>
          </div>
        )}
      </header>

      {service === undefined && <p className={styles.state}>Cargando…</p>}
      {service === null && <p className={styles.state}>No encontramos este día.</p>}
      {service && <p className={styles.state}>El planificador llega en la próxima versión.</p>}
    </section>
  );
}
