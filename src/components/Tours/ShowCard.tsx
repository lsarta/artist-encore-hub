import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Camera, Users } from "lucide-react";

interface Show {
  id: string;
  title: string;
  date: string;
  venue: string;
  city: string;
  status: 'upcoming' | 'past';
  photoCount: number;
}

interface ShowCardProps {
  show: Show;
  onViewGallery: () => void;
}

export const ShowCard = ({ show, onViewGallery }: ShowCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="border-0 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-xl font-semibold">{show.title}</h3>
              <Badge variant={show.status === 'upcoming' ? 'default' : 'secondary'}>
                {show.status === 'upcoming' ? 'Upcoming' : 'Past Show'}
              </Badge>
            </div>
            
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(show.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{show.venue} • {show.city}</span>
              </div>
              {show.status === 'past' && (
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  <span>{show.photoCount} fan photos</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {show.status === 'upcoming' ? (
              <Button variant="outline" size="sm">
                Get Tickets
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onViewGallery}
                className="flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                View Gallery
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};