import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Image } from 'lucide-react';
import { useSupabasePhotoManager } from '@/hooks/useSupabasePhotoManager';

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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) return;

    try {
      await uploadPhoto(
        selectedFile,
        tourId,
        caption || undefined,
        authorName || undefined,
        instagramHandle || undefined
      );
      
      // Reset form
      setSelectedFile(null);
      setCaption('');
      setAuthorName('');
      setInstagramHandle('');
      setPreviewUrl(null);
      
      // Reset file input
      const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      onUploadComplete?.();
    } catch (error) {
      console.error('Upload failed:', error);
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
            <Label htmlFor="photo-upload">Photo</Label>
            <Input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              required
            />
          </div>
          
          {previewUrl && (
            <div className="mt-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-32 object-cover rounded-md border"
              />
            </div>
          )}

          <div>
            <Label htmlFor="author-name">Your Name</Label>
            <Input
              id="author-name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div>
            <Label htmlFor="instagram-handle">Instagram Handle</Label>
            <Input
              id="instagram-handle"
              value={instagramHandle}
              onChange={(e) => setInstagramHandle(e.target.value)}
              placeholder="@yourusername"
            />
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
            disabled={!selectedFile || loading}
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