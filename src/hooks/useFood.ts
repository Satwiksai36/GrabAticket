import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type FoodItem = {
    id: string;
    name: string;
    description: string | null;
    category: 'Popcorn' | 'Beverages' | 'Combos' | 'Snacks' | 'Desserts' | 'Regional';
    price: number;
    type: 'Veg' | 'Non-Veg' | 'Egg' | 'Vegan';
    image_url: string | null;
    is_available: boolean;
    preparation_time_mins: number;
};

export const useFoodItems = () => {
    return useQuery({
        queryKey: ['food-items'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('food_items')
                .select('*')
                .order('category', { ascending: true });

            if (error) throw error;
            return data as FoodItem[];
        },
    });
};

export const useCreateFoodItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (foodItem: Omit<FoodItem, 'id'>) => {
            const { data, error } = await supabase
                .from('food_items')
                .insert(foodItem)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['food-items'] });
        },
    });
};

export const useUpdateFoodItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...updates }: Partial<FoodItem> & { id: string }) => {
            const { data, error } = await supabase
                .from('food_items')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['food-items'] });
        },
    });
};

export const useDeleteFoodItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('food_items')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['food-items'] });
        },
    });
};
