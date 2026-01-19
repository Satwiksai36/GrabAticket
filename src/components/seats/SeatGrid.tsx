import React, { useMemo } from 'react';
import Seat from "./Seat";
import { Seat as SeatType } from "@/types/seat";
import { SEAT_STYLES } from "@/constants/seatColors";
import { cn } from "@/lib/utils";

interface Props {
    seats: SeatType[];
    onSeatChange: (seat: SeatType) => void;
}

export default function SeatGrid({ seats, onSeatChange }: Props) {
    // Group rows by category to render section headers
    const gridData = useMemo(() => {
        const uniqueRows = [...new Set(seats.map(s => s.row))];
        const rowsWithMeta = uniqueRows.map(row => {
            const rowSeats = seats.filter(s => s.row === row).sort((a, b) => a.number - b.number);
            // Assume all seats in a row have same category/price
            const firstSeat = rowSeats[0];
            return {
                rowLabel: row,
                seats: rowSeats,
                category: firstSeat.category,
                price: firstSeat.price
            };
        });

        // Sort rows: Regular (lower price) first, then Premium/Recliner (higher price)
        return rowsWithMeta.sort((a, b) => {
            if (a.price !== b.price) {
                return a.price - b.price;
            }
            return a.rowLabel.localeCompare(b.rowLabel);
        });
    }, [seats]);

    return (
        <div className="w-full bg-white p-4 md:p-8 rounded-xl shadow-sm border border-slate-100">

            {/* Screen Indicator */}
            <div className="flex flex-col items-center mb-10 w-full">
                <div className="relative w-full max-w-2xl h-8">
                    <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-b from-slate-200 to-transparent rounded-[50%] opacity-50 blur-sm transform -translate-y-1/2 scale-x-[1.02]"></div>
                    <div className="absolute inset-x-12 top-0 h-1.5 bg-slate-200 rounded-b-[50%] shadow-[0_2px_10px_rgba(0,0,0,0.1)]"></div>
                </div>
                <p className="text-xs text-slate-400 font-medium tracking-widest uppercase mt-4">All eyes this way please!</p>
            </div>

            <div className="flex flex-col gap-6 max-w-3xl mx-auto">
                {gridData.map((rowData, index) => {
                    // Check if this row starts a new category section
                    const prevRow = index > 0 ? gridData[index - 1] : null;
                    const isNewSection = !prevRow || prevRow.category !== rowData.category;

                    // Get color for category badge
                    const categoryColor = SEAT_STYLES[rowData.category]?.legend || "bg-slate-500";

                    return (
                        <React.Fragment key={rowData.rowLabel}>
                            {isNewSection && (
                                <div className="mt-4 mb-2 flex items-center gap-2">
                                    <div className={cn("w-3 h-3 rounded-sm", categoryColor)}></div>
                                    <span className="text-sm font-semibold text-slate-700 capitalize">
                                        {rowData.category} - ₹{rowData.price}
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center justify-center gap-4 md:gap-8">
                                <span className="w-4 text-xs font-semibold text-slate-400 text-right">{rowData.rowLabel}</span>
                                <div className="flex gap-2">
                                    {rowData.seats.map(seat => (
                                        <Seat
                                            key={seat.id}
                                            seat={seat}
                                            onSelect={onSeatChange}
                                        />
                                    ))}
                                </div>
                                <span className="w-4 text-xs font-semibold text-slate-400 text-left">{rowData.rowLabel}</span>
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-8 mt-12 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border border-rose-300 bg-rose-50"></div>
                    <span className="text-sm text-slate-600">Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-rose-500 border border-rose-500"></div>
                    <span className="text-sm text-slate-600">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gray-100 border border-gray-200"></div>
                    <span className="text-sm text-slate-600">Booked</span>
                </div>
            </div>
        </div>
    );
}
