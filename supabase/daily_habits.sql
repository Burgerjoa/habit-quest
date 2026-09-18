-- Run once after setup.sql. Existing users and habits are preserved.
begin;

alter table public.habits add column archived_at timestamptz;
alter table public.habits add constraint habits_id_user_id_key unique (id, user_id);

insert into public.profiles (id)
select id from auth.users
on conflict (id) do nothing;

alter table public.profiles add column total_exp integer;
update public.profiles
set total_exp = greatest(0,
    (level - 1) * 100 + 25 * (level - 1) * (level - 2) + current_exp
);
alter table public.profiles alter column total_exp set default 0;
alter table public.profiles alter column total_exp set not null;
alter table public.profiles add constraint profiles_total_exp_nonnegative check (total_exp >= 0);

create table public.habit_completions (
    habit_id uuid not null,
    user_id uuid not null,
    completed_on date not null,
    created_at timestamptz not null default now(),
    primary key (habit_id, completed_on),
    foreign key (habit_id, user_id) references public.habits (id, user_id) on delete cascade
);

create index habit_completions_user_date_idx
    on public.habit_completions (user_id, completed_on desc);

-- Realtime needs the deleted row's user_id to filter completion removals.
alter table public.habit_completions replica identity full;

alter table public.habit_completions enable row level security;
create policy "Users read own completions" on public.habit_completions
    for select to authenticated using ((select auth.uid()) = user_id);
-- Only the RPC may change completion rows or earned XP.
drop policy if exists "Users update own profile" on public.profiles;
revoke insert, update, delete on public.habit_completions from authenticated;
revoke update on public.profiles from authenticated;
grant select on public.habit_completions to authenticated;
revoke insert, update, delete on public.habits from authenticated;
grant select on public.habits to authenticated;
grant insert (user_id, title, description, category) on public.habits to authenticated;
grant update (title, description, category, archived_at) on public.habits to authenticated;
grant select on public.profiles to authenticated;

-- A habit row lock serializes toggles, and both writes commit or roll back together.
-- Definer rights are needed because direct writes to completions and XP are denied;
-- the authenticated user is checked explicitly against the habit owner.
create function public.toggle_habit_completion(p_habit_id uuid, p_completed_on date)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_user_id uuid := (select auth.uid());
    v_reward integer;
    v_completed boolean;
    v_total integer;
    v_level integer := 1;
    v_current integer;
    v_next integer := 100;
begin
    if v_user_id is null then
        raise exception 'Authentication required';
    end if;
    if p_completed_on is distinct from (now() at time zone 'Asia/Seoul')::date then
        raise exception 'Invalid completion date';
    end if;

    select exp_reward into v_reward
    from public.habits
    where id = p_habit_id and user_id = v_user_id and archived_at is null
    for update;
    if not found then
        raise exception 'Active habit not found';
    end if;

    select total_exp into v_total
    from public.profiles where id = v_user_id for update;
    if not found then
        raise exception 'Profile not found';
    end if;

    if exists (
        select 1 from public.habit_completions
        where habit_id = p_habit_id and completed_on = p_completed_on
    ) then
        delete from public.habit_completions
        where habit_id = p_habit_id and completed_on = p_completed_on;
        v_total := greatest(0, v_total - v_reward);
        v_completed := false;
    else
        insert into public.habit_completions (habit_id, user_id, completed_on)
        values (p_habit_id, v_user_id, p_completed_on);
        v_total := v_total + v_reward;
        v_completed := true;
    end if;

    v_current := v_total;
    while v_current >= v_next loop
        v_current := v_current - v_next;
        v_level := v_level + 1;
        v_next := v_next + 50;
    end loop;
    update public.profiles
    set total_exp = v_total, level = v_level, current_exp = v_current,
        next_exp = v_next, updated_at = now()
    where id = v_user_id;
    return v_completed;
end;
$$;

revoke all on function public.toggle_habit_completion(uuid, date) from public;
grant execute on function public.toggle_habit_completion(uuid, date) to authenticated;

alter publication supabase_realtime add table public.habit_completions;

commit;
