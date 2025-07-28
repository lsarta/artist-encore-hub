import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Camera, Star, Eye, Check, X, Trash2, Clock, AlertCircle } from "lucide-react";
import { useTours } from "@/hooks/useTours";
import { usePhotos } from "@/hooks/usePhotos";
import { useToast } from "@/hooks/use-toast";

interface PhotoManagerProps {
  onBack: () => void;
}

export const PhotoManager = ({ onBack }: PhotoManagerProps) => {
  const { tours } = useTours();
  const { 
    getPhotosByShow, 
    getApprovedPhotosByShow, 
    getPendingPhotos, 
    getFeaturedPhotoByShow,
    approvePhoto, 
    rejectPhoto, 
    deletePhoto, 
    setFeaturedPhoto 
  } = usePhotos();
  const { toast } = useToast();
  const [selectedShow, setSelectedShow] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'shows' | 'pending'>('shows');

  const pendingPhotos = getPendingPhotos();
  const pastShows = tours.filter(tour => tour.status === 'past');

  const handleApprovePhoto = (photoId: string) => {
    approvePhoto(photoId);
    toast({
      title: "Photo approved",
      description: "The photo has been approved and is now visible to fans.",
    });
  };

  const handleRejectPhoto = (photoId: string) => {
    rejectPhoto(photoId);
    toast({
      title: "Photo rejected",
      description: "The photo has been rejected and will not be visible to fans.",
    });
  };

  const handleDeletePhoto = (photoId: string) => {
    deletePhoto(photoId);
    toast({
      title: "Photo deleted",
      description: "The photo has been permanently deleted.",
    });
  };

  const handleSetFeatured = (photoId: string, showId: string) => {
    setFeaturedPhoto(photoId, showId);
    toast({
      title: "Featured photo updated",
      description: "This photo is now featured for the show.",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const PhotoCard = ({ photo, showActions = true }: { photo: any; showActions?: boolean }) => (
    <Card className="border-0 bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="aspect-square overflow-hidden relative group">
        <img 
          src={photo.url} 
          alt={photo.caption}
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => setSelectedPhoto(photo)}
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button variant="secondary" size="sm" onClick={() => setSelectedPhoto(photo)}>
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>
        </div>
        {photo.featured && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-yellow-500 text-yellow-900">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Featured
            </Badge>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge variant={
            photo.status === 'approved' ? 'default' : 
            photo.status === 'pending' ? 'secondary' : 'destructive'
          }>
            {photo.status === 'approved' && <Check className="w-3 h-3 mr-1" />}
            {photo.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
            {photo.status === 'rejected' && <X className="w-3 h-3 mr-1" />}
            {photo.status}
          </Badge>
        </div>
      </div>
      <CardContent className="p-3">
        <p className="text-xs mb-2 line-clamp-2">{photo.caption}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>by {photo.author}</span>
          <span>{formatDate(photo.uploadDate)}</span>
        </div>
        {showActions && photo.status === 'pending' && (
          <div className="flex gap-2 mt-3">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleApprovePhoto(photo.id)}
              className="flex-1 text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
            >
              <Check className="w-3 h-3 mr-1" />
              Approve
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleRejectPhoto(photo.id)}
              className="flex-1 text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
            >
              <X className="w-3 h-3 mr-1" />
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (selectedShow) {
    const show = tours.find(t => t.id === selectedShow);
    const showPhotos = getPhotosByShow(selectedShow);
    const approvedPhotos = getApprovedPhotosByShow(selectedShow);
    const featuredPhoto = getFeaturedPhotoByShow(selectedShow);

    return (
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <button 
            onClick={() => setSelectedShow(null)}
            className="text-accent hover:underline mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shows
          </button>
          <h1 className="text-4xl font-bold tracking-tight mb-2">{show?.title}</h1>
          <p className="text-muted-foreground">{show?.venue} • {show?.city}</p>
        </div>

        <Tabs defaultValue="gallery" className="space-y-6">
          <TabsList>
            <TabsTrigger value="gallery">Gallery ({approvedPhotos.length})</TabsTrigger>
            <TabsTrigger value="all">All Photos ({showPhotos.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="space-y-6">
            {featuredPhoto && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  Featured Photo
                </h3>
                <Card className="border-2 border-yellow-500/20 bg-card/50 backdrop-blur-sm overflow-hidden">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={featuredPhoto.url} 
                      alt={featuredPhoto.caption}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm mb-2">{featuredPhoto.caption}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>by {featuredPhoto.author}</span>
                      <span>{featuredPhoto.likes} likes</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold mb-4">Approved Photos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {approvedPhotos.filter(p => !p.featured).map((photo) => (
                  <PhotoCard key={photo.id} photo={photo} showActions={false} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {showPhotos.map((photo) => (
                <PhotoCard key={photo.id} photo={photo} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <button 
          onClick={onBack}
          className="text-accent hover:underline mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Photo Management</h1>
            <p className="text-muted-foreground">Review and manage fan photos from your shows.</p>
          </div>
          {pendingPhotos.length > 0 && (
            <Badge variant="secondary" className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {pendingPhotos.length} pending review
            </Badge>
          )}
        </div>
      </div>

      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)} className="space-y-6">
        <TabsList>
          <TabsTrigger value="shows">Shows ({pastShows.length})</TabsTrigger>
          <TabsTrigger value="pending">
            Pending Review ({pendingPhotos.length})
            {pendingPhotos.length > 0 && (
              <Badge variant="destructive" className="ml-2 px-1 py-0 text-xs">
                !
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="shows" className="space-y-6">
          <div className="grid gap-6">
            {pastShows.map((show) => {
              const showPhotos = getApprovedPhotosByShow(show.id);
              const featuredPhoto = getFeaturedPhotoByShow(show.id);
              
              return (
                <Card key={show.id} className="border-0 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{show.title}</h3>
                        <p className="text-muted-foreground text-sm">{show.venue} • {show.city}</p>
                        <p className="text-muted-foreground text-sm">{formatDate(show.date)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{showPhotos.length}</p>
                        <p className="text-sm text-muted-foreground">photos</p>
                      </div>
                    </div>
                    
                    {featuredPhoto && (
                      <div className="mb-4">
                        <div className="w-full h-32 rounded-lg overflow-hidden relative">
                          <img 
                            src={featuredPhoto.url} 
                            alt={featuredPhoto.caption}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-yellow-500 text-yellow-900">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              Featured
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedShow(show.id)}
                      className="w-full"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Manage Photos
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          {pendingPhotos.length === 0 ? (
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <Check className="w-16 h-16 mx-auto text-green-500 mb-4" />
                <p className="text-muted-foreground">All photos have been reviewed!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {pendingPhotos.map((photo) => (
                <PhotoCard key={photo.id} photo={photo} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Photo Detail Dialog */}
      {selectedPhoto && (
        <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Photo Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="aspect-video overflow-hidden rounded-lg">
                <img 
                  src={selectedPhoto.url} 
                  alt={selectedPhoto.caption}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <p className="font-medium">{selectedPhoto.caption}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Author:</span> {selectedPhoto.author}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Show:</span> {selectedPhoto.showTitle}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Upload Date:</span> {formatDate(selectedPhoto.uploadDate)}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span> {selectedPhoto.status}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {selectedPhoto.status === 'approved' && !selectedPhoto.featured && (
                  <Button 
                    onClick={() => {
                      handleSetFeatured(selectedPhoto.id, selectedPhoto.showId);
                      setSelectedPhoto(null);
                    }}
                    className="flex-1"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Set as Featured
                  </Button>
                )}
                {selectedPhoto.status === 'pending' && (
                  <>
                    <Button 
                      onClick={() => {
                        handleApprovePhoto(selectedPhoto.id);
                        setSelectedPhoto(null);
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button 
                      onClick={() => {
                        handleRejectPhoto(selectedPhoto.id);
                        setSelectedPhoto(null);
                      }}
                      variant="destructive"
                      className="flex-1"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
                <Button 
                  onClick={() => {
                    handleDeletePhoto(selectedPhoto.id);
                    setSelectedPhoto(null);
                  }}
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};