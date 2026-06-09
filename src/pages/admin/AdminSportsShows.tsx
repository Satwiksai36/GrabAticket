import React, { useState } from 'react';
import { useAdminEvents, useCreateEvent, useUpdateEvent, useDeleteEvent, useAdminTheatres } from '@/hooks/useAdmin';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Ticket, Loader2, Trophy, Plus, Pencil, Trash2, Search } from 'lucide-react';
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
    event_id: '',
    title: '',
    venue: '',
    layout: '',
    date: '',
    time: '',
    price_general: '',
    price_premium: '',
    price_corporate: '',
};

const AdminSportsShows: React.FC = () => {
    const { data: events, isLoading } = useAdminEvents();
    const { data: venues } = useAdminTheatres('sports_venue');
    const createEvent = useCreateEvent();
    const updateEvent = useUpdateEvent();
    const deleteEvent = useDeleteEvent();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<any>(null);
    const [formData, setFormData] = useState(emptyFormData);
    const [searchQuery, setSearchQuery] = useState("");

    // Client-side filtering for venues
    const filteredVenues = React.useMemo(() => {
        if (!venues) return [];
        return venues.filter(v => v.facilities?.includes('_type:sports_venue') || v.type === 'sports_venue');
    }, [venues]);

    const uniqueSports = React.useMemo(() => {
        if (!events) return [];
        const seen = new Set();
        const sportCategories = ['Sports', 'Cricket', 'Football', 'Kabaddi', 'Badminton', 'Tennis', 'Hockey', 'Basketball'];
        return events
            .filter(e => sportCategories.includes(e.category))
            .filter(e => {
                // Determine uniqueness based on title
                if (seen.has(e.title)) return false;
                seen.add(e.title);
                return true;
            });
    }, [events]);

    const openCreateDialog = () => {
        setEditingEvent(null);
        setFormData(emptyFormData);
        setDialogOpen(true);
    };

    const openEditDialog = (event: any) => {
        setEditingEvent(event);
        const dateObj = new Date(event.date);
        setFormData({
            event_id: event.id,
            title: event.title,
            venue: (Object.values(venues || {}).find((v: any) => v.name === event.venue) as any)?.id || '',
            layout: '',
            date: format(dateObj, 'yyyy-MM-dd'),
            time: format(dateObj, 'HH:mm'),
            price_general: event.price?.toString() || '',
            price_premium: '',
            price_corporate: '',
        });
        setDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!formData.title || formData.title === 'new' || !formData.date || !formData.time || !formData.venue) {
                toast.error('Please fill in all required fields (Sport, Venue, Date, Time)');
                return;
            }

            const selectedTemplate = uniqueSports.find(e => e.title === formData.title);
            const selectedVenue = venues?.find(v => v.id === formData.venue);

            const eventDateTime = `${formData.date}T${formData.time}:00+05:30`;

            const eventData = {
                title: formData.title || (selectedTemplate?.title || 'New Match'),
                description: selectedTemplate?.description || '',
                image_url: selectedTemplate?.image_url || '',
                date: eventDateTime,
                venue: selectedVenue?.name || 'TBA',
                category: selectedTemplate?.category || 'Sports',
                price: parseFloat(formData.price_general) || 0,
                is_free: false,
                total_tickets: 5000,
                available_tickets: 5000,
                organizer: selectedTemplate?.organizer || 'Organizer',
                district_id: selectedVenue?.district_id,
                // duration: (selectedTemplate as any)?.duration || 180, // Not in DB
                // language: (selectedTemplate as any)?.language || 'English', // Not in DB
                // is_active: true, // Not in DB
            };

            if (editingEvent) {
                await updateEvent.mutateAsync({ id: editingEvent.id, ...eventData });
                toast.success('Match updated successfully');
            } else {
                await createEvent.mutateAsync(eventData);
                toast.success('Match created successfully');
            }
            setDialogOpen(false);
            setFormData(emptyFormData);
            setEditingEvent(null);
        } catch (error: any) {
            console.error('Error creating/updating sport show:', error);
            toast.error(editingEvent ? 'Failed to update match: ' + error.message : 'Failed to create match: ' + error.message);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteEvent.mutateAsync(id);
            toast.success('Match deleted successfully');
        } catch (error) {
            toast.error('Failed to delete match');
        }
    };

    if (isLoading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const sportsEvents = React.useMemo(() => {
        if (!events) return [];
        const sportCategories = ['Sports', 'Cricket', 'Football', 'Kabaddi', 'Badminton', 'Tennis', 'Hockey', 'Basketball'];
        let filtered = events.filter(event => sportCategories.includes(event.category));

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(event =>
                event.title.toLowerCase().includes(query) ||
                event.venue?.toLowerCase().includes(query) ||
                event.organizer?.toLowerCase().includes(query)
            );
        }

        return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [events, searchQuery]);

    return (
        <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Sports Schedule</h1>
                    <p className="text-muted-foreground">Upcoming matches and tournaments</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative w-full max-w-sm hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
                        <Input
                            placeholder="Search matches..."
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
                        <DialogTitle>{editingEvent ? 'Edit Sports Show' : 'Create Sports Show'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="sport">Sport/Match</Label>
                            <Select
                                value={formData.title}
                                onValueChange={(value) => setFormData({ ...formData, title: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a sport" />
                                </SelectTrigger>
                                <SelectContent>
                                    {uniqueSports.length > 0 ? (
                                        uniqueSports.map((e: any) => (
                                            <SelectItem key={e.id as any} value={e.title}>
                                                {e.title}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="new">Create New Sport in Events First</SelectItem>
                                    )}
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
                                    <SelectItem value="stadium">Stadium Layout</SelectItem>
                                    <SelectItem value="ground">Ground Layout</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="date">Match Date *</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="time">Match Time *</Label>
                                <Input
                                    id="time"
                                    type="time"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <Label htmlFor="general">General (₹)</Label>
                                <Input
                                    id="general"
                                    type="number"
                                    value={formData.price_general}
                                    onChange={(e) => setFormData({ ...formData, price_general: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="premium">Premium (₹)</Label>
                                <Input
                                    id="premium"
                                    type="number"
                                    value={formData.price_premium}
                                    onChange={(e) => setFormData({ ...formData, price_premium: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="corporate">Corporate (₹)</Label>
                                <Input
                                    id="corporate"
                                    type="number"
                                    value={formData.price_corporate}
                                    onChange={(e) => setFormData({ ...formData, price_corporate: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" className="bg-primary text-white">Create Sports Show</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="space-y-4">
                {sportsEvents.map((event) => (
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
                                        <Trophy className="h-10 w-10 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div className="p-5 flex-1 flex flex-col justify-center">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-lg text-foreground">{event.title}</h3>
                                        <p className="text-sm text-muted-foreground">{event.organizer}</p>
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
                                                        <AlertDialogTitle>Delete Match</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete this match?
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

                {sportsEvents.length === 0 && (
                    <div className="text-center py-12">
                        <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground">No sports events scheduled</h3>
                        <p className="text-muted-foreground">Go to the Sports page to create new matches.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSportsShows;
