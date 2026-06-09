import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Ticket, CreditCard, Smartphone, Building2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { useEvent } from '@/hooks/useEvents';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateBooking } from '@/hooks/useBookings';
import { toast } from 'sonner';

const paymentMethods = [
  {
    id: 'upi',
    label: 'UPI',
    icon: Smartphone,
    description: 'Google Pay, PhonePe, Paytm',
  },
  {
    id: 'card',
    label: 'Credit/Debit Card',
    icon: CreditCard,
    description: 'Visa, Mastercard, Rupay',
  },
  {
    id: 'netbanking',
    label: 'Net Banking',
    icon: Building2,
    description: 'All major banks',
  },
];

const EventBooking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: event, isLoading } = useEvent(id);
  const createBooking = useCreateBooking();

  const [ticketCount, setTicketCount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingId, setBookingId] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleTicketChange = (delta: number) => {
    const newCount = ticketCount + delta;
    if (newCount >= 1 && newCount <= Math.min(10, event?.available_tickets || 10)) {
      setTicketCount(newCount);
    }
  };

  const subtotal = event ? event.price * ticketCount : 0;
  const convenienceFee = Math.round(subtotal * 0.03);
  const total = subtotal + convenienceFee;

  const handlePayment = async () => {
    if (!event) return;

    if (paymentMethod === 'upi' && !upiId) {
      toast.error('Please enter your UPI ID');
      return;
    }

    setProcessing(true);
    
    try {
      const eventDate = new Date(event.date);
      const booking = await createBooking.mutateAsync({
        booking_type: 'event',
        reference_id: event.id,
        title: event.title,
        venue: event.venue,
        date: eventDate.toISOString().split('T')[0],
        time: eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        quantity: ticketCount,
        amount: total,
        payment_method: paymentMethod,
      });
      
      setBookingId(booking.id.slice(0, 8).toUpperCase());
      setBookingComplete(true);
      toast.success('Booking confirmed!');
    } catch (error) {
      toast.error('Failed to complete booking. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="w-full h-[600px] rounded-xl" />
        </div>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Event Not Found</h1>
          <Button asChild>
            <Link to="/events">Browse Events</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  if (bookingComplete) {
    return (
      <Layout>
        <div className="bg-gradient-to-b from-primary/5 to-background min-h-[calc(100vh-4rem)]">
          <div className="container mx-auto px-4 py-12">
            <Card className="max-w-lg mx-auto">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Ticket className="h-10 w-10 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Booking Confirmed!
                </h1>
                <p className="text-muted-foreground mb-6">
                  Your tickets have been booked successfully
                </p>

                <div className="bg-muted/30 rounded-lg p-4 mb-6 text-left">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Booking ID</span>
                      <span className="font-mono font-medium text-foreground">{bookingId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Event</span>
                      <span className="font-medium text-foreground">{event.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tickets</span>
                      <span className="font-medium text-foreground">{ticketCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-medium text-foreground">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-medium text-foreground">Total Paid</span>
                      <span className="font-bold text-primary">₹{total}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button asChild>
                    <Link to="/bookings">View My Bookings</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/events">Explore More Events</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gradient-to-b from-primary/5 to-background min-h-[calc(100vh-4rem)]">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" asChild>
              <Link to={`/events/${id}`}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Book Tickets</h1>
              <p className="text-sm text-muted-foreground">{event.title}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Ticket Selection */}
            <div className="lg:col-span-2 space-y-6">
              {/* Event Summary */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <img
                      src={event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&h=150&fit=crop'}
                      alt={event.title}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{event.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{event.venue}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ticket Count */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ticket className="h-5 w-5 text-primary" />
                    Select Tickets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">General Admission</p>
                      <p className="text-sm text-muted-foreground">
                        {event.is_free ? 'Free' : `₹${event.price} per ticket`}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleTicketChange(-1)}
                        disabled={ticketCount <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-xl font-semibold text-foreground w-8 text-center">
                        {ticketCount}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleTicketChange(1)}
                        disabled={ticketCount >= Math.min(10, event.available_tickets)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Maximum 10 tickets per booking • {event.available_tickets} tickets available
                  </p>
                </CardContent>
              </Card>

              {/* Payment Method */}
              {!event.is_free && (
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="space-y-3">
                        {paymentMethods.map((method) => (
                          <Label
                            key={method.id}
                            htmlFor={method.id}
                            className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                              paymentMethod === method.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <RadioGroupItem value={method.id} id={method.id} />
                            <method.icon className="h-5 w-5 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="font-medium text-foreground">{method.label}</p>
                              <p className="text-sm text-muted-foreground">{method.description}</p>
                            </div>
                          </Label>
                        ))}
                      </div>
                    </RadioGroup>

                    {paymentMethod === 'upi' && (
                      <div className="mt-4">
                        <Label htmlFor="upi-id">UPI ID</Label>
                        <Input
                          id="upi-id"
                          placeholder="yourname@upi"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Tickets ({ticketCount} × ₹{event.price})
                    </span>
                    <span className="text-foreground">₹{subtotal}</span>
                  </div>
                  {!event.is_free && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Convenience Fee</span>
                      <span className="text-foreground">₹{convenienceFee}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">Total</span>
                    <span className="font-bold text-xl text-primary">
                      {event.is_free ? 'Free' : `₹${total}`}
                    </span>
                  </div>

                  <Button 
                    className="w-full" 
                    size="lg" 
                    onClick={handlePayment}
                    disabled={processing}
                  >
                    {processing ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                        Processing...
                      </span>
                    ) : event.is_free ? (
                      'Confirm Booking'
                    ) : (
                      `Pay ₹${total}`
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    By proceeding, you agree to our Terms & Conditions
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

export default EventBooking;
