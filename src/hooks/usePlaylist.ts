import { useState } from "react";

export interface PlaylistTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  reason: string;
}

// Shared playlist data that matches the Brand Nubian curated playlist
const initialPlaylist: PlaylistTrack[] = [
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

export const usePlaylist = () => {
  const [playlist, setPlaylist] = useState<PlaylistTrack[]>(initialPlaylist);

  const updateTrack = (id: string, updatedTrack: Partial<PlaylistTrack>) => {
    setPlaylist(prev => 
      prev.map(track => 
        track.id === id ? { ...track, ...updatedTrack } : track
      )
    );
  };

  const addTrack = (track: PlaylistTrack) => {
    setPlaylist(prev => [...prev, track]);
  };

  const removeTrack = (id: string) => {
    setPlaylist(prev => prev.filter(track => track.id !== id));
  };

  const reorderTracks = (fromIndex: number, toIndex: number) => {
    setPlaylist(prev => {
      const newPlaylist = [...prev];
      const [movedTrack] = newPlaylist.splice(fromIndex, 1);
      newPlaylist.splice(toIndex, 0, movedTrack);
      return newPlaylist;
    });
  };

  return {
    playlist,
    updateTrack,
    addTrack,
    removeTrack,
    reorderTracks
  };
};