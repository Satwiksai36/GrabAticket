-- Drop the policy if it exists (to avoid conflicts)
DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;

-- Add UPDATE policy for bookings table to allow users to cancel their own bookings
CREATE POLICY "Users can update own bookings" 
ON public.bookings 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
