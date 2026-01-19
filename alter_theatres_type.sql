-- Add 'type' column to theatres table to support different venue types
ALTER TABLE public.theatres ADD COLUMN IF NOT EXISTS type text DEFAULT 'cinema';

-- Ensure existing records are marked as 'cinema'
UPDATE public.theatres SET type = 'cinema' WHERE type IS NULL;

-- Optionally add a check constraint if we want to restrict types
-- VALUES provided: 'cinema', 'event_venue', 'sports_venue', 'play_venue', 'auditorium'
-- For flexibility we can skip strict constraint or add it:
-- ALTER TABLE public.theatres ADD CONSTRAINT theatres_type_check 
-- CHECK (type IN ('cinema', 'event_venue', 'sports_venue', 'play_venue', 'auditorium'));
