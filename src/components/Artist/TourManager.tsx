import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTours, Tour } from "@/hooks/useTours";
import { useToast } from "@/hooks/use-toast";

interface TourManagerProps {
  onBack: () => void;
}

interface TourFormData {
  title: string;
  date: string;
  venue: string;
  city: string;
}

export const TourManager = ({ onBack }: TourManagerProps) => {
  const { tours, upcomingTours, pastTours, addTour, updateTour, deleteTour } = useTours();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);

  const form = useForm<TourFormData>({
    defaultValues: {
      title: "",
      date: "",
      venue: "",
      city: "",
    },
  });

  const onSubmit = (data: TourFormData) => {
    if (editingTour) {
      updateTour(editingTour.id, data);
      toast({
        title: "Tour updated",
        description: "Your tour stop has been updated successfully.",
      });
    } else {
      addTour(data);
      toast({
        title: "Tour added",
        description: "New tour stop has been added successfully.",
      });
    }
    
    form.reset();
    setEditingTour(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (tour: Tour) => {
    setEditingTour(tour);
    form.reset({
      title: tour.title,
      date: tour.date,
      venue: tour.venue,
      city: tour.city,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (tour: Tour) => {
    deleteTour(tour.id);
    toast({
      title: "Tour deleted",
      description: "Tour stop has been removed successfully.",
    });
  };

  const handleAddNew = () => {
    setEditingTour(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const TourCard = ({ tour }: { tour: Tour }) => (
    <Card className="border-0 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-xl font-semibold">{tour.title}</h3>
              <Badge variant={tour.status === 'upcoming' ? 'default' : 'secondary'}>
                {tour.status === 'upcoming' ? 'Upcoming' : 'Past Show'}
              </Badge>
            </div>
            
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(tour.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{tour.venue} • {tour.city}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(tour)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(tour)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <button 
          onClick={onBack}
          className="text-accent hover:underline mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Tour Management</h1>
            <p className="text-muted-foreground">Manage your tour dates and venues.</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Tour Stop
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingTour ? "Edit Tour Stop" : "Add New Tour Stop"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Show Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter show title..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="venue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Venue</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter venue name..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter city and state..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end gap-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingTour ? "Update" : "Add"} Tour Stop
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming ({upcomingTours.length})</TabsTrigger>
          <TabsTrigger value="past">Past Shows ({pastTours.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          <div className="grid gap-6">
            {upcomingTours.length === 0 ? (
              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">No upcoming shows scheduled.</p>
                  <Button onClick={handleAddNew} variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Show
                  </Button>
                </CardContent>
              </Card>
            ) : (
              upcomingTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="past" className="space-y-6">
          <div className="grid gap-6">
            {pastTours.length === 0 ? (
              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No past shows recorded.</p>
                </CardContent>
              </Card>
            ) : (
              pastTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};