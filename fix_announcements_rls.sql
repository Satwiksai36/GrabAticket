-- 1. FIX user_roles PERMISSIONS (Critical step often missed)
-- We need to check if proper policies exist on user_roles, otherwise the admin check fails recursively.

create table if not exists public.user_roles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  role text not null check (role in ('admin', 'user')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- Drop verify policy if exists to allow recreating it
drop policy if exists "Allow users to read own role" on public.user_roles;

-- Allow users to read THEIR OWN role (needed for the admin check to work)
create policy "Allow users to read own role"
on public.user_roles for select
to authenticated
using (user_id = auth.uid());


-- 2. RE-APPLY Announcements Policies

alter table public.announcements enable row level security;

drop policy if exists "Allow public read access" on public.announcements;
drop policy if exists "Enable insert for admins" on public.announcements;
drop policy if exists "Enable update for admins" on public.announcements;
drop policy if exists "Enable delete for admins" on public.announcements;

-- Public Read
create policy "Allow public read access"
on public.announcements for select
to public
using (true);

-- Admin Insert
create policy "Enable insert for admins"
on public.announcements for insert
to authenticated
with check (
  exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  )
);

-- Admin Update
create policy "Enable update for admins"
on public.announcements for update
to authenticated
using (
  exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  )
);

-- Admin Delete
create policy "Enable delete for admins"
on public.announcements for delete
to authenticated
using (
  exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  )
);

-- 3. ENSURE YOU ARE ADMIN (One-time setup for testing)
-- This tries to make the current executing user an admin if they exist in auth.users
-- Note: When running in SQL Editor, 'auth.uid()' might be null or specific.
-- Ideally, manually insert your user_id into user_roles if this doesn't capture it.
