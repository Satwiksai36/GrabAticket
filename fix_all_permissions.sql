-- MASTER PERMISSION FIX (Run this once to fix Announcements, Coming Soon, AND Promo Codes)

-- 1. FIX THE ROOT CAUSE: Allow users to check their own admin status
create table if not exists public.user_roles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  role text not null check (role in ('admin', 'user')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, role)
);

alter table public.user_roles enable row level security;
drop policy if exists "Allow users to read own role" on public.user_roles;
create policy "Allow users to read own role"
on public.user_roles for select
to authenticated
using (user_id = auth.uid());


-- 2. RESET COMING SOON POLICIES
alter table public.coming_soon enable row level security;
drop policy if exists "Enable read access for all users" on public.coming_soon;
drop policy if exists "Enable insert for admins only" on public.coming_soon;
drop policy if exists "Enable update for admins only" on public.coming_soon;
drop policy if exists "Enable delete for admins only" on public.coming_soon;

create policy "Enable read access for all users" on public.coming_soon for select using (true);
create policy "Enable insert for admins only" on public.coming_soon for insert with check (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));
create policy "Enable update for admins only" on public.coming_soon for update using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));
create policy "Enable delete for admins only" on public.coming_soon for delete using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));


-- 3. RESET ANNOUNCEMENTS POLICIES
alter table public.announcements enable row level security;
drop policy if exists "Allow public read access" on public.announcements;
drop policy if exists "Enable insert for admins" on public.announcements;
drop policy if exists "Enable update for admins" on public.announcements;
drop policy if exists "Enable delete for admins" on public.announcements;

create policy "Allow public read access" on public.announcements for select using (true);
create policy "Enable insert for admins" on public.announcements for insert with check (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));
create policy "Enable update for admins" on public.announcements for update using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));
create policy "Enable delete for admins" on public.announcements for delete using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));


-- 4. RESET PROMO CODES POLICIES (Assuming table name is 'promotions')
-- Ensure table exists first if not already
create table if not exists public.promotions (
  id uuid default gen_random_uuid() primary key,
  code text not null unique,
  discount_type text not null,
  discount_value numeric not null,
  min_order_value numeric,
  max_discount numeric,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  usage_limit integer,
  description text,
  created_at timestamp with time zone default now()
);

alter table public.promotions enable row level security;

-- Drop generic old policies
drop policy if exists "Allow read access" on public.promotions;
drop policy if exists "enable read access" on public.promotions;
drop policy if exists "Enable insert/update/delete for admins" on public.promotions;
drop policy if exists "Enable insert for admins" on public.promotions;
drop policy if exists "Enable update for admins" on public.promotions;
drop policy if exists "Enable delete for admins" on public.promotions;

-- Re-apply correct policies
-- Everyone (authenticated) needs to read promos to apply them? Or just public? 
-- Usually public/authenticated read to validate codes.
create policy "Enable public read access" 
on public.promotions for select 
using (true);

create policy "Enable insert for admins" 
on public.promotions for insert 
with check (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));

create policy "Enable update for admins" 
on public.promotions for update 
using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));

create policy "Enable delete for admins" 
on public.promotions for delete 
using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));
