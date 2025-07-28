import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, MapPin, Camera, Plus, Heart, MessageCircle, Upload, Star } from "lucide-react";

interface Show {
  id: string;
  title: string;
  date: string;
  venue: string;
  city: string;
  status: 'upcoming' | 'past';
  photoCount: number;
}

interface FanGalleryProps {
  show: Show;
  onBack: () => void;
}

export const FanGallery = ({ show, onBack }: FanGalleryProps) => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  // Mock gallery photos - these would come from your backend
  const galleryPhotos = [
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=300&fit=crop",
      caption: "Amazing energy from the crowd tonight!",
      author: "MusicFan92",
      likes: 24,
      featured: true,
      approved: true
    },
    {
      id: "2", 
      url: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=300&fit=crop",
      caption: "The lights were incredible during the last song",
      author: "ConcertLover",
      likes: 18,
      featured: false,
      approved: true
    },
    {
      id: "3",
      url: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400&h=300&fit=crop", 
      caption: "Best show ever! The acoustic set was perfect",
      author: "Fan4Life",
      likes: 31,
      featured: true,
      approved: true
    },
    {
      id: "4",
      url: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop",
      caption: "Caught this moment during the encore",
      author: "PhotoFan",
      likes: 12,
      featured: false,
      approved: true
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    });
  };

  const featuredPhotos = galleryPhotos.filter(photo => photo.featured);
  const regularPhotos = galleryPhotos.filter(photo => !photo.featured);

  // Helper to create URL-safe folder names
  const slugify = (str: string) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^\-+|\-+$/g, "");

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <button 
          onClick={onBack}
          className="text-accent hover:underline mb-4 flex items-center gap-2"
        >
          ← Back to tours
        </button>
        
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">{show.title}</h1>
            <div className="space-y-1 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(show.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{show.venue} • {show.city}</span>
              </div>
            </div>
          </div>

          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Upload Photo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Upload Photo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">Select a photo to upload</p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Caption</label>
                  <Textarea
                    placeholder="Tell us about this moment..."
                    className="resize-none"
                    rows={3}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setUploadDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={async () => {
                      if (!file) {
                        toast({ title: "No file selected" });
                        return;
                      }
                      const eventSlug = slugify(show.title);
                      const filePath = `${eventSlug}/${Date.now()}_${file.name}`;
                      const { error: uploadError } = await supabase.storage
                        .from("pictures") // bucket name
                        .upload(filePath, file, {
                          cacheControl: "3600",
                          upsert: false,
                        });

                      if (uploadError) {
                        toast({ title: "Upload failed", description: uploadError.message });
                        return;
                      }

                      const { error: insertError } = await supabase
                        .from("user info")
                        .insert({
                          name,
                          email,
                          caption,
                          event_name: show.title,
                          photo_path: filePath,
                        });

                      if (insertError) {
                        toast({ title: "Database error", description: insertError.message });
                        return;
                      }

                      toast({ title: "Photo uploaded successfully" });
                      // Reset fields
                      setFile(null);
                      setCaption("");
                      setName("");
                      setEmail("");
                      setUploadDialogOpen(false);
                    }}
                  >
                    Upload
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Featured Photos */}
      {featuredPhotos.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-500 fill-current" />
            <h2 className="text-2xl font-bold">Featured Photos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPhotos.map((photo) => (
              <Card key={photo.id} className="border-2 border-yellow-500/20 bg-card/50 backdrop-blur-sm overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={photo.url} 
                    alt={photo.caption}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <p className="text-sm mb-2">{photo.caption}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>by {photo.author}</span>
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                        <Heart className="w-3 h-3" />
                        {photo.likes}
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Photos */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Fan Photos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {regularPhotos.map((photo) => (
            <Card key={photo.id} className="border-0 bg-card/50 backdrop-blur-sm overflow-hidden">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={photo.url} 
                  alt={photo.caption}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-3">
                <p className="text-xs mb-2 line-clamp-2">{photo.caption}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>@{photo.author}</span>
                  <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                    <Heart className="w-3 h-3" />
                    {photo.likes}
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};