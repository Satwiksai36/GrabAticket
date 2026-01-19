-- FIX SPOTLIGHT SCHEMA
-- Allow 'coming_soon' as a category in spotlights table

DO $$
BEGIN
    -- Try to drop the constraint if it exists (common naming convention)
    ALTER TABLE public.spotlights DROP CONSTRAINT IF EXISTS spotlights_category_check;
    
    -- If there's another constraint name you suspect, add it here.
    -- For now, we just ensure no restrictive check prevents 'coming_soon'
    
    -- Optionally, re-add with new allowed values if strictness is desired
    -- ALTER TABLE public.spotlights ADD CONSTRAINT spotlights_category_check 
    -- CHECK (category IN ('movie', 'event', 'sport', 'play', 'discount', 'other', 'coming_soon'));
    
EXCEPTION
    WHEN undefined_table THEN
        RAISE NOTICE 'Table spotlights does not exist yet.';
    WHEN OTHERS THEN
        RAISE NOTICE 'Error dropping constraint: %', SQLERRM;
END $$;
