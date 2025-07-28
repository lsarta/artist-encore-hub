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

      // Create a simple anonymous client for upload
      const { createClient } = await import('@supabase/supabase-js');
      const anonClient = createClient(
        "https://ajqnkddszqtfbjnyamuk.supabase.co", 
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqcW5rZGRzenF0ZmJqbnlhbXVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NjE4NTQsImV4cCI6MjA2OTIzNzg1NH0.XbvHSXJ5UYBuMGFx02tALA3pUhs_bEHSW2UPfJX79e0",
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false
          }
        }
      );

      // Upload file using anonymous client
      console.log('Starting file upload with anonymous client...');
      const { data: uploadData, error: uploadError } = await anonClient.storage
        .from('pictures-new')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw new Error(`File upload failed: ${uploadError.message}`);
      }

      console.log('Upload successful:', uploadData);

      // Get public URL
      const { data: urlData } = anonClient.storage
        .from('pictures-new')
        .getPublicUrl(fileName);

      console.log('Public URL:', urlData.publicUrl);

      // Insert database record using the main client
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