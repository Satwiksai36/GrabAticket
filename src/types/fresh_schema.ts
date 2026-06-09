// TypeScript Interfaces for Fresh Application Database Schema

export interface SeatLayout {
  id: string;
  name: string;
  type: string; // 'theatre', 'bus', etc.
  rows: number;
  columns: number;
  total_seats: number;
  layout_config: any; // JSON configuration of rows and seats
  created_at?: string;
  updated_at?: string;
}

export interface Movie {
  id: string;
  title: string;
  description?: string;
  poster_url?: string;
  banner_url?: string;
  trailer_url?: string;
  duration_minutes?: number;
  language?: string;
  genre?: string;
  rating?: string;
  release_date?: string;
  status: 'now_showing' | 'coming_soon' | 'ended';
  created_at?: string;
}

export interface Theatre {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  facilities?: string[];
  city: string;
  seat_layout_id?: string;
  created_at?: string;
}

export interface Show {
  id: string;
  movie_id: string;
  theatre_id: string;
  show_time: string;
  price: number;
  format?: string; // '2D', '3D', 'IMAX'
  available_seats: number;
  total_seats: number;
  status: 'available' | 'filling_fast' | 'sold_out';
  seat_layout_id?: string;
  created_at?: string;
}

export interface Profile {
  id: string;
  user_id: string; // Decoupled auth identifier
  full_name?: string;
  phone?: string;
  city?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Booking {
  id: string;
  user_id: string; // Decoupled auth identifier
  booking_type: 'movie' | 'food_only' | 'other';
  reference_id?: string; // Show ID or other entity reference
  title: string;
  venue: string;
  date: string;
  time: string;
  quantity: number;
  seats?: string[] | null;
  amount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  qr_code?: string;
  payment_method?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  description?: string;
  category: string; // 'Popcorn', 'Beverages', 'Combos', etc.
  price: number;
  type: 'Veg' | 'Non-Veg' | 'Egg' | 'Vegan';
  image_url?: string;
  is_available: boolean;
  preparation_time_mins?: number;
  created_at?: string;
  updated_at?: string;
}

export interface BookingFoodItem {
  id: string;
  booking_id: string;
  food_item_id: string;
  quantity: number;
  price_at_booking: number;
  status: 'Pending' | 'Preparing' | 'Ready' | 'Delivered';
  created_at?: string;
}
