import { useState } from "react";

export interface PhotoSubmission {
  id: string;
  url: string;
  caption: string;
  author: string;
  email: string;
  showId: string;
  showTitle: string;
  venue: string;
  city: string;
  showDate: string;
  status: 'pending' | 'approved' | 'rejected';
  featured: boolean;
  likes: number;
  uploadDate: string;
  quality: 'high' | 'medium' | 'low';
  tags: string[];
  resolution: string;
  fileSize: string;
  contentScore: number; // 0-100 for content moderation
}

export interface ShowPhotoStats {
  showId: string;
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  featured: number;
  highQuality: number;
}

const mockPhotos: PhotoSubmission[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&h=600&fit=crop",
    caption: "Amazing energy from the crowd tonight!",
    author: "MusicFan92",
    email: "fan92@example.com",
    showId: "3",
    showTitle: "Winter Tour 2023",
    venue: "Madison Square Garden",
    city: "New York, NY",
    showDate: "2023-12-10",
    status: "approved",
    featured: true,
    likes: 24,
    uploadDate: "2023-12-10T22:30:00Z",
    quality: "high",
    tags: ["crowd", "energy"],
    resolution: "1920x1080",
    fileSize: "2.4MB",
    contentScore: 95
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=800&h=600&fit=crop",
    caption: "The lights were incredible during the last song",
    author: "ConcertLover",
    email: "concert@example.com",
    showId: "3",
    showTitle: "Winter Tour 2023",
    venue: "Madison Square Garden",
    city: "New York, NY",
    showDate: "2023-12-10",
    status: "approved",
    featured: false,
    likes: 18,
    uploadDate: "2023-12-10T23:15:00Z",
    quality: "high",
    tags: ["lights", "performance"],
    resolution: "1920x1080",
    fileSize: "3.1MB",
    contentScore: 92
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&h=600&fit=crop",
    caption: "Best show ever! The acoustic set was perfect",
    author: "Fan4Life",
    email: "fan4life@example.com",
    showId: "4",
    showTitle: "Indie Rock Festival",
    venue: "Red Rocks",
    city: "Denver, CO",
    showDate: "2023-11-05",
    status: "pending",
    featured: false,
    likes: 0,
    uploadDate: "2023-11-05T21:45:00Z",
    quality: "medium",
    tags: ["acoustic"],
    resolution: "1680x1050",
    fileSize: "1.8MB",
    contentScore: 88
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&h=600&fit=crop",
    caption: "Caught this moment during the encore",
    author: "PhotoFan",
    email: "photo@example.com",
    showId: "4",
    showTitle: "Indie Rock Festival",
    venue: "Red Rocks",
    city: "Denver, CO",
    showDate: "2023-11-05",
    status: "pending",
    featured: false,
    likes: 0,
    uploadDate: "2023-11-05T22:30:00Z",
    quality: "high",
    tags: ["encore", "performance"],
    resolution: "1920x1080",
    fileSize: "2.7MB",
    contentScore: 91
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop",
    caption: "The band interaction with fans was incredible",
    author: "NewFan",
    email: "newfan@example.com",
    showId: "5",
    showTitle: "Album Release Party",
    venue: "The Troubadour",
    city: "Los Angeles, CA",
    showDate: "2023-10-15",
    status: "approved",
    featured: false,
    likes: 12,
    uploadDate: "2023-10-15T20:15:00Z",
    quality: "medium",
    tags: ["interaction", "fans"],
    resolution: "1600x900",
    fileSize: "2.0MB",
    contentScore: 89
  }
];

