
alter table public.user_stats
  add column if not exists badges integer[] not null default '{}';
