import { Seat } from "@/types/seat";

export function toggleSeat(seat: Seat): Seat {
    if (seat.status === "available") {
        return { ...seat, status: "selected" };
    }
    if (seat.status === "selected") {
        return { ...seat, status: "available" };
    }
    return seat;
}
