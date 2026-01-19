import React, { useState } from 'react';
import { Plus, Pencil, Trash2, UtensilsCrossed, Loader2, Image as ImageIcon, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from "@/components/ui/switch";
import { useFoodItems, useCreateFoodItem, useUpdateFoodItem, useDeleteFoodItem, FoodItem } from '@/hooks/useFood';
import { toast } from 'sonner';

const emptyFormData: Omit<FoodItem, 'id'> = {
    name: '',
    description: '',
    category: 'Snacks',
    price: 0,
    type: 'Veg',
    image_url: '',
    is_available: true,
    preparation_time_mins: 10
};

const AdminFoodItems: React.FC = () => {
    const { data: foodItems, isLoading } = useFoodItems();
    const createFood = useCreateFoodItem();
    const updateFood = useUpdateFoodItem();
    const deleteFood = useDeleteFoodItem();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
    const [formData, setFormData] = useState(emptyFormData);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    const openCreateDialog = () => {
        setEditingItem(null);
        setFormData(emptyFormData);
        setDialogOpen(true);
    };

    const openEditDialog = (item: FoodItem) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            description: item.description || '',
            category: item.category,
            price: item.price,
            type: item.type,
            image_url: item.image_url || '',
            is_available: item.is_available,
            preparation_time_mins: item.preparation_time_mins || 10
        });
        setDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const itemData = {
                ...formData,
                price: Number(formData.price),
                preparation_time_mins: Number(formData.preparation_time_mins)
            };

            if (editingItem) {
                await updateFood.mutateAsync({ id: editingItem.id, ...itemData });
                toast.success('Food item updated successfully');
            } else {
                await createFood.mutateAsync(itemData);
                toast.success('Food item created successfully');
            }
            setDialogOpen(false);
            setFormData(emptyFormData);
            setEditingItem(null);
        } catch (error: any) {
            console.error('Error submitting food item:', error);
            toast.error(error.message || (editingItem ? 'Failed to update item' : 'Failed to create item'));
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteFood.mutateAsync(id);
            toast.success('Food item deleted successfully');
        } catch (error) {
            toast.error('Failed to delete item');
        }
    };

    const filteredItems = foodItems?.filter(item => {
        const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (isLoading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Popcorn': return 'bg-yellow-500/10 text-yellow-500';
            case 'Beverages': return 'bg-blue-500/10 text-blue-500';
            case 'Combos': return 'bg-purple-500/10 text-purple-500';
            default: return 'bg-slate-500/10 text-slate-500';
        }
    };

    return (
        <div className="p-6 lg:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Food & Beverages</h1>
                    <p className="text-muted-foreground">Manage your F&B menu and inventory</p>
                </div>
                <Button onClick={openCreateDialog} className="rounded-full bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                </Button>
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 pb-6 border-b">
                    <div className="flex items-center gap-2">
                        <UtensilsCrossed className="h-5 w-5 text-muted-foreground" />
                        <CardTitle className="text-lg">Menu Items</CardTitle>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-[180px] rounded-full bg-white border-slate-200 text-black">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                <SelectItem value="Popcorn">Popcorn</SelectItem>
                                <SelectItem value="Beverages">Beverages</SelectItem>
                                <SelectItem value="Combos">Combos</SelectItem>
                                <SelectItem value="Snacks">Snacks</SelectItem>
                                <SelectItem value="Desserts">Desserts</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="relative flex-1 sm:w-[250px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
                            <Input
                                placeholder="Search items..."
                                className="pl-10 h-10 rounded-full bg-white border border-slate-200 focus:ring-2 focus:ring-primary/20 transition-all duration-300 placeholder:text-black text-black"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredItems?.map((item) => (
                            <Card key={item.id} className="overflow-hidden bg-card hover:shadow-lg transition-shadow border-slate-200 dark:border-slate-800">
                                <div className="relative h-48 bg-slate-100 dark:bg-slate-900 group">
                                    {item.image_url ? (
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <UtensilsCrossed className="h-12 w-12 text-slate-300 dark:text-slate-700" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2">
                                        <Badge className={item.is_available ? 'bg-green-500' : 'bg-red-500'}>
                                            {item.is_available ? 'In Stock' : 'Out of Stock'}
                                        </Badge>
                                    </div>
                                    <div className="absolute top-2 left-2">
                                        <Badge variant="secondary" className={`${item.type === 'Non-Veg' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'} border-0`}>
                                            {item.type === 'Non-Veg' ? '● ' : '● '}{item.type}
                                        </Badge>
                                    </div>
                                </div>

                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <Badge variant="outline" className={`mb-2 ${getCategoryColor(item.category)} border-0`}>
                                                {item.category}
                                            </Badge>
                                            <h3 className="font-semibold text-lg text-foreground line-clamp-1" title={item.name}>
                                                {item.name}
                                            </h3>
                                        </div>
                                        <p className="font-bold text-lg text-primary">₹{item.price}</p>
                                    </div>

                                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px] mb-4">
                                        {item.description}
                                    </p>

                                    <div className="flex justify-end gap-2 pt-2 border-t border-border">
                                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(item)}>
                                            <Pencil className="h-4 w-4 mr-1" /> Edit
                                        </Button>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Item</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to delete "{item.name}"?
                                                        <br />
                                                        This will remove it from the menu immediately.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-destructive hover:bg-destructive/90">
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {filteredItems?.length === 0 && (
                        <div className="text-center py-16">
                            <UtensilsCrossed className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-foreground">No food items found</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                                {searchQuery || categoryFilter !== 'all' ? 'Try adjusting your filters.' : 'Get started by adding items to your menu.'}
                            </p>
                            {!searchQuery && categoryFilter === 'all' && (
                                <Button onClick={openCreateDialog} className="mt-6 rounded-full bg-indigo-600 hover:bg-indigo-700">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add First Item
                                </Button>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingItem ? 'Edit Food Item' : 'Add New Item'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <Label htmlFor="name">Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    placeholder="e.g. Large Caramel Popcorn"
                                />
                            </div>

                            <div className="col-span-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description || ''}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="e.g. Freshly popped corn coated with rich caramel"
                                />
                            </div>

                            <div>
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Popcorn">Popcorn</SelectItem>
                                        <SelectItem value="Beverages">Beverages</SelectItem>
                                        <SelectItem value="Combos">Combos</SelectItem>
                                        <SelectItem value="Snacks">Snacks</SelectItem>
                                        <SelectItem value="Desserts">Desserts</SelectItem>
                                        <SelectItem value="Regional">Regional Special</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="type">Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Veg">Veg</SelectItem>
                                        <SelectItem value="Non-Veg">Non-Veg</SelectItem>
                                        <SelectItem value="Egg">Egg</SelectItem>
                                        <SelectItem value="Vegan">Vegan</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="price">Price (₹) *</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="prep_time">Prep Time (mins)</Label>
                                <Input
                                    id="prep_time"
                                    type="number"
                                    min="0"
                                    value={formData.preparation_time_mins}
                                    onChange={(e) => setFormData({ ...formData, preparation_time_mins: Number(e.target.value) })}
                                />
                            </div>

                            <div className="col-span-2">
                                <Label htmlFor="image_url">Image URL</Label>
                                <Input
                                    id="image_url"
                                    value={formData.image_url || ''}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="col-span-2 flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                                <div className="space-y-0.5">
                                    <Label>Available</Label>
                                    <div className="text-sm text-muted-foreground">
                                        Show this item in the menu
                                    </div>
                                </div>
                                <Switch
                                    checked={formData.is_available}
                                    onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createFood.isPending || updateFood.isPending}>
                                {(createFood.isPending || updateFood.isPending) ? 'Saving...' : editingItem ? 'Update Item' : 'Create Item'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminFoodItems;
