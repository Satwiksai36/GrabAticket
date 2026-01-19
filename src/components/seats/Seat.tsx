import React from 'react';
import { Seat as SeatType } from "@/types/seat";
import { SEAT_STYLES } from "@/constants/seatColors";
import { cn } from "@/lib/utils";

interface Props {
    seat: SeatType;
    onSelect: (seat: SeatType) => void;
}

export default function Seat({ seat, onSelect }: Props) {
    const isClickable = seat.status === "available" || seat.status === "selected";
    const statusForKey = seat.status === 'selected' ? 'selected' : (seat.status === 'booked' ? 'booked' : 'available');

    // Get styles for the specific category and status
    const categoryStyles = SEAT_STYLES[seat.category] || SEAT_STYLES.regular;
    const styleClass = categoryStyles[statusForKey];

    return (
        <button
            disabled={!isClickable}
            onClick={() => onSelect(seat)}
            title={`${seat.category} - Row ${seat.row} - Seat ${seat.number} - ₹${seat.price}`}
            className={cn(
                "w-8 h-8 md:w-9 md:h-9 rounded-md border text-xs font-medium transition-all duration-200 flex items-center justify-center select-none",
                styleClass,
                isClickable && "hover:shadow-sm active:scale-95",
                seat.status === 'selected' && "shadow-md ring-0",
                // Recliners might need to be slightly wider if we wanted to be very specific to the image, 
                // but for now keeping uniform size for grid alignment is safer unless requested.
                seat.category === 'recliner' && "rounded-lg"
            )}
        >
            {seat.number}
        </button>
    );
}
