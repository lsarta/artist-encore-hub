import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, ExternalLink, Music, Calendar, ShoppingBag, ArrowLeft } from "lucide-react";
const brandNubianImage = "/lovable-uploads/631577aa-ed12-456a-8a69-3d1189808fd6.png";

interface BrandNubianPageProps {
  onBack: () => void;
}

export const BrandNubianPage = ({ onBack }: BrandNubianPageProps) => {
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const curatedPlaylist = [
    {
      id: "1",
      title: "The Message",
      artist: "Grandmaster Flash & The Furious Five",
      album: "The Message",
      duration: "7:11",
      reason: "The blueprint for conscious rap - showed us hip-hop could have a message"
    },
    {
      id: "2", 
      title: "Fight the Power",
      artist: "Public Enemy", 
      album: "Do the Right Thing Soundtrack",
      duration: "4:45",
      reason: "Revolutionary energy that inspired our approach to social commentary"
    },
    {
      id: "3",
      title: "Me Myself and I", 
      artist: "De La Soul",
      album: "3 Feet High and Rising",
      duration: "4:14",
      reason: "Our Native Tongues family - creative freedom and positive vibes"
    },
    {
      id: "4",
      title: "Can I Kick It?",
      artist: "A Tribe Called Quest", 
      album: "People's Instinctive Travels and the Paths of Rhythm",
      duration: "4:27",
      reason: "Jazz samples and smooth flows - major influence on our sound"
    },
    {
      id: "5",
      title: "I Know You Got Soul",
      artist: "Eric B. & Rakim",
      album: "Paid in Full", 
      duration: "5:05",
      reason: "Rakim's intellectual approach to lyricism set the bar high"
    },
    {
      id: "6",
      title: "The Choice Is Yours",
      artist: "Black Sheep",
      album: "A Wolf in Sheep's Clothing",
      duration: "4:17", 
      reason: "Native Tongues creativity with that raw New York energy"
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-6 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-6 hover:bg-muted/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Artist Header */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          <div className="flex-shrink-0">
            <img 
              src={brandNubianImage} 
              alt="Brand Nubian"
              className="w-80 h-80 object-cover rounded-2xl shadow-2xl"
            />
          </div>
          
          <div className="flex-1">
            <div className="mb-4">
              <Badge variant="secondary" className="mb-4">Hip-Hop Group</Badge>
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Brand Nubian
              </h1>
            </div>
            
            <div className="prose prose-lg text-muted-foreground max-w-none">
              <p className="mb-4">
                Brand Nubian emerged from New Rochelle, New York in 1989, founded by Grand Puba, Lord Jamar, Sadat X, and DJ Alamo. The group quickly established themselves as prominent voices in conscious hip-hop, blending socially aware lyrics with infectious beats.
              </p>
              <p className="mb-4">
                Their 1990 debut album "One for All" became a critical and commercial success, featuring the hit single "Slow Down," which showcased their smooth, jazz-influenced production style. Grand Puba's charismatic delivery helped define the Native Tongues movement alongside De La Soul and A Tribe Called Quest.
              </p>
              <p className="mb-4">
                After Grand Puba departed for a solo career in 1991, the remaining trio continued, releasing "In God We Trust" (1993), which included "Punks Jump Up to Get Beat Down." Their music incorporated Five Percent Nation philosophy and Afrocentric themes, contributing to hip-hop's intellectual discourse.
              </p>
              <p>
                Brand Nubian's influence extends far beyond chart success. They helped establish the template for conscious rap that balanced message with accessibility, inspiring artists to address social issues without sacrificing musical appeal. Their sophisticated sampling techniques and group dynamics significantly influenced East Coast hip-hop development throughout the 1990s.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="playlist" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="playlist" className="flex items-center gap-2">
              <Music className="w-4 h-4" />
              Curated Playlist
            </TabsTrigger>
            <TabsTrigger value="tours" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Tours
            </TabsTrigger>
            <TabsTrigger value="merchandise" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Merchandise
            </TabsTrigger>
          </TabsList>

          <TabsContent value="playlist">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold mb-2">Songs That Influenced Us</h3>
                  <p className="text-muted-foreground">A collection of tracks that shaped our sound and message</p>
                  <Badge variant="secondary" className="mt-2">
                    {curatedPlaylist.length} tracks
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {curatedPlaylist.map((track, index) => (
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tours">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-2xl font-semibold mb-2">Tour Dates</h3>
                <p className="text-muted-foreground mb-6">
                  Stay tuned for upcoming Brand Nubian tour announcements and special performances.
                </p>
                <Button variant="outline">
                  Get Notified
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="merchandise">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-2xl font-semibold mb-2">Official Merchandise</h3>
                <p className="text-muted-foreground mb-6">
                  Explore Brand Nubian's official merchandise collection featuring exclusive designs and vintage items.
                </p>
                <Button variant="outline">
                  Shop Now
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};