import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ChefHat, Clock, CheckCircle2, Bell, RefreshCw, ScanLine, Search, X, CookingPot, Activity, Utensils } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface KitchenOrder {
    item_id: string;
    booking_id: string;
    booking_reference: string;
    seats: string[];
    venue: string;
    show_time: string;
    food_name: string;
    category: string;
    quantity: number;
    status: 'Pending' | 'Preparing' | 'Ready' | 'Delivered';
    created_at: string;
}

// Grouped by booking
interface OrderGroup {
    booking_id: string;
    booking_reference: string;
    seats: string[];
    venue: string;
    show_time: string;
    items: KitchenOrder[];
    created_at: string;
    status: 'Pending' | 'Preparing' | 'Ready' | 'Delivered'; // Overall status logic
}

const KitchenDashboard: React.FC = () => {
    const queryClient = useQueryClient();
    const [activeFilter, setActiveFilter] = useState<'All' | 'Pending' | 'Preparing' | 'Ready'>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isScanOpen, setIsScanOpen] = useState(false);

    // Set up real-time subscription
    useEffect(() => {
        const channel = supabase
            .channel('kitchen-updates')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'booking_food_items' },
                (payload) => {
                    console.log('Kitchen update:', payload);
                    toast.info('New order update received');
                    queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [queryClient]);

    const { data: orders, isLoading } = useQuery({
        queryKey: ['kitchen-orders'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('booking_food_items')
                .select(`
          id,
          booking_id,
          status,
          quantity,
          created_at,
          food_items (name, category),
          bookings (id, seats, venue, time)
        `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Transform to flat structure
            return data.map((item: any) => ({
                item_id: item.id,
                booking_id: item.booking_id,
                booking_reference: item.bookings?.id,
                seats: item.bookings?.seats || [],
                venue: item.bookings?.venue || 'Unknown Venue',
                show_time: item.bookings?.time || 'Unknown Time',
                food_name: item.food_items?.name || 'Unknown Item',
                category: item.food_items?.category || 'General',
                quantity: item.quantity,
                status: item.status || 'Pending',
                created_at: item.created_at
            })) as KitchenOrder[];
        },
        refetchInterval: 30000, // Fallback polling
    });

    const updateStatus = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            const { error } = await supabase
                .from('booking_food_items')
                .update({ status })
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] });
            toast.success('Order status updated');
        },
    });

    const updateGroupStatus = useMutation({
        mutationFn: async ({ bookingId, status }: { bookingId: string; status: string }) => {
            const { error } = await supabase
                .from('booking_food_items')
                .update({ status })
                .eq('booking_id', bookingId);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] });
            toast.success('Order group updated');
        },
    });

    // Group orders by booking
    const groupedOrders: OrderGroup[] = React.useMemo(() => {
        if (!orders) return [];

        const groups: { [key: string]: OrderGroup } = {};

        orders.forEach(order => {
            if (!groups[order.booking_id]) {
                groups[order.booking_id] = {
                    booking_id: order.booking_id,
                    booking_reference: order.booking_reference,
                    seats: order.seats,
                    venue: order.venue,
                    show_time: order.show_time,
                    items: [],
                    created_at: order.created_at,
                    status: 'Pending' // Default
                };
            }
            groups[order.booking_id].items.push(order);
        });

        // Determine overall group status
        return Object.values(groups).map(g => {
            const allDelivered = g.items.every(i => i.status === 'Delivered');
            const allReadyOrDelivered = g.items.every(i => ['Ready', 'Delivered'].includes(i.status));
            const isStarted = g.items.some(i => ['Preparing', 'Ready', 'Delivered'].includes(i.status));

            if (allDelivered) g.status = 'Delivered';
            else if (allReadyOrDelivered) g.status = 'Ready';
            else if (isStarted) g.status = 'Preparing';
            else g.status = 'Pending';

            return g;
        }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }, [orders]);

    const stats = React.useMemo(() => {
        if (!orders) return { total: 0, pending: 0, preparing: 0, ready: 0, completed: 0 };
        return {
            total: orders.length,
            pending: orders.filter(o => o.status === 'Pending').length,
            preparing: orders.filter(o => o.status === 'Preparing').length,
            ready: orders.filter(o => o.status === 'Ready').length,
            completed: orders.filter(o => o.status === 'Delivered').length,
        };
    }, [orders]);

    const filteredGroups = groupedOrders.filter(g => {
        // Search filter (ID or Seat)
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                g.booking_reference.toLowerCase().includes(query) ||
                g.seats.some(seat => seat.toLowerCase().includes(query))
            );
        }
        // Status filter
        return activeFilter === 'All' ? g.status !== 'Delivered' : g.status === activeFilter;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-orange-500/10 text-orange-600 border-orange-200';
            case 'Preparing': return 'bg-indigo-500/10 text-indigo-600 border-indigo-200';
            case 'Ready': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
            case 'Delivered': return 'bg-slate-500/10 text-slate-600 border-slate-200';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    const handleScanSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Logic handled by binding searchQuery state to input
        setIsScanOpen(false);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white p-4 md:p-6 transition-colors font-sans">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header & Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none">
                                    <ChefHat className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Kitchen Display</h1>
                                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                                        <Activity className="h-4 w-4" />
                                        <span>Live Order Management</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                                <Button variant="outline" size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] })} className="rounded-full border-indigo-100 text-indigo-600 hover:bg-indigo-50 dark:bg-zinc-900 dark:border-zinc-700 dark:text-indigo-400">
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Refresh
                                </Button>
                                {/* QR Scan */}
                                <Dialog open={isScanOpen} onOpenChange={setIsScanOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 dark:shadow-none">
                                            <ScanLine className="h-4 w-4 mr-2" />
                                            Scan QR
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-white border-slate-200 text-slate-900">
                                        <DialogHeader>
                                            <DialogTitle>Scan Booking QR Order</DialogTitle>
                                        </DialogHeader>
                                        <form onSubmit={handleScanSubmit} className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Input
                                                    placeholder="Enter Booking ID (e.g., UUID-1234)"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="bg-white border-slate-200 text-slate-900 font-mono"
                                                    autoFocus
                                                />
                                                <p className="text-xs text-slate-500">
                                                    Simulate a scanner by pasting the Booking ID here.
                                                </p>
                                            </div>
                                            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                                                Search Order
                                            </Button>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>

                        {/* Order Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-2">
                            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending</p>
                                    <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                                    <Clock className="h-5 w-5 text-orange-600" />
                                </div>
                            </div>
                            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Preparing</p>
                                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats.preparing}</p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                                    <CookingPot className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                            </div>
                            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Ready</p>
                                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.ready}</p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                            </div>
                            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Since Login</p>
                                    <p className="text-2xl font-bold text-slate-700 dark:text-slate-200">{stats.total}</p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                                    <Utensils className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 h-full flex flex-col justify-center gap-4 shadow-sm">
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-black dark:text-white" />
                                <Input
                                    placeholder="Search Seat / ID"
                                    className="pl-9 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 rounded-full shadow-sm placeholder:text-black dark:placeholder:text-white text-black dark:text-white"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Filter Status</p>
                                <div className="flex flex-wrap gap-2">
                                    {['All', 'Pending', 'Preparing', 'Ready'].map((filter) => (
                                        <button
                                            key={filter}
                                            onClick={() => setActiveFilter(filter as any)}
                                            className={`flex-1 min-w-[80px] px-3 py-2 rounded-full text-xs font-medium transition-all text-center ${activeFilter === filter
                                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none'
                                                : 'bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700'
                                                }`}
                                        >
                                            {filter}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {searchQuery && (
                    <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 rounded-lg text-blue-700 dark:text-blue-300 text-sm">
                        <span>Showing results for: <strong>"{searchQuery}"</strong></span>
                        <button onClick={() => setSearchQuery('')} className="underline hover:text-blue-600">Clear Search</button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredGroups.map((group) => (
                        <Card key={group.booking_id} className={`bg-white border-slate-200 text-slate-900 overflow-hidden flex flex-col h-full shadow-sm transition-all hover:shadow-md ${group.status === 'Pending' ? 'ring-1 ring-orange-500/50' : ''
                            }`}>
                            <CardHeader className={`pb-3 border-b border-slate-100 ${group.status === 'Pending' ? 'bg-orange-50/50' :
                                group.status === 'Preparing' ? 'bg-indigo-50/50' :
                                    group.status === 'Ready' ? 'bg-emerald-50/50' : ''
                                }`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge variant="outline" className={`${getStatusColor(group.status)} border-0 px-2 py-0.5 rounded-md`}>
                                                {group.status.toUpperCase()}
                                            </Badge>
                                            <span className="text-[10px] font-medium text-slate-400">
                                                {formatDistanceToNow(new Date(group.created_at), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-lg flex items-center gap-2 font-mono tracking-tight text-slate-900">
                                            #{group.booking_reference.slice(0, 4).toUpperCase()}
                                        </h3>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-white bg-slate-900 px-3 py-1.5 rounded-lg min-w-[3.5rem] text-center shadow-lg transform rotate-1">
                                            {group.seats[0]}
                                            {group.seats.length > 1 && <span className="text-xs text-slate-400 ml-1">+{group.seats.length - 1}</span>}
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 flex-1 flex flex-col">
                                <ScrollArea className="flex-1 h-[200px]">
                                    <div className="p-4 space-y-3">
                                        {group.items.map((item) => (
                                            <div key={item.item_id} className="flex items-center justify-between group/item p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <div className={`
                            w-7 h-7 rounded-md flex items-center justify-center font-bold text-sm shadow-sm
                            ${item.status === 'Delivered' ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white'}
                          `}>
                                                        {item.quantity}
                                                    </div>
                                                    <div>
                                                        <p className={`text-sm font-semibold ${item.status === 'Delivered' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                                                            {item.food_name}
                                                        </p>
                                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">{item.category}</p>
                                                    </div>
                                                </div>

                                                {item.status !== 'Delivered' && item.status !== 'Ready' && (
                                                    <div className="opacity-0 group-hover/item:opacity-100 transition-opacity">
                                                        <input
                                                            type="checkbox"
                                                            className="h-5 w-5 rounded border-slate-300 bg-white checked:bg-emerald-500 hover:border-slate-400 cursor-pointer transition-colors"
                                                            onChange={(e) => {
                                                                if (e.target.checked) updateStatus.mutate({ id: item.item_id, status: 'Ready' });
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                                {item.status === 'Ready' && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                                                {item.status === 'Preparing' && <CookingPot className="h-5 w-5 text-indigo-400 animate-pulse" />}
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>

                                <div className="p-3 border-t border-slate-100 bg-slate-50/50 mt-auto grid grid-cols-1 gap-2">
                                    {group.status === 'Pending' && (
                                        <Button
                                            size="sm"
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 font-medium shadow-sm"
                                            onClick={() => updateGroupStatus.mutate({ bookingId: group.booking_id, status: 'Preparing' })}
                                        >
                                            <CookingPot className="h-4 w-4 mr-2" />
                                            Start Preparing
                                        </Button>
                                    )}
                                    {group.status === 'Preparing' && (
                                        <Button
                                            size="sm"
                                            className="w-full bg-emerald-600 hover:bg-emerald-700 font-medium shadow-sm"
                                            onClick={() => updateGroupStatus.mutate({ bookingId: group.booking_id, status: 'Ready' })}
                                        >
                                            <CheckCircle2 className="h-4 w-4 mr-2" />
                                            Mark All Ready
                                        </Button>
                                    )}
                                    {group.status === 'Ready' && (
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm"
                                            onClick={() => updateGroupStatus.mutate({ bookingId: group.booking_id, status: 'Delivered' })}
                                        >
                                            Complete Order
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {filteredGroups.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center p-16 text-slate-500 dark:text-slate-400 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl bg-slate-50/50 dark:bg-zinc-900">
                            <div className="bg-white dark:bg-zinc-800 p-4 rounded-full shadow-sm mb-4">
                                <Bell className="h-8 w-8 text-indigo-200 dark:text-indigo-400/50" />
                            </div>
                            <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-1">No active orders</h3>
                            <p className="text-slate-500 dark:text-slate-400">
                                {searchQuery ? `No orders matching "${searchQuery}"` : "Waiting for new orders to arrive..."}
                            </p>
                            {searchQuery && (
                                <Button variant="link" onClick={() => setSearchQuery('')} className="mt-2 text-indigo-600 dark:text-indigo-400">
                                    Clear Search
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default KitchenDashboard;
