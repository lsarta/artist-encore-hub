import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, Plus, Camera } from "lucide-react";

interface ShowGalleryProps {
  show: {
    date: string;
    venue: string;
    location: string;
    featuring: string[];
  };
  onBack: () => void;
}

export const ShowGallery = ({ show, onBack }: ShowGalleryProps) => {
  // Sample gallery data - in real app this would come from a database
  const [photos, setPhotos] = useState([
    {
      id: "1",
      url: "/lovable-uploads/2ced9793-1e12-40d2-8a72-4158000f4221.png",
      isArtistFeatured: true,
      caption: "Brand Nubian live at Aretha Franklin Amphitheatre",
      uploader: "artist"
    },
    {
      id: "2", 
      url: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&h=600&fit=crop",
      isArtistFeatured: false,
      caption: "Amazing crowd energy tonight!",
      uploader: "fan"
    },
    {
      id: "3",
      url: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=800&h=600&fit=crop", 
      isArtistFeatured: false,
      caption: "The stage setup was incredible",
      uploader: "fan"
    },
    {
      id: "4",
      url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop",
      isArtistFeatured: false,
      caption: "Lights and atmosphere on point",
      uploader: "fan"
    }
  ]);

  const artistFeaturedPhoto = photos.find(photo => photo.isArtistFeatured);
  const fanPhotos = photos.filter(photo => !photo.isArtistFeatured);

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const slugify = (str: string) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^\-+|\-+$/g, "");

  const handleAddPhoto = () => {
    setUploadDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed relative" style={{
      backgroundImage: `url(/lovable-uploads/c37f4de1-fa97-41db-8190-62310623a4a1.png)`
    }}>
      {/* Background overlay for readability */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]" />
      
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="mb-6 hover:bg-black/60 bg-black/50 backdrop-blur-md border border-white/40 text-white hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tours
        </Button>

        {/* Show Info */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-white drop-shadow-lg">
            {show.venue}
          </h1>
          <p className="text-lg text-white/90 mb-2">{show.location}</p>
          <p className="text-white/80 mb-4">{show.date}</p>
          {show.featuring.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-white/90 text-sm">Featuring:</span>
              {show.featuring.map((artist, index) => (
                <Badge key={index} variant="secondary" className="bg-black/40 backdrop-blur-md border border-white/30 text-white text-xs">
                  {artist}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Card className="border-0 bg-card/50 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Show Gallery</h2>
              <Button onClick={handleAddPhoto} className="bg-accent hover:bg-accent/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Photo
              </Button>
            </div>

            {/* Artist Featured Photo */}
            {artistFeaturedPhoto && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <h3 className="text-lg font-semibold">Artist Featured Photo</h3>
                </div>
                <div className="relative rounded-lg overflow-hidden">
                  <img 
                    src={artistFeaturedPhoto.url} 
                    alt={artistFeaturedPhoto.caption}
                    className="w-full h-64 sm:h-80 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <p className="text-white text-sm">{artistFeaturedPhoto.caption}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Fan Photos Grid */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-4">Fan Photos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {fanPhotos.map((photo) => (
                  <div key={photo.id} className="relative rounded-lg overflow-hidden group cursor-pointer">
                    <img 
                      src={photo.url} 
                      alt={photo.caption}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-xs">{photo.caption}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Camera className="w-3 h-3 text-white/70" />
                        <span className="text-white/70 text-xs">Fan photo</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Photo Placeholder */}
            <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:bg-muted/10 transition-colors cursor-pointer" onClick={handleAddPhoto}>
              <Camera className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">Share your photos from this show</p>
              <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Photo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
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
                  const eventSlug = slugify(show.venue);
                  const filePath = `${eventSlug}/${Date.now()}_${file.name}`;

                  const { error: uploadError } = await supabase.storage
                    .from("pictures-new")
                    .upload(filePath, file, { cacheControl: "3600", upsert: false });

                  if (uploadError) {
                    console.error('Upload error:', uploadError);
                    toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
                    return;
                  }

                  const { data: publicUrlData } = supabase.storage.from("pictures-new").getPublicUrl(filePath);

                  const { error: insertError } = await supabase
                    .from("photo_submissions")
                    .insert({
                      tour_id: eventSlug,
                      file_path: filePath,
                      file_url: publicUrlData?.publicUrl,
                      caption,
                      author_name: name,
                      instagram_handle: email // Using email field temporarily for instagram
                    });

                  if (insertError) {
                    console.error('Database error:', insertError);
                    toast({ title: "Database error", description: insertError.message, variant: "destructive" });
                    return;
                  }

                  toast({ title: "Photo uploaded successfully" });

                  // Update gallery locally
                  setPhotos(prev => [
                    ...prev,
                    {
                      id: Date.now().toString(),
                      url: publicUrlData?.publicUrl ?? "", // fallback empty
                      isArtistFeatured: false,
                      caption: caption,
                      uploader: "fan",
                    },
                  ]);

                  // Reset form
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
  );
};