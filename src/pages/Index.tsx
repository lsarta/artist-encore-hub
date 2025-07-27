import { useState } from "react";
import { ThemeProvider } from "next-themes";
import { DashboardHeader } from "@/components/Layout/DashboardHeader";
import { FanLanding } from "@/components/Fan/FanLanding";
import { ArtistDashboard } from "@/components/Artist/ArtistDashboard";
import { ToursPage } from "@/components/Tours/ToursPage";
import { BrandNubianPage } from "@/components/Artist/BrandNubianPage";

const Index = () => {
  const [currentView, setCurrentView] = useState<'fan' | 'artist' | 'tours' | 'shop' | 'brand-nubian'>('fan');
  const artistName = "The Artist"; // This would come from your data

  const handleFanNavigation = (page: 'tours' | 'shop') => {
    setCurrentView(page);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'fan':
        return <FanLanding artistName={artistName} onNavigate={handleFanNavigation} />;
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
      case 'brand-nubian':
        return <BrandNubianPage onBack={() => setCurrentView('artist')} />;
      default:
        return <FanLanding artistName={artistName} onNavigate={handleFanNavigation} />;
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
        
        {/* Demo toggle for development */}
        <div className="fixed bottom-4 right-4 space-x-2">
          <button
            onClick={() => setCurrentView('fan')}
            className={`px-3 py-1 rounded text-sm ${currentView === 'fan' ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}
          >
            Fan View
          </button>
          <button
            onClick={() => setCurrentView('artist')}
            className={`px-3 py-1 rounded text-sm ${currentView === 'artist' ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}
          >
            Artist View
          </button>
          <button
            onClick={() => setCurrentView('brand-nubian')}
            className={`px-3 py-1 rounded text-sm ${currentView === 'brand-nubian' ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}
          >
            Brand Nubian
          </button>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
