-- ============================================================
-- GrabAticket — COMPLETE Production Seed Data v2.0
-- Run AFTER: 20260609000000_fresh_schema.sql
-- Run AFTER: 20260610000000_extend_schema.sql
--
-- Covers:
--   ✅ seat_layouts  ✅ movies      ✅ theatres
--   ✅ shows         ✅ food_items  ✅ venues
--   ✅ events (concerts, sports, plays, comedy, festivals)
--   ✅ promo_codes   ✅ spotlights  ✅ announcements
-- ============================================================

DO $$
DECLARE
    -- ── SEAT LAYOUTS ─────────────────────────────────────────
    lay_imax     UUID := gen_random_uuid();
    lay_4dx      UUID := gen_random_uuid();
    lay_vip      UUID := gen_random_uuid();
    lay_dolby    UUID := gen_random_uuid();
    lay_std      UUID := gen_random_uuid();

    -- ── MOVIES ───────────────────────────────────────────────
    m_pushpa2    UUID := gen_random_uuid();
    m_devara     UUID := gen_random_uuid();
    m_kalki      UUID := gen_random_uuid();
    m_salaar     UUID := gen_random_uuid();
    m_stree2     UUID := gen_random_uuid();
    m_vidaa      UUID := gen_random_uuid();
    m_gk         UUID := gen_random_uuid();
    m_lucky_bha  UUID := gen_random_uuid();
    m_animal     UUID := gen_random_uuid();
    m_jawan      UUID := gen_random_uuid();
    m_ssmb29     UUID := gen_random_uuid();
    m_og         UUID := gen_random_uuid();
    m_bg3        UUID := gen_random_uuid();
    m_war2       UUID := gen_random_uuid();
    m_coolie     UUID := gen_random_uuid();

    -- ── THEATRES ─────────────────────────────────────────────
    th_amb       UUID := gen_random_uuid();
    th_pvr_kkt   UUID := gen_random_uuid();
    th_inox_vzg  UUID := gen_random_uuid();
    th_devi      UUID := gen_random_uuid();
    th_pvr_vij   UUID := gen_random_uuid();
    th_asian     UUID := gen_random_uuid();
    th_cinep     UUID := gen_random_uuid();
    th_srini     UUID := gen_random_uuid();
    th_sfm       UUID := gen_random_uuid();
    th_melody    UUID := gen_random_uuid();
    th_miraj     UUID := gen_random_uuid();
    th_pvr_banj  UUID := gen_random_uuid();

    -- ── VENUES ───────────────────────────────────────────────
    v_rgi_stad   UUID := gen_random_uuid();
    v_hicc       UUID := gen_random_uuid();
    v_hitex      UUID := gen_random_uuid();
    v_gac_stad   UUID := gen_random_uuid();
    v_vmrda      UUID := gen_random_uuid();
    v_pwdg       UUID := gen_random_uuid();
    v_ravindra   UUID := gen_random_uuid();
    v_ntr_stad   UUID := gen_random_uuid();
    v_shilpa     UUID := gen_random_uuid();
    v_sap_vzg    UUID := gen_random_uuid();
    v_rk_beach   UUID := gen_random_uuid();
    v_novot_hyd  UUID := gen_random_uuid();

    -- ── EVENTS ───────────────────────────────────────────────
    ev_sunburn   UUID := gen_random_uuid();
    ev_ipl       UUID := gen_random_uuid();
    ev_diljit    UUID := gen_random_uuid();
    ev_arijit    UUID := gen_random_uuid();
    ev_vir       UUID := gen_random_uuid();
    ev_shankar   UUID := gen_random_uuid();
    ev_chess     UUID := gen_random_uuid();
    ev_badm      UUID := gen_random_uuid();
    ev_kabaddi   UUID := gen_random_uuid();
    ev_isl       UUID := gen_random_uuid();
    ev_ramayana  UUID := gen_random_uuid();
    ev_othello   UUID := gen_random_uuid();
    ev_comedy    UUID := gen_random_uuid();
    ev_foodfest  UUID := gen_random_uuid();
    ev_artexpo   UUID := gen_random_uuid();
    ev_techfest  UUID := gen_random_uuid();
    ev_yoga      UUID := gen_random_uuid();
    ev_kuchipudi UUID := gen_random_uuid();

BEGIN

-- ============================================================
-- 1. SEAT LAYOUTS
-- ============================================================
INSERT INTO public.seat_layouts
  (id, name, type, total_seats, rows, columns, layout_config) VALUES

(lay_imax, 'IMAX Laser – AMB Signature', 'theatre', 248, 14, 18, '[
  {"row":"R","label":"Recliner","seats":[{"id":"R1","type":"recliner","price_multiplier":2.0},{"id":"R2","type":"recliner","price_multiplier":2.0},{"id":"R3","type":"recliner","price_multiplier":2.0},{"id":"R4","type":"recliner","price_multiplier":2.0},{"id":"R5","type":"recliner","price_multiplier":2.0},{"id":"R6","type":"recliner","price_multiplier":2.0}]},
  {"row":"A","label":"Premium","seats":[{"id":"A1","type":"premium","price_multiplier":1.5},{"id":"A2","type":"premium","price_multiplier":1.5},{"id":"A3","type":"premium","price_multiplier":1.5},{"id":"A4","type":"premium","price_multiplier":1.5},{"id":"A5","type":"premium","price_multiplier":1.5},{"id":"A6","type":"premium","price_multiplier":1.5},{"id":"A7","type":"premium","price_multiplier":1.5},{"id":"A8","type":"premium","price_multiplier":1.5}]},
  {"row":"B","label":"Executive","seats":[{"id":"B1"},{"id":"B2"},{"id":"B3"},{"id":"B4"},{"id":"B5"},{"id":"B6"},{"id":"B7"},{"id":"B8"},{"id":"B9"},{"id":"B10"}]},
  {"row":"C","label":"Executive","seats":[{"id":"C1"},{"id":"C2"},{"id":"C3"},{"id":"C4"},{"id":"C5"},{"id":"C6"},{"id":"C7"},{"id":"C8"},{"id":"C9"},{"id":"C10"}]},
  {"row":"D","label":"Classic","seats":[{"id":"D1"},{"id":"D2"},{"id":"D3"},{"id":"D4"},{"id":"D5"},{"id":"D6"},{"id":"D7"},{"id":"D8"},{"id":"D9"},{"id":"D10"},{"id":"D11"},{"id":"D12"}]},
  {"row":"E","label":"Classic","seats":[{"id":"E1"},{"id":"E2"},{"id":"E3"},{"id":"E4"},{"id":"E5"},{"id":"E6"},{"id":"E7"},{"id":"E8"},{"id":"E9"},{"id":"E10"},{"id":"E11"},{"id":"E12"}]}
]'::jsonb),

(lay_4dx, '4DX Motion – PVR', 'theatre', 120, 8, 15, '[
  {"row":"A","label":"4DX Premium","seats":[{"id":"A1","type":"motion","price_multiplier":2.5},{"id":"A2","type":"motion","price_multiplier":2.5},{"id":"A3","type":"motion","price_multiplier":2.5},{"id":"A4","type":"motion","price_multiplier":2.5},{"id":"A5","type":"motion","price_multiplier":2.5},{"id":"A6","type":"motion","price_multiplier":2.5}]},
  {"row":"B","label":"4DX Standard","seats":[{"id":"B1","type":"motion","price_multiplier":2.0},{"id":"B2","type":"motion","price_multiplier":2.0},{"id":"B3","type":"motion","price_multiplier":2.0},{"id":"B4","type":"motion","price_multiplier":2.0},{"id":"B5","type":"motion","price_multiplier":2.0},{"id":"B6","type":"motion","price_multiplier":2.0},{"id":"B7","type":"motion","price_multiplier":2.0},{"id":"B8","type":"motion","price_multiplier":2.0}]},
  {"row":"C","label":"4DX Standard","seats":[{"id":"C1","type":"motion","price_multiplier":2.0},{"id":"C2","type":"motion","price_multiplier":2.0},{"id":"C3","type":"motion","price_multiplier":2.0},{"id":"C4","type":"motion","price_multiplier":2.0},{"id":"C5","type":"motion","price_multiplier":2.0},{"id":"C6","type":"motion","price_multiplier":2.0}]}
]'::jsonb),

(lay_vip, 'Gold Recliner VIP Suite', 'theatre', 60, 4, 8, '[
  {"row":"G1","label":"Gold Couple Recliner","seats":[{"id":"G1","type":"recliner","price_multiplier":3.0},{"id":"G2","type":"recliner","price_multiplier":3.0},{"id":"G3","type":"recliner","price_multiplier":3.0},{"id":"G4","type":"recliner","price_multiplier":3.0},{"id":"G5","type":"recliner","price_multiplier":3.0},{"id":"G6","type":"recliner","price_multiplier":3.0}]},
  {"row":"G2","label":"Gold Couple Recliner","seats":[{"id":"G7","type":"recliner","price_multiplier":3.0},{"id":"G8","type":"recliner","price_multiplier":3.0},{"id":"G9","type":"recliner","price_multiplier":3.0},{"id":"G10","type":"recliner","price_multiplier":3.0},{"id":"G11","type":"recliner","price_multiplier":3.0},{"id":"G12","type":"recliner","price_multiplier":3.0}]}
]'::jsonb),

