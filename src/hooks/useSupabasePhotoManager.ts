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
      // Create unique file path with simpler naming
      const fileExt = file.name.split('.').pop() || 'jpg';
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 8);
      const fileName = `${tourId}/${timestamp}_${randomId}.${fileExt}`;
      
      console.log('Uploading file to path:', fileName);
      
      // Upload to Supabase storage with explicit options
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('pictures')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          duplex: 'half'
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log('File uploaded successfully:', uploadData);

      // Get public URL using the correct method
      const { data: urlData } = supabase.storage
        .from('pictures')
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;
      console.log('Public URL generated:', publicUrl);

      // Verify the URL is accessible
      try {
        const response = await fetch(publicUrl, { method: 'HEAD' });
        console.log('URL accessibility check:', response.status);
      } catch (urlError) {
        console.warn('URL accessibility check failed:', urlError);
      }

      // Insert photo submission record
      const insertData = {
        tour_id: tourId,
        file_path: fileName,
        file_url: publicUrl,
        caption: caption || null,
        author_name: authorName || null,
        instagram_handle: instagramHandle || null,
      };

      console.log('Inserting photo submission:', insertData);

      const { data, error } = await supabase
        .from('photo_submissions')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Database insert error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      console.log('Photo submission created:', data);

      toast({
        title: "Photo uploaded successfully!",
        description: "Your photo is now pending review.",
      });

      return data;
    } catch (error: any) {
      console.error('Error uploading photo:', error);
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
      const { data, error } = await supabase
        .from('photo_submissions')
        .select('*')
        .eq('tour_id', tourId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
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