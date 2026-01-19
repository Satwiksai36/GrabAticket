import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Film, Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAdminMovies, useCreateMovie, useUpdateMovie, useDeleteMovie } from '@/hooks/useAdmin';
import { toast } from 'sonner';

const emptyFormData = {
  title: '',
  description: '',
  poster_url: '',
  banner_url: '',
  duration_minutes: '',
  language: '',
  genre: '',
  rating: '',
  release_date: '',
  status: 'now_showing',
  trailer_url: '',
};

const AdminMovies: React.FC = () => {
  const { data: movies, isLoading } = useAdminMovies();
  const createMovie = useCreateMovie();
  const updateMovie = useUpdateMovie();
  const deleteMovie = useDeleteMovie();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<any>(null);
  const [formData, setFormData] = useState(emptyFormData);

  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMovies = React.useMemo(() => {
    if (!movies) return [];

    let filtered = movies;

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter(movie => movie.status === selectedStatus);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(query) ||
        movie.genre?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [movies, selectedStatus, searchQuery]);

  const openCreateDialog = () => {
    setEditingMovie(null);
    setFormData(emptyFormData);
    setDialogOpen(true);
  };

  const openEditDialog = (movie: any) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title || '',
      description: movie.description || '',
      poster_url: movie.poster_url || '',
      banner_url: movie.banner_url || '',
      duration_minutes: movie.duration_minutes?.toString() || '',
      language: movie.language || '',
      genre: movie.genre || '',
      rating: movie.rating || '',
      release_date: movie.release_date || '',
      status: movie.status || 'now_showing',
      trailer_url: movie.trailer_url || '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const movieData = {
        title: formData.title,
        description: formData.description || undefined,
        poster_url: formData.poster_url || undefined,
        banner_url: formData.banner_url || undefined,
        duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : undefined,
        language: formData.language || undefined,
        genre: formData.genre || undefined,
        rating: formData.rating || undefined,
        release_date: formData.release_date || undefined,
        status: formData.status,
        trailer_url: formData.trailer_url || undefined,
      };

      if (editingMovie) {
        await updateMovie.mutateAsync({ id: editingMovie.id, ...movieData });
        toast.success('Movie updated successfully');
      } else {
        await createMovie.mutateAsync(movieData);
        toast.success('Movie created successfully');
      }
      setDialogOpen(false);
      setFormData(emptyFormData);
      setEditingMovie(null);
    } catch (error) {
      toast.error(editingMovie ? 'Failed to update movie' : 'Failed to create movie');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMovie.mutateAsync(id);
      toast.success('Movie deleted successfully');
    } catch (error) {
      toast.error('Failed to delete movie');
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
          <h1 className="text-2xl font-bold text-foreground">Movies</h1>
          <p className="text-muted-foreground">Manage movies and showtimes</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-full max-w-sm hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
            <Input
              placeholder="Search movies..."
              className="pl-10 h-10 rounded-full bg-white border border-slate-200 focus:ring-2 focus:ring-primary/20 transition-all duration-300 placeholder:text-black text-black"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={openCreateDialog} className="rounded-full bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Movie
          </Button>
        </div>
      </div>

      <div className="mb-8">
        <Tabs defaultValue="all" value={selectedStatus} onValueChange={setSelectedStatus} className="w-full">
          <TabsList className="w-auto inline-flex h-12 items-center justify-center rounded-full bg-slate-300 p-1 text-black">
            <TabsTrigger
              value="all"
              className="rounded-full px-8 py-2 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm transition-all"
            >
              All Movies
            </TabsTrigger>
            <TabsTrigger
              value="now_showing"
              className="rounded-full px-8 py-2 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm transition-all"
            >
              Now Showing
            </TabsTrigger>
            <TabsTrigger
              value="coming_soon"
              className="rounded-full px-8 py-2 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm transition-all"
            >
              Coming Soon
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{editingMovie ? 'Edit Movie' : 'Add New Movie'}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Input
                    id="language"
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="genre">Genre</Label>
                  <Input
                    id="genre"
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <Select
                    value={formData.rating}
                    onValueChange={(value) => setFormData({ ...formData, rating: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="U">U</SelectItem>
                      <SelectItem value="UA">UA</SelectItem>
                      <SelectItem value="A">A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="release_date">Release Date</Label>
                  <Input
                    id="release_date"
                    type="date"
                    value={formData.release_date}
                    onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                  />
                </div>
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
                      <SelectItem value="now_showing">Now Showing</SelectItem>
                      <SelectItem value="coming_soon">Coming Soon</SelectItem>
                      <SelectItem value="ended">Ended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="poster_url">Poster URL</Label>
                  <Input
                    id="poster_url"
                    value={formData.poster_url}
                    onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="banner_url">Banner URL</Label>
                  <Input
                    id="banner_url"
                    value={formData.banner_url}
                    onChange={(e) => setFormData({ ...formData, banner_url: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="trailer_url">Trailer URL</Label>
                  <Input
                    id="trailer_url"
                    value={formData.trailer_url}
                    onChange={(e) => setFormData({ ...formData, trailer_url: e.target.value })}
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMovie.isPending || updateMovie.isPending}>
                  {(createMovie.isPending || updateMovie.isPending) ? 'Saving...' : editingMovie ? 'Update Movie' : 'Create Movie'}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMovies?.map((movie) => (
          <Card key={movie.id}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="w-20 h-28 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                  {movie.poster_url ? (
                    <img
                      src={movie.poster_url}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Film className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{movie.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {movie.language} • {movie.duration_minutes || '--'} min
                  </p>
                  <p className="text-sm text-muted-foreground">{movie.genre}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={movie.status === 'now_showing' ? 'default' : 'secondary'}>
                      {movie.status?.replace('_', ' ')}
                    </Badge>
                    {movie.rating && <Badge variant="outline">{movie.rating}</Badge>}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="ghost" size="icon" onClick={() => openEditDialog(movie)}>
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
                      <AlertDialogTitle>Delete Movie</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{movie.title}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(movie.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMovies?.length === 0 && (
        <div className="text-center py-12">
          <Film className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground">No movies found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or add a new movie.</p>
        </div>
      )}
    </div>
  );
};

export default AdminMovies;