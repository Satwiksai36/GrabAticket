import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Armchair, Eraser, Save, X, ZoomIn, ZoomOut } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

interface SeatConfig {
    row: number;
    col: number;
    status: 'available' | 'blocked' | 'aisle';
    label?: string;
    category?: string;
    type?: string;
    price_modifier?: number;
}

interface Tier {
    id: string;
    label: string;
    price: number;
    color: string;
}

const DEFAULT_TIERS: Tier[] = [
    { id: 'regular', label: 'Regular', price: 200, color: 'bg-red-500' },
    { id: 'premium', label: 'Premium', price: 350, color: 'bg-indigo-500' },
    { id: 'vip', label: 'VIP', price: 500, color: 'bg-green-500' },
    { id: 'recliner', label: 'Recliner', price: 700, color: 'bg-amber-500' }
];

interface SeatLayout {
    id: string;
    name: string;
    type: string;
    rows: number;
    columns: number;
    total_seats: number;
    layout_config: any; // Using any to handle the Json type flexibility
}

interface SeatDesignerProps {
    layout: SeatLayout;
    onClose: () => void;
}

export const SeatDesigner: React.FC<SeatDesignerProps> = ({ layout, onClose }) => {
    const [seats, setSeats] = useState<SeatConfig[]>([]);
    const [tiers, setTiers] = useState<Tier[]>(DEFAULT_TIERS);
    const [selectedTool, setSelectedTool] = useState<string>('regular');
    const [zoomLevel, setZoomLevel] = useState(1);
    const queryClient = useQueryClient();

    // Initialize seats from layout config or create default Grid
    useEffect(() => {
        if (layout.layout_config) {
            if (layout.layout_config.seats) {
                setSeats(layout.layout_config.seats);
            }
            if (layout.layout_config.tiers) {
                setTiers(layout.layout_config.tiers);
            }
        } else {
            // Fallback generation if config is missing (legacy)
            const newSeats: SeatConfig[] = [];
            for (let r = 1; r <= layout.rows; r++) {
                for (let c = 1; c <= layout.columns; c++) {
                    newSeats.push({
                        row: r,
                        col: c,
                        status: 'available',
                        category: 'regular',
                        label: `${String.fromCharCode(64 + r)}${c}`
                    });
                }
            }
            setSeats(newSeats);
        }
    }, [layout]);

    const getSeat = (r: number, c: number) => seats.find(s => s.row === r && s.col === c);

    const handleCellClick = (r: number, c: number) => {
        setSeats(prev => {
            const newSeats = [...prev];
            const index = newSeats.findIndex(s => s.row === r && s.col === c);

            if (index >= 0) {
                // Toggle between available and aisle based on tool
                if (selectedTool === 'aisle') {
                    newSeats[index] = { ...newSeats[index], status: 'aisle' };
                } else {
                    // It's a seat category tool
                    newSeats[index] = {
                        ...newSeats[index],
                        status: 'available',
                        category: selectedTool
                    };
                }
            } else {
                newSeats.push({
                    row: r,
                    col: c,
                    status: selectedTool === 'aisle' ? 'aisle' : 'available',
                    category: selectedTool === 'aisle' ? 'regular' : selectedTool,
                    label: `${String.fromCharCode(64 + r)}${c}`
                });
            }
            return newSeats;
        });
    };

    const updatemutation = useMutation({
        mutationFn: async () => {
            // Calculate totals
            const validSeats = seats.filter(s => s.status === 'available');
            const totalSeats = validSeats.length;

            const updatedConfig = {
                ...layout.layout_config,
                rows: layout.rows,
                cols: layout.columns,
                seats: seats,
                tiers: tiers
            };

            const { error } = await supabase
                .from('seat_layouts')
                .update({
                    layout_config: updatedConfig as unknown as Json,
                    total_seats: totalSeats
                })
                .eq('id', layout.id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['seat-layouts'] });
            toast.success('Layout saved successfully');
            onClose();
        },
        onError: (e) => {
            toast.error('Failed to save layout: ' + e.message);
        }
    });

    const handlePriceChange = (id: string, newPrice: string) => {
        setTiers(prev => prev.map(t => t.id === id ? { ...t, price: Number(newPrice) } : t));
    };

    const handleLabelChange = (id: string, newLabel: string) => {
        setTiers(prev => prev.map(t => t.id === id ? { ...t, label: newLabel } : t));
    };

    // Calculate dynamic size for stadium based on rows to ensure all seats fit
    const maxRadius = 200 + (layout.rows * 35);
    const stadiumDiameter = Math.max(1000, (maxRadius * 2) + 200);

    return (
        <div className="flex flex-col h-[95vh] w-[95vw] bg-background">
            <div className="flex items-center justify-between p-4 border-b bg-white">
                <div>
                    <h2 className="text-lg font-semibold">Designing: {layout.name}</h2>
                    <p className="text-sm text-muted-foreground">{layout.type === 'stadium' ? 'Circular Stadium Layout' : `${layout.rows} Rows x ${layout.columns} Columns`}</p>
                </div>

                {layout.type === 'stadium' && (
                    <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1 mx-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.1))}
                            disabled={zoomLevel <= 0.5}
                            className="h-8 w-8"
                        >
                            <ZoomOut className="h-4 w-4" />
                        </Button>
                        <span className="text-xs font-medium w-12 text-center select-none">{Math.round(zoomLevel * 100)}%</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setZoomLevel(prev => Math.min(2, prev + 0.1))}
                            disabled={zoomLevel >= 2}
                            className="h-8 w-8"
                        >
                            <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-8 px-2"
                            onClick={() => setZoomLevel(1)}
                        >
                            Reset
                        </Button>
                    </div>
                )}

                <div className="flex items-center gap-2">
                    {tiers.map(tier => (
                        <Button
                            key={tier.id}
                            variant={selectedTool === tier.id ? 'default' : 'outline'}
                            onClick={() => setSelectedTool(tier.id)}
                            size="sm"
                            className={`${selectedTool === tier.id ? `${tier.color} text-white` : ''} capitalize`}
                        >
                            <Armchair className="mr-2 h-4 w-4" /> {tier.label}
                        </Button>
                    ))}

                    <Button
                        variant={selectedTool === 'aisle' ? 'default' : 'outline'}
                        onClick={() => setSelectedTool('aisle')}
                        size="sm"
                    >
                        <Eraser className="mr-2 h-4 w-4" /> Gap
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" onClick={(e) => { e.preventDefault(); onClose(); }} size="sm">Cancel</Button>
                    <Button onClick={(e) => { e.preventDefault(); updatemutation.mutate(); }} disabled={updatemutation.isPending} size="sm">
                        <Save className="mr-2 h-4 w-4" /> Save Design
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden relative z-0">
                <div className="flex-1 overflow-auto bg-slate-50/50 p-8">
                    <div
                        className="flex justify-center items-center min-w-full min-h-full"
                        style={{
                            // Increased buffer logic to account for actual dynamic diameter
                            width: layout.type === 'stadium' ? `${(stadiumDiameter * zoomLevel) + 600}px` : undefined,
                            height: layout.type === 'stadium' ? `${(stadiumDiameter * zoomLevel) + 600}px` : undefined,
                            padding: layout.type === 'stadium' ? '100px' : undefined
                        }}
                    >
                        {layout.type === 'stadium' ? (
                            <div
                                className="relative rounded-full border-4 border-green-700/20 bg-green-50 flex items-center justify-center shrink-0 transition-transform duration-200 ease-in-out origin-center"
                                style={{
                                    width: `${stadiumDiameter}px`,
                                    height: `${stadiumDiameter}px`,
                                    transform: `scale(${zoomLevel})`
                                }}
                            >
                                {/* Pitch / Field */}
                                <div className="absolute w-[300px] h-[300px] bg-green-600 rounded-full flex items-center justify-center border-4 border-white/20 shadow-inner z-10">
                                    <div className="w-16 h-32 border-2 border-white/40 mb-32"></div>
                                    <div className="w-16 h-32 border-2 border-white/40 mt-32 absolute"></div>
                                    <div className="text-white font-bold opacity-50 text-xl tracking-widest absolute">PITCH</div>
                                </div>

                                {/* Dynamic Stadium Seats */}
                                {Array.from({ length: layout.rows }).map((_, rIndex) => {
                                    const row = rIndex + 1;
                                    const radius = 200 + (row * 35); // Increased spacing
                                    const totalSeatsInRow = layout.columns + (row * 6);
                                    const center = stadiumDiameter / 2;

                                    return Array.from({ length: totalSeatsInRow }).map((_, cIndex) => {
                                        const col = cIndex + 1;
                                        const angle = (cIndex / totalSeatsInRow) * 360;
                                        const radian = (angle - 90) * (Math.PI / 180);

                                        const x = center + radius * Math.cos(radian);
                                        const y = center + radius * Math.sin(radian);

                                        const seat = getSeat(row, col) || {
                                            row, col,
                                            status: 'available',
                                            category: 'regular',
                                            label: `${String.fromCharCode(64 + row)}-${col}`
                                        };

                                        const isAisle = seat?.status === 'aisle';
                                        const seatTier = tiers.find(t => t.id === seat?.category);
                                        const bgColor = seatTier ? seatTier.color : 'bg-gray-400';

                                        return (
                                            <button
                                                key={`${row}-${col}`}
                                                onClick={() => handleCellClick(row, col)}
                                                className={`
                                                absolute w-6 h-6 rounded-sm shadow-sm transition-all flex items-center justify-center text-[8px] font-bold z-0
                                                ${isAisle
                                                        ? 'opacity-0 pointer-events-none'
                                                        : `${bgColor} text-white hover:scale-125 hover:z-50`
                                                    }
                                            `}
                                                style={{
                                                    top: `${y}px`,
                                                    left: `${x}px`,
                                                    transform: `translate(-50%, -50%) rotate(${angle + 90}deg)`,
                                                }}
                                                title={`Row ${row}, Seat ${col}`}
                                            >
                                                {!isAisle && ''}
                                            </button>
                                        );
                                    });
                                })}
                            </div>
                        ) : (
                            <div
                                className="grid gap-2 p-8 bg-white rounded-xl border border-dashed border-slate-200 shadow-sm"
                                style={{
                                    gridTemplateColumns: `repeat(${layout.columns}, minmax(40px, 1fr))`
                                }}
                            >
                                {Array.from({ length: layout.rows }).map((_, rIndex) => {
                                    const row = rIndex + 1;
                                    return Array.from({ length: layout.columns }).map((_, cIndex) => {
                                        const col = cIndex + 1;
                                        const seat = getSeat(row, col);
                                        const isAisle = seat?.status === 'aisle';
                                        const seatTier = tiers.find(t => t.id === seat?.category);
                                        const bgColor = seatTier ? seatTier.color : 'bg-gray-400';

                                        return (
                                            <button
                                                key={`${row}-${col}`}
                                                onClick={() => handleCellClick(row, col)}
                                                className={`
                                            w-10 h-10 rounded-t-lg transition-all flex items-center justify-center text-xs font-bold
                                            ${isAisle
                                                        ? 'bg-transparent border border-dashed border-slate-200 text-transparent hover:bg-slate-100'
                                                        : `${bgColor} text-white hover:opacity-90 shadow-sm`
                                                    }
                                        `}
                                                title={`Row ${row}, Col ${col} - ${seatTier?.label || 'Regular'}`}
                                            >
                                                {!isAisle && (seat?.label || `${row}-${col}`)}
                                            </button>
                                        );
                                    });
                                })}
                            </div>
                        )}
                    </div>

                    <div className="mt-8 text-center pb-8">
                        {layout.type !== 'stadium' && (
                            <>
                                <div className="w-full max-w-md mx-auto h-2 bg-slate-300 rounded-full mb-2"></div>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest">Screen / Driver Side</p>
                            </>
                        )}
                    </div>
                </div>


                <div className="w-80 border-l bg-white p-6 overflow-y-auto">
                    <h3 className="font-semibold mb-4">Categories</h3>
                    <div className="space-y-6">
                        {tiers.map(tier => (
                            <div key={tier.id} className="p-4 border rounded-lg space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded ${tier.color} shadow-sm border border-black/10`}></div>
                                    <Input
                                        value={tier.label}
                                        onChange={(e) => handleLabelChange(tier.id, e.target.value)}
                                        className="h-8 font-medium"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">₹</span>
                                    <Input
                                        type="number"
                                        value={tier.price}
                                        onChange={(e) => handlePriceChange(tier.id, e.target.value)}
                                        className="h-9"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
