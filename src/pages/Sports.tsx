import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Trophy, MapPin, SlidersHorizontal, X, Activity } from 'lucide-react';
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
import { useCity } from '@/contexts/CityContext';
import { useEvents } from '@/hooks/useEvents';
import { formatDate } from 'date-fns';

const Sports: React.FC = () => {
    const { selectedCity } = useCity();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSport, setSelectedSport] = useState('All');
    const [filtersOpen, setFiltersOpen] = useState(false);

    // Assumption: Re-using useEvents but filtered for Sports.
    // Ideally, we would have a dedicated API or hook if the schema differs significantly.
    // For now, filtering based on 'Sports' category which matches the seeding data logic.
    const { data: events, isLoading, error } = useEvents(selectedCity?.id);

    const sportsTypes = ['All', 'Cricket', 'Football', 'Running', 'Badminton', 'Tennis', 'Kabaddi', 'Other'];

    const filteredSports = (events || []).filter((event) => {
        // Basic filter: only show things categorized as 'Sports'
        if (event.category !== 'Sports') return false;

        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.venue.toLowerCase().includes(searchQuery.toLowerCase());

        // In a real app, 'event' might need a sub-category 'sport_type' or similar.
        // Here we can try to guess from title if 'selectedSport' is not All,
        // or just assume 'All' is the only reliable filter unless we add metadata.
        // For now, I'll implement a loose title match if a specific sport is selected.
        const matchesType = selectedSport === 'All' ||
            event.title.toLowerCase().includes(selectedSport.toLowerCase());

        return matchesSearch && matchesType;
    });

    const clearFilters = () => {
        setSelectedSport('All');
        setSearchQuery('');
    };

    const hasActiveFilters = selectedSport !== 'All' || searchQuery;

    return (
        <Layout>
            <div className="bg-gradient-to-b from-primary/5 to-background py-8">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
                            <Trophy className="h-8 w-8 text-primary" />
                            Sports
                        </h1>
                        <p className="text-muted-foreground">
                            Book tickets for sports matches and tournaments in {selectedCity?.name || 'your city'}
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col gap-4 mb-8">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
                                <Input
                                    type="search"
                                    placeholder="Search sports, teams, venues..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 h-10 rounded-full bg-white border border-slate-200 focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-black placeholder:text-black"
                                />
                            </div>

                            {/* Desktop Filters */}
                            <div className="hidden md:flex gap-4">
                                <Select value={selectedSport} onValueChange={setSelectedSport}>
                                    <SelectTrigger className="w-[180px] rounded-full bg-white border-slate-200 text-black">
                                        <SelectValue placeholder="Sport Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sportsTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Mobile Filter Button */}
                            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="outline" className="md:hidden">
                                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                                        Filters
                                    </Button>
                                </SheetTrigger>
                                <SheetContent>
                                    <SheetHeader>
                                        <SheetTitle>Filters</SheetTitle>
                                        <SheetDescription>Filter sports by type</SheetDescription>
                                    </SheetHeader>
                                    <div className="space-y-6 mt-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Sport Type</label>
                                            <Select value={selectedSport} onValueChange={setSelectedSport}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select sport" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {sportsTypes.map((type) => (
                                                        <SelectItem key={type} value={type}>
                                                            {type}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
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
                                        <Skeleton className="h-10 w-full" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">Failed to load sports events. Please try again later.</p>
                        </div>
                    )}

                    {/* Grid */}
                    {!isLoading && !error && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredSports.map((sport) => (
                                <Link key={sport.id} to={`/events/${sport.id}`}>
                                    {/* Re-using Event detail route since it's an event */}
                                    <Card className="group overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
                                        <div className="relative aspect-[16/10] overflow-hidden">
                                            <img
                                                src={sport.image_url || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop'}
                                                alt={sport.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <Badge className="absolute top-3 left-3">Sports</Badge>
                                            {sport.is_free && (
                                                <Badge variant="secondary" className="absolute top-3 right-3 bg-green-500/20 text-green-600">
                                                    Free
                                                </Badge>
                                            )}
                                        </div>
                                        <CardContent className="p-4">
                                            <h3 className="font-semibold text-foreground text-lg mb-3 line-clamp-1 group-hover:text-primary transition-colors">
                                                {sport.title}
                                            </h3>
                                            <div className="space-y-2 text-sm text-muted-foreground mb-4">
                                                <div className="flex items-center gap-2">
                                                    {/* Using a simple calendar icon or clock */}
                                                    <Activity className="h-4 w-4 text-primary" />
                                                    {new Date(sport.date).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-primary" />
                                                    {sport.venue}
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-primary text-lg">
                                                    {sport.is_free ? 'Free' : `₹${Number(sport.price).toLocaleString()}`}
                                                </span>
                                                <Button size="sm">Book Now</Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}

                    {!isLoading && !error && filteredSports.length === 0 && (
                        <div className="text-center py-12">
                            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No sports events found</p>
                            {hasActiveFilters && (
                                <Button variant="link" onClick={clearFilters} className="mt-2">
                                    Clear all filters
                                </Button>
                            )}
                            <p className="text-sm text-muted-foreground mt-4">Check back later for matches!</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Sports;
