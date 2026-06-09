import React, { useState } from 'react';
import { SeatLayoutManager } from '@/components/admin/SeatLayoutManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateSeatLayout, useAdminTheatres, useUpdateTheatre } from '@/hooks/useAdmin';
import { toast } from 'sonner';

const AdminSeatLayouts: React.FC = () => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedVenueType, setSelectedVenueType] = useState('Cinema');
    const { data: theatres, isLoading: isLoadingTheatres } = useAdminTheatres();
    const createMutation = useCreateSeatLayout();
    const updateTheatreMutation = useUpdateTheatre();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const filteredVenues = React.useMemo(() => {
        if (!theatres) return [];

        return theatres.filter(t => {
            const facilities = t.facilities || [];
            const type = t.type || '';
            const hasTag = (tag: string) => facilities.some((f: string) => f === `_type:${tag}`);
            const isUntyped = !type && !facilities.some((f: string) => f.startsWith('_type:'));

            switch (selectedVenueType) {
                case 'Cinema':
                    return type === 'cinema' || hasTag('cinema') || isUntyped; // Fallback for untyped
                case 'Sports Venue':
                    return type === 'stadium' || type === 'sports_venue' || hasTag('sports_venue') || hasTag('stadium');
                case 'Event Venue':
                    return type === 'event_venue' || hasTag('event_venue');
                case 'Play Venue':
                    return type === 'play_venue' || hasTag('play_venue');
                case 'Auditorium':
                    return type === 'auditorium' || hasTag('auditorium');
                default:
                    return true;
            }
        });
    }, [theatres, selectedVenueType]);

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const rows = Number(formData.get('rows'));
        const cols = Number(formData.get('columns'));
        const venueType = formData.get('venueType') as string;
        const sportType = formData.get('sportType') as string; // Capture sport layout specific type
        const theatreId = formData.get('venue') as string;

        // Map UI venue type to DB type if needed, or use as is
        let type = 'theatre';
        if (venueType === 'Sports Venue') {
            // Use specific sport layout type if available
            type = sportType || 'stadium';
        } else if (venueType === 'Auditorium') type = 'auditorium';
        else if (venueType === 'Cinema') type = 'theatre';
        else if (venueType === 'Event Venue') type = 'event_venue';
        else if (venueType === 'Play Venue') type = 'play_venue';

        // Simple default layout config: all seats enabled
        const layoutConfig: any = {
            rows,
            cols,
            style: 'standard',
            seats: []
        };

        // Generate simple grid
        for (let r = 1; r <= rows; r++) {
            for (let c = 1; c <= cols; c++) {
                layoutConfig.seats.push({
                    row: r,
                    col: c,
                    status: 'available',
                    category: 'regular',
                    label: `${String.fromCharCode(64 + r)}${c}`
                });
            }
        }

        try {
            // 1. Create Layout
            const newLayout = await createMutation.mutateAsync({
                name: formData.get('name') as string,
                type,
                rows,
                columns: cols,
                total_seats: rows * cols,
                layout_config: layoutConfig,
            });

            // 2. If theatre selected, update it with new layout ID
            if (theatreId && newLayout && newLayout.id) {
                await updateTheatreMutation.mutateAsync({
                    id: theatreId,
                    seat_layout_id: newLayout.id
                });
                toast.success(`Layout created and assigned to ${filteredVenues.find(v => v.id === theatreId)?.name}`);
            } else {
                toast.success('Layout created successfully');
            }

            setIsCreateOpen(false);
        } catch (error: any) {
            console.error(error);
            toast.error(`Failed to create layout: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingTheatres) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Seat Layouts</h1>
                    <p className="text-muted-foreground">Design and manage seat layouts for all venues</p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)} className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Plus className="mr-2 h-4 w-4" /> Create Layout
                </Button>
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create New Seat Layout</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Layout Name</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="e.g. Main Hall - Standard"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="venueType">Venue Type</Label>
                            <Select
                                name="venueType"
                                defaultValue="Cinema"
                                onValueChange={setSelectedVenueType}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select venue type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Cinema">Cinema</SelectItem>
                                    <SelectItem value="Event Venue">Event Venue</SelectItem>
                                    <SelectItem value="Sports Venue">Sports Venue</SelectItem>
                                    <SelectItem value="Play Venue">Play Venue</SelectItem>
                                    <SelectItem value="Auditorium">Auditorium</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedVenueType === 'Sports Venue' && (
                            <div className="grid gap-2">
                                <Label htmlFor="sportType">Sport Layout Type</Label>
                                <Select name="sportType" defaultValue="stadium">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select sport layout" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="stadium">Stadium (Circular)</SelectItem>
                                        <SelectItem value="ground">Ground (Rectangular Field)</SelectItem>
                                        <SelectItem value="court">Court (Indoor/Tennis)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="venue">Venue (Optional)</Label>
                            <Select name="venue">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select venue" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredVenues.map((venue) => (
                                        <SelectItem key={venue.id} value={venue.id}>
                                            {venue.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="rows">Rows</Label>
                                <Input id="rows" name="rows" type="number" min="1" max="50" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="columns">Columns</Label>
                                <Input id="columns" name="columns" type="number" min="1" max="20" required />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={createMutation.isPending} className="w-full bg-primary hover:bg-primary/90">
                                {createMutation.isPending ? 'Creating...' : 'Open Designer'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Tabs defaultValue="theatre" className="w-full">
                <TabsList className="w-full md:w-auto inline-flex h-12 items-center justify-start rounded-full bg-slate-300 p-1 text-black overflow-x-auto no-scrollbar">
                    <TabsTrigger
                        value="theatre"
                        className="rounded-full px-6 py-2 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm transition-all whitespace-nowrap"
                    >
                        Theatre
                    </TabsTrigger>
                    <TabsTrigger
                        value="stadium"
                        className="rounded-full px-6 py-2 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm transition-all whitespace-nowrap"
                    >
                        Sports Venue
                    </TabsTrigger>
                    <TabsTrigger
                        value="event_venue"
                        className="rounded-full px-6 py-2 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm transition-all whitespace-nowrap"
                    >
                        Event Venue
                    </TabsTrigger>
                    <TabsTrigger
                        value="play_venue"
                        className="rounded-full px-6 py-2 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm transition-all whitespace-nowrap"
                    >
                        Play Venue
                    </TabsTrigger>
                    <TabsTrigger
                        value="auditorium"
                        className="rounded-full px-6 py-2 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm transition-all whitespace-nowrap"
                    >
                        Auditorium
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="theatre" className="pt-4">
                    <SeatLayoutManager type="theatre" onSelect={() => { }} />
                </TabsContent>

                <TabsContent value="stadium" className="pt-4">
                    <SeatLayoutManager type="stadium" onSelect={() => { }} />
                </TabsContent>
                <TabsContent value="event_venue" className="pt-4">
                    <SeatLayoutManager type="event_venue" onSelect={() => { }} />
                </TabsContent>
                <TabsContent value="play_venue" className="pt-4">
                    <SeatLayoutManager type="play_venue" onSelect={() => { }} />
                </TabsContent>
                <TabsContent value="auditorium" className="pt-4">
                    <SeatLayoutManager type="auditorium" onSelect={() => { }} />
                </TabsContent>
            </Tabs>
        </div>
    );
};
export default AdminSeatLayouts;