(lay_dolby, 'Dolby Atmos Premium', 'theatre', 180, 10, 18, '[
  {"row":"R","label":"Recliner","seats":[{"id":"R1","type":"recliner","price_multiplier":2.0},{"id":"R2","type":"recliner","price_multiplier":2.0},{"id":"R3","type":"recliner","price_multiplier":2.0},{"id":"R4","type":"recliner","price_multiplier":2.0},{"id":"R5","type":"recliner","price_multiplier":2.0},{"id":"R6","type":"recliner","price_multiplier":2.0}]},
  {"row":"A","label":"Premium","seats":[{"id":"A1","type":"premium","price_multiplier":1.5},{"id":"A2","type":"premium","price_multiplier":1.5},{"id":"A3","type":"premium","price_multiplier":1.5},{"id":"A4","type":"premium","price_multiplier":1.5},{"id":"A5","type":"premium","price_multiplier":1.5},{"id":"A6","type":"premium","price_multiplier":1.5},{"id":"A7","type":"premium","price_multiplier":1.5},{"id":"A8","type":"premium","price_multiplier":1.5}]},
  {"row":"B","label":"Classic","seats":[{"id":"B1"},{"id":"B2"},{"id":"B3"},{"id":"B4"},{"id":"B5"},{"id":"B6"},{"id":"B7"},{"id":"B8"},{"id":"B9"},{"id":"B10"}]},
  {"row":"C","label":"Classic","seats":[{"id":"C1"},{"id":"C2"},{"id":"C3"},{"id":"C4"},{"id":"C5"},{"id":"C6"},{"id":"C7"},{"id":"C8"},{"id":"C9"},{"id":"C10"}]}
]'::jsonb),

(lay_std, 'Standard Multiplex Screen', 'theatre', 250, 13, 20, '[
  {"row":"A","label":"Front Stalls","seats":[{"id":"A1"},{"id":"A2"},{"id":"A3"},{"id":"A4"},{"id":"A5"},{"id":"A6"},{"id":"A7"},{"id":"A8"},{"id":"A9"},{"id":"A10"},{"id":"A11"},{"id":"A12"}]},
  {"row":"B","label":"Front Stalls","seats":[{"id":"B1"},{"id":"B2"},{"id":"B3"},{"id":"B4"},{"id":"B5"},{"id":"B6"},{"id":"B7"},{"id":"B8"},{"id":"B9"},{"id":"B10"},{"id":"B11"},{"id":"B12"}]},
  {"row":"C","label":"Classic","seats":[{"id":"C1"},{"id":"C2"},{"id":"C3"},{"id":"C4"},{"id":"C5"},{"id":"C6"},{"id":"C7"},{"id":"C8"},{"id":"C9"},{"id":"C10"},{"id":"C11"},{"id":"C12"},{"id":"C13"}]},
  {"row":"D","label":"Classic","seats":[{"id":"D1"},{"id":"D2"},{"id":"D3"},{"id":"D4"},{"id":"D5"},{"id":"D6"},{"id":"D7"},{"id":"D8"},{"id":"D9"},{"id":"D10"},{"id":"D11"},{"id":"D12"},{"id":"D13"}]},
  {"row":"E","label":"Classic","seats":[{"id":"E1"},{"id":"E2"},{"id":"E3"},{"id":"E4"},{"id":"E5"},{"id":"E6"},{"id":"E7"},{"id":"E8"},{"id":"E9"},{"id":"E10"},{"id":"E11"},{"id":"E12"},{"id":"E13"}]},
  {"row":"F","label":"Premium","seats":[{"id":"F1","type":"premium","price_multiplier":1.3},{"id":"F2","type":"premium","price_multiplier":1.3},{"id":"F3","type":"premium","price_multiplier":1.3},{"id":"F4","type":"premium","price_multiplier":1.3},{"id":"F5","type":"premium","price_multiplier":1.3},{"id":"F6","type":"premium","price_multiplier":1.3},{"id":"F7","type":"premium","price_multiplier":1.3},{"id":"F8","type":"premium","price_multiplier":1.3}]}
]'::jsonb);


-- ============================================================
-- 2. MOVIES  (Now Showing)
-- ============================================================
INSERT INTO public.movies
  (id, title, description, poster_url, banner_url, trailer_url, duration_minutes, language, genre, rating, status, release_date)
VALUES

-- ── NOW SHOWING ─────────────────────────────────────────────

(m_pushpa2,
 'Pushpa 2: The Rule',
 'Pushpa Raj has expanded his red sandalwood smuggling empire across the globe. When ruthless IPS Officer Bhanwar Singh Shekawat — fuelled by personal humiliation — returns for revenge, an earth-shattering clash between two unstoppable forces ignites. Allu Arjun delivers the performance of his career in this visceral, stylish action epic directed by Sukumar.',
 'https://upload.wikimedia.org/wikipedia/en/9/9a/Pushpa_2_The_Rule.jpg',
 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1400&auto=format&fit=crop',
 'https://www.youtube.com/watch?v=Q6-GiNJcFys',
 175, 'Telugu, Hindi, Tamil, Kannada, Malayalam', 'Action, Crime, Drama', 'UA', 'now_showing', '2024-12-05'),

(m_devara,
 'Devara: Part 1',
 'A coastal village built on fear, controlled by the terrifying Devara. When his son Chandra inherits the legacy of a man the entire underworld feared and loved, he must confront the monsters his father created — including the most dangerous one: himself. Jr NTR in a stunning dual role directed by Koratala Siva.',
 'https://upload.wikimedia.org/wikipedia/en/b/bf/Devara_Part_1_poster.jpg',
 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=1400&auto=format&fit=crop',
 'https://www.youtube.com/watch?v=xDxOJMtZqq4',
 168, 'Telugu, Hindi', 'Action, Drama, Thriller', 'UA', 'now_showing', '2024-09-27'),

(m_kalki,
 'Kalki 2898 AD',
 'In the dystopian city of Kasi, ruled by the immortal Supreme Yaskin, a mercenary named Bhairava desperately seeks enough SOM to escape with his AI companion Deepika. But fate has different plans — the ancient Sanskrit prophecy of Kalki, the tenth avatar of Vishnu, is about to manifest. Prabhas, Deepika Padukone, Amitabh Bachchan and Kamal Haasan in Nag Ashwin''s jaw-dropping sci-fi mythology.',
 'https://upload.wikimedia.org/wikipedia/en/4/4f/Kalki_2898_AD_poster.jpg',
 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?q=80&w=1400&auto=format&fit=crop',
 'https://www.youtube.com/watch?v=_nPbBohkMdA',
 181, 'Telugu, Hindi, Tamil, Malayalam, Kannada', 'Sci-Fi, Action, Mythology', 'UA', 'now_showing', '2024-06-27'),

(m_salaar,
 'Salaar: Part 1 — Ceasefire',
 'Deva is the most feared warlord of Khansaar — a lawless kingdom where violence is currency. Forced out of retirement by a vow to his dying friend, Deva must tear apart the most violent empire on earth. A Prashanth Neel directorial with Prabhas at his most brutal and Prithviraj Sukumaran at his most complex.',
 'https://upload.wikimedia.org/wikipedia/en/3/35/Salaar_Cease_Fire_Part_1.jpg',
 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1400&auto=format&fit=crop',
 'https://www.youtube.com/watch?v=Kf1cERWpBXE',
 172, 'Telugu, Kannada, Hindi, Tamil, Malayalam', 'Action, Thriller', 'A', 'now_showing', '2023-12-22'),

(m_stree2,
 'Stree 2: Sarkate Ka Aatank',
 'The headless evil that haunted Chanderi has vanished — but something far worse arrives. Sarkate, a demonic entity that snatches women and leaves their heads behind, terrorises the town. The beloved ragtag team of Vicky, Bittu, Jana, Atul and the mysterious Stree must unite once more. Rajkummar Rao and Shraddha Kapoor headline this record-breaking horror comedy sequel.',
 'https://upload.wikimedia.org/wikipedia/en/4/42/Stree_2_poster.jpg',
 'https://images.unsplash.com/photo-1512070679279-8988d32161be?q=80&w=1400&auto=format&fit=crop',
 'https://www.youtube.com/watch?v=1yrOzYiJoXk',
 138, 'Hindi', 'Horror, Comedy', 'UA', 'now_showing', '2024-08-15'),

(m_vidaa,
 'Vidaa Muyarchi',
 'Arya and Aadhya, an Indian couple working abroad, are caught in a dangerous human trafficking conspiracy. With no allies, no weapons and no way out — Arya fights through impossible odds to bring his wife home. Ajith Kumar''s most intense action role yet, directed by Magizh Thirumeni and shot across Azerbaijan and Georgia.',
 'https://upload.wikimedia.org/wikipedia/en/6/60/Vidaamuyarchi_Poster.jpg',
 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1400&auto=format&fit=crop',
 'https://www.youtube.com/watch?v=BEA1d4kRPyk',
 145, 'Tamil, Telugu', 'Action, Thriller', 'UA', 'now_showing', '2025-01-12'),

