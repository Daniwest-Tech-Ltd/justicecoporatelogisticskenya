-- Update driver_applications table with advanced fields
ALTER TABLE public.driver_applications
ADD COLUMN IF NOT EXISTS id_card_url TEXT,
ADD COLUMN IF NOT EXISTS dl_copy_url TEXT,
ADD COLUMN IF NOT EXISTS preferred_contact TEXT CHECK (preferred_contact IN ('email', 'whatsapp', 'call', 'sms')),
ADD COLUMN IF NOT EXISTS dl_classes TEXT[], -- Array of selected classes
ADD COLUMN IF NOT EXISTS date_of_birth DATE;

-- Create a storage bucket for driver documents if it doesn't exist
-- Note: This usually needs to be done via the Supabase UI or a specific API call,
-- but I'll add the policy here assuming the bucket 'driver-docs' is created.
CREATE POLICY "Public can upload driver docs" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'driver-docs');
CREATE POLICY "Admins can view driver docs" ON storage.objects FOR SELECT USING (bucket_id = 'driver-docs' AND is_admin());
