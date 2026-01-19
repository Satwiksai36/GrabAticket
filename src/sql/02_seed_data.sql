-- Seed Data for District Hub Tickets (GrabAticket)
-- Updated for AP Cities & New Telugu Blockbusters (2025-2026 Era)
-- Robust handling for existing data

DO $$
DECLARE
    -- City IDs (AP)
    vizag_id uuid;
    vijayawada_id uuid;
    guntur_id uuid;
    tirupati_id uuid;
    kurnool_id uuid;
    rajahmundry_id uuid;
    kakinada_id uuid;
    nellore_id uuid;
    
    -- City IDs (Metros)
    hyderabad_id uuid;
    bengaluru_id uuid;
    chennai_id uuid;
    mumbai_id uuid;
    
    -- Movie IDs
    movie_ssmb29_id uuid := gen_random_uuid();
    movie_gamechanger_id uuid := gen_random_uuid();
    movie_vishwambhara_id uuid := gen_random_uuid();
    movie_spirit_id uuid := gen_random_uuid();
    movie_kalki2_id uuid := gen_random_uuid();
    movie_devara_id uuid := gen_random_uuid();
    
    -- Theatre IDs
    theatre_inox_vizag_id uuid := gen_random_uuid();
    theatre_pvr_vijayawada_id uuid := gen_random_uuid();
    theatre_amb_hyd_id uuid := gen_random_uuid();
    
    -- Seat Layout IDs
    layout_large_id uuid := gen_random_uuid();
    
