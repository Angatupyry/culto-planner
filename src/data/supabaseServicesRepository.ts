import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../lib/database.types';
import { summarize, type Service, type ServiceDraft, type ServicesRepository } from './types';

const columns = 'id, service_date, label, start_time, duration_minutes, notes';

export class SupabaseServicesRepository implements ServicesRepository {
  private readonly db: SupabaseClient<Database>;

  constructor(db: SupabaseClient<Database>) {
    this.db = db;
  }

  async list() {
    const { data: services, error } = await this.db
      .from('services')
      .select(columns)
      .order('service_date', { ascending: false });
    if (error) throw error;
    if (services.length === 0) return [];

    const { data: items, error: itemsError } = await this.db
      .from('service_items')
      .select('service_id, kind, duration_seconds, status')
      .in(
        'service_id',
        services.map((s) => s.id),
      );
    if (itemsError) throw itemsError;

    return services.map((s) =>
      summarize(
        s,
        items.filter((i) => i.service_id === s.id),
      ),
    );
  }

  async get(id: string): Promise<Service | null> {
    const { data, error } = await this.db
      .from('services')
      .select(columns)
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async save(draft: ServiceDraft): Promise<Service> {
    const { data, error } = await this.db.from('services').upsert(draft).select(columns).single();
    if (error) throw error;
    return data;
  }

  async remove(id: string) {
    const { error } = await this.db.from('services').delete().eq('id', id);
    if (error) throw error;
  }
}
