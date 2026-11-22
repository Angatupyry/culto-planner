import { supabase } from '../lib/supabase';
import { MockSongsRepository } from './mockSongsRepository';
import { SupabaseSongsRepository } from './supabaseSongsRepository';
import type { SongsRepository } from './types';

/** Real data when .env.local has Supabase keys, sample data otherwise. */
export const songsRepository: SongsRepository = supabase
  ? new SupabaseSongsRepository(supabase)
  : new MockSongsRepository();

export type * from './types';
