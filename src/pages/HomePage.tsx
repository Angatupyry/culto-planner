import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import ui from '../components/ui.module.css';
import type { ServiceDraft } from '../data';
import { useServices } from '../hooks/useServices';
import { addDays, nextSunday, today } from '../lib/dates';
import styles from './HomePage.module.css';
import { ServiceCard } from './home/ServiceCard';
import { ServiceFormSheet } from './home/ServiceFormSheet';

export function HomePage() {
  const { services, loading, error, reload, save } = useServices();
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const { upcoming, past, nextFreeSunday } = useMemo(() => {
    const now = today();
    const taken = new Set(services.map((s) => s.service_date));
    let sunday = nextSunday(now);
    while (taken.has(sunday)) sunday = addDays(sunday, 7);
    return {
      // Nearest first for what's coming, most recent first for what's done.
      upcoming: services.filter((s) => s.service_date >= now).reverse(),
      past: services.filter((s) => s.service_date < now),
      nextFreeSunday: sunday,
    };
  }, [services]);

  const create = async (draft: ServiceDraft) => {
    const service = await save(draft);
    navigate(`/dias/${service.id}`);
    return service;
  };

  return (
    <section className={`container ${styles.page}`}>
      <header className={styles.header}>
        <span className={styles.eyebrow}>Coordinación</span>
        <h1 className={styles.title}>Días de culto</h1>
      </header>

      {error ? (
        <div className={styles.state} role="alert">
          <p>{error}</p>
          <button type="button" className={ui.buttonSecondary} onClick={() => void reload()}>
            Reintentar
          </button>
        </div>
      ) : loading ? (
        <p className={styles.state}>Cargando…</p>
      ) : services.length === 0 ? (
        <div className={styles.state}>
          <p>Todavía no hay días planificados.</p>
          <button type="button" className={ui.button} onClick={() => setCreating(true)}>
            Planificar el primero
          </button>
        </div>
      ) : (
        <>
          <h2 className={styles.section}>Próximos</h2>
          {upcoming.length === 0 ? (
            <p className={styles.hint}>No hay días próximos. Crea uno con «Nuevo día».</p>
          ) : (
            <ul className={styles.list}>
              {upcoming.map((s) => (
                <li key={s.id}>
                  <ServiceCard service={s} />
                </li>
              ))}
            </ul>
          )}

          {past.length > 0 && (
            <>
              <h2 className={styles.section}>Anteriores</h2>
              <ul className={styles.list}>
                {past.map((s) => (
                  <li key={s.id}>
                    <ServiceCard service={s} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}

      {services.length > 0 && (
        <button type="button" className={styles.fab} onClick={() => setCreating(true)}>
          <Icon name="plus" size={20} />
          Nuevo día
        </button>
      )}

      <ServiceFormSheet
        open={creating}
        defaultDate={nextFreeSunday}
        onClose={() => setCreating(false)}
        onSave={create}
      />
    </section>
  );
}
