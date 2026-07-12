-- Create driver_applications table
CREATE TABLE IF NOT EXISTS public.driver_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  license_number TEXT NOT NULL,
  years_experience INTEGER NOT NULL,
  location TEXT NOT NULL,
  bio TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.driver_applications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can submit applications" ON public.driver_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view applications" ON public.driver_applications FOR ALL USING (is_admin());
