-- culto-planner · initial schema
-- songs: the shared library
-- services: one worship day to coordinate (e.g. Sunday 9:00, 60 min)
-- service_items: the ordered plan for a service — songs and specials mixed

create extension if not exists pgcrypto;

-- ── updated_at helper ────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── songs ────────────────────────────────────────────────────────────
create table public.songs (
  id               uuid primary key default gen_random_uuid(),
  title            text not null check (length(trim(title)) > 0),
  lyrics           text not null default '',
  song_key         text,                                   -- musical key, e.g. 'G', 'Bb'
  duration_seconds integer not null default 240 check (duration_seconds > 0),
  created_by       uuid references auth.users (id) on delete set null default auth.uid(),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index songs_title_idx on public.songs (lower(title));

create trigger songs_set_updated_at
  before update on public.songs
  for each row execute function public.set_updated_at();

-- ── services ─────────────────────────────────────────────────────────
create table public.services (
  id               uuid primary key default gen_random_uuid(),
  service_date     date not null,
  label            text not null default 'Culto',
  start_time       time,
  duration_minutes integer not null default 60 check (duration_minutes > 0),
  notes            text,
  created_by       uuid references auth.users (id) on delete set null default auth.uid(),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index services_date_idx on public.services (service_date desc);

create trigger services_set_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

-- ── service_items ────────────────────────────────────────────────────
create table public.service_items (
  id               uuid primary key default gen_random_uuid(),
  service_id       uuid not null references public.services (id) on delete cascade,
  kind             text not null check (kind in ('song', 'special')),
  position         integer not null,
  duration_seconds integer not null check (duration_seconds > 0),

  -- songs
  song_id          uuid references public.songs (id) on delete set null,
  title            text,                                   -- free title: improvised song or the special's song
  priority         text not null default 'must' check (priority in ('must', 'optional')),

  -- specials
  performer        text,                                   -- who sings, e.g. 'Hna. María'

  -- live mode
  status           text not null default 'planned' check (status in ('planned', 'done', 'skipped')),
  added_live       boolean not null default false,

  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),

  constraint song_needs_source
    check (kind <> 'song' or song_id is not null or title is not null),
  constraint special_needs_performer
    check (kind <> 'special' or performer is not null)
);

create index service_items_order_idx on public.service_items (service_id, position);

create trigger service_items_set_updated_at
  before update on public.service_items
  for each row execute function public.set_updated_at();

-- ── Row Level Security ───────────────────────────────────────────────
-- The anon key ships in the frontend, so RLS is what protects the data.
-- Everyone can read; only signed-in coordinators can write.
alter table public.songs         enable row level security;
alter table public.services      enable row level security;
alter table public.service_items enable row level security;

create policy "songs are readable by everyone"
  on public.songs for select to anon, authenticated using (true);
create policy "coordinators manage songs"
  on public.songs for all to authenticated using (true) with check (true);

create policy "services are readable by everyone"
  on public.services for select to anon, authenticated using (true);
create policy "coordinators manage services"
  on public.services for all to authenticated using (true) with check (true);

create policy "service items are readable by everyone"
  on public.service_items for select to anon, authenticated using (true);
create policy "coordinators manage service items"
  on public.service_items for all to authenticated using (true) with check (true);