(m_gk,
 'Guntur Kaaram',
 'Ramana, a fun-loving Hyderabadi, is forced to confront the lifelong wound between him and his estranged mother — a woman who chose her dreams over her family. A layered, emotional saga by Trivikram Srinivas about pride, regret, and the impossible distances between the people we love most. Stars Mahesh Babu and Sreeleela in a celebrated folk dance number.',
 'https://upload.wikimedia.org/wikipedia/en/1/17/Guntur_Kaaram_poster.jpg',
 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=1400&auto=format&fit=crop',
 'https://www.youtube.com/watch?v=t7RmtlqUMbo',
 156, 'Telugu', 'Drama, Family, Romance', 'U', 'now_showing', '2024-01-12'),

(m_lucky_bha,
 'Lucky Bhaskar',
 'Bhaskar, an ordinary bank employee drowning in a mediocre life, accidentally discovers a loophole in the banking system. What starts as a small lie snowballs into a ₹50 crore fraud — and a battle of wits against an international watchdog. Dulquer Salmaan is magnetic in this sleek, fast-paced financial thriller directed by Venky Atluri.',
 'https://upload.wikimedia.org/wikipedia/en/b/ba/Lucky_Bhaskar_Telugu_film_poster.jpg',
 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1400&auto=format&fit=crop',
 'https://www.youtube.com/watch?v=cWpnmJJ09E4',
 148, 'Telugu, Tamil', 'Thriller, Crime, Drama', 'UA', 'now_showing', '2024-09-05'),

(m_animal,
 'Animal',
 'Ranvijay Singh will do anything for his father''s love — including burn the world to the ground. A savage, operatic tale of toxic masculinity, obsession, and primal rage directed by Sandeep Reddy Vanga. Ranbir Kapoor, Bobby Deol, Anil Kapoor and Rashmika Mandanna in Bollywood''s most controversial and discussed blockbuster of the decade.',
 'https://upload.wikimedia.org/wikipedia/en/a/a9/Animal_film_poster.jpg',
 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1400&auto=format&fit=crop',
 'https://www.youtube.com/watch?v=b77F6ppB6aE',
 201, 'Hindi', 'Action, Drama', 'A', 'now_showing', '2023-12-01'),

(m_jawan,
 'Jawan',
 'A man with a haunted past breaks free to right the wrongs of a broken system — but to do so, he must first destroy the corrupt powers that be. Shah Rukh Khan in a dual role as a father-son duo in Atlee''s high-octane mass entertainer. A record-shattering film that rewrote Indian box office history.',
 'https://upload.wikimedia.org/wikipedia/en/c/ce/Jawan_film_poster.jpg',
 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1400&auto=format&fit=crop',
 'https://www.youtube.com/watch?v=CzEBVMxBkZo',
 169, 'Hindi, Tamil', 'Action, Thriller, Social', 'UA', 'now_showing', '2023-09-07'),

-- ── COMING SOON ─────────────────────────────────────────────

(m_ssmb29,
 'SSMB29',
 'The most ambitious Telugu film ever made. SS Rajamouli — the visionary behind Baahubali and RRR — teams up with Mahesh Babu for a globe-trotting adventure inspired by Indiana Jones, set in unexplored jungles, ancient ruins and remote deserts. Shot across 7 countries on the biggest Telugu film budget in history.',
 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=1400&auto=format&fit=crop',
 'https://www.youtube.com/watch?v=placeholder_ssmb29',
 185, 'Telugu, English', 'Action, Adventure', 'UA', 'coming_soon', '2026-08-15'),

(m_og,
 'OG (The Original God)',
 'Pawan Kalyan plays Virupaksha — the most lethal operative in a shadowy intelligence agency — who is pulled back into a deadly mission he had buried. Directed by Sujeeth, OG promises a globe-trotting espionage thriller shot in Iceland, Turkey and South Korea.',
 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1400&auto=format&fit=crop',
 'https://www.youtube.com/watch?v=placeholder_og',
 158, 'Telugu, Hindi', 'Action, Spy, Thriller', 'A', 'coming_soon', '2026-04-10'),

(m_bg3,
 'Baahubali 3: The Return',
 'The most anticipated sequel in Indian cinema history. SS Rajamouli returns to Mahishmati to tell the untold story of Devasena''s bloodline — a new generation that must reclaim the kingdom from a resurgent evil. Produced on an unprecedented budget with state-of-the-art VFX technology never before used in an Indian production.',
 'https://upload.wikimedia.org/wikipedia/en/2/27/Baahubali_2_The_Conclusion_poster.jpg',
 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1400&auto=format&fit=crop',
 'https://www.youtube.com/watch?v=placeholder_bg3',
 195, 'Telugu, Hindi, Tamil', 'Epic, Action, Drama', 'UA', 'coming_soon', '2027-04-01'),

(m_war2,
 'War 2',
 'Hrithik Roshan returns as Kabir — India''s greatest agent — now facing a new nemesis in the form of NTR Jr. Directed by Ayan Mukerji, War 2 is a massive spy action spectacle shot across Abu Dhabi, Switzerland and Mumbai.',
 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=1400&auto=format&fit=crop',
 'https://www.youtube.com/watch?v=placeholder_war2',
 165, 'Hindi', 'Action, Spy', 'UA', 'coming_soon', '2025-08-14'),

(m_coolie,
 'Coolie',
 'Rajinikanth is Thomas — a coolie (railway porter) who is secretly the most dangerous man alive. When his family is threatened by a sinister billionaire''s conspiracy, Thomas unleashes a fury that shakes nations. Directed by Lokesh Kanagaraj, the mastermind behind Vikram and Master.',
 'https://images.unsplash.com/photo-1543536448-1e76fc2795bf?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?q=80&w=1400&auto=format&fit=crop',
 'https://www.youtube.com/watch?v=placeholder_coolie',
 158, 'Tamil, Telugu, Hindi', 'Action, Thriller', 'UA', 'coming_soon', '2025-05-01');


-- ============================================================
-- 3. THEATRES
-- ============================================================
INSERT INTO public.theatres
  (id, name, address, phone, facilities, city, seat_layout_id) VALUES

(th_amb,
 'AMB Cinemas: Gachibowli IMAX',
 'Sarath City Capital Mall, Kondapur, Hyderabad - 500084',
 '+91 40 6726 9999',
 ARRAY['IMAX Laser 4K','Dolby Atmos','Luxury Recliners','Valet Parking','F&B Lounge','Disabled Access','Card & UPI Payments','Coat Check'],
 'Hyderabad', lay_imax),

(th_pvr_kkt,
 'PVR INOX: Forum Sujana Mall',
 'Forum Sujana Mall, Kukatpally Housing Board, Hyderabad - 500072',
 '+91 40 4040 5555',
 ARRAY['4DX Motion Seats','Dolby Vision','Dolby Atmos','Gold Class Recliners','Kidzone Play Area','Online F&B Pre-Order','Card & UPI Payments'],
 'Hyderabad', lay_4dx),

(th_pvr_banj,
 'PVR INOX: Banjara Hills',
 'Road No 2, Banjara Hills, Hyderabad - 500034',
 '+91 40 2335 6789',
 ARRAY['IMAX Laser','Dolby Atmos','VIP Recliners','Premium Lounge Bar','Fine Dining Pre-Show','Concierge Booking'],
 'Hyderabad', lay_vip),

(th_inox_vzg,
 'PVR INOX: CMR Central Mall',
 'CMR Central Mall, Dwaraka Nagar, Visakhapatnam - 530016',
 '+91 891 666 7777',
 ARRAY['Dolby Atmos','3D Projection','Recliner Seats','F&B Counter','Online Booking','Parking'],
 'Visakhapatnam', lay_dolby),

(th_devi,
 'Devi 70MM: Nagin Mahal Complex',
 'Dwaraka Nagar Road, Visakhapatnam - 530016',
 '+91 891 255 1133',
 ARRAY['70mm Classic Screen','Air Conditioned','Snack Counter','Vintage Charm'],
 'Visakhapatnam', lay_std),

(th_pvr_vij,
 'PVR INOX: Center Stage Mall',
 'Center Stage Mall, Governorpet, Vijayawada - 520002',
 '+91 866 242 1234',
 ARRAY['4K Projection','Dolby Atmos','Recliner Seats','Premium Lounge','F&B','Card & UPI'],
 'Vijayawada', lay_dolby),

(th_asian,
 'Asian Multiplex: Abids',
 'Abids Circle, near GPO, Hyderabad - 500001',
 '+91 40 2322 1100',
 ARRAY['Air Conditioned','Classic Screens','Snack Counter','Ample Parking','UPI Payments'],
 'Hyderabad', lay_std),

(th_cinep,
 'Cineplanet: Warangal',
 'Kazipet Road, Hanamkonda, Warangal - 506001',
 '+91 870 244 5566',
 ARRAY['3D Projection','Dolby Sound','Food Court','Online Booking','Parking'],
 'Warangal', lay_std),

(th_srini,
 'Sri Venkateswara Multiplex: Tirupati',
 'TP Area, Near RTC Complex, Tirupati - 517501',
 '+91 877 220 8800',
 ARRAY['Air Conditioned','3D','Snack Counter','Parking','Disabled Access','UPI Payments'],
 'Tirupati', lay_std),

(th_sfm,
 'SFM Cinemas: Guntur',
 'Brodipet Main Road, Guntur - 522002',
 '+91 863 235 6678',
 ARRAY['3D Projection','Air Conditioned','Parking','Online Booking','F&B Counter'],
 'Guntur', lay_std),

