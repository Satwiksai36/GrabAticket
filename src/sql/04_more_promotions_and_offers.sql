-- More Promotions and Announcements Seed Data
-- Run this in your Supabase SQL Editor to populate the database with these new offers

DO $$
BEGIN
    -- ==================================================================================
    -- PROMOTIONS
    -- ==================================================================================

    INSERT INTO promotions (code, discount_type, discount_value, description, start_date, end_date) VALUES
    ('STUDENT25', 'percentage', 25, 'Student Special: Get 25% off on weekdays with valid ID card', NOW(), NOW() + INTERVAL '1 year'),
    ('CITI30', 'percentage', 30, 'Exclusive 30% off for Citi Bank Card holders this month', NOW(), NOW() + INTERVAL '3 months'),
    ('FAMILYFUN', 'percentage', 15, 'Family Fun Pack: Get 15% off when you book 4 or more tickets together', NOW(), NOW() + INTERVAL '6 months'),
    ('WELCOME100', 'flat', 100, 'Welcome Offer: Flat Rs. 100 off on your first booking', NOW(), NOW() + INTERVAL '30 days')
    ON CONFLICT (code) DO NOTHING;

    -- ==================================================================================
    -- ANNOUNCEMENTS
    -- ==================================================================================

    INSERT INTO announcements (title, content, icon_type, color_from, color_to, priority, is_active) VALUES
    ('New 4DX Experience', 'Feel the movie with our new 4DX screens at PVR Vizag.', 'Zap', '#ff512f', '#dd2476', 2, true),
    ('Midnight Shows', 'Midnight shows now open for SSMB29. Book seats now!', 'Star', '#0f2027', '#203a43', 3, true),
    ('Win Meet & Greet', 'Book tickets for "OG" and stand a chance to meet Pawan Kalyan.', 'Trophy', '#F2994A', '#F2C94C', 5, true)
    ON CONFLICT DO NOTHING;
    
    RAISE NOTICE 'Additional promotions and announcements have been added.';

END $$;
