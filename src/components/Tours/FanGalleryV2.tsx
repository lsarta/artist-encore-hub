import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface Photo {
  id: string;
  file_url: string;
  caption?: string;
  author_name?: string;
  instagram_handle?: string;
  tour_id: string;
  created_at: string;
  likes: number;
  status: 'pending' | 'approved' | 'rejected';
  featured?: boolean;
}

interface FanGalleryProps {
  photos: Photo[];
  featured: Photo | null;
  showTitle: string;
}

export const FanGallery = ({ photos, featured, showTitle }: FanGalleryProps) => {
  return (
    <div className="space-y-8">
      {featured && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-center">✨ Featured Photo</h3>
          <Card className="overflow-hidden">
            <div className="relative">
              <img 
                src={featured.file_url} 
                alt={featured.caption || 'Featured photo'}
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-lg font-medium">{featured.caption}</p>
                <p className="text-sm opacity-90">
                  by {featured.author_name}
                  {featured.instagram_handle && (
                    <span className="ml-2 text-blue-300">@{featured.instagram_handle}</span>
                  )}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div>
        <h3 className="text-xl font-semibold mb-4">Fan Photos ({photos.length})</h3>
        {photos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No photos yet. Be the first to share a photo from this show!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <Card key={photo.id} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={photo.file_url} 
                    alt={photo.caption || 'Fan photo'}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <Button size="sm" variant="secondary" className="rounded-full">
                      <Heart className="h-3 w-3 mr-1" />
                      {photo.likes}
                    </Button>
                  </div>
                </div>
                <CardContent className="p-3">
                  <p className="text-sm font-medium mb-1">{photo.caption || 'No caption'}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      by {photo.author_name || 'Anonymous'}
                      {photo.instagram_handle && (
                        <span className="ml-1 text-blue-500">@{photo.instagram_handle}</span>
                      )}
                    </span>
                    <span>{new Date(photo.created_at).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};