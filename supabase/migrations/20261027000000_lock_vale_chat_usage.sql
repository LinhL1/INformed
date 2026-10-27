-- Security fix: the daily Vale chat limit was enforced by a counter row the
-- user could write to directly. With the insert/update policies from
-- 20260813211634, any signed-in user could PATCH their own row via the REST API
-- (e.g. request_count = -100000) and get effectively unlimited Gemini calls on
-- the project's paid key. The edge function's read-then-upsert was also not
-- atomic, so parallel requests could all read the same count and slip past it.
--
-- After this migration clients can only SELECT their own usage rows; the only
-- write path is increment_vale_chat_usage(), which atomically bumps the
-- caller's own counter (auth.uid()) and returns the new value. Calling it
-- directly from the browser only ever raises the caller's own count.
--
-- Deploy order: apply this migration, then redeploy the vale-chat function
-- right away. Until the function is redeployed, the old code's upsert is
-- rejected (and ignored), so chat keeps working but uncounted.

drop policy if exists "Users can insert own vale chat usage" on public.vale_chat_usage;
drop policy if exists "Users can update own vale chat usage" on public.vale_chat_usage;

create or replace function public.increment_vale_chat_usage()
returns integer
language sql
security definer
set search_path = ''
as $$
  insert into public.vale_chat_usage (user_id, usage_date, request_count)
  values (auth.uid(), current_date, 1)
  on conflict (user_id, usage_date)
  do update set request_count = public.vale_chat_usage.request_count + 1
  returning request_count;
$$;

revoke execute on function public.increment_vale_chat_usage() from public, anon;
grant execute on function public.increment_vale_chat_usage() to authenticated;
