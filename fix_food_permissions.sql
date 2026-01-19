-- MASTER PERMISSION FIX FOR FOOD ITEMS

-- 1. Ensure Table Exists (Should already exist, but for safety)
create table if not exists public.food_items (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  category text not null,
  price numeric not null,
  type text check (type in ('Veg', 'Non-Veg', 'Beverage')),
  image_url text,
  is_available boolean default true,
  preparation_time_mins integer,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. Enable RLS
alter table public.food_items enable row level security;

-- 3. Cleanup Old Policies
drop policy if exists "Enable read access for all users" on public.food_items;
drop policy if exists "Enable insert for admins" on public.food_items;
drop policy if exists "Enable update for admins" on public.food_items;
drop policy if exists "Enable delete for admins" on public.food_items;
drop policy if exists "Allow public read access" on public.food_items;

-- 4. Create Correct Policies

-- Everyone can view food items (Menu)
create policy "Allow public read access"
on public.food_items for select
using (true);

-- Only Admins can ADD items
create policy "Enable insert for admins"
on public.food_items for insert
to authenticated
with check (
  exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  )
);

-- Only Admins can UPDATE items
create policy "Enable update for admins"
on public.food_items for update
to authenticated
using (
  exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  )
);

-- Only Admins can DELETE items
create policy "Enable delete for admins"
on public.food_items for delete
to authenticated
using (
  exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  )
);
