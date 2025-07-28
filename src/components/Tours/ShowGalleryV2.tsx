import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Camera } from "lucide-react";
import { useState, useEffect } from "react";
import { useTours } from "@/hooks/useTours";
import { useSupabasePhotoManager } from "@/hooks/useSupabasePhotoManager";
import { FanGallery } from "./FanGalleryV2";
import { PhotoUpload } from "./PhotoUpload";

export const ShowGalleryV2 = () => {
  const { tours } = useTours();
  const { getPhotosByTour, getFeaturedPhoto } = useSupabasePhotoManager();
  const [selectedShow, setSelectedShow] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [photos, setPhotos] = useState<any[]>([]);
  const [featuredPhoto, setFeaturedPhoto] = useState<any>(null);
  
  // Force re-render when tours change
  const [refreshKey, setRefreshKey] = useState(0);
  
  useEffect(() => {
    setRefreshKey(prev => prev + 1);
  }, [tours]);

  useEffect(() => {
    if (selectedShow) {
      loadPhotos();
    }
  }, [selectedShow]);

  const loadPhotos = async () => {
    if (!selectedShow) return;
    
    const [tourPhotos, featured] = await Promise.all([
      getPhotosByTour(selectedShow),
      getFeaturedPhoto(selectedShow)
    ]);
    
    setPhotos(tourPhotos);
    setFeaturedPhoto(featured);
  };

  if (selectedShow) {
    const show = tours.find(t => t.id === selectedShow);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setSelectedShow(null)}
          >
            ← Back to All Shows
          </Button>
          <Button
            onClick={() => setShowUpload(!showUpload)}
            variant={showUpload ? "secondary" : "default"}
          >
            <Camera className="mr-2 h-4 w-4" />
            {showUpload ? "Hide Upload" : "Share Photo"}
          </Button>
        </div>
        
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">{show?.title}</h2>
          <p className="text-muted-foreground">
            {new Date(show?.date || '').toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })} • {show?.venue} • {show?.city}
          </p>
        </div>

        {showUpload && (
          <div className="flex justify-center">
            <PhotoUpload
              tourId={selectedShow}
              tourTitle={show?.title || ''}
              onUploadComplete={() => {
                setShowUpload(false);
                loadPhotos();
              }}
            />
          </div>
        )}

        <FanGallery 
          photos={photos} 
          featured={featuredPhoto}
          showTitle={show?.title || ''}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Show Gallery</h1>
        <p className="text-muted-foreground">
          Browse photos from all our shows and share your own memories
        </p>
      </div>

      <div className="grid gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">All Shows</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tours
              .sort((a, b) => {
                // Sort by date, newest first
                return new Date(b.date).getTime() - new Date(a.date).getTime();
              })
              .map((tour) => (
                <Card key={tour.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedShow(tour.id)}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{tour.title}</h3>
                        {tour.subtitle && (
                          <p className="text-sm text-muted-foreground mb-2">{tour.subtitle}</p>
                        )}
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(tour.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric'
                              })}
                              {tour.time && ` • ${tour.time}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{tour.venue}</span>
                          </div>
                          <div className="text-xs">
                            {tour.city}
                          </div>
                        </div>
                      </div>
                      <Badge variant={tour.status === 'upcoming' ? 'default' : 'secondary'}>
                        {tour.status === 'upcoming' ? 'Upcoming' : 'Past'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Camera className="w-4 h-4" />
                        <span>{tour.photoCount} photos</span>
                      </div>
                      <Button size="sm" variant="outline">
                        View Gallery
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};