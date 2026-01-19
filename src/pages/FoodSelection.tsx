import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Layout as LayoutIcon, ShoppingBag, Plus, Minus, UtensilsCrossed, ChevronRight, ArrowLeft } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useFoodItems, FoodItem } from '@/hooks/useFood';
import { Skeleton } from '@/components/ui/skeleton';

interface CartItem extends FoodItem {
    quantity: number;
}

const FoodSelection: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { data: foodItems, isLoading } = useFoodItems();

    const [cart, setCart] = useState<{ [key: string]: number }>({});
    const [activeCategory, setActiveCategory] = useState("Popcorn");

    // Booking details from URL
    const seats = searchParams.get('seats')?.split(',') || [];
    const seatAmount = parseInt(searchParams.get('amount') || '0');
    const theatre = searchParams.get('theatre');
    const time = searchParams.get('time');
    const date = searchParams.get('date');

    const categories = useMemo(() => {
        if (!foodItems) return [];
        return Array.from(new Set(foodItems.map(item => item.category)));
    }, [foodItems]);

    const handleUpdateCart = (itemId: string, delta: number) => {
        setCart(prev => {
            const current = prev[itemId] || 0;
            const next = Math.max(0, current + delta);
            if (next === 0) {
                const { [itemId]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [itemId]: next };
        });
    };

    const cartTotal = useMemo(() => {
        if (!foodItems) return 0;
        return Object.entries(cart).reduce((sum, [itemId, qty]) => {
            const item = foodItems.find(i => i.id === itemId);
            return sum + (item ? item.price * qty : 0);
        }, 0);
    }, [cart, foodItems]);

    const cartItemCount = Object.values(cart).reduce((a, b) => a + b, 0);

    const handleProceed = () => {
        // Navigate to checkout with food data in state
        const foodOrder = Object.entries(cart).map(([itemId, qty]) => {
            const item = foodItems?.find(i => i.id === itemId);
            return item ? { ...item, quantity: qty } : null;
        }).filter(Boolean);

        navigate(`/movies/${id}/checkout?seats=${seats.join(',')}&amount=${seatAmount}&theatre=${theatre}&time=${time}&date=${date}`, {
            state: { foodOrder }
        });
    };

    const recommendedItems = useMemo(() => {
        if (!foodItems) return [];
        // Simple recommendation logic
        if (seats.length >= 3) {
            return foodItems.filter(i => i.category === 'Combos' || i.category === 'Popcorn').slice(0, 3);
        }
        return foodItems.filter(i => i.category === 'Beverages' || i.category === 'Popcorn').slice(0, 3);
    }, [foodItems, seats.length]);

    if (isLoading) {
        return (
            <Layout hideFooter>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="space-y-4 w-full max-w-md px-4">
                        <Skeleton className="h-8 w-1/2" />
                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-48 w-full rounded-xl" />
                            <Skeleton className="h-48 w-full rounded-xl" />
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout hideFooter>
            <div className="min-h-screen bg-[#0B0B0B] pb-24">
                {/* Header */}
                <div className="sticky top-0 z-50 bg-[#0B0B0B]/95 backdrop-blur-sm border-b border-white/5 py-4 px-4">
                    <div className="container mx-auto max-w-5xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/10" onClick={() => navigate(-1)}>
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div>
                                <h1 className="text-xl font-bold text-white">Grab a Bite</h1>
                                <p className="text-sm text-[#B3B3B3]">Add snacks to your movie</p>
                            </div>
                        </div>
                        <Button variant="ghost" className="text-[#B3B3B3] hover:text-white" onClick={handleProceed}>
                            Skip
                        </Button>
                    </div>
                </div>

                <div className="container mx-auto max-w-5xl px-4 py-6 space-y-8">
                    {/* Recommendations */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <UtensilsCrossed className="h-5 w-5 text-[#F5C518]" />
                            <h2 className="text-lg font-bold text-white">Recommended for You</h2>
                        </div>
                        <ScrollArea className="w-full whitespace-nowrap rounded-xl pb-4">
                            <div className="flex w-max space-x-4">
                                {recommendedItems.map((item) => (
                                    <div key={item.id} className="w-[280px] p-4 rounded-xl bg-[#1F1F1F] border border-white/5 relative group">
                                        <div className="flex gap-4">
                                            <div className="h-20 w-20 rounded-lg bg-[#141414] overflow-hidden flex-shrink-0">
                                                {item.image_url ? (
                                                    <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-[#333]">
                                                        <UtensilsCrossed className="h-8 w-8" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col justify-between flex-1 whitespace-normal">
                                                <div>
                                                    <div className="flex items-start justify-between">
                                                        <div className={`h-2.5 w-2.5 rounded-full mt-1.5 ${item.type === 'Non-Veg' ? 'bg-[#EF4444]' : 'bg-[#22C55E]'}`} />
                                                    </div>
                                                    <h3 className="font-semibold text-white text-sm line-clamp-2 mt-1">{item.name}</h3>
                                                    <p className="text-xs text-[#B3B3B3] mt-1">{item.category}</p>
                                                </div>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-[#F5C518] font-bold">₹{item.price}</span>
                                                    {cart[item.id] ? (
                                                        <div className="flex items-center gap-2 bg-[#141414] rounded-lg p-1">
                                                            <button onClick={() => handleUpdateCart(item.id, -1)} className="p-1 hover:text-[#EF4444] text-white transition-colors">
                                                                <Minus className="h-3 w-3" />
                                                            </button>
                                                            <span className="text-xs font-bold w-4 text-center text-white">{cart[item.id]}</span>
                                                            <button onClick={() => handleUpdateCart(item.id, 1)} className="p-1 hover:text-[#22C55E] text-white transition-colors">
                                                                <Plus className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <Button
                                                            size="sm"
                                                            className="h-7 px-3 bg-[#141414] text-white hover:bg-[#22C55E] hover:text-white border border-white/10"
                                                            onClick={() => handleUpdateCart(item.id, 1)}
                                                        >
                                                            Add
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {seats.length >= 3 && item.category === 'Combos' && (
                                            <div className="absolute -top-2 right-4 bg-[#F5C518] text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                                                PERFECT FOR GROUP
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </section>

                    {/* Menu */}
                    <section>
                        <Tabs defaultValue={categories[0]} value={activeCategory} onValueChange={setActiveCategory} className="w-full">
                            <TabsList className="bg-transparent border-b border-white/10 w-full justify-start h-auto p-0 mb-6 flex-wrap">
                                {categories.map((cat) => (
                                    <TabsTrigger
                                        key={cat}
                                        value={cat}
                                        className="data-[state=active]:bg-transparent data-[state=active]:text-[#F59E0B] data-[state=active]:border-b-2 data-[state=active]:border-[#F59E0B] rounded-none px-4 py-2 text-[#B3B3B3] hover:text-white transition-colors"
                                    >
                                        {cat}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            {categories.map((cat) => (
                                <TabsContent key={cat} value={cat} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {foodItems?.filter(i => i.category === cat && i.is_available).map((item) => (
                                            <div key={item.id} className="flex bg-[#1F1F1F] rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors">
                                                <div className="h-24 w-24 rounded-lg bg-[#141414] overflow-hidden flex-shrink-0 mr-4">
                                                    {item.image_url ? (
                                                        <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-[#333]">
                                                            <UtensilsCrossed className="h-8 w-8" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col justify-between flex-1">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <div className={`h-3 w-3 border flex items-center justify-center p-[1px] ${item.type === 'Non-Veg' ? 'border-[#EF4444]' : 'border-[#22C55E]'}`}>
                                                                <div className={`h-1.5 w-1.5 rounded-full ${item.type === 'Non-Veg' ? 'bg-[#EF4444]' : 'bg-[#22C55E]'}`} />
                                                            </div>
                                                            <span className="text-[10px] text-[#B3B3B3] uppercase tracking-wider">{item.category}</span>
                                                        </div>
                                                        <h3 className="font-semibold text-white">{item.name}</h3>
                                                        <p className="text-xs text-[#B3B3B3] mt-1 line-clamp-2">{item.description}</p>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-3">
                                                        <span className="font-bold text-[#F5C518]">₹{item.price}</span>
                                                        {cart[item.id] ? (
                                                            <div className="flex items-center gap-3 bg-[#141414] rounded-lg px-2 py-1 border border-white/10">
                                                                <button onClick={() => handleUpdateCart(item.id, -1)} className="text-[#EF4444] hover:bg-white/5 rounded p-0.5">
                                                                    <Minus className="h-4 w-4" />
                                                                </button>
                                                                <span className="font-bold text-white min-w-[1rem] text-center">{cart[item.id]}</span>
                                                                <button onClick={() => handleUpdateCart(item.id, 1)} className="text-[#22C55E] hover:bg-white/5 rounded p-0.5">
                                                                    <Plus className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-8 bg-transparent border-white/20 text-white hover:bg-[#F59E0B] hover:text-black hover:border-[#F59E0B] transition-all"
                                                                onClick={() => handleUpdateCart(item.id, 1)}
                                                            >
                                                                Add
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </section>
                </div>

                {/* Floating Cart Footer */}
                {cartItemCount > 0 && (
                    <div className="fixed bottom-0 inset-x-0 bg-[#141414] border-t border-white/10 p-4 z-50 safe-area-bottom">
                        <div className="container mx-auto max-w-5xl flex items-center justify-between">
                            <div className="flex items-center gap-3" onClick={() => {
                                const element = document.getElementById('cart-details');
                                if (element) element.scrollIntoView({ behavior: 'smooth' });
                            }}>
                                <div className="relative">
                                    <ShoppingBag className="h-6 w-6 text-[#F5C518]" />
                                    <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center bg-white text-black text-[10px]">
                                        {cartItemCount}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-xs text-[#B3B3B3]">{cartItemCount} Items</p>
                                    <p className="text-lg font-bold text-white">₹{cartTotal + seatAmount}</p>
                                </div>
                            </div>

                            <Button onClick={handleProceed} className="bg-primary hover:bg-primary/90 text-white font-bold hover:brightness-110 px-8">
                                Proceed <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default FoodSelection;
