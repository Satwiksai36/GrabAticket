import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfDay, subDays, format } from 'date-fns';

export interface BookingTrend {
  date: string;
  bookings: number;
  revenue: number;
}

export interface CategoryData {
  name: string;
  value: number;
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [moviesRes, showsRes, eventsRes, bookingsRes, theatresRes] = await Promise.all([
        supabase.from('movies').select('id', { count: 'exact' }),
        supabase.from('shows').select('id, available_seats, total_seats, price', { count: 'exact' }),
        supabase.from('events').select('id, available_tickets, total_tickets', { count: 'exact' }),
        supabase.from('bookings').select('id, amount, booking_type, created_at, title, status, quantity'),
        supabase.from('theatres').select('id', { count: 'exact' }),
      ]);

      const moviesCount = moviesRes.count || 0;
      const showsCount = showsRes.count || 0;
      const eventsCount = eventsRes.count || 0;
      const bookingsCount = bookingsRes.data?.length || 0;
      const theatresCount = theatresRes.count || 0;

      // Calculate total revenue
      const totalRevenue = bookingsRes.data?.reduce((sum, b) => sum + Number(b.amount), 0) || 0;

      // Calculate tickets sold (from shows)
      const totalShowSeats = showsRes.data?.reduce((sum, s) => sum + s.total_seats, 0) || 0;
      const availableShowSeats = showsRes.data?.reduce((sum, s) => sum + s.available_seats, 0) || 0;
      const showTicketsSold = totalShowSeats - availableShowSeats;

      // Calculate event tickets sold
      const totalEventTickets = eventsRes.data?.reduce((sum, e) => sum + e.total_tickets, 0) || 0;
      const availableEventTickets = eventsRes.data?.reduce((sum, e) => sum + e.available_tickets, 0) || 0;
      const eventTicketsSold = totalEventTickets - availableEventTickets;

      const totalTicketsSold = showTicketsSold + eventTicketsSold;

      // Calculate booking trends for last 7 days
      const bookingTrends: BookingTrend[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = startOfDay(subDays(new Date(), i));
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayBookings = bookingsRes.data?.filter(b => {
          const bookingDate = format(new Date(b.created_at), 'yyyy-MM-dd');
          return bookingDate === dateStr;
        }) || [];
        
        bookingTrends.push({
          date: format(date, 'EEE'),
          bookings: dayBookings.length,
          revenue: dayBookings.reduce((sum, b) => sum + Number(b.amount), 0),
        });
      }

      // Calculate bookings by category
      const categoryData: CategoryData[] = [];
      const movieBookings = bookingsRes.data?.filter(b => b.booking_type === 'movie').length || 0;
      const eventBookings = bookingsRes.data?.filter(b => b.booking_type === 'event').length || 0;
      
      if (movieBookings > 0) categoryData.push({ name: 'Movies', value: movieBookings });
      if (eventBookings > 0) categoryData.push({ name: 'Events', value: eventBookings });

      // Calculate booking status distribution
      const statusData: CategoryData[] = [];
      const confirmedCount = bookingsRes.data?.filter(b => b.status === 'confirmed').length || 0;
      const completedCount = bookingsRes.data?.filter(b => b.status === 'completed').length || 0;
      const cancelledCount = bookingsRes.data?.filter(b => b.status === 'cancelled').length || 0;
      const pendingCount = bookingsRes.data?.filter(b => b.status === 'pending').length || 0;

      if (confirmedCount > 0) statusData.push({ name: 'Confirmed', value: confirmedCount });
      if (completedCount > 0) statusData.push({ name: 'Completed', value: completedCount });
      if (cancelledCount > 0) statusData.push({ name: 'Cancelled', value: cancelledCount });
      if (pendingCount > 0) statusData.push({ name: 'Pending', value: pendingCount });

      return {
        moviesCount,
        showsCount,
        eventsCount,
        bookingsCount,
        theatresCount,
        totalRevenue,
        totalTicketsSold,
        recentBookings: bookingsRes.data?.slice(0, 5) || [],
        bookingTrends,
        categoryData,
        statusData,
      };
    },
  });
};