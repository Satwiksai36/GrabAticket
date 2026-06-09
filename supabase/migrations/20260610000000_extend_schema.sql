-- ============================================================
-- Migration: Extend GrabAticket Fresh Schema
-- Created At: 2026-06-10
-- Adds: events, venues, promo_codes, spotlights tables
-- ============================================================

-- ─── VENUES ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.venues (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'Telangana',
    type TEXT NOT NULL DEFAULT 'multiplex'
        CHECK (type IN ('multiplex','stadium','amphitheatre','convention_centre','auditorium','open_air','club','arena')),
    capacity INTEGER,
    facilities TEXT[],
    image_url TEXT,
    map_url TEXT,
    contact TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ─── EVENTS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.events (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    banner_url TEXT,
    video_url TEXT,
    category TEXT NOT NULL DEFAULT 'other'
        CHECK (category IN ('concert','sports','play','comedy','festival','exhibition','workshop','other')),
    venue_id UUID REFERENCES public.venues(id) ON DELETE SET NULL,
    venue_name TEXT NOT NULL,
    city TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    price_min NUMERIC(10,2) NOT NULL DEFAULT 0,
    price_max NUMERIC(10,2),
    is_free BOOLEAN NOT NULL DEFAULT false,
    available_tickets INTEGER NOT NULL DEFAULT 0,
    total_tickets INTEGER NOT NULL DEFAULT 0,
    organizer TEXT,
    language TEXT,
    age_restriction TEXT DEFAULT 'All Ages',
    tags TEXT[],
    status TEXT NOT NULL DEFAULT 'active'
        CHECK (status IN ('active','cancelled','postponed','sold_out','completed')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ─── PROMO CODES ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.promo_codes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    discount_type TEXT NOT NULL DEFAULT 'percentage'
        CHECK (discount_type IN ('percentage','fixed')),
    discount_value NUMERIC(10,2) NOT NULL,
    min_order_amount NUMERIC(10,2) DEFAULT 0,
    max_discount NUMERIC(10,2),
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    usage_limit INTEGER,
    times_used INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    applicable_to TEXT NOT NULL DEFAULT 'all'
        CHECK (applicable_to IN ('all','movies','events','food','sports','plays')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ─── SPOTLIGHTS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.spotlights (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    image_url TEXT NOT NULL,
    cta_label TEXT DEFAULT 'Book Now',
    link TEXT,
    category TEXT DEFAULT 'other'
        CHECK (category IN ('movie','event','sports','play','concert','discount','other')),
    active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ─── ANNOUNCEMENTS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    icon_type TEXT DEFAULT 'info',
    color_from TEXT DEFAULT '#7C3AED',
    color_to TEXT DEFAULT '#4F46E5',
    link TEXT,
    link_label TEXT,
    priority INTEGER DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ─── INDEXES ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_events_city     ON public.events(city);
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category);
CREATE INDEX IF NOT EXISTS idx_events_date     ON public.events(date);
CREATE INDEX IF NOT EXISTS idx_venues_city     ON public.venues(city);
CREATE INDEX IF NOT EXISTS idx_promo_active    ON public.promo_codes(is_active, valid_until);
CREATE INDEX IF NOT EXISTS idx_spotlights_prio ON public.spotlights(priority, active);

-- ─── TRIGGERS ─────────────────────────────────────────────────
CREATE TRIGGER trigger_update_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_update_spotlights_updated_at
    BEFORE UPDATE ON public.spotlights
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ─── RLS ──────────────────────────────────────────────────────
ALTER TABLE public.venues        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spotlights    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read venues"        ON public.venues        FOR SELECT USING (true);
CREATE POLICY "Public read events"        ON public.events        FOR SELECT USING (true);
CREATE POLICY "Public read spotlights"    ON public.spotlights    FOR SELECT USING (active = true);
CREATE POLICY "Public read announcements" ON public.announcements FOR SELECT USING (is_active = true);
CREATE POLICY "Public read promo_codes"   ON public.promo_codes   FOR SELECT USING (is_active = true AND valid_until > now());
