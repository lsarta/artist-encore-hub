import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Camera, Plus, Heart, MessageCircle } from "lucide-react";
import { ShowCard } from "./ShowCard";
import { FanGallery } from "./FanGallery";

interface ToursPageProps {
  onBack: () => void;
}

export const ToursPage = ({ onBack }: ToursPageProps) => {
  const [selectedShow, setSelectedShow] = useState<string | null>(null);

  const upcomingShows = [
    {
      id: "1",
      title: "Summer Festival 2024",
      date: "2024-08-15",
      venue: "Central Park",
      city: "New York, NY",
      status: "upcoming" as const,
      photoCount: 0
    },
    {
      id: "2", 
      title: "Acoustic Night",
      date: "2024-09-22",
      venue: "The Blue Note",
      city: "Nashville, TN", 
      status: "upcoming" as const,
      photoCount: 0
    },
  ];

  const pastShows = [
    {
      id: "3",
      title: "Winter Tour 2023",
      date: "2023-12-10",
      venue: "Madison Square Garden",
      city: "New York, NY",
      status: "past" as const,
      photoCount: 24
    },
    {
      id: "4",
      title: "Indie Rock Festival",
      date: "2023-11-05", 
      venue: "Red Rocks",
      city: "Denver, CO",
      status: "past" as const,
      photoCount: 18
    },
    {
      id: "5",
      title: "Album Release Party",
      date: "2023-10-15",
      venue: "The Troubadour", 
      city: "Los Angeles, CA",
      status: "past" as const,
      photoCount: 31
    },
  ];

  if (selectedShow) {
    const show = [...upcomingShows, ...pastShows].find(s => s.id === selectedShow);
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