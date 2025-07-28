import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";

interface DashboardHeaderProps {
  artistName?: string;
  isArtistView?: boolean;
}

export const DashboardHeader = ({ artistName, isArtistView = false }: DashboardHeaderProps) => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {isArtistView ? "Dashboard" : artistName || "Artist"}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};