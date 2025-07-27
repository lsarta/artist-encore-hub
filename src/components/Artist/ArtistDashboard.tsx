import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, ShoppingBag, Camera, BarChart3, Plus } from "lucide-react";

export const ArtistDashboard = () => {
  const quickStats = [
    { title: "Upcoming Shows", value: "12", icon: Calendar, color: "text-accent" },
    { title: "Total Fans", value: "24.5K", icon: Users, color: "text-accent" },
    { title: "Merch Sales", value: "$12.8K", icon: ShoppingBag, color: "text-accent" },
    { title: "Photo Uploads", value: "156", icon: Camera, color: "text-accent" },
  ];

  const quickActions = [
    { title: "Add Tour Date", icon: Calendar, description: "Schedule a new show" },
    { title: "Upload Photos", icon: Camera, description: "Share new gallery content" },
    { title: "Add Merchandise", icon: ShoppingBag, description: "Create new product" },
    { title: "View Analytics", icon: BarChart3, description: "Check performance metrics" },
  ];

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome back!</h2>
        <p className="text-muted-foreground">Here's what's happening with your artist profile.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index} className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-2xl bg-accent/10`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="ghost"
                className="h-auto p-6 flex flex-col items-center space-y-3 hover:bg-accent/10"
              >
                <action.icon className="w-8 h-8 text-accent" />
                <div className="text-center">
                  <p className="font-medium">{action.title}</p>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">Show #{index + 1}</p>
                  <p className="text-sm text-muted-foreground">Jan {15 + index}, 2024</p>
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              "New merchandise order received",
              "Fan uploaded photo from latest show",
              "Tour date added for March 2024"
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <p className="text-sm">{activity}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};