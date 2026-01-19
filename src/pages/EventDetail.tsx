import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  ArrowLeft, 
  Share2, 
  Heart, 
  Users,
  Ticket,
  Info
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useEvent } from '@/hooks/useEvents';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: event, isLoading, error } = useEvent(id);

  const formatDate = (date: string, endDate?: string | null) => {
    const start = new Date(date);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    };
    
    if (endDate) {
      const end = new Date(endDate);
      return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
    }
    return start.toLocaleDateString('en-US', options);
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleBookNow = () => {
    if (!user) {
      toast.error('Please sign in to book tickets');
      navigate('/login');
      return;
    }
    navigate(`/events/${id}/book`);
  };

  const handleShare = () => {
    navigator.share?.({
      title: event?.title,
      url: window.location.href,
    }).catch(() => {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="w-full h-[400px] rounded-xl mb-8" />
          <Skeleton className="w-1/2 h-10 mb-4" />
          <Skeleton className="w-full h-32" />
        </div>
      </Layout>
    );
  }

  if (error || !event) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Event Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/events">Browse Events</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const ticketsRemaining = event.available_tickets;
  const ticketPercentage = (ticketsRemaining / event.total_tickets) * 100;

  return (
    <Layout>
      <div className="bg-gradient-to-b from-primary/5 to-background min-h-screen">
        {/* Hero Section */}
        <div className="relative h-[400px] md:h-[500px] overflow-hidden">
          <img
            src={event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop'}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          
          {/* Back Button */}
          <div className="absolute top-4 left-4 z-10">
            <Button variant="secondary" size="icon" asChild>
              <Link to="/events">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Button variant="secondary" size="icon" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="secondary" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          {/* Event Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="container mx-auto">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge>{event.category}</Badge>
                {event.is_free && (
                  <Badge variant="secondary" className="bg-green-500/20 text-green-600">
                    Free Entry
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                {event.title}
              </h1>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Event Details */}
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Date</h3>
                        <p className="text-muted-foreground">
                          {formatDate(event.date, event.end_date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Time</h3>
                        <p className="text-muted-foreground">{formatTime(event.date)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Venue</h3>
                        <p className="text-muted-foreground">{event.venue}</p>
                      </div>
                    </div>

                    {event.organizer && (
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">Organizer</h3>
                          <p className="text-muted-foreground">{event.organizer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    About This Event
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {event.description || 'No description available for this event.'}
                  </p>
                </CardContent>
              </Card>

              {/* Terms & Conditions */}
              <Card>
                <CardHeader>
                  <CardTitle>Terms & Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Entry only with valid ticket</li>
                    <li>No refunds or cancellations once booked</li>
                    <li>Gates open 1 hour before event start time</li>
                    <li>Children below 5 years not allowed</li>
                    <li>Outside food and beverages not permitted</li>
                    <li>Rights of admission reserved</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-muted-foreground">Price</span>
                    <span className="text-3xl font-bold text-primary">
                      {event.is_free ? 'Free' : `₹${event.price.toLocaleString()}`}
                    </span>
                  </div>

                  <Separator className="my-4" />

                  {/* Ticket Availability */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Ticket className="h-4 w-4" />
                        Tickets Remaining
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {ticketsRemaining} / {event.total_tickets}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          ticketPercentage > 50 
                            ? 'bg-green-500' 
                            : ticketPercentage > 20 
                            ? 'bg-yellow-500' 
                            : 'bg-destructive'
                        }`}
                        style={{ width: `${ticketPercentage}%` }}
                      />
                    </div>
                    {ticketPercentage < 20 && (
                      <p className="text-xs text-destructive mt-2">
                        Hurry! Only a few tickets left
                      </p>
                    )}
                  </div>

                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleBookNow}
                    disabled={ticketsRemaining === 0}
                  >
                    {ticketsRemaining === 0 ? 'Sold Out' : 'Book Now'}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground mt-4">
                    Secure checkout • Instant confirmation
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

export default EventDetail;
