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
    
    try {
      console.log('=== PHOTO UPLOAD START ===');
      console.log('File details:', {
        name: file.name,
        size: file.size,
        type: file.type,
        tourId,
        caption,
        authorName,
        instagramHandle
      });

      // Create file path
      const fileExt = file.name.split('.').pop() || 'jpg';
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const sanitizedTourId = tourId.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      const fileName = `${sanitizedTourId}/${timestamp}-${randomStr}.${fileExt}`;
      
      console.log('Upload path:', fileName);

      // Test bucket access first
      console.log('Testing bucket access...');
      const { data: bucketTest, error: bucketError } = await supabase.storage
        .from('pictures-new')
        .list('', { limit: 1 });

      if (bucketError) {
        console.error('Bucket access error:', bucketError);
        throw new Error(`Bucket access failed: ${bucketError.message}`);
      }
      console.log('Bucket accessible:', bucketTest);

      // Upload file
      console.log('Starting file upload...');
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('pictures-new')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw new Error(`File upload failed: ${uploadError.message}`);
      }

      console.log('Upload successful:', uploadData);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('pictures-new')
        .getPublicUrl(fileName);

      console.log('Public URL:', urlData.publicUrl);

      // Test if we can access the uploaded file
      try {
        const testResponse = await fetch(urlData.publicUrl, { method: 'HEAD' });
        console.log('File accessibility test:', testResponse.status);
      } catch (testError) {
        console.warn('File test failed but continuing:', testError);
      }

      // Insert database record
      const dbData = {
        tour_id: tourId,
        file_path: fileName,
        file_url: urlData.publicUrl,
        caption: caption || null,
        author_name: authorName || null,
        instagram_handle: instagramHandle || null
      };

      console.log('Inserting database record:', dbData);

      const { data: insertData, error: insertError } = await supabase
        .from('photo_submissions')
        .insert(dbData)
        .select()
        .single();

      if (insertError) {
        console.error('Database insert error:', insertError);
        throw new Error(`Database save failed: ${insertError.message}`);
      }

      console.log('Database insert successful:', insertData);
      console.log('=== UPLOAD COMPLETE ===');

      toast({
        title: "Photo uploaded successfully!",
        description: "Your photo has been submitted and is pending review.",
      });

      return insertData;

    } catch (error: any) {
      console.error('=== UPLOAD FAILED ===');
      console.error('Error details:', error);
      
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload photo. Please try again.",
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