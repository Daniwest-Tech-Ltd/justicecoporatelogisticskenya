-- Create vehicles table for rental catalogue
CREATE TABLE public.vehicles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price_per_day NUMERIC NOT NULL,
    image_url TEXT,
    description TEXT,
    features TEXT[],
    seats INTEGER DEFAULT 5,
    fuel_type TEXT DEFAULT 'Petrol',
    transmission TEXT DEFAULT 'Automatic',
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'booked', 'maintenance')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on vehicles
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Vehicles are viewable by everyone
CREATE POLICY "Vehicles are viewable by everyone"
ON public.vehicles
FOR SELECT
USING (true);

-- Only admins can insert vehicles
CREATE POLICY "Admins can insert vehicles"
ON public.vehicles
FOR INSERT
WITH CHECK (is_admin());

-- Only admins can update vehicles
CREATE POLICY "Admins can update vehicles"
ON public.vehicles
FOR UPDATE
USING (is_admin());

-- Only admins can delete vehicles
CREATE POLICY "Admins can delete vehicles"
ON public.vehicles
FOR DELETE
USING (is_admin());

-- Create contact_messages table
CREATE TABLE public.contact_messages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on contact_messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can insert messages (public contact form)
CREATE POLICY "Anyone can insert contact messages"
ON public.contact_messages
FOR INSERT
WITH CHECK (true);

-- Only admins can view messages
CREATE POLICY "Admins can view contact messages"
ON public.contact_messages
FOR SELECT
USING (is_admin());

-- Only admins can update messages (mark as read)
CREATE POLICY "Admins can update contact messages"
ON public.contact_messages
FOR UPDATE
USING (is_admin());

-- Only admins can delete messages
CREATE POLICY "Admins can delete contact messages"
ON public.contact_messages
FOR DELETE
USING (is_admin());

-- Create storage bucket for vehicle images
INSERT INTO storage.buckets (id, name, public) VALUES ('vehicle-images', 'vehicle-images', true);

-- Storage policies for vehicle images
CREATE POLICY "Vehicle images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'vehicle-images');

CREATE POLICY "Admins can upload vehicle images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'vehicle-images' AND is_admin());

CREATE POLICY "Admins can update vehicle images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'vehicle-images' AND is_admin());

CREATE POLICY "Admins can delete vehicle images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'vehicle-images' AND is_admin());

-- Add trigger for updated_at on vehicles
CREATE TRIGGER update_vehicles_updated_at
BEFORE UPDATE ON public.vehicles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert admin role for the specified user
INSERT INTO public.user_roles (user_id, role) VALUES ('c95dac83-c0a0-4b5d-8e46-57353ecfaed3', 'admin');