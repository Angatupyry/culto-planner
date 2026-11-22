import { loadJson, saveJson } from './localStore';
import { buildSampleServices } from './sampleData';
import {
  summarize,
  type Service,
  type ServiceDraft,
  type ServiceItem,
  type ServicesRepository,
} from './types';

const STORAGE_KEY = 'culto-planner:services';

type Store = { services: Service[]; items: ServiceItem[] };

/** Demo repository: services and their items in localStorage, seeded with sample days. */
export class MockServicesRepository implements ServicesRepository {
  private cache: Store | null = null;

  private get store(): Store {
    this.cache ??= loadJson(STORAGE_KEY, buildSampleServices);
    return this.cache;
  }

  private write(store: Store) {
    this.cache = store;
    saveJson(STORAGE_KEY, store);
  }

  async list() {
    const { services, items } = this.store;
    return [...services]
      .sort((a, b) => b.service_date.localeCompare(a.service_date))
      .map((s) =>
        summarize(
          s,
          items.filter((i) => i.service_id === s.id),
        ),
      );
  }

  async get(id: string) {
    return this.store.services.find((s) => s.id === id) ?? null;
  }

  async save(draft: ServiceDraft) {
    const service: Service = { ...draft, id: draft.id ?? crypto.randomUUID() };
    const { services, items } = this.store;
    const exists = services.some((s) => s.id === service.id);
    this.write({
      items,
      services: exists
        ? services.map((s) => (s.id === service.id ? service : s))
        : [...services, service],
    });
    return service;
  }

  async remove(id: string) {
    const { services, items } = this.store;
    this.write({
      services: services.filter((s) => s.id !== id),
      items: items.filter((i) => i.service_id !== id),
    });
  }
}
