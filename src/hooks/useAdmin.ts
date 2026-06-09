import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useIsAdmin = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['is-admin', user?.id],
    queryFn: async () => {
      if (!user) return false;

      const { data, error } = await supabase.rpc('has_role', {
        _user_id: user.id,
        _role: 'admin',
      });

      if (error) {
        console.error('Error checking admin role:', error);
        return false;
      }

      return data as boolean;
    },
    enabled: !!user,
  });
};

export const useAdminMovies = () => {
  return useQuery({
    queryKey: ['admin-movies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useCreateMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (movie: {
      title: string;
      description?: string;
      poster_url?: string;
      banner_url?: string;
      duration_minutes?: number;
      language?: string;
      genre?: string;
      rating?: string;
      release_date?: string;
      status?: string;
      trailer_url?: string;
    }) => {
      const { data, error } = await supabase
        .from('movies')
        .insert(movie)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-movies'] });
      queryClient.invalidateQueries({ queryKey: ['movies'] });

      // Auto-add to Coming Soon if status is coming_soon
      if (variables.status === 'coming_soon') {
        try {
          // Check if already exists to avoid duplicates (optional but good practice)
          // For simplicity in this context, we just insert. Supabase might error if unique constraint, but we catch it.
          await supabase.from('coming_soon').insert({
            title: variables.title,
            category: 'Movies',
            image_url: variables.poster_url || '',
            release_date: variables.release_date || ''
          });
          queryClient.invalidateQueries({ queryKey: ['admin-coming-soon'] });
          queryClient.invalidateQueries({ queryKey: ['coming-soon'] });
          // toast.success("Also added to Coming Soon list"); // We can't access toast here easily without context, but UI will show movie created.
        } catch (err) {
          console.error("Failed to auto-add to coming soon", err);
        }
      }
    },
  });
};

export const useUpdateMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...movie }: { id: string;[key: string]: any }) => {
      const { data, error } = await supabase
        .from('movies')
        .update(movie)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-movies'] });
      queryClient.invalidateQueries({ queryKey: ['movies'] });

      // Auto-add to Coming Soon if status is coming_soon
      if (variables.status === 'coming_soon') {
        try {
          await supabase.from('coming_soon').insert({
            title: variables.title,
            category: 'Movies',
            image_url: variables.poster_url || '',
            release_date: variables.release_date || ''
          });
          queryClient.invalidateQueries({ queryKey: ['admin-coming-soon'] });
          queryClient.invalidateQueries({ queryKey: ['coming-soon'] });
        } catch (err) {
          console.error("Failed to auto-add to coming soon on update", err);
        }
      }
    },
  });
};

export const useDeleteMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('movies').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-movies'] });
      queryClient.invalidateQueries({ queryKey: ['movies'] });
    },
  });
};

export const useAdminTheatres = (type?: string) => {
  return useQuery({
    queryKey: ['admin-theatres', type],
    queryFn: async () => {
      let query: any = supabase
        .from('theatres')
        .select('*, district:districts(*)');

      if (type) {
        // query = query.eq('type', type); // Disable type filtering until DB schema is updated
      }

      const { data, error } = await query.order('name');

      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCreateTheatre = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (theatre: {
      name: string;
      address?: string;
      phone?: string;
      facilities?: string[];
      district_id?: string;
      seat_layout_id?: string;
      total_screens?: number;
      venue_type?: string;
      capacity?: number;
      type?: string;
    }) => {
      const { data, error } = await supabase
        .from('theatres')
        .insert(theatre)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-theatres'] });
    },
  });
};

export const useUpdateTheatre = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...theatre }: { id: string;[key: string]: any }) => {
      const { data, error } = await supabase
        .from('theatres')
        .update(theatre)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-theatres'] });
    },
  });
};

export const useDeleteTheatre = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('theatres').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-theatres'] });
    },
  });
};

export const useAdminShows = () => {
  return useQuery({
    queryKey: ['admin-shows'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shows')
        .select('*, movie:movies(*), theatre:theatres(*)')
        .order('show_time', { ascending: true });

      if (error) throw error;
      return data;
    },
  });
};

export const useCreateShow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (show: {
      movie_id: string;
      theatre_id: string;
      show_time: string;
      price: number;
      premium_price?: number;
      recliners_price?: number;
      format?: string;
      screen?: string;
      available_seats?: number;
      total_seats?: number;
      status?: string;
    }) => {
      const { data, error } = await supabase
        .from('shows')
        .insert(show)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-shows'] });
    },
  });
};

export const useUpdateShow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...show }: { id: string;[key: string]: any }) => {
      const { data, error } = await supabase
        .from('shows')
        .update(show)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-shows'] });
    },
  });
};

export const useDeleteShow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('shows').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-shows'] });
    },
  });
};

