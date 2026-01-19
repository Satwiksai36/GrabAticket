-- Add trailer_url column to spotlights table
ALTER TABLE public.spotlights ADD COLUMN IF NOT EXISTS trailer_url TEXT;

-- Add trailer_url column to movies table
ALTER TABLE public.movies ADD COLUMN IF NOT EXISTS trailer_url TEXT;

-- Force schema cache reload
NOTIFY pgrst, 'reload schema';
