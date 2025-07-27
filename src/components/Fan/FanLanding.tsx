import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, ShoppingBag, Music } from "lucide-react";
interface FanLandingProps {
  artistName: string;
  onNavigate: (page: 'tours' | 'shop') => void;
}
export const FanLanding = ({
  artistName,
  onNavigate
}: FanLandingProps) => {
  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-accent/20 to-primary/20 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl font-bold text-primary">{artistName.charAt(0)}</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-foreground mb-4">
              Brand Nubian
            </h1>
            
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="p-8 hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 bg-card/50 backdrop-blur-sm" onClick={() => onNavigate('tours')}>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <Calendar className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Tours</h3>
              <p className="text-muted-foreground">
                View shows, photos, and tour moments
              </p>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 bg-card/50 backdrop-blur-sm">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <Music className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Playlist</h3>
              <p className="text-muted-foreground">
                Discover curated music recommendations
              </p>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 bg-card/50 backdrop-blur-sm" onClick={() => onNavigate('shop')}>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <ShoppingBag className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Shop</h3>
              <p className="text-muted-foreground">
                Get official merchandise and gear
              </p>
            </div>
          </Card>
        </div>

        {/* Quick Access */}
        <div className="text-center mt-16">
          <Button variant="outline" size="lg" className="mx-2">
            Artist Login
          </Button>
        </div>
      </div>
    </div>;
};