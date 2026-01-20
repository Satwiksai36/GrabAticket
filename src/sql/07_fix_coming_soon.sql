-- Create coming_soon table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.coming_soon (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT NOT NULL,
    release_date TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.coming_soon ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to avoid conflicts
DROP POLICY IF EXISTS "Public can view coming soon" ON public.coming_soon;
DROP POLICY IF EXISTS "Admins can manage coming soon" ON public.coming_soon;

-- Create policies
CREATE POLICY "Public can view coming soon"
    ON public.coming_soon
    FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage coming soon"
    ON public.coming_soon
    USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- Grant permissions to authenticated users (essential for RLS to work properly for logged-in admins)
GRANT ALL ON public.coming_soon TO authenticated;
GRANT SELECT ON public.coming_soon TO anon;
