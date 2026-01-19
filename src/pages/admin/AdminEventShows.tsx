import React, { useState } from 'react';
import { useAdminEvents, useCreateEvent, useUpdateEvent, useDeleteEvent, useAdminTheatres } from '@/hooks/useAdmin';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Ticket, Loader2, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
import { toast } from 'sonner';

const emptyFormData = {
    event_id: '', // To select distinct event template
    title: '',
    venue: '',
    layout: '',
    date: '',
    time: '',
    price_regular: '',
    price_vip: '',
    price_vvip: '',
};

const AdminEventShows: React.FC = () => {
    const { data: events, isLoading } = useAdminEvents();
    const { data: venues } = useAdminTheatres('event_venue');
    const createEvent = useCreateEvent();
    const updateEvent = useUpdateEvent();
    const deleteEvent = useDeleteEvent();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<any>(null);
    const [formData, setFormData] = useState(emptyFormData);
    const [searchQuery, setSearchQuery] = useState("");

    // Get unique event titles to use as "Event" selector
    const uniqueEvents = React.useMemo(() => {
        if (!events) return [];
        const seen = new Set();
        const excludedCategories = [
            'Sports', 'Theatre',
            'Cricket', 'Football', 'Kabaddi', 'Badminton', 'Tennis', 'Hockey', 'Basketball',
            'Drama', 'Musical', 'Tragedy', 'Opera', 'Ballet'
        ];
        return events
            .filter(e => !excludedCategories.includes(e.category))
            .filter(e => {
                const duplicate = seen.has(e.title);
                seen.add(e.title);
                return !duplicate;
            });
    }, [events]);

    // Client-side filtering for venues since server-side filter was disabled
    const filteredVenues = React.useMemo(() => {
        if (!venues) return [];
        return venues.filter(v => v.facilities?.includes('_type:event_venue') || v.type === 'event_venue');
    }, [venues]);

    const openCreateDialog = () => {
        setEditingEvent(null);
        setFormData(emptyFormData);
        setDialogOpen(true);
    };

    const openEditDialog = (event: any) => {
        setEditingEvent(event);
        const dateObj = new Date(event.date);
        setFormData({
            event_id: event.id, // Just for reference
            title: event.title,
            venue: (Object.values(venues || {}).find((v: any) => v.name === event.venue) as any)?.id || '', // Try to match venue name to ID
            layout: '',
            date: format(dateObj, 'yyyy-MM-dd'),
            time: format(dateObj, 'HH:mm'),
            price_regular: event.price?.toString() || '',
            price_vip: '',
            price_vvip: '',
        });
        setDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const selectedTemplate = uniqueEvents.find(e => e.title === formData.title); // Or find by title if selected
            const selectedVenue = venues?.find(v => v.id === formData.venue);

            const eventDateTime = `${formData.date}T${formData.time}:00+05:30`;

            const eventData = {
                title: formData.title || (selectedTemplate?.title || 'New Event'),
                description: selectedTemplate?.description || '',
                image_url: selectedTemplate?.image_url || '',
                date: eventDateTime,
                venue: selectedVenue?.name || 'TBA',
                category: selectedTemplate?.category || 'Events',
                price: parseFloat(formData.price_regular) || 0,
                is_free: false,
                total_tickets: 1000, // Default or fetch from layout
                available_tickets: 1000,
                organizer: selectedTemplate?.organizer || 'Organizer',
                district_id: selectedVenue?.district_id,
                // duration: (selectedTemplate as any)?.duration || 120, // Not in DB
                // language: (selectedTemplate as any)?.language || 'English', // Not in DB
                // is_active: true, // Not in DB
            };

            if (editingEvent) {
                await updateEvent.mutateAsync({ id: editingEvent.id, ...eventData });
                toast.success('Event show updated successfully');
            } else {
                await createEvent.mutateAsync(eventData);
                toast.success('Event show created successfully');
            }
            setDialogOpen(false);
            setFormData(emptyFormData);
            setEditingEvent(null);
        } catch (error: any) {
            console.error('Error creating/updating show:', error);
            toast.error(editingEvent ? 'Failed to update show: ' + error.message : 'Failed to create show: ' + error.message);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteEvent.mutateAsync(id);
            toast.success('Event show deleted successfully');
        } catch (error) {
            toast.error('Failed to delete show');
        }
    };

    if (isLoading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const sortedEvents = React.useMemo(() => {
        if (!events) return [];
        let filtered = events;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(e =>
                e.title.toLowerCase().includes(query) ||
                e.venue?.toLowerCase().includes(query) ||
                e.organizer?.toLowerCase().includes(query)
            );
        }
        return [...filtered].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [events, searchQuery]);

    return (
        <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Event Schedule</h1>
                    <p className="text-muted-foreground">Manage upcoming events</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative w-full max-w-sm hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
                        <Input
                            placeholder="Search events..."
                            className="pl-10 h-10 rounded-full bg-white border border-slate-200 focus:ring-2 focus:ring-primary/20 transition-all duration-300 placeholder:text-black text-black"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button onClick={openCreateDialog} className="rounded-full bg-indigo-600 hover:bg-indigo-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Show
                    </Button>
                </div>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingEvent ? 'Edit Event Show' : 'Create Event Show'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="event">Event</Label>
                            {/* If editing, maybe just show title vs select? For now select is fine */}
                            <Select
                                value={formData.title}
                                onValueChange={(value) => setFormData({ ...formData, title: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an event" />
                                </SelectTrigger>
                                <SelectContent>
                                    {uniqueEvents.map((e: any) => (
                                        <SelectItem key={e.id} value={e.title}>
                                            {e.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="venue">Venue</Label>
                            <Select
                                value={formData.venue}
                                onValueChange={(value) => setFormData({ ...formData, venue: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a venue" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredVenues?.map((v: any) => (
                                        <SelectItem key={v.id} value={v.id}>
                                            {v.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="layout">Seat Layout (Optional)</Label>
                            <Select
                                value={formData.layout}
                                onValueChange={(value) => setFormData({ ...formData, layout: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a layout" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="standard">Standard Layout</SelectItem>
                                    <SelectItem value="concert">Concert Layout</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="date">Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="time">Time</Label>
                                <Input
                                    id="time"
                                    type="time"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <Label htmlFor="regular">Regular (₹)</Label>
                                <Input
                                    id="regular"
                                    type="number"
                                    value={formData.price_regular}
                                    onChange={(e) => setFormData({ ...formData, price_regular: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="vip">VIP (₹)</Label>
                                <Input
                                    id="vip"
                                    type="number"
                                    value={formData.price_vip}
                                    onChange={(e) => setFormData({ ...formData, price_vip: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="vvip">VVIP (₹)</Label>
                                <Input
                                    id="vvip"
                                    type="number"
                                    value={formData.price_vvip}
                                    onChange={(e) => setFormData({ ...formData, price_vvip: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" className="bg-primary text-white">Create Event Show</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="space-y-4">
                {sortedEvents.map((event) => (
                    <Card key={event.id} className="overflow-hidden">
                        <CardContent className="p-0 flex flex-col md:flex-row">
                            <div className="w-full md:w-48 h-32 md:h-auto bg-muted relative">
                                {event.image_url ? (
                                    <img
                                        src={event.image_url}
                                        alt={event.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                        <Calendar className="h-10 w-10 text-gray-400" />
                                    </div>
                                )}
                                <div className="absolute top-2 left-2">
                                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                                        {event.category}
                                    </Badge>
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col justify-center">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-lg text-foreground">{event.title}</h3>
                                        <p className="text-sm text-muted-foreground">{event.organizer || 'City Event'}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={event.is_free ? 'outline' : 'default'} className={event.is_free ? 'text-green-600 border-green-600' : ''}>
                                            {event.is_free ? 'Free Entry' : `₹${event.price}`}
                                        </Badge>
                                        <div className="flex gap-1 ml-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(event)}>
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
                                                        <AlertDialogTitle>Delete Show</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete this show?
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(event.id)}>
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-primary" />
                                        <span>
                                            {format(new Date(event.date), 'MMM d, yyyy')} • {format(new Date(event.date), 'h:mm a')}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        <span className="truncate">{event.venue}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Ticket className="h-4 w-4 text-primary" />
                                        <span>{event.available_tickets} / {event.total_tickets} tickets</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {sortedEvents.length === 0 && (
                    <div className="text-center py-12">
                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground">No upcoming events</h3>
                        <p className="text-muted-foreground">Schedule sports or plays to see them here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminEventShows;
