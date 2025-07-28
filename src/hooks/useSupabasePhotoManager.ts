import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PhotoSubmission {
  id: string;
  tour_id: string;
  file_path: string;
  file_url: string;
  caption?: string;
  author_name?: string;
  instagram_handle?: string;
  status: 'pending' | 'approved' | 'rejected';
  featured: boolean;
  quality_score: number;
  likes: number;
  created_at: string;
  updated_at: string;
}

export const useSupabasePhotoManager = () => {
  const [photos, setPhotos] = useState<PhotoSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const uploadPhoto = useCallback(async (
    file: File,
    tourId: string,
    caption?: string,
    authorName?: string,
    instagramHandle?: string
  ) => {
    setLoading(true);
    
    // Add detailed logging
    console.log('=== STARTING PHOTO UPLOAD ===');
    console.log('File:', file.name, 'Size:', file.size, 'Type:', file.type);
    console.log('Tour ID:', tourId);
    console.log('Caption:', caption);
    console.log('Author:', authorName);
    console.log('Instagram:', instagramHandle);
    
    try {
      // Create unique file path with better naming
      const fileExt = file.name.split('.').pop() || 'jpg';
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 8);
      const fileName = `${tourId.replace(/\s+/g, '-').toLowerCase()}/${timestamp}_${randomId}.${fileExt}`;
      
      console.log('Generated file path:', fileName);
      
      // Upload to NEW bucket
      console.log('Uploading to pictures-new bucket...');
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('pictures-new')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('=== UPLOAD ERROR ===', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log('Upload successful:', uploadData);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('pictures-new')
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;
      console.log('Generated public URL:', publicUrl);

      // Insert into database
      const insertData = {
        tour_id: tourId,
        file_path: fileName,
        file_url: publicUrl,
        caption: caption || null,
        author_name: authorName || null,
        instagram_handle: instagramHandle || null,
      };

      console.log('Inserting into database:', insertData);

      const { data: dbData, error: dbError } = await supabase
        .from('photo_submissions')
        .insert(insertData)
        .select()
        .single();

      if (dbError) {
        console.error('=== DATABASE ERROR ===', dbError);
        throw new Error(`Database error: ${dbError.message}`);
      }

      console.log('Database insert successful:', dbData);
      console.log('=== UPLOAD COMPLETE ===');

      toast({
        title: "Photo uploaded successfully!",
        description: "Your photo is now pending review.",
      });

      return dbData;
    } catch (error: any) {
      console.error('=== FINAL ERROR ===', error);
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your photo. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getPhotosByTour = useCallback(async (tourId: string) => {
    try {
      console.log('Fetching photos for tour:', tourId);
      const { data, error } = await supabase
        .from('photo_submissions')
        .select('*')
        .eq('tour_id', tourId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log('Found photos:', data?.length || 0);
      setPhotos(data as PhotoSubmission[] || []);
      return data as PhotoSubmission[] || [];
    } catch (error) {
      console.error('Error fetching photos:', error);
      return [];
    }
  }, []);

  const getAllPhotos = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('photo_submissions')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setPhotos(data as PhotoSubmission[] || []);
      return data as PhotoSubmission[] || [];
    } catch (error) {
      console.error('Error fetching all photos:', error);
      return [];
    }
  }, []);

  const getFeaturedPhoto = useCallback(async (tourId: string) => {
    try {
      const { data, error } = await supabase
        .from('photo_submissions')
        .select('*')
        .eq('tour_id', tourId)
        .eq('status', 'approved')
        .eq('featured', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching featured photo:', error);
      return null;
    }
  }, []);

  return {
    photos,
    loading,
    uploadPhoto,
    getPhotosByTour,
    getAllPhotos,
    getFeaturedPhoto,
  };
};