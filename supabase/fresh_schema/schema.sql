-- Clean, Portable database schema for movie ticketing & food ordering application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SEAT LAYOUTS TABLE
CREATE TABLE IF NOT EXISTS public.seat_layouts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'theatre', -- e.g., 'theatre', 'bus'
    rows INTEGER NOT NULL,
    columns INTEGER NOT NULL,
    total_seats INTEGER NOT NULL,
    layout_config JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. MOVIES TABLE
CREATE TABLE IF NOT EXISTS public.movies (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    poster_url TEXT,
    banner_url TEXT,
    trailer_url TEXT,
    duration_minutes INTEGER,
    language TEXT,
    genre TEXT,
    rating TEXT,
    release_date DATE,
    status TEXT DEFAULT 'now_showing' CHECK (status IN ('now_showing', 'coming_soon', 'ended')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. THEATRES TABLE
CREATE TABLE IF NOT EXISTS public.theatres (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    facilities TEXT[],
    city TEXT NOT NULL, -- Decoupled plain text field for portability
    seat_layout_id UUID REFERENCES public.seat_layouts(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. SHOWS TABLE
CREATE TABLE IF NOT EXISTS public.shows (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    movie_id UUID NOT NULL REFERENCES public.movies(id) ON DELETE CASCADE,
    theatre_id UUID NOT NULL REFERENCES public.theatres(id) ON DELETE CASCADE,
    show_time TIMESTAMP WITH TIME ZONE NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    format TEXT DEFAULT '2D', -- '2D', '3D', 'IMAX', etc.
    available_seats INTEGER NOT NULL DEFAULT 100,
    total_seats INTEGER NOT NULL DEFAULT 100,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'filling_fast', 'sold_out')),
    seat_layout_id UUID REFERENCES public.seat_layouts(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. PROFILES TABLE (Decoupled from auth.users for database portability)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE, -- Links to auth provider UID without foreign key constraint
    full_name TEXT,
    phone TEXT,
    city TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. BOOKINGS TABLE (Decoupled from auth.users for database portability)
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL, -- Links to auth provider UID without foreign key constraint
    booking_type TEXT NOT NULL CHECK (booking_type IN ('movie', 'food_only', 'other')),
    reference_id UUID, -- e.g., References shows(id)
    title TEXT NOT NULL,
    venue TEXT NOT NULL,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    seats TEXT[] DEFAULT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    qr_code TEXT,
    payment_method TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. FOOD ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.food_items (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- e.g., 'Popcorn', 'Beverages', 'Combos'
    price NUMERIC(10, 2) NOT NULL,
    type TEXT DEFAULT 'Veg' CHECK (type IN ('Veg', 'Non-Veg', 'Egg', 'Vegan')),
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    preparation_time_mins INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 8. BOOKING FOOD ITEMS TABLE (Junction Table)
CREATE TABLE IF NOT EXISTS public.booking_food_items (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    food_item_id UUID NOT NULL REFERENCES public.food_items(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    price_at_booking NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Preparing', 'Ready', 'Delivered')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- INDEXES FOR PERFORMANCE OPTIMIZATION
CREATE INDEX IF NOT EXISTS idx_shows_movie ON public.shows(movie_id);
CREATE INDEX IF NOT EXISTS idx_shows_theatre ON public.shows(theatre_id);
CREATE INDEX IF NOT EXISTS idx_theatres_city ON public.theatres(city);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_bfi_booking ON public.booking_food_items(booking_id);

-- TRIGGER FOR UPDATED_AT AUTO-COLUMN UPDATE
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Attach updated_at triggers
CREATE TRIGGER trigger_update_seat_layouts_updated_at BEFORE UPDATE ON public.seat_layouts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trigger_update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trigger_update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trigger_update_food_items_updated_at BEFORE UPDATE ON public.food_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.seat_layouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theatres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_food_items ENABLE ROW LEVEL SECURITY;

-- DYNAMIC RLS ACCESS POLICIES
-- Content (Read-only policies for public)
CREATE POLICY "Allow public read access to movies" ON public.movies FOR SELECT USING (true);
CREATE POLICY "Allow public read access to theatres" ON public.theatres FOR SELECT USING (true);
CREATE POLICY "Allow public read access to shows" ON public.shows FOR SELECT USING (true);
CREATE POLICY "Allow public read access to seat_layouts" ON public.seat_layouts FOR SELECT USING (true);
CREATE POLICY "Allow public read access to food_items" ON public.food_items FOR SELECT USING (true);

-- Profiles
CREATE POLICY "Allow users to view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow users to insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Bookings
CREATE POLICY "Allow users to view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow users to insert own bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to update own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);

-- Booking Food Items
CREATE POLICY "Allow users to insert own booking food items" ON public.booking_food_items FOR INSERT WITH CHECK (
    auth.uid() = (SELECT user_id FROM public.bookings WHERE id = booking_id)
);
CREATE POLICY "Allow users to view own booking food items" ON public.booking_food_items FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM public.bookings WHERE id = booking_id)
);
