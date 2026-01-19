import React, { useState } from 'react';
import { Plus, Pencil, Trash2, MapPin, Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useCreateTheatre, useUpdateTheatre, useDeleteTheatre, useDistricts } from '@/hooks/useAdmin';
import { toast } from 'sonner';

interface VenueManagerProps {
    type: string;
    title: string;
    venues?: any[];
    isLoading?: boolean;
}

const emptyFormData = {
    name: '',
    address: '',
    phone: '',
    facilities: '',
    district_id: '',
    total_screens: '',
    venue_type: '',
    capacity: '',
};

export const VenueManager: React.FC<VenueManagerProps> = ({ type, title, venues, isLoading }) => {
    // const { data: venues, isLoading } = useAdminTheatres(type); // Removed internal fetch
    const { data: cities } = useDistricts();
    const createVenue = useCreateTheatre();
    const updateVenue = useUpdateTheatre();
    const deleteVenue = useDeleteTheatre();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingVenue, setEditingVenue] = useState<any>(null);
    const [formData, setFormData] = useState(emptyFormData);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredVenues = React.useMemo(() => {
        if (!venues) return [];
        if (!searchQuery) return venues;

        const query = searchQuery.toLowerCase();
        return venues.filter(venue =>
            venue.name.toLowerCase().includes(query) ||
            venue.address?.toLowerCase().includes(query) ||
            venue.district?.name?.toLowerCase().includes(query)
        );
    }, [venues, searchQuery]);

    const openCreateDialog = () => {
        setEditingVenue(null);
        setFormData(emptyFormData);
        setDialogOpen(true);
    };

    const openEditDialog = (venue: any) => {
        setEditingVenue(venue);
        setFormData({
            name: venue.name,
            address: venue.address || '',
            phone: venue.phone || '',
            // Filter out the internal type tag when displaying formatted facilities
            facilities: venue.facilities ? venue.facilities.filter((f: string) => !f.startsWith('_type:')).join(', ') : '',
            district_id: venue.district_id || '',
            total_screens: venue.total_screens ? venue.total_screens.toString() : '',
            venue_type: venue.venue_type || '',
            capacity: venue.capacity ? venue.capacity.toString() : '',
        });
        setDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Prepare facilities with internal type tag
            let facilitiesArgs = formData.facilities ? formData.facilities.split(',').map((f: string) => f.trim()) : [];
            // Ensure type tag is present
            const typeTag = `_type:${type}`;
            if (!facilitiesArgs.includes(typeTag)) {
                facilitiesArgs.push(typeTag);
            }

            const venueData = {
                name: formData.name,
                address: formData.address || undefined,
                phone: formData.phone || undefined,
                facilities: facilitiesArgs,
                district_id: formData.district_id || undefined,
                // total_screens: formData.total_screens ? parseInt(formData.total_screens) : undefined, // Not in DB
                // venue_type: formData.venue_type || undefined, // Not in DB
                // capacity: formData.capacity ? parseInt(formData.capacity) : undefined, // Not in DB
                // type: type // Removed as it causes creation failure (column likely missing)
            };

            if (editingVenue) {
                await updateVenue.mutateAsync({ id: editingVenue.id, ...venueData });
                toast.success('Venue updated successfully');
            } else {
                await createVenue.mutateAsync(venueData);
                toast.success('Venue created successfully');
            }
            setDialogOpen(false);
            setFormData(emptyFormData);
            setEditingVenue(null);
        } catch (error: any) {
            console.error('Error creating/updating venue:', error);
            toast.error(editingVenue ? 'Failed to update venue: ' + error.message : 'Failed to create venue: ' + error.message);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteVenue.mutateAsync(id);
            toast.success('Venue deleted successfully');
        } catch (error) {
            toast.error('Failed to delete venue');
        }
    };

    if (isLoading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[200px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-foreground">{title}</h2>
                    <p className="text-muted-foreground">Manage {title.toLowerCase()} in your system</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative w-full max-w-sm hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
                        <Input
                            placeholder={`Search ${title.toLowerCase()}...`}
                            className="pl-10 h-10 rounded-full bg-white border border-slate-200 focus:ring-2 focus:ring-primary/20 transition-all duration-300 placeholder:text-black text-black"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button onClick={openCreateDialog} className="rounded-full bg-indigo-600 hover:bg-indigo-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add {title.slice(0, -1)} {/* Crude singularization */}
                    </Button>
                </div>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-xl max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>{editingVenue ? `Edit ${title.slice(0, -1)}` : `Add New ${title.slice(0, -1)}`}</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto pr-2">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Venue Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Select
                                    value={formData.district_id}
                                    onValueChange={(value) => setFormData({ ...formData, district_id: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select city" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cities?.map((city) => (
                                            <SelectItem key={city.id} value={city.id}>
                                                {city.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>

                            {type === 'cinema' && (
                                <div className="space-y-2">
                                    <Label htmlFor="total_screens">Total Screens</Label>
                                    <Input
                                        id="total_screens"
                                        type="number"
                                        value={formData.total_screens}
                                        onChange={(e) => setFormData({ ...formData, total_screens: e.target.value })}
                                    />
                                </div>
                            )}

                            {type === 'event_venue' && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="venue_type">Venue Type</Label>
                                        <Input
                                            id="venue_type"
                                            value={formData.venue_type}
                                            onChange={(e) => setFormData({ ...formData, venue_type: e.target.value })}
                                            placeholder="e.g. Arena, Stadium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="capacity">Total Capacity</Label>
                                        <Input
                                            id="capacity"
                                            type="number"
                                            value={formData.capacity}
                                            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}

                            {type === 'sports_venue' && (
                                <div className="space-y-2">
                                    <Label htmlFor="venue_type">Venue Type</Label>
                                    <Input
                                        id="venue_type"
                                        value={formData.venue_type}
                                        onChange={(e) => setFormData({ ...formData, venue_type: e.target.value })}
                                        placeholder="e.g. Stadium, Ground"
                                    />
                                </div>
                            )}

                            {type === 'play_venue' && (
                                <div className="space-y-2">
                                    <Label htmlFor="venue_type">Venue Type</Label>
                                    <Input
                                        id="venue_type"
                                        value={formData.venue_type}
                                        onChange={(e) => setFormData({ ...formData, venue_type: e.target.value })}
                                        placeholder="e.g. Theatre, Auditorium"
                                    />
                                </div>
                            )}

                            {type === 'auditorium' && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="venue_type">Venue Type</Label>
                                        <Input
                                            id="venue_type"
                                            value={formData.venue_type}
                                            onChange={(e) => setFormData({ ...formData, venue_type: e.target.value })}
                                            placeholder="e.g. Auditorium, Hall"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="capacity">Total Capacity</Label>
                                        <Input
                                            id="capacity"
                                            type="number"
                                            value={formData.capacity}
                                            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}


                            <div className="space-y-2">
                                <Label htmlFor="facilities">Facilities (comma separated)</Label>
                                <Input
                                    id="facilities"
                                    value={formData.facilities}
                                    onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                                    placeholder="e.g. Parking, AC, Food Court"
                                />
                            </div>

                            <DialogFooter className="mt-4">
                                <Button type="submit" disabled={createVenue.isPending || updateVenue.isPending} className="w-full bg-primary hover:bg-primary/90 text-white">
                                    {editingVenue ? 'Update Venue' : 'Create Venue'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVenues?.map((venue) => (
                    <Card key={venue.id} className="overflow-hidden">
                        <CardContent className="p-0">
                            <div className="bg-muted h-32 flex items-center justify-center">
                                <MapPin className="h-10 w-10 text-muted-foreground/50" />
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold text-lg text-foreground line-clamp-1">{venue.name}</h3>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(venue)}>
                                            <Pencil className="h-3.5 w-3.5" />
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Venue</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to delete "{venue.name}"?
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(venue.id)}>
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                                        <span className="line-clamp-2">{venue.address || 'No address provided'}</span>
                                    </div>
                                    {venue.facilities && venue.facilities.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-3">
                                            {venue.facilities.slice(0, 3).map((f: string, i: number) => (
                                                <Badge key={i} variant="secondary" className="text-xs font-normal">
                                                    {f}
                                                </Badge>
                                            ))}
                                            {venue.facilities.length > 3 && (
                                                <Badge variant="outline" className="text-xs font-normal">
                                                    +{venue.facilities.length - 3} more
                                                </Badge>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredVenues?.length === 0 && (
                <div className="text-center py-12">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground">No {title.toLowerCase()} found</h3>
                    <p className="text-muted-foreground">Add your first venue to start.</p>
                </div>
            )}
        </div>
    );
};
