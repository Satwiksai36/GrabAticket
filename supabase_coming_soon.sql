-- Create coming_soon table
create table if not exists public.coming_soon (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text not null check (category in ('Movies', 'Events', 'Plays', 'Sports')),
  image_url text not null,
  release_date text, -- Text for flexibility e.g. "Summer 2024" or date string
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table public.coming_soon enable row level security;

-- Drop existing policies to avoid conflicts
drop policy if exists "Enable read access for all users" on public.coming_soon;
drop policy if exists "Enable insert for admins only" on public.coming_soon;
drop policy if exists "Enable update for admins only" on public.coming_soon;
drop policy if exists "Enable delete for admins only" on public.coming_soon;

-- Re-create policies with correct public.user_roles reference

create policy "Enable read access for all users"
on public.coming_soon for select
using (true);

create policy "Enable insert for admins only"
on public.coming_soon for insert
with check (
  exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  )
);

create policy "Enable update for admins only"
on public.coming_soon for update
using (
  exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  )
);

create policy "Enable delete for admins only"
on public.coming_soon for delete
using (
  exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  )
);
