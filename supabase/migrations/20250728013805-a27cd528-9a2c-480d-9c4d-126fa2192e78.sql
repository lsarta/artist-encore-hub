-- Fix RLS policies to allow public photo uploads
DROP POLICY IF EXISTS "Anyone can submit photos" ON public.photo_submissions;
DROP POLICY IF EXISTS "Public can view pictures" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload pictures" ON storage.objects;

-- Create more permissive policies for photo submissions
CREATE POLICY "Public can insert photo submissions" 
ON public.photo_submissions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can view approved photo submissions" 
ON public.photo_submissions 
FOR SELECT 
USING (status = 'approved');

-- Create permissive storage policies
CREATE POLICY "Public access to pictures bucket" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'pictures');

CREATE POLICY "Public can upload to pictures bucket" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'pictures');

CREATE POLICY "Public can update pictures in bucket" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'pictures');

-- Ensure the pictures bucket exists and is public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pictures', 'pictures', true)
ON CONFLICT (id) DO UPDATE SET public = true;