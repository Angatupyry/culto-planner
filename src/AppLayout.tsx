import { NavLink, Outlet } from 'react-router-dom';

import { isSupabaseConfigured } from './lib/supabase';
import styles from './AppLayout.module.css';

export function AppLayout() {
  return (
    <div className={styles.shell}>
      {!isSupabaseConfigured && (
        <p className={styles.banner}>Sin conexión a Supabase: completa .env.local</p>
      )}
      <main className={styles.main}>
        <Outlet />
      </main>
      <nav className={styles.nav} aria-label="Principal">
        <NavLink to="/" end className={({ isActive }) => (isActive ? styles.active : undefined)}>
          Días
        </NavLink>
        <NavLink
          to="/biblioteca"
          className={({ isActive }) => (isActive ? styles.active : undefined)}
        >
          Biblioteca
        </NavLink>
      </nav>
    </div>
  );
}
