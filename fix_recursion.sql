-- FIX INFINITE RECURSION IN USER_ROLES
-- The error "infinite recursion detected" happens because the policy on user_roles checks user_roles itself.
-- Policy: "user_roles" -> checks -> "user_roles" -> checks -> "user_roles"... forever.

-- 1. Disable RLS momentarily to clean up
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- 2. Drop the problematic recursive policies
DROP POLICY IF EXISTS "Enable full access for admins" ON public.user_roles;
DROP POLICY IF EXISTS "Allow users to read own role" ON public.user_roles;
DROP POLICY IF EXISTS "Allow public read access" ON public.user_roles;

-- 3. Create NON-RECURSIVE policies

-- A. Allow users to read their OWN role.
-- This does NOT look at other rows, so it's safe.
CREATE POLICY "Allow users to read own role"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- B. Allow Admins to View/Edit ALL roles.
-- To avoid recursion, we must NOT use a subquery on the same table inside the policy for that table.
-- SOLUTION: Use a JWT claim or a separate function marked as SECURITY DEFINER.
-- OR simple hack: For now, rely on individual "read own" for the admin check in other tables.
-- BUT to manage users, the Admin needs to see all. 

-- BETTER APPROACH: Use a "Security Definer" function to check admin status.
-- This function bypasses RLS, avoiding the recursion loop.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Now use this function in the policy.
-- The function runs with owner privileges (bypassing the table's RLS), so it doesn't trigger the recursion.

CREATE POLICY "Enable full access for admins"
ON public.user_roles FOR ALL
TO authenticated
USING ( public.is_admin() )
WITH CHECK ( public.is_admin() );

-- 4. Re-enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
