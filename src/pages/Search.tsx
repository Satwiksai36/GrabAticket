import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, Film, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useMovies } from '@/hooks/useMovies';
import { useEvents } from '@/hooks/useEvents';
import { useCity } from '@/contexts/CityContext';

const Search: React.FC = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const { selectedCity } = useCity();

    const { data: movies, isLoading: isLoadingMovies } = useMovies();
    const { data: events, isLoading: isLoadingEvents } = useEvents(selectedCity?.id);

    const isLoading = isLoadingMovies || isLoadingEvents;

    const filteredMovies = (movies || []).filter((movie) =>
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.genre?.toLowerCase().includes(query.toLowerCase())
    );

    const filteredSports = (events || []).filter((event) =>
        (event.title.toLowerCase().includes(query.toLowerCase()) ||
            event.venue.toLowerCase().includes(query.toLowerCase()) ||
            event.category.toLowerCase().includes(query.toLowerCase())) &&
        event.category === 'Sports'
    );

    const filteredEvents = (events || []).filter((event) =>
        (event.title.toLowerCase().includes(query.toLowerCase()) ||
            event.venue.toLowerCase().includes(query.toLowerCase()) ||
            event.category.toLowerCase().includes(query.toLowerCase())) &&
        event.category !== 'Sports'
    );

    return (
        <Layout>
            <div className="bg-gradient-to-b from-primary/5 to-background py-8 min-h-screen">
                <div className="container mx-auto px-4">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
                            <SearchIcon className="h-8 w-8 text-primary" />
                            Search Results
                        </h1>
                        <p className="text-muted-foreground">
                            Results under "{query}"
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {/* Movies Section */}
                            {filteredMovies.length > 0 && (
                                <section>
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-bold flex items-center gap-2">
                                            <Film className="h-5 w-5 text-primary" />
                                            Movies ({filteredMovies.length})
                                        </h2>
                                        <Button variant="link" asChild>
                                            <Link to="/movies">View All Movies <ArrowRight className="ml-1 h-4 w-4" /></Link>
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                        {filteredMovies.map((movie) => (
                                            <Link key={movie.id} to={`/movies/${movie.id}`} className="group relative">
                                                <div className="relative aspect-[2/3] overflow-hidden rounded-xl shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                                                    <img
                                                        src={movie.poster_url || 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=600&h=900&fit=crop'}
                                                        alt={movie.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                                        <Button size="sm" className="w-full">Book Now</Button>
                                                    </div>
                                                    <Badge className="absolute top-2 right-2 bg-black/60 backdrop-blur-md">
                                                        {movie.language}
                                                    </Badge>
                                                </div>
                                                <div className="mt-2">
                                                    <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                                        {movie.title}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">{movie.genre}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Sports Section */}
                            {filteredSports.length > 0 && (
                                <section>
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-bold flex items-center gap-2">
                                            <Calendar className="h-5 w-5 text-primary" />
                                            Sports ({filteredSports.length})
                                        </h2>
                                        <Button variant="link" asChild>
                                            <Link to="/sports">View All Sports <ArrowRight className="ml-1 h-4 w-4" /></Link>
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredSports.map((event) => (
                                            <Link key={event.id} to={`/events/${event.id}`}>
                                                <Card className="group overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 h-full">
                                                    <div className="relative aspect-[16/10] overflow-hidden">
                                                        <img
                                                            src={event.image_url || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop'}
                                                            alt={event.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                        <Badge className="absolute top-3 left-3">{event.category}</Badge>
                                                    </div>
                                                    <CardContent className="p-4">
                                                        <h3 className="font-semibold text-foreground text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                                                            {event.title}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground mb-1">{new Date(event.date).toLocaleDateString()} • {event.venue}</p>
                                                        <span className="font-semibold text-primary">
                                                            {event.is_free ? 'Free' : `₹${Number(event.price).toLocaleString()}`}
                                                        </span>
                                                    </CardContent>
                                                </Card>
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Events Section */}
                            {filteredEvents.length > 0 && (
                                <section>
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-bold flex items-center gap-2">
                                            <Calendar className="h-5 w-5 text-primary" />
                                            Events ({filteredEvents.length})
                                        </h2>
                                        <Button variant="link" asChild>
                                            <Link to="/events">View All Events <ArrowRight className="ml-1 h-4 w-4" /></Link>
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredEvents.map((event) => (
                                            <Link key={event.id} to={`/events/${event.id}`}>
                                                <Card className="group overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 h-full">
                                                    <div className="relative aspect-[16/10] overflow-hidden">
                                                        <img
                                                            src={event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop'}
                                                            alt={event.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                        <Badge className="absolute top-3 left-3">{event.category}</Badge>
                                                    </div>
                                                    <CardContent className="p-4">
                                                        <h3 className="font-semibold text-foreground text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                                                            {event.title}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground mb-1">{new Date(event.date).toLocaleDateString()} • {event.venue}</p>
                                                        <span className="font-semibold text-primary">
                                                            {event.is_free ? 'Free' : `₹${Number(event.price).toLocaleString()}`}
                                                        </span>
                                                    </CardContent>
                                                </Card>
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {filteredMovies.length === 0 && filteredEvents.length === 0 && filteredSports.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="inline-flex items-center justify-center p-6 bg-muted rounded-full mb-4">
                                        <SearchIcon className="h-12 w-12 text-muted-foreground" />
                                    </div>
                                    <h2 className="text-xl font-semibold mb-2">No results found</h2>
                                    <p className="text-muted-foreground mb-8">
                                        We couldn't find anything matching "{query}"
                                    </p>
                                    <div className="flex justify-center gap-4">
                                        <Button asChild variant="outline">
                                            <Link to="/movies">Browse Movies</Link>
                                        </Button>
                                        <Button asChild variant="outline">
                                            <Link to="/events">Browse Events</Link>
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Search;
