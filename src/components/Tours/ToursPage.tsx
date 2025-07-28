import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Camera, Plus, Heart, MessageCircle } from "lucide-react";
import { ShowCard } from "./ShowCard";
import { FanGallery } from "./FanGallery";
import { useTours } from "@/hooks/useTours";

interface ToursPageProps {
  onBack: () => void;
}

export const ToursPage = ({ onBack }: ToursPageProps) => {
  const [selectedShow, setSelectedShow] = useState<string | null>(null);
  const { upcomingTours: upcomingShows, pastTours: pastShows, getTourById } = useTours();

  if (selectedShow) {
    const show = getTourById(selectedShow);
    if (show) {
      return <FanGallery show={show} onBack={() => setSelectedShow(null)} />;
    }
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <button 
          onClick={onBack}
          className="text-accent hover:underline mb-4 flex items-center gap-2"
        >
          ← Back to home
        </button>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Tours & Shows</h1>
        <p className="text-muted-foreground">Explore upcoming shows and relive past performances through fan photos.</p>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past Shows</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          <div className="grid gap-6">
            {upcomingShows.map((show) => (
              <ShowCard 
                key={show.id} 
                show={show} 
                onViewGallery={() => setSelectedShow(show.id)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="past" className="space-y-6">
          <div className="grid gap-6">
            {pastShows.map((show) => (
              <ShowCard 
                key={show.id} 
                show={show} 
                onViewGallery={() => setSelectedShow(show.id)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};