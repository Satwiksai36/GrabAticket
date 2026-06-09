import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Users, Trophy, Building, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
import { useAdminTheatres } from '@/hooks/useAdmin';

const venueTypes = ['All', 'Cinema', 'Stadium', 'Community Hall', 'Sports Ground', 'Indoor Court'];

const Venues: React.FC = () => {
  const { selectedCity } = useCity();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { data: theatres, isLoading } = useAdminTheatres();

  // Filter theatres based on selected district and search
  const filteredVenues = theatres?.filter((venue) => {
    const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.address?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistrict = !selectedCity || venue.district_id === selectedCity.id;
    return matchesSearch && matchesDistrict;
  }) || [];

  const clearFilters = () => {
    setSelectedType('All');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedType !== 'All' || searchQuery;

  const getTypeIcon = (facilities: string[] | null) => {
    if (facilities?.includes('IMAX') || facilities?.includes('Dolby Atmos')) {
      return Building;
    }
    return Trophy;
  };

  return (
    <Layout>
      <div className="bg-gradient-to-b from-primary/5 to-background py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Venues & Theatres</h1>
            <p className="text-muted-foreground">
              Find theatres and venues in {selectedCity?.name || 'your city'}
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
              <Input
                type="search"
                placeholder="Search venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 rounded-full bg-white border border-slate-200 focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-black placeholder:text-black"
              />
            </div>

            {/* Desktop Filter */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[180px] hidden md:flex rounded-full bg-white border-slate-200 text-black">
                <SelectValue placeholder="Venue Type" />
              </SelectTrigger>
              <SelectContent>
                {venueTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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
                  <SheetDescription>Filter venues by type</SheetDescription>
                </SheetHeader>
                <div className="space-y-6 mt-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Venue Type</label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {venueTypes.map((type) => (
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

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="hidden md:flex">
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Venues Grid */}
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVenues.map((venue) => {
                const TypeIcon = getTypeIcon(venue.facilities);
                return (
                  <Card key={venue.id} className="group overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Building className="h-16 w-16 text-primary/30" />
                      </div>
                      <Badge className="absolute top-3 left-3">
                        <TypeIcon className="h-3 w-3 mr-1" />
                        Theatre
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground text-lg mb-2 group-hover:text-primary transition-colors">
                        {venue.name}
                      </h3>
                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          {venue.address || 'Address not available'}
                        </div>
                        {venue.district && (
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-primary" />
                            {(venue.district as { name: string }).name}
                          </div>
                        )}
                      </div>

                      {venue.facilities && venue.facilities.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {venue.facilities.slice(0, 3).map((facility) => (
                            <Badge key={facility} variant="secondary" className="text-xs">
                              {facility}
                            </Badge>
                          ))}
                          {venue.facilities.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{venue.facilities.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {venue.phone && (
                        <p className="text-sm text-muted-foreground">
                          📞 {venue.phone}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {!isLoading && filteredVenues.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No venues found matching your criteria</p>
              {hasActiveFilters && (
                <Button variant="link" onClick={clearFilters} className="mt-2">
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Venues;