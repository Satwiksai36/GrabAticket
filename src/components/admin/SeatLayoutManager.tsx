import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Grid, Trash2, PenTool, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';
import { SeatDesigner } from './SeatDesigner';

interface SeatLayout {
    id: string;
    name: string;
    type: string;
    rows: number;
    columns: number;
    total_seats: number;
    layout_config: {
        rows: number;
        cols: number;
        seats: any[];
        style?: string;
    } | Json;
}

interface SeatLayoutManagerProps {
    type: string;
    onSelect: (layoutId: string) => void;
    selectedLayoutId?: string | null;
}

export const SeatLayoutManager: React.FC<SeatLayoutManagerProps> = ({ type, onSelect, selectedLayoutId }) => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [designLayout, setDesignLayout] = useState<SeatLayout | null>(null);
    const [layoutStyle, setLayoutStyle] = useState(
        type === 'stadium' ? 'stadium' :
            type === 'auditorium' ? 'auditorium' :
                'standard'
    );
    const [searchQuery, setSearchQuery] = useState("");
    const queryClient = useQueryClient();

    const { data: layouts, isLoading } = useQuery({
        queryKey: ['seat-layouts', type],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('seat_layouts')
                .select('*')
                .eq('type', type)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching seat layouts:', error);
                throw error;
            }
            return data as SeatLayout[];
        },
    });

    const filteredLayouts = React.useMemo(() => {
        if (!layouts) return [];
        if (!searchQuery) return layouts;

        const query = searchQuery.toLowerCase();
        return layouts.filter(layout =>
            layout.name.toLowerCase().includes(query)
        );
    }, [layouts, searchQuery]);

    const createMutation = useMutation({
        mutationFn: async (newLayout: Omit<SeatLayout, 'id' | 'created_at' | 'updated_at'>) => {
            const { data, error } = await supabase
                .from('seat_layouts')
                .insert(newLayout)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['seat-layouts'] });
            setIsCreateOpen(false);
            setLayoutStyle('standard');
            toast.success('Layout created successfully');
        },
        onError: (error) => {
            toast.error(`Failed to create layout: ${error.message}`);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('seat_layouts').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['seat-layouts'] });
            toast.success('Layout deleted successfully');
        }
    });

    const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const rows = Number(formData.get('rows'));
        const cols = Number(formData.get('columns'));

        // Simple default layout config: all seats enabled
        const layoutConfig: any = {
            rows,
            cols,
            style: layoutStyle,
            seats: []
        };

        // Generate simple grid
        for (let r = 1; r <= rows; r++) {
            for (let c = 1; c <= cols; c++) {
                layoutConfig.seats.push({ row: r, col: c, status: 'available', label: `${String.fromCharCode(64 + r)}${c}` });
            }
        }

        createMutation.mutate({
            name: formData.get('name') as string,
            type,
            rows,
            columns: cols,
            total_seats: rows * cols,
            layout_config: layoutConfig
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h3 className="text-lg font-medium">Seat Layouts</h3>
                    <div className="relative w-full max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
                        <Input
                            placeholder="Search layouts..."
                            className="pl-10 h-10 rounded-full bg-white border border-slate-200 focus:ring-2 focus:ring-primary/20 transition-all duration-300 placeholder:text-black text-black"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white" size="sm">
                            <Plus className="mr-2 h-4 w-4" /> New Layout
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create {type.charAt(0).toUpperCase() + type.slice(1)} Layout</DialogTitle>
                            <DialogDescription>Define the dimensions and style of the seating.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Layout Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder={`e.g. ${type === 'stadium' ? 'North Stand' : 'Screen 1 Standard'}`}
                                    required
                                />
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
                                <Button type="submit" disabled={createMutation.isPending}>
                                    {createMutation.isPending ? 'Creating...' : 'Create Layout'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog open={!!designLayout} onOpenChange={(open) => !open && setDesignLayout(null)}>
                    <DialogContent className="max-w-4xl p-0 overflow-hidden">
                        {designLayout && (
                            <SeatDesigner
                                layout={designLayout}
                                onClose={() => setDesignLayout(null)}
                            />
                        )}
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>
            ) : filteredLayouts?.length === 0 ? (
                <div className="text-center p-4 border rounded-md border-dashed text-muted-foreground">
                    No layouts found. Create one to get started.
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3">
                    {filteredLayouts?.map(layout => (
                        <Card
                            key={layout.id}
                            className={`cursor-pointer transition-colors hover:border-primary ${selectedLayoutId === layout.id ? 'border-primary bg-primary/5' : ''}`}
                            onClick={() => onSelect(layout.id)}
                        >
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="font-medium flex items-center gap-2">
                                        <Grid className="h-4 w-4 text-muted-foreground" />
                                        {layout.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {(layout.layout_config as any)?.style &&
                                            <span className="capitalize font-medium text-primary">{(layout.layout_config as any).style} • </span>
                                        }
                                        {layout.rows}x{layout.columns} • {layout.total_seats} seats
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    {selectedLayoutId === layout.id && <Badge variant="default" className="mr-2">Selected</Badge>}

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDesignLayout(layout);
                                        }}
                                        title="Design Seat Layout"
                                    >
                                        <PenTool className="h-4 w-4" />
                                    </Button>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete Layout</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to delete this layout? This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    className="bg-destructive hover:bg-destructive/90"
                                                    onClick={(e) => {
                                                        deleteMutation.mutate(layout.id);
                                                    }}
                                                >
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
            )}

            {/* Full Screen Designer Dialog */}
            <Dialog open={!!designLayout} onOpenChange={(open) => !open && setDesignLayout(null)}>
                <DialogContent className="max-w-[98vw] max-h-[98vh] h-[98vh] p-0 overflow-hidden">
                    {/* No header needed if the designer has its own toolbar, or can add a minimal close handle */}
                    {designLayout && (
                        <SeatDesigner
                            layout={designLayout}
                            onClose={() => setDesignLayout(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};
