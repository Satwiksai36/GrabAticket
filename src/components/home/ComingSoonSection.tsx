import React, { useState, useEffect } from 'react';
import { useComingSoon } from '@/hooks/useAdmin';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, Clock, Bell, Play, BellRing, Check } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { toast } from 'sonner';
import { isValid, parseISO, parse } from 'date-fns';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { X } from 'lucide-react';

const CountdownUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center justify-center bg-indigo-50 text-indigo-600 rounded-lg w-12 h-12 md:w-14 md:h-14">
        <span className="text-lg md:text-xl font-bold">{value.toString().padStart(2, '0')}</span>
        <span className="text-[10px] font-medium uppercase tracking-wide">{label}</span>
    </div>
);





const ComingSoonCard = ({ item }: { item: any }) => {
    const [isNotified, setIsNotified] = useState(false);
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculateTimeLeft = () => {
            if (!item.release_date) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            let targetDate = new Date(item.release_date);

            // If standard parsing fails, try parseISO or appending time for day-only strings
            if (!isValid(targetDate)) {
                targetDate = parseISO(item.release_date);
            }

            // Try parsing dd-MM-yyyy format (common in some locales)
            if (!isValid(targetDate)) {
                targetDate = parse(item.release_date, 'dd-MM-yyyy', new Date());
            }

            // If still invalid, try appending time manually (common fix for Safari/dated strings)
            if (!isValid(targetDate)) {
                targetDate = new Date(`${item.release_date}T00:00:00`);
            }

            const now = new Date();

            if (!isValid(targetDate)) {
                // Fallback if everything fails
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const difference = targetDate.getTime() - now.getTime();

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                setTimeLeft({ days, hours, minutes, seconds });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [item.release_date]);

    const handleNotify = () => {
        setIsNotified(!isNotified);
        if (!isNotified) {
            toast.success(`You will be notified when ${item.title} opens for booking!`);
        } else {
            toast.info(`Notification removed for ${item.title}`);
        }
    };

    // Normalize data
    const isSample = item.id.startsWith('sample-');
    const genres = isSample ? item.genres : [item.category, 'Action'];
    const description = isSample ? item.description : "Experience the untold story of the year. A cinematic masterpiece that will take you on a journey beyond imagination.";
    const director = isSample ? item.director : "Visionary Director";
    const cast = isSample ? item.cast : "Ensemble Cast";

    return (
        <Card className="overflow-hidden border border-gray-100 shadow-sm rounded-xl bg-white h-full flex flex-col md:flex-row group hover:shadow-md transition-shadow">
            {/* Left Side: Poster with Video Trigger */}
            <div className="w-full md:w-[220px] shrink-0 relative aspect-[2/3] md:aspect-auto">
                <Dialog>
                    <DialogTrigger asChild>
                        <div className="h-full relative cursor-pointer group/poster">
                            <img
                                src={item.image_url}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover/poster:scale-105"
                            />
                            {/* Coming Soon Badge */}
                            <div className="absolute top-3 left-3 z-10">
                                <Badge className="bg-red-600 text-white border-0 px-2 py-1 text-xs font-medium backdrop-blur-sm shadow-sm">
                                    Coming Soon
                                </Badge>
                            </div>

                            {/* Play Button Overlay */}
                            <div className="absolute inset-0 bg-black/10 group-hover/poster:bg-black/40 transition-colors flex items-center justify-center">
                                <div className="group/play bg-black/30 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 transform translate-y-4 opacity-0 group-hover/poster:opacity-100 group-hover/poster:translate-y-0 hover:scale-105 hover:border-white/50 shadow-2xl">
                                    <div className="bg-primary rounded-full p-1.5 shadow-lg group-hover/play:bg-white group-hover/play:text-primary transition-colors">
                                        <Play className="w-3 h-3 fill-current ml-0.5" />
                                    </div>
                                    <span className="font-semibold text-sm tracking-wide">Watch Trailer</span>
                                </div>
                            </div>
                        </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[800px] p-0 bg-transparent border-none shadow-none text-white">
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-2xl bg-black">
                            <iframe
                                className="w-full h-full"
                                src={item.video_url + "?autoplay=1"}
                                title={item.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Right Side: Details */}
            <div className="flex-1 p-5 flex flex-col">
                <div className="flex-1 space-y-4">
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2 line-clamp-1" title={item.title}>{item.title}</h3>
                        <div className="flex flex-wrap gap-1.5 text-xs">
                            {genres.map((genre: string, i: number) => (
                                <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 px-2 py-0.5">{genre}</Badge>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center text-slate-500 gap-1.5 font-medium text-sm">
                        <Clock className="w-4 h-4" />
                        Opens for bookings {item.release_date || 'TBA'}
                    </div>

                    <div>
                        <div className="flex gap-2.5">
                            <CountdownUnit value={timeLeft.days} label="Days" />
                            <CountdownUnit value={timeLeft.hours} label="Hrs" />
                            <CountdownUnit value={timeLeft.minutes} label="Min" />
                            <CountdownUnit value={timeLeft.seconds} label="Sec" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                            {description}
                        </p>

                        <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                                <p className="text-slate-400 mb-0.5 uppercase tracking-wider font-medium text-[10px]">Director</p>
                                <p className="font-semibold text-slate-900 truncate">{director}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 mb-0.5 uppercase tracking-wider font-medium text-[10px]">Cast</p>
                                <p className="font-semibold text-slate-900 truncate">{cast}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex gap-2">
                    <Button
                        className={`flex-1 ${isNotified ? 'bg-green-600 hover:bg-green-700' : 'bg-primary hover:bg-primary/90'} text-white transition-colors`}
                        onClick={handleNotify}
                    >
                        {isNotified ? (
                            <>
                                <Check className="w-4 h-4 mr-2" /> Notified
                            </>
                        ) : (
                            <>
                                <Bell className="w-4 h-4 mr-2" /> Notify Me
                            </>
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className={`shrink-0 border-slate-200 transition-colors ${isNotified ? 'text-green-600 border-green-200 bg-green-50' : 'text-slate-500 hover:text-primary hover:border-primary'}`}
                        onClick={handleNotify}
                    >
                        {isNotified ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                    </Button>
                </div>
            </div>
        </Card>
    );
};

const ComingSoonSection: React.FC = () => {
    const { data: dbItems, isLoading } = useComingSoon();

    if (isLoading) {
        return <div className="py-12 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;
    }

    if (!dbItems || dbItems.length === 0) return null;

    const displayItems = dbItems;

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-3 mb-6">
                    <Calendar className="w-6 h-6 text-primary" />
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Coming Soon</h2>
                        <p className="text-sm text-muted-foreground">Get a sneak peek at upcoming movies</p>
                    </div>
                </div>

                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4">
                        {displayItems.map((item: any) => (
                            <CarouselItem key={item.id} className="pl-4 md:basis-full lg:basis-1/2 xl:basis-1/2">
                                <ComingSoonCard item={item} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-[-12px] bg-white shadow-lg border-slate-200 hidden md:flex" />
                    <CarouselNext className="right-[-12px] bg-white shadow-lg border-slate-200 hidden md:flex" />
                </Carousel>
            </div>
        </section>
    );
};

export default ComingSoonSection;
