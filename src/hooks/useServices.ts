import { useCallback, useEffect, useState } from 'react';
import { servicesRepository, type ServiceDraft, type ServiceSummary } from '../data';

export function useServices() {
  const [services, setServices] = useState<ServiceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setServices(await servicesRepository.list());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudieron cargar los días');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const save = useCallback(
    async (draft: ServiceDraft) => {
      const saved = await servicesRepository.save(draft);
      await reload();
      return saved;
    },
    [reload],
  );

  return { services, loading, error, reload, save };
}