(th_melody,
 'Melody Cinema: Vijayawada',
 'MG Road, Labbipet, Vijayawada - 520010',
 '+91 866 257 4433',
 ARRAY['Classic Cinema','Air Conditioned','Snack Counter','Affordable Tickets'],
 'Vijayawada', lay_std),

(th_miraj,
 'Miraj Cinemas: Karimnagar',
 'Lower Kaman Road, Karimnagar - 505001',
 '+91 878 222 3344',
 ARRAY['3D Projection','Dolby Sound','Online Booking','Snack Counter','Parking'],
 'Karimnagar', lay_std);


-- ============================================================
-- 4. SHOWS (Movies × Theatres × Dates)
-- ============================================================
INSERT INTO public.shows
  (movie_id, theatre_id, show_time, price, format, available_seats, total_seats, status, seat_layout_id) VALUES

-- ── PUSHPA 2 ─────────────────────────────────────────────────
(m_pushpa2, th_amb,       NOW()+'6 hours',           550, 'IMAX', 22,  248, 'filling_fast', lay_imax),
(m_pushpa2, th_amb,       NOW()+'1 day 9 hours',     550, 'IMAX', 248, 248, 'available',    lay_imax),
(m_pushpa2, th_amb,       NOW()+'1 day 14 hours',    550, 'IMAX', 180, 248, 'available',    lay_imax),
(m_pushpa2, th_pvr_kkt,   NOW()+'1 day 10 hours',    400, '4DX',  0,   120, 'sold_out',     lay_4dx),
(m_pushpa2, th_pvr_kkt,   NOW()+'2 days 19 hours',   400, '4DX',  12,  120, 'filling_fast', lay_4dx),
(m_pushpa2, th_pvr_banj,  NOW()+'3 hours',           750, 'IMAX', 8,   60,  'filling_fast', lay_vip),
(m_pushpa2, th_pvr_banj,  NOW()+'1 day 11 hours',    750, 'IMAX', 60,  60,  'available',    lay_vip),
(m_pushpa2, th_asian,     NOW()+'4 hours',           200, '2D',   100, 250, 'available',    lay_std),
(m_pushpa2, th_srini,     NOW()+'1 day 13 hours',    200, '2D',   180, 250, 'available',    lay_std),
(m_pushpa2, th_inox_vzg,  NOW()+'2 days 15 hours',   320, '3D',   45,  180, 'filling_fast', lay_dolby),

-- ── DEVARA ───────────────────────────────────────────────────
(m_devara,  th_pvr_kkt,   NOW()+'1 day 18 hours',    380, '3D',   87,  120, 'available',    lay_4dx),
(m_devara,  th_asian,     NOW()+'3 days 12 hours',   200, '2D',   150, 250, 'available',    lay_std),
(m_devara,  th_inox_vzg,  NOW()+'2 days 17 hours',   300, '3D',   90,  180, 'available',    lay_dolby),
(m_devara,  th_pvr_vij,   NOW()+'4 days 16 hours',   260, '2D',   170, 180, 'available',    lay_dolby),

-- ── KALKI 2898 AD ────────────────────────────────────────────
(m_kalki,   th_amb,       NOW()+'2 days 11 hours',   500, 'IMAX', 80,  248, 'available',    lay_imax),
(m_kalki,   th_inox_vzg,  NOW()+'3 days 15 hours',   320, '3D',   40,  180, 'filling_fast', lay_dolby),
(m_kalki,   th_devi,      NOW()+'4 days 10 hours',   160, '2D',   210, 250, 'available',    lay_std),
(m_kalki,   th_pvr_vij,   NOW()+'2 days 19 hours',   300, '3D',   120, 180, 'available',    lay_dolby),

-- ── SALAAR ───────────────────────────────────────────────────
(m_salaar,  th_asian,     NOW()+'2 days 12 hours',   200, '2D',   120, 250, 'available',    lay_std),
(m_salaar,  th_pvr_kkt,   NOW()+'4 days 16 hours',   350, '3D',   90,  120, 'available',    lay_4dx),
(m_salaar,  th_cinep,     NOW()+'5 days 17 hours',   220, '2D',   200, 250, 'available',    lay_std),
(m_salaar,  th_melody,    NOW()+'3 days 14 hours',   180, '2D',   200, 250, 'available',    lay_std),

-- ── STREE 2 ──────────────────────────────────────────────────
(m_stree2,  th_pvr_vij,   NOW()+'2 days 19 hours',   300, '2D',   60,  180, 'available',    lay_dolby),
(m_stree2,  th_melody,    NOW()+'3 days 14 hours',   180, '2D',   200, 250, 'available',    lay_std),
(m_stree2,  th_sfm,       NOW()+'1 day 16 hours',    180, '2D',   95,  250, 'available',    lay_std),

-- ── VIDAA MUYARCHI ───────────────────────────────────────────
(m_vidaa,   th_devi,      NOW()+'2 days 20 hours',   160, '2D',   200, 250, 'available',    lay_std),
(m_vidaa,   th_inox_vzg,  NOW()+'4 days 17 hours',   280, '3D',   130, 180, 'available',    lay_dolby),

-- ── LUCKY BHASKAR ────────────────────────────────────────────
(m_lucky_bha, th_pvr_kkt, NOW()+'1 day 12 hours',   320, '2D',   60,  120, 'available',    lay_4dx),
(m_lucky_bha, th_asian,   NOW()+'3 days 18 hours',   200, '2D',   180, 250, 'available',    lay_std),

-- ── GUNTUR KAARAM ────────────────────────────────────────────
(m_gk,      th_sfm,       NOW()+'1 day 16 hours',    180, '2D',   95,  250, 'available',    lay_std),
(m_gk,      th_pvr_vij,   NOW()+'3 days 11 hours',   260, '2D',   170, 180, 'available',    lay_dolby),

-- ── ANIMAL ───────────────────────────────────────────────────
(m_animal,  th_pvr_banj,  NOW()+'6 hours',           600, '2D',   20,  60,  'filling_fast', lay_vip),
(m_animal,  th_asian,     NOW()+'2 days 15 hours',   200, '2D',   200, 250, 'available',    lay_std),

-- ── JAWAN ────────────────────────────────────────────────────
(m_jawan,   th_asian,     NOW()+'5 days 13 hours',   200, '2D',   180, 250, 'available',    lay_std),
(m_jawan,   th_miraj,     NOW()+'3 days 10 hours',   180, '2D',   200, 250, 'available',    lay_std);


-- ============================================================
-- 5. VENUES
-- ============================================================
INSERT INTO public.venues
  (id, name, address, city, state, type, capacity, facilities, image_url, map_url, contact) VALUES

(v_rgi_stad,
 'Rajiv Gandhi International Cricket Stadium',
 'Uppal, Hyderabad - 500039',
 'Hyderabad', 'Telangana', 'stadium', 55000,
 ARRAY['BCCI Approved','Floodlights','Giant LED Scoreboards','VIP Box Suites','Media Centre','Food Courts','Metro Connectivity'],
 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Rajiv_Gandhi_International_Cricket_Stadium_Hyderabad.jpg/1200px-Rajiv_Gandhi_International_Cricket_Stadium_Hyderabad.jpg',
 'https://maps.google.com/?q=Rajiv+Gandhi+International+Stadium+Uppal+Hyderabad',
 '+91 40 2715 0200'),

(v_hicc,
 'Hyderabad International Convention Centre (HICC)',
 'Near Novotel, HICC Complex, Madhapur, Hyderabad - 500081',
 'Hyderabad', 'Telangana', 'convention_centre', 6000,
 ARRAY['14 Halls','World-Class AV','Green Rooms','Banquet','5-Star Hospitality','Ample Parking'],
 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop',
 'https://maps.google.com/?q=HICC+Madhapur+Hyderabad',
 '+91 40 6631 0000'),

(v_hitex,
 'Hitex Exhibition Centre',
 'Hitex Road, Madhapur, Hyderabad - 500084',
 'Hyderabad', 'Telangana', 'arena', 40000,
 ARRAY['12 Exhibition Halls','Outdoor Arena','Camping Zone','Food Courts','24hr Security','Shuttle Service'],
 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop',
 'https://maps.google.com/?q=Hitex+Exhibition+Centre+Hyderabad',
 '+91 40 2311 5000'),

(v_gac_stad,
 'Gachibowli Indoor Stadium',
 'Near IIIT, Gachibowli, Hyderabad - 500032',
 'Hyderabad', 'Telangana', 'arena', 10000,
 ARRAY['International Standard Court','HVAC System','VIP Lounge','Media Box','F&B Zone'],
 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800&auto=format&fit=crop',
 'https://maps.google.com/?q=Gachibowli+Indoor+Stadium+Hyderabad',
 '+91 40 2300 6789'),

(v_vmrda,
 'VMRDA Park Amphitheatre',
 'MVP Colony, Visakhapatnam - 530017',
 'Visakhapatnam', 'Andhra Pradesh', 'amphitheatre', 8000,
 ARRAY['Open Air Stage','Green Lawn','Coastal Views','F&B Stalls','Parking'],
 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=800&auto=format&fit=crop',
 'https://maps.google.com/?q=VMRDA+Park+Visakhapatnam',
 '+91 891 275 6890'),

