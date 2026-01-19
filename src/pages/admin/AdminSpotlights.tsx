import React, { useState } from 'react';
import { Plus, Loader2, Pencil, Trash2, Eye, EyeOff, Save, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAdminSpotlights, useCreateSpotlight, useUpdateSpotlight, useDeleteSpotlight, Spotlight } from '@/hooks/useSpotlights';
import { useAdminMovies, useAdminComingSoon } from '@/hooks/useAdmin';
import { toast } from 'sonner';

const AdminSpotlights: React.FC = () => {
    const { data: spotlights, isLoading } = useAdminSpotlights();
    const { data: movies } = useAdminMovies();
    const { data: comingSoonItems } = useAdminComingSoon();
    const createSpotlight = useCreateSpotlight();
    const updateSpotlight = useUpdateSpotlight();
    const deleteSpotlight = useDeleteSpotlight();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSpotlight, setEditingSpotlight] = useState<Spotlight | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredSpotlights = React.useMemo(() => {
        if (!spotlights) return [];
        if (!searchQuery) return spotlights;

        const query = searchQuery.toLowerCase();
        return spotlights.filter(s =>
            s.title.toLowerCase().includes(query) ||
            s.category.toLowerCase().includes(query) ||
            (s.description?.toLowerCase() || "").includes(query)
        );
    }, [spotlights, searchQuery]);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image_url: '',
        category: 'other',
        link: '',
        trailer_url: '',
        priority: 0,
        active: true,
    });

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            image_url: '',
            category: 'other',
            link: '',
            trailer_url: '',
            priority: 0,
            active: true,
        });
        setEditingSpotlight(null);
    };

    const handleOpenDialog = (spotlight?: Spotlight) => {
        if (spotlight) {
            setEditingSpotlight(spotlight);
            setFormData({
                title: spotlight.title,
                description: spotlight.description || '',
                image_url: spotlight.image_url || '',
                category: spotlight.category,
                link: spotlight.link || '',
                trailer_url: spotlight.trailer_url || '',
                priority: spotlight.priority,
                active: spotlight.active,
            });
        } else {
            resetForm();
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingSpotlight) {
                await updateSpotlight.mutateAsync({
                    id: editingSpotlight.id,
                    ...formData,
                } as any);
                toast.success('Spotlight updated');
            } else {
                await createSpotlight.mutateAsync(formData as any);
                toast.success('Spotlight created');
            }
            setIsDialogOpen(false);
            resetForm();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Failed to save spotlight');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this spotlight?')) {
            try {
                await deleteSpotlight.mutateAsync(id);
                toast.success('Spotlight deleted');
            } catch (error) {
                toast.error('Failed to delete spotlight');
            }
        }
    };

    const handleToggleActive = async (spotlight: Spotlight) => {
        try {
            await updateSpotlight.mutateAsync({ id: spotlight.id, active: !spotlight.active });
            toast.success(`Spotlight ${spotlight.active ? 'deactivated' : 'activated'}`);
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleAutoFillSelect = (id: string) => {
        // Check Movies
        const movie = movies?.find(m => m.id === id);
        if (movie) {
            setFormData(prev => ({
                ...prev,
                title: movie.title,
                description: movie.description || '',
                image_url: movie.banner_url || movie.poster_url || '',
                category: 'movie',
                link: `/movies/${movie.id}`,
                trailer_url: movie.trailer_url || '',
                active: true
            }));
            return;
        }

        // Check Coming Soon
        const comingSoon = comingSoonItems?.find(c => c.id === id);
        if (comingSoon) {
            setFormData(prev => ({
                ...prev,
                title: comingSoon.title,
                description: `Releasing: ${new Date(comingSoon.release_date).toLocaleDateString()}`,
                image_url: comingSoon.image_url || '',
                category: 'coming_soon',
                link: '',
                trailer_url: '',
                active: true
            }));
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
                    <h1 className="text-2xl font-bold text-foreground">Spotlights</h1>
                    <p className="text-muted-foreground">Manage homepage spotlight banners</p>
                </div>
                <div className="relative w-full max-w-sm hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
                    <Input
                        placeholder="Search spotlights..."
                        className="pl-10 h-10 rounded-full bg-white border border-slate-200 focus:ring-2 focus:ring-primary/20 transition-all duration-300 placeholder:text-black text-black"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button onClick={() => handleOpenDialog()} className="rounded-full bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Spotlight
                </Button>
            </div>



            <div className="grid grid-cols-1 gap-4">
                {filteredSpotlights?.map((spotlight) => (
                    <Card key={spotlight.id} className={!spotlight.active ? 'opacity-60' : ''}>
                        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center">
                            {/* Thumbnail */}
                            <div className="w-full md:w-32 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                                {spotlight.image_url ? (
                                    <img src={spotlight.image_url} alt={spotlight.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No Image</div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold truncate">{spotlight.title}</h3>
                                    <Badge variant="secondary">{spotlight.category}</Badge>
                                    {!spotlight.active && <Badge variant="destructive">Inactive</Badge>}
                                </div>
                                <p className="text-sm text-muted-foreground truncate">{spotlight.description}</p>
                                <p className="text-xs text-muted-foreground mt-1">Priority: {spotlight.priority}</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleToggleActive(spotlight)} title={spotlight.active ? "Deactivate" : "Activate"}>
                                    {spotlight.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(spotlight)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(spotlight.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {filteredSpotlights?.length === 0 && (
                    <div className="text-center py-12 border rounded-lg border-dashed">
                        {searchQuery ? (
                            <p className="text-muted-foreground">No spotlights found matching your search.</p>
                        ) : (
                            <p className="text-muted-foreground">No spotlights found. Create one to display on the homepage.</p>
                        )}
                    </div>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingSpotlight ? 'Edit Spotlight' : 'Add Spotlight'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!editingSpotlight && (
                            <div className="space-y-2 pb-4 border-b">
                                <Label>Select Content to Auto-fill (Optional)</Label>
                                <Select onValueChange={handleAutoFillSelect}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select movie or upcoming event..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Movies</SelectLabel>
                                            {movies?.map((movie: any) => (
                                                <SelectItem key={movie.id} value={movie.id}>{movie.title}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                        <SelectGroup>
                                            <SelectLabel>Coming Soon</SelectLabel>
                                            {comingSoonItems?.map((item: any) => (
                                                <SelectItem key={item.id} value={item.id}>{item.title}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                placeholder="e.g. Summer Sale"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(val) => setFormData({ ...formData, category: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="movie">Movie</SelectItem>
                                    <SelectItem value="coming_soon">Coming Soon</SelectItem>
                                    <SelectItem value="event">Event</SelectItem>
                                    <SelectItem value="sport">Sport</SelectItem>
                                    <SelectItem value="play">Play</SelectItem>
                                    <SelectItem value="discount">Discount</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Short description for the banner"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image_url">Image URL</Label>
                            <Input
                                id="image_url"
                                value={formData.image_url}
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="link">Link Target (Optional)</Label>
                            <Input
                                id="link"
                                value={formData.link}
                                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                placeholder="/movies or https://external.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="trailer_url">Trailer URL (Optional)</Label>
                            <Input
                                id="trailer_url"
                                value={formData.trailer_url}
                                onChange={(e) => setFormData({ ...formData, trailer_url: e.target.value })}
                                placeholder="https://www.youtube.com/watch?v=..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="priority">Priority Order</Label>
                                <Input
                                    id="priority"
                                    type="number"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                                    placeholder="0"
                                />
                                <p className="text-xs text-muted-foreground">Higher appears first</p>
                            </div>

                            <div className="space-y-2 flex flex-col justify-end pb-2">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="active"
                                        checked={formData.active}
                                        onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                                    />
                                    <Label htmlFor="active">Active Status</Label>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit">
                                <Save className="mr-2 h-4 w-4" />
                                Save Spotlight
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminSpotlights;
