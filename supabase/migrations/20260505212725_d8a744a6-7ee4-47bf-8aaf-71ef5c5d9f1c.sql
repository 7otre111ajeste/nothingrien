
-- counters
alter table public.user_stats
  add column if not exists nothings_sent integer not null default 0,
  add column if not exists nothings_received integer not null default 0;

-- nothings log
create table public.nothings (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  check (sender_id <> recipient_id)
);
create index nothings_recipient_idx on public.nothings (recipient_id, created_at desc);
create index nothings_sender_idx on public.nothings (sender_id, created_at desc);

alter table public.nothings enable row level security;
create policy "nothings public read" on public.nothings for select using (true);
-- inserts go through the security definer function only
create policy "nothings sender insert" on public.nothings for insert with check (auth.uid() = sender_id);

-- send_nothing RPC: bumps both counters & logs the send
create or replace function public.send_nothing(target uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  recent_count int;
begin
  if uid is null then raise exception 'not authenticated'; end if;
  if target = uid then raise exception 'cannot send nothing to yourself'; end if;

  -- rate limit: max 60 sends per minute
  select count(*) into recent_count
    from public.nothings
    where sender_id = uid and created_at > now() - interval '1 minute';
  if recent_count >= 60 then raise exception 'rate limited'; end if;

  -- log
  insert into public.nothings (sender_id, recipient_id) values (uid, target);

  -- bump sender (ensure row exists)
  insert into public.user_stats (user_id, nothings_sent)
    values (uid, 1)
    on conflict (user_id) do update set nothings_sent = public.user_stats.nothings_sent + 1, updated_at = now();

  -- bump recipient
  insert into public.user_stats (user_id, nothings_received)
    values (target, 1)
    on conflict (user_id) do update set nothings_received = public.user_stats.nothings_received + 1, updated_at = now();
end;
$$;

grant execute on function public.send_nothing(uuid) to authenticated;

-- realtime
alter publication supabase_realtime add table public.nothings;
