-- Update driver_applications table with availability fields
ALTER TABLE public.driver_applications
ADD COLUMN IF NOT EXISTS availability_hours_start TIME,
ADD COLUMN IF NOT EXISTS availability_hours_end TIME,
ADD COLUMN IF NOT EXISTS work_duration_hours INTEGER CHECK (work_duration_hours BETWEEN 1 AND 10),
ADD COLUMN IF NOT EXISTS shift_preference TEXT CHECK (shift_preference IN ('day', 'night', 'both'));
