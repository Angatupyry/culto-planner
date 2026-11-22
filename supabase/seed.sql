-- Sample data for local development (runs with `supabase db reset`).
-- Lyrics are placeholders: paste the real ones from your hymnal.
insert into public.songs (title, song_key, duration_seconds, lyrics) values
  ('Grande es tu fidelidad', 'G', 270, '[Letra]'),
  ('Sublime gracia',         'D', 225, '[Letra]'),
  ('Santo, santo, santo',    'E', 240, '[Letra]'),
  ('Castillo fuerte',        'C', 200, '[Letra]'),
  ('Cuán grande es Él',      'F', 310, '[Letra]');
