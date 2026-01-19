-- EMERGENCY ADMIN FIX SCRIPT
-- Run this in the Supabase SQL Editor to force-fix everything.

-- 1. MAKE ALL EXISTING USERS ADMINS
-- This ensures that whichever account you are logged in with IS an admin.
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
ON CONFLICT (user_id, role) DO NOTHING;

-- 2. VERIFY USER_ROLES PERMISSIONS
-- Ensure you can actually READ that you are an admin
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow users to read own role" ON public.user_roles;
CREATE POLICY "Allow users to read own role"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 3. FIX FOOD ITEMS PERMISSIONS (Force Re-apply)
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable insert for admins" ON public.food_items;
DROP POLICY IF EXISTS "Enable update for admins" ON public.food_items;
DROP POLICY IF EXISTS "Enable delete for admins" ON public.food_items;
DROP POLICY IF EXISTS "Allow public read access" ON public.food_items;

-- Re-create properly
CREATE POLICY "Allow public read access"
ON public.food_items FOR SELECT
USING (true);

CREATE POLICY "Enable insert for admins"
ON public.food_items FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Enable update for admins"
ON public.food_items FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Enable delete for admins"
ON public.food_items FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
