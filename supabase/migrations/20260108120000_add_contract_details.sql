-- Add contract_details JSONB column to rental_orders
ALTER TABLE public.rental_orders ADD COLUMN IF NOT EXISTS contract_details JSONB DEFAULT '{}'::jsonb;