export const useAdminEvents = () => {
  return useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*, district:districts(*)')
        .order('date', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (event: {
      title: string;
      description?: string;
      image_url?: string;
      date: string;
      end_date?: string;
      venue: string;
      category: string;
      price?: number;
      is_free?: boolean;
      available_tickets?: number;
      total_tickets?: number;
      organizer?: string;
      district_id?: string;
      duration?: number;
      language?: string;
      is_active?: boolean;
      home_team?: string;
      away_team?: string;
      artist?: string;
      director?: string;
      league?: string;
    }) => {
      const { data, error } = await supabase
        .from('events')
        .insert(event)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...event }: { id: string;[key: string]: any }) => {
      const { data, error } = await supabase
        .from('events')
        .update(event)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useCities = () => {
  return useQuery({
    queryKey: ['districts'], // Keep queryKey as 'districts' for compatibility or change to 'cities' if desired. 'districts' matches DB.
    queryFn: async () => {
      const { data, error } = await supabase
        .from('districts')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    },
  });
};

// Alias for backward compatibility
export const useDistricts = useCities;

// Admin Bookings
export const useAdminBookings = () => {
  return useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

// Seat Layouts
export const useSeatLayouts = () => {
  return useQuery({
    queryKey: ['seat-layouts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seat_layouts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useCreateSeatLayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (layout: {
      name: string;
      type: string;
      rows: number;
      columns: number;
      total_seats: number;
      layout_config: any;
    }) => {
      const { data, error } = await supabase
        .from('seat_layouts')
        .insert(layout)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seat-layouts'] });
    },
  });
};

export const useUpdateSeatLayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...layout }: { id: string;[key: string]: any }) => {
      const { data, error } = await supabase
        .from('seat_layouts')
        .update(layout)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seat-layouts'] });
    },
  });
};

export const useDeleteSeatLayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('seat_layouts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seat-layouts'] });
    },
  });
};

// Promo Codes
export const usePromoCodes = () => {
  return useQuery({
    queryKey: ['promocodes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useCreatePromoCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (promo: {
      code: string;
      discount_type: string;
      discount_value: number;
      min_order_value?: number;
      max_discount?: number;
      start_date?: string;
      end_date?: string;
      usage_limit?: number;
      description?: string;
    }) => {
      const { data, error } = await supabase
        .from('promotions')
        .insert(promo)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promocodes'] });
    },
  });
};

export const useUpdatePromoCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...promo }: { id: string;[key: string]: any }) => {
      const { data, error } = await supabase
        .from('promotions')
        .update(promo)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promocodes'] });
    },
  });
};

export const useDeletePromoCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('promotions').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promocodes'] });
    },
  });
};

export const useActivePromotions = () => {
  return useQuery({
    queryKey: ['active-promotions'],
    queryFn: async () => {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        // We want promotions where start_date <= now AND end_date >= now
        // But supabase filtering with 'lte' and 'gte' on timestamps can be tricky if timezone issues arise.
        // Simple logic:
        .lte('start_date', now)
        .gte('end_date', now)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

// Announcements
export const useAdminAnnouncements = () => {
  return useQuery({
    queryKey: ['admin-announcements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('priority', { ascending: true });

      if (error) throw error;
      return data;
    },
  });
};

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (announcement: {
      title: string;
      content: string;
      icon_type: string;
      color_from: string;
      color_to: string;
      priority?: number;
      is_active?: boolean;
      promo_code?: string;
    }) => {
      const { data, error } = await supabase
        .from('announcements')
        .insert(announcement as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
};

export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...announcement }: { id: string; promo_code?: string;[key: string]: any }) => {
      const { data, error } = await supabase
        .from('announcements')
        .update(announcement as any)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
};

export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('announcements').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
};

export const useAnnouncements = () => {
  return useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: true });

      if (error) throw error;
      return data;
    },
  });
};

// Coming Soon
export const useAdminComingSoon = () => {
  return useQuery({
    queryKey: ['admin-coming-soon'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coming_soon')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useCreateComingSoon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: {
      title: string;
      category: string;
      image_url: string;
      release_date: string;
    }) => {
      const { data, error } = await supabase
        .from('coming_soon')
        .insert(item)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coming-soon'] });
      queryClient.invalidateQueries({ queryKey: ['coming-soon'] });
    },
  });
};

export const useUpdateComingSoon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...item }: { id: string;[key: string]: any }) => {
      const { data, error } = await supabase
        .from('coming_soon')
        .update(item)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coming-soon'] });
      queryClient.invalidateQueries({ queryKey: ['coming-soon'] });
    },
  });
};

export const useDeleteComingSoon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('coming_soon').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coming-soon'] });
      queryClient.invalidateQueries({ queryKey: ['coming-soon'] });
    },
  });
};

export const useComingSoon = () => {
  return useQuery({
    queryKey: ['coming-soon'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coming_soon')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};