(v_pwdg,
 'PWD Grounds',
 'PWD Complex, Governorpet, Vijayawada - 520002',
 'Vijayawada', 'Andhra Pradesh', 'open_air', 20000,
 ARRAY['Large Open Grounds','Stage Setup','Food Courts','Security'],
 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=800&auto=format&fit=crop',
 'https://maps.google.com/?q=PWD+Grounds+Vijayawada',
 '+91 866 257 1122'),

(v_ravindra,
 'Ravindra Bharathi Auditorium',
 'Himayatnagar, Hyderabad - 500029',
 'Hyderabad', 'Telangana', 'auditorium', 1200,
 ARRAY['Proscenium Stage','World-Class Acoustics','Orchestra Pit','Green Rooms','Heritage Building','AC'],
 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
 'https://maps.google.com/?q=Ravindra+Bharathi+Hyderabad',
 '+91 40 2322 3412'),

(v_ntr_stad,
 'NTR Stadium',
 'NTR Marg, Nagarjuna Nagar, Vijayawada - 520008',
 'Vijayawada', 'Andhra Pradesh', 'stadium', 25000,
 ARRAY['Cricket & Multi-Sport','Floodlights','VIP Stands','Parking','F&B'],
 'https://images.unsplash.com/photo-1540747913346-19212a4f4f61?q=80&w=800&auto=format&fit=crop',
 'https://maps.google.com/?q=NTR+Stadium+Vijayawada',
 '+91 866 257 4400'),

(v_shilpa,
 'Shilpakala Vedika',
 'Road No 12, Banjara Hills, Hyderabad - 500034',
 'Hyderabad', 'Telangana', 'auditorium', 3000,
 ARRAY['Multiple Halls','Banquet','Art Gallery','Outdoor Lawn','Catering','AC'],
 'https://images.unsplash.com/photo-1579762593175-20226054cad0?q=80&w=800&auto=format&fit=crop',
 'https://maps.google.com/?q=Shilpakala+Vedika+Hyderabad',
 '+91 40 2354 6781'),

(v_sap_vzg,
 'SAP Complex: Visakhapatnam',
 'Sports Authority of Andhra Pradesh, Mahindra Hills, Visakhapatnam - 530018',
 'Visakhapatnam', 'Andhra Pradesh', 'arena', 15000,
 ARRAY['Multi-Sport Facility','Swimming Pool','Indoor Courts','Accommodation','F&B'],
 'https://images.unsplash.com/photo-1504016798967-59a258a96615?q=80&w=800&auto=format&fit=crop',
 'https://maps.google.com/?q=SAP+Complex+Visakhapatnam',
 '+91 891 254 3300'),

(v_rk_beach,
 'RK Beach Grounds',
 'Beach Road, Ramakrishna Beach, Visakhapatnam - 530003',
 'Visakhapatnam', 'Andhra Pradesh', 'open_air', 50000,
 ARRAY['Beachfront','Open Air','Large Stage','Parking','Food Stalls'],
 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
 'https://maps.google.com/?q=RK+Beach+Visakhapatnam',
 '+91 891 278 5566'),

(v_novot_hyd,
 'Novotel Hyderabad Airport',
 'Rajiv Gandhi International Airport Road, Shamshabad, Hyderabad - 501218',
 'Hyderabad', 'Telangana', 'convention_centre', 3000,
 ARRAY['Airport Proximity','Conference Halls','Luxury Hotel','F&B','AV Equipment','Valet'],
 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
 'https://maps.google.com/?q=Novotel+Hyderabad+Airport',
 '+91 40 6659 0000');


-- ============================================================
-- 6. EVENTS (Concerts, Sports, Plays, Comedy, Festivals)
-- ============================================================
INSERT INTO public.events
  (id, title, description, image_url, banner_url, video_url, category, venue_id, venue_name, city, date, end_date, price_min, price_max, is_free, available_tickets, total_tickets, organizer, language, age_restriction, tags, status)
VALUES

-- ── CONCERTS ─────────────────────────────────────────────────

(ev_diljit,
 'Diljit Dosanjh: Dil-Luminati India Tour — Hyderabad',
 'The biggest Punjabi pop star on the planet brings his sold-out global stadium tour to Hyderabad! After breaking records at Madison Square Garden and the O2 Arena, Diljit performs 25+ hits including Born to Shine, GOAT, Lover, 5 Taara, and his latest chartbusters in a spectacular 3-hour concert with world-class pyrotechnics, LED stage and live band.',
 'https://upload.wikimedia.org/wikipedia/commons/4/41/Diljit_Dosanjh_at_Coachella_2023_cropped.jpg',
 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1400&auto=format&fit=crop',
 'https://www.youtube.com/watch?v=CunR2kN5TMg',
 'concert', v_hitex, 'Hitex Exhibition Centre, Hyderabad', 'Hyderabad',
 NOW()+'30 days', NOW()+'30 days 4 hours',
 1499, 6999, false, 2800, 25000,
 'OML Entertainment', 'Punjabi, Hindi', 'All Ages',
 ARRAY['Punjabi','Pop','Live Music','Bollywood','Stadium'],
 'active'),

(ev_arijit,
 'Arijit Singh Live — Vizag 2025',
 'India''s most beloved playback singer Arijit Singh performs an intimate 2.5-hour live concert on the stunning seafront of Visakhapatnam. Expect an emotionally charged evening of Tum Hi Ho, Channa Mereya, Ae Dil Hai Mushkil, Kesariya and 30+ more Bollywood anthems. Backed by a 40-piece live orchestra.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Arijit_singh.jpg/800px-Arijit_singh.jpg',
 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1400&auto=format&fit=crop',
 'https://www.youtube.com/watch?v=SzPfKEMxkfA',
 'concert', v_sap_vzg, 'SAP Complex, Visakhapatnam', 'Visakhapatnam',
 NOW()+'25 days', NOW()+'25 days 3 hours',
 999, 3999, false, 420, 8000,
 'District Entertainment Pvt Ltd', 'Hindi', 'All Ages',
 ARRAY['Bollywood','Romantic','Live Orchestra','Beach City'],
 'active'),

(ev_shankar,
 'Shankar Mahadevan: Breathless Live Concert',
 'Shankar Mahadevan — composer, singer, and legend — performs his most celebrated compositions live in Visakhapatnam, including his iconic Breathless, Dil Chahta Hai, Kal Ho Naa Ho, and works from the Lagaan and Lakshya soundtracks. A symphonic journey with 80 musicians that redefines live music in India.',
 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1400&auto=format&fit=crop',
 'https://www.youtube.com/watch?v=R7vne-KTXSY',
 'concert', v_vmrda, 'VMRDA Park Amphitheatre, Visakhapatnam', 'Visakhapatnam',
 NOW()+'20 days', NOW()+'20 days 3 hours',
 799, 2499, false, 1200, 5000,
 'Visakhapatnam Cultural Circle', 'Hindi, Telugu', 'All Ages',
 ARRAY['Bollywood','Symphonic','Legendary','Family'],
 'active'),

(ev_sunburn,
 'Sunburn Festival Hyderabad 2025',
 'India''s biggest electronic dance music festival returns! 4 stages. 30+ international DJs including Martin Garrix, Afrojack, Hardwell, and R3hab. 3 days of wall-to-wall EDM, interactive art installations, silent disco, VIP pool parties, and gourmet food courts at Hitex Exhibition Centre. India''s largest outdoor festival.',
 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1400&auto=format&fit=crop',
 'https://www.youtube.com/watch?v=YTdWkGSzPiA',
 'festival', v_hitex, 'Hitex Exhibition Centre, Hyderabad', 'Hyderabad',
 NOW()+'14 days', NOW()+'17 days',
 1999, 5999, false, 3500, 30000,
 'Percept Live Events', 'English', '18+',
 ARRAY['EDM','Festival','Dance','International DJs','Camping'],
 'active'),

-- ── SPORTS ───────────────────────────────────────────────────

(ev_ipl,
 'IPL 2025: Sunrisers Hyderabad vs Royal Challengers Bengaluru',
 'The Sunrisers Hyderabad — led by Pat Cummins and Travis Head — face the arch-rival Royal Challengers Bengaluru in what promises to be a cracker of a T20 encounter at the iconic Rajiv Gandhi International Stadium. With Virat Kohli and Rohit Sharma both in form, expect a match for the ages. 16 camera angles, giant LED screens, and 55,000 screaming fans!',
 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7c/Sunrisers_Hyderabad_Logo.svg/1200px-Sunrisers_Hyderabad_Logo.svg.png',
 'https://images.unsplash.com/photo-1540747913346-19212a4f4f61?q=80&w=1400&auto=format&fit=crop',
 'https://www.youtube.com/watch?v=CunR2kN5TMg',
 'sports', v_rgi_stad, 'Rajiv Gandhi International Cricket Stadium, Hyderabad', 'Hyderabad',
 NOW()+'7 days', NOW()+'7 days 5 hours',
 499, 5999, false, 2200, 55000,
 'Board of Control for Cricket in India (BCCI)', 'Hindi, Telugu, English', 'All Ages',
 ARRAY['IPL','Cricket','T20','SRH','RCB'],
 'active'),

