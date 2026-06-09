-- High-quality transactional seed data for fresh GrabAticket schema

DO $$
DECLARE
    -- Layout IDs
    layout_imax_id UUID := gen_random_uuid();
    layout_vip_id UUID := gen_random_uuid();
    layout_standard_id UUID := gen_random_uuid();

    -- Movie IDs
    movie_1_id UUID := gen_random_uuid();
    movie_2_id UUID := gen_random_uuid();
    movie_3_id UUID := gen_random_uuid();

    -- Theatre IDs
    theatre_1_id UUID := gen_random_uuid();
    theatre_2_id UUID := gen_random_uuid();

    -- Show IDs
    show_1_id UUID := gen_random_uuid();
    show_2_id UUID := gen_random_uuid();
    show_3_id UUID := gen_random_uuid();

    -- Food Item IDs
    food_popcorn_id UUID := gen_random_uuid();
    food_nachos_id UUID := gen_random_uuid();
    food_coke_id UUID := gen_random_uuid();
    food_combo_id UUID := gen_random_uuid();

    -- User Profile / Booking IDs
    user_alice_id UUID := gen_random_uuid();
    user_bob_id UUID := gen_random_uuid();
    booking_1_id UUID := gen_random_uuid();
    booking_2_id UUID := gen_random_uuid();

