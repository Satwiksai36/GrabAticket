import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Trophy, Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useAdminEvents, useCreateEvent, useUpdateEvent, useDeleteEvent, useDistricts, useAdminTheatres } from '@/hooks/useAdmin';
import { toast } from 'sonner';
import { format } from 'date-fns';

const emptyFormData = {
    title: '',
    description: '',
    image_url: '',
    organizer: '',
    league: '', // League/Tournament
    sport_type: '', // Category
    home_team: '',
    away_team: '',
    is_active: true,
};

const AdminSports: React.FC = () => {
    const { data: allEvents, isLoading } = useAdminEvents();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const sportCategories = ['Cricket', 'Football', 'Kabaddi', 'Badminton', 'Tennis', 'Hockey', 'Basketball'];

    const filteredEvents = React.useMemo(() => {
        if (!allEvents) return [];
        let sports = allEvents.filter(e => e.category === 'Sports' || sportCategories.includes(e.category));

        if (selectedCategory !== "All") {
            sports = sports.filter(e => e.category === selectedCategory);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            sports = sports.filter(event =>
                event.title.toLowerCase().includes(query) ||
                (event as any).league?.toLowerCase().includes(query) ||
                event.organizer?.toLowerCase().includes(query) ||
                (event as any).home_team?.toLowerCase().includes(query) ||
                (event as any).away_team?.toLowerCase().includes(query)
            );
        }
        return sports;
    }, [allEvents, searchQuery, selectedCategory]);

    const { data: cities } = useDistricts();
    const { data: venues } = useAdminTheatres('sports_venue');
    const createEvent = useCreateEvent();
    const updateEvent = useUpdateEvent();
    const deleteEvent = useDeleteEvent();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<any>(null);
    const [formData, setFormData] = useState(emptyFormData);

    const openCreateDialog = () => {
        setEditingEvent(null);
        setFormData(emptyFormData);
        setDialogOpen(true);
    };

    const openEditDialog = (event: any) => {
        setEditingEvent(event);
        setFormData({
            title: event.title || '',
            description: event.description || '',
            image_url: event.image_url || '',
            organizer: event.organizer || '',
            league: (event as any).league || '',
            sport_type: event.category === 'Sports' ? '' : event.category || '', // If generic 'Sports', leave empty to force selection or handle otherwise
            home_team: (event as any).home_team || '',
            away_team: (event as any).away_team || '',
            is_active: event.is_active ?? true,
        });
        setDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const eventDate = new Date().toISOString();

            const eventData = {
                title: formData.title,
                description: formData.description || null,
                image_url: formData.image_url || null,
                date: eventDate,
                venue: 'To Be Announced',
                category: formData.sport_type || 'Sports', // Use selected sport type or default
                price: 0,
                is_free: false,
                total_tickets: 0,
                available_tickets: 0,
                organizer: formData.organizer || null,
                league: formData.league || null,
                district_id: undefined,
                home_team: formData.home_team || null,
                away_team: formData.away_team || null,
                is_active: formData.is_active,
            };

            if (editingEvent) {
                await updateEvent.mutateAsync({ id: editingEvent.id, ...eventData });
                toast.success('Sports event updated successfully');
            } else {
                await createEvent.mutateAsync(eventData);
                toast.success('Sports event created successfully');
            }
            setDialogOpen(false);
            setFormData(emptyFormData);
            setEditingEvent(null);
        } catch (error: any) {
            console.error('Error creating/updating sport:', error);
            toast.error(editingEvent ? 'Failed to update event: ' + error.message : 'Failed to create event: ' + error.message);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteEvent.mutateAsync(id);
            toast.success('Event deleted successfully');
        } catch (error) {
            toast.error('Failed to delete event');
        }
    };

    if (isLoading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Sports</h1>
                    <p className="text-muted-foreground">Manage matches and tournaments</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative w-full max-w-sm hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
                        <Input
                            placeholder="Search sports..."
                            className="pl-10 h-10 rounded-full bg-white border border-slate-200 focus:ring-2 focus:ring-primary/20 transition-all duration-300 placeholder:text-black text-black"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button onClick={openCreateDialog} className="rounded-full bg-indigo-600 hover:bg-indigo-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Sport
                    </Button>
                </div>
            </div>

            <div className="mb-8">
                <Tabs defaultValue="All" value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
                    <TabsList className="w-full md:w-auto inline-flex h-12 items-center justify-start rounded-full bg-slate-300 p-1 text-black overflow-x-auto no-scrollbar">
                        <TabsTrigger
                            value="All"
                            className="rounded-full px-6 py-2 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm transition-all whitespace-nowrap"
                        >
                            All Sports
                        </TabsTrigger>
                        {sportCategories.map(cat => (
                            <TabsTrigger
                                key={cat}
                                value={cat}
                                className="rounded-full px-6 py-2 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm transition-all whitespace-nowrap"
                            >
                                {cat}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>{editingEvent ? 'Edit Sport' : 'Add New Sport'}</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto pr-2">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <Label htmlFor="title">Title (e.g., IPL 2025 - MI vs CSK)</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="sport_type">Sport Type</Label>
                                    <Select
                                        value={formData.sport_type}
                                        onValueChange={(value) => setFormData({ ...formData, sport_type: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select sport" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['Cricket', 'Football', 'Kabaddi', 'Badminton', 'Tennis', 'Hockey', 'Basketball'].map((sport) => (
                                                <SelectItem key={sport} value={sport}>
                                                    {sport}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="league">League/Tournament</Label>
                                    <Input
                                        id="league"
                                        value={formData.league}
                                        onChange={(e) => setFormData({ ...formData, league: e.target.value })}
                                        placeholder="e.g., IPL 2025"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="organizer">Organizer</Label>
                                    <Input
                                        id="organizer"
                                        value={formData.organizer}
                                        onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                                        placeholder="e.g. BCCI"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="home_team">Home Team</Label>
                                    <Input
                                        id="home_team"
                                        value={formData.home_team}
                                        onChange={(e) => setFormData({ ...formData, home_team: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="away_team">Away Team</Label>
                                    <Input
                                        id="away_team"
                                        value={formData.away_team}
                                        onChange={(e) => setFormData({ ...formData, away_team: e.target.value })}
                                    />
                                </div>

                                <div className="col-span-2">
                                    <Label htmlFor="image_url">Poster URL</Label>
                                    <Input
                                        id="image_url"
                                        value={formData.image_url}
                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    />
                                </div>

                                <div className="col-span-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="col-span-2 flex items-center space-x-2">
                                    <Switch
                                        id="is_active"
                                        checked={formData.is_active}
                                        onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                                    />
                                    <Label htmlFor="is_active">Active</Label>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={createEvent.isPending || updateEvent.isPending}>
                                    {(createEvent.isPending || updateEvent.isPending) ? 'Saving...' : editingEvent ? 'Update Sport' : 'Create Sport'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEvents?.map((event) => (
                    <Card key={event.id}>
                        <CardContent className="p-4">
                            <div className="flex gap-4">
                                <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                                    {event.image_url ? (
                                        <img
                                            src={event.image_url}
                                            alt={event.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Trophy className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-foreground truncate">{event.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {format(new Date(event.date), 'MMM d, yyyy')}
                                    </p>
                                    <p className="text-sm text-muted-foreground truncate">{event.venue}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="secondary">Sports</Badge>
                                        {event.is_free ? (
                                            <Badge variant="outline" className="text-green-600">Free</Badge>
                                        ) : (
                                            <Badge variant="outline">₹{event.price}</Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <span className="text-sm text-muted-foreground">
                                    {event.available_tickets}/{event.total_tickets} tickets
                                </span>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(event)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete Sport</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to delete "{event.title}"?
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
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredEvents?.length === 0 && (
                <div className="text-center py-12">
                    <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground">No sports events yet</h3>
                    <p className="text-muted-foreground">Get started by adding your first match.</p>
                </div>
            )}
        </div>
    );
};

export default AdminSports;