(ev_badm,
 'Hyderabad Open Super 500 Badminton Championship',
 'World''s top-ranked shuttlers converge on Gachibowli Indoor Stadium for one of India''s premier badminton tournaments. Watch PV Sindhu, Lakshya Sen, HS Prannoy and international stars from South Korea, China and Denmark compete for the coveted trophy in 5 categories: Men''s Singles, Women''s Singles, Men''s Doubles, Women''s Doubles, and Mixed Doubles.',
 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1504016798967-59a258a96615?q=80&w=1400&auto=format&fit=crop',
 'https://www.youtube.com/watch?v=kTQg1_eNYV0',
 'sports', v_gac_stad, 'Gachibowli Indoor Stadium, Hyderabad', 'Hyderabad',
 NOW()+'12 days', NOW()+'14 days',
 199, 999, false, 5500, 10000,
 'Badminton Association of Telangana & BWF', 'Telugu, English', 'All Ages',
 ARRAY['Badminton','Shuttlers','PV Sindhu','BWF','Indoor Sports'],
 'active'),

(ev_chess,
 'FIDE Grand Prix Hyderabad 2025 — Magnus Carlsen & Praggnanandhaa',
 'Hyderabad hosts the prestigious FIDE Grand Prix featuring World Champion Magnus Carlsen (Norway), Fabiano Caruana (USA), Anish Giri (Netherlands), Vidit Gujrathi (India), and India''s teen prodigy Rameshbabu Praggnanandhaa. 9 rounds of classical chess, a simultaneous exhibition, and a masterclass session open to the public.',
 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1400&auto=format&fit=crop',
 'https://www.youtube.com/watch?v=placeholder_chess',
 'sports', v_novot_hyd, 'Novotel Hyderabad Airport', 'Hyderabad',
 NOW()+'5 days', NOW()+'15 days',
 199, 999, false, 250, 500,
 'All India Chess Federation & FIDE', 'English', 'All Ages',
 ARRAY['Chess','FIDE','Magnus Carlsen','Pragg','Grand Prix'],
 'active'),

(ev_kabaddi,
 'Pro Kabaddi League Season 11: Telugu Titans vs Jaipur Pink Panthers',
 'The Telugu Titans battle Jaipur Pink Panthers in a high-octane PKL clash at Gachibowli Indoor Stadium. Catch the raiders and defenders in blistering action in India''s fastest-growing contact sport. With world-class players from Iran, South Korea and India, PKL delivers non-stop entertainment for the whole family.',
 'https://images.unsplash.com/photo-1504016798967-59a258a96615?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1400&auto=format&fit=crop',
 'https://www.youtube.com/watch?v=placeholder_kabaddi',
 'sports', v_gac_stad, 'Gachibowli Indoor Stadium, Hyderabad', 'Hyderabad',
 NOW()+'9 days', NOW()+'9 days 3 hours',
 149, 799, false, 4000, 8000,
 'Mashal Sports Pvt Ltd (PKL)', 'Telugu, Hindi', 'All Ages',
 ARRAY['Kabaddi','PKL','Telugu Titans','Contact Sport'],
 'active'),

(ev_isl,
 'ISL 2025: Hyderabad FC vs ATK Mohun Bagan',
 'The Indian Super League comes alive at GMC Balayogi Stadium as Hyderabad FC take on the mighty ATK Mohun Bagan. A historic Indian football rivalry playing out under the floodlights of Hyderabad. An evening of passion, flair, and electrifying football with 40,000+ fans filling the stands.',
 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1540747913346-19212a4f4f61?q=80&w=1400&auto=format&fit=crop',
 'https://www.youtube.com/watch?v=placeholder_isl',
 'sports', v_gac_stad, 'GMC Balayogi Athletic Stadium, Hyderabad', 'Hyderabad',
 NOW()+'18 days', NOW()+'18 days 2 hours',
 299, 1499, false, 10000, 40000,
 'Football Sports Development Ltd (FSDL)', 'Telugu, Hindi, English', 'All Ages',
 ARRAY['Football','ISL','Hyderabad FC','Soccer','Night Match'],
 'active'),

-- ── PLAYS & THEATRE ──────────────────────────────────────────

(ev_ramayana,
 'Ramayana: The Epic — Spectacular Stage Drama',
 'A visually breathtaking theatrical production of the epic Ramayana, performed by 120 artists on a revolving stage at Ravindra Bharathi. Featuring authentic Kuchipudi-influenced choreography, original compositions by Grammy-nominated composer Ricky Kej, and state-of-the-art projection mapping that transforms the stage into Ayodhya, Lanka and Panchavati. 3 hours including intermission.',
 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1579762593175-20226054cad0?q=80&w=1400&auto=format&fit=crop',
 'https://www.youtube.com/watch?v=placeholder_ramayana',
 'play', v_ravindra, 'Ravindra Bharathi Auditorium, Hyderabad', 'Hyderabad',
 NOW()+'10 days', NOW()+'10 days 3 hours',
 299, 999, false, 320, 1200,
 'Mythri Stage Creations', 'Telugu', 'All Ages',
 ARRAY['Theatre','Classical','Ramayana','Mythology','Telugu'],
 'active'),

(ev_othello,
 'Othello in Telugu — Shakespeare at Its Best',
 'The Hyderabad Drama Club''s critically acclaimed production of Shakespeare''s Othello, reimagined in modern-day Hyderabad''s corporate world. A gripping tale of jealousy, manipulation, and betrayal performed with raw intensity by the city''s finest stage actors. Iago becomes the cunning office rival who destroys a great man from within.',
 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1400&auto=format&fit=crop',
 'https://www.youtube.com/watch?v=placeholder_othello',
 'play', v_ravindra, 'Ravindra Bharathi Auditorium, Hyderabad', 'Hyderabad',
 NOW()+'15 days', NOW()+'15 days 3 hours',
 199, 599, false, 780, 1200,
 'Hyderabad Drama Club', 'Telugu', '13+',
 ARRAY['Shakespeare','Drama','Telugu Theatre','Corporate','Classic'],
 'active'),

(ev_kuchipudi,
 'Kalyana Kuchipudi — Yamini Krishnamurthy Tribute Concert',
 'A grand gala of Kuchipudi classical dance honoring the legendary Padma Vibhushan Yamini Krishnamurthy. India''s finest Kuchipudi exponents — Bhavana Reddy, Raja-Radha Reddy and their students — perform rare compositions from the Kuchipudi Bhagavatam tradition in an electrifying 4-hour programme at Shilpakala Vedika.',
 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1400&auto=format&fit=crop',
 'https://www.youtube.com/watch?v=placeholder_kuchipudi',
 'play', v_shilpa, 'Shilpakala Vedika, Hyderabad', 'Hyderabad',
 NOW()+'22 days', NOW()+'22 days 4 hours',
 199, 799, false, 1500, 3000,
 'Kuchipudi Dance Academy Hyderabad', 'Telugu, Sanskrit', 'All Ages',
 ARRAY['Classical Dance','Kuchipudi','Heritage','Cultural','Telugu'],
 'active'),

-- ── COMEDY ───────────────────────────────────────────────────

(ev_vir,
 'Vir Das: World Tour — Hyderabad',
 'India''s first International Emmy Award-winning comedian Vir Das returns to Hyderabad with his brand-new global stand-up special. Two hours of razor-sharp political satire, deeply personal observations, and brilliant storytelling that had audiences in New York, London and Sydney in stitches. Not to be missed — his fastest-selling India show ever.',
 'https://images.unsplash.com/photo-1579762593175-20226054cad0?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?q=80&w=1400&auto=format&fit=crop',
 'https://www.youtube.com/watch?v=i9nqpHUSGqM',
 'comedy', v_hicc, 'HICC, Madhapur, Hyderabad', 'Hyderabad',
 NOW()+'10 days', NOW()+'10 days 2 hours',
 999, 2999, false, 350, 2500,
 'BookMyShow Live', 'English, Hindi', '16+',
 ARRAY['Stand-Up','Comedy','International Emmy','Vir Das','English'],
 'active'),

(ev_comedy,
 'Comicstaan Grand Finale Live — Hyderabad Edition',
 'Amazon Prime Video''s runaway hit comedy competition comes to Hyderabad for a live spectacular! All the season 5 finalists — Aakash Mehta, Kanan Gill, Biswa Kalyan Rath and celebrity guests — deliver a 3-hour comedy extravaganza. Audience voting determines the winner live on stage.',
 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1579762593175-20226054cad0?q=80&w=1400&auto=format&fit=crop',
 'https://www.youtube.com/watch?v=placeholder_comicstaan',
 'comedy', v_shilpa, 'Shilpakala Vedika, Hyderabad', 'Hyderabad',
 NOW()+'8 days', NOW()+'8 days 3 hours',
 499, 1499, false, 1200, 3000,
 'Amazon Entertainment India', 'Hindi, Telugu', '16+',
 ARRAY['Stand-Up','Comedy','Amazon Prime','Comicstaan','Live'],
 'active'),

-- ── FESTIVALS ────────────────────────────────────────────────

