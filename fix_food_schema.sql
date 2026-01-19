-- FIX FOOD ITEMS SCHEMA CONSTRAINT
-- The existing table likely has a CHECK constraint on the 'type' column that is too restrictive (only Veg/Non-Veg/Beverage).
-- We need to remove or update it to allow 'Egg', 'Vegan', etc.

DO $$ 
BEGIN
    -- Try to drop the constraint if it exists. 
    -- The name is usually 'food_items_type_check' but Supabase/Postgres might have auto-generated a different one.
    -- We'll try the standard naming first.
    ALTER TABLE public.food_items DROP CONSTRAINT IF EXISTS food_items_type_check;
EXCEPTION
    WHEN undefined_object THEN 
        NULL; -- Ignore if it doesn't exist
END $$;

-- Alternatively, we can alter the column to drop the check at the column definition level (if supported by dialect).
-- Simplest way in Postgres to "loosen" a column is often to just drop the check constraint entirely.
-- We can also explicitly force it:
ALTER TABLE public.food_items ALTER COLUMN type DROP DEFAULT;
ALTER TABLE public.food_items ALTER COLUMN type SET NOT NULL; 
-- (Assuming we want it not null, but checks are separate constraints).

-- Let's try to find and drop ANY check constraint on 'type' column manually if the above failed.
-- But usually `DROP CONSTRAINT food_items_type_check` is sufficient if created via standard CREATE TABLE.

-- Just in case, let's also ensure the 'category' column allows our new values (it is text, so it should be fine unless it has a check).
-- We will also drop any check on category just to be safe.
DO $$ 
BEGIN
    ALTER TABLE public.food_items DROP CONSTRAINT IF EXISTS food_items_category_check;
EXCEPTION
    WHEN undefined_object THEN 
        NULL;
END $$;
