import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Movie {
  id: string;
  title: string;
  description: string | null;
  poster_url: string | null;
  banner_url: string | null;
  duration_minutes: number | null;
  language: string | null;
  genre: string | null;
  rating: string | null;
  release_date: string | null;
  status: string | null;
  created_at: string;
  trailer_url?: string | null;
}

export interface Show {
  id: string;
  movie_id: string;
  theatre_id: string;
  show_time: string;
  price: number;
  format: string | null;
  available_seats: number;
  total_seats: number;
  status: string | null;
  created_at: string;
}

export interface Theatre {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  facilities: string[] | null;
}

export const useMovies = (filters?: { language?: string; genre?: string; status?: string }) => {
  return useQuery({
    queryKey: ['movies', filters],
    queryFn: async () => {
      let query = supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters?.language && filters.language !== 'All') {
        query = query.eq('language', filters.language);
      }

      if (filters?.genre && filters.genre !== 'All') {
        query = query.ilike('genre', `%${filters.genre}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Movie[];
    },
  });
};

export const useMovie = (id: string | undefined) => {
  return useQuery({
    queryKey: ['movie', id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as Movie | null;
    },
    enabled: !!id,
  });
};

export const useMovieShows = (movieId: string | undefined, date?: string) => {
  return useQuery({
    queryKey: ['movie-shows', movieId, date],
    queryFn: async () => {
      if (!movieId) return [];

      const startOfDay = date ? `${date}T00:00:00` : new Date().toISOString().split('T')[0] + 'T00:00:00';
      const endOfDay = date ? `${date}T23:59:59` : new Date().toISOString().split('T')[0] + 'T23:59:59';

      const { data, error } = await supabase
        .from('shows')
        .select(`
          *,
          theatre:theatres(*)
        `)
        .eq('movie_id', movieId)
        .gte('show_time', startOfDay)
        .lte('show_time', endOfDay)
        .order('show_time', { ascending: true });

      if (error) throw error;
      return data as (Show & { theatre: Theatre })[];
    },
    enabled: !!movieId,
  });
};
