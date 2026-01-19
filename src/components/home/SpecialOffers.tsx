import React from 'react';
import { Copy, CreditCard, Percent, Gift, Megaphone, Tag, Star, Bell, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAnnouncements } from '@/hooks/useAdmin';

const ICONS = {
    Megaphone,
    Percent,
    Tag,
    Star,
    Bell,
    Gift,
    PartyPopper,
    CreditCard
};

const SpecialOffers: React.FC = () => {
    const { data: announcements, isLoading } = useAnnouncements();

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        toast.success('Coupon code copied to clipboard!');
    };

    if (isLoading) return null;
    if (!announcements || announcements.length === 0) return null;

    return (
        <section className="py-12 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-center gap-2 mb-8">
                    <Percent className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-bold text-foreground">Special Offers</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto relative z-10">
                    {announcements.map((offer: any) => {
                        const Icon = ICONS[offer.icon_type as keyof typeof ICONS] || Percent;
                        const gradient = offer.color_from && offer.color_to
                            ? `bg-gradient-to-r ${offer.color_from} ${offer.color_to}`
                            : 'bg-gradient-to-r from-pink-600 to-purple-600';

                        return (
                            <div key={offer.id} className={`relative overflow-hidden rounded-xl ${gradient} p-6 text-white shadow-lg h-full bg-cover bg-center transition-transform hover:scale-105 duration-300`}>
                                {/* Background Decoration */}
                                <div className="absolute -bottom-4 -right-4 opacity-10 rotate-[-15deg]">
                                    <Icon className="w-48 h-48" />
                                </div>

                                <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                                    <div>
                                        <div className="mb-4">
                                            <Icon className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-1">{offer.title}</h3>
                                        <p className="text-white/90 text-sm">
                                            {offer.content}
                                        </p>
                                    </div>

                                    {offer.promo_code && (
                                        <div className="flex items-center gap-3 mt-2">
                                            <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-md font-mono text-sm font-semibold border border-white/30 border-dashed">
                                                {offer.promo_code}
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm h-8"
                                                onClick={() => copyCode(offer.promo_code)}
                                            >
                                                <Copy className="w-3.5 h-3.5 mr-1.5" />
                                                Copy
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Decorative elements */}
                <div className="hidden lg:block absolute right-[5%] bottom-[20%] opacity-5 pointer-events-none text-foreground">
                    <Gift className="w-32 h-32" />
                </div>
            </div>
        </section>
    );
};

export default SpecialOffers;
