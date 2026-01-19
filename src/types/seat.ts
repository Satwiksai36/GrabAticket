export type SeatStatus =
    | "available"
    | "selected"
    | "booked"
    | "disabled";

export type SeatCategory =
    | "regular"
    | "premium"
    | "vip"
    | "recliner"; // Added recliner

export interface Seat {
    id: string;
    row: string;
    number: number;
    status: SeatStatus;
    category: SeatCategory;
    price: number;
}
