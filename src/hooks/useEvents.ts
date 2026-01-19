import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Event {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  date: string;
  end_date: string | null;
  venue: string;
  category: string;
  price: number;
  is_free: boolean;
  available_tickets: number;
  total_tickets: number;
  organizer: string | null;
  district_id: string | null;
  created_at: string;
}

export const useEvents = (cityId?: string, filters?: { sortBy?: 'date' | 'trending'; limit?: number; category?: string }) => {
  return useQuery({
    queryKey: ['events', cityId, filters],
    queryFn: async () => {
      let query = supabase
        .from('events')
        .select('*');

      if (filters?.sortBy === 'trending') {
        // Approximation: Events with fewer available tickets relative to total are "trending"
        // Since we can't easily do math in sort, we'll sort by available_tickets ASC 
        // (assuming selling out = trending)
        query = query.order('available_tickets', { ascending: true });
      } else {
        query = query.order('date', { ascending: true });
      }

      if (cityId) {
        query = query.eq('district_id', cityId);
      }

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Event[];
    },
  });
};

export const useEvent = (eventId: string | undefined) => {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      if (!eventId) return null;

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .maybeSingle();

      if (error) throw error;
      return data as Event | null;
    },
    enabled: !!eventId,
  });
};
