-- Per-user, per-day request counter for the Vale chat Edge Function.
-- Same RLS shape as user_progress/user_xp: a user can only touch their own row.
create table vale_chat_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  usage_date date not null default current_date,
  request_count integer not null default 0,
  unique(user_id, usage_date)
);

alter table vale_chat_usage enable row level security;

create policy "Users can read own vale chat usage"
  on vale_chat_usage for select using (auth.uid() = user_id);
create policy "Users can insert own vale chat usage"
  on vale_chat_usage for insert with check (auth.uid() = user_id);
create policy "Users can update own vale chat usage"
  on vale_chat_usage for update using (auth.uid() = user_id);
