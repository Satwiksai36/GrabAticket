import { supabase } from '@/integrations/supabase/client';
import type { 
  Movie, 
  Theatre, 
  Show, 
  SeatLayout, 
  Profile, 
  Booking, 
  FoodItem, 
  BookingFoodItem 
} from '@/types/fresh_schema';

// ==========================================
// MOVIES API
// ==========================================

export const getMovies = async (status?: Movie['status']): Promise<Movie[]> => {
  let query = supabase.from('movies').select('*');
  if (status) {
    query = query.eq('status', status);
  }
  const { data, error } = await query.order('release_date', { ascending: false });
  if (error) throw error;
  return data as Movie[];
};

export const getMovieById = async (id: string): Promise<Movie> => {
  const { data, error } = await supabase.from('movies').select('*').eq('id', id).single();
  if (error) throw error;
  return data as Movie;
};

// ==========================================
// THEATRES API
// ==========================================

export const getTheatresByCity = async (city: string): Promise<Theatre[]> => {
  const { data, error } = await supabase
    .from('theatres')
    .select('*')
    .eq('city', city)
    .order('name');
  if (error) throw error;
  return data as Theatre[];
};

// ==========================================
// SHOWS API
// ==========================================

export const getShowsForMovie = async (movieId: string, dateStr?: string): Promise<Show[]> => {
  let query = supabase.from('shows').select('*, movie:movies(*), theatre:theatres(*)').eq('movie_id', movieId);
  // Optional date filtering logic would go here
  const { data, error } = await query.order('show_time');
  if (error) throw error;
  return data as any[];
};

export const getShowDetails = async (showId: string): Promise<Show & { movie: Movie; theatre: Theatre; layout?: SeatLayout }> => {
  const { data, error } = await supabase
    .from('shows')
    .select('*, movie:movies(*), theatre:theatres(*), seat_layout:seat_layouts(*)')
    .eq('id', showId)
    .single();
  if (error) throw error;
  return data as any;
};

// ==========================================
// FOOD ITEMS API
// ==========================================

export const getAvailableFoodItems = async (): Promise<FoodItem[]> => {
  const { data, error } = await supabase
    .from('food_items')
    .select('*')
    .eq('is_available', true)
    .order('category');
  if (error) throw error;
  return data as FoodItem[];
};

// ==========================================
// PROFILES API
// ==========================================

export const getUserProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data as Profile | null;
};

export const upsertUserProfile = async (profile: Omit<Profile, 'id'> & { id?: string }): Promise<Profile> => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile)
    .select()
    .single();
  if (error) throw error;
  return data as Profile;
};

// ==========================================
// BOOKINGS API (With Linked Food Items)
// ==========================================

export interface CreateBookingInput {
  userId: string;
  bookingType: Booking['booking_type'];
  referenceId?: string;
  title: string;
  venue: string;
  date: string;
  time: string;
  quantity: number;
  seats?: string[] | null;
  amount: number;
  paymentMethod?: string;
  foodItems?: { foodItemId: string; quantity: number; priceAtBooking: number }[];
}

export const createBooking = async (input: CreateBookingInput): Promise<Booking> => {
  // 1. Insert Core Booking
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      user_id: input.userId,
      booking_type: input.bookingType,
      reference_id: input.referenceId,
      title: input.title,
      venue: input.venue,
      date: input.date,
      time: input.time,
      quantity: input.quantity,
      seats: input.seats,
      amount: input.amount,
      status: 'confirmed',
      payment_method: input.paymentMethod,
      qr_code: `QR_${input.userId.substring(0, 8)}_${Date.now()}`
    })
    .select()
    .single();

  if (bookingError) throw bookingError;

  // 2. Insert Associated Food Items (if any)
  if (input.foodItems && input.foodItems.length > 0 && booking) {
    const foodItemsPayload = input.foodItems.map(item => ({
      booking_id: booking.id,
      food_item_id: item.foodItemId,
      quantity: item.quantity,
      price_at_booking: item.priceAtBooking,
      status: 'Pending'
    }));

    const { error: foodError } = await supabase
      .from('booking_food_items')
      .insert(foodItemsPayload);

    if (foodError) throw foodError;
  }

  // 3. Update Show seats dynamically if booking was for a movie
  if (input.bookingType === 'movie' && input.referenceId && input.seats) {
    try {
      const showId = input.referenceId;
      const bookedCount = input.seats.length;
      
      // First fetch current seats
      const { data: show } = await supabase
        .from('shows')
        .select('available_seats')
        .eq('id', showId)
        .single();
        
      if (show) {
        const newAvailable = Math.max(0, show.available_seats - bookedCount);
        await supabase
          .from('shows')
          .update({ available_seats: newAvailable })
          .eq('id', showId);
      }
    } catch (updateErr) {
      console.error('Failed to update show available seats:', updateErr);
      // Don't fail the whole transaction if this counter update fails
    }
  }

  return booking as Booking;
};

export const getUserBookings = async (userId: string): Promise<(Booking & { food_items?: BookingFoodItem[] })[]> => {
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (bookingsError) throw bookingsError;
  if (!bookings || bookings.length === 0) return [];

  // Fetch food items for all these bookings in one batch query
  const bookingIds = bookings.map(b => b.id);
  const { data: foodItems, error: foodError } = await supabase
    .from('booking_food_items')
    .select('*, food_item:food_items(*)')
    .in('booking_id', bookingIds);

  if (foodError) throw foodError;

  // Map food items back to their parent bookings
  return bookings.map(booking => {
    const associatedFood = foodItems?.filter(fi => fi.booking_id === booking.id) || [];
    return {
      ...booking,
      food_items: associatedFood
    };
  }) as any[];
};
