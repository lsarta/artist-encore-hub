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
      // Create unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${tourId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('pictures')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('pictures')
        .getPublicUrl(fileName);

      // Insert photo submission record
      const { data, error } = await supabase
        .from('photo_submissions')
        .insert({
          tour_id: tourId,
          file_path: fileName,
          file_url: publicUrl,
          caption,
          author_name: authorName,
          instagram_handle: instagramHandle,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Photo uploaded successfully!",
        description: "Your photo is now pending review.",
      });

      return data;
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your photo. Please try again.",
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