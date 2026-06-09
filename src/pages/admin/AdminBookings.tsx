import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ticket, Loader2, Eye, Check, X, Search, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useAdminBookings, useUpdateBookingStatus } from '@/hooks/useAdmin';
import { toast } from 'sonner';
import { format } from 'date-fns';
import QRCodeDisplay from '@/components/QRCodeDisplay';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-700 hover:bg-green-100/80';
    case 'completed':
      return 'bg-blue-100 text-blue-700 hover:bg-blue-100/80';
    case 'cancelled':
      return 'bg-red-100 text-red-700 hover:bg-red-100/80';
    case 'pending':
      return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const AdminBookings: React.FC = () => {
  const { data: bookings, isLoading } = useAdminBookings();
  const updateStatus = useUpdateBookingStatus();
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      await updateStatus.mutateAsync({ id: bookingId, status: newStatus });
      toast.success('Booking status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredBookings = React.useMemo(() => {
    if (!bookings) return [];

    return bookings.filter(booking => {
      const statusMatch = statusFilter === 'all' ? true : booking.status === statusFilter;
      const searchLower = searchQuery.toLowerCase();
      const searchMatch = !searchQuery ||
        booking.id.toLowerCase().includes(searchLower) ||
        booking.title?.toLowerCase().includes(searchLower) ||
        booking.venue?.toLowerCase().includes(searchLower);

      let dateMatch = true;
      if (dateFrom) {
        dateMatch = dateMatch && new Date(booking.date) >= new Date(dateFrom);
      }
      if (dateTo) {
        dateMatch = dateMatch && new Date(booking.date) <= new Date(dateTo);
      }

      return statusMatch && searchMatch && dateMatch;
    });
  }, [bookings, statusFilter, searchQuery, dateFrom, dateTo]);

  const stats = {
    total: bookings?.length || 0,
    confirmed: bookings?.filter(b => b.status === 'confirmed' || b.status === 'completed').length || 0,
    pending: bookings?.filter(b => b.status === 'pending').length || 0,
    cancelled: bookings?.filter(b => b.status === 'cancelled').length || 0,
    revenue: bookings?.filter(b => ['confirmed', 'completed'].includes(b.status))
      .reduce((acc, curr) => acc + Number(curr.amount), 0) || 0
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Bookings</h1>
        <p className="text-muted-foreground">View and manage all ticket bookings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Confirmed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cancelled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.revenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="border-none shadow-sm">
        <div className="p-6 flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Ticket className="h-5 w-5 text-muted-foreground" />
              All Bookings
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  className="w-[150px] rounded-full bg-white border-slate-200 text-black"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="date"
                  className="w-[150px] rounded-full bg-white border-slate-200 text-black"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px] rounded-full bg-white border-slate-200 text-black">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
                <Input
                  placeholder="Search bookings..."
                  className="pl-10 h-10 rounded-full bg-white border border-slate-200 focus:ring-2 focus:ring-primary/20 transition-all duration-300 placeholder:text-black text-black"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking Details</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Seats</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No bookings found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings?.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{booking.title}</span>
                          <span className="text-xs text-muted-foreground">{booking.venue}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{format(new Date(booking.date), 'MMM d, yyyy')}</span>
                          <span className="text-xs text-muted-foreground">{booking.time}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{booking.seats?.join(', ') || 'N/A'}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">₹{Number(booking.amount).toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(booking.status)}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => setSelectedBooking(booking)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {booking.status === 'pending' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-green-600"
                              onClick={() => handleStatusChange(booking.id, 'confirmed')}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>

      {/* Booking Detail Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[80vh] pr-4">
            {selectedBooking && (
              <div className="space-y-6 pb-10">
                <div className="flex justify-center">
                  <QRCodeDisplay
                    value={selectedBooking.qr_code || selectedBooking.id}
                    size={160}
                    title={selectedBooking.qr_code}
                  />
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Booking ID</span>
                    <span className="font-mono text-foreground">{selectedBooking.id.slice(0, 8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Title</span>
                    <span className="font-medium text-foreground">{selectedBooking.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <Badge variant="secondary">{selectedBooking.booking_type}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date & Time</span>
                    <span className="text-foreground">
                      {format(new Date(selectedBooking.date), 'MMM d, yyyy')} • {selectedBooking.time}
                    </span>
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
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity</span>
                    <span className="text-foreground">{selectedBooking.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-bold text-foreground">₹{Number(selectedBooking.amount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="text-foreground">{selectedBooking.payment_method || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant="outline" className={getStatusColor(selectedBooking.status)}>
                      {selectedBooking.status}
                    </Badge>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Select
                    value={selectedBooking.status}
                    onValueChange={(status) => {
                      handleStatusChange(selectedBooking.id, status);
                      setSelectedBooking({ ...selectedBooking, status });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBookings;