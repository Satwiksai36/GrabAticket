import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Ticket, CreditCard, Smartphone, Building, Check, Loader2, Download, UtensilsCrossed, ChevronDown, ChevronUp } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useCreateBooking } from '@/hooks/useBookings';
import { useMovie } from '@/hooks/useMovies';
import { supabase } from '@/integrations/supabase/client';

const paymentMethods = [
  { id: 'upi', label: 'UPI', icon: Smartphone, description: 'Google Pay, PhonePe, Paytm' },
  { id: 'card', label: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', label: 'Net Banking', icon: Building, description: 'All major banks' },
];

const Checkout: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const createBooking = useCreateBooking();

  const seats = searchParams.get('seats')?.split(',') || [];
  const ticketAmount = parseInt(searchParams.get('amount') || '0');
  const time = searchParams.get('time') || '';
  const date = searchParams.get('date') || '';
  const theatre = searchParams.get('theatre') || '';

  const foodOrder: any[] = state?.foodOrder || [];
  const foodTotal = foodOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const [showFoodDetails, setShowFoodDetails] = useState(false);

  const { data: movie, isLoading: movieLoading } = useMovie(id || '');

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  const convenienceFee = Math.round(ticketAmount * 0.05);
  const totalAmount = ticketAmount + convenienceFee + foodTotal;
  const ticketRef = React.useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!ticketRef.current) return;

    try {
      const canvas = await html2canvas(ticketRef.current, {
        background: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`ticket-${bookingId}.pdf`);
      toast.success('Ticket downloaded successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to download ticket');
    }
  };

  const handlePayment = async () => {
    if (paymentMethod === 'upi' && !upiId) {
      toast.error('Please enter your UPI ID');
      return;
    }

    if (!movie || !id) {
      toast.error('Movie information not available');
      return;
    }

    setProcessing(true);

    try {
      // 1. Create Booking
      const booking = await createBooking.mutateAsync({
        booking_type: 'movie',
        reference_id: id,
        title: movie.title,
        venue: theatre,
        date: date,
        time: time,
        quantity: seats.length,
        seats: seats,
        amount: totalAmount,
        payment_method: paymentMethod,
      });

      // 2. Insert Food Items if any
      if (foodOrder.length > 0 && booking.id) {
        const foodItemsToInsert = foodOrder.map(item => ({
          booking_id: booking.id,
          food_item_id: item.id,
          quantity: item.quantity,
          price_at_booking: item.price,
          status: 'Pending'
        }));

        const { error: foodError } = await supabase
          .from('booking_food_items')
          .insert(foodItemsToInsert);

        if (foodError) {
          console.error('Error saving food items:', foodError);
          toast.error('Booking confirmed, but failed to save food details. Please contact support.');
        }
      }

      setBookingId(booking.qr_code || booking.id);
      setBookingDetails(booking);
      setBookingComplete(true);
      toast.success('Booking confirmed!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create booking. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (movieLoading) {
    return (
      <Layout hideFooter>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (bookingComplete) {
    return (
      <Layout hideFooter>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-zinc-100 p-4">
          <div className="max-w-md w-full space-y-6">

            {/* Ticket Card - Designed for PDF */}
            <div ref={ticketRef} className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-sm mx-auto">
              {/* Website Branding */}
              <div className="bg-slate-50 px-4 py-2 text-center border-b">
                <p className="text-xs font-bold text-slate-700 tracking-widest">GRABATICKET.COM</p>
              </div>
              {/* Red Header with Website Name */}
              <div className="bg-[#6366f1] px-8 py-6 text-center">
                <h1 className="text-3xl font-bold text-white tracking-wide mb-1">MOVIE TICKET</h1>
                <p className="text-sm text-white tracking-wide">ShowTime Booking Confirmation</p>
              </div>

              <div className="px-8 py-6">
                {/* Booking Code */}
                <div className="flex justify-between items-center mb-6 pb-4">
                  <span className="text-sm text-slate-600 font-medium">Booking Code:</span>
                  <span className="text-[#6366f1] font-bold text-xl tracking-wide">{(bookingId || '').substring(0, 8).toUpperCase()}</span>
                </div>

                {/* Movie Title */}
                <h2 className="text-3xl font-bold text-slate-900 mb-6 leading-tight">{movie?.title || 'Movie Title'}</h2>

                {/* Details Section */}
                <div className="space-y-4 mb-6">
                  {/* Venue */}
                  <div>
                    <label className="text-xs text-teal-600 uppercase tracking-wider font-semibold block mb-1">Venue</label>
                    <p className="text-slate-900 font-medium text-sm leading-tight">{theatre}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Screen 1 • GrabAticket</p>
                  </div>

                  {/* Date and Time Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-teal-600 uppercase tracking-wider font-semibold block mb-1">Date</label>
                      <p className="text-slate-900 font-medium text-sm">
                        {date && new Date(date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-teal-600 uppercase tracking-wider font-semibold block mb-1">Time</label>
                      <p className="text-slate-900 font-bold text-lg">{time}</p>
                    </div>
                  </div>

                  {/* Seats */}
                  <div>
                    <label className="text-xs text-teal-600 uppercase tracking-wider font-semibold block mb-1">Seats</label>
                    <p className="text-slate-900 font-bold text-2xl">{seats.join(', ')}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{seats.length} ticket(s)</p>
                  </div>

                  {/* Food Items Display on Ticket */}
                  {foodOrder.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-dashed border-slate-200">
                      <label className="text-xs text-teal-600 uppercase tracking-wider font-semibold block mb-1">Food & Beverages</label>
                      <div className="text-sm text-slate-700 space-y-1">
                        {foodOrder.map((item, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{item.quantity}x {item.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* QR Code and Total Amount */}
                <div className="flex justify-between items-end pt-4 border-t border-slate-200">
                  <div>
                    <label className="text-xs text-teal-600 uppercase tracking-wider font-semibold block mb-1">Total Amount</label>
                    <p className="text-4xl font-bold text-[#6366f1]">₹{totalAmount}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="border-2 border-slate-300 p-2 rounded-lg bg-white">
                      <QRCodeSVG value={bookingId || 'booking'} size={90} level="H" />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1.5">Scan QR code at venue</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button onClick={handleDownloadPDF} className="w-full h-12 text-base shadow-lg bg-[#6366f1] hover:bg-[#4f46e5]">
                <Download className="mr-2 h-5 w-5" />
                Download Ticket PDF
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" asChild className="h-12">
                  <Link to="/bookings">View Bookings</Link>
                </Button>
                <Button variant="outline" asChild className="h-12">
                  <Link to="/">Home</Link>
                </Button>
              </div>
            </div>

          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideFooter>
      <div className="bg-gradient-to-b from-primary/5 to-background min-h-[calc(100vh-4rem)]">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-foreground">Checkout</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Booking Summary */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-4">
                    <img
                      src={movie?.poster_url || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200&h=300&fit=crop'}
                      alt={movie?.title || 'Movie'}
                      className="w-20 h-28 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-semibold text-foreground">{movie?.title || 'Movie'}</h3>
                      <p className="text-sm text-muted-foreground">{theatre}</p>
                      <Badge variant="secondary" className="mt-1">{movie?.language || '2D'}</Badge>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span className="text-foreground">
                        {date && new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time</span>
                      <span className="text-foreground">{time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Seats</span>
                      <span className="text-foreground">{seats.join(', ')}</span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ticket Price</span>
                      <span className="text-foreground">₹{ticketAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Convenience Fee</span>
                      <span className="text-foreground">₹{convenienceFee}</span>
                    </div>

                    {foodOrder.length > 0 && (
                      <>
                        <div className="cursor-pointer" onClick={() => setShowFoodDetails(!showFoodDetails)}>
                          <div className="flex justify-between items-center py-1">
                            <span className="text-muted-foreground flex items-center gap-1">
                              Food & Beverages <br /><span className="text-[10px]">Tap to view items</span>
                            </span>
                            <span className="text-foreground font-medium flex items-center">
                              ₹{foodTotal}
                              {showFoodDetails ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                            </span>
                          </div>
                        </div>

                        {showFoodDetails && (
                          <div className="bg-muted/50 p-2 rounded text-xs space-y-1 mt-1 transition-all">
                            {foodOrder.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-muted-foreground">
                                <span>{item.quantity} x {item.name}</span>
                                <span>₹{item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between font-semibold">
                    <span className="text-foreground">Total Amount</span>
                    <span className="text-primary text-lg">₹{totalAmount}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Section */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-colors ${paymentMethod === method.id ? 'border-primary bg-primary/5' : 'border-border'
                          }`}
                        onClick={() => setPaymentMethod(method.id)}
                      >
                        <RadioGroupItem value={method.id} id={method.id} />
                        <div className="p-2 rounded-lg bg-muted">
                          <method.icon className="h-5 w-5 text-foreground" />
                        </div>
                        <div className="flex-1">
                          <Label htmlFor={method.id} className="font-medium cursor-pointer">
                            {method.label}
                          </Label>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>

                  {paymentMethod === 'upi' && (
                    <div className="mt-6 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="upi">UPI ID</Label>
                        <Input
                          id="upi"
                          placeholder="yourname@upi"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    size="lg"
                    className="w-full mt-6"
                    onClick={handlePayment}
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Ticket className="mr-2 h-4 w-4" />
                        Pay ₹{totalAmount}
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    By proceeding, you agree to our Terms of Service and Refund Policy
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
