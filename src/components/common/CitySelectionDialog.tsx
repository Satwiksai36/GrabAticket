import React, { useState } from 'react';
import { Search, MapPin, Building2, ChevronDown, Locate, ImageOff } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCity } from '@/contexts/CityContext';
import { ScrollArea } from '@/components/ui/scroll-area';

// Popular cities hardcoded for display purposes
const POPULAR_CITIES = [
    { name: 'Mumbai', icon: Building2 },
    { name: 'Delhi-NCR', icon: Building2 },
    { name: 'Bengaluru', icon: Building2 },
    { name: 'Hyderabad', icon: Building2 },
    { name: 'Chandigarh', icon: Building2 },
    { name: 'Ahmedabad', icon: Building2 },
    { name: 'Pune', icon: Building2 },
    { name: 'Chennai', icon: Building2 },
    { name: 'Kolkata', icon: Building2 },
    { name: 'Kochi', icon: Building2 },
];

const CitySelectionDialog: React.FC = () => {
    const { selectedCity, setSelectedCity, cities } = useCity();
    const [searchQuery, setSearchQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [showAllCities, setShowAllCities] = useState(false);

    // Filter cities based on search
    const filteredCities = cities.filter(city =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Separate popular cities from user search if needed, but for now we search all
    // Since our backend cities list is dynamic, we'll try to match popular ones by name if they exist in DB
    // or just display them as buttons that set the city if it exists.

    // For the "Popular Cities" section, we display them regardless, but we need to check if they are valid "districts" 
    // to actually select them. Or we just trust the app structure.
    // To be safe, we'll just allow setting them, assuming key cities are seeded.

    const handleSelectCity = (cityName: string, cityData?: any) => {
        // Find full city object if not provided
        const cityToSet = cityData || cities.find(c => c.name.toLowerCase() === cityName.toLowerCase());

        if (cityToSet) {
            setSelectedCity(cityToSet);
            setOpen(false);
        } else {
            // Fallback for demo: create a temporary or partial city object if strictly needed,
            // or just warn. For now, we assume user data covers these or we select what we can.
            // If the city doesn't exist in our 'districts' table, the app might not show venues for it.
            // So ideally we only select existing ones.
            // Let's search loosely or just fallback to just setting the name if allowed?
            // The context expects a City object.

            // If strictly not found, we shouldn't select it to avoid broken states.
            // However, for this UI demo, we might want to just close it or mock it.
            // Let's limit selection to valid cities in the list.
            const fuzzyMatch = cities.find(c => c.name.toLowerCase().includes(cityName.toLowerCase()));
            if (fuzzyMatch) {
                setSelectedCity(fuzzyMatch);
                setOpen(false);
            } else {
                // Mock selection for UI feel if data is missing, BUT it's better to be safe.
                // We will just do nothing or show a toast in a real app.
                console.warn("City not found in database:", cityName);
            }
        }
    };

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser');
            return;
        }

        const toastId = toast.loading('Detecting your location...');

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    // Using a free reverse geocoding API (OpenStreetMap/Nominatim or BigDataCloud)
                    // BigDataCloud is often faster/easier for simple city lookup without strict rate limits
                    const response = await fetch(
                        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                    );
                    const data = await response.json();

                    // Look for city/locality name
                    const detectedCity = data.city || data.locality || data.principalSubdivision;

                    if (detectedCity) {
                        toast.dismiss(toastId);
                        // Try to find exact or fuzzy match
                        const exactMatch = cities.find(c => c.name.toLowerCase() === detectedCity.toLowerCase());
                        const fuzzyMatch = cities.find(c =>
                            c.name.toLowerCase().includes(detectedCity.toLowerCase()) ||
                            detectedCity.toLowerCase().includes(c.name.toLowerCase())
                        );

                        const match = exactMatch || fuzzyMatch;

                        if (match) {
                            setSelectedCity(match);
                            setOpen(false);
                            toast.success(`Location detected: ${match.name}`);
                        } else {
                            toast.error(`Detected location "${detectedCity}" not available in our service areas yet.`);
                        }
                    } else {
                        throw new Error('City name not found');
                    }
                } catch (error) {
                    console.error(error);
                    toast.dismiss(toastId);
                    toast.error('Failed to get location details');
                }
            },
            (error) => {
                console.error(error);
                toast.dismiss(toastId);
                toast.error('Unable to retrieve your location');
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* ... trigger ... */}
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-2 text-foreground font-medium hover:text-primary hover:bg-transparent">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm">{selectedCity?.name || 'Select City'}</span>
                    <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] p-0 gap-0 overflow-hidden bg-white dark:bg-slate-950">
                {/* Search Header */}
                <div className="p-4 border-b border-border space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search for your city"
                            className="pl-9 h-10 border-slate-200 dark:border-slate-800"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-primary hover:text-primary hover:bg-primary/5 h-auto py-2 -ml-2"
                        onClick={handleDetectLocation}
                    >
                        <Locate className="h-4 w-4 mr-2" />
                        Detect my location
                    </Button>
                </div>

                <ScrollArea className="h-[400px] p-6">
                    {/* Popular Cities */}
                    {!searchQuery && (
                        <div className="mb-8">
                            <h3 className="text-sm font-medium text-center text-muted-foreground mb-6">Popular Cities</h3>
                            <div className="grid grid-cols-5 sm:grid-cols-10 gap-x-2 gap-y-6">
                                {POPULAR_CITIES.map((city) => (
                                    <button
                                        key={city.name}
                                        className="flex flex-col items-center gap-2 group"
                                        onClick={() => handleSelectCity(city.name)}
                                    >
                                        <div className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center bg-slate-50 dark:bg-slate-900 group-hover:border-primary group-hover:bg-primary/5 transition-colors">
                                            {/* In a real app, these would be images */}
                                            <city.icon className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
                                        </div>
                                        <span className="text-xs text-center font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                            {city.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Other Cities List */}
                    <div>
                        {!searchQuery && (
                            <div className="flex items-center justify-center mb-6">
                                <h3 className="text-sm font-medium text-muted-foreground">Other Cities</h3>
                            </div>
                        )}

                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-y-2 gap-x-4">
                            {filteredCities.map((city) => (
                                <button
                                    key={city.id}
                                    className={`text-sm text-left py-1 px-2 rounded hover:text-primary hover:bg-primary/5 transition-colors ${selectedCity?.id === city.id ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                                    onClick={() => handleSelectCity(city.name, city)}
                                >
                                    {city.name}
                                </button>
                            ))}
                        </div>

                        {!searchQuery && (
                            <div className="mt-8 text-center">
                                <Button
                                    variant="link"
                                    className="text-primary text-xs"
                                    onClick={() => setShowAllCities(!showAllCities)}
                                >
                                    {showAllCities ? 'Hide all cities' : 'View all cities'}
                                </Button>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default CitySelectionDialog;
