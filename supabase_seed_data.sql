-- Seed Movies
INSERT INTO public.movies (title, description, poster_url, banner_url, duration_minutes, language, genre, rating, release_date, status) VALUES
(
    'Devara: Part 1',
    'Devara, a fearless man from a coastal region, embarks on a perilous journey to safeguard his people. His legacy is passed down to his timid son, who must overcome his fears to reclaim his land.',
    'https://image.tmdb.org/t/p/w500/A7EByudX0eOzlkQ2FIbogzyazm2.jpg',
    'https://image.tmdb.org/t/p/original/tElnmtQ6yz1PjN1kePNl8yMSb59.jpg',
    178,
    'Telugu',
    'Action, Drama',
    'UA',
    '2024-09-27',
    'now_showing'
),
(
    'Kalki 2898 AD',
    'A modern-day avatar of Vishnu, a Hindu god, who is believed to have descended to earth to protect the world from evil forces.',
    'https://image.tmdb.org/t/p/w500/aglIcconeZ0SRV1MaDCAP0c8koR.jpg',
    'https://image.tmdb.org/t/p/original/9fqN0HPM7QeFcfjI5cPQ8K2tFhM.jpg',
    180,
    'Telugu',
    'Sci-Fi, Action',
    'UA',
    '2024-06-27',
    'now_showing'
),
(
    'Guntur Kaaram',
    'The king of the underworld in Guntur falls for a journalist working to expose the illegal activities in the city.',
    'https://image.tmdb.org/t/p/w500/y6M0lB9jW6hOq8V6a8K8M5Z6.jpg',
    'https://image.tmdb.org/t/p/original/4MCKNAc6AbWjUhM5yVexccyWk.jpg',
    159,
    'Telugu',
    'Action, Masala',
    'UA',
    '2024-01-12',
    'now_showing'
),
(
    'Pushpa 2: The Rule',
    'Pushpa Raj continues his quest for dominance in the red sandalwood smuggling world, facing new enemies and challenges.',
    'https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg',
    'https://image.tmdb.org/t/p/original/6oH378KUfCEitzJkm07r97L0ACZ.jpg',
    165,
    'Telugu',
    'Action, Thriller',
    'A',
    '2024-08-15',
    'coming_soon'
),
(
    'Game Changer',
    'An honest IAS officer tries to bring change to the political system by battling corrupt politicians.',
    'https://image.tmdb.org/t/p/w500/vWk602rZ8H8M8h0.jpg',
    'https://image.tmdb.org/t/p/original/b8M7K8M8h0.jpg',
    170,
    'Telugu',
    'Political, Action',
    'UA',
    '2024-09-01',
    'coming_soon'
);

-- Seed Events (Linking to Districts via Subqueries)

-- Visakhapatnam Events
INSERT INTO public.events (title, description, image_url, date, end_date, venue, category, price, is_free, available_tickets, total_tickets, organizer, district_id)
SELECT 
    'Vizag Beach Festival',
    'A grand celebration of music, food, and culture on the shores of RK Beach. Feautring local bands and seafood stalls.',
    'https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?auto=format&fit=crop&q=80&w=1000',
    NOW() + INTERVAL '5 days',
    NOW() + INTERVAL '5 days' + INTERVAL '6 hours',
    'RK Beach, Visakhapatnam',
    'Festival',
    0,
    true,
    1000,
    1000,
    'Vizag Tourism Board',
    id
FROM public.districts WHERE name = 'Visakhapatnam';

INSERT INTO public.events (title, description, image_url, date, end_date, venue, category, price, available_tickets, total_tickets, organizer, district_id)
SELECT 
    'Comedy Night with Sunil',
    'An evening of laughter with famous comedians. Stand-up comedy special.',
    'https://images.unsplash.com/photo-1585699321351-92b46ce6b1da?auto=format&fit=crop&q=80&w=1000',
    NOW() + INTERVAL '10 days',
    NOW() + INTERVAL '10 days' + INTERVAL '3 hours',
    'Gurajada Kalakshetram',
    'Comedy',
    499.00,
    200,
    200,
    'Laugh Out Loud Events',
    id
FROM public.districts WHERE name = 'Visakhapatnam';

-- Vijayawada Events
INSERT INTO public.events (title, description, image_url, date, end_date, venue, category, price, available_tickets, total_tickets, organizer, district_id)
SELECT 
    'Vijayawada Food Expo',
    'Taste the best cuisines from across Andhra Pradesh. Stall varieties include spicy non-veg to traditional sweets.',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1000',
    NOW() + INTERVAL '7 days',
    NOW() + INTERVAL '9 days',
    'PVP Square Ground',
    'Food',
    100.00,
    500,
    500,
    'AP Food Association',
    id
FROM public.districts WHERE name = 'Vijayawada';

INSERT INTO public.events (title, description, image_url, date, end_date, venue, category, price, available_tickets, total_tickets, organizer, district_id)
SELECT 
    'Tech Summit 2024',
    'A gathering of tech enthusiasts, startups, and innovators discussing the future of AI and Web3.',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000',
    NOW() + INTERVAL '15 days',
    NOW() + INTERVAL '15 days' + INTERVAL '8 hours',
    'Convention Center, Vijayawada',
    'Technology',
    1500.00,
    150,
    150,
    'Tech Connect',
    id
FROM public.districts WHERE name = 'Vijayawada';

-- Tirupati Events
INSERT INTO public.events (title, description, image_url, date, end_date, venue, category, price, available_tickets, total_tickets, organizer, district_id)
SELECT 
    'Devotional Music Concert',
    'Classical Carnatic music performance by renowned artists.',
    'https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&q=80&w=1000',
    NOW() + INTERVAL '3 days',
    NOW() + INTERVAL '3 days' + INTERVAL '4 hours',
    'Mahati Auditorium',
    'Music',
    200.00,
    300,
    300,
    'Tirupati Cultural Wing',
    id
FROM public.districts WHERE name = 'Tirupati';

-- Amaravathi Events
INSERT INTO public.events (title, description, image_url, date, end_date, venue, category, price, is_free, available_tickets, total_tickets, organizer, district_id)
SELECT 
    'Amaravathi Marathon',
    'Run for a greener city. 5K and 10K run.',
    'https://images.unsplash.com/photo-1552674605-46955594a279?auto=format&fit=crop&q=80&w=1000',
    NOW() + INTERVAL '20 days',
    NOW() + INTERVAL '20 days' + INTERVAL '4 hours',
    'Seed Access Road',
    'Sports',
    0,
    true,
    2000,
    2000,
    'Amaravathi Runners Club',
    id
FROM public.districts WHERE name = 'Amaravathi';
