import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Loader2, MoreHorizontal, Shield, ShieldCheck, User, UserCog, Search, Briefcase, ScanLine } from 'lucide-react';
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
import { useAdminBookings } from '@/hooks/useAdmin';

interface UserWithRoles {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  full_name: string | null;
  roles: string[];
}

const useUsers = () => {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      return profiles.map(profile => {
        const userRoles = roles
          .filter(r => r.user_id === profile.user_id)
          .map(r => r.role);

        return {
          id: profile.user_id,
          email: 'Hidden (Auth)', // In a real app we'd need an Edge Function to get emails safely
          full_name: profile.full_name || 'Unknown',
          created_at: profile.created_at,
          last_sign_in_at: null,
          roles: userRoles
        } as UserWithRoles;
      });
    },
  });
};

const useManageRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ action, user_id, role }: { action: 'add' | 'remove'; user_id: string; role: string }) => {
      if (action === 'add') {
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id, role: role as any });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .match({ user_id, role: role as any });
        if (error) throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success(
        variables.action === 'add'
          ? `Role "${variables.role}" added successfully`
          : `Role "${variables.role}" removed successfully`
      );
    },
    onError: (error: Error) => {
      toast.error(`Failed to update role: ${error.message}`);
    },
  });
};

const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case 'admin': return 'destructive'; // Red for admin
    case 'moderator': return 'default'; // Dark/Primary for moderator
    case 'event_organizer': return 'secondary'; // Purple/Blue context usually
    case 'staff': return 'outline'; // Distinctive outline
    default: return 'secondary';
  }
};

