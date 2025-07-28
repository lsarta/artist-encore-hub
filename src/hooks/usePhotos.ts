import { useState } from "react";

export interface Photo {
  id: string;
  url: string;
  caption: string;
  author: string;
  email: string;
  showId: string;
  showTitle: string;
  status: 'pending' | 'approved' | 'rejected';
  featured: boolean;
  likes: number;
  uploadDate: string;
}

const initialPhotos: Photo[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=300&fit=crop",
    caption: "Amazing energy from the crowd tonight!",
    author: "MusicFan92",
    email: "fan92@example.com",
    showId: "3",
    showTitle: "Winter Tour 2023",
    status: "approved",
    featured: true,
    likes: 24,
    uploadDate: "2024-01-15"
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=300&fit=crop",
    caption: "The lights were incredible during the last song",
    author: "ConcertLover",
    email: "concert@example.com",
    showId: "3",
    showTitle: "Winter Tour 2023",
    status: "approved",
    featured: false,
    likes: 18,
    uploadDate: "2024-01-15"
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400&h=300&fit=crop",
    caption: "Best show ever! The acoustic set was perfect",
    author: "Fan4Life",
    email: "fan4life@example.com",
    showId: "4",
    showTitle: "Indie Rock Festival",
    status: "approved",
    featured: true,
    likes: 31,
    uploadDate: "2024-01-10"
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop",
    caption: "Caught this moment during the encore",
    author: "PhotoFan",
    email: "photo@example.com",
    showId: "4",
    showTitle: "Indie Rock Festival",
    status: "pending",
    featured: false,
    likes: 0,
    uploadDate: "2024-01-12"
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop",
    caption: "The band interaction with fans was incredible",
    author: "NewFan",
    email: "newfan@example.com",
    showId: "5",
    showTitle: "Album Release Party",
    status: "pending",
    featured: false,
    likes: 0,
    uploadDate: "2024-01-16"
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    caption: "Sound quality was amazing tonight!",
    author: "AudioFile",
    email: "audio@example.com",
    showId: "3",
    showTitle: "Winter Tour 2023",
    status: "rejected",
    featured: false,
    likes: 0,
    uploadDate: "2024-01-14"
  }
];

export const usePhotos = () => {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);

  const getPhotosByShow = (showId: string) => {
    return photos.filter(photo => photo.showId === showId);
  };

  const getApprovedPhotosByShow = (showId: string) => {
    return photos.filter(photo => photo.showId === showId && photo.status === 'approved');
  };

  const getPendingPhotos = () => {
    return photos.filter(photo => photo.status === 'pending');
  };

  const getFeaturedPhotoByShow = (showId: string) => {
    return photos.find(photo => photo.showId === showId && photo.featured && photo.status === 'approved');
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

  const updatePhoto = (photoId: string, updates: Partial<Photo>) => {
    setPhotos(prev => 
      prev.map(photo => 
        photo.id === photoId ? { ...photo, ...updates } : photo
      )
    );
  };

  const addPhoto = (photo: Omit<Photo, 'id' | 'uploadDate' | 'likes'>) => {
    const newPhoto: Photo = {
      ...photo,
      id: Date.now().toString(),
      uploadDate: new Date().toISOString().split('T')[0],
      likes: 0
    };
    setPhotos(prev => [...prev, newPhoto]);
  };

  return {
    photos,
    getPhotosByShow,
    getApprovedPhotosByShow,
    getPendingPhotos,
    getFeaturedPhotoByShow,
    approvePhoto,
    rejectPhoto,
    deletePhoto,
    setFeaturedPhoto,
    updatePhoto,
    addPhoto
  };
};