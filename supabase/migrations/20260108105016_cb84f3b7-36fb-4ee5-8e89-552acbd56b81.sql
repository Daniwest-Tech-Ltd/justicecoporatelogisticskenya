
-- Create lookup tables for vehicle attributes

-- Brands table
CREATE TABLE public.brands (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Vehicle types table
CREATE TABLE public.vehicle_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Fuel types table
CREATE TABLE public.fuel_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Transmissions table
CREATE TABLE public.transmissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Colors table
CREATE TABLE public.colors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Body types table
CREATE TABLE public.body_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Drive types table
CREATE TABLE public.drive_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Rental types table
CREATE TABLE public.rental_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Conditions table
CREATE TABLE public.conditions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Vehicle images table (up to 8 images per vehicle)
CREATE TABLE public.vehicle_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add new columns to vehicles table
ALTER TABLE public.vehicles 
ADD COLUMN brand_id UUID REFERENCES public.brands(id),
ADD COLUMN model TEXT,
ADD COLUMN vehicle_type_id UUID REFERENCES public.vehicle_types(id),
ADD COLUMN fuel_type_id UUID REFERENCES public.fuel_types(id),
ADD COLUMN transmission_id UUID REFERENCES public.transmissions(id),
ADD COLUMN color_id UUID REFERENCES public.colors(id),
ADD COLUMN body_type_id UUID REFERENCES public.body_types(id),
ADD COLUMN drive_type_id UUID REFERENCES public.drive_types(id),
ADD COLUMN rental_type_id UUID REFERENCES public.rental_types(id),
ADD COLUMN condition_id UUID REFERENCES public.conditions(id),
ADD COLUMN engine_cc INTEGER,
ADD COLUMN year INTEGER,
ADD COLUMN price_per_week NUMERIC,
ADD COLUMN price_per_month NUMERIC,
ADD COLUMN driver_fee NUMERIC DEFAULT 0;

-- Enable RLS on all new tables
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fuel_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transmissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drive_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_images ENABLE ROW LEVEL SECURITY;

-- RLS policies for lookup tables (everyone can read, admins can manage)
CREATE POLICY "Anyone can view brands" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Admins can manage brands" ON public.brands FOR ALL USING (is_admin());

CREATE POLICY "Anyone can view vehicle_types" ON public.vehicle_types FOR SELECT USING (true);
CREATE POLICY "Admins can manage vehicle_types" ON public.vehicle_types FOR ALL USING (is_admin());

CREATE POLICY "Anyone can view fuel_types" ON public.fuel_types FOR SELECT USING (true);
CREATE POLICY "Admins can manage fuel_types" ON public.fuel_types FOR ALL USING (is_admin());

CREATE POLICY "Anyone can view transmissions" ON public.transmissions FOR SELECT USING (true);
CREATE POLICY "Admins can manage transmissions" ON public.transmissions FOR ALL USING (is_admin());

CREATE POLICY "Anyone can view colors" ON public.colors FOR SELECT USING (true);
CREATE POLICY "Admins can manage colors" ON public.colors FOR ALL USING (is_admin());

CREATE POLICY "Anyone can view body_types" ON public.body_types FOR SELECT USING (true);
CREATE POLICY "Admins can manage body_types" ON public.body_types FOR ALL USING (is_admin());

CREATE POLICY "Anyone can view drive_types" ON public.drive_types FOR SELECT USING (true);
CREATE POLICY "Admins can manage drive_types" ON public.drive_types FOR ALL USING (is_admin());

CREATE POLICY "Anyone can view rental_types" ON public.rental_types FOR SELECT USING (true);
CREATE POLICY "Admins can manage rental_types" ON public.rental_types FOR ALL USING (is_admin());

CREATE POLICY "Anyone can view conditions" ON public.conditions FOR SELECT USING (true);
CREATE POLICY "Admins can manage conditions" ON public.conditions FOR ALL USING (is_admin());

CREATE POLICY "Anyone can view vehicle_images" ON public.vehicle_images FOR SELECT USING (true);
CREATE POLICY "Admins can manage vehicle_images" ON public.vehicle_images FOR ALL USING (is_admin());

-- Insert default data for all lookup tables

-- Brands
INSERT INTO public.brands (name) VALUES
('Audi'), ('BMW'), ('Chevrolet'), ('Ford'), ('Honda'), ('Hyundai'), ('Isuzu'), ('Jaguar'),
('Jeep'), ('Kia'), ('Land Rover'), ('Lexus'), ('Mazda'), ('Mercedes-Benz'), ('Mitsubishi'),
('Nissan'), ('Peugeot'), ('Porsche'), ('Subaru'), ('Suzuki'), ('Tesla'), ('Toyota'), ('Volkswagen'), ('Volvo');

-- Vehicle types
INSERT INTO public.vehicle_types (name) VALUES
('Sedan'), ('SUV'), ('Crossover'), ('Pickup'), ('Van'), ('Minibus'), ('Bus'), ('Luxury'), ('Executive'), ('Commercial');

-- Fuel types
INSERT INTO public.fuel_types (name) VALUES
('Petrol'), ('Diesel'), ('Hybrid'), ('Electric'), ('Plug-in Hybrid');

-- Transmissions
INSERT INTO public.transmissions (name) VALUES
('Automatic'), ('Manual'), ('CVT'), ('Semi-Automatic');

-- Colors
INSERT INTO public.colors (name) VALUES
('White'), ('Black'), ('Silver'), ('Grey'), ('Metallic Grey'), ('Blue'), ('Navy Blue'), ('Red'),
('Maroon'), ('Green'), ('Dark Green'), ('Brown'), ('Beige'), ('Champagne'), ('Gold'), ('Yellow'), ('Orange'), ('Purple');

-- Body types
INSERT INTO public.body_types (name) VALUES
('Hatchback'), ('Saloon'), ('Wagon'), ('Coupe'), ('Convertible'), ('Double Cabin'), ('Single Cabin');

-- Drive types
INSERT INTO public.drive_types (name) VALUES
('2WD'), ('4WD'), ('AWD');

-- Rental types
INSERT INTO public.rental_types (name) VALUES
('Self Drive'), ('Chauffeur Driven'), ('Corporate Rental'), ('Event Rental'), ('Long Term Rental'), ('Short Term Rental');

-- Conditions
INSERT INTO public.conditions (name) VALUES
('Brand New'), ('Foreign Used'), ('Locally Used'), ('Reconditioned');
