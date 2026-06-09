import React from 'react';
import { VenueManager } from '@/components/admin/VenueManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminTheatres } from '@/hooks/useAdmin';

const AdminVenues: React.FC = () => {
    const { data: allVenues, isLoading } = useAdminTheatres();

    return (
        <div className="p-6 lg:p-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Venues Management</h1>
                <p className="text-muted-foreground">Manage all venue types</p>
            </div>

            <Tabs defaultValue="cinema" className="w-full">
                <TabsList className="w-full md:w-auto inline-flex h-12 items-center justify-start rounded-full bg-slate-300 p-1 text-black overflow-x-auto no-scrollbar">
                    <TabsTrigger
                        value="cinema"
                        className="rounded-full px-6 py-2 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm transition-all whitespace-nowrap"
                    >
                        Theatres
                    </TabsTrigger>
                    <TabsTrigger
                        value="event_venue"
                        className="rounded-full px-6 py-2 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm transition-all whitespace-nowrap"
                    >
                        Event Venues
                    </TabsTrigger>
                    <TabsTrigger
                        value="sports_venue"
                        className="rounded-full px-6 py-2 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm transition-all whitespace-nowrap"
                    >
                        Sports Venues
                    </TabsTrigger>
                    <TabsTrigger
                        value="play_venue"
                        className="rounded-full px-6 py-2 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm transition-all whitespace-nowrap"
                    >
                        Play Venues
                    </TabsTrigger>
                    <TabsTrigger
                        value="auditorium"
                        className="rounded-full px-6 py-2 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm transition-all whitespace-nowrap"
                    >
                        Auditoriums
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="cinema" className="pt-4">
                    <VenueManager
                        type="cinema"
                        title="Theatres"
                        // Fallback: Show untyped venues here so they are not lost
                        venues={allVenues?.filter(v =>
                            v.facilities?.includes('_type:cinema') ||
                            v.type === 'cinema' ||
                            (!v.type && (!v.facilities || !v.facilities.some((f: string) => f.startsWith('_type:'))))
                        )}
                        isLoading={isLoading}
                    />
                </TabsContent>
                <TabsContent value="event_venue" className="pt-4">
                    <VenueManager
                        type="event_venue"
                        title="Event Venues"
                        venues={allVenues?.filter(v => v.facilities?.includes('_type:event_venue') || v.type === 'event_venue')}
                        isLoading={isLoading}
                    />
                </TabsContent>
                <TabsContent value="sports_venue" className="pt-4">
                    <VenueManager
                        type="sports_venue"
                        title="Sports Venues"
                        venues={allVenues?.filter(v => v.facilities?.includes('_type:sports_venue') || v.type === 'sports_venue')}
                        isLoading={isLoading}
                    />
                </TabsContent>
                <TabsContent value="play_venue" className="pt-4">
                    <VenueManager
                        type="play_venue"
                        title="Play Venues"
                        venues={allVenues?.filter(v => v.facilities?.includes('_type:play_venue') || v.type === 'play_venue')}
                        isLoading={isLoading}
                    />
                </TabsContent>
                <TabsContent value="auditorium" className="pt-4">
                    <VenueManager
                        type="auditorium"
                        title="Auditoriums"
                        venues={allVenues?.filter(v => v.facilities?.includes('_type:auditorium') || v.type === 'auditorium')}
                        isLoading={isLoading}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminVenues;
