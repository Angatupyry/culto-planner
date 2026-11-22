import { supabase } from '../lib/supabase';
import { MockServicesRepository } from './mockServicesRepository';
import { MockSongsRepository } from './mockSongsRepository';
import { SupabaseServicesRepository } from './supabaseServicesRepository';
import { SupabaseSongsRepository } from './supabaseSongsRepository';
import type { ServicesRepository, SongsRepository } from './types';

// Real data when .env.local has Supabase keys, sample data otherwise.

export const songsRepository: SongsRepository = supabase
  ? new SupabaseSongsRepository(supabase)
  : new MockSongsRepository();

export const servicesRepository: ServicesRepository = supabase
  ? new SupabaseServicesRepository(supabase)
  : new MockServicesRepository();

export type * from './types';
