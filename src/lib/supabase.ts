import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** False until .env.local is filled in; screens can fall back to sample data. */
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = url && anonKey ? createClient<Database>(url, anonKey) : null;
