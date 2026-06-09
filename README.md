# 🎟️ GrabAticket

A full-stack ticket booking platform for movies, events, plays, and sports — built for district-level cities with a powerful admin dashboard and real-time backend.

> **GrabAticket** lets users discover and book tickets for movies, events, plays, and sports in their city. It features interactive seat selection, food ordering, QR-code tickets, promo codes, and a complete admin panel — all powered by a Supabase backend with Row Level Security.

![GrabAticket Banner](https://img.shields.io/badge/GrabAticket-Ticket%20Booking%20Platform-6C63FF?style=for-the-badge&logo=ticketmaster&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat-square&logo=supabase)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=flat-square&logo=tailwind-css)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Available Scripts](#-available-scripts)
- [Application Routes](#-application-routes)
- [Admin Panel](#-admin-panel)
- [Contributing](#-contributing)

---

## 🌟 Overview

**GrabAticket** is a comprehensive ticket booking web application targeting district-level audiences. Users can browse and book tickets for movies, live events, theatrical plays, and sports matches — all in one place. The platform includes a food/snack ordering flow, QR-code-based ticket generation, seat selection, promo code support, and a full-featured admin dashboard for content and user management.

---

## ✨ Features

### 👤 User-Facing
- 🎬 **Movies** — Browse now-playing and upcoming movies, view details, select seats, add food, and checkout
- 🎪 **Events** — Discover and book district-level events with detailed booking flow
- 🎭 **Plays** — Browse and book theatrical performances
- 🏟️ **Sports** — View and book sports matches
- 🪑 **Seat Selection** — Interactive seat map with real-time availability
- 🍿 **Food Ordering** — Add snacks and combos before checkout
- 🎫 **QR Ticket** — Downloadable PDF/QR-code tickets after booking
- 🔖 **Promo Codes** — Apply discount codes at checkout
- 👤 **User Profile & Settings** — Manage personal info and preferences
- 📋 **My Bookings** — View all past and upcoming bookings
- 🔍 **Search** — Cross-category search across movies, events, plays, and sports
- 🏛️ **Venues** — Browse venues by city/district

### 🛠️ Admin Dashboard (`/admin`)
- 📊 **Dashboard** — Overview stats and metrics
- 📈 **Analytics** — Booking trends and revenue charts
- 🎬 **Movies Management** — Add/edit/delete movies and shows
- 🎪 **Events Management** — Manage events and event shows
- 🎭 **Plays Management** — Manage plays and play shows
- 🏟️ **Sports Management** — Manage sports fixtures and shows
- 🪑 **Seat Layouts** — Design and manage seat configurations
- 🍽️ **Food Items** — Manage food menu available at venues
- 🧾 **Bookings Management** — View and manage all bookings
- 👥 **Users Management** — View registered users and roles
- 🏛️ **Venues** — Manage venue listings
- 💸 **Promo Codes** — Create and manage discount codes
- 📢 **Announcements** — Post site-wide announcements
- 🔮 **Coming Soon** — Manage upcoming content previews
- 🌟 **Spotlights** — Manage featured/spotlight content
- ⚙️ **Settings** — Platform-wide configuration
- 🍳 **Kitchen Dashboard** — Real-time food order management for kitchen staff

---

## 🛠️ Tech Stack

| Category         | Technology                                   |
|------------------|----------------------------------------------|
| **Framework**    | [React 18](https://reactjs.org/)             |
| **Language**     | [TypeScript 5](https://www.typescriptlang.org/) |
| **Build Tool**   | [Vite 5](https://vitejs.dev/)                |
| **Styling**      | [Tailwind CSS 3](https://tailwindcss.com/)   |
| **UI Components**| [shadcn/ui](https://ui.shadcn.com/) + Radix UI |
| **Backend**      | [Supabase](https://supabase.com/) (PostgreSQL + Auth + RLS) |
| **State/Query**  | [TanStack Query v5](https://tanstack.com/query) |
| **Routing**      | [React Router v6](https://reactrouter.com/)  |
| **Forms**        | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| **Charts**       | [Recharts](https://recharts.org/)            |
| **PDF/QR**       | jsPDF + html2canvas + qrcode.react           |
| **Icons**        | [Lucide React](https://lucide.dev/)          |
| **Date Handling**| [date-fns](https://date-fns.org/)            |
| **Notifications**| [Sonner](https://sonner.emilkowal.ski/)      |

---

## 📁 Project Structure

```
GrabAticket/
├── public/                  # Static assets
├── src/
│   ├── components/
│   │   ├── admin/           # Admin-specific components
│   │   ├── common/          # Shared/reusable components
│   │   ├── home/            # Homepage components
│   │   ├── layout/          # Header, Footer, Layout wrappers
│   │   ├── seats/           # Seat selection components
│   │   └── ui/              # shadcn/ui base components
│   ├── contexts/            # React context providers (Auth, City)
│   ├── hooks/               # Custom React hooks
│   ├── integrations/
│   │   └── supabase/        # Supabase client & type definitions
│   ├── lib/                 # Utility libraries
│   ├── pages/
│   │   ├── admin/           # All admin dashboard pages
│   │   ├── Movies.tsx
│   │   ├── Events.tsx
│   │   ├── Plays.tsx
│   │   ├── Sports.tsx
│   │   ├── Bookings.tsx
│   │   ├── Checkout.tsx
│   │   ├── SeatSelection.tsx
│   │   ├── FoodSelection.tsx
│   │   └── ...
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Helper utilities
│   ├── App.tsx              # Root app with routing
│   └── main.tsx             # Entry point
├── supabase/
│   └── migrations/          # SQL migration files
├── .env.example             # Environment variable template
├── vite.config.ts
└── tailwind.config.ts
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)
- A [Supabase](https://supabase.com/) project (free tier works)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/GrabAticket.git
   cd GrabAticket
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Then fill in your Supabase credentials (see [Environment Variables](#-environment-variables)).

4. **Set up the database:**  
   See [Database Setup](#-database-setup) below.

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔐 Environment Variables

Copy `.env.example` to `.env` and provide your Supabase project details:

```env
VITE_SUPABASE_PROJECT_ID="your_project_id_here"
VITE_SUPABASE_PUBLISHABLE_KEY="your_publishable_anon_key_here"
VITE_SUPABASE_URL="https://your_project_id.supabase.co"
```

You can find these values in your **Supabase Dashboard → Project Settings → API**.

---

## 🗄️ Database Setup

1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Navigate to the **SQL Editor**.
3. Run the migration files found in `supabase/migrations/` in order.

The migrations will create and configure:
- Tables: `districts`, `movies`, `events`, `plays`, `sports`, `shows`, `theatres`, `venues`, `bookings`, `profiles`, `user_roles`, `food_items`, `promo_codes`, `announcements`, and more.
- **Row Level Security (RLS)** policies for data protection.
- Seed data for initial districts.

Refer to [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed step-by-step instructions.

---

## 📜 Available Scripts

```bash
npm run dev        # Start the development server (localhost:5173)
npm run build      # Build for production
npm run preview    # Preview the production build locally
npm run lint       # Run ESLint code checks
```

---

## 🗺️ Application Routes

| Route                       | Description                          |
|-----------------------------|--------------------------------------|
| `/`                         | Homepage / Landing page              |
| `/search`                   | Cross-category search                |
| `/login`                    | User login                           |
| `/signup`                   | User registration                    |
| `/movies`                   | Movies listing                       |
| `/movies/:id`               | Movie detail page                    |
| `/movies/:id/book`          | Seat selection for a movie           |
| `/movies/:id/food`          | Food/snack selection                 |
| `/movies/:id/checkout`      | Booking checkout                     |
| `/events`                   | Events listing                       |
| `/events/:id`               | Event detail page                    |
| `/events/:id/book`          | Event booking                        |
| `/plays`                    | Plays listing                        |
| `/sports`                   | Sports listing                       |
| `/venues`                   | Venues listing                       |
| `/bookings`                 | User's booking history               |
| `/profile`                  | User profile                         |
| `/settings`                 | User account settings                |
| `/kitchen`                  | Kitchen staff order dashboard        |
| `/help`, `/faq`             | Help & FAQ                           |
| `/terms`, `/privacy`        | Legal pages                          |
| `/admin`                    | Admin dashboard (protected)          |

---

## 🛡️ Admin Panel

The admin panel is accessible at `/admin` and requires an account with admin privileges. It provides full CRUD management for all platform content:

- **Content**: Movies, Events, Plays, Sports, Shows, Venues, Food Items
- **Commerce**: Bookings, Promo Codes, Analytics
- **Community**: Users, Announcements, Spotlights, Coming Soon
- **Operations**: Seat Layouts, Kitchen Orders, Settings

To promote a user to admin, update their role in the `user_roles` table via the Supabase dashboard.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is for educational and personal use. Feel free to fork and customize.

---

<p align="center">Made with ❤️ using React + Supabase</p>
