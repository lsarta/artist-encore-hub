import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Image, X } from 'lucide-react';
import { useSupabasePhotoManager } from '@/hooks/useSupabasePhotoManager';
import { useToast } from '@/hooks/use-toast';

interface PhotoUploadProps {
  tourId: string;
  tourTitle: string;
  onUploadComplete?: () => void;
}

export const PhotoUpload = ({ tourId, tourTitle, onUploadComplete }: PhotoUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const { uploadPhoto, loading } = useSupabasePhotoManager();
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    // Reset file input
    const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a photo to upload.",
        variant: "destructive",
      });
      return;
    }

    if (!authorName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Starting upload process...');
      await uploadPhoto(
        selectedFile,
        tourId,
        caption.trim() || undefined,
        authorName.trim(),
        instagramHandle.trim() || undefined
      );
      
      // Reset form
      setSelectedFile(null);
      setCaption('');
      setAuthorName('');
      setInstagramHandle('');
      handleRemoveFile();
      
      onUploadComplete?.();
    } catch (error) {
      console.error('Upload failed in component:', error);
      // Error handling is already done in the hook
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Share Your Photo
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Upload a photo from {tourTitle}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="photo-upload">Photo *</Label>
            <Input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              required
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Max size: 10MB. Formats: JPG, PNG, GIF, WebP
            </p>
          </div>
          
          {previewUrl && (
            <div className="relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-32 object-cover rounded-md border"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0"
                onClick={handleRemoveFile}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          <div>
            <Label htmlFor="author-name">Your Name *</Label>
            <Input
              id="author-name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <Label htmlFor="instagram-handle">Instagram Handle</Label>
            <Input
              id="instagram-handle"
              value={instagramHandle}
              onChange={(e) => {
                let value = e.target.value;
                // Remove @ if user adds it
                if (value.startsWith('@')) {
                  value = value.substring(1);
                }
                setInstagramHandle(value);
              }}
              placeholder="yourusername (without @)"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Optional: Your Instagram username (we'll add the @)
            </p>
          </div>

          <div>
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Share your experience..."
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!selectedFile || !authorName.trim() || loading}
          >
            {loading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Photo
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};