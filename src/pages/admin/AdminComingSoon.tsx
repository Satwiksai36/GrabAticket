import React, { useState } from 'react';
import { useAdminComingSoon, useCreateComingSoon, useUpdateComingSoon, useDeleteComingSoon } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Trash2, Edit2, Calendar, Image as ImageIcon, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const CATEGORIES = ['Movies', 'Events', 'Plays', 'Sports'];

const AdminComingSoon: React.FC = () => {
    const { data: items, isLoading } = useAdminComingSoon();
    const createMutation = useCreateComingSoon();
    const updateMutation = useUpdateComingSoon();
    const deleteMutation = useDeleteComingSoon();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredItems = React.useMemo(() => {
        if (!items) return [];
        const data = items as any[];
        if (!searchQuery) return data;

        const query = searchQuery.toLowerCase();
        return data.filter(i =>
            i.title.toLowerCase().includes(query) ||
            i.category.toLowerCase().includes(query) ||
            (i.release_date?.toLowerCase().includes(query) ?? false)
        );
    }, [items, searchQuery]);

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        try {
            await createMutation.mutateAsync({
                title: formData.get('title') as string,
                category: formData.get('category') as string,
                image_url: formData.get('image_url') as string,
                release_date: formData.get('release_date') as string,
            });
            setIsCreateOpen(false);
            toast.success('Added to Coming Soon');
        } catch (error: any) {
            console.error('Create error:', error);
            toast.error(`Failed to create: ${error.message || 'Unknown error'}`);
        }
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingId) return;

        const formData = new FormData(e.currentTarget);
        try {
            await updateMutation.mutateAsync({
                id: editingId,
                title: formData.get('title') as string,
                category: formData.get('category') as string,
                image_url: formData.get('image_url') as string,
                release_date: formData.get('release_date') as string,
            });
            setEditingId(null);
            toast.success('Updated successfully');
        } catch (error: any) {
            console.error('Update error:', error);
            toast.error(`Failed to update: ${error.message || 'Unknown error'}`);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return;
        try {
            await deleteMutation.mutateAsync(id);
            toast.success('Deleted successfully');
        } catch (error: any) {
            console.error('Delete error:', error);
            toast.error(`Failed to delete: ${error.message || 'Unknown error'}`);
        }
    };

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="p-6 lg:p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Coming Soon</h1>
                    <p className="text-muted-foreground">Manage upcoming movies, events, plays, and sports.</p>
                </div>
                <div className="relative w-full max-w-sm hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
                    <Input
                        placeholder="Search coming soon..."
                        className="pl-10 h-10 rounded-full bg-white border border-slate-200 focus:ring-2 focus:ring-primary/20 transition-all duration-300 placeholder:text-black text-black"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-full bg-indigo-600 hover:bg-indigo-700">
                            <Plus className="mr-2 h-4 w-4" /> Add New Item
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Add Coming Soon Item</DialogTitle>
                            <DialogDescription>Showcase a new upcoming attraction.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" name="title" required placeholder="e.g. Avatar 3" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select name="category" defaultValue="Movies" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map(cat => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="image_url">Image URL</Label>
                                <div className="flex gap-2">
                                    <Input id="image_url" name="image_url" required placeholder="https://..." />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="release_date">Release Date / Text</Label>
                                <Input id="release_date" name="release_date" placeholder="e.g. Summer 2025" />
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={createMutation.isPending}>
                                    {createMutation.isPending ? 'Adding...' : 'Add Item'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>



            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredItems?.map((item) => (
                    <Card key={item.id} className="group relative overflow-hidden">
                        <div className="aspect-[2/3] relative bg-slate-100">
                            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Dialog open={editingId === item.id} onOpenChange={(open) => setEditingId(open ? item.id : null)}>
                                    <DialogTrigger asChild>
                                        <Button size="icon" variant="secondary">
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md text-foreground">
                                        <DialogHeader>
                                            <DialogTitle>Edit Item</DialogTitle>
                                        </DialogHeader>
                                        <form onSubmit={handleUpdate} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="title">Title</Label>
                                                <Input id="title" name="title" required defaultValue={item.title} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="category">Category</Label>
                                                <Select name="category" defaultValue={item.category}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {CATEGORIES.map(cat => (
                                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="image_url">Image URL</Label>
                                                <Input id="image_url" name="image_url" required defaultValue={item.image_url} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="release_date">Release Date</Label>
                                                <Input id="release_date" name="release_date" defaultValue={item.release_date} />
                                            </div>
                                            <DialogFooter>
                                                <Button type="submit" disabled={updateMutation.isPending}>
                                                    {updateMutation.isPending ? 'Updating...' : 'Update'}
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                                <Button
                                    size="icon"
                                    variant="destructive"
                                    onClick={() => handleDelete(item.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <Badge className="absolute top-2 right-2">{item.category}</Badge>
                        </div>
                        <CardContent className="p-3">
                            <h3 className="font-semibold line-clamp-1" title={item.title}>{item.title}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                <Calendar className="h-3 w-3" /> {item.release_date || 'TBA'}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredItems?.length === 0 && (
                <div className="text-center py-12 col-span-full">
                    {searchQuery ? (
                        <div className="flex flex-col items-center">
                            <h3 className="text-lg font-medium text-foreground">No matching items</h3>
                            <p className="text-muted-foreground">Try adjusting your search query.</p>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default AdminComingSoon;
