import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
    User,
    Bell,
    Shield,
    Palette,
    Mail,
    Smartphone,
    Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';

const AdminSettings: React.FC = () => {
    const { user } = useAuth();
    const { data: profile, isLoading: profileLoading } = useProfile();
    const updateProfile = useUpdateProfile();

    // Account State
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    // Appearance State
    const [darkMode, setDarkMode] = useState(false);
    const [compactMode, setCompactMode] = useState(false);

    // Notifications State
    const [emailNotif, setEmailNotif] = useState(true);
    const [bookingAlerts, setBookingAlerts] = useState(true);
    const [marketingEmails, setMarketingEmails] = useState(false);

    // Security State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [securityLoading, setSecurityLoading] = useState(false);

    // Load Profile Data
    useEffect(() => {
        if (profile) {
            const names = (profile.full_name || '').split(' ');
            setFirstName(names[0] || '');
            setLastName(names.slice(1).join(' ') || '');
            setPhone(profile.phone || '');
        }
        if (user?.email) {
            setEmail(user.email);
        }
    }, [profile, user]);

    // Load Local Settings
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        setDarkMode(savedTheme === 'dark');

        const savedCompact = localStorage.getItem('compactMode');
        setCompactMode(savedCompact === 'true');

        const savedNotifs = localStorage.getItem('notifications');
        if (savedNotifs) {
            const parsed = JSON.parse(savedNotifs);
            setEmailNotif(parsed.email);
            setBookingAlerts(parsed.booking);
            setMarketingEmails(parsed.marketing);
        }
    }, []);

    const handleSaveAccount = async () => {
        try {
            await updateProfile.mutateAsync({
                full_name: `${firstName} ${lastName}`.trim(),
                phone: phone
            });
            toast.success('Account information updated successfully');
        } catch (error) {
            toast.error('Failed to update account information');
        }
    };

    const handleSaveAppearance = () => {
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
        localStorage.setItem('compactMode', String(compactMode));

        // Apply theme immediately
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        toast.success('Appearance preferences saved');
    };

    const handleSaveNotifications = () => {
        const settings = {
            email: emailNotif,
            booking: bookingAlerts,
            marketing: marketingEmails
        };
        localStorage.setItem('notifications', JSON.stringify(settings));
        toast.success('Notification preferences saved');
    };

    const handleUpdateSecurity = async () => {
        if (!newPassword) {
            toast.error('Please enter a new password');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setSecurityLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            toast.success('Password updated successfully');
            setNewPassword('');
            setConfirmPassword('');
            setCurrentPassword('');
        } catch (error: any) {
            toast.error(error.message || 'Failed to update password');
        } finally {
            setSecurityLoading(false);
        }
    };

    if (profileLoading) {
        return <div className="p-8 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
    }

    return (
        <div className="p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Settings
                </h1>
                <p className="text-muted-foreground mt-1">
                    Manage your account and platform preferences
                </p>
            </div>

            <Tabs defaultValue="account" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:w-[600px] lg:grid-cols-4 bg-slate-300 dark:bg-slate-800 p-1 mb-8 rounded-full">
                    <TabsTrigger value="account" className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-white data-[state=active]:text-black dark:data-[state=active]:text-black">Account</TabsTrigger>
                    <TabsTrigger value="appearance" className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-white data-[state=active]:text-black dark:data-[state=active]:text-black">Appearance</TabsTrigger>
                    <TabsTrigger value="notifications" className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-white data-[state=active]:text-black dark:data-[state=active]:text-black">Notifications</TabsTrigger>
                    <TabsTrigger value="security" className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-white data-[state=active]:text-black dark:data-[state=active]:text-black">Security</TabsTrigger>
                </TabsList>

                {/* Account Tab */}
                <TabsContent value="account" className="space-y-4 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                Profile Information
                            </CardTitle>
                            <CardDescription>
                                Update your account profile details and contact info.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        className="pl-9"
                                        value={email}
                                        disabled
                                        readOnly
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">Email address cannot be changed</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <div className="relative">
                                    <Smartphone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="phone"
                                        className="pl-9"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+91 99999 99999"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="flex justify-end">
                        <Button onClick={handleSaveAccount} disabled={updateProfile.isPending}>
                            {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </TabsContent>

                {/* Appearance Tab */}
                <TabsContent value="appearance" className="space-y-4 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Palette className="h-5 w-5 text-primary" />
                                Theme Preferences
                            </CardTitle>
                            <CardDescription>
                                Customize how the admin panel looks on your device.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Dark Mode</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Switch between light and dark themes
                                    </p>
                                </div>
                                <Switch
                                    checked={darkMode}
                                    onCheckedChange={setDarkMode}
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Compact Mode</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Reduce whitespace for higher information density
                                    </p>
                                </div>
                                <Switch
                                    checked={compactMode}
                                    onCheckedChange={setCompactMode}
                                />
                            </div>
                        </CardContent>
                    </Card>
                    <div className="flex justify-end">
                        <Button onClick={handleSaveAppearance}>
                            Save Preferences
                        </Button>
                    </div>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-4 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5 text-primary" />
                                Notification Settings
                            </CardTitle>
                            <CardDescription>
                                Configure how and when you receive notifications.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Email Notifications</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive updates via email
                                    </p>
                                </div>
                                <Switch
                                    checked={emailNotif}
                                    onCheckedChange={setEmailNotif}
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">New Booking Alerts</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Get notified when a new booking is made
                                    </p>
                                </div>
                                <Switch
                                    checked={bookingAlerts}
                                    onCheckedChange={setBookingAlerts}
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Marketing Emails</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive news about new features and updates
                                    </p>
                                </div>
                                <Switch
                                    checked={marketingEmails}
                                    onCheckedChange={setMarketingEmails}
                                />
                            </div>
                        </CardContent>
                    </Card>
                    <div className="flex justify-end">
                        <Button onClick={handleSaveNotifications}>
                            Save Settings
                        </Button>
                    </div>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="space-y-4 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-primary" />
                                Security Settings
                            </CardTitle>
                            <CardDescription>
                                Manage password and account security.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Min. 6 characters"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            </div>
                            <Separator className="my-4" />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Two-Factor Authentication</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Add an extra layer of security to your account
                                    </p>
                                </div>
                                <Button variant="outline" disabled>Enable 2FA (Coming Soon)</Button>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="flex justify-end">
                        <Button onClick={handleUpdateSecurity} disabled={securityLoading}>
                            {securityLoading ? 'Updating...' : 'Update Password'}
                        </Button>
                    </div>
                </TabsContent>

            </Tabs>
        </div>
    );
};

export default AdminSettings;
