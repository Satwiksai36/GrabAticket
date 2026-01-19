-- FIX SEAT LAYOUT AND SHOWS PERMISSIONS

-- 1. SEAT LAYOUTS
create table if not exists public.seat_layouts (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  type text not null, -- 'bus', 'theatre'
  rows integer not null,
  columns integer not null,
  total_seats integer not null,
  layout_config jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.seat_layouts enable row level security;

-- Drop old policies
drop policy if exists "Enable read access for all users" on public.seat_layouts;
drop policy if exists "Enable insert for admins" on public.seat_layouts;
drop policy if exists "Enable update for admins" on public.seat_layouts;
drop policy if exists "Enable delete for admins" on public.seat_layouts;

-- New Policies (using existing is_admin function if available, else direct check)
create policy "Enable read access for all users"
on public.seat_layouts for select
using (true);

create policy "Enable insert for admins"
on public.seat_layouts for insert
to authenticated
with check (
  exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin')
);

create policy "Enable update for admins"
on public.seat_layouts for update
to authenticated
using (
  exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin')
);

create policy "Enable delete for admins"
on public.seat_layouts for delete
to authenticated
using (
  exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin')
);


-- 2. SHOWS (Movie Shows) permissions
-- Since I added the "Add Show" dialog, we must ensure 'shows' table is writable by admins.

create table if not exists public.shows (
  id uuid default gen_random_uuid() primary key,
  movie_id uuid references public.movies(id) not null,
  theatre_id uuid references public.theatres(id) not null,
  show_time timestamp with time zone not null,
  price numeric not null,
  format text, -- 2D, 3D, IMAX
  available_seats integer,
  total_seats integer,
  status text default 'Open',
  seat_layout_id uuid references public.seat_layouts(id),
  created_at timestamp with time zone default now()
);

alter table public.shows enable row level security;

drop policy if exists "Enable read access for all users" on public.shows;
drop policy if exists "Enable insert for admins" on public.shows;
drop policy if exists "Enable update for admins" on public.shows;
drop policy if exists "Enable delete for admins" on public.shows;

create policy "Enable read access for all users"
on public.shows for select
using (true);

create policy "Enable insert for admins"
on public.shows for insert
to authenticated
with check (
  exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin')
);

create policy "Enable update for admins"
on public.shows for update
to authenticated
using (
  exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin')
);

create policy "Enable delete for admins"
on public.shows for delete
to authenticated
using (
  exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin')
);
