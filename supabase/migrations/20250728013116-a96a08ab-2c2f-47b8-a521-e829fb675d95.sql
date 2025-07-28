-- Create photo_submissions table
CREATE TABLE public.photo_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_id TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  caption TEXT,
  author_name TEXT,
  instagram_handle TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  featured BOOLEAN NOT NULL DEFAULT false,
  quality_score INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.photo_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for photo submissions
CREATE POLICY "Anyone can view approved photos" 
ON public.photo_submissions 
FOR SELECT 
USING (status = 'approved');

CREATE POLICY "Anyone can submit photos" 
ON public.photo_submissions 
FOR INSERT 
WITH CHECK (true);

-- Create storage policies for pictures bucket
CREATE POLICY "Public can view pictures" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'pictures');

CREATE POLICY "Anyone can upload pictures" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'pictures');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_photo_submissions_updated_at
BEFORE UPDATE ON public.photo_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();