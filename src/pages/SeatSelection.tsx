import React, { useState, useEffect } from "react";
import SeatGrid from "@/components/seats/SeatGrid";
import { toggleSeat } from "@/utils/seatLogic";
import { Seat } from "@/types/seat";
import Layout from '@/components/layout/Layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Ticket, ArrowLeft, Calendar, Clock, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useMovie } from "@/hooks/useMovies";

// Mock data reflecting the image layout
const MOCK_INITIAL_SEATS: Seat[] = (() => {
  const seats: Seat[] = [];

  // Premium Rows A, B (1-12)
  ['A', 'B'].forEach(row => {
    for (let i = 1; i <= 12; i++) {
      seats.push({
        id: `${row}${i}`,
        row,
        number: i,
        status: 'available',
        category: 'premium',
        price: 350
      });
    }
  });

  // Regular Rows C, D, E, F (1-12)
  ['C', 'D', 'E', 'F'].forEach(row => {
    for (let i = 1; i <= 12; i++) {
      seats.push({
        id: `${row}${i}`,
        row,
        number: i,
        status: 'available',
        category: 'regular',
        price: 200
      });
    }
  });

  // Recliner Rows G, H (1-12)
  ['G', 'H'].forEach(row => {
    for (let i = 1; i <= 12; i++) {
      seats.push({
        id: `${row}${i}`,
        row,
        number: i,
        status: 'available',
        category: 'recliner',
        price: 500
      });
    }
  });

  return seats;
})();

export default function SeatSelection() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [seats, setSeats] = useState<Seat[]>(MOCK_INITIAL_SEATS);

  // Fetch movie details to display real title if possible
  const { data: movie, isLoading: movieLoading } = useMovie(id || '');

  // Get show details from URL or defaults
  const showDate = searchParams.get('date') || new Date().toISOString();
  const showTime = searchParams.get('time') || '10:00 PM';
  const theatreName = 'Nexus Mall: Koramangala'; // Mock theatre for now

  const handleSeatChange = (seat: Seat) => {
    if (seat.status === 'booked' || seat.status === 'disabled') return;

    // Limit selection to 6
    const curSelected = seats.filter(s => s.status === 'selected').length;
    if (seat.status === 'available' && curSelected >= 6) {
      toast.error("You can select up to 6 seats max.");
      return;
    }

    setSeats(prev =>
      prev.map(s => (s.id === seat.id ? toggleSeat(s) : s))
    );
  };

  const handleProceedToPay = () => {
    const selectedSeats = seats.filter(s => s.status === 'selected');
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat to proceed.");
      return;
    }

    const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);
    const seatLabels = selectedSeats.map(s => `${s.row}${s.number}`).join(',');

    // Construct checkout URL with all necessary details
    const params = new URLSearchParams({
      amount: totalPrice.toString(),
      seats: seatLabels,
      date: showDate,
      time: showTime,
      theatre: theatreName
    });

    // Navigate to food selection instead of checkout
    navigate(`/movies/${id}/food?${params.toString()}`);
  }

  const selectedSeats = seats.filter(s => s.status === "selected");
  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  if (movieLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Layout hideFooter>
      <div className="min-h-screen bg-gray-50/50 pb-20">
        {/* Top Bar */}
        <div className="bg-white border-b sticky top-0 z-30 px-4 py-3 shadow-sm">
          <div className="container mx-auto max-w-5xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-lg font-bold">{movie?.title || 'Devara: Part 1'}</h1>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{new Date(showDate).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                  <span>•</span>
                  <span>{showTime}</span>
                  <span>•</span>
                  <span>Screen 1</span>
                </div>
              </div>
            </div>
            <div className="text-sm font-medium text-muted-foreground hidden md:block border px-3 py-1 rounded-full bg-slate-50">
              Max 6 seats
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Theatre Info Header (Optional) */}
              <div className="flex items-center justify-between text-sm text-slate-500 px-2">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {theatreName}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {showTime}
                </div>
              </div>

              <SeatGrid seats={seats} onSeatChange={handleSeatChange} />
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24 border border-slate-200 shadow-sm overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-slate-50/50 p-4 border-b border-slate-100">
                    <h3 className="text-base font-semibold flex items-center gap-2 text-slate-800">
                      <Ticket className="h-4 w-4 text-primary" />
                      Booking Summary
                    </h3>
                  </div>

                  <div className="p-6">
                    {selectedSeats.length > 0 ? (
                      <div className="space-y-6">
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                          {selectedSeats.map(seat => (
                            <div key={seat.id} className="flex justify-between items-center text-sm group">
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-xs">{seat.row}{seat.number}</span>
                                  <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{seat.category}</span>
                                </div>
                              </div>
                              <span className="font-medium text-slate-900">₹{seat.price}</span>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-dashed border-slate-200 pt-4 bg-white/50">
                          <div className="flex justify-between items-end mb-6">
                            <div className="text-sm text-slate-500">
                              Total Amount <br />
                              <span className="text-[10px] text-slate-400">Incl. of all taxes</span>
                            </div>
                            <span className="text-2xl font-bold text-primary">₹{totalPrice}</span>
                          </div>
                          <Button
                            className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
                            onClick={handleProceedToPay}
                          >
                            Pay ₹{totalPrice}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-10 opacity-70">
                        <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Ticket className="h-6 w-6 text-slate-400" />
                        </div>
                        <p className="text-slate-900 font-medium text-sm">Select Seats</p>
                        <p className="text-xs text-slate-500 mt-1 px-4">Tap on the available seats to proceed with your booking</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
