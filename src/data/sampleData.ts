import type { Song } from './types';

// Lyrics are placeholders on purpose — the real ones get pasted in the app.
const lyrics = (title: string) =>
  `[Estrofa 1]\nLetra de «${title}»\n\n[Coro]\nPega aquí la letra completa\n\n[Estrofa 2]\n…`;

export const sampleSongs: Song[] = [
  { id: 'sample-1', title: 'Grande es tu fidelidad', song_key: 'G', duration_seconds: 270 },
  { id: 'sample-2', title: 'Sublime gracia', song_key: 'D', duration_seconds: 225 },
  { id: 'sample-3', title: 'Santo, santo, santo', song_key: 'E', duration_seconds: 240 },
  { id: 'sample-4', title: 'Castillo fuerte', song_key: 'C', duration_seconds: 200 },
  { id: 'sample-5', title: 'Oh, qué amigo nos es Cristo', song_key: 'A', duration_seconds: 230 },
  { id: 'sample-6', title: 'Cuán grande es Él', song_key: 'F', duration_seconds: 310 },
  { id: 'sample-7', title: 'Al Rey de los siglos', song_key: 'Bb', duration_seconds: 175 },
].map((song) => ({ ...song, lyrics: lyrics(song.title) }));
