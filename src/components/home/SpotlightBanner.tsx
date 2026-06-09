
import React, { useState, useEffect, useRef } from 'react';
import { useSpotlights, Spotlight } from '@/hooks/useSpotlights';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Ticket, Play } from 'lucide-react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Link } from 'react-router-dom';
import Autoplay from "embla-carousel-autoplay";

// Helper functions extracted to prevent recreation on render
const getVideoId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
};

const getEmbedUrl = (url: string) => {
    const videoId = getVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null;
};

// Start: Spotlight Item Component for individual slide logic
const SpotlightItem = ({ spotlight, onWatchTrailer }: { spotlight: Spotlight, onWatchTrailer: (url: string) => void }) => {
    const [isVideoVisible, setIsVideoVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const videoId = getVideoId(spotlight.trailer_url || '');

    // Reset video visibility when the slide changes (key changes)
    useEffect(() => {
        setIsVideoVisible(false);
    }, [spotlight.id]);

    return (
        <CarouselItem
            key={spotlight.id}
            className="pl-0"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative w-full h-[600px] overflow-hidden bg-black group">
                {/* 1. Base Image Layer - Always visible (behind video) */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 z-0"
                    style={{ backgroundImage: `url(${spotlight.image_url || 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1974&auto=format&fit=crop'})` }}
                />

                {/* 2. Video Layer - Fades in on load */}
                {videoId && (
                    <div className={`absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden transition-opacity duration-1000 z-1 pointer-events-none ${isVideoVisible ? 'opacity-100' : 'opacity-0'}`}>
                        <iframe
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&playsinline=1&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1&enablejsapi=1&origin=${window.location.origin}&vq=hd1080`}
                            className="w-full aspect-video scale-150 select-none"
                            title={spotlight.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            onLoad={() => {
                                // Delay fade-in slightly to allow video to buffer and start playing
                                setTimeout(() => setIsVideoVisible(true), 2000);
                            }}
                        />
                    </div>
                )}

                {/* 3. Gradient Overlay - Ensures text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent z-10" />

                {/* 4. Content Layer */}
                <div className="absolute inset-0 flex items-center z-20">
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="max-w-3xl space-y-6">
                            <span className="inline-block px-4 py-1.5 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-full border border-white/20 shadow-sm">
                                {spotlight.category === 'coming_soon' ? 'Coming Soon' : 'Now Showing'}
                            </span>

                            <h2 className="text-5xl md:text-7xl font-extrabold text-white leading-none tracking-tight drop-shadow-2xl highlight-white">
                                {spotlight.title}
                            </h2>

                            {spotlight.description && (
                                <p className="text-lg md:text-xl text-gray-100 max-w-2xl drop-shadow-md line-clamp-3 font-medium">
                                    {spotlight.description}
                                </p>
                            )}

                            <div className="pt-6 flex flex-wrap gap-4">
                                {spotlight.link && (
                                    <Button size="lg" asChild className="text-lg px-8 h-12 bg-primary hover:bg-primary/90 text-white border-none shadow-xl hover:shadow-primary/30 transition-all rounded-full tracking-wide font-bold">
                                        <Link to={spotlight.link}>
                                            <Ticket className="mr-2 h-5 w-5" />
                                            Book Now
                                        </Link>
                                    </Button>
                                )}
                                {spotlight.trailer_url && (
                                    <Button
                                        size="lg"
                                        className="text-lg px-8 h-12 bg-white text-slate-950 hover:bg-slate-200 border-none transition-all rounded-full tracking-wide font-bold shadow-lg"
                                        onClick={() => onWatchTrailer(spotlight.trailer_url!)}
                                    >
                                        <Play className="mr-2 h-5 w-5 fill-current" />
                                        Watch Trailer
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CarouselItem>
    );
};

const SpotlightBanner: React.FC = () => {
    const { data: spotlights, isLoading } = useSpotlights();
    const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
    const plugin = useRef(
        Autoplay({ delay: 8000, stopOnInteraction: true })
    );

    if (isLoading) {
        return <div className="w-full h-[400px] bg-muted animate-pulse" />;
    }

    // Fallback if no spotlights
    if (!spotlights || spotlights.length === 0) {
        return (
            <section className="relative w-full h-[400px] bg-gradient-to-r from-slate-900 to-slate-800 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Welcome to GrabAticket</h1>
                    <p className="text-xl text-slate-200 mb-8">Discover movies, events, sports, and more in your city.</p>
                    <div className="flex gap-4 justify-center">
                        <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
                            <Link to="/movies">Browse Movies</Link>
                        </Button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <div className="w-full relative group">
            <Carousel
                className="w-full"
                plugins={[plugin.current]}
                opts={{
                    loop: true,
                }}
            >
                <CarouselContent className="-ml-0">
                    {spotlights.map((spotlight) => (
                        <SpotlightItem
                            key={spotlight.id}
                            spotlight={spotlight}
                            onWatchTrailer={setTrailerUrl}
                        />
                    ))}
                </CarouselContent>
                {spotlights.length > 1 && (
                    <>
                        <CarouselPrevious className="left-4 bg-black/20 border-white/10 text-white hover:bg-black/40 hover:text-white z-30" />
                        <CarouselNext className="right-4 bg-black/20 border-white/10 text-white hover:bg-black/40 hover:text-white z-30" />
                    </>
                )}
            </Carousel>

            {/* Stats Bar */}
            <div className="w-full bg-gray-50 border-b border-gray-200">
                <div className="container mx-auto px-4 py-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="space-y-1">
                            <h3 className="text-2xl md:text-3xl font-bold text-primary">500+</h3>
                            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Movies</p>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-2xl md:text-3xl font-bold text-primary">1000+</h3>
                            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Events</p>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-2xl md:text-3xl font-bold text-primary">50+</h3>
                            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Cities</p>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-2xl md:text-3xl font-bold text-primary">10M+</h3>
                            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Happy Customers</p>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={!!trailerUrl} onOpenChange={(open) => !open && setTrailerUrl(null)}>
                <DialogContent className="sm:max-w-[800px] p-0 bg-black border-slate-800">
                    <div className="aspect-video w-full">
                        {trailerUrl && (
                            <iframe
                                width="100%"
                                height="100%"
                                src={getEmbedUrl(trailerUrl) || ''}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SpotlightBanner;
