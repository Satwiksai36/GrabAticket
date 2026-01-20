import { format } from 'date-fns';
import { useEvents } from '@/hooks/useEvents';
import { Badge } from "@/components/ui/badge";


import React from 'react';
import { Link } from 'react-router-dom';
import {
  Film,
  ArrowRight,
  Loader2,
  Star,
  TrendingUp,
  Clock,
  MapPin,
  Trophy,
  Clapperboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useMovies } from '@/hooks/useMovies';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const FeaturedSection: React.FC = () => {
  const [selectedGenre, setSelectedGenre] = React.useState('All');

  const { data: movies, isLoading: moviesLoading } = useMovies({
    status: 'now_showing',
    genre: selectedGenre
  });

  const { data: sports, isLoading: sportsLoading } = useEvents(undefined, {
    limit: 10,
    category: 'Sports',
    sortBy: 'date'
  });

  const { data: plays, isLoading: playsLoading } = useEvents(undefined, {
    limit: 10,
    category: 'Plays',
    sortBy: 'date'
  });

  const { data: events, isLoading: eventsLoading } = useEvents(undefined, {
    sortBy: 'trending',
    limit: 10
  });

  return (
    <section className="py-8 bg-background">
      <div className="container mx-auto px-4">
        {/* Featured Movies */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center">
                <Film className="mr-2 h-6 w-6 text-primary" />
                Now Showing
              </h2>
              <p className="text-muted-foreground mt-1">Book tickets for the hottest movies</p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link to="/movies">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="flex overflow-x-auto pb-4 mb-6 scrollbar-hide">
            <div className="bg-[#9ca3af] p-1 rounded-full flex items-center min-w-max">
              {['All', 'Action', 'Drama', 'Romance', 'Horror', 'Sci-Fi', 'Animation', 'Comedy'].map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`
                    rounded-full px-6 h-10 text-sm font-medium whitespace-nowrap transition-all
                    ${selectedGenre === genre
                      ? "bg-white text-black shadow-sm"
                      : "text-black hover:text-black/80 hover:bg-white/10"
                    }
                  `}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {moviesLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Carousel opts={{ align: "start" }} className="w-full">
              <CarouselContent className="-ml-4">
                {movies?.map((movie) => (
                  <CarouselItem key={movie.id} className="pl-4 basis-1/2 md:basis-1/4 lg:basis-1/5">
                    <Link to={`/movies/${movie.id}`}>
                      <Card className="group overflow-hidden border-0 bg-card hover:shadow-xl transition-all hover:-translate-y-1 h-full">
                        <div className="relative aspect-[2/3] overflow-hidden">
                          <img
                            src={movie.poster_url || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop'}
                            alt={movie.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center bg-gradient-to-t from-black/80 to-transparent pt-12">
                            <Button className="w-full font-semibold shadow-lg">Book tickets</Button>
                          </div>
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                              <Star className="h-3 w-3 text-yellow-500 mr-1 fill-yellow-500" />
                              {movie.rating || 'N/A'}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-3">
                          <h3 className="font-bold text-foreground text-lg line-clamp-1 group-hover:text-primary transition-colors">
                            {movie.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                            {movie.genre}
                          </p>
                          <p className="text-xs text-muted-foreground/80 mt-0.5">
                            {movie.language}
                          </p>
                        </div>
                      </Card>
                    </Link>
                  </CarouselItem>
                ))}
                {movies?.length === 0 && (
                  <div className="col-span-full text-center py-12 text-muted-foreground w-full">
                    No movies found for this genre.
                  </div>
                )}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          )}

          <Button variant="ghost" asChild className="w-full mt-4 sm:hidden">
            <Link to="/movies">
              View All Movies
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>


        {/* Sports Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center">
                <Trophy className="mr-2 h-6 w-6 text-primary" />
                Sports
              </h2>
              <p className="text-muted-foreground mt-1">Catch the latest matches live</p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link to="/sports">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {sportsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Carousel opts={{ align: "start" }} className="w-full">
              <CarouselContent className="-ml-4">
                {sports?.map((sport) => (
                  <CarouselItem key={sport.id} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <Link to={`/sports/${sport.id}`}>
                      <Card className="group overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 bg-card border-border/50 h-full">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img
                            src={sport.image_url || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=400&fit=crop'}
                            alt={sport.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground backdrop-blur-sm shadow-sm">{sport.category}</Badge>
                          {sport.available_tickets < 50 && (
                            <Badge variant="destructive" className="absolute top-3 right-3 shadow-sm">Selling Fast</Badge>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-foreground text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                            {sport.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-primary" />
                              {format(new Date(sport.date), 'MMM d, yyyy')}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-primary" />
                              {sport.venue}
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-border/50">
                            <span className="font-bold text-lg text-primary">₹{sport.price}</span>
                            <Button size="sm" className="rounded-full px-4">Book Now</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </CarouselItem>
                ))}
                {sports?.length === 0 && (
                  <div className="col-span-full text-center py-12 text-muted-foreground w-full">
                    No sports events found.
                  </div>
                )}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          )}

          <Button variant="ghost" asChild className="w-full mt-4 sm:hidden">
            <Link to="/sports">
              View All Sports
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Trending Events */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center">
                <TrendingUp className="mr-2 h-6 w-6 text-primary" />
                Trending Events
              </h2>
              <p className="text-muted-foreground mt-1">Don't miss out on these experiences</p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link to="/events">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {eventsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Carousel opts={{ align: "start" }} className="w-full">
              <CarouselContent className="-ml-4">
                {events?.filter(event => event.category !== 'Sports').map((event) => (
                  <CarouselItem key={event.id} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <Link to={`/events/${event.id}`}>
                      <Card className="group overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 bg-card border-border/50 h-full">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img
                            src={event.image_url || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&h=400&fit=crop'}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground backdrop-blur-sm shadow-sm">{event.category}</Badge>
                          {event.available_tickets < 20 && (
                            <Badge variant="destructive" className="absolute top-3 right-3 shadow-sm">Fast Filling</Badge>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-foreground text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                            {event.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-primary" />
                              {format(new Date(event.date), 'MMM d, yyyy')}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-primary" />
                              {event.venue}
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-border/50">
                            <span className="font-bold text-lg text-primary">₹{event.price}</span>
                            <Button size="sm" className="rounded-full px-4">Book Now</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </CarouselItem>
                ))}
                {events?.length === 0 && (
                  <div className="col-span-full text-center py-12 text-muted-foreground w-full">
                    No upcoming events found.
                  </div>
                )}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          )}

          <Button variant="ghost" asChild className="w-full mt-4 sm:hidden">
            <Link to="/events">
              View All Events
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Plays Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center">
                <Clapperboard className="mr-2 h-6 w-6 text-primary" />
                Plays & Theatre
              </h2>
              <p className="text-muted-foreground mt-1">Experience live performances</p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link to="/plays">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {playsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Carousel opts={{ align: "start" }} className="w-full">
              <CarouselContent className="-ml-4">
                {plays?.map((play) => (
                  <CarouselItem key={play.id} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <Link to={`/plays/${play.id}`}>
                      <Card className="group overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 bg-card border-border/50 h-full">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img
                            src={play.image_url || 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=500&h=400&fit=crop'}
                            alt={play.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground backdrop-blur-sm shadow-sm">{play.category}</Badge>
                          {play.available_tickets < 20 && (
                            <Badge variant="destructive" className="absolute top-3 right-3 shadow-sm">Fast Filling</Badge>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-foreground text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                            {play.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-primary" />
                              {format(new Date(play.date), 'MMM d, yyyy')}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-primary" />
                              {play.venue}
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-border/50">
                            <span className="font-bold text-lg text-primary">₹{play.price}</span>
                            <Button size="sm" className="rounded-full px-4">Book Now</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </CarouselItem>
                ))}
                {plays?.length === 0 && (
                  <div className="col-span-full text-center py-12 text-muted-foreground w-full">
                    No plays found.
                  </div>
                )}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          )}

          <Button variant="ghost" asChild className="w-full mt-4 sm:hidden">
            <Link to="/plays">
              View All Plays
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
