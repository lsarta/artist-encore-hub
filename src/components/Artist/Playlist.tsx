import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, SkipBack, SkipForward, Heart, ExternalLink, Music } from "lucide-react";

export const Playlist = () => {
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playlist = [
    {
      id: "1",
      title: "Bohemian Rhapsody",
      artist: "Queen",
      album: "A Night at the Opera",
      duration: "5:55",
      reason: "Epic composition that inspired my songwriting approach"
    },
    {
      id: "2", 
      title: "The Sound of Silence",
      artist: "Simon & Garfunkel", 
      album: "Sounds of Silence",
      duration: "3:05",
      reason: "Perfect example of how silence can be as powerful as sound"
    },
    {
      id: "3",
      title: "Smells Like Teen Spirit", 
      artist: "Nirvana",
      album: "Nevermind",
      duration: "5:01",
      reason: "Raw energy that changed everything about rock music"
    },
    {
      id: "4",
      title: "What's Going On",
      artist: "Marvin Gaye", 
      album: "What's Going On",
      duration: "3:53",
      reason: "Music with a message - shows how art can change the world"
    },
    {
      id: "5",
      title: "Hotel California",
      artist: "Eagles",
      album: "Hotel California", 
      duration: "6:30",
      reason: "Storytelling masterpiece with incredible guitar work"
    },
    {
      id: "6",
      title: "Billie Jean",
      artist: "Michael Jackson",
      album: "Thriller",
      duration: "4:54", 
      reason: "The perfect pop song - every element is flawless"
    }
  ];

  const handlePlayPause = (trackIndex: number) => {
    if (currentTrack === trackIndex && isPlaying) {
      setIsPlaying(false);
    } else {
      setCurrentTrack(trackIndex);
      setIsPlaying(true);
    }
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
              <p className="text-sm text-muted-foreground">Songs that inspire my music</p>
            </div>
          </div>
          <Badge variant="secondary" className="px-3 py-1">
            {playlist.length} tracks
          </Badge>
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
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            These songs have shaped my musical journey. Each one teaches something different about the art of creating music.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};