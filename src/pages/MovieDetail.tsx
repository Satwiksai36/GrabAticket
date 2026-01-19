import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Calendar, MapPin, Loader2, Play } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useCity } from '@/contexts/CityContext';
import { useMovie, useMovieShows } from '@/hooks/useMovies';
import { format, parseISO } from 'date-fns';

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedCity } = useCity();
  const [selectedDate, setSelectedDate] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const getVideoId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const { data: movie, isLoading: movieLoading } = useMovie(id);

  // Generate dates for the next 7 days
  const dates = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        full: date.toISOString().split('T')[0],
      };
    }), []
  );

  const { data: shows, isLoading: showsLoading } = useMovieShows(id, dates[selectedDate]?.full);

  // Group shows by theatre
  const showsByTheatre = useMemo(() => {
    if (!shows) return [];

    const grouped = shows.reduce((acc, show) => {
      const theatreId = show.theatre_id;
      if (!acc[theatreId]) {
        acc[theatreId] = {
          theatre: show.theatre,
          shows: [],
        };
      }
      acc[theatreId].shows.push(show);
      return acc;
    }, {} as Record<string, { theatre: typeof shows[0]['theatre']; shows: typeof shows }>);

    return Object.values(grouped);
  }, [shows]);

  if (movieLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!movie) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Movie not found</h1>
          <Button asChild>
            <Link to="/movies">Back to Movies</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Cinematic Hero Section */}
      <div className="relative w-full h-[85vh] min-h-[600px] overflow-hidden bg-black group">

        {/* Background Layer: Video or Image */}
        <div className="absolute inset-0 w-full h-full">
          {movie.trailer_url && getVideoId(movie.trailer_url) ? (
            <div className="w-full h-full relative">
              <iframe
                src={`https://www.youtube.com/embed/${getVideoId(movie.trailer_url)}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${getVideoId(movie.trailer_url)}&playsinline=1&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&fs=0&vq=hd1080`}
                className="w-full h-[300%] -mt-[50%] aspect-video pointer-events-none opacity-80"
                title={movie.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                style={{ filter: 'brightness(0.7) contrast(1.1)' }}
              />
            </div>
          ) : (
            <img
              src={movie.banner_url || movie.poster_url || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=800&fit=crop'}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/60" />

        {/* Content Container - Bottom Aligned */}
        <div className="absolute bottom-0 left-0 right-0 p-8 pb-32 md:pb-12 container mx-auto flex flex-col md:flex-row items-end gap-8 z-20">

          {/* Poster Card - Floating */}
          <div
            className="hidden md:block w-[220px] shrink-0 relative group/poster rounded-xl overflow-hidden shadow-2xl border-4 border-white/10 rotate-1 hover:rotate-0 transition-transform duration-500 cursor-pointer"
            onClick={() => setIsTrailerOpen(true)}
          >
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="w-full h-auto aspect-[2/3] object-cover"
            />
            {/* Play Button Overlay */}
            {movie.trailer_url && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/poster:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                <div className="relative transform transition-all duration-300 hover:scale-110">
                  <div className="bg-indigo-600/90 text-white p-4 rounded-[1.5rem] shadow-xl rotate-45 border border-white/20 hover:bg-indigo-600 hover:rotate-90 transition-all duration-500">
                    <div className="-rotate-45">
                      <Play className="w-8 h-8 fill-current ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Movie Details - Hero Text */}
          <div className="flex-1 space-y-4 mb-2">

            {/* Badges */}
            <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              {movie.genre && (
                <Badge className="bg-indigo-600/90 hover:bg-indigo-600 text-white border-0 backdrop-blur-md px-3 py-1 text-xs uppercase tracking-wider">
                  {movie.genre}
                </Badge>
              )}
              {movie.language && (
                <Badge variant="outline" className="text-white border-white/30 bg-black/20 backdrop-blur-md uppercase tracking-wider text-xs">
                  {movie.language}
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none drop-shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
              {movie.title}
            </h1>

            {/* Meta Data */}
            <div className="flex items-center gap-6 text-white/80 font-medium text-sm md:text-base animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              {movie.rating && (
                <div className="flex items-center gap-2 text-yellow-400">
                  <Star className="h-5 w-5 fill-yellow-400" />
                  <span className="text-white font-bold text-lg">{movie.rating}</span>
                </div>
              )}

              <div className="h-4 w-px bg-white/20" />

              {movie.duration_minutes && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 opacity-70" />
                  <span>{Math.floor(movie.duration_minutes / 60)}h {movie.duration_minutes % 60}m</span>
                </div>
              )}

              <div className="h-4 w-px bg-white/20" />

              {movie.release_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 opacity-70" />
                  <span>{format(parseISO(movie.release_date), 'yyyy')}</span>
                </div>
              )}
            </div>

            {/* Description - Clamped */}
            {movie.description && (
              <p className="text-white/70 max-w-2xl text-lg leading-relaxed line-clamp-3 md:line-clamp-2 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-400 border-l-2 border-indigo-500 pl-4 mb-6">
                {movie.description}
              </p>
            )}

            {/* Hero CTA Buttons */}
            <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-500 pt-2">
              <Button
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-white border-0 rounded-full px-8 py-6 font-bold text-lg shadow-[0_0_30px_-5px_rgba(79,70,229,0.6)] hover:shadow-[0_0_40px_-5px_rgba(79,70,229,0.8)] transition-all"
                onClick={() => document.getElementById('book-tickets')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Book Tickets
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 mb-20">
        <div className="mt-12 mb-8" id="book-tickets">
          <h2 className="text-2xl font-bold text-foreground mb-2">Book Tickets</h2>
          <p className="text-muted-foreground mb-6">
            Select a date and showtime in {selectedCity?.name || 'your city'}
          </p>

          {/* Date Selector */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
            {dates.map((d, index) => (
              <button
                key={d.full}
                onClick={() => setSelectedDate(index)}
                className={`flex flex-col items-center min-w-[70px] p-3 rounded-lg border transition-all ${selectedDate === index
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border hover:border-primary/50'
                  }`}
              >
                <span className="text-xs font-medium">{d.day}</span>
                <span className="text-xl font-bold">{d.date}</span>
                <span className="text-xs">{d.month}</span>
              </button>
            ))}
          </div>

          {/* Loading Shows */}
          {showsLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          {/* Theatre List */}
          {!showsLoading && showsByTheatre.length > 0 && (
            <div className="space-y-4">
              {showsByTheatre.map(({ theatre, shows: theatreShows }) => (
                <Card key={theatre?.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{theatre?.name}</h3>
                          <Badge variant="secondary">{theatreShows[0]?.format}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {theatre?.address || 'Location available at venue'}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {theatreShows.map((show) => (
                          <Button
                            key={show.id}
                            variant="outline"
                            size="sm"
                            asChild
                            className="hover:bg-primary hover:text-primary-foreground"
                          >
                            <Link to={`/movies/${id}/book?theatre=${show.theatre_id}&showId=${show.id}&time=${encodeURIComponent(format(parseISO(show.show_time), 'h:mm a'))}&date=${dates[selectedDate].full}&price=${show.price}`}>
                              {format(parseISO(show.show_time), 'h:mm a')}
                              <span className="ml-1 text-xs text-muted-foreground">₹{show.price}</span>
                            </Link>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* No Shows */}
          {!showsLoading && showsByTheatre.length === 0 && (
            <div className="text-center py-8 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">No shows available for this date</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isTrailerOpen} onOpenChange={setIsTrailerOpen}>
        <DialogContent className="sm:max-w-[900px] p-0 bg-black border-slate-800 overflow-hidden">
          <div className="aspect-video w-full relative">
            {movie?.trailer_url && (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${getVideoId(movie.trailer_url)}?autoplay=1&rel=0&showinfo=0&iv_load_policy=3`}
                title={movie.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default MovieDetail;
