-- 1. Create table if it doesn't match (Using IF NOT EXISTS to avoid error)
create table if not exists public.announcements (
  id uuid not null default gen_random_uuid (),
  title text not null,
  content text not null,
  icon_type text not null,
  color_from text not null,
  color_to text not null,
  priority integer not null default 0,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  constraint announcements_pkey primary key (id)
);

-- 2. Enable RLS
alter table public.announcements enable row level security;

-- 3. Drop OLD policies to avoid conflicts
drop policy if exists "Allow public read access" on public.announcements;
drop policy if exists "Enable insert for admins" on public.announcements;
drop policy if exists "Enable update for admins" on public.announcements;
drop policy if exists "Enable delete for admins" on public.announcements;
-- Drop any potentially named policies from other attempts
drop policy if exists "Enable read access for all users" on public.announcements;
drop policy if exists "Enable insert for admins only" on public.announcements;
drop policy if exists "Enable update for admins only" on public.announcements;
drop policy if exists "Enable delete for admins only" on public.announcements;


-- 4. Re-create Correct Policies

-- Allow everyone to read announcements
create policy "Allow public read access"
on public.announcements
for select
to public
using (true);

-- Allow Admins to INSERT
create policy "Enable insert for admins"
on public.announcements
for insert
to authenticated
with check (
  exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  )
);

-- Allow Admins to UPDATE
create policy "Enable update for admins"
on public.announcements
for update
to authenticated
using (
  exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  )
);

-- Allow Admins to DELETE
create policy "Enable delete for admins"
on public.announcements
for delete
to authenticated
using (
  exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  )
);
