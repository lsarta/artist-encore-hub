import { useState, useEffect } from "react";

export interface Tour {
  id: string;
  title: string;
  subtitle?: string;
  date: string;
  time?: string;
  venue: string;
  city: string;
  status: 'upcoming' | 'past';
  photoCount: number;
}

const initialTours: Tour[] = [
  {
    id: "1",
    title: "Outside LLMs Music & AI Buildathon",
    subtitle: "Outside LLMs",
    date: "2025-07-27",
    time: "2:00 PM - 8:00 PM",
    venue: "Edge & Node House of Web3",
    city: "San Francisco, California",
    status: "upcoming",
    photoCount: 0
  },
  {
    id: "2",
    title: "Brand Nubian Live",
    date: "2024-12-15",
    venue: "Madison Square Garden",
    city: "New York, NY",
    status: "upcoming",
    photoCount: 0
  },
  {
    id: "3", 
    title: "Summer Festival 2024",
    date: "2024-08-15",
    venue: "Central Park",
    city: "New York, NY",
    status: "upcoming",
    photoCount: 0
  },
  {
    id: "4",
    title: "Acoustic Night",
    date: "2024-09-22",
    venue: "The Blue Note",
    city: "Nashville, TN", 
    status: "upcoming",
    photoCount: 0
  },
  {
    id: "5",
    title: "Winter Tour 2023",
    date: "2023-12-10",
    venue: "Madison Square Garden",
    city: "New York, NY",
    status: "past",
    photoCount: 24
  },
  {
    id: "6",
    title: "Indie Rock Festival",
    date: "2023-11-05", 
    venue: "Red Rocks",
    city: "Denver, CO",
    status: "past",
    photoCount: 18
  },
  {
    id: "7",
    title: "Album Release Party",
    date: "2023-10-15",
    venue: "The Troubadour", 
    city: "Los Angeles, CA",
    status: "past",
    photoCount: 31
  },
];

export const useTours = () => {
  const [tours, setTours] = useState<Tour[]>(() => {
    // Load from localStorage if available, otherwise use initial tours
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tours');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (error) {
          console.error('Error parsing saved tours:', error);
        }
      }
    }
    return initialTours;
  });

  // Save tours to localStorage whenever tours change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tours', JSON.stringify(tours));
    }
  }, [tours]);

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