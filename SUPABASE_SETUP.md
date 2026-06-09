# Supabase Migration Guide

This guide details the steps to migrate your "Lovable Cloud" project to a real Supabase backend.

## Prerequisites

1.  **Supabase Project**: You should have a Supabase project created.
2.  **Environment Variables**: Your `.env` file is already configured with:
    - `VITE_SUPABASE_URL`
    - `VITE_SUPABASE_PUBLISHABLE_KEY`

## Step 1: Database Setup

We have prepared a complete SQL setup script that initializes your database schema (tables, security policies) and seeds the initial District data.

1.  Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Go to the **SQL Editor** (icon with `>_` on the left sidebar).
3.  Click **New Query**.
4.  Copy the entire content of the file `supabase_setup.sql` from your project root.
5.  Paste it into the query editor and click **Run**.

**What this does:**
*   Creates tables: `districts`, `movies`, `events`, `shows`, `theatres`, `bookings`, `profiles`, `user_roles`.
*   Enables Row Level Security (RLS) to protect your data.
*   Sets up access policies (e.g., Public can view movies, verify users can only see their own bookings).
*   **Seeds the database** with your requested districts: Amaravathi, Visakhapatnam, Vijayawada, Tirupati, Rajahmundry, Kakinada.

## Step 2: Application Code (Already Done)

I have automatically updated your application code to use Supabase:

*   **`src/contexts/DistrictContext.tsx`**: Now fetches the list of districts dynamically from your Supabase database instead of using a hardcoded list.
*   **`src/components/layout/Header.tsx`**: Updated to display the dynamic list of districts.

## Step 3: Verify

1.  Restart your development server: `npm run dev`.
2.  Open the application.
3.  Check the "Select District" dropdown in the header. It should now show the districts fetched from your database.

## Step 4: Adding More Data

For content like **Movies** and **Events**, you can now use the **Admin Dashboard** in your app (or the Supabase Table Editor) to add real data. The tables are ready to accept them.
