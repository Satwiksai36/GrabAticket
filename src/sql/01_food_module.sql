-- Safely create types
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'food_category') THEN
        CREATE TYPE food_category AS ENUM ('Popcorn', 'Beverages', 'Combos', 'Snacks', 'Desserts', 'Regional');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'food_type') THEN
        CREATE TYPE food_type AS ENUM ('Veg', 'Non-Veg', 'Egg', 'Vegan');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
        CREATE TYPE order_status AS ENUM ('Pending', 'Preparing', 'Ready', 'Delivered');
    END IF;
END$$;

-- Safely create tables
CREATE TABLE IF NOT EXISTS food_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  type TEXT CHECK (type IN ('Veg', 'Non-Veg', 'Egg', 'Vegan')) DEFAULT 'Veg',
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  preparation_time_mins INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS booking_food_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  food_item_id UUID REFERENCES food_items(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  price_at_booking DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('Pending', 'Preparing', 'Ready', 'Delivered')) DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recreate View
DROP VIEW IF EXISTS kitchen_orders;
CREATE VIEW kitchen_orders AS
SELECT 
  bfi.id as item_id,
  bfi.booking_id,
  b.id as booking_reference,
  b.seats,
  b.venue,
  b.time as show_time,
  fi.name as food_name,
  fi.category,
  bfi.quantity,
  bfi.status,
  bfi.created_at
FROM booking_food_items bfi
JOIN bookings b ON bfi.booking_id = b.id
JOIN food_items fi ON bfi.food_item_id = fi.id
ORDER BY bfi.created_at DESC;

-- Enable RLS
ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_food_items ENABLE ROW LEVEL SECURITY;

-- Host policies safely
DO $$
BEGIN
    -- Food Items Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'food_items' AND policyname = 'Public items are viewable by everyone') THEN
        CREATE POLICY "Public items are viewable by everyone" ON food_items FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'food_items' AND policyname = 'Admins can manage food items') THEN
        CREATE POLICY "Admins can manage food items" ON food_items USING (auth.jwt() ->> 'role' = 'admin');
    END IF;

    -- Booking Food Items Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'booking_food_items' AND policyname = 'Users can insert booking food items') THEN
        CREATE POLICY "Users can insert booking food items" ON booking_food_items FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM bookings WHERE id = booking_id));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'booking_food_items' AND policyname = 'Users can view own booking food items') THEN
        CREATE POLICY "Users can view own booking food items" ON booking_food_items FOR SELECT USING (auth.uid() = (SELECT user_id FROM bookings WHERE id = booking_id));
    END IF;
END$$;

-- Safely add to realtime
DO $$
BEGIN
  BEGIN
    alter publication supabase_realtime add table booking_food_items;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
END$$;

-- Sample Data (Clean insert)
DELETE FROM food_items WHERE name IN (
  'Classic Salted Popcorn', 'Cheese Popcorn', 'Caramel Popcorn', 
  'Coca Cola (Large)', 'Iced Tea (Lemon)', 'Mineral Water',
  'Couple Combo', 'Family Feast', 'Kids Meal',
  'Nachos with Cheese', 'Chicken Nuggets (6pcs)', 'Peri Peri Fries', 'Chicken Popcorn',
  'Choco Lava Cake', 'Magnum Ice Cream'
);

INSERT INTO food_items (name, description, category, price, type, image_url, preparation_time_mins) VALUES
-- Popcorn
('Classic Salted Popcorn', 'Freshly popped buttery salted popcorn, the classic movie companion.', 'Popcorn', 250.00, 'Veg', 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&q=80&w=800', 5),
('Cheese Popcorn', 'Crunchy popcorn coated with premium cheddar cheese powder.', 'Popcorn', 280.00, 'Veg', 'https://images.unsplash.com/photo-1612240955688-6627d0c35697?q=80&w=1780&auto=format&fit=crop', 5),
('Caramel Popcorn', 'Sweet and crunchy gourmet popcorn glazed with rich caramel.', 'Popcorn', 300.00, 'Veg', 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?auto=format&fit=crop&q=80&w=800', 5),

-- Beverages
('Coca Cola (Large)', 'Chilled refreshing large Coke (500ml).', 'Beverages', 180.00, 'Veg', 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800', 2),
('Iced Tea (Lemon)', 'Cool and zesty lemon iced tea.', 'Beverages', 150.00, 'Veg', 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&q=80&w=800', 3),
('Mineral Water', 'Premium packaged drinking water.', 'Beverages', 60.00, 'Veg', 'https://images.unsplash.com/photo-1564419320496-026045053171?auto=format&fit=crop&q=80&w=800', 1),

-- Combos
('Couple Combo', '2 Regular Popcorn + 2 Cokes. Perfect for a date!', 'Combos', 750.00, 'Veg', 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&q=80&w=800', 8),
('Family Feast', '2 Large Popcorns + Nachos + 4 Beverages.', 'Combos', 1200.00, 'Veg', 'https://images.unsplash.com/photo-1658428236113-d3bf30f0f37f?q=80&w=2070&auto=format&fit=crop', 12),
('Kids Meal', 'Small Caramel Popcorn + Fruit Juice + Toy.', 'Combos', 350.00, 'Veg', 'https://plus.unsplash.com/premium_photo-1675252369719-dd52bc69c3df?auto=format&fit=crop&q=80&w=800', 5),

-- Snacks
('Nachos with Cheese', 'Crispy tortilla chips served with warm jalapeño cheese dip.', 'Snacks', 240.00, 'Veg', 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&q=80&w=800', 8),
('Chicken Nuggets (6pcs)', 'Crispy fried chicken nuggets served with ketchup and mayo.', 'Snacks', 220.00, 'Non-Veg', 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80&w=800', 10),
('Peri Peri Fries', 'Spicy seasoned golden french fries.', 'Snacks', 180.00, 'Veg', 'https://images.unsplash.com/photo-1630384060421-a4323ce56d46?auto=format&fit=crop&q=80&w=800', 8),
('Chicken Popcorn', 'Bite-sized crispy chicken pieces seasoned with spices.', 'Snacks', 260.00, 'Non-Veg', 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=800', 10),

-- Desserts
('Choco Lava Cake', 'Warm molten chocolate cake with a gooey center.', 'Desserts', 190.00, 'Veg', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476d?auto=format&fit=crop&q=80&w=800', 12),
('Magnum Ice Cream', 'Rich Belgian chocolate coated vanilla ice cream stick.', 'Desserts', 150.00, 'Veg', 'https://images.unsplash.com/photo-1516559121162-d310674dedfe?auto=format&fit=crop&q=80&w=800', 2);
