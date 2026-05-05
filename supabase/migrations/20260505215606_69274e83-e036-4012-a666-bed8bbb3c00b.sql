CREATE OR REPLACE FUNCTION public.send_nothing(target uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  uid uuid := auth.uid();
  today_count int;
begin
  if uid is null then raise exception 'not authenticated'; end if;
  if target = uid then raise exception 'cannot send nothing to yourself'; end if;

  -- daily limit: max 3 sends per UTC day
  select count(*) into today_count
    from public.nothings
    where sender_id = uid and created_at >= date_trunc('day', now());
  if today_count >= 3 then raise exception 'daily limit reached (3/day)'; end if;

  insert into public.nothings (sender_id, recipient_id) values (uid, target);

  insert into public.user_stats (user_id, nothings_sent)
    values (uid, 1)
    on conflict (user_id) do update set nothings_sent = public.user_stats.nothings_sent + 1, updated_at = now();

  insert into public.user_stats (user_id, nothings_received)
    values (target, 1)
    on conflict (user_id) do update set nothings_received = public.user_stats.nothings_received + 1, updated_at = now();
end;
$function$;