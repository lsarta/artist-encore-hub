import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Camera, Plus, Heart, MessageCircle } from "lucide-react";
import { ShowCard } from "./ShowCard";
import { ShowGalleryV2 } from "./ShowGalleryV2";
import { useTours } from "@/hooks/useTours";

interface ToursPageProps {
  onBack: () => void;
}

export const ToursPage = ({ onBack }: ToursPageProps) => {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <button 
          onClick={onBack}
          className="text-accent hover:underline mb-4 flex items-center gap-2"
        >
          ← Back to home
        </button>
      </div>

      <ShowGalleryV2 />
    </div>
  );
};