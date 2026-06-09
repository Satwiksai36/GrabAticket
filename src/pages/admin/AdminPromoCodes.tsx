import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Tag, Loader2, Calendar as CalendarIcon, Search } from 'lucide-react';
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
import { usePromoCodes, useCreatePromoCode, useUpdatePromoCode, useDeletePromoCode } from '@/hooks/useAdmin';
import { toast } from 'sonner';
import { format } from 'date-fns';

const emptyFormData = {
    code: '',
    description: '',
    discount_type: 'FIXED', // FIXED or PERCENTAGE
    discount_value: '',
    min_order_value: '',
    max_discount: '',
    start_date: '',
    end_date: '',
    usage_limit: '',
};

const AdminPromoCodes: React.FC = () => {
    const { data: promoCodes, isLoading } = usePromoCodes();
    const createPromo = useCreatePromoCode();
    const updatePromo = useUpdatePromoCode();
    const deletePromo = useDeletePromoCode();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingPromo, setEditingPromo] = useState<any>(null);
    const [formData, setFormData] = useState(emptyFormData);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredPromoCodes = React.useMemo(() => {
        if (!promoCodes) return [];
        if (!searchQuery) return promoCodes;

        const query = searchQuery.toLowerCase();
        return promoCodes.filter(p =>
            p.code.toLowerCase().includes(query) ||
            (p.description?.toLowerCase().includes(query) ?? false)
        );
    }, [promoCodes, searchQuery]);

    const openCreateDialog = () => {
        setEditingPromo(null);
        setFormData(emptyFormData);
        setDialogOpen(true);
    };

    const openEditDialog = (promo: any) => {
        setEditingPromo(promo);
        setFormData({
            code: promo.code,
            description: promo.description || '',
            discount_type: promo.discount_type || 'FIXED',
            discount_value: promo.discount_value?.toString() || '',
            min_order_value: promo.min_order_value?.toString() || '',
            max_discount: promo.max_discount?.toString() || '',
            start_date: promo.start_date ? format(new Date(promo.start_date), 'yyyy-MM-dd') : '',
            end_date: promo.end_date ? format(new Date(promo.end_date), 'yyyy-MM-dd') : '',
            usage_limit: promo.usage_limit?.toString() || '',
        });
        setDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const promoData = {
                code: formData.code.toUpperCase(),
                description: formData.description || undefined,
                discount_type: formData.discount_type,
                discount_value: parseFloat(formData.discount_value) || 0,
                min_order_value: formData.min_order_value ? parseFloat(formData.min_order_value) : undefined,
                max_discount: formData.max_discount ? parseFloat(formData.max_discount) : undefined,
                start_date: formData.start_date ? new Date(formData.start_date).toISOString() : undefined,
                end_date: formData.end_date ? new Date(formData.end_date).toISOString() : undefined,
                usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : undefined,
            };

            if (editingPromo) {
                await updatePromo.mutateAsync({ id: editingPromo.id, ...promoData });
                toast.success('Promo code updated successfully');
            } else {
                await createPromo.mutateAsync(promoData);
                toast.success('Promo code created successfully');
            }
            setDialogOpen(false);
            setFormData(emptyFormData);
            setEditingPromo(null);
        } catch (error) {
            toast.error(editingPromo ? 'Failed to update promo code' : 'Failed to create promo code');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deletePromo.mutateAsync(id);
            toast.success('Promo code deleted successfully');
        } catch (error) {
            toast.error('Failed to delete promo code');
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
                    <h1 className="text-2xl font-bold text-foreground">Promo Codes</h1>
                    <p className="text-muted-foreground">Manage discount codes and offers</p>
                </div>
                <div className="relative w-full max-w-sm hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
                    <Input
                        placeholder="Search promo codes..."
                        className="pl-10 h-10 rounded-full bg-white border border-slate-200 focus:ring-2 focus:ring-primary/20 transition-all duration-300 placeholder:text-black text-black"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button onClick={openCreateDialog} className="rounded-full bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Promo Code
                </Button>
            </div>



            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingPromo ? 'Edit Promo Code' : 'Add New Promo Code'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <Label htmlFor="code">Code *</Label>
                                <Input
                                    id="code"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    required
                                    placeholder="e.g. SUMMER2024"
                                />
                            </div>
                            <div className="col-span-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Description of the offer..."
                                />
                            </div>
                            <div>
                                <Label htmlFor="discount_type">Type</Label>
                                <Select
                                    value={formData.discount_type}
                                    onValueChange={(value) => setFormData({ ...formData, discount_type: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="FIXED">Fixed Amount (₹)</SelectItem>
                                        <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="discount_value">Value *</Label>
                                <Input
                                    id="discount_value"
                                    type="number"
                                    value={formData.discount_value}
                                    onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                                    required
                                    min="0"
                                />
                            </div>
                            <div>
                                <Label htmlFor="min_order_value">Min Order Value</Label>
                                <Input
                                    id="min_order_value"
                                    type="number"
                                    value={formData.min_order_value}
                                    onChange={(e) => setFormData({ ...formData, min_order_value: e.target.value })}
                                    min="0"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <Label htmlFor="max_discount">Max Discount</Label>
                                <Input
                                    id="max_discount"
                                    type="number"
                                    value={formData.max_discount}
                                    onChange={(e) => setFormData({ ...formData, max_discount: e.target.value })}
                                    min="0"
                                    placeholder="Optional"
                                    disabled={formData.discount_type === 'FIXED'}
                                />
                            </div>
                            <div>
                                <Label htmlFor="start_date">Start Date</Label>
                                <Input
                                    id="start_date"
                                    type="date"
                                    value={formData.start_date}
                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="end_date">End Date</Label>
                                <Input
                                    id="end_date"
                                    type="date"
                                    value={formData.end_date}
                                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="usage_limit">Usage Limit</Label>
                                <Input
                                    id="usage_limit"
                                    type="number"
                                    value={formData.usage_limit}
                                    onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                                    min="0"
                                    placeholder="Unlimited"
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createPromo.isPending || updatePromo.isPending}>
                                {(createPromo.isPending || updatePromo.isPending) ? 'Saving...' : editingPromo ? 'Update Code' : 'Create Code'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPromoCodes?.map((promo) => (
                    <Card key={promo.id}>
                        <CardContent className="p-5">
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Tag className="h-4 w-4 text-primary" />
                                        <h3 className="font-bold text-lg font-mono">{promo.code}</h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{promo.description || 'No description'}</p>
                                </div>
                                <Badge variant={promo.discount_type === 'PERCENTAGE' ? 'default' : 'secondary'}>
                                    {promo.discount_type === 'PERCENTAGE' ? `${promo.discount_value}% OFF` : `₹${promo.discount_value} OFF`}
                                </Badge>
                            </div>

                            <div className="border-t pt-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Validity:</span>
                                    <span>
                                        {promo.end_date ? format(new Date(promo.end_date), 'MMM d, yyyy') : 'No expiry'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Min Order:</span>
                                    <span>{promo.min_order_value ? `₹${promo.min_order_value}` : 'None'}</span>
                                </div>
                                {promo.max_discount && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Max Discount:</span>
                                        <span>₹{promo.max_discount}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 mt-4 pt-2 border-t border-dashed">
                                <Button variant="ghost" size="sm" onClick={() => openEditDialog(promo)}>
                                    <Pencil className="h-4 w-4 mr-2" /> Edit
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Promo Code</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete "{promo.code}"?
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(promo.id)}>
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

            {filteredPromoCodes?.length === 0 && (
                <div className="text-center py-12">
                    {searchQuery ? (
                        <div className="flex flex-col items-center">
                            <h3 className="text-lg font-medium text-foreground">No matching promo codes</h3>
                            <p className="text-muted-foreground">Try adjusting your search query.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-foreground">No promo codes</h3>
                            <p className="text-muted-foreground">Create discount codes to boost sales.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminPromoCodes;
