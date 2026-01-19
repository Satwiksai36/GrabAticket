-- Comprehensive Seed Data for GrabAticket (Premium Edition)
-- Focused on High-Quality Visuals & Latest 2026 Content

DO $$
DECLARE
    -- City IDs
    vizag_id uuid;
    vijayawada_id uuid;
    tirupati_id uuid;
    guntur_id uuid;
    rajahmundry_id uuid;
    kakinada_id uuid;
    nellore_id uuid;
    hyderabad_id uuid;
    bengaluru_id uuid;
    chennai_id uuid;
    
    -- Movie IDs
    movie_ssmb29_id uuid := gen_random_uuid();
    movie_pushpa2_id uuid := gen_random_uuid();
    movie_pawan_og_id uuid := gen_random_uuid();
    movie_devara_id uuid := gen_random_uuid();
    movie_kalki2_id uuid := gen_random_uuid();
    movie_vishwambhara_id uuid := gen_random_uuid();
    movie_spirit_id uuid := gen_random_uuid();
    movie_rajasaab_id uuid := gen_random_uuid();
    movie_toxic_id uuid := gen_random_uuid();
    movie_kanguva_id uuid := gen_random_uuid();
    movie_swayambhu_id uuid := gen_random_uuid();
    
    -- Theatre IDs
    theatre_amb_id uuid := gen_random_uuid();
    theatre_pvr_vizag_id uuid := gen_random_uuid();
    theatre_inox_vja_id uuid := gen_random_uuid();
    theatre_pvr_guntur_id uuid := gen_random_uuid();
    
    -- Seat Layouts
    layout_imax_id uuid := gen_random_uuid();
    layout_gold_id uuid := gen_random_uuid();
    layout_standard_id uuid := gen_random_uuid();
    
    -- Event IDs
    event_ipl_final_id uuid := gen_random_uuid();
    event_ar_rahman_id uuid := gen_random_uuid();
    
