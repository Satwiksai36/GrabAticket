import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CityProvider } from "@/contexts/CityContext";
import Index from "./pages/Index";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Movies from "./pages/Movies";
import MovieDetail from "./pages/MovieDetail";
import SeatSelection from "./pages/SeatSelection";
import Checkout from "./pages/Checkout";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import EventBooking from "./pages/EventBooking";

import Plays from "./pages/Plays";
import Sports from "./pages/Sports";
import Venues from "./pages/Venues";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Bookings from "./pages/Bookings";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminMovies from "./pages/admin/AdminMovies";

import AdminShows from "./pages/admin/AdminShows";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSpotlights from "./pages/admin/AdminSpotlights";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";

import FoodSelection from "./pages/FoodSelection";
import AdminFoodItems from "./pages/admin/AdminFoodItems";
import KitchenDashboard from "./pages/KitchenDashboard";

import AdminPlays from "./pages/admin/AdminPlays";
import AdminSports from "./pages/admin/AdminSports";
import AdminVenues from "./pages/admin/AdminVenues";
import AdminSeatLayouts from "./pages/admin/AdminSeatLayouts";
import AdminEventShows from "./pages/admin/AdminEventShows";
import AdminSportsShows from "./pages/admin/AdminSportsShows";
import AdminPlayShows from "./pages/admin/AdminPlayShows";
import AdminPromoCodes from "./pages/admin/AdminPromoCodes";
import AdminKitchenOrders from "./pages/admin/AdminKitchenOrders";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import AdminComingSoon from "./pages/admin/AdminComingSoon";
import Support from "./pages/Support";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CityProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/search" element={<Search />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/movies/:id" element={<MovieDetail />} />
              <Route path="/movies/:id/book" element={<SeatSelection />} />
              <Route path="/movies/:id/food" element={<FoodSelection />} />
              <Route path="/movies/:id/checkout" element={<Checkout />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/events/:id/book" element={<EventBooking />} />

              <Route path="/plays" element={<Plays />} />
              <Route path="/sports" element={<Sports />} />
              <Route path="/venues" element={<Venues />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/kitchen" element={<KitchenDashboard />} />

              {/* Support Routes */}
              <Route path="/help" element={<Support />} />
              <Route path="/faq" element={<Support />} />
              <Route path="/terms" element={<Support />} />
              <Route path="/privacy" element={<Support />} />

              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="movies" element={<AdminMovies />} />

                <Route path="shows" element={<AdminShows />} />
                <Route path="events" element={<AdminEvents />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="spotlights" element={<AdminSpotlights />} />
                <Route path="food" element={<AdminFoodItems />} />

                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="sports" element={<AdminSports />} />
                <Route path="plays" element={<AdminPlays />} />
                <Route path="venues" element={<AdminVenues />} />
                <Route path="seat-layouts" element={<AdminSeatLayouts />} />
                <Route path="event-shows" element={<AdminEventShows />} />
                <Route path="sports-shows" element={<AdminSportsShows />} />
                <Route path="play-shows" element={<AdminPlayShows />} />
                <Route path="promocodes" element={<AdminPromoCodes />} />
                <Route path="kitchen-orders" element={<AdminKitchenOrders />} />
                <Route path="announcements" element={<AdminAnnouncements />} />
                <Route path="coming-soon" element={<AdminComingSoon />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CityProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
