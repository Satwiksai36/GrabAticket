-- FIX USER MANAGEMENT PERMISSIONS

-- 1. Grant Admins Full Access to user_roles
-- We already have "Allow users to read own role" from previous fix.
-- Now we need to allow Admins to Manage (View All, Add, Delete) roles for others.

create policy "Enable full access for admins"
on public.user_roles for all
to authenticated
using (
  exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  )
);

-- 2. Grant Admins Read Access to All Profiles
-- Profiles usually have "Users can update own profile" and "Public read all".
-- If "Public read all" exists, we are good. If not, we ensure Admins can read.

alter table public.profiles enable row level security;

-- Ensure public can read profiles (common pattern)
-- If you prefer strict privacy, assume only admins should read list.
-- We'll add a specific Admin Read policy just in case.

create policy "Enable read access for admins"
on public.profiles for select
to authenticated
using (
  exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  )
);
