-- Fix authentication signup issue by allowing users to set their own initial role
-- This adds a policy for authenticated users to insert their own role during signup

-- Add policy to allow users to insert their own role during signup
CREATE POLICY "Users can set own role on signup" ON public.user_roles
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Also create a secure function for role assignment that can be called during signup
CREATE OR REPLACE FUNCTION public.assign_user_role(_user_id UUID, _role app_role)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow assignment if:
  -- 1. The user is assigning their own role AND doesn't have one yet
  -- 2. OR the caller is an admin
  IF (_user_id = auth.uid() AND NOT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id
  )) OR public.has_role(auth.uid(), 'admin') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (_user_id, _role)
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    RAISE EXCEPTION 'Unauthorized to assign role';
  END IF;
END;
$$;

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION public.assign_user_role(UUID, app_role) TO authenticated;
