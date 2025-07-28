import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Play, Pause, ExternalLink, Music, Edit, Save, X, Plus } from "lucide-react";
import { usePlaylist } from "@/hooks/usePlaylist";

export const Playlist = () => {
  const { playlist, updateTrack, addTrack, removeTrack } = usePlaylist();
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [editingTrack, setEditingTrack] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    artist: "",
    album: "",
    duration: "",
    reason: ""
  });

  const handlePlayPause = (trackIndex: number) => {
    if (currentTrack === trackIndex && isPlaying) {
      setIsPlaying(false);
    } else {
      setCurrentTrack(trackIndex);
      setIsPlaying(true);
    }
  };

  const startEditing = (track: any) => {
    setEditingTrack(track.id);
    setEditForm({
      title: track.title,
      artist: track.artist,
      album: track.album,
      duration: track.duration,
      reason: track.reason
    });
  };

  const saveEdit = () => {
    if (editingTrack) {
      updateTrack(editingTrack, editForm);
      setEditingTrack(null);
    }
  };

  const cancelEdit = () => {
    setEditingTrack(null);
    setEditForm({ title: "", artist: "", album: "", duration: "", reason: "" });
  };

  const addNewTrack = () => {
    const newTrack = {
      id: Date.now().toString(),
      title: "New Track",
      artist: "Artist Name",
      album: "Album Name",
      duration: "0:00",
      reason: "Why this track inspires you..."
    };
    addTrack(newTrack);
    startEditing(newTrack);
  };

  return (
    <Card className="border-0 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
              <Music className="w-6 h-6 text-accent" />
            </div>
            <div>
              <CardTitle className="text-xl">Curated Playlist</CardTitle>
              <p className="text-sm text-muted-foreground">Songs that move us</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1">
              {playlist.length} tracks
            </Badge>
            <Button onClick={addNewTrack} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Track
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {playlist.map((track, index) => (
          <div 
            key={track.id}
            className={`p-4 rounded-lg transition-all duration-200 hover:bg-muted/50 ${
              currentTrack === index ? 'bg-accent/10 border border-accent/20' : 'bg-muted/20'
            }`}
          >
            {editingTrack === track.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Track title"
                    value={editForm.title}
                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  />
                  <Input
                    placeholder="Artist"
                    value={editForm.artist}
                    onChange={(e) => setEditForm(prev => ({ ...prev, artist: e.target.value }))}
                  />
                  <Input
                    placeholder="Album"
                    value={editForm.album}
                    onChange={(e) => setEditForm(prev => ({ ...prev, album: e.target.value }))}
                  />
                  <Input
                    placeholder="Duration"
                    value={editForm.duration}
                    onChange={(e) => setEditForm(prev => ({ ...prev, duration: e.target.value }))}
                  />
                </div>
                <Textarea
                  placeholder="Why this track inspires you..."
                  value={editForm.reason}
                  onChange={(e) => setEditForm(prev => ({ ...prev, reason: e.target.value }))}
                  rows={2}
                />
                <div className="flex gap-2">
                  <Button onClick={saveEdit} size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={cancelEdit} size="sm" variant="outline">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => removeTrack(track.id)} 
                    size="sm" 
                    variant="destructive"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => handlePlayPause(index)}
                >
                  {currentTrack === index && isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{track.title}</h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {track.artist} • {track.album}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 italic">
                        "{track.reason}"
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className="text-xs text-muted-foreground">{track.duration}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => startEditing(track)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            These songs have shaped our musical journey. Each one teaches something different about the art of creating music.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};