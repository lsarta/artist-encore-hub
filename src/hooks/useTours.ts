import { useState } from "react";

export interface Tour {
  id: string;
  title: string;
  date: string;
  venue: string;
  city: string;
  status: 'upcoming' | 'past';
  photoCount: number;
}

const initialTours: Tour[] = [
  {
    id: "1",
    title: "Brand Nubian Live",
    date: "2024-12-15",
    venue: "Madison Square Garden",
    city: "New York, NY",
    status: "upcoming",
    photoCount: 0
  },
  {
    id: "2",
    title: "Outside LLMs Music & AI Buildathon",
    date: "2025-07-27",
    venue: "Edge & Node House of Web3",
    city: "San Francisco, California",
    status: "upcoming",
    photoCount: 0
  },
  {
    id: "3", 
    title: "Acoustic Night",
    date: "2024-09-22",
    venue: "The Blue Note",
    city: "Nashville, TN", 
    status: "upcoming",
    photoCount: 0
  },
  {
    id: "4",
    title: "Winter Tour 2023",
    date: "2023-12-10",
    venue: "Madison Square Garden",
    city: "New York, NY",
    status: "past",
    photoCount: 24
  },
  {
    id: "5",
    title: "Indie Rock Festival",
    date: "2023-11-05", 
    venue: "Red Rocks",
    city: "Denver, CO",
    status: "past",
    photoCount: 18
  },
  {
    id: "6",
    title: "Album Release Party",
    date: "2023-10-15",
    venue: "The Troubadour", 
    city: "Los Angeles, CA",
    status: "past",
    photoCount: 31
  },
];

export const useTours = () => {
  const [tours, setTours] = useState<Tour[]>(initialTours);

  const addTour = (tour: Omit<Tour, 'id' | 'photoCount' | 'status'>) => {
    const newTour: Tour = {
      ...tour,
      id: Date.now().toString(),
      photoCount: 0,
      status: new Date(tour.date) > new Date() ? 'upcoming' : 'past'
    };
    setTours(prev => [...prev, newTour]);
  };

  const updateTour = (id: string, updatedTour: Partial<Tour>) => {
    setTours(prev => 
      prev.map(tour => 
        tour.id === id ? { 
          ...tour, 
          ...updatedTour,
          status: updatedTour.date ? 
            (new Date(updatedTour.date) > new Date() ? 'upcoming' : 'past') :
            tour.status
        } : tour
      )
    );
  };

  const deleteTour = (id: string) => {
    setTours(prev => prev.filter(tour => tour.id !== id));
  };

  const getTourById = (id: string) => {
    return tours.find(tour => tour.id === id);
  };

  const upcomingTours = tours.filter(tour => tour.status === 'upcoming');
  const pastTours = tours.filter(tour => tour.status === 'past');

  return {
    tours,
    upcomingTours,
    pastTours,
    addTour,
    updateTour,
    deleteTour,
    getTourById
  };
};