const AdminUsers: React.FC = () => {
  const { data: users, isLoading: usersLoading } = useUsers();
  const { data: bookings, isLoading: bookingsLoading } = useAdminBookings();
  const manageRole = useManageRole();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: 'add' | 'remove';
    userId: string;
    role: string;
    userEmail: string;
  } | null>(null);

  // Combine user data with booking stats
  const enrichedUsers = useMemo(() => {
    if (!users) return [];

    return users.map(user => {
      const userBookings = bookings?.filter((b: any) => b.user_id === user.id) || [];
      const totalSpent = userBookings
        .filter((b: any) => b.status === 'confirmed' || b.status === 'completed')
        .reduce((sum: number, b: any) => sum + Number(b.amount), 0);

      return {
        ...user,
        bookingsCount: userBookings.length,
        totalSpent
      };
    });
  }, [users, bookings]);

  const filteredUsers = useMemo(() => {
    return enrichedUsers.filter(user => {
      const matchesSearch =
        (user.full_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (user.email.toLowerCase()).includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === 'all'
        ? true
        : roleFilter === 'admin'
          ? user.roles.includes('admin')
          : roleFilter === 'moderator'
            ? user.roles.includes('moderator')
            : roleFilter === 'event_organizer'
              ? user.roles.includes('event_organizer')
              : roleFilter === 'staff'
                ? user.roles.includes('staff')
                : (user.roles.includes('user') || user.roles.length === 0); // 'user' filter with fallback

      return matchesSearch && matchesRole;
    });
  }, [enrichedUsers, searchQuery, roleFilter]);

  const stats = {
    total: users?.length || 0,
    admins: users?.filter(u => u.roles.includes('admin')).length || 0,
    managers: users?.filter(u => u.roles.includes('moderator')).length || 0,
    organizers: users?.filter(u => u.roles.includes('event_organizer')).length || 0,
    staff: users?.filter(u => u.roles.includes('staff')).length || 0,
    active: 0 // Placeholder as we don't have accurate last_sign_in
  };

  const handleRoleAction = (action: 'add' | 'remove', userId: string, role: string, userEmail: string) => {
    setConfirmDialog({ open: true, action, userId, role, userEmail });
  };

  const confirmRoleAction = () => {
    if (confirmDialog) {
      manageRole.mutate({
        action: confirmDialog.action,
        user_id: confirmDialog.userId,
        role: confirmDialog.role,
      });
      setConfirmDialog(null);
    }
  };

  if (usersLoading || bookingsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground">Manage users and their roles</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.admins}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Managers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.managers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Event Organizers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.organizers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.staff}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="border-none shadow-sm">
        <div className="p-6 flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <UserCog className="h-5 w-5 text-muted-foreground" />
              Users
            </h2>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[150px] rounded-full bg-white border-slate-200 text-black">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                  <SelectItem value="moderator">Managers</SelectItem>
                  <SelectItem value="event_organizer">Event Organizers</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="user">Customers</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative flex-1 md:w-[250px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
                <Input
                  placeholder="Search users..."
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
                  <TableHead>User</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Spent</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{user.full_name || 'No name'}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.roles.length > 0 ? (
                            user.roles.map((role) => (
                              <Badge key={role} variant={getRoleBadgeVariant(role)} className="h-5 px-2 text-[10px] uppercase">
                                {role}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{user.bookingsCount}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">₹{user.totalSpent.toLocaleString()}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(user.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <UserCog className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Manage Roles</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {!user.roles.includes('admin') && (
                              <DropdownMenuItem onClick={() => handleRoleAction('add', user.id, 'admin', user.email)}>
                                <ShieldCheck className="h-4 w-4 mr-2 text-destructive" />
                                Make Admin
                              </DropdownMenuItem>
                            )}
                            {user.roles.includes('admin') && (
                              <DropdownMenuItem onClick={() => handleRoleAction('remove', user.id, 'admin', user.email)}>
                                <ShieldCheck className="h-4 w-4 mr-2" />
                                Remove Admin
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator />

                            {!user.roles.includes('moderator') && (
                              <DropdownMenuItem onClick={() => handleRoleAction('add', user.id, 'moderator', user.email)}>
                                <Shield className="h-4 w-4 mr-2 text-primary" />
                                Make Manager
                              </DropdownMenuItem>
                            )}
                            {user.roles.includes('moderator') && (
                              <DropdownMenuItem onClick={() => handleRoleAction('remove', user.id, 'moderator', user.email)}>
                                <Shield className="h-4 w-4 mr-2" />
                                Remove Manager
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator />

                            {!user.roles.includes('event_organizer') && (
                              <DropdownMenuItem onClick={() => handleRoleAction('add', user.id, 'event_organizer', user.email)}>
                                <Briefcase className="h-4 w-4 mr-2 text-indigo-600" />
                                Make Organizer
                              </DropdownMenuItem>
                            )}
                            {user.roles.includes('event_organizer') && (
                              <DropdownMenuItem onClick={() => handleRoleAction('remove', user.id, 'event_organizer', user.email)}>
                                <Briefcase className="h-4 w-4 mr-2" />
                                Remove Organizer
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator />

                            {!user.roles.includes('staff') && (
                              <DropdownMenuItem onClick={() => handleRoleAction('add', user.id, 'staff', user.email)}>
                                <ScanLine className="h-4 w-4 mr-2 text-orange-600" />
                                Make Staff
                              </DropdownMenuItem>
                            )}
                            {user.roles.includes('staff') && (
                              <DropdownMenuItem onClick={() => handleRoleAction('remove', user.id, 'staff', user.email)}>
                                <ScanLine className="h-4 w-4 mr-2" />
                                Remove Staff
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>

      <AlertDialog open={confirmDialog?.open} onOpenChange={(open) => !open && setConfirmDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog?.action === 'add' ? 'Add Role' : 'Remove Role'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {confirmDialog?.action === 'add' ? 'add' : 'remove'} the{' '}
              <strong>{confirmDialog?.role}</strong> role {confirmDialog?.action === 'add' ? 'to' : 'from'}{' '}
              <strong>{confirmDialog?.userEmail}</strong>?
              {confirmDialog?.role === 'admin' && (
                <span className="block mt-2 text-destructive font-medium">
                  Warning: Admin users have full access to all features.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRoleAction}
              className={confirmDialog?.action === 'remove' ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              {manageRole.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div >
  );
};

export default AdminUsers;