import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Film, Music, Trophy, Drama, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCity } from '@/contexts/CityContext';

const HeroSection: React.FC = () => {
  const { selectedCity } = useCity();

  return (
    <section className="relative overflow-hidden bg-background py-8 lg:py-12">
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* City Badge */}
          {selectedCity && (
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Booking in {selectedCity.name}
            </div>
          )}

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Book Tickets for
            <span className="text-primary block mt-2">Everything in Your City</span>
          </h1>

          <p className="text-lg md:text-xl text-black dark:text-white mb-8 max-w-2xl mx-auto">
            Movies, events, sports venues - all in one place.
            Get your tickets instantly with GrabAticket.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" asChild className="text-lg px-8 rounded-full h-12">
              <Link to="/movies">
                Explore Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 rounded-full h-12 bg-background hover:bg-muted/50">
              <Link to="/events">Browse Events</Link>
            </Button>
          </div>
        </div>

        {/* Explore Categories Section */}
        <div className="max-w-6xl mx-auto mt-8">
          <h2 className="text-2xl font-bold text-center mb-8 text-foreground flex items-center justify-center gap-3">
            <LayoutGrid className="h-6 w-6 text-primary" />
            Explore Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Movies */}
            <Link
              to="/movies"
              className="group relative overflow-hidden rounded-xl p-6 h-[140px] flex flex-col justify-center transition-all hover:scale-105 bg-gradient-to-r from-pink-600 to-purple-600 shadow-lg"
            >
              <div className="relative z-10 flex flex-col items-start gap-4">
                <Film className="h-8 w-8 text-white" />
                <div className="text-left">
                  <h3 className="text-xl font-bold text-white leading-none">Movies</h3>
                  <p className="text-white/90 text-sm mt-1 font-medium">Latest blockbusters</p>
                </div>
              </div>
              <Film className="absolute -right-6 -bottom-6 h-32 w-32 text-white/10 group-hover:scale-110 transition-transform rotate-12" />
            </Link>

            {/* Events */}
            <Link
              to="/events"
              className="group relative overflow-hidden rounded-xl p-6 h-[140px] flex flex-col justify-center transition-all hover:scale-105 bg-gradient-to-r from-amber-500 to-orange-600 shadow-lg"
            >
              <div className="relative z-10 flex flex-col items-start gap-4">
                <Music className="h-8 w-8 text-white" />
                <div className="text-left">
                  <h3 className="text-xl font-bold text-white leading-none">Events</h3>
                  <p className="text-white/90 text-sm mt-1 font-medium">Concerts & festivals</p>
                </div>
              </div>
              <Music className="absolute -right-6 -bottom-6 h-32 w-32 text-white/10 group-hover:scale-110 transition-transform rotate-12" />
            </Link>

            {/* Sports */}
            <Link
              to="/sports"
              className="group relative overflow-hidden rounded-xl p-6 h-[140px] flex flex-col justify-center transition-all hover:scale-105 bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg"
            >
              <div className="relative z-10 flex flex-col items-start gap-4">
                <Trophy className="h-8 w-8 text-white" />
                <div className="text-left">
                  <h3 className="text-xl font-bold text-white leading-none">Sports</h3>
                  <p className="text-white/90 text-sm mt-1 font-medium">Live matches</p>
                </div>
              </div>
              <Trophy className="absolute -right-6 -bottom-6 h-32 w-32 text-white/10 group-hover:scale-110 transition-transform rotate-12" />
            </Link>

            {/* Plays */}
            <Link
              to="/plays"
              className="group relative overflow-hidden rounded-xl p-6 h-[140px] flex flex-col justify-center transition-all hover:scale-105 bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg"
            >
              <div className="relative z-10 flex flex-col items-start gap-4">
                <Drama className="h-8 w-8 text-white" />
                <div className="text-left">
                  <h3 className="text-xl font-bold text-white leading-none">Plays</h3>
                  <p className="text-white/90 text-sm mt-1 font-medium">Theatre & drama</p>
                </div>
              </div>
              <Drama className="absolute -right-6 -bottom-6 h-32 w-32 text-white/10 group-hover:scale-110 transition-transform rotate-12" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
