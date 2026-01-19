import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Clock, Loader2, SlidersHorizontal, X } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCity } from '@/contexts/CityContext';
import { useMovies } from '@/hooks/useMovies';

const languages = ['All', 'Telugu', 'Hindi', 'English', 'Tamil'];
const genres = ['All', 'Action', 'Comedy', 'Drama', 'Thriller', 'Romance', 'Sci-Fi', 'Fantasy'];

const Movies: React.FC = () => {
  const { selectedCity } = useCity();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'now_showing' | 'coming_soon'>('all');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { data: movies, isLoading, error } = useMovies({
    language: selectedLanguage,
    genre: selectedGenre,
  });

  const filteredMovies = movies?.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || movie.status === selectedStatus;
    return matchesSearch && matchesStatus;
  }) || [];

  const clearFilters = () => {
    setSelectedLanguage('All');
    setSelectedGenre('All');
    setSelectedStatus('all');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedLanguage !== 'All' || selectedGenre !== 'All' || selectedStatus !== 'all' || searchQuery;

  return (
    <Layout>
      <div className="bg-gradient-to-b from-primary/5 to-background py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Movies</h1>
            <p className="text-muted-foreground">
              Now showing in {selectedCity?.name || 'your city'}
            </p>
          </div>

          {/* Search and Quick Filters */}
          <div className="flex flex-col gap-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
                <Input
                  type="search"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 rounded-full bg-white border border-slate-200 focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-black placeholder:text-black"
                />
              </div>

              {/* Desktop Filters */}
              <div className="hidden md:flex gap-3">
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-[140px] rounded-full h-12 bg-white border-border/50 shadow-sm hover:border-primary/50 transition-all text-black">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                  <SelectTrigger className="w-[140px] rounded-full h-12 bg-white border-border/50 shadow-sm hover:border-primary/50 transition-all text-black">
                    <SelectValue placeholder="Genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Mobile Filter Button */}
              <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden rounded-full h-12 px-6">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                    {hasActiveFilters && (
                      <Badge variant="secondary" className="ml-2 rounded-full">
                        Active
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Filter movies by language and genre</SheetDescription>
                  </SheetHeader>
                  <div className="space-y-6 mt-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Language</label>
                      <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger className="rounded-full w-full">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem key={lang} value={lang}>
                              {lang}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Genre</label>
                      <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                        <SelectTrigger className="rounded-full w-full">
                          <SelectValue placeholder="Select genre" />
                        </SelectTrigger>
                        <SelectContent>
                          {genres.map((genre) => (
                            <SelectItem key={genre} value={genre}>
                              {genre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => setFiltersOpen(false)} className="flex-1 rounded-full">
                        Apply
                      </Button>
                      <Button variant="outline" onClick={clearFilters} className="rounded-full">
                        Clear
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Status Tabs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <Tabs value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as typeof selectedStatus)} className="w-full sm:w-auto">
                <TabsList className="bg-[#9ca3af] rounded-full h-12 p-1 w-full sm:w-auto overflow-x-auto justify-start text-black">
                  <TabsTrigger value="all" className="rounded-full h-10 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-black hover:text-black/80 transition-all font-medium">All Movies</TabsTrigger>
                  <TabsTrigger value="now_showing" className="rounded-full h-10 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-black hover:text-black/80 transition-all font-medium">Now Showing</TabsTrigger>
                  <TabsTrigger value="coming_soon" className="rounded-full h-10 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-black hover:text-black/80 transition-all font-medium">Coming Soon</TabsTrigger>
                </TabsList>
              </Tabs>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="hidden md:flex rounded-full hover:bg-muted/50 text-muted-foreground hover:text-primary">
                  <X className="h-4 w-4 mr-1" />
                  Clear filters
                </Button>
              )}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-destructive">Failed to load movies. Please try again.</p>
            </div>
          )}

          {/* Movies Grid */}
          {!isLoading && !error && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {filteredMovies.map((movie) => (
                <Link key={movie.id} to={`/movies/${movie.id}`}>
                  <Card className="group overflow-hidden border-0 bg-card hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="relative aspect-[2/3] overflow-hidden">
                      <img
                        src={movie.poster_url || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop'}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {movie.status === 'coming_soon' && (
                        <Badge className="absolute top-2 left-2 bg-primary">Coming Soon</Badge>
                      )}
                      {movie.rating && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                            <Star className="h-3 w-3 text-yellow-500 mr-1 fill-yellow-500" />
                            {movie.rating}
                          </Badge>
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 to-transparent p-3">
                        <h3 className="font-semibold text-foreground text-sm line-clamp-1">
                          {movie.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span>{movie.language}</span>
                          {movie.duration_minutes && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {Math.floor(movie.duration_minutes / 60)}h {movie.duration_minutes % 60}m
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {!isLoading && !error && filteredMovies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No movies found matching your criteria</p>
              {hasActiveFilters && (
                <Button variant="link" onClick={clearFilters} className="mt-2">
                  Clear all filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Movies;