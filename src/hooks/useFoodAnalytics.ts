import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type FoodAnalyticsData = {
    totalRevenue: number;
    popularItems: { name: string; count: number; category: string }[];
    categoryDistribution: { name: string; value: number }[];
    ordersByStatus: { status: string; count: number }[];
    recentOrders: any[];
};

export const useFoodAnalytics = () => {
    return useQuery({
        queryKey: ['food-analytics'],
        queryFn: async () => {
            // Fetch all booking food items
            const { data: foodOrders, error } = await supabase
                .from('booking_food_items')
                .select(`
                    id,
                    quantity,
                    price_at_booking,
                    status,
                    created_at,
                    food_items (name, category)
                `);

            if (error) throw error;

            // 1. Calculate Total Revenue
            const totalRevenue = foodOrders.reduce((acc, order) => {
                return acc + (order.price_at_booking * order.quantity);
            }, 0);

            // 2. Popular Items
            const itemCounts: { [key: string]: { count: number; category: string } } = {};
            foodOrders.forEach(order => {
                const name = order.food_items?.name || 'Unknown';
                const category = order.food_items?.category || 'Other';
                if (!itemCounts[name]) {
                    itemCounts[name] = { count: 0, category };
                }
                itemCounts[name].count += order.quantity;
            });
            const popularItems = Object.entries(itemCounts)
                .map(([name, { count, category }]) => ({ name, count, category }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5);

            // 3. Category Distribution
            const categoryCounts: { [key: string]: number } = {};
            foodOrders.forEach(order => {
                const category = order.food_items?.category || 'Other';
                categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            });
            const categoryDistribution = Object.entries(categoryCounts)
                .map(([name, value]) => ({ name, value }));

            // 4. Orders by Status
            const statusCounts: { [key: string]: number } = {};
            foodOrders.forEach(order => {
                const status = order.status || 'Pending';
                statusCounts[status] = (statusCounts[status] || 0) + 1;
            });
            const ordersByStatus = Object.entries(statusCounts).map(([status, count]) => ({ status, count }));


            return {
                totalRevenue,
                popularItems,
                categoryDistribution,
                ordersByStatus,
                recentOrders: foodOrders.slice(0, 10) // First 10 for now
            } as FoodAnalyticsData;
        }
    });
};
