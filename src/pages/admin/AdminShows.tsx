import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Clock, Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAdminShows, useCreateShow, useUpdateShow, useDeleteShow, useAdminMovies, useAdminTheatres } from '@/hooks/useAdmin';
import { toast } from 'sonner';
import { format } from 'date-fns';

const emptyFormData = {
  movie_id: '',
  theatre_id: '',
  screen: '',
  show_date: '',
  show_time: '',
  price: '',
  premium_price: '',
  vip_price: '',
  recliners_price: '',
  format: '2D',
  total_seats: '100',
  status: 'available',
};

const AdminShows: React.FC = () => {
  const { data: shows, isLoading } = useAdminShows();
  const { data: movies } = useAdminMovies();
  const { data: theatres } = useAdminTheatres();
  const createShow = useCreateShow();
  const updateShow = useUpdateShow();
  const deleteShow = useDeleteShow();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingShow, setEditingShow] = useState<any>(null);
  const [formData, setFormData] = useState(emptyFormData);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredShows = React.useMemo(() => {
    if (!shows) return [];
    if (!searchQuery) return shows;

    const query = searchQuery.toLowerCase();
    return shows.filter(show =>
      show.movie?.title?.toLowerCase().includes(query) ||
      show.theatre?.name?.toLowerCase().includes(query)
    );
  }, [shows, searchQuery]);

  const filteredTheatres = React.useMemo(() => {
    if (!theatres) return [];
    return theatres.filter(t =>
      t.type === 'cinema' ||
      t.facilities?.includes('_type:cinema') ||
      (!t.type && !t.facilities?.some((f: string) => f.startsWith('_type:')))
    );
  }, [theatres]);

  const openCreateDialog = () => {
    setEditingShow(null);
    setFormData(emptyFormData);
    setDialogOpen(true);
  };

  const openEditDialog = (show: any) => {
    setEditingShow(show);
    const showDate = new Date(show.show_time);
    setFormData({
      movie_id: show.movie_id || '',
      theatre_id: show.theatre_id || '',
      screen: show.screen || 'Screen 1',
      show_date: format(showDate, 'yyyy-MM-dd'),
      show_time: format(showDate, 'HH:mm'),
      price: show.price?.toString() || '',
      premium_price: show.premium_price?.toString() || '',
      vip_price: show.vip_price?.toString() || '',
      recliners_price: show.recliners_price?.toString() || '',
      format: show.format || '2D',
      total_seats: show.total_seats?.toString() || '100',
      status: show.status || 'available',
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const showTime = `${formData.show_date}T${formData.show_time}:00+05:30`;

      if (editingShow) {
        await updateShow.mutateAsync({
          id: editingShow.id,
          movie_id: formData.movie_id,
          theatre_id: formData.theatre_id,
          show_time: showTime,
          price: parseFloat(formData.price),
          premium_price: formData.premium_price ? parseFloat(formData.premium_price) : undefined,
          vip_price: formData.vip_price ? parseFloat(formData.vip_price) : undefined,
          recliners_price: formData.recliners_price ? parseFloat(formData.recliners_price) : undefined,
          format: formData.format,
          total_seats: parseInt(formData.total_seats),
          status: formData.status,
        });
        toast.success('Show updated successfully');
      } else {
        await createShow.mutateAsync({
          movie_id: formData.movie_id,
          theatre_id: formData.theatre_id,
          show_time: showTime,
          price: parseFloat(formData.price),
          // premium_price: formData.premium_price ? parseFloat(formData.premium_price) : undefined, // Not in DB
          // vip_price: formData.vip_price ? parseFloat(formData.vip_price) : undefined, // Not in DB
          // recliners_price: formData.recliners_price ? parseFloat(formData.recliners_price) : undefined, // Not in DB
          format: formData.format,
          total_seats: parseInt(formData.total_seats),
          available_seats: parseInt(formData.total_seats),
          status: 'available',
          // screen: formData.screen // Not in DB
        });
        toast.success('Show created successfully');
      }
      setDialogOpen(false);
      setFormData(emptyFormData);
      setEditingShow(null);
    } catch (error: any) {
      console.error('Error creating/updating show:', error);
      toast.error(editingShow ? 'Failed to update show: ' + error.message : 'Failed to create show: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteShow.mutateAsync(id);
      toast.success('Show deleted successfully');
    } catch (error) {
      toast.error('Failed to delete show');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Shows</h1>
          <p className="text-muted-foreground">Manage movie showtimes</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-full max-w-sm hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
            <Input
              placeholder="Search shows..."
              className="pl-10 h-10 rounded-full bg-white border border-slate-200 focus:ring-2 focus:ring-primary/20 transition-all duration-300 placeholder:text-black text-black"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={openCreateDialog} className="rounded-full bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Show
          </Button>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingShow ? 'Edit Show' : 'Add New Show'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="movie">Movie *</Label>
              <Select
                value={formData.movie_id}
                onValueChange={(value) => setFormData({ ...formData, movie_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select movie" />
                </SelectTrigger>
                <SelectContent>
                  {movies?.map((movie) => (
                    <SelectItem key={movie.id} value={movie.id}>
                      {movie.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="theatre">Theatre *</Label>
              <Select
                value={formData.theatre_id}
                onValueChange={(value) => setFormData({ ...formData, theatre_id: value, screen: '' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select theatre" />
                </SelectTrigger>
                <SelectContent>
                  {filteredTheatres?.map((theatre) => (
                    <SelectItem key={theatre.id} value={theatre.id}>
                      {theatre.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="screen">Screen</Label>
              <Select
                value={formData.screen}
                onValueChange={(value) => setFormData({ ...formData, screen: value })}
                disabled={!formData.theatre_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a screen" />
                </SelectTrigger>
                <SelectContent>
                  {formData.theatre_id && theatres?.find(t => t.id === formData.theatre_id)?.total_screens ? (
                    Array.from({ length: theatres.find(t => t.id === formData.theatre_id).total_screens }).map((_, i) => (
                      <SelectItem key={i + 1} value={`Screen ${i + 1}`}>
                        Screen {i + 1}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="Screen 1">Screen 1</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="show_date">Date *</Label>
                <Input
                  id="show_date"
                  type="date"
                  value={formData.show_date}
                  onChange={(e) => setFormData({ ...formData, show_date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="show_time">Time *</Label>
                <Input
                  id="show_time"
                  type="time"
                  value={formData.show_time}
                  onChange={(e) => setFormData({ ...formData, show_time: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Regular Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="premium_price">Premium (₹)</Label>
                <Input
                  id="premium_price"
                  type="number"
                  value={formData.premium_price}
                  onChange={(e) => setFormData({ ...formData, premium_price: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vip_price">VIP (₹)</Label>
                <Input
                  id="vip_price"
                  type="number"
                  value={formData.vip_price}
                  onChange={(e) => setFormData({ ...formData, vip_price: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="recliners_price">Recliners (₹)</Label>
                <Input
                  id="recliners_price"
                  type="number"
                  value={formData.recliners_price}
                  onChange={(e) => setFormData({ ...formData, recliners_price: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="format">Format</Label>
                <Select
                  value={formData.format}
                  onValueChange={(value) => setFormData({ ...formData, format: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2D">2D</SelectItem>
                    <SelectItem value="3D">3D</SelectItem>
                    <SelectItem value="IMAX">IMAX</SelectItem>
                    <SelectItem value="4DX">4DX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {editingShow && (
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="sold_out">Sold Out</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createShow.isPending || updateShow.isPending}>
                {(createShow.isPending || updateShow.isPending) ? 'Saving...' : editingShow ? 'Update Show' : 'Create Show'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        {filteredShows?.map((show) => (
          <Card key={show.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{show.movie?.title}</h3>
                    <p className="text-sm text-muted-foreground">{show.theatre?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium text-foreground">
                      {format(new Date(show.show_time), 'MMM d, yyyy')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(show.show_time), 'h:mm a')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{show.format}</Badge>
                    <Badge variant="secondary">₹{show.price}</Badge>
                    <Badge variant={show.status === 'available' ? 'default' : 'destructive'}>
                      {show.available_seats}/{show.total_seats}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(show)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Show</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this show? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(show.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredShows?.length === 0 && (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground">No shows yet</h3>
          <p className="text-muted-foreground">Get started by adding your first show.</p>
        </div>
      )}
    </div>
  );
};

export default AdminShows;