BEGIN

    -- 1. Upsert Cities and get IDs (Safe against duplicates)
    
    -- Visakhapatnam
    SELECT id INTO vizag_id FROM districts WHERE name = 'Visakhapatnam';
    IF vizag_id IS NULL THEN
        vizag_id := gen_random_uuid();
        INSERT INTO districts (id, name, state) VALUES (vizag_id, 'Visakhapatnam', 'Andhra Pradesh');
    END IF;

    -- Vijayawada
    SELECT id INTO vijayawada_id FROM districts WHERE name = 'Vijayawada';
    IF vijayawada_id IS NULL THEN
        vijayawada_id := gen_random_uuid();
        INSERT INTO districts (id, name, state) VALUES (vijayawada_id, 'Vijayawada', 'Andhra Pradesh');
    END IF;

    -- Hyderabad
    SELECT id INTO hyderabad_id FROM districts WHERE name = 'Hyderabad';
    IF hyderabad_id IS NULL THEN
        hyderabad_id := gen_random_uuid();
        INSERT INTO districts (id, name, state) VALUES (hyderabad_id, 'Hyderabad', 'Telangana');
    END IF;

    -- Other Cities (No relations needed in this seed, so standard insert with ignore conflict)
    INSERT INTO districts (id, name, state) VALUES 
        (gen_random_uuid(), 'Guntur', 'Andhra Pradesh'),
        (gen_random_uuid(), 'Tirupati', 'Andhra Pradesh'),
        (gen_random_uuid(), 'Kurnool', 'Andhra Pradesh'),
        (gen_random_uuid(), 'Rajahmundry', 'Andhra Pradesh'),
        (gen_random_uuid(), 'Kakinada', 'Andhra Pradesh'),
        (gen_random_uuid(), 'Nellore', 'Andhra Pradesh'),
        (gen_random_uuid(), 'Bengaluru', 'Karnataka'),
        (gen_random_uuid(), 'Chennai', 'Tamil Nadu'),
        (gen_random_uuid(), 'Mumbai', 'Maharashtra')
    ON CONFLICT (name) DO NOTHING;


    -- 2. Insert Movies (New Telugu Blockbusters 2026) - With updated image URLs
    INSERT INTO movies (id, title, description, poster_url, banner_url, trailer_url, duration_minutes, genre, language, rating, status, release_date) VALUES
    
    (movie_ssmb29_id, 
    'SSMB29: Jungle Adventure', 
    'Superstar Mahesh Babu and SS Rajamouli join forces for a global action-adventure set in the dense jungles of Africa.', 
    'https://static.toiimg.com/thumb/msid-112345678,width-1000,height-1500,resizemode-75/112345678.jpg', 
    'https://images.hindustantimes.com/img/2024/01/01/1600x900/SSMB29_123456789.jpg', 
    'https://www.youtube.com/watch?v=dummy_ssmb', 
    170, 
    'Action, Adventure', 
    'Telugu, Hindi, English', 
    'UA', 
    'now_showing', 
    '2026-01-12'),

    (movie_gamechanger_id, 
    'Game Changer', 
    'Ram Charan stars as an IAS officer who fights against the corrupt political system to bring about a massive change.', 
    'https://upload.wikimedia.org/wikipedia/en/2/23/Game_Changer_film_poster.jpg', 
    'https://static.toiimg.com/thumb/msid-106465384,width-1280,height-720,resizemode-4/106465384.jpg', 
    'https://www.youtube.com/watch?v=dummy_gc', 
    165, 
    'Political, Action', 
    'Telugu, Tamil', 
    'UA', 
    'now_showing', 
    '2026-01-09'),

    (movie_vishwambhara_id, 
    'Vishwambhara', 
    'Megastar Chiranjeevi takes on a celestial role in this socio-fantasy epic that spans the three worlds.', 
    'https://static.toiimg.com/thumb/msid-106883526,width-1000,height-1500,resizemode-75/106883526.jpg', 
    'https://static.toiimg.com/thumb/msid-106883526,width-1280,height-720,resizemode-4/106883526.jpg', 
    'https://www.youtube.com/watch?v=dummy_vishwa', 
    155, 
    'Fantasy, Action', 
    'Telugu', 
    'U', 
    'now_showing', 
    '2026-01-14'),

    (movie_spirit_id, 
    'Spirit', 
    'A sincere police officer goes to extreme lengths to protect the law. Prabhas in a never-before-seen intense cop avatar.', 
    'https://upload.wikimedia.org/wikipedia/en/thumb/8/87/Spirit_2023_film_poster.jpg/220px-Spirit_2023_film_poster.jpg', 
    'https://images.indianexpress.com/2021/10/Prabhas-25-Spirit-1200.jpg', 
    'https://www.youtube.com/watch?v=dummy_spirit', 
    160, 
    'Action, Crime', 
    'Telugu, Hindi', 
    'A', 
    'now_showing', 
    '2025-12-25'),

    (movie_kalki2_id, 
    'Kalki 2898 AD: Part 2', 
    'The saga continues as the forces of Kali yuga clash with the rising avatar. The final battle for the future begins.', 
    'https://upload.wikimedia.org/wikipedia/en/4/4c/Kalki_2898_AD.jpg', 
    'https://images.hindustantimes.com/img/2024/01/12/1600x900/Kalki_2898_AD_1705030230283_1705030245084.jpg', 
    'https://www.youtube.com/watch?v=dummy_kalki', 
    180, 
    'Sci-Fi, Mythological', 
    'Telugu, Hindi', 
    'UA', 
    'coming_soon', 
    '2026-05-09'),
    
    (movie_devara_id, 
    'Devara: Part 1', 
    'An epic action saga set against the coastal lands, featuring high-octane sequences and intense emotions.', 
    'https://upload.wikimedia.org/wikipedia/en/9/91/Devara_Part_1.jpg', 
    'https://static.toiimg.com/thumb/msid-106677937,width-1280,height-720,resizemode-4/106677937.jpg',
    'https://www.youtube.com/watch?v=dummy_devara',
    175,
    'Action, Drama',
    'Telugu',
    'A',
    'now_showing',
    '2025-12-20');

    -- 3. Insert Seat Layouts (Premium)
    INSERT INTO seat_layouts (id, name, type, total_seats, rows, columns, layout_config) VALUES
    (layout_large_id, 'IMAX Premium', 'theatre', 150, 10, 15, '[
        {"row": "K", "seats": [{"id": "K1", "status": "available", "type": "recliner", "price_multiplier": 1.5}, {"id": "K2", "status": "available", "type": "recliner", "price_multiplier": 1.5}]}, 
        {"row": "A", "seats": [{"id": "A1", "status": "available"}, {"id": "A2", "status": "available"}, {"id": "A3", "status": "available"}]}
    ]'); 

    -- 4. Insert Theatres (Focused on AP & Hyd)
    INSERT INTO theatres (id, name, district_id, address, facilities, seat_layout_id) VALUES
    (theatre_inox_vizag_id, 'INOX: Varun Beach', vizag_id, 'Beach Road, Visakhapatnam', ARRAY['Dolby Atmos', 'Insignia', 'Beach View'], layout_large_id),
    (theatre_pvr_vijayawada_id, 'PVR: Ripples Mall', vijayawada_id, 'MG Road, Vijayawada', ARRAY['4K Projection', 'Dolby 7.1'], layout_large_id),
    (theatre_amb_hyd_id, 'AMB Cinemas', hyderabad_id, 'Gachibowli, Hyderabad', ARRAY['Laser', 'Ambient Lighting', 'VIP Lounge'], layout_large_id);

    -- 5. Insert Shows
    INSERT INTO shows (movie_id, theatre_id, show_time, price, total_seats, available_seats, seat_layout_id) VALUES
    (movie_ssmb29_id, theatre_amb_hyd_id, NOW() + INTERVAL '1 day 10:00', 450, 150, 142, layout_large_id),
    (movie_ssmb29_id, theatre_amb_hyd_id, NOW() + INTERVAL '1 day 14:00', 450, 150, 10, layout_large_id),
    (movie_gamechanger_id, theatre_inox_vizag_id, NOW() + INTERVAL '1 day 11:30', 300, 150, 100, layout_large_id),
    (movie_vishwambhara_id, theatre_pvr_vijayawada_id, NOW() + INTERVAL '1 day 18:00', 250, 150, 80, layout_large_id),
    (movie_spirit_id, theatre_amb_hyd_id, NOW() + INTERVAL '1 day 21:00', 400, 150, 120, layout_large_id);

    -- 6. Insert Events (Music, Sports, Plays)
    INSERT INTO events (title, description, date, venue, category, price, district_id, image_url, available_tickets, total_tickets) VALUES
    ('Sunburn Vizag', 'Asia''s biggest electronic dance music festival comes to the beach city.', NOW() + INTERVAL '30 days', 'RK Beach, Vizag', 'Music', 2000, vizag_id, 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:ote-U3VuLCAyOSBEZWMgb253YXJkcw%3D%3D,ots-29,otc-FFFFFF,oy-612,ox-24:q-80/et00378037-lsrccygpmy-portrait.jpg', 5000, 5000),
    ('Vintage Car Rally', 'A display of classic vintage cars.', NOW() + INTERVAL '15 days', 'PVP Square, Vijayawada', 'Exhibition', 500, vijayawada_id, 'https://img.freepik.com/free-photo/shiny-vintage-car-waiting-ride_23-2149454848.jpg', 1000, 1000),
    -- Sports
    ('IPL 2026: SRH vs CSK', 'The Southern Derby! Sunrisers Hyderabad take on Chennai Super Kings.', NOW() + INTERVAL '45 days 19:30', 'Rajiv Gandhi Stadium, Uppal', 'Sports', 1500, hyderabad_id, 'https://resources.platform.iplt20.com/photo-resources/2023/04/08/9d8b7b7f-7f7f-4b7f-9b7f-7f7f7f7f7f7f/match-12-mi-vs-csk.jpg', 30000, 30000),
    ('ISL Final: Hyderabad FC vs Mumbai City', 'Witness the grand finale of the Indian Super League.', NOW() + INTERVAL '25 days 19:00', 'Gachibowli Stadium', 'Sports', 800, hyderabad_id, 'https://img.etimg.com/thumb/width-1200,height-900,imgsize-123456,resizemode-1,msid-89686333/news/sports/isl-final-to-be-played-in-goa-on-march-20.jpg', 15000, 15000),
    -- Plays
    ('Mayabazar - The Play', 'A theatrical adaptation of the legendary Telugu classic folklore.', NOW() + INTERVAL '12 days 18:00', 'Kalabharathi Auditorium, Vizag', 'Arts', 500, vizag_id, 'https://alchetron.com/cdn/Mayabazar-images-4a3d0272-3598-44e2-8086-53890250785-resize-750.jpeg', 800, 800),
    ('Pourana: The Myth', 'An intense drama exploring ancient myths in modern times.', NOW() + INTERVAL '8 days 19:00', 'Ravindra Bharathi, Hyderabad', 'Arts', 300, hyderabad_id, 'https://upload.wikimedia.org/wikipedia/en/thumb/2/22/Pournami_poster.jpg/220px-Pournami_poster.jpg', 1000, 1000);

    -- 7. Insert Food Items (With type column)
    INSERT INTO food_items (id, name, description, category, price, is_available, image_url, type) VALUES
    (gen_random_uuid(), 'Chicken Popcorn', 'Spicy bite-sized chicken.', 'Snacks', 280, true, 'https://www.kfc.com.au/static/images/menu/chicken-popcorn.jpg', 'Non-Veg'),
    (gen_random_uuid(), 'Masala Corn', 'Steamed corn with spicy masala.', 'Snacks', 120, true, 'https://www.vegrecipesofindia.com/wp-content/uploads/2018/06/masala-corn-recipe-1.jpg', 'Veg');

    -- 8. Insert Promo Codes
    INSERT INTO promotions (code, discount_type, discount_value, description, start_date, end_date) VALUES
    ('PONGAL26', 'percentage', 25, 'Sankranti Special: 25% off on Telugu movies', NOW(), NOW() + INTERVAL '1 month'),
    ('VISA50', 'percentage', 50, 'Use Visa card to get 50% off', NOW(), NOW() + INTERVAL '1 year')
    ON CONFLICT (code) DO NOTHING;

    -- 9. Insert Coming Soon
    INSERT INTO coming_soon (title, category, image_url, release_date) VALUES
    ('Jai Hanuman', 'Movies', 'https://static.toiimg.com/thumb/msid-107056636,width-1280,height-720,resizemode-4/107056636.jpg', '2026-04-14');

    -- 10. Insert Announcements
    INSERT INTO announcements (title, content, icon_type, color_from, color_to, priority, is_active) VALUES
    ('Sankranti Blockbusters', 'Book tickets for SSMB29 and Game Changer now! Fast filling.', 'film', '#f6d365', '#fda085', 1, true);

    -- 11. Insert Spotlights (Featured Content)
    
    -- 11. Insert Spotlights (Featured Content)
    
    -- Ensure table exists (Self-healing)
    CREATE TABLE IF NOT EXISTS spotlights (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        is_active BOOLEAN DEFAULT true,
        priority INTEGER DEFAULT 0,
        button_text TEXT DEFAULT 'Book Now',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Safely add columns if they don't exist (e.g. if table existed but was old schema)
    BEGIN
        ALTER TABLE spotlights ADD COLUMN IF NOT EXISTS movie_id UUID REFERENCES movies(id);
    EXCEPTION WHEN duplicate_column THEN NULL;
    END;

    BEGIN
        ALTER TABLE spotlights ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES events(id);
    EXCEPTION WHEN duplicate_column THEN NULL;
    END;

    BEGIN
        ALTER TABLE spotlights ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
    EXCEPTION WHEN duplicate_column THEN NULL;
    END;

    BEGIN
        ALTER TABLE spotlights ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 0;
    EXCEPTION WHEN duplicate_column THEN NULL;
    END;

    BEGIN
        ALTER TABLE spotlights ADD COLUMN IF NOT EXISTS image_url TEXT;
    EXCEPTION WHEN duplicate_column THEN NULL;
    END;

    BEGIN
        ALTER TABLE spotlights ADD COLUMN IF NOT EXISTS description TEXT;
    EXCEPTION WHEN duplicate_column THEN NULL;
    END;

    INSERT INTO spotlights (id, title, description, image_url, movie_id, event_id, is_active, priority) VALUES 
    (gen_random_uuid(), 'SSMB29 - Global Release', 'Book tickets now for the biggest adventure of the decade!', 'https://images.hindustantimes.com/img/2024/01/01/1600x900/SSMB29_123456789.jpg', movie_ssmb29_id, NULL, true, 1),
    (gen_random_uuid(), 'IPL 2026 Tickets Live', 'Catch your favorite teams in action. SRH vs CSK tickets available!', 'https://resources.platform.iplt20.com/photo-resources/2023/04/08/9d8b7b7f-7f7f-4b7f-9b7f-7f7f7f7f7f7f/match-12-mi-vs-csk.jpg', NULL, NULL, true, 2)
    ON CONFLICT DO NOTHING;

END $$;