(ev_foodfest,
 'Vizag Food & Street Art Festival 2025',
 'A spectacular 5-day celebration of Visakhapatnam''s extraordinary food culture along the golden sands of RK Beach. 150+ stalls serve iconic local dishes — gongura mutton, Bamboo chicken, Vizag fish curry, puttu, garijelu — alongside craft beers, fusion food trucks, live cooking competitions, art installations by local artists, and live music stages. Free entry, ticketed F&B.',
 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1400&auto=format&fit=crop',
 'https://www.youtube.com/watch?v=placeholder_foodfest',
 'festival', v_rk_beach, 'RK Beach, Visakhapatnam', 'Visakhapatnam',
 NOW()+'3 days', NOW()+'8 days',
 0, 500, true, 25000, 50000,
 'VMRDA & Visakhapatnam Tourism', 'Telugu', 'All Ages',
 ARRAY['Food Festival','Street Food','Beach','Vizag','Family','Free Entry'],
 'active'),

(ev_artexpo,
 'Hyderabad Arts & Photography Expo 2025',
 'Three days of world-class art at the Hitex Convention Centre. Over 200 artists from 12 countries showcase paintings, digital art, installations, photography, and sculpture. Panel discussions on AI-generated art, photography workshops by National Geographic photographers, and auctions of rare works. A must-attend for art lovers.',
 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1400&auto=format&fit=crop',
 'https://www.youtube.com/watch?v=placeholder_artexpo',
 'exhibition', v_hitex, 'Hitex Exhibition Centre, Hyderabad', 'Hyderabad',
 NOW()+'20 days', NOW()+'23 days',
 199, 499, false, 8000, 15000,
 'Telangana State Council for Art', 'English, Telugu', 'All Ages',
 ARRAY['Art','Photography','Exhibition','International','Gallery'],
 'active'),

(ev_yoga,
 'International Yoga Day Festival — Hyderabad',
 'A massive open-air wellness festival at Hitex to mark International Yoga Day. 1000 yoga instructors, 50,000 participants, celebrity wellness coaches, Ayurveda consultations, organic food market, sound healing sessions, and a midnight meditation marathon. Presented by the Ministry of AYUSH and World Health Organization.',
 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1400&auto=format&fit=crop',
 'https://www.youtube.com/watch?v=placeholder_yoga',
 'workshop', v_hitex, 'Hitex Exhibition Centre, Hyderabad', 'Hyderabad',
 NOW()+'11 days', NOW()+'11 days 8 hours',
 0, 299, true, 40000, 50000,
 'Ministry of AYUSH, Govt of India', 'Telugu, Hindi, English', 'All Ages',
 ARRAY['Yoga','Wellness','Free','Family','Meditation','Health'],
 'active');


-- ============================================================
-- 7. FOOD ITEMS (Cinema F&B Menu)
-- ============================================================
INSERT INTO public.food_items
  (id, name, description, category, price, type, image_url, is_available, preparation_time_mins) VALUES

