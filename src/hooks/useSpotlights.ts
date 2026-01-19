import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Spotlight {
    id: string;
    title: string;
    description: string | null;
    image_url: string | null;
    trailer_url: string | null;
    link: string | null;
    category: 'movie' | 'event' | 'sport' | 'play' | 'discount' | 'other' | 'coming_soon';
    active: boolean;
    priority: number;
    start_date: string | null;
    end_date: string | null;
    created_at: string;
    updated_at: string;
}

export type CreateSpotlightInput = Omit<Spotlight, 'id' | 'created_at' | 'updated_at'>;
export type UpdateSpotlightInput = Partial<CreateSpotlightInput>;

export const useSpotlights = () => {
    return useQuery({
        queryKey: ['spotlights'],
        queryFn: async () => {
            const { data, error } = await (supabase as any)
                .from('spotlights')
                .select('*')
                .eq('active', true)
                .order('priority', { ascending: false }) // High priority first
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as Spotlight[];
        },
    });
};

export const useAdminSpotlights = () => {
    return useQuery({
        queryKey: ['admin-spotlights'],
        queryFn: async () => {
            const { data, error } = await (supabase as any)
                .from('spotlights')
                .select('*')
                .order('priority', { ascending: false })
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as Spotlight[];
        },
    });
};

export const useCreateSpotlight = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (spotlight: CreateSpotlightInput) => {
            const { data, error } = await (supabase as any)
                .from('spotlights')
                .insert(spotlight)
                .select()
                .single();

            if (error) throw error;
            return data as Spotlight;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['spotlights'] });
            queryClient.invalidateQueries({ queryKey: ['admin-spotlights'] });
        },
    });
};

export const useUpdateSpotlight = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: UpdateSpotlightInput & { id: string }) => {
            const { data, error } = await (supabase as any)
                .from('spotlights')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data as Spotlight;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['spotlights'] });
            queryClient.invalidateQueries({ queryKey: ['admin-spotlights'] });
        },
    });
};

export const useDeleteSpotlight = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await (supabase as any)
                .from('spotlights')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['spotlights'] });
            queryClient.invalidateQueries({ queryKey: ['admin-spotlights'] });
        },
    });
};
