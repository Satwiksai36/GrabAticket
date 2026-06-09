import React, { useState } from 'react';
import { useAdminAnnouncements, useCreateAnnouncement, useUpdateAnnouncement, useDeleteAnnouncement } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Loader2, Plus, Trash2, Edit2, Megaphone, Percent, Tag, Star, Bell, Gift, PartyPopper, Search } from 'lucide-react';
import { toast } from 'sonner';

const ICONS = {
    Megaphone,
    Percent,
    Tag,
    Star,
    Bell,
    Gift,
    PartyPopper
};

const PRESET_GRADIENTS = [
    { label: 'Pink/Purple (Movies)', from: 'from-pink-600', to: 'to-purple-700' },
    { label: 'Amber/Orange (Events)', from: 'from-amber-400', to: 'to-orange-500' },
    { label: 'Emerald/Teal (Sports)', from: 'from-emerald-500', to: 'to-teal-600' },
    { label: 'Violet/Purple (Plays)', from: 'from-violet-500', to: 'to-purple-600' },

    { label: 'Red/Rose', from: 'from-red-500', to: 'to-rose-600' },
    { label: 'Indigo/Blue', from: 'from-indigo-500', to: 'to-blue-600' },
];

const AdminAnnouncements: React.FC = () => {
    const { data: announcements, isLoading } = useAdminAnnouncements();
    const createMutation = useCreateAnnouncement();
    const updateMutation = useUpdateAnnouncement();
    const deleteMutation = useDeleteAnnouncement();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredAnnouncements = React.useMemo(() => {
        if (!announcements) return [];
        const items = announcements as any[];
        if (!searchQuery) return items;

        const query = searchQuery.toLowerCase();
        return items.filter(a =>
            a.title.toLowerCase().includes(query) ||
            a.content.toLowerCase().includes(query) ||
            (a.promo_code?.toLowerCase().includes(query) ?? false)
        );
    }, [announcements, searchQuery]);

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        try {
            await createMutation.mutateAsync({
                title: formData.get('title') as string,
                content: formData.get('content') as string,
                icon_type: formData.get('icon_type') as string,
                color_from: formData.get('color_from') as string,
                color_to: formData.get('color_to') as string,
                priority: Number(formData.get('priority')) || 0,
                is_active: true,
                promo_code: formData.get('promo_code') as string
            });
            setIsCreateOpen(false);
            toast.success('Announcement created successfully');
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
                content: formData.get('content') as string,
                icon_type: formData.get('icon_type') as string,
                color_from: formData.get('color_from') as string,
                color_to: formData.get('color_to') as string,
                priority: Number(formData.get('priority')) || 0,
                promo_code: formData.get('promo_code') as string
            });
            setEditingId(null);
            toast.success('Announcement updated successfully');
        } catch (error: any) {
            console.error('Update error:', error);
            toast.error(`Failed to update: ${error.message || 'Unknown error'}`);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this announcement?')) return;
        try {
            await deleteMutation.mutateAsync(id);
            toast.success('Announcement deleted');
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
                    <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
                    <p className="text-muted-foreground">Manage homepage announcements and offers.</p>
                </div>
                <div className="relative w-full max-w-sm hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
                    <Input
                        placeholder="Search announcements..."
                        className="pl-10 h-10 rounded-full bg-white border border-slate-200 focus:ring-2 focus:ring-primary/20 transition-all duration-300 placeholder:text-black text-black"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-full bg-indigo-600 hover:bg-indigo-700">
                            <Plus className="mr-2 h-4 w-4" /> New Announcement
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create Announcement</DialogTitle>
                            <DialogDescription>Add a new announcement to the homepage.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" name="title" required placeholder="e.g. Special Offer" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="content">Content</Label>
                                <Textarea id="content" name="content" required placeholder="Description of the announcement..." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="promo_code">Promo Code</Label>
                                <Input id="promo_code" name="promo_code" placeholder="e.g. SUMMER2024 (Optional)" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="icon_type">Icon</Label>
                                    <Select name="icon_type" defaultValue="Megaphone">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select icon" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.keys(ICONS).map(icon => (
                                                <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="priority">Priority</Label>
                                    <Input id="priority" name="priority" type="number" defaultValue="0" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Gradient Style</Label>
                                <div className="grid grid-cols-1 gap-2">
                                    <Select name="preset_gradient" onValueChange={(val) => {
                                        const preset = PRESET_GRADIENTS.find(p => p.label === val);
                                        if (preset) {
                                            (document.getElementsByName('color_from')[0] as HTMLInputElement).value = preset.from;
                                            (document.getElementsByName('color_to')[0] as HTMLInputElement).value = preset.to;
                                        }
                                    }}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a preset (Optional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PRESET_GRADIENTS.map(p => (
                                                <SelectItem key={p.label} value={p.label}>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-4 h-4 rounded bg-gradient-to-br ${p.from} ${p.to}`} />
                                                        {p.label}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <Input name="color_from" placeholder="from-color-500" required defaultValue="from-pink-600" />
                                    <Input name="color_to" placeholder="to-color-700" required defaultValue="to-purple-700" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={createMutation.isPending}>
                                    {createMutation.isPending ? 'Creating...' : 'Create'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>



            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAnnouncements.map((announcement) => {
                    const Icon = ICONS[announcement.icon_type as keyof typeof ICONS] || Megaphone;
                    return (
                        <Card key={announcement.id} className={`group relative overflow-hidden text-white bg-gradient-to-br ${announcement.color_from} ${announcement.color_to}`}>
                            <div className="absolute right-[-20px] bottom-[-20px] opacity-20 transform rotate-12 transition-transform group-hover:scale-110 group-hover:rotate-6">
                                <Icon size={100} />
                            </div>
                            <CardHeader className="relative z-10 pb-2">
                                <div className="flex justify-between items-start">
                                    <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center backdrop-blur-sm mb-2">
                                        <Icon className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex gap-1">
                                        <Dialog open={editingId === announcement.id} onOpenChange={(open) => setEditingId(open ? announcement.id : null)}>
                                            <DialogTrigger asChild>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-white/20 text-white">
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto text-foreground">
                                                <DialogHeader>
                                                    <DialogTitle>Edit Announcement</DialogTitle>
                                                </DialogHeader>
                                                <form onSubmit={handleUpdate} className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="title">Title</Label>
                                                        <Input id="title" name="title" required defaultValue={announcement.title} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="content">Content</Label>
                                                        <Textarea id="content" name="content" required defaultValue={announcement.content} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="promo_code">Promo Code</Label>
                                                        <Input id="promo_code" name="promo_code" defaultValue={announcement.promo_code || ''} placeholder="e.g. SUMMER2024" />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="icon_type">Icon</Label>
                                                            <Select name="icon_type" defaultValue={announcement.icon_type}>
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {Object.keys(ICONS).map(icon => (
                                                                        <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="priority">Priority</Label>
                                                            <Input id="priority" name="priority" type="number" defaultValue={announcement.priority} />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Gradient</Label>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <Input name="color_from" defaultValue={announcement.color_from} />
                                                            <Input name="color_to" defaultValue={announcement.color_to} />
                                                        </div>
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
                                            variant="ghost"
                                            className="h-8 w-8 hover:bg-red-500/50 text-white"
                                            onClick={() => handleDelete(announcement.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <CardTitle className="text-xl font-bold">{announcement.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="relative z-10 text-white/90 text-sm">
                                {announcement.content}
                                {announcement.promo_code && (
                                    <div className="mt-2 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                        {announcement.promo_code}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default AdminAnnouncements;
