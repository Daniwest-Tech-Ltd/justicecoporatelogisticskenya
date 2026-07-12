-- Create owners table
CREATE TABLE IF NOT EXISTS public.owners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id_jck TEXT UNIQUE NOT NULL, -- Format: OWN-001/JCK
  owner_name TEXT NOT NULL,
  phone_number TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update vehicles table with fleet and owner details
ALTER TABLE public.vehicles
ADD COLUMN IF NOT EXISTS fleet_number TEXT UNIQUE, -- Format: [CAR-NAME]-FL[XXX]/JCK
ADD COLUMN IF NOT EXISTS vehicle_registration TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES public.owners(id) ON DELETE SET NULL;

-- Create drivers table
CREATE TABLE IF NOT EXISTS public.drivers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_id_jck TEXT UNIQUE NOT NULL, -- Format: [NAME]-DR[XX]/JCK
  driver_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'assigned', 'off-duty')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create assignments (rentals) table for mission tracking
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES public.vehicles(id) NOT NULL,
  driver_id UUID REFERENCES public.drivers(id) NOT NULL,
  work_type TEXT NOT NULL,
  work_description TEXT,
  location TEXT NOT NULL,
  amount_to_be_paid NUMERIC NOT NULL DEFAULT 0,
  duration_time TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admins can manage owners" ON public.owners FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage drivers" ON public.drivers FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage assignments" ON public.assignments FOR ALL USING (is_admin());

-- Trigger to update vehicle status on assignment
CREATE OR REPLACE FUNCTION public.update_vehicle_driver_status_on_assignment()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE vehicles SET status = 'rented' WHERE id = NEW.vehicle_id;
    UPDATE drivers SET status = 'assigned' WHERE id = NEW.driver_id;
  ELSIF (NEW.status = 'completed' OR NEW.status = 'cancelled') THEN
    UPDATE vehicles SET status = 'available' WHERE id = NEW.vehicle_id;
    UPDATE drivers SET status = 'available' WHERE id = NEW.driver_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_assignment_status_change
  AFTER INSERT OR UPDATE ON assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_vehicle_driver_status_on_assignment();