BEGIN

    -- ==================================================================================
    -- 1. CITIES (Major AP Cities & Metros)
    -- ==================================================================================
    
    -- Function to safely insert city if not exists and get ID
    
    -- Hyderabad (Metrapolis)
    SELECT id INTO hyderabad_id FROM districts WHERE name = 'Hyderabad';
    IF hyderabad_id IS NULL THEN
        hyderabad_id := gen_random_uuid();
        INSERT INTO districts (id, name, state) VALUES (hyderabad_id, 'Hyderabad', 'Telangana');
    END IF;

    -- Visakhapatnam (City of Destiny)
    SELECT id INTO vizag_id FROM districts WHERE name = 'Visakhapatnam';
    IF vizag_id IS NULL THEN
        vizag_id := gen_random_uuid();
        INSERT INTO districts (id, name, state) VALUES (vizag_id, 'Visakhapatnam', 'Andhra Pradesh');
    END IF;

    -- Vijayawada (The Business Capital)
    SELECT id INTO vijayawada_id FROM districts WHERE name = 'Vijayawada';
    IF vijayawada_id IS NULL THEN
        vijayawada_id := gen_random_uuid();
        INSERT INTO districts (id, name, state) VALUES (vijayawada_id, 'Vijayawada', 'Andhra Pradesh');
    END IF;

    -- Tirupati (Spiritual Capital)
    SELECT id INTO tirupati_id FROM districts WHERE name = 'Tirupati';
    IF tirupati_id IS NULL THEN
        tirupati_id := gen_random_uuid();
        INSERT INTO districts (id, name, state) VALUES (tirupati_id, 'Tirupati', 'Andhra Pradesh');
    END IF;

    -- Other Important Hubs
    INSERT INTO districts (id, name, state) VALUES 
        (gen_random_uuid(), 'Guntur', 'Andhra Pradesh'),
        (gen_random_uuid(), 'Rajahmundry', 'Andhra Pradesh'),
        (gen_random_uuid(), 'Kakinada', 'Andhra Pradesh'),
        (gen_random_uuid(), 'Nellore', 'Andhra Pradesh'),
        (gen_random_uuid(), 'Kurnool', 'Andhra Pradesh'),
        (gen_random_uuid(), 'Bengaluru', 'Karnataka'),
        (gen_random_uuid(), 'Chennai', 'Tamil Nadu'),
        (gen_random_uuid(), 'Mumbai', 'Maharashtra')
    ON CONFLICT (name) DO NOTHING;
    
    -- Retrieve IDs for logic
    SELECT id INTO guntur_id FROM districts WHERE name = 'Guntur';


    -- ==================================================================================
    -- 2. MOVIES (Premium Selection - High Res Posters)
    -- ==================================================================================
    
    INSERT INTO movies (id, title, description, poster_url, banner_url, trailer_url, duration_minutes, genre, language, rating, status, release_date) VALUES
    
    -- SSMB29 (Mahesh Babu - Rajamouli)
    (movie_ssmb29_id, 
    'SSMB29: Forest of Gold', 
    'Superstar Mahesh Babu teams up with SS Rajamouli for an Indiana Jones-style globe-trotting action adventure set in the African forests.', 
    'https://m.media-amazon.com/images/M/MV5BMjA4Mjg2MTY5MF5BMl5BanBnXkFtZTgwMzk3NTU3MzI@._V1_FMjpg_UX1000_.jpg', -- High quality placeholder
    'https://images.hindustantimes.com/img/2024/01/01/1600x900/SSMB29_123456789.jpg', 
    'https://www.youtube.com/watch?v=dummy_ssmb', 
    185, 
    'Action, Adventure', 
    'Telugu, Hindi, English', 
    'UA', 
    'now_showing', 
    '2026-01-14'),

    -- Pushpa 2
    (movie_pushpa2_id, 
    'Pushpa 2: The Rule', 
    'Pushpa Raj''s reign continues. The syndicate grows, enemies multiply, and the stakes have never been higher.', 
    'https://m.media-amazon.com/images/M/MV5BN2RjZDJhYzUtOTQ5Yy00OWM3LWE5ZDctM2YyYmFjNzZlYWIzXkEyXkFqcGdeQXVyMTUyNjIwMDEw._V1_.jpg', 
    'https://static.toiimg.com/thumb/msid-106465384,width-1280,height-720,resizemode-4/106465384.jpg', 
    'https://www.youtube.com/watch?v=dummy_pushpa', 
    175, 
    'Action, Drama', 
    'Telugu, Hindi, Tamil', 
    'A', 
    'now_showing', 
    '2025-12-06'),

    -- OG (They Call Him OG)
    (movie_pawan_og_id, 
    'They Call Him OG', 
    'A ruthless gangster returns to Mumbai. Pawan Kalyan in a never-before-seen stylish avatar.', 
    'https://m.media-amazon.com/images/M/MV5BN2ZjYTA4M2ItNDhhMC00ODliLWIzNjYtOTMxYjQzNmFkNGY3XkEyXkFqcGdeQXVyMTUzOTcyODA5._V1_.jpg', 
    'https://images.cinemaexpress.com/uploads/user/imagelibrary/2023/4/15/original/Safety_Zone.jpg', 
    'https://www.youtube.com/watch?v=dummy_og', 
    160, 
    'Action, Gangster', 
    'Telugu, Hindi', 
    'UA', 
    'now_showing', 
    '2026-02-15'),

    -- Devara
    (movie_devara_id, 
    'Devara: Part 1', 
    'Fear is the only god. Jr NTR stars in this coastal action saga directed by Koratala Siva.', 
    'https://m.media-amazon.com/images/M/MV5BMjI0MzU3OTExOV5BMl5BanBnXkFtZTgwODIxNTQzMzE@._V1_.jpg', 
    'https://static.toiimg.com/thumb/msid-106677937,width-1280,height-720,resizemode-4/106677937.jpg',
    'https://www.youtube.com/watch?v=dummy_devara',
    168,
    'Action, Drama',
    'Telugu, Kannada',
    'A',
    'now_showing',
    '2025-10-10'),

    -- Spirit (Prabhas)
    (movie_spirit_id, 
    'Spirit', 
    'Prabhas plays a sincere police officer in this intense cop drama directed by Sandeep Reddy Vanga.', 
    'https://m.media-amazon.com/images/M/MV5BMjA4Mjg2MTY5MF5BMl5BanBnXkFtZTgwMzk3NTU3MzI@._V1_FMjpg_UX1000_.jpg', -- Reusing generic high quality artwork for placeholder
    'https://images.indianexpress.com/2021/10/Prabhas-25-Spirit-1200.jpg', 
    'https://www.youtube.com/watch?v=dummy_spirit', 
    170, 
    'Action, Crime', 
    'Telugu, Hindi', 
    'A', 
    'coming_soon', 
    '2026-09-05'),
    
    -- Kalki 2
    (movie_kalki2_id, 
    'Kalki 2898 AD: The End of Kali', 
    'The final battle for the future. The avatars unite to end the age of darkness.', 
    'https://m.media-amazon.com/images/M/MV5BYWJlM2E2NjEtYjA5ZC00MGViLWIzNjYtOTMxYjQzNmFkNGY3XkEyXkFqcGdeQXVyMTUzOTcyODA5._V1_.jpg', -- Placeholder
    'https://images.hindustantimes.com/img/2024/01/12/1600x900/Kalki_2898_AD_1705030230283_1705030245084.jpg', 
    'https://www.youtube.com/watch?v=dummy_kalki2', 
    195, 
    'Sci-Fi, Mythology', 
    'Telugu, Hindi, English', 
    'UA', 
    'coming_soon', 
    '2027-01-01'),

    -- Hari Hara Veera Mallu
    (gen_random_uuid(), 
    'Hari Hara Veera Mallu', 
    'A legendary outlaw in the 17th century takes on the Mughal empire. Pawan Kalyan''s epic period action drama.', 
    'https://m.media-amazon.com/images/M/MV5BMjA4Mjg2MTY5MF5BMl5BanBnXkFtZTgwMzk3NTU3MzI@._V1_FMjpg_UX1000_.jpg',
    'https://static.toiimg.com/thumb/msid-106465384,width-1280,height-720,resizemode-4/106465384.jpg', 
    'https://www.youtube.com/watch?v=dummy_hhvm', 
    165, 
    'Period, Action', 
    'Telugu, Hindi', 
    'UA', 
    'now_showing', 
    '2026-03-20'),

    -- Kannappa
    (gen_random_uuid(), 
    'Kannappa', 
    'The epic devotion of Kannappa towards Lord Shiva. A visual spectacle featuring stars from across India.', 
    'https://m.media-amazon.com/images/M/MV5BN2RjZDJhYzUtOTQ5Yy00OWM3LWE5ZDctM2YyYmFjNzZlYWIzXkEyXkFqcGdeQXVyMTUyNjIwMDEw._V1_.jpg',
    'https://static.toiimg.com/thumb/msid-106677937,width-1280,height-720,resizemode-4/106677937.jpg',
    'https://www.youtube.com/watch?v=dummy_kannappa', 
    155, 
    'Mythology, Fantasy', 
    'Telugu', 
    'U', 
    'now_showing', 
    '2026-02-05'),
    
    -- NBK109: Akhanda 2
    (gen_random_uuid(), 
    'NBK109: Akhanda 2', 
    'The roar returns. Balakrishna and Boyapati unite again for high-voltage action.', 
    'https://m.media-amazon.com/images/M/MV5BMjI0MzU3OTExOV5BMl5BanBnXkFtZTgwODIxNTQzMzE@._V1_.jpg', 
    'https://images.hindustantimes.com/img/2024/01/01/1600x900/SSMB29_123456789.jpg', 
    'https://www.youtube.com/watch?v=dummy_nbk', 
    160, 
    'Action, Drama', 
    'Telugu', 
    'UA', 
    'now_showing', 
    '2026-01-26'),

    -- The Raja Saab
    (movie_rajasaab_id, 
    'The Raja Saab', 
    'Prabhas in a romantic horror entertainer. A visual treat with stunning VFX and music.', 
    'https://m.media-amazon.com/images/M/MV5BMjA4Mjg2MTY5MF5BMl5BanBnXkFtZTgwMzk3NTU3MzI@._V1_FMjpg_UX1000_.jpg', 
    'https://static.toiimg.com/thumb/msid-107056636,width-1280,height-720,resizemode-4/107056636.jpg', 
    'https://www.youtube.com/watch?v=dummy_raja', 
    150, 
    'Horror, Comedy, Romance', 
    'Telugu, Hindi, Tamil', 
    'UA', 
    'coming_soon', 
    '2026-04-10'),

    -- Toxic
    (movie_toxic_id, 
    'Toxic: A Fairy Tale for Grown-ups', 
    'Rocking Star Yash returns in an intense action drama directed by Geetu Mohandas.', 
    'https://m.media-amazon.com/images/M/MV5BN2RjZDJhYzUtOTQ5Yy00OWM3LWE5ZDctM2YyYmFjNzZlYWIzXkEyXkFqcGdeQXVyMTUyNjIwMDEw._V1_.jpg', 
    'https://static.toiimg.com/thumb/msid-106883526,width-1280,height-720,resizemode-4/106883526.jpg', 
    'https://www.youtube.com/watch?v=dummy_toxic', 
    170, 
    'Action, Crime', 
    'Kannada, Telugu, Hindi', 
    'A', 
    'coming_soon', 
    '2026-05-25'),

    -- Kanguva
    (movie_kanguva_id, 
    'Kanguva', 
    'A mighty warrior dies. A 1678 saga. Suriya in a dual role across timelines.', 
    'https://m.media-amazon.com/images/M/MV5BMjI0MzU3OTExOV5BMl5BanBnXkFtZTgwODIxNTQzMzE@._V1_.jpg', 
    'https://static.toiimg.com/thumb/msid-106677937,width-1280,height-720,resizemode-4/106677937.jpg',
    'https://www.youtube.com/watch?v=dummy_kanguva', 
    165, 
    'Period, Action, Fantasy', 
    'Tamil, Telugu, Hindi', 
    'UA', 
    'coming_soon', 
    '2025-11-14'),

    -- Swayambhu
    (movie_swayambhu_id, 
    'Swayambhu', 
    'Nikhil Siddhartha as a fierce warrior in this epic historical action drama.', 
    'https://m.media-amazon.com/images/M/MV5BMjA4Mjg2MTY5MF5BMl5BanBnXkFtZTgwMzk3NTU3MzI@._V1_FMjpg_UX1000_.jpg', 
    'https://static.toiimg.com/thumb/msid-106465384,width-1280,height-720,resizemode-4/106465384.jpg', 
    'https://www.youtube.com/watch?v=dummy_swayambhu', 
    150, 
    'Action, History', 
    'Telugu', 
    'UA', 
    'coming_soon', 
    '2026-06-12');


    -- ==================================================================================
    -- 3. SEAT LAYOUTS (Premium & IMAX)
    -- ==================================================================================


    -- ==================================================================================
    -- 3. SEAT LAYOUTS (Premium & IMAX)
    -- ==================================================================================
    
    INSERT INTO seat_layouts (id, name, type, total_seats, rows, columns, layout_config) VALUES
    
    -- IMAX Laser Layout
    (layout_imax_id, 'IMAX with Laser', 'theatre', 250, 15, 20, '[
        {"row": "P", "seats": [{"id": "P1", "status": "available", "type": "recliner", "price_multiplier": 2.0}, {"id": "P2", "status": "available", "type": "recliner", "price_multiplier": 2.0}, {"id": "P3", "status": "available", "type": "recliner", "price_multiplier": 2.0}]},
        {"row": "A", "seats": [{"id": "A1", "status": "available"}, {"id": "A2", "status": "available"}, {"id": "A3", "status": "available"}, {"id": "A4", "status": "available"}, {"id": "A5", "status": "available"}, {"id": "A6", "status": "available"}, {"id": "A7", "status": "available"}, {"id": "A8", "status": "available"}]},
        {"row": "B", "seats": [{"id": "B1", "status": "available"}, {"id": "B2", "status": "available"}, {"id": "B3", "status": "available"}, {"id": "B4", "status": "available"}, {"id": "B5", "status": "available"}, {"id": "B6", "status": "available"}, {"id": "B7", "status": "available"}, {"id": "B8", "status": "available"}]}
    ]'),
    
    -- Standard Layout
    (layout_standard_id, 'Standard Screen', 'theatre', 150, 10, 15, '[
        {"row": "A", "seats": [{"id": "A1", "status": "available"}, {"id": "A2", "status": "available"}, {"id": "A3", "status": "available"}, {"id": "A4", "status": "available"}, {"id": "A5", "status": "available"}, {"id": "A6", "status": "available"}]},
        {"row": "B", "seats": [{"id": "B1", "status": "available"}, {"id": "B2", "status": "available"}, {"id": "B3", "status": "available"}, {"id": "B4", "status": "available"}, {"id": "B5", "status": "available"}, {"id": "B6", "status": "available"}]}
    ]'),

    -- Gold Class Layout
    (layout_gold_id, 'Gold Class Suites', 'theatre', 60, 6, 10, '[
        {"row": "G", "seats": [{"id": "G1", "status": "available", "type": "recliner", "price_multiplier": 1.5}, {"id": "G2", "status": "available", "type": "recliner", "price_multiplier": 1.5}, {"id": "G3", "status": "available", "type": "recliner", "price_multiplier": 1.5}, {"id": "G4", "status": "available", "type": "recliner", "price_multiplier": 1.5}]}
    ]');


    -- ==================================================================================
    -- 4. THEATRES (Top Tier Venues)
    -- ==================================================================================
    
    INSERT INTO theatres (id, name, district_id, address, facilities, seat_layout_id) VALUES
    (theatre_amb_id, 'AMB Cinemas: Gachibowli', hyderabad_id, 'Sarath City Capital Mall, Gachibowli', ARRAY['Laser Projection', 'V-VIP Lounge', 'Valet Parking', 'Gourmet Food'], layout_imax_id),
    (theatre_pvr_vizag_id, 'INOX: Chitralaya', vizag_id, 'Jagadamba Junction, Visakhapatnam', ARRAY['Dolby Atmos', 'Recliner Seats', '4K'], layout_gold_id),
    (theatre_inox_vja_id, 'PVR: Ripples', vijayawada_id, 'MG Road, Vijayawada', ARRAY['Dolby 7.1', 'Couple Seats'], layout_gold_id),
    (theatre_pvr_guntur_id, 'PVR: Nucleus Mall', guntur_id, 'Lakshmipuram, Main Road, Guntur', ARRAY['Dolby Atmos', '4K', 'Food Court'], layout_standard_id);


    -- ==================================================================================
    -- 5. SHOWS (Realistic Scheduling)
    -- ==================================================================================
    
    INSERT INTO shows (movie_id, theatre_id, show_time, price, total_seats, available_seats, seat_layout_id) VALUES
    -- SSMB29 @ AMB
    (movie_ssmb29_id, theatre_amb_id, NOW() + INTERVAL '1 day 10:30', 450, 250, 240, layout_imax_id),
    (movie_ssmb29_id, theatre_amb_id, NOW() + INTERVAL '1 day 14:15', 450, 250, 100, layout_imax_id),
    (movie_ssmb29_id, theatre_amb_id, NOW() + INTERVAL '1 day 18:00', 500, 250, 20, layout_imax_id),
    (movie_ssmb29_id, theatre_amb_id, NOW() + INTERVAL '1 day 21:30', 500, 250, 5, layout_imax_id),

    -- Pushpa 2 @ Vizag
    (movie_pushpa2_id, theatre_pvr_vizag_id, NOW() + INTERVAL '1 day 11:00', 350, 60, 50, layout_gold_id),
    (movie_pushpa2_id, theatre_pvr_vizag_id, NOW() + INTERVAL '1 day 18:00', 400, 60, 15, layout_gold_id),
    
    -- OG @ Vijayawada
    (movie_pawan_og_id, theatre_inox_vja_id, NOW() + INTERVAL '1 day 11:30', 295, 60, 55, layout_gold_id),
    (movie_pawan_og_id, theatre_inox_vja_id, NOW() + INTERVAL '1 day 19:00', 350, 60, 40, layout_gold_id),

    -- The Raja Saab @ AMB
    (movie_rajasaab_id, theatre_amb_id, NOW() + INTERVAL '1 day 12:00', 350, 250, 200, layout_imax_id),
    (movie_rajasaab_id, theatre_amb_id, NOW() + INTERVAL '1 day 16:30', 400, 250, 150, layout_imax_id),

    -- Toxic @ PVR Vizag
    (movie_toxic_id, theatre_pvr_vizag_id, NOW() + INTERVAL '1 day 14:00', 250, 60, 50, layout_gold_id),
    (movie_toxic_id, theatre_pvr_vizag_id, NOW() + INTERVAL '1 day 22:00', 300, 60, 30, layout_gold_id),

    -- Kanguva @ INOX VJA
    (movie_kanguva_id, theatre_inox_vja_id, NOW() + INTERVAL '1 day 10:00', 250, 60, 55, layout_gold_id),
    (movie_kanguva_id, theatre_inox_vja_id, NOW() + INTERVAL '1 day 17:00', 280, 60, 45, layout_gold_id),

    -- Swayambhu @ PVR Guntur
    (movie_swayambhu_id, theatre_pvr_guntur_id, NOW() + INTERVAL '1 day 11:30', 200, 120, 100, layout_standard_id),
    (movie_swayambhu_id, theatre_pvr_guntur_id, NOW() + INTERVAL '1 day 18:30', 220, 120, 80, layout_standard_id);


    -- ==================================================================================
    -- 6. EVENTS (Major 2026 Productions)
    -- ==================================================================================
    
    INSERT INTO events (id, title, description, date, venue, category, price, district_id, image_url, available_tickets, total_tickets) VALUES
    
    -- IPL Final
    (event_ipl_final_id, 'TATA IPL 2026 Final', 'The ultimate cricket showdown! Witness history in the making.', 
     NOW() + INTERVAL '45 days 19:30', 'Rajiv Gandhi Int. Stadium, Hyderabad', 'Sports', 2500, hyderabad_id, 
     'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2605&auto=format&fit=crop', -- High qual cricket stadium
     55000, 55000),
     
    -- AR Rahman Concert
    (event_ar_rahman_id, 'AR Rahman: Jai Ho Tour', 'The Mozart of Madras performs live with a 50-piece orchestra.', 
     NOW() + INTERVAL '30 days 18:00', 'GMC Balayogi Stadium, Hyderabad', 'Music', 2000, hyderabad_id, 
     'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=2544&auto=format&fit=crop', -- Concert crowd high res
     20000, 20000),
     
    -- Sunburn
    (gen_random_uuid(), 'Sunburn Vizag 2026', 'Asia''s biggest EDM festival hits the shores of Vizag.', 
     NOW() + INTERVAL '20 days 16:00', 'MGM Park, Vizag Beach', 'Music', 1500, vizag_id, 
     'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2670&auto=format&fit=crop', -- EDM Festival
     10000, 10000),
     
    -- Comedy
    (gen_random_uuid(), 'Kapil Sharma Live', 'India''s favorite comedian on his world tour.', 
     NOW() + INTERVAL '15 days 19:00', 'Shilpakala Vedika', 'Comedy', 1200, hyderabad_id, 
     'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?q=80&w=2670&auto=format&fit=crop', -- Mic spotlight
     2500, 2500),


    -- Formula E
    (gen_random_uuid(), 'Formula E: Hyderabad E-Prix', 'Electric street racing returns to the heart of Hyderabad.', 
     NOW() + INTERVAL '60 days 14:00', 'Hyderabad Street Circuit', 'Sports', 3000, hyderabad_id, 
     'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2670&auto=format&fit=crop', -- Racing Car
     15000, 15000),
     
    -- Food Festival
    (gen_random_uuid(), 'Great Telangana Food Festival', 'A culinary journey through the flavors of Telangana.', 
     NOW() + INTERVAL '10 days 11:00', 'Peoples Plaza, Hyderabad', 'Exhibition', 200, hyderabad_id, 
     'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2574&auto=format&fit=crop', -- Food Fest
     50000, 50000),

    -- Comedy Special
    (gen_random_uuid(), 'Zakir Khan: Live', 'Catch the Sakht Launda live in your city!', 
     NOW() + INTERVAL '25 days 19:30', 'Shilpakala Vedika, Hyderabad', 'Comedy', 1500, hyderabad_id, 
     'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?q=80&w=2670&auto=format&fit=crop', -- Mic generic
     3000, 3000),

    -- Talk Show Event
    (gen_random_uuid(), 'Pradeep Machiraju Live', 'Interactive session with the television superstar.', 
     NOW() + INTERVAL '5 days 18:00', 'Gurajada Kalakshetram, Vizag', 'Arts', 500, vizag_id, 
     'https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=2670&auto=format&fit=crop', -- Event generic
     2000, 2000);


    -- ==================================================================================
    -- 7. FOOD & BEVERAGES (Gourmet Menu)
    -- ==================================================================================
    
    INSERT INTO food_items (id, name, description, category, price, is_available, image_url, type) VALUES
    (gen_random_uuid(), 'Gourmet Cheese Popcorn', 'Triple cheese blend on jumbo mushroom kernels', 'Popcorn', 350, true, 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&q=80&w=800', 'Veg'),
    (gen_random_uuid(), 'Spicy Paneer Tikka Wrap', 'Grilled paneer with mint chutney in a tortilla', 'Snacks', 280, true, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=2571&auto=format&fit=crop', 'Veg'),
    (gen_random_uuid(), 'Chicken Smokey Wings', '6pcs BBQ glazed smoked wings', 'Snacks', 320, true, 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?q=80&w=2553&auto=format&fit=crop', 'Non-Veg'),
    (gen_random_uuid(), 'Belgian Chocolate Waffle', 'Warm waffle with maple syrup and ice cream', 'Desserts', 250, true, 'https://images.unsplash.com/photo-1554673645-09c313a17e88?q=80&w=2535&auto=format&fit=crop', 'Veg'),
    (gen_random_uuid(), 'Blue Lagoon Mocktail', 'Refreshing blue curacao citrus cooler', 'Beverages', 200, true, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=2574&auto=format&fit=crop', 'Veg'),
    
    (gen_random_uuid(), 'Double Cheese Burger', 'Juicy chicken patty with double cheddar cheese', 'Snacks', 290, true, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=2598&auto=format&fit=crop', 'Non-Veg'),
    (gen_random_uuid(), 'Pepperoni Pizza (8 inch)', 'Classic pepperoni pizza with mozzarella', 'Snacks', 450, true, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=2680&auto=format&fit=crop', 'Non-Veg'),
    
    (gen_random_uuid(), 'Chocolate Milkshake', 'Thick decadent chocolate shake', 'Beverages', 220, true, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=2574&auto=format&fit=crop', 'Veg'),
    (gen_random_uuid(), 'Ferrero Rocher Sundae', 'Premium sundae with hazelnut chocolates', 'Desserts', 350, true, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=2574&auto=format&fit=crop', 'Veg');


    -- ==================================================================================
    -- 8. PROMOTIONS
    -- ==================================================================================
    
    INSERT INTO promotions (code, discount_type, discount_value, description, start_date, end_date) VALUES
    ('BLOCKBUSTER50', 'percentage', 50, 'Get 50% off on premium movies this week', NOW(), NOW() + INTERVAL '7 days'),
    ('CRED20', 'percentage', 20, 'Pay with CRED and get 20% cashback', NOW(), NOW() + INTERVAL '1 year')
    ON CONFLICT (code) DO NOTHING;


    -- ==================================================================================
    -- 9. COMING SOON
    -- ==================================================================================
    
    INSERT INTO coming_soon (title, category, image_url, release_date) VALUES
    ('War 2', 'Movies', 'https://m.media-amazon.com/images/M/MV5BN2ZjYTA4M2ItNDhhMC00ODliLWIzNjYtOTMxYjQzNmFkNGY3XkEyXkFqcGdeQXVyMTUzOTcyODA5._V1_.jpg', '2026-08-15')
    ON CONFLICT DO NOTHING;


    -- ==================================================================================
    -- 10. ANNOUNCEMENTS
    -- ==================================================================================
    
    INSERT INTO announcements (title, content, icon_type, color_from, color_to, priority, is_active) VALUES
    ('IMAX Upgrade', 'Experience SSMB29 in pristine IMAX Laser at AMB Cinemas.', 'star', '#6a11cb', '#2575fc', 1, true)
    ON CONFLICT DO NOTHING;


    -- ==================================================================================
    -- 11. SPOTLIGHTS (Hero Banners)
    -- ==================================================================================
    
    -- Self-healing table creation
    CREATE TABLE IF NOT EXISTS spotlights (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        movie_id UUID REFERENCES movies(id),
        event_id UUID REFERENCES events(id),
        is_active BOOLEAN DEFAULT true,
        priority INTEGER DEFAULT 0,
        button_text TEXT DEFAULT 'Book Now',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Ensure columns
    BEGIN ALTER TABLE spotlights ADD COLUMN IF NOT EXISTS movie_id UUID REFERENCES movies(id); EXCEPTION WHEN OTHERS THEN NULL; END;
    BEGIN ALTER TABLE spotlights ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES events(id); EXCEPTION WHEN OTHERS THEN NULL; END;
    BEGIN ALTER TABLE spotlights ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true; EXCEPTION WHEN OTHERS THEN NULL; END;
    BEGIN ALTER TABLE spotlights ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 0; EXCEPTION WHEN OTHERS THEN NULL; END;
    BEGIN ALTER TABLE spotlights ADD COLUMN IF NOT EXISTS description TEXT; EXCEPTION WHEN OTHERS THEN NULL; END;
    BEGIN ALTER TABLE spotlights ADD COLUMN IF NOT EXISTS image_url TEXT; EXCEPTION WHEN OTHERS THEN NULL; END;

    INSERT INTO spotlights (id, title, description, image_url, movie_id, event_id, is_active, priority) VALUES 
    (gen_random_uuid(), 'SSMB29 - The Global Event', 'Mahesh Babu x SS Rajamouli. The biggest adventure begins.', 'https://images.hindustantimes.com/img/2024/01/01/1600x900/SSMB29_123456789.jpg', movie_ssmb29_id, NULL, true, 1),
    (gen_random_uuid(), 'IPL Final 2026', 'Tickets live now! Don''t miss the grand finale.', 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2605&auto=format&fit=crop', NULL, event_ipl_final_id, true, 2),
    (gen_random_uuid(), 'AR Rahman Live', 'Experience the magic of Rahman live in Hyderabad.', 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=2544&auto=format&fit=crop', NULL, event_ar_rahman_id, true, 3)
    ON CONFLICT DO NOTHING;
    
    RAISE NOTICE 'Premium seed data inserted successfully';

END $$;
