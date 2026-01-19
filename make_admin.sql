-- Make satwiksai36@gmail.com a Super Admin

DO $$
DECLARE
  target_user_id uuid;
BEGIN
  -- 1. Find the user by email in the auth.users table
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = 'satwiksai36@gmail.com';

  -- 2. Check if the user exists
  IF target_user_id IS NOT NULL THEN
    -- 3. Assign the 'admin' role to this user
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING; -- Do nothing if they are already an admin
    
    RAISE NOTICE 'SUCCESS: User satwiksai36@gmail.com is now an Admin.';
  ELSE
    RAISE NOTICE 'ERROR: User satwiksai36@gmail.com NOT FOUND. Please ensure the user has signed up first.';
  END IF;
END $$;
