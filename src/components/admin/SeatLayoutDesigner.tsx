import React, { useState } from 'react';
import { Seat } from "@/types/seat";
import SeatGrid from '@/components/seats/SeatGrid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Save, Trash2 } from 'lucide-react';

export default function SeatLayoutDesigner({
    initialLayout = [],
    onSave
}: {
    initialLayout?: Seat[];
    onSave?: (layout: Seat[]) => void;
}) {
    const [layout, setLayout] = useState<Seat[]>(initialLayout);
    const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);

    // Configuration for new rows
    const [config, setConfig] = useState({
        category: 'regular' as Seat['category'],
        price: 150,
        seatsPerRow: 10
    });

    const addRow = () => {
        // Determine next row character
        // Use clear logic: see existing rows, find max char code, add 1.
        const existingRows = Array.from(new Set(layout.map(s => s.row)));
        const nextRowChar = existingRows.length > 0
            ? String.fromCharCode(Math.max(...existingRows.map(r => r.charCodeAt(0))) + 1)
            : 'A';

        const newSeats: Seat[] = Array.from({ length: config.seatsPerRow }).map((_, i) => ({
            id: `${nextRowChar}${i + 1}`,
            row: nextRowChar,
            number: i + 1,
            status: "available",
            category: config.category,
            price: config.price,
        }));
        setLayout([...layout, ...newSeats]);
    };

    const handleSeatClick = (seat: Seat) => {
        // Toggle selection for bulk editing (future feature)
        // For now just console log
        console.log('Clicked seat for editing', seat);
    };

    const clearLayout = () => {
        if (confirm('Are you sure you want to clear the entire layout?')) {
            setLayout([]);
        }
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Controls */}
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg">Layout Controls</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select
                                value={config.category}
                                onValueChange={(v: any) => setConfig({ ...config, category: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="regular">Regular</SelectItem>
                                    <SelectItem value="premium">Premium</SelectItem>
                                    <SelectItem value="vip">VIP</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Price (₹)</Label>
                            <Input
                                type="number"
                                value={config.price}
                                onChange={(e) => setConfig({ ...config, price: Number(e.target.value) })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Seats per Row</Label>
                            <Input
                                type="number"
                                value={config.seatsPerRow}
                                onChange={(e) => setConfig({ ...config, seatsPerRow: Number(e.target.value) })}
                                min={1}
                                max={20}
                            />
                        </div>

                        <Button onClick={addRow} className="w-full">
                            <Plus className="mr-2 h-4 w-4" /> Add Row
                        </Button>

                        <div className="pt-4 border-t flex gap-2">
                            <Button variant="destructive" onClick={clearLayout} className="flex-1">
                                <Trash2 className="mr-2 h-4 w-4" /> Clear
                            </Button>
                            <Button onClick={() => onSave?.(layout)} className="flex-1" variant="secondary">
                                <Save className="mr-2 h-4 w-4" /> Save
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Preview */}
                <Card className="md:col-span-2 bg-slate-50/50">
                    <CardHeader>
                        <CardTitle className="text-lg">Layout Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {layout.length > 0 ? (
                            <div className="scale-90 origin-top-left">
                                <SeatGrid seats={layout} onSeatChange={handleSeatClick} />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg text-muted-foreground">
                                Start adding rows to build the layout
                            </div>
                        )}

                        <div className="mt-4 text-sm text-muted-foreground">
                            Total Seats: {layout.length} | Total Rows: {new Set(layout.map(s => s.row)).size}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
