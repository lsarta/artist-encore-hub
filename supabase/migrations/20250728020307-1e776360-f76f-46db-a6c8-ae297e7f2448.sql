-- Clean up storage policies and create simpler ones
DROP POLICY IF EXISTS "Anyone can view pictures-new" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can insert pictures-new" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update pictures-new" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete pictures-new" ON storage.objects;

-- Create simplified public policies for pictures-new bucket
CREATE POLICY "Public access to pictures-new"
ON storage.objects FOR ALL
USING (bucket_id = 'pictures-new')
WITH CHECK (bucket_id = 'pictures-new');

-- Ensure bucket is configured correctly
UPDATE storage.buckets 
SET public = true, 
    file_size_limit = 52428800, -- 50MB limit
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
WHERE id = 'pictures-new';