-- Add ends_at column to assignments for countdown tracking
ALTER TABLE public.assignments
ADD COLUMN IF NOT EXISTS ends_at TIMESTAMP WITH TIME ZONE;

-- Add document fields to drivers table for direct entry support
ALTER TABLE public.drivers
ADD COLUMN IF NOT EXISTS id_card_url TEXT,
ADD COLUMN IF NOT EXISTS dl_copy_url TEXT;