export const usePhotoManager = () => {
  const [photos, setPhotos] = useState<PhotoSubmission[]>(mockPhotos);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

  const getPhotosByShow = (showId: string): PhotoSubmission[] => {
    return photos.filter(photo => photo.showId === showId);
  };

  const getApprovedPhotosByShow = (showId: string): PhotoSubmission[] => {
    return photos.filter(photo => photo.showId === showId && photo.status === 'approved');
  };

  const getPendingPhotos = (): PhotoSubmission[] => {
    return photos.filter(photo => photo.status === 'pending');
  };

  const getRejectedPhotos = (): PhotoSubmission[] => {
    return photos.filter(photo => photo.status === 'rejected');
  };

  const getFeaturedPhotoByShow = (showId: string): PhotoSubmission | undefined => {
    return photos.find(photo => photo.showId === showId && photo.featured && photo.status === 'approved');
  };

  const getShowStats = (showId: string): ShowPhotoStats => {
    const showPhotos = getPhotosByShow(showId);
    return {
      showId,
      total: showPhotos.length,
      approved: showPhotos.filter(p => p.status === 'approved').length,
      pending: showPhotos.filter(p => p.status === 'pending').length,
      rejected: showPhotos.filter(p => p.status === 'rejected').length,
      featured: showPhotos.filter(p => p.featured).length,
      highQuality: showPhotos.filter(p => p.quality === 'high').length
    };
  };

  const getAllStats = () => {
    return {
      total: photos.length,
      approved: photos.filter(p => p.status === 'approved').length,
      pending: photos.filter(p => p.status === 'pending').length,
      rejected: photos.filter(p => p.status === 'rejected').length,
      featured: photos.filter(p => p.featured).length,
      highQuality: photos.filter(p => p.quality === 'high').length
    };
  };

  const approvePhoto = (photoId: string) => {
    setPhotos(prev => 
      prev.map(photo => 
        photo.id === photoId ? { ...photo, status: 'approved' as const } : photo
      )
    );
  };

  const rejectPhoto = (photoId: string) => {
    setPhotos(prev => 
      prev.map(photo => 
        photo.id === photoId ? { ...photo, status: 'rejected' as const } : photo
      )
    );
  };

  const deletePhoto = (photoId: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
  };

  const setFeaturedPhoto = (photoId: string, showId: string) => {
    setPhotos(prev => 
      prev.map(photo => {
        if (photo.showId === showId) {
          return { ...photo, featured: photo.id === photoId };
        }
        return photo;
      })
    );
  };

  const bulkApprove = (photoIds: string[]) => {
    setPhotos(prev => 
      prev.map(photo => 
        photoIds.includes(photo.id) ? { ...photo, status: 'approved' as const } : photo
      )
    );
  };

  const bulkReject = (photoIds: string[]) => {
    setPhotos(prev => 
      prev.map(photo => 
        photoIds.includes(photo.id) ? { ...photo, status: 'rejected' as const } : photo
      )
    );
  };

  const bulkDelete = (photoIds: string[]) => {
    setPhotos(prev => prev.filter(photo => !photoIds.includes(photo.id)));
  };

  const updatePhotoTags = (photoId: string, tags: string[]) => {
    setPhotos(prev => 
      prev.map(photo => 
        photo.id === photoId ? { ...photo, tags } : photo
      )
    );
  };

  const searchPhotos = (query: string): PhotoSubmission[] => {
    const lowerQuery = query.toLowerCase();
    return photos.filter(photo => 
      photo.caption.toLowerCase().includes(lowerQuery) ||
      photo.author.toLowerCase().includes(lowerQuery) ||
      photo.showTitle.toLowerCase().includes(lowerQuery) ||
      photo.venue.toLowerCase().includes(lowerQuery) ||
      photo.city.toLowerCase().includes(lowerQuery) ||
      photo.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  };

  const getTopContributors = () => {
    const contributors = photos.reduce((acc, photo) => {
      if (!acc[photo.author]) {
        acc[photo.author] = {
          name: photo.author,
          email: photo.email,
          photoCount: 0,
          approvedCount: 0,
          featuredCount: 0
        };
      }
      acc[photo.author].photoCount++;
      if (photo.status === 'approved') acc[photo.author].approvedCount++;
      if (photo.featured) acc[photo.author].featuredCount++;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(contributors).sort((a: any, b: any) => b.photoCount - a.photoCount);
  };

  return {
    photos,
    selectedPhotos,
    setSelectedPhotos,
    getPhotosByShow,
    getApprovedPhotosByShow,
    getPendingPhotos,
    getRejectedPhotos,
    getFeaturedPhotoByShow,
    getShowStats,
    getAllStats,
    approvePhoto,
    rejectPhoto,
    deletePhoto,
    setFeaturedPhoto,
    bulkApprove,
    bulkReject,
    bulkDelete,
    updatePhotoTags,
    searchPhotos,
    getTopContributors
  };
};