BEGIN
    -- 1. SEAT LAYOUTS
    INSERT INTO public.seat_layouts (id, name, type, total_seats, rows, columns, layout_config) VALUES
    (layout_imax_id, 'IMAX Signature Screen', 'theatre', 150, 10, 15, '[
        {"row": "P", "seats": [{"id": "P1", "type": "recliner", "price_multiplier": 1.5}, {"id": "P2", "type": "recliner", "price_multiplier": 1.5}]},
        {"row": "A", "seats": [{"id": "A1"}, {"id": "A2"}, {"id": "A3"}, {"id": "A4"}, {"id": "A5"}]},
        {"row": "B", "seats": [{"id": "B1"}, {"id": "B2"}, {"id": "B3"}, {"id": "B4"}, {"id": "B5"}]}
    ]'::jsonb),
    (layout_vip_id, 'Gold VIP Suite', 'theatre', 40, 5, 8, '[
        {"row": "G", "seats": [{"id": "G1", "type": "recliner", "price_multiplier": 2.0}, {"id": "G2", "type": "recliner", "price_multiplier": 2.0}]}
    ]'::jsonb),
    (layout_standard_id, 'Standard Cinema Layout', 'theatre', 100, 8, 12, '[
        {"row": "A", "seats": [{"id": "A1"}, {"id": "A2"}, {"id": "A3"}, {"id": "A4"}]},
        {"row": "B", "seats": [{"id": "B1"}, {"id": "B2"}, {"id": "B3"}, {"id": "B4"}]}
    ]'::jsonb);

    -- 2. MOVIES
    INSERT INTO public.movies (id, title, description, poster_url, banner_url, trailer_url, duration_minutes, language, genre, rating, status, release_date) VALUES
    (movie_1_id, 
     'Pushpa 2: The Rule', 
     'The clash continues as Pushpa Raj commands the red sandalwood empire against powerful forces.', 
     'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=800&auto=format&fit=crop', 
     'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop', 
     'https://www.youtube.com/watch?v=dummy_pushpa2', 
     175, 'Telugu, Hindi, Tamil', 'Action, Thriller, Drama', 'UA', 'now_showing', '2025-12-05'),
    (movie_2_id, 
     'SSMB29: Forest of Gold', 
     'An epic globe-trotting jungle adventure directed by SS Rajamouli starring Mahesh Babu.', 
     'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop', 
     'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1200&auto=format&fit=crop', 
     'https://www.youtube.com/watch?v=dummy_ssmb29', 
     185, 'Telugu, English, Hindi', 'Adventure, Action', 'UA', 'now_showing', '2026-04-10'),
    (movie_3_id, 
     'They Call Him OG', 
     'A stylish action film featuring Pawan Kalyan in an intense gangster avatar return to Mumbai.', 
     'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800&auto=format&fit=crop', 
     'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop', 
     'https://www.youtube.com/watch?v=dummy_og', 
     160, 'Telugu', 'Action, Crime', 'A', 'coming_soon', '2026-08-15');

    -- 3. THEATRES
    INSERT INTO public.theatres (id, name, address, phone, facilities, city, seat_layout_id) VALUES
    (theatre_1_id, 'AMB Cinemas: Gachibowli', 'Sarath City Capital Mall, Hyderabad', '+91 98765 43210', ARRAY['IMAX Laser', '4K Projection', 'Dolby Atmos', 'Valet Parking'], 'Hyderabad', layout_imax_id),
    (theatre_2_id, 'PVR Inox: Jagadamba Mall', 'Jagadamba Junction, Visakhapatnam', '+91 87654 32109', ARRAY['Recliner Seats', 'Dolby 7.1', 'Food Court'], 'Visakhapatnam', layout_vip_id);

    -- 4. SHOWS
    INSERT INTO public.shows (id, movie_id, theatre_id, show_time, price, format, available_seats, total_seats, status, seat_layout_id) VALUES
    (show_1_id, movie_1_id, theatre_1_id, NOW() + INTERVAL '1 day 14:00', 350.00, 'IMAX', 150, 150, 'available', layout_imax_id),
    (show_2_id, movie_1_id, theatre_1_id, NOW() + INTERVAL '1 day 18:30', 400.00, 'IMAX', 22, 150, 'filling_fast', layout_imax_id),
    (show_3_id, movie_2_id, theatre_2_id, NOW() + INTERVAL '2 days 10:15', 500.00, '3D', 40, 40, 'available', layout_vip_id);

    -- 5. FOOD ITEMS
    INSERT INTO public.food_items (id, name, description, category, price, type, image_url, is_available, preparation_time_mins) VALUES
    (food_popcorn_id, 'Classic Butter Popcorn (Large)', 'Freshly popped jumbo kernels glazed with warm butter.', 'Popcorn', 280.00, 'Veg', 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&q=80&w=800', true, 5),
    (food_nachos_id, 'Spicy Cheese Nachos', 'Crispy corn tortilla chips with warm jalapeño cheese dip.', 'Snacks', 250.00, 'Veg', 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&q=80&w=800', true, 8),
    (food_coke_id, 'Diet Coke (Large)', '500ml chilled sugar-free cola.', 'Beverages', 150.00, 'Veg', 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800', true, 2),
    (food_combo_id, 'Mega Movie Feast Combo', '1 Large Popcorn + 1 Spicy Nachos + 2 Soft Drinks.', 'Combos', 690.00, 'Veg', 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&q=80&w=800', true, 10);

    -- 6. PROFILES
    INSERT INTO public.profiles (id, user_id, full_name, phone, city, avatar_url) VALUES
    (gen_random_uuid(), user_alice_id, 'Alice Henderson', '+91 99000 11223', 'Hyderabad', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop'),
    (gen_random_uuid(), user_bob_id, 'Bob Marley', '+91 99000 44556', 'Visakhapatnam', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop');

    -- 7. BOOKINGS
    INSERT INTO public.bookings (id, user_id, booking_type, reference_id, title, venue, date, time, quantity, seats, amount, status, qr_code, payment_method) VALUES
    (booking_1_id, user_alice_id, 'movie', show_2_id, 'Pushpa 2: The Rule', 'AMB Cinemas: Gachibowli', CURRENT_DATE + 1, '18:30', 2, ARRAY['A1', 'A2'], 800.00, 'confirmed', 'QR_ALICE_BOOKING_1', 'Credit Card'),
    (booking_2_id, user_bob_id, 'food_only', NULL, 'Food Pre-Order Only', 'PVR Inox: Jagadamba Mall', CURRENT_DATE, '10:15', 3, NULL, 680.00, 'confirmed', 'QR_BOB_BOOKING_2', 'UPI');

    -- 8. BOOKING FOOD ITEMS (Link food to bookings)
    INSERT INTO public.booking_food_items (booking_id, food_item_id, quantity, price_at_booking, status) VALUES
    (booking_1_id, food_popcorn_id, 1, 280.00, 'Pending'),
    (booking_1_id, food_coke_id, 2, 150.00, 'Pending'),
    (booking_2_id, food_combo_id, 1, 690.00, 'Delivered');

END $$;
