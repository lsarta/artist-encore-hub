-- Create new fresh bucket for pictures
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pictures-new', 'pictures-new', true);

-- Create comprehensive public policies for the new bucket
CREATE POLICY "Anyone can view pictures-new"
ON storage.objects FOR SELECT
USING (bucket_id = 'pictures-new');

CREATE POLICY "Anyone can insert pictures-new"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'pictures-new');

CREATE POLICY "Anyone can update pictures-new"
ON storage.objects FOR UPDATE
USING (bucket_id = 'pictures-new');

CREATE POLICY "Anyone can delete pictures-new"
ON storage.objects FOR DELETE
USING (bucket_id = 'pictures-new');