import { NavLink, Outlet } from 'react-router-dom';
import { Icon } from './components/Icon';
import { isSupabaseConfigured } from './lib/supabase';
import styles from './AppLayout.module.css';

const navClass = ({ isActive }: { isActive: boolean }) => (isActive ? styles.active : undefined);

export function AppLayout() {
  return (
    <div className={styles.shell}>
      {!isSupabaseConfigured && <p className={styles.banner}>Modo demo · datos de ejemplo</p>}
      <main className={styles.main}>
        <Outlet />
      </main>
      <nav className={styles.nav} aria-label="Principal">
        <NavLink to="/" end className={navClass}>
          <Icon name="calendar" />
          Días
        </NavLink>
        <NavLink to="/biblioteca" className={navClass}>
          <Icon name="music" />
          Biblioteca
        </NavLink>
      </nav>
    </div>
  );
}
