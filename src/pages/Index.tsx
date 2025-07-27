import { useState } from "react";
import { ThemeProvider } from "next-themes";
import { DashboardHeader } from "@/components/Layout/DashboardHeader";
import { ArtistDashboard } from "@/components/Artist/ArtistDashboard";
import { ToursPage } from "@/components/Tours/ToursPage";
import { BrandNubianPage } from "@/components/Artist/BrandNubianPage";

const Index = () => {
  const [currentView, setCurrentView] = useState<'fan' | 'artist' | 'tours' | 'shop'>('fan');
  const artistName = "The Artist"; // This would come from your data


  const renderContent = () => {
    switch (currentView) {
      case 'fan':
        return <BrandNubianPage onBack={() => setCurrentView('fan')} />;
      case 'artist':
        return <ArtistDashboard />;
      case 'tours':
        return <ToursPage onBack={() => setCurrentView('fan')} />;
      case 'shop':
        return (
          <div className="container mx-auto px-6 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Merchandise Shop</h1>
              <p className="text-muted-foreground mb-8">Coming soon...</p>
              <button 
                onClick={() => setCurrentView('fan')}
                className="text-accent hover:underline"
              >
                ← Back to home
              </button>
            </div>
          </div>
        );
      default:
        return <BrandNubianPage onBack={() => setCurrentView('fan')} />;
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-background">
        {currentView !== 'fan' && (
          <DashboardHeader 
            artistName={artistName} 
            isArtistView={currentView === 'artist'} 
          />
        )}
        
        {renderContent()}
        
        {/* Navigation buttons - moved to top right */}
        <div className="fixed top-4 right-4 space-y-2 z-50">
          <button
            onClick={() => setCurrentView('fan')}
            className={`block w-full px-4 py-2 rounded text-sm font-medium transition-all ${currentView === 'fan' ? 'bg-accent text-accent-foreground shadow-lg' : 'bg-black/60 backdrop-blur-md border border-white/40 text-white hover:bg-black/80'}`}
          >
            Fan View
          </button>
          <button
            onClick={() => setCurrentView('artist')}
            className={`block w-full px-4 py-2 rounded text-sm font-medium transition-all ${currentView === 'artist' ? 'bg-accent text-accent-foreground shadow-lg' : 'bg-black/60 backdrop-blur-md border border-white/40 text-white hover:bg-black/80'}`}
          >
            Artist View
          </button>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
