-- DANGER: This script will remove ALL data from the application tables.
-- It is intended to reset the database so new data can be added cleanly.

-- Disable triggers if necessary (optional, but good for mass delete)
-- SET session_replication_role = 'replica';

BEGIN;

-- Child tables first (delete to avoid FK constraints if not using cascade, or just use CASCADE)
TRUNCATE TABLE public.booking_food_items CASCADE;
TRUNCATE TABLE public.bookings CASCADE;
TRUNCATE TABLE public.shows CASCADE;

-- Content tables
TRUNCATE TABLE public.promotions CASCADE;
TRUNCATE TABLE public.spotlights CASCADE;
TRUNCATE TABLE public.announcements CASCADE;
TRUNCATE TABLE public.coming_soon CASCADE;
TRUNCATE TABLE public.food_items CASCADE;
TRUNCATE TABLE public.movies CASCADE;
TRUNCATE TABLE public.events CASCADE;

-- Infrastructure tables
-- Note: referencing tables might have been handled by CASCADE above, but explicit is good.
TRUNCATE TABLE public.seat_layouts CASCADE;
TRUNCATE TABLE public.theatres CASCADE; 

-- Note: We are NOT deleting 'districts' or 'profiles' or 'user_roles' as they are core configuration/user data.
-- If you want to delete them too, uncomment the lines below:
-- TRUNCATE TABLE public.districts CASCADE;
-- TRUNCATE TABLE public.profiles CASCADE;
-- TRUNCATE TABLE public.user_roles CASCADE;

COMMIT;

-- Re-enable triggers
-- SET session_replication_role = 'origin';
