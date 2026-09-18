-- Fresh Supabase project setup. Do not run on an existing project with data.
create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    level integer not null default 1 check (level >= 1),
    current_exp integer not null default 0 check (current_exp >= 0),
    next_exp integer not null default 100 check (next_exp > 0),
    updated_at timestamptz not null default now()
);

create table public.habits (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    title text not null check (length(btrim(title)) > 0),
    description text,
    category text not null default 'routine'
        check (category in ('health', 'study', 'hobby', 'routine', 'etc')),
    is_completed boolean not null default false,
    exp_reward integer not null default 10 check (exp_reward > 0),
    streak integer not null default 0 check (streak >= 0),
    created_at timestamptz not null default now()
);

create index habits_user_created_at_idx on public.habits (user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.habits enable row level security;

create policy "Users read own profile" on public.profiles
    for select to authenticated using ((select auth.uid()) = id);
create policy "Users read own habits" on public.habits
    for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users insert own habits" on public.habits
    for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users update own habits" on public.habits
    for update to authenticated using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);
create policy "Users delete own habits" on public.habits
    for delete to authenticated using ((select auth.uid()) = user_id);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
    insert into public.profiles (id) values (new.id);
    return new;
end;
$$;

create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

alter publication supabase_realtime add table public.habits;
alter publication supabase_realtime add table public.profiles;
