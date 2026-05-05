
-- profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'anon',
  country text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "profiles public read" on public.profiles for select using (true);
create policy "profiles self insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles self update" on public.profiles for update using (auth.uid() = id);

-- user_stats
create table public.user_stats (
  user_id uuid primary key references auth.users(id) on delete cascade,
  total_clicks bigint not null default 0,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  best_session int not null default 0,
  last_click_date date,
  updated_at timestamptz not null default now()
);
alter table public.user_stats enable row level security;
create policy "stats public read" on public.user_stats for select using (true);
create policy "stats self insert" on public.user_stats for insert with check (auth.uid() = user_id);
create policy "stats self update" on public.user_stats for update using (auth.uid() = user_id);

-- clicks_daily
create table public.clicks_daily (
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null,
  count int not null default 0,
  primary key (user_id, day)
);
alter table public.clicks_daily enable row level security;
create policy "daily public read" on public.clicks_daily for select using (true);
create policy "daily self insert" on public.clicks_daily for insert with check (auth.uid() = user_id);
create policy "daily self update" on public.clicks_daily for update using (auth.uid() = user_id);

create index clicks_daily_day_idx on public.clicks_daily (day desc, count desc);
create index user_stats_total_idx on public.user_stats (total_clicks desc);
create index user_stats_streak_idx on public.user_stats (current_streak desc);
create index user_stats_session_idx on public.user_stats (best_session desc);

-- realtime
alter publication supabase_realtime add table public.user_stats;
alter publication supabase_realtime add table public.clicks_daily;
