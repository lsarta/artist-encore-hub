-- Remove all existing storage policies and recreate them properly
DROP POLICY IF EXISTS "Public access to pictures bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload to pictures bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public can update pictures in bucket" ON storage.objects;

-- Create comprehensive public policies for storage objects
CREATE POLICY "Anyone can view pictures"
ON storage.objects FOR SELECT
USING (bucket_id = 'pictures');

CREATE POLICY "Anyone can insert pictures"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'pictures');

CREATE POLICY "Anyone can update pictures"
ON storage.objects FOR UPDATE
USING (bucket_id = 'pictures');

CREATE POLICY "Anyone can delete pictures"
ON storage.objects FOR DELETE
USING (bucket_id = 'pictures');

-- Ensure the bucket is properly configured
UPDATE storage.buckets 
SET public = true, 
    file_size_limit = NULL, 
    allowed_mime_types = NULL 
WHERE id = 'pictures';