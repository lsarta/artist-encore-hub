import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, ExternalLink, Music, Calendar, ShoppingBag, ArrowLeft } from "lucide-react";
// Background image for Brand Nubian page
const brandNubianBackground = "/lovable-uploads/c37f4de1-fa97-41db-8190-62310623a4a1.png";
interface BrandNubianPageProps {
  onBack: () => void;
}
export const BrandNubianPage = ({
  onBack
}: BrandNubianPageProps) => {
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const pastTours = [{
    date: "Friday 30 August 2024",
    venue: "Aretha Franklin Amphitheatre",
    location: "Detroit, MI, US",
    featuring: ["Slick Rick", "Rakim", "and 4 others"]
  }, {
    date: "Wednesday 17 July 2024",
    venue: "Sony Hall",
    location: "New York (NYC), NY, US",
    featuring: ["Termanology", "Diamond D"]
  }, {
    date: "Saturday 28 October 2023 – Sunday 29 October 2023",
    venue: "One Musicfest 2023 - Piedmont Park",
    location: "Atlanta, GA, US",
    featuring: []
  }, {
    date: "Friday 29 September 2023",
    venue: "Elevation 27",
    location: "Virginia Beach, VA, US",
    featuring: []
  }, {
    date: "Saturday 16 September 2023",
    venue: "S.O.B.'s",
    location: "Manhattan, NY, US",
    featuring: ["Lord Finesse", "Rah Digga", "and 2 others"]
  }, {
    date: "Sunday 03 September 2023",
    venue: "Lady B's Annual Basement Party 2023 - Dell Music Center",
    location: "Philadelphia, PA, US",
    featuring: []
  }, {
    date: "Friday 21 July 2023",
    venue: "Radio City Music Hall",
    location: "New York (NYC), NY, US",
    featuring: ["The Sugarhill Gang", "Slick Rick", "and 18 others"]
  }, {
    date: "Sunday 02 July 2023",
    venue: "Mable House Barnes Amphitheatre",
    location: "Mableton, GA, US",
    featuring: ["KRS-One", "Big Daddy Kane", "and 2 others"],
    outdoor: true
  }, {
    date: "Saturday 01 July 2023",
    venue: "Mable House Barnes Amphitheatre",
    location: "Mableton, GA, US",
    featuring: ["KRS-One", "Big Daddy Kane", "and 2 others"],
    outdoor: true
  }, {
    date: "Saturday 02 April 2022",
    venue: "XL Live",
    location: "Harrisburg, PA, US",
    featuring: ["Rakim"]
  }, {
    date: "Thursday 19 August 2021",
    venue: "Martha's Vineyard Soulfest 2021 - The Loft",
    location: "Oak Bluffs, MA, US",
    featuring: []
  }, {
    date: "Thursday 18 July 2019",
    venue: "The Anthem",
    location: "Washington, DC, US",
    featuring: ["Monie Love", "DJ Maseo", "and 1 other"]
  }, {
    date: "Friday 18 January 2019",
    venue: "Apollo Theater",
    location: "Manhattan, NY, US",
    featuring: ["Rakim", "EPMD", "and 2 others"]
  }, {
    date: "Friday 14 September 2018",
    venue: "S.O.B.'s",
    location: "Manhattan, NY, US",
    featuring: ["Artifacts", "Main Source", "and 1 other"]
  }, {
    date: "Friday 15 June 2018",
    venue: "The Promontory",
    location: "Chicago, IL, US",
    featuring: []
  }, {
    date: "Friday 23 February 2018",
    venue: "New Jersey Performing Arts Center",
    location: "Newark, NJ, US",
    featuring: ["Bone Thugs-n-Harmony", "Big Daddy Kane", "and 4 others"]
  }, {
    date: "Saturday 09 September 2017",
    venue: "Underground Arts",
    location: "Philadelphia, PA, US",
    featuring: ["Das EFX"]
  }, {
    date: "Saturday 15 July 2017",
    venue: "The New Parish",
    location: "Oakland, CA, US",
    featuring: ["Grand Puba", "Sadat X"]
  }, {
    date: "Thursday 08 June 2017",
    venue: "Underground Arts",
    location: "Philadelphia, PA, US",
    featuring: ["Das EFX"]
  }, {
    date: "Saturday 22 April 2017",
    venue: "Marina Jeep Arena, Main Street Armory",
    location: "Rochester, NY, US",
    featuring: []
  }];
  const curatedPlaylist = [{
    id: "1",
    title: "The Message",
    artist: "Grandmaster Flash & The Furious Five",
    album: "The Message",
    duration: "7:11",
    reason: "The blueprint for conscious rap - showed us hip-hop could have a message"
  }, {
    id: "2",
    title: "Fight the Power",
    artist: "Public Enemy",
    album: "Do the Right Thing Soundtrack",
    duration: "4:45",
    reason: "Revolutionary energy that inspired our approach to social commentary"
  }, {
    id: "3",
    title: "Me Myself and I",
    artist: "De La Soul",
    album: "3 Feet High and Rising",
    duration: "4:14",
    reason: "Our Native Tongues family - creative freedom and positive vibes"
  }, {
    id: "4",
    title: "Can I Kick It?",
    artist: "A Tribe Called Quest",
    album: "People's Instinctive Travels and the Paths of Rhythm",
    duration: "4:27",
    reason: "Jazz samples and smooth flows - major influence on our sound"
  }, {
    id: "5",
    title: "I Know You Got Soul",
    artist: "Eric B. & Rakim",
    album: "Paid in Full",
    duration: "5:05",
    reason: "Rakim's intellectual approach to lyricism set the bar high"
  }, {
    id: "6",
    title: "The Choice Is Yours",
    artist: "Black Sheep",
    album: "A Wolf in Sheep's Clothing",
    duration: "4:17",
    reason: "Native Tongues creativity with that raw New York energy"
  }];
  const handlePlayPause = (trackIndex: number) => {
    if (currentTrack === trackIndex && isPlaying) {
      setIsPlaying(false);
    } else {
      setCurrentTrack(trackIndex);
      setIsPlaying(true);
    }
  };
  return <div className="min-h-screen bg-cover bg-center bg-fixed relative" style={{
    backgroundImage: `url(${brandNubianBackground})`
  }}>
      {/* Background overlay for readability */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]" />
      
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={onBack} className="mb-6 hover:bg-black/60 bg-black/50 backdrop-blur-md border border-white/40 text-white hover:text-white">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Artist Title */}
        <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-lg">
          Brand Nubian
        </h1>
        <Badge variant="secondary" className="mb-8 bg-black/60 backdrop-blur-md border border-white/50 text-white">Hip-Hop Group</Badge>

        {/* Artist Header */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          <div className="flex-shrink-0">
            
          </div>
          
          <div className="flex-1">
            <div className="mb-4">
            </div>
            
            <div className="prose prose-lg text-white/90 max-w-none drop-shadow-md">
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
                  <h3 className="text-2xl font-semibold mb-2">Songs That Move Us</h3>
                  <p className="text-muted-foreground">A collection of tracks that shaped our sound and message</p>
                  <Badge variant="secondary" className="mt-2">
                    {curatedPlaylist.length} tracks
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  {curatedPlaylist.map((track, index) => <div key={track.id} className={`p-2 sm:p-3 rounded-lg transition-all duration-200 hover:bg-muted/50 ${currentTrack === index ? 'bg-accent/10 border border-accent/20' : 'bg-muted/20'}`}>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8 shrink-0" onClick={() => handlePlayPause(index)}>
                          {currentTrack === index && isPlaying ? <Pause className="w-3 h-3 sm:w-4 sm:h-4" /> : <Play className="w-3 h-3 sm:w-4 sm:h-4" />}
                        </Button>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-0">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate text-sm sm:text-base">{track.title}</h4>
                              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                                {track.artist} • {track.album}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 italic line-clamp-2 sm:line-clamp-1">
                                "{track.reason}"
                              </p>
                            </div>
                            <div className="flex items-center justify-between sm:justify-center gap-2 sm:ml-4">
                              <span className="text-xs text-muted-foreground">{track.duration}</span>
                              <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8">
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tours">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold mb-2">Post Show Archives</h3>
                  <p className="text-muted-foreground">Past Brand Nubian performances and tour history</p>
                  <Badge variant="secondary" className="mt-2">
                    {pastTours.length} past shows
                  </Badge>
                </div>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {pastTours.map((tour, index) => <div key={index} className="p-4 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors border-l-4 border-accent/30">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium text-sm text-muted-foreground">{tour.date}</span>
                            <Badge variant="outline" className="text-xs">Completed</Badge>
                            {tour.outdoor && <Badge variant="secondary" className="text-xs">Outdoor</Badge>}
                          </div>
                          <h4 className="font-semibold mb-1">{tour.venue}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{tour.location}</p>
                          {tour.featuring.length > 0 && <p className="text-xs text-muted-foreground">
                              <span className="font-medium">Featuring:</span> {tour.featuring.join(", ")}
                            </p>}
                        </div>
                      </div>
                    </div>)}
                </div>
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
    </div>;
};