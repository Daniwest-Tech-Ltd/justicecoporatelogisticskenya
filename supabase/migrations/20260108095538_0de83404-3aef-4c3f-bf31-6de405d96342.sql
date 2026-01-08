-- Add is_featured column to vehicles table
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

-- Create rental_orders table
CREATE TABLE IF NOT EXISTS public.rental_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  preferred_contact TEXT NOT NULL CHECK (preferred_contact IN ('email', 'sms', 'whatsapp')),
  pickup_date DATE NOT NULL,
  return_date DATE NOT NULL,
  pickup_location TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed', 'cancelled')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on rental_orders
ALTER TABLE public.rental_orders ENABLE ROW LEVEL SECURITY;

-- Create policies for rental_orders
CREATE POLICY "Anyone can create rental orders"
ON public.rental_orders
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view all rental orders"
ON public.rental_orders
FOR SELECT
USING (is_admin());

CREATE POLICY "Admins can update rental orders"
ON public.rental_orders
FOR UPDATE
USING (is_admin());

CREATE POLICY "Admins can delete rental orders"
ON public.rental_orders
FOR DELETE
USING (is_admin());

-- Create trigger for updated_at
CREATE TRIGGER update_rental_orders_updated_at
BEFORE UPDATE ON public.rental_orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();