-- ── POPCORN ──────────────────────────────────────────────────
(gen_random_uuid(),
 'Classic Butter Popcorn — Large',
 'Freshly popped jumbo yellow corn kernels tossed in golden butter. Light, fluffy, and irresistibly addictive.',
 'Popcorn', 280, 'Veg',
 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?q=80&w=600&auto=format&fit=crop', true, 5),

(gen_random_uuid(),
 'Cheddar Cheese Popcorn — Large',
 'Premium popcorn drizzled with warm aged cheddar cheese sauce and smoked paprika.',
 'Popcorn', 320, 'Veg',
 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?q=80&w=600&auto=format&fit=crop', true, 5),

(gen_random_uuid(),
 'Caramel Crunch Popcorn — Medium',
 'Sweet golden caramelised sugar-coated popcorn with a satisfying crunch.',
 'Popcorn', 220, 'Veg',
 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop', true, 5),

(gen_random_uuid(),
 'Spicy Masala Popcorn — Large',
 'Bold yellow popcorn tossed in house-made masala blend with cumin, chilli, and chaat masala.',
 'Popcorn', 260, 'Veg',
 'https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?q=80&w=600&auto=format&fit=crop', true, 5),

-- ── SNACKS ───────────────────────────────────────────────────
(gen_random_uuid(),
 'Salsa Nachos',
 'Crispy corn tortilla chips with tangy tomato salsa, jalapeños, and cool sour cream.',
 'Snacks', 220, 'Veg',
 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?q=80&w=600&auto=format&fit=crop', true, 8),

(gen_random_uuid(),
 'Loaded Cheese Nachos',
 'Crunchy nachos smothered in warm jalapeño cheddar cheese dip with hot sauce drizzle.',
 'Snacks', 280, 'Veg',
 'https://images.unsplash.com/photo-1582169505937-b9992bd01ed9?q=80&w=600&auto=format&fit=crop', true, 8),

(gen_random_uuid(),
 'Crispy Aloo Samosa (2 pcs)',
 'Golden flaky pastry stuffed with spiced potato and peas. Served with mint chutney and tamarind sauce.',
 'Snacks', 120, 'Veg',
 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?q=80&w=600&auto=format&fit=crop', true, 7),

(gen_random_uuid(),
 'Masala Paneer Tikka Wrap',
 'Char-grilled paneer tikka with fresh veggies, mint chutney and crispy sev in a whole wheat tortilla.',
 'Snacks', 220, 'Veg',
 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=600&auto=format&fit=crop', true, 12),

(gen_random_uuid(),
 'Grilled Chicken Kathi Roll',
 'Spice-marinated chicken strips, sliced onions, and green chutney in a flaky maida paratha.',
 'Snacks', 280, 'Non-Veg',
 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop', true, 13),

(gen_random_uuid(),
 'Classic Beef Hot Dog',
 'Grilled sausage in a soft brioche bun with mustard, ketchup, and caramelised onions.',
 'Snacks', 280, 'Non-Veg',
 'https://images.unsplash.com/photo-1619740455993-9d621aa94e3c?q=80&w=600&auto=format&fit=crop', true, 10),

(gen_random_uuid(),
 'Margherita Pizza Slice',
 'Fresh mozzarella, San Marzano tomato sauce, and basil on a hand-tossed thin crust.',
 'Snacks', 180, 'Veg',
 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600&auto=format&fit=crop', true, 12),

(gen_random_uuid(),
 'Paneer Tikka Mini Bites (6 pcs)',
 'Bite-sized char-grilled paneer cubes with bell peppers, onions and smoky spices. Served with mint dip.',
 'Snacks', 240, 'Veg',
 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=600&auto=format&fit=crop', true, 10),

-- ── BEVERAGES ────────────────────────────────────────────────
(gen_random_uuid(),
 'Coca-Cola — Large (600ml)',
 'Ice-cold Coca-Cola poured over crushed ice. The eternal movie companion.',
 'Beverages', 150, 'Veg',
 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=600&auto=format&fit=crop', true, 2),

(gen_random_uuid(),
 'Pepsi — Large (600ml)',
 'Chilled Pepsi over ice. Bold, refreshing, and effervescent.',
 'Beverages', 150, 'Veg',
 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=600&auto=format&fit=crop', true, 2),

(gen_random_uuid(),
 'Alphonso Mango Juice (250ml)',
 'Real Alphonso mango pulp blended into a smooth chilled juice. India''s favourite.',
 'Beverages', 130, 'Veg',
 'https://images.unsplash.com/photo-1546173159-315724a31696?q=80&w=600&auto=format&fit=crop', true, 2),

(gen_random_uuid(),
 'Mineral Water (1L)',
 'Pure packaged mineral water — cool, clean, refreshing.',
 'Beverages', 50, 'Veg',
 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=600&auto=format&fit=crop', true, 1),

(gen_random_uuid(),
 'Masala Chai — Hot (300ml)',
 'Authentic Indian spiced tea with ginger, cardamom, cinnamon and crushed pepper. Brewed fresh.',
 'Beverages', 80, 'Veg',
 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=600&auto=format&fit=crop', true, 5),

(gen_random_uuid(),
 'Fresh Lime Soda',
 'Freshly squeezed lime, sparkling water, black salt and sugar. Choose sweet, salty or mixed.',
 'Beverages', 90, 'Veg',
 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&auto=format&fit=crop', true, 3),

-- ── DESSERTS ─────────────────────────────────────────────────
(gen_random_uuid(),
 'Warm Chocolate Fudge Brownie',
 'Rich gooey dark chocolate brownie served warm with vanilla ice cream and chocolate drizzle.',
 'Desserts', 220, 'Veg',
 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?q=80&w=600&auto=format&fit=crop', true, 5),

(gen_random_uuid(),
 'Butterscotch Sundae',
 'Creamy butterscotch ice cream, caramel drizzle, crushed praline, and a wafer.',
 'Desserts', 180, 'Veg',
 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=600&auto=format&fit=crop', true, 3),

(gen_random_uuid(),
 'Belgian Waffle with Nutella',
 'Golden crispy waffle smothered in warm Nutella, strawberry compote, and whipped cream.',
 'Desserts', 250, 'Veg',
 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?q=80&w=600&auto=format&fit=crop', true, 8),

-- ── COMBOS ───────────────────────────────────────────────────
(gen_random_uuid(),
 'Couple Movie Combo',
 '1 Large Butter Popcorn + 2 Large Coca-Colas. Perfect for two!',
 'Combos', 520, 'Veg',
 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?q=80&w=600&auto=format&fit=crop', true, 7),

(gen_random_uuid(),
 'Mega Family Feast',
 '2 Large Butter Popcorns + Loaded Nachos + 4 Large Soft Drinks. The ultimate family snack pack!',
 'Combos', 1080, 'Veg',
 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?q=80&w=600&auto=format&fit=crop', true, 10),

(gen_random_uuid(),
 'Non-Veg Movie Combo',
 '1 Chicken Kathi Roll + 1 Beef Hot Dog + 2 Large Pepsis.',
 'Combos', 680, 'Non-Veg',
 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop', true, 15),

(gen_random_uuid(),
 'Solo Snack Pack',
 '1 Medium Popcorn + 1 Large Soft Drink + 1 Samosa. Great value for one!',
 'Combos', 380, 'Veg',
 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?q=80&w=600&auto=format&fit=crop', true, 7);


-- ============================================================
-- 8. PROMO CODES
-- ============================================================
INSERT INTO public.promo_codes
  (code, title, description, discount_type, discount_value, min_order_amount, max_discount, valid_from, valid_until, usage_limit, is_active, applicable_to) VALUES

('FIRSTSHOW',
 'First Booking Offer',
 'Get flat 20% off on your very first movie booking on GrabAticket. Welcome to the experience!',
 'percentage', 20, 200, 150, NOW(), NOW()+'90 days', 1000, true, 'movies'),

('WEEKEND50',
 'Weekend Special — Flat ₹50 Off',
 'Book any movie this weekend (Sat-Sun) and get ₹50 instantly off. No minimum required!',
 'fixed', 50, 0, 50, NOW(), NOW()+'30 days', 5000, true, 'movies'),

('IMAX100',
 'IMAX Experience Discount',
 'Flat ₹100 off on IMAX movie tickets. Experience cinema the way it was meant to be seen.',
 'fixed', 100, 400, 100, NOW(), NOW()+'60 days', 2000, true, 'movies'),

('COUPLES2025',
 'Couples Date Night',
 'Book 2 or more tickets and get 15% off. Perfect for your movie date!',
 'percentage', 15, 500, 200, NOW(), NOW()+'60 days', 3000, true, 'movies'),

('SRHDOMINATES',
 'SRH vs RCB IPL Special',
 'Flat 10% off on all IPL match tickets. Orange Army — fill up Uppal!',
 'percentage', 10, 500, 300, NOW(), NOW()+'8 days', 10000, true, 'sports'),

('DILJIT20',
 'Dil-Luminati Early Bird',
 '20% off on all Diljit Dosanjh concert passes. Early bird offer — valid for limited time only!',
 'percentage', 20, 1000, 500, NOW(), NOW()+'15 days', 2000, true, 'events'),

('CONCERTLIVE',
 'Live Concert Offer',
 '₹150 off on any concert ticket above ₹1000. Feel the music, feel the vibe!',
 'fixed', 150, 1000, 150, NOW(), NOW()+'45 days', 3000, true, 'events'),

('FOODIE30',
 'Foodie Special — 30% Off F&B',
 '30% off on all cinema food orders. Munch away without the guilt!',
 'percentage', 30, 200, 200, NOW(), NOW()+'30 days', 8000, true, 'food'),

('COMBOKING',
 'Combo King Offer',
 'Flat ₹80 off when you order any combo meal. The smart way to snack at the movies.',
 'fixed', 80, 400, 80, NOW(), NOW()+'45 days', 5000, true, 'food'),

('NEWUSER',
 'New User Special',
 'Welcome to GrabAticket! Flat ₹100 off on your first order of any category.',
 'fixed', 100, 200, 100, NOW(), NOW()+'365 days', NULL, true, 'all'),

('SUNBURN25',
 'Sunburn Festival Offer',
 '25% off on all Sunburn Festival passes. Dance all night — save some cash!',
 'percentage', 25, 2000, 1000, NOW(), NOW()+'14 days', 5000, true, 'events'),

('STAGEFRONT',
 'Theatre & Plays — 15% Off',
 '15% off on all stage play and theatre event tickets. Culture never goes out of style.',
 'percentage', 15, 300, 150, NOW(), NOW()+'60 days', 2000, true, 'plays'),

('STUDENT20',
 'Student Discount — 20% Off',
 '20% off for students on weekday matinee shows. Show your college ID at the counter.',
 'percentage', 20, 150, 100, NOW(), NOW()+'120 days', 10000, true, 'movies'),

('HDFC15',
 'HDFC Credit Card Offer',
 'Pay with HDFC credit card and get flat 15% off (max ₹300) on all bookings.',
 'percentage', 15, 400, 300, NOW(), NOW()+'90 days', NULL, true, 'all'),

('SBIUPI10',
 'SBI UPI Cashback',
 '10% instant cashback (max ₹100) when you pay via SBI UPI. Powered by BHIM SBI Pay.',
 'percentage', 10, 200, 100, NOW(), NOW()+'90 days', NULL, true, 'all');


-- ============================================================
-- 9. SPOTLIGHTS (Homepage Hero Banners)
-- ============================================================
INSERT INTO public.spotlights
  (title, subtitle, description, image_url, cta_label, link, category, active, priority) VALUES

('Pushpa 2: The Rule',
 'Now Showing in IMAX · Telugu · Hindi · Tamil',
 'Allu Arjun in the most powerful performance of his career. Book IMAX tickets before they sell out!',
 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1600&auto=format&fit=crop',
 'Book Tickets', '/movies', 'movie', true, 1),

('Diljit Dosanjh: Dil-Luminati Tour',
 'Stadium Concert · Hyderabad · 30 Days Away',
 'The world''s biggest Punjabi pop star live in Hyderabad! Early bird tickets at 20% off.',
 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1600&auto=format&fit=crop',
 'Get Passes', '/events', 'concert', true, 2),

('IPL 2025: SRH vs RCB',
 'T20 Cricket · Rajiv Gandhi Stadium · Limited Seats!',
 'The biggest rivalry in Indian cricket. Orange Army vs Red Army — 55,000 fans. Don''t miss it!',
 'https://images.unsplash.com/photo-1540747913346-19212a4f4f61?q=80&w=1600&auto=format&fit=crop',
 'Book Seats', '/events', 'sports', true, 3),

('Kalki 2898 AD',
 'Now Showing · Sci-Fi Epic · Prabhas · Deepika · Amitabh',
 'India''s most ambitious sci-fi mythology film. Witness the future of Indian cinema in IMAX.',
 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?q=80&w=1600&auto=format&fit=crop',
 'Book Now', '/movies', 'movie', true, 4),

('Sunburn Festival Hyderabad',
 '3-Day EDM Festival · 30+ International DJs',
 'Martin Garrix, Afrojack & Hardwell in Hyderabad! India''s biggest music festival — book now!',
 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1600&auto=format&fit=crop',
 'Get Passes', '/events', 'concert', true, 5),

('SSMB29 — Coming Soon',
 'Mahesh Babu × SS Rajamouli · 2026',
 'The most awaited Telugu film ever made is coming. Register interest and get early access!',
 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600&auto=format&fit=crop',
 'Notify Me', '/movies', 'movie', true, 6),

('Ramayana: The Epic — Stage Drama',
 'Spectacular Theatre · Ravindra Bharathi · 120 Artists',
 'Experience the greatest story ever told, reimagined on stage with Kuchipudi dance and live orchestra.',
 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1600&auto=format&fit=crop',
 'Book Now', '/events', 'play', true, 7),

('Weekend Offer: ₹50 Off All Movies!',
 'Use Code: WEEKEND50 · Valid Sat-Sun',
 'Grab your favourite seats at a discount this weekend. Limited time offer — book before midnight!',
 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1600&auto=format&fit=crop',
 'Book & Save', '/movies', 'discount', true, 8);


-- ============================================================
-- 10. ANNOUNCEMENTS (App Notification Bar)
-- ============================================================
INSERT INTO public.announcements
  (title, content, icon_type, color_from, color_to, link, link_label, priority, is_active) VALUES

('🔥 Pushpa 2 IMAX Sells Out Every Night!',
 'Extra IMAX shows added at AMB Gachibowli for this weekend. Seats are going fast — book now to avoid disappointment.',
 'film', '#FF6B35', '#FF3E3E', '/movies', 'Book IMAX', 1, true),

('🎵 Diljit Dosanjh Hyderabad — Early Bird Ends Tomorrow!',
 '20% early bird discount on Dil-Luminati Stadium Tour passes expires at midnight. Use code DILJIT20.',
 'music', '#7C3AED', '#4F46E5', '/events', 'Get Passes', 2, true),

('🏏 IPL SRH vs RCB Tickets — Only 2,200 Left!',
 'Premium stand tickets are nearly gone. Orange Army — secure your seats for the biggest match of the season!',
 'sports', '#F59E0B', '#EF4444', '/events', 'Book Now', 3, true),

('🍿 30% Off All Cinema Food Today!',
 'Use code FOODIE30 for 30% off your entire F&B order at any GrabAticket cinema. Valid today only!',
 'food', '#10B981', '#059669', '/food', 'Order Food', 4, true),

('🎭 Ramayana Stage Drama — Last Few Tickets!',
 'The sold-out theatrical production of Ramayana at Ravindra Bharathi. Only 320 tickets remain for the opening night.',
 'theatre', '#EC4899', '#F43F5E', '/events', 'Book Tickets', 5, true);

END $$;
