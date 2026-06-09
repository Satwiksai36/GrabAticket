import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Booking {
  id: string;
  user_id: string;
  booking_type: 'movie' | 'event' | 'venue';
  reference_id: string;
  title: string;
  venue: string;
  date: string;
  time: string;
  quantity: number;
  seats: string[] | null;
  amount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  qr_code: string | null;
  payment_method: string | null;
  created_at: string;
  updated_at: string;
  theatre_id?: string;
}

export interface CreateBookingInput {
  booking_type: 'movie' | 'event' | 'venue';
  reference_id: string;
  title: string;
  venue: string;
  date: string;
  time: string;
  quantity: number;
  seats?: string[];
  amount: number;
  payment_method?: string;
}

export const useBookings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['bookings', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Booking[];
    },
    enabled: !!user,
  });
};

export const useCreateBooking = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateBookingInput) => {
      if (!user) throw new Error('User not authenticated');

      const qrCode = `QR${Date.now().toString(36).toUpperCase()}`;

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          booking_type: input.booking_type,
          reference_id: input.reference_id,
          title: input.title,
          venue: input.venue,
          date: input.date,
          time: input.time,
          quantity: input.quantity,
          seats: input.seats || null,
          amount: input.amount,
          status: 'confirmed',
          qr_code: qrCode,
          payment_method: input.payment_method || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

export const useCancelBooking = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Cancel booking error:', error);
        throw error;
      }
      return data as Booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};
