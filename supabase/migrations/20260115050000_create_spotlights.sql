-- Create spotlights table
CREATE TABLE public.spotlights (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    link TEXT,
    category TEXT CHECK (category IN ('movie', 'event', 'sport', 'play', 'discount', 'other')),
    active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.spotlights ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can view active spotlights"
ON public.spotlights
FOR SELECT
USING (active = true);

CREATE POLICY "Admins can manage spotlights"
ON public.spotlights
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_spotlights_updated_at
BEFORE UPDATE ON public.spotlights
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
