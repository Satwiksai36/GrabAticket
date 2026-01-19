import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, MapPin, Tag, SlidersHorizontal, X, CalendarRange } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useCity } from '@/contexts/CityContext';
import { useEvents } from '@/hooks/useEvents';
import { format, isAfter, isBefore, startOfDay } from 'date-fns';

const categories = ['All', 'Music Festival', 'Comedy', 'Music', 'Conference', 'Art & Culture', 'Food & Drink', 'Sports'];
const priceRanges = [
  { label: 'All Prices', value: 'all' },
  { label: 'Free', value: 'free' },
  { label: 'Under ₹500', value: '0-500' },
  { label: '₹500 - ₹2000', value: '500-2000' },
  { label: 'Above ₹2000', value: '2000+' },
];

const Events: React.FC = () => {
  const { selectedCity } = useCity();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { data: events, isLoading, error } = useEvents(selectedCity?.id);

  const filteredEvents = (events || []).filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    const matchesFree = !showFreeOnly || event.is_free;

    // Price range filter
    let matchesPrice = true;
    if (selectedPriceRange !== 'all') {
      if (selectedPriceRange === 'free') {
        matchesPrice = event.is_free;
      } else if (selectedPriceRange === '0-500') {
        matchesPrice = !event.is_free && Number(event.price) <= 500;
      } else if (selectedPriceRange === '500-2000') {
        matchesPrice = Number(event.price) > 500 && Number(event.price) <= 2000;
      } else if (selectedPriceRange === '2000+') {
        matchesPrice = Number(event.price) > 2000;
      }
    }

    // Date filter
    let matchesDate = true;
    if (dateFilter) {
      const eventDate = startOfDay(new Date(event.date));
      const filterDate = startOfDay(dateFilter);
      matchesDate = !isBefore(eventDate, filterDate);
    }

    return matchesSearch && matchesCategory && matchesFree && matchesPrice && matchesDate;
  });

  const formatDate = (date: string, endDate?: string | null) => {
    const start = new Date(date);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    if (endDate) {
      const end = new Date(endDate);
      return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
    }
    return start.toLocaleDateString('en-US', { ...options, year: 'numeric' });
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setShowFreeOnly(false);
    setSelectedPriceRange('all');
    setDateFilter(undefined);
    setSearchQuery('');
  };

  const hasActiveFilters = selectedCategory !== 'All' || showFreeOnly || selectedPriceRange !== 'all' || dateFilter || searchQuery;

  return (
    <Layout>
      <div className="bg-gradient-to-b from-primary/5 to-background py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Events</h1>
            <p className="text-muted-foreground">
              Discover events happening in {selectedCity?.name || 'your city'}
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
                <Input
                  type="search"
                  placeholder="Search events or venues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 rounded-full bg-white border border-slate-200 focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-black placeholder:text-black"
                />
              </div>

              {/* Desktop Filters */}
              <div className="hidden md:flex gap-4 flex-wrap">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[160px] rounded-full bg-white border-slate-200 text-black">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                  <SelectTrigger className="w-[160px] rounded-full bg-white border-slate-200 text-black">
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    {priceRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[160px] justify-start rounded-full bg-white border-slate-200 text-black hover:text-black">
                      <CalendarRange className="h-4 w-4 mr-2" />
                      {dateFilter ? format(dateFilter, 'MMM d, yyyy') : 'Date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={dateFilter}
                      onSelect={setDateFilter}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Button
                  variant={showFreeOnly ? 'default' : 'outline'}
                  onClick={() => setShowFreeOnly(!showFreeOnly)}
                  className={`rounded-full ${!showFreeOnly ? 'bg-white border-slate-200 text-black hover:text-black' : 'text-white'}`}
                >
                  <Tag className="h-4 w-4 mr-2" />
                  Free Events
                </Button>
              </div>

              {/* Mobile Filter Button */}
              <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                    {hasActiveFilters && (
                      <Badge variant="secondary" className="ml-2">
                        Active
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Filter events by category, price, and date</SheetDescription>
                  </SheetHeader>
                  <div className="space-y-6 mt-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Price Range</label>
                      <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select price range" />
                        </SelectTrigger>
                        <SelectContent>
                          {priceRanges.map((range) => (
                            <SelectItem key={range.value} value={range.value}>
                              {range.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Starting Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start">
                            <CalendarRange className="h-4 w-4 mr-2" />
                            {dateFilter ? format(dateFilter, 'MMM d, yyyy') : 'Select date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={dateFilter}
                            onSelect={setDateFilter}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={showFreeOnly ? 'default' : 'outline'}
                        onClick={() => setShowFreeOnly(!showFreeOnly)}
                        className="flex-1"
                      >
                        <Tag className="h-4 w-4 mr-2" />
                        Free Events Only
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => setFiltersOpen(false)} className="flex-1">
                        Apply
                      </Button>
                      <Button variant="outline" onClick={clearFilters}>
                        Clear
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {hasActiveFilters && (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {selectedCategory !== 'All' && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedCategory}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory('All')} />
                  </Badge>
                )}
                {selectedPriceRange !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    {priceRanges.find(p => p.value === selectedPriceRange)?.label}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedPriceRange('all')} />
                  </Badge>
                )}
                {dateFilter && (
                  <Badge variant="secondary" className="gap-1">
                    From {format(dateFilter, 'MMM d')}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setDateFilter(undefined)} />
                  </Badge>
                )}
                {showFreeOnly && (
                  <Badge variant="secondary" className="gap-1">
                    Free only
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setShowFreeOnly(false)} />
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear all
                </Button>
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-[16/10] w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Failed to load events. Please try again later.</p>
            </div>
          )}

          {/* Events Grid */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <Link key={event.id} to={`/events/${event.id}`}>
                  <Card className="group overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop'}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 left-3">{event.category}</Badge>
                      {event.is_free && (
                        <Badge variant="secondary" className="absolute top-3 right-3 bg-green-500/20 text-green-600">
                          Free
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground text-lg mb-3 line-clamp-1 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          {formatDate(event.date, event.end_date)}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          {event.venue}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-primary text-lg">
                          {event.is_free ? 'Free' : `₹${Number(event.price).toLocaleString()}`}
                        </span>
                        <Button size="sm">Book Now</Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {!isLoading && !error && filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No events found matching your criteria</p>
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

export default Events;