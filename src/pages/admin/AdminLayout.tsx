import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Film,
  Calendar,
  Trophy,
  Users,
  BarChart3,
  Settings,
  Menu,
  X,
  Ticket,
  LogOut,
  ChevronDown,
  Loader2,
  ShieldAlert,
  Home,
  Grid,
  MapPin,
  Utensils,
  Tag,
  Clock,
  Clapperboard,
  ShoppingBag,
  Dumbbell,
  Megaphone,
  Star,
  ChevronRight,
  Layers,
  Store
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useIsAdmin } from '@/hooks/useAdmin';

type SidebarItem = {
  label: string;
  icon: React.ElementType;
  href?: string;
  items?: SidebarItem[];
};

const sidebarItems: SidebarItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { label: 'Movies', icon: Film, href: '/admin/movies' },
  { label: 'Events', icon: Calendar, href: '/admin/events' },
  { label: 'Sports', icon: Dumbbell, href: '/admin/sports' },
  { label: 'Plays', icon: Clapperboard, href: '/admin/plays' },
  { label: 'Venues', icon: MapPin, href: '/admin/venues' },
  { label: 'Seat Layouts', icon: Grid, href: '/admin/seat-layouts' },
  { label: 'Movie Showtimes', icon: Clock, href: '/admin/shows' },
  { label: 'Event Shows', icon: Calendar, href: '/admin/event-shows' },
  { label: 'Sports Shows', icon: Dumbbell, href: '/admin/sports-shows' },
  { label: 'Play Shows', icon: Clapperboard, href: '/admin/play-shows' },
  { label: 'Bookings', icon: Ticket, href: '/admin/bookings' },
  { label: 'Food & Beverages', icon: Utensils, href: '/admin/food' },
  { label: 'Kitchen Orders', icon: ShoppingBag, href: '/admin/kitchen-orders' },
  { label: 'Promo Codes', icon: Tag, href: '/admin/promocodes' },
  { label: 'Announcements', icon: Megaphone, href: '/admin/announcements' },
  { label: 'Users', icon: Users, href: '/admin/users' },
  { label: 'Spotlights', icon: Star, href: '/admin/spotlights' },
  { label: 'Settings', icon: Settings, href: '/admin/settings' },
];

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();

  // State to track which collapsibles are open
  // Initialize with groups that contain the current active route
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  useEffect(() => {
    // Determine which group should be open based on current path
    const activeGroupLabel = sidebarItems.find(item =>
      item.items?.some(subItem => subItem.href === location.pathname)
    )?.label;

    if (activeGroupLabel && !openGroups.includes(activeGroupLabel)) {
      setOpenGroups(prev => [...prev, activeGroupLabel]);
    }
  }, [location.pathname]);

  const toggleGroup = (label: string) => {
    setOpenGroups(prev =>
      prev.includes(label)
        ? prev.filter(l => l !== label)
        : [...prev, label]
    );
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Show loading state
  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect if not logged in
  if (!user) {
    navigate('/login');
    return null;
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <ShieldAlert className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access the admin panel.
          </p>
          <Button asChild>
            <Link to="/">Go to Homepage</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-50 bg-background border-b border-border h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <Link to="/admin" className="flex items-center gap-2">
            <Ticket className="h-6 w-6 text-primary" />
            <span className="font-bold">Admin</span>
          </Link>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary">A</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform lg:translate-x-0 lg:static lg:block',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center gap-2 px-6 border-b border-border">
            <Ticket className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">
              Grab<span className="text-primary">A</span>ticket
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
            {sidebarItems.map((item) => {
              if (item.items) {
                // Render Group
                const isGroupActive = item.items.some(sub => sub.href === location.pathname);
                const isOpen = openGroups.includes(item.label);

                return (
                  <Collapsible
                    key={item.label}
                    open={isOpen}
                    onOpenChange={() => toggleGroup(item.label)}
                    className="space-y-1"
                  >
                    <CollapsibleTrigger asChild>
                      <button
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group',
                          isGroupActive
                            ? 'text-primary bg-primary/5'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className={cn("h-5 w-5", isGroupActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                          {item.label}
                        </div>
                        <ChevronRight className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-90")} />
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-1">
                      {item.items.map((subItem) => {
                        const isSubActive = location.pathname === subItem.href;
                        return (
                          <Link
                            key={subItem.href}
                            to={subItem.href!}
                            onClick={() => setSidebarOpen(false)}
                            className={cn(
                              'flex items-center gap-3 pl-11 pr-3 py-2 rounded-lg text-sm transition-colors',
                              isSubActive
                                ? 'text-primary font-medium bg-primary/10'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                            )}
                          >
                            {/* Keep sub-icons or remove them for simpler look? Removing for cleaner look based on "simpler" request, 
                                 but user's screenshots had icons. I'll keep them but lighter.
                              */}
                            {/* <subItem.icon className="h-4 w-4 opacity-70" /> */}
                            {/* Actually, indented text without icon is cleaner for sub-items usually, but consistency matters. 
                                 Let's keep text only or small dot? Let's use the layout requested. 
                                 The prompt said "simpler", so hierarchical text is good. */
                            }
                            {subItem.label}
                          </Link>
                        )
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                );
              }

              // Single Item
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href!}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-muted-foreground")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-1 w-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex-1 justify-start gap-3 h-auto p-2 overflow-hidden hover:bg-accent">
                    <Avatar className="h-9 w-9 shrink-0 border border-border">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {user?.email?.charAt(0).toUpperCase() || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {user?.email || 'Admin User'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">Super Admin</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/">View Site</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
                className="h-10 w-10 shrink-0 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                title="Back to Home"
              >
                <Home className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-16 lg:pt-0 bg-secondary/10">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
