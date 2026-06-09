import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Ticket, Calendar, Download, Clock, Film, Trophy, PartyPopper, X, DollarSign, TrendingUp, Share2, MapPin, Armchair, Timer } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useBookings, useCancelBooking, Booking } from '@/hooks/useBookings';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import { toast } from 'sonner';

const getBookingIcon = (type: string) => {
  switch (type) {
    case 'movie':
      return Film;
    case 'event':
      return PartyPopper;

    case 'venue':
      return Trophy;
    default:
      return Ticket;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-indigo-500/10 text-indigo-600 border-indigo-200';
    case 'completed':
      return 'bg-blue-500/10 text-blue-600 border-blue-200';
    case 'cancelled':
      return 'bg-red-500/10 text-red-600 border-red-200';
    case 'pending':
      return 'bg-yellow-500/10 text-yellow-600 border-yellow-200';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const CountdownTimer = ({ targetDate }: { targetDate: Date }) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();
      if (difference > 0) {
        return {
          hours: Math.floor((difference / (1000 * 60 * 60))),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return null;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return <Badge variant="secondary" className="bg-red-50 text-red-600 font-normal text-[10px] px-2 py-0.5">Show Started / Ended</Badge>;

  return (
    <div className="inline-flex items-center gap-2 bg-[#fee2e2] px-3 py-1.5 rounded-md text-sm">
      <span className="text-slate-500 font-medium text-xs">Starts in:</span>
      <Timer className="w-4 h-4 text-primary" />
      <span className="font-medium text-primary tracking-wide">
        {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
      </span>
    </div>
  );
};

const BookingCard: React.FC<{
  booking: Booking;
  onViewQR: (booking: Booking) => void;
  onDownloadPDF: (booking: Booking) => void;
  onCancel: (booking: Booking) => void;
  onShare: (booking: Booking) => void;
}> = ({ booking, onViewQR, onDownloadPDF, onCancel, onShare }) => {
  const bookingDate = new Date(booking.date);
  const timeParts = booking.time.match(/(\d+):(\d+)\s?(AM|PM)/i);
  if (timeParts) {
    let hours = parseInt(timeParts[1], 10);
    const minutes = parseInt(timeParts[2], 10);
    const ampm = timeParts[3].toUpperCase();
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    bookingDate.setHours(hours, minutes, 0, 0);
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-col md:flex-row min-h-[220px]">
        {/* Left Section - QR Code */}
        <div className="w-full md:w-48 bg-[#f8f9fa] flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-slate-100 relative">
          {/* Ticket Punch Circles */}
          <div className="hidden md:block absolute right-[-8px] top-[-8px] w-4 h-4 bg-white rounded-full border border-slate-200 z-10"></div>
          <div className="hidden md:block absolute right-[-8px] bottom-[-8px] w-4 h-4 bg-white rounded-full border border-slate-200 z-10"></div>

          <div
            className="bg-white p-2.5 rounded-lg shadow-sm cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => onViewQR(booking)}
          >
            <QRCodeSVG
              value={booking.qr_code || booking.id}
              size={120}
              level="H"
            />
          </div>
          <p className="mt-3 text-xs text-slate-400 font-medium tracking-wide uppercase">
            {booking.qr_code || booking.id.substring(0, 10)}
          </p>
        </div>

        {/* Right Section - Content */}
        <div className="flex-1 p-6 relative">
          <div className="flex justify-between items-start mb-1">
            <div>
              <h3 className="text-xl font-bold text-slate-900 leading-tight">
                {booking.title}
              </h3>
              <p className="text-slate-500 text-sm mt-1 font-medium">
                {booking.venue} <span className="text-slate-300 mx-1">•</span> Screen 1 - IMAX
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold text-white capitalize ${booking.status === 'confirmed' ? 'bg-[#4F46E5]' :
                booking.status === 'completed' ? 'bg-blue-600' :
                  booking.status === 'cancelled' ? 'bg-[#EF4444]' : 'bg-yellow-500'
                }`}>
                {booking.status}
              </span>
            </div>
          </div>

          {/* Countdown Timer */}
          {booking.status === 'confirmed' && (
            <div className="mt-3 mb-5">
              <CountdownTimer targetDate={bookingDate} />
            </div>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-semibold text-slate-700">
                {new Date(booking.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-semibold text-slate-700">
                {booking.time}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-semibold text-slate-700">
                Mumbai
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Armchair className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-semibold text-slate-700 truncate" title={booking.seats?.join(', ')}>
                {booking.seats?.join(', ') || 'General'}
              </span>
            </div>
          </div>

          <Separator className="mb-4" />

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-sm font-medium">{booking.quantity} ticket(s)</span>
              <span className="text-primary text-xl font-bold">₹{Number(booking.amount).toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewQR(booking)}
                className="flex-1 sm:flex-none h-9 border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                <Ticket className="h-4 w-4 mr-2" />
                View Ticket
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none h-9 border-slate-200 text-slate-700 hover:bg-slate-50"
                onClick={() => onShare(booking)}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onDownloadPDF(booking)}
                className="flex-1 sm:flex-none h-9 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>

              {booking.status === 'confirmed' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCancel(booking)}
                  className="flex-1 sm:flex-none h-9 border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Bookings: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: bookings, isLoading } = useBookings();
  const cancelBooking = useCancelBooking();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [pdfBooking, setPdfBooking] = useState<Booking | null>(null);
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);
  const ticketRef = useRef<HTMLDivElement>(null);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleDownloadPDF = async (booking: Booking) => {
    // Set the booking for PDF generation
    setPdfBooking(booking);

    // Wait for the DOM to update and render
    setTimeout(async () => {
      if (!ticketRef.current) {
        toast.error('Unable to generate PDF. Please try again.');
        setPdfBooking(null);
        return;
      }

      try {
        const canvas = await html2canvas(ticketRef.current, {
          background: '#ffffff',
          logging: false,
          useCORS: true,
          scale: 5, // Increase scale for higher quality
        } as any);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`ticket-${booking.qr_code || booking.id}.pdf`);
        toast.success('Ticket downloaded successfully!');
      } catch (error) {
        console.error('PDF generation error:', error);
        toast.error('Failed to download ticket. Please try again.');
      } finally {
        setPdfBooking(null);
      }
    }, 500);
  };

  const handleCancelBooking = (booking: Booking) => {
    setCancelBookingId(booking.id);
  };

  const confirmCancelBooking = async () => {
    if (!cancelBookingId) return;

    try {
      await cancelBooking.mutateAsync(cancelBookingId);
      toast.success('Booking cancelled successfully');
      setCancelBookingId(null);
    } catch (error: any) {
      console.error('Cancellation error:', error);
      const errorMessage = error?.message || 'Failed to cancel booking. Please try again.';
      toast.error(errorMessage);
      setCancelBookingId(null);
    }
  };

  const filteredBookings = (bookings || []).filter((booking) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') return booking.status === 'confirmed';
    if (activeTab === 'past') return booking.status === 'completed';
    if (activeTab === 'cancelled') return booking.status === 'cancelled';
    return true;
  });

  // Calculate booking insights
  const totalSpent = (bookings || [])
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, booking) => sum + Number(booking.amount), 0);

  const totalTickets = (bookings || [])
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, booking) => sum + booking.quantity, 0);

  const moviesWatched = (bookings || [])
    .filter(b => b.booking_type === 'movie' && (b.status === 'completed' || b.status === 'confirmed'))
    .length;

  const avgPerBooking = totalTickets > 0 ? Math.round(totalSpent / totalTickets) : 0;

  const bookingTrendData = useMemo(() => {
    if (!bookings) return [];

    const data = [];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = d.toLocaleString('default', { month: 'short' });
      const year = d.getFullYear().toString().slice(-2);
      data.push({
        name: `${monthName} ${year}`,
        monthIndex: d.getMonth(),
        yearFull: d.getFullYear(),
        value: 0
      });
    }

    bookings.forEach(booking => {
      if (booking.status === 'cancelled') return;

      const bookingDate = new Date(booking.date);
      const match = data.find(d =>
        d.monthIndex === bookingDate.getMonth() &&
        d.yearFull === bookingDate.getFullYear()
      );

      if (match) {
        match.value += 1; // Count bookings
      }
    });

    return data.map(({ name, value }) => ({ name, value }));
  }, [bookings]);

  const handleShare = async (booking: Booking) => {
    const shareData = {
      title: 'My Movie Ticket',
      text: `Check out my ticket for ${booking.title} at ${booking.venue} on ${new Date(booking.date).toLocaleDateString()} ${booking.time}!`,
      url: window.location.href, // Or a specific ticket verification URL if available
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        toast.success('Ticket details copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <Layout>
      <div className="bg-gradient-to-b from-primary/5 to-background py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Bookings</h1>
          <p className="text-muted-foreground mb-8">View and manage all your bookings</p>

          {/* Booking Insights Section */}
          {!isLoading && bookings && bookings.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Your Booking Insights</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Spent Card */}
                <Card className="border-l-4 border-l-pink-500 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-pink-100 dark:bg-pink-900/20">
                        <DollarSign className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Spent</p>
                        <p className="text-2xl font-bold text-foreground">₹{totalSpent.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tickets Booked Card */}
                <Card className="border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/20">
                        <Ticket className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Tickets Booked</p>
                        <p className="text-2xl font-bold text-foreground">{totalTickets}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Movies Watched Card */}
                <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
                        <Film className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Movies Watched</p>
                        <p className="text-2xl font-bold text-foreground">{moviesWatched}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Average per Booking Card */}
                <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20">
                        <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Avg per Booking</p>
                        <p className="text-2xl font-bold text-foreground">₹{avgPerBooking}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Graphs Section */}
          {!isLoading && bookings && bookings.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Booking Trend Chart */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Booking Trend</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={bookingTrendData}>
                        <XAxis
                          dataKey="name"
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          cursor={{ fill: 'transparent' }}
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Bar
                          dataKey="value"
                          fill="#6366f1"
                          radius={[4, 4, 0, 0]}
                          barSize={40}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Seat Preferences Chart */}
              {/* Seat Preferences Chart */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Seat Preferences</h3>
                  <div className="space-y-6">
                    {[
                      { label: 'Premium', count: 2, percentage: 25, color: 'bg-yellow-500' },
                      { label: 'Regular', count: 4, percentage: 50, color: 'bg-primary' },
                      { label: 'Recliner', count: 2, percentage: 25, color: 'bg-primary' },
                    ].map((item) => (
                      <div key={item.label} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{item.label}</span>
                          <span className="text-muted-foreground">{item.count} seats ({item.percentage}%)</span>
                        </div>
                        <Progress value={item.percentage} className="h-2" indicatorColor={item.color === 'bg-yellow-500' ? 'bg-yellow-500' : 'bg-primary'} />
                      </div>
                    ))}
                    <p className="text-sm text-muted-foreground pt-2">
                      Most users prefer <span className="font-bold text-foreground">Regular</span> seats!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex items-center gap-2 mb-6">
            <Ticket className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-slate-900">
              {activeTab === 'upcoming' ? 'Upcoming Shows' : activeTab === 'past' ? 'Past Shows' : activeTab === 'cancelled' ? 'Cancelled' : 'All Bookings'}
              <span className="ml-1">({filteredBookings.length})</span>
            </h1>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-48 w-full rounded-xl" />
                ))}
              </div>
            ) : filteredBookings.length > 0 ? (
              <>
                {filteredBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onViewQR={setSelectedBooking}
                    onDownloadPDF={handleDownloadPDF}
                    onCancel={handleCancelBooking}
                    onShare={handleShare}
                  />
                ))}
              </>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-200">
                <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Ticket className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-1">No bookings found</h3>
                <p className="text-slate-500 mb-6">Looks like you haven't booked any tickets yet</p>
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link to="/">Explore Movies</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Code Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">Your Ticket</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="flex justify-center py-4">
                <QRCodeDisplay
                  value={selectedBooking.qr_code || selectedBooking.id}
                  size={180}
                  title={selectedBooking.qr_code || undefined}
                />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Title</span>
                  <span className="font-medium text-foreground">{selectedBooking.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="text-foreground">
                    {new Date(selectedBooking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span className="text-foreground">{selectedBooking.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Venue</span>
                  <span className="text-foreground">{selectedBooking.venue}</span>
                </div>
                {selectedBooking.seats && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Seats</span>
                    <span className="text-foreground">{selectedBooking.seats.join(', ')}</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-center text-muted-foreground pt-2">
                Show this QR code at the venue for entry
              </p>

              {/* Download PDF Button in Dialog */}
              <div className="mt-6">
                <Button
                  onClick={() => {
                    if (selectedBooking) {
                      handleDownloadPDF(selectedBooking);
                    }
                  }}
                  className="w-full rounded-full relative bg-gradient-to-r from-green-400 via-emerald-500 to-green-500 hover:from-green-500 hover:via-emerald-600 hover:to-green-600 text-white font-semibold shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 group overflow-hidden py-3"
                >
                  {/* Animated gradient overlay */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>

                  {/* Ripple effect */}
                  <span className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out"></span>

                  <Download className="h-5 w-5 mr-2 relative z-10 inline group-hover:scale-110 transition-transform duration-300" />
                  <span className="relative z-10 tracking-wide">Download Ticket PDF</span>

                  {/* Glowing ring */}
                  <span className="absolute inset-0 rounded-full ring-2 ring-green-300/50 group-hover:ring-4 group-hover:ring-green-200/80 transition-all duration-500"></span>

                  {/* Outer glow */}
                  <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-40 blur-lg transition-all duration-500"></span>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancellation Confirmation Dialog */}
      <AlertDialog open={!!cancelBookingId} onOpenChange={() => setCancelBookingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone and you may not receive a full refund.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, Keep Booking</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancelBooking}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, Cancel Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Hidden Ticket Template for PDF Generation */}
      <div className="fixed -left-[9999px] -top-[9999px]">
        {pdfBooking && (
          <div ref={ticketRef} className="bg-white w-[600px] font-sans">
            {/* Website Branding Watermark */}
            <div className="text-center py-2 pb-1 border-b border-gray-100">
              <p className="text-sm font-bold text-gray-400 tracking-[0.2em] uppercase">GrabAticket.com</p>
            </div>

            {/* Indigo Header */}
            <div className="bg-[#6366f1] py-6 text-center">
              <h1 className="text-3xl font-bold text-white mb-1 tracking-wider">MOVIE TICKET</h1>
              <p className="text-white/90 text-sm font-medium">ShowTime Booking Confirmation</p>
            </div>

            <div className="p-8">
              {/* Booking Code Row */}
              <div className="flex justify-between items-center mb-8 border-b border-dashed border-gray-200 pb-4">
                <span className="text-gray-600 font-bold text-sm">Booking Code:</span>
                <span className="text-[#6366f1] font-bold text-xl tracking-widest">{pdfBooking.qr_code || pdfBooking.id.slice(0, 8).toUpperCase()}</span>
              </div>

              {/* Movie Title */}
              <h2 className="text-[#0f172a] text-3xl font-bold mb-8">{pdfBooking.title}</h2>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-y-8 gap-x-12 mb-8">
                {/* Venue */}
                <div>
                  <label className="block text-gray-500 text-xs font-bold uppercase mb-1">VENUE</label>
                  <p className="text-gray-900 font-bold text-sm mb-1">{pdfBooking.theatre_id || '139d1b2a-e269-4e67-8dcf'}</p>
                  <p className="text-gray-500 text-xs">Screen 1 • GrabAticket</p>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-gray-500 text-xs font-bold uppercase mb-1">DATE</label>
                  <p className="text-gray-900 font-bold text-lg">
                    {new Date(pdfBooking.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                {/* Seats */}
                <div>
                  <label className="block text-gray-500 text-xs font-bold uppercase mb-1">SEATS</label>
                  <p className="text-gray-900 font-bold text-3xl mb-1">{pdfBooking.seats?.join(', ') || 'N/A'}</p>
                  <p className="text-gray-500 text-xs font-medium">{pdfBooking.seats?.length || pdfBooking.quantity} ticket(s)</p>
                </div>

                {/* Time */}
                <div>
                  <label className="block text-gray-500 text-xs font-bold uppercase mb-1">TIME</label>
                  <p className="text-gray-900 font-bold text-lg">{pdfBooking.time}</p>
                </div>
              </div>

              {/* Footer Divider */}
              <div className="border-t-2 border-dashed border-gray-200 my-8"></div>

              {/* Footer (Amount & QR) */}
              <div className="flex justify-between items-end">
                <div>
                  <label className="block text-gray-500 text-xs font-bold uppercase mb-2">TOTAL AMOUNT</label>
                  <p className="text-[#6366f1] font-bold text-4xl">₹{Number(pdfBooking.amount).toLocaleString()}</p>
                </div>

                <div className="text-center">
                  <div className="bg-white p-1">
                    <QRCodeSVG
                      value={pdfBooking.qr_code || pdfBooking.id}
                      size={100}
                      level="H"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">Scan QR code at venue</p>
                </div>
              </div>

              {/* Bottom Disclaimer */}
              <div className="mt-12 text-center space-y-1">
                <p className="text-[10px] text-gray-400">Please arrive 15 minutes before showtime.</p>
                <p className="text-[10px] text-gray-400">This ticket is valid only for the date and time mentioned above.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Bookings;
