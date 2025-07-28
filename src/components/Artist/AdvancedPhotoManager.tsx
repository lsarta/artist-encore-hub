import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Camera, 
  Star, 
  Eye, 
  Check, 
  X, 
  Trash2, 
  Clock, 
  AlertCircle,
  Search,
  Filter,
  Download,
  Grid3X3,
  List,
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  Award,
  Settings,
  MoreHorizontal,
  ChevronDown,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  Zap,
  Heart
} from "lucide-react";
import { useTours } from "@/hooks/useTours";
import { usePhotoManager, PhotoSubmission } from "@/hooks/usePhotoManager";
import { useToast } from "@/hooks/use-toast";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";

interface AdvancedPhotoManagerProps {
  onBack: () => void;
}

type ViewMode = 'grid' | 'list' | 'slideshow';
type SortBy = 'recent' | 'oldest' | 'quality' | 'likes' | 'author';
type FilterStatus = 'all' | 'approved' | 'pending' | 'rejected' | 'featured';

export const AdvancedPhotoManager = ({ onBack }: AdvancedPhotoManagerProps) => {
  const { tours } = useTours();
  const {
    photos,
    selectedPhotos,
    setSelectedPhotos,
    getPhotosByShow,
    getApprovedPhotosByShow,
    getPendingPhotos,
    getRejectedPhotos,
    getFeaturedPhotoByShow,
    getShowStats,
    getAllStats,
    approvePhoto,
    rejectPhoto,
    deletePhoto,
    setFeaturedPhoto,
    bulkApprove,
    bulkReject,
    bulkDelete,
    searchPhotos,
    getTopContributors
  } = usePhotoManager();
  
  const { toast } = useToast();
  
  // State management
  const [currentView, setCurrentView] = useState<'overview' | 'show' | 'pending' | 'analytics'>('overview');
  const [selectedShow, setSelectedShow] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoSubmission | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('recent');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBulkActions, setShowBulkActions] = useState(false);

  const stats = getAllStats();
  const pendingPhotos = getPendingPhotos();
  const pastShows = tours.filter(tour => tour.status === 'past');
  const topContributors = getTopContributors();

  // Navigation items for sidebar
  const navigationItems = [
    {
      title: "Show Overview",
      icon: Calendar,
      view: 'overview' as const,
      badge: pastShows.length
    },
    {
      title: "Pending Review",
      icon: Clock,
      view: 'pending' as const,
      badge: pendingPhotos.length,
      urgent: pendingPhotos.length > 0
    },
    {
      title: "Analytics",
      icon: TrendingUp,
      view: 'analytics' as const
    }
  ];

  // Filter and sort photos
  const getFilteredPhotos = (showPhotos: PhotoSubmission[]) => {
    let filtered = showPhotos;

    // Apply status filter
    if (filterStatus !== 'all') {
      if (filterStatus === 'featured') {
        filtered = filtered.filter(p => p.featured);
      } else {
        filtered = filtered.filter(p => p.status === filterStatus);
      }
    }

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        case 'oldest':
          return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
        case 'quality':
          const qualityOrder = { high: 3, medium: 2, low: 1 };
          return qualityOrder[b.quality] - qualityOrder[a.quality];
        case 'likes':
          return b.likes - a.likes;
        case 'author':
          return a.author.localeCompare(b.author);
        default:
          return 0;
      }
    });

    return filtered;
  };

  // Bulk action handlers
  const handleBulkApprove = () => {
    bulkApprove(selectedPhotos);
    setSelectedPhotos([]);
    setShowBulkActions(false);
    toast({
      title: "Photos approved",
      description: `${selectedPhotos.length} photos have been approved.`,
    });
  };

  const handleBulkReject = () => {
    bulkReject(selectedPhotos);
    setSelectedPhotos([]);
    setShowBulkActions(false);
    toast({
      title: "Photos rejected",
      description: `${selectedPhotos.length} photos have been rejected.`,
    });
  };

  const handleBulkDelete = () => {
    bulkDelete(selectedPhotos);
    setSelectedPhotos([]);
    setShowBulkActions(false);
    toast({
      title: "Photos deleted",
      description: `${selectedPhotos.length} photos have been deleted.`,
    });
  };

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotos(prev => 
      prev.includes(photoId) 
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Photo Card Component
  const PhotoCard = ({ photo, showCheckbox = false }: { photo: PhotoSubmission; showCheckbox?: boolean }) => (
    <Card className={`border-0 bg-card/50 backdrop-blur-sm overflow-hidden relative group ${
      selectedPhotos.includes(photo.id) ? 'ring-2 ring-primary' : ''
    }`}>
      {showCheckbox && (
        <div className="absolute top-2 left-2 z-10">
          <Checkbox 
            checked={selectedPhotos.includes(photo.id)}
            onCheckedChange={() => togglePhotoSelection(photo.id)}
            className="bg-background/80 backdrop-blur-sm"
          />
        </div>
      )}
      
      <div className="aspect-square overflow-hidden relative">
        <img 
          src={photo.url} 
          alt={photo.caption}
          className="w-full h-full object-cover cursor-pointer transition-transform group-hover:scale-105"
          onClick={() => setSelectedPhoto(photo)}
        />
        
        {/* Status badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {photo.featured && (
            <Badge className="bg-yellow-500 text-yellow-900">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Featured
            </Badge>
          )}
          <Badge variant={
            photo.status === 'approved' ? 'default' : 
            photo.status === 'pending' ? 'secondary' : 'destructive'
          }>
            {photo.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
            {photo.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
            {photo.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
            {photo.status}
          </Badge>
        </div>

        {/* Quality indicator */}
        <div className="absolute bottom-2 left-2">
          <Badge variant="outline" className={
            photo.quality === 'high' ? 'border-green-500 text-green-500' :
            photo.quality === 'medium' ? 'border-yellow-500 text-yellow-500' :
            'border-red-500 text-red-500'
          }>
            {photo.quality}
          </Badge>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setSelectedPhoto(photo)}>
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>
          {photo.status === 'pending' && (
            <>
              <Button 
                size="sm" 
                onClick={() => {
                  approvePhoto(photo.id);
                  toast({ title: "Photo approved" });
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => {
                  rejectPhoto(photo.id);
                  toast({ title: "Photo rejected" });
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>
      
      <CardContent className="p-3">
        <p className="text-xs mb-2 line-clamp-2">{photo.caption}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>by {photo.author}</span>
          <div className="flex items-center gap-2">
            {photo.likes > 0 && (
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                {photo.likes}
              </span>
            )}
            <span>{formatDateTime(photo.uploadDate)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Sidebar Navigation */}
        <Sidebar className="w-64">
          <div className="p-4 border-b">
            <button 
              onClick={onBack}
              className="text-accent hover:underline flex items-center gap-2 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Photo Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.view}>
                      <SidebarMenuButton 
                        onClick={() => {
                          setCurrentView(item.view);
                          setSelectedShow(null);
                        }}
                        className={currentView === item.view ? "bg-accent text-accent-foreground" : ""}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                        {item.badge !== undefined && (
                          <Badge 
                            variant={item.urgent ? "destructive" : "secondary"} 
                            className="ml-auto"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Show Navigation */}
            {pastShows.length > 0 && (
              <SidebarGroup>
                <SidebarGroupLabel>Past Shows</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {pastShows.slice(0, 5).map((show) => {
                      const showStats = getShowStats(show.id);
                      return (
                        <SidebarMenuItem key={show.id}>
                          <SidebarMenuButton 
                            onClick={() => {
                              setCurrentView('show');
                              setSelectedShow(show.id);
                            }}
                            className={selectedShow === show.id ? "bg-accent text-accent-foreground" : ""}
                          >
                            <Calendar className="w-4 h-4" />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">{show.title}</div>
                              <div className="text-xs text-muted-foreground">{showStats.total} photos</div>
                            </div>
                            {showStats.pending > 0 && (
                              <Badge variant="destructive" className="ml-auto">
                                {showStats.pending}
                              </Badge>
                            )}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}

            {/* Quick Stats */}
            <SidebarGroup>
              <SidebarGroupLabel>Quick Stats</SidebarGroupLabel>
              <SidebarGroupContent className="px-4 py-2">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Photos:</span>
                    <span className="font-medium">{stats.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending:</span>
                    <span className="font-medium text-orange-500">{stats.pending}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Approved:</span>
                    <span className="font-medium text-green-500">{stats.approved}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Featured:</span>
                    <span className="font-medium text-yellow-500">{stats.featured}</span>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          {/* Top Bar */}
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">
                  {currentView === 'overview' && 'Photo Management'}
                  {currentView === 'show' && selectedShow && tours.find(t => t.id === selectedShow)?.title}
                  {currentView === 'pending' && 'Pending Review'}
                  {currentView === 'analytics' && 'Analytics & Insights'}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {currentView === 'overview' && `Managing ${stats.total} photos across ${pastShows.length} shows`}
                  {currentView === 'show' && selectedShow && `${getShowStats(selectedShow).total} photos from this show`}
                  {currentView === 'pending' && `${pendingPhotos.length} photos awaiting review`}
                  {currentView === 'analytics' && 'Photo performance and contributor insights'}
                </p>
              </div>

              {/* Bulk Actions */}
              {selectedPhotos.length > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{selectedPhotos.length} selected</Badge>
                  <Button 
                    size="sm"
                    onClick={handleBulkApprove}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve All
                  </Button>
                  <Button 
                    size="sm"
                    variant="destructive"
                    onClick={handleBulkReject}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject All
                  </Button>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={handleBulkDelete}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete All
                  </Button>
                  <Button 
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedPhotos([])}
                  >
                    Clear Selection
                  </Button>
                </div>
              )}
            </div>

            {/* Filters and Controls */}
            {(currentView === 'show' || currentView === 'pending') && (
              <div className="flex items-center gap-4 mt-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search photos, captions, or authors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as FilterStatus)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Photos</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="featured">Featured</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="quality">Quality</SelectItem>
                    <SelectItem value="likes">Most Liked</SelectItem>
                    <SelectItem value="author">Author Name</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBulkActions(!showBulkActions)}
                >
                  <Checkbox className="w-4 h-4 mr-2" />
                  Select Mode
                </Button>
              </div>
            )}
          </div>

          {/* Content Area */}
          <div className="p-6 overflow-auto h-[calc(100vh-200px)]">
            {/* Show Overview */}
            {currentView === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Photos</p>
                          <p className="text-3xl font-bold">{stats.total}</p>
                        </div>
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                          <p className="text-3xl font-bold text-orange-500">{stats.pending}</p>
                        </div>
                        <Clock className="w-8 h-8 text-orange-500" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Approved</p>
                          <p className="text-3xl font-bold text-green-500">{stats.approved}</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Featured</p>
                          <p className="text-3xl font-bold text-yellow-500">{stats.featured}</p>
                        </div>
                        <Star className="w-8 h-8 text-yellow-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Shows Grid */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Past Shows</h2>
                  <div className="grid gap-6">
                    {pastShows.map((show) => {
                      const showStats = getShowStats(show.id);
                      const featuredPhoto = getFeaturedPhotoByShow(show.id);
                      
                      return (
                        <Card key={show.id} className="border-0 bg-card/50 backdrop-blur-sm">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-6">
                              {/* Featured Photo Preview */}
                              <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                                {featuredPhoto ? (
                                  <img 
                                    src={featuredPhoto.url} 
                                    alt={featuredPhoto.caption}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-muted flex items-center justify-center">
                                    <Camera className="w-8 h-8 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              
                              {/* Show Info */}
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-4">
                                  <div>
                                    <h3 className="text-xl font-semibold mb-2">{show.title}</h3>
                                    <div className="flex items-center gap-4 text-muted-foreground text-sm">
                                      <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {formatDate(show.date)}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {show.venue} • {show.city}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex gap-2">
                                    {showStats.pending > 0 && (
                                      <Badge variant="destructive">
                                        {showStats.pending} pending
                                      </Badge>
                                    )}
                                    <Button 
                                      variant="outline" 
                                      onClick={() => {
                                        setCurrentView('show');
                                        setSelectedShow(show.id);
                                      }}
                                    >
                                      <Camera className="w-4 h-4 mr-2" />
                                      Manage Photos
                                    </Button>
                                  </div>
                                </div>
                                
                                {/* Stats */}
                                <div className="grid grid-cols-4 gap-4">
                                  <div className="text-center p-3 rounded-lg bg-muted/50">
                                    <p className="text-2xl font-bold">{showStats.total}</p>
                                    <p className="text-xs text-muted-foreground">Total</p>
                                  </div>
                                  <div className="text-center p-3 rounded-lg bg-green-500/10">
                                    <p className="text-2xl font-bold text-green-500">{showStats.approved}</p>
                                    <p className="text-xs text-muted-foreground">Approved</p>
                                  </div>
                                  <div className="text-center p-3 rounded-lg bg-orange-500/10">
                                    <p className="text-2xl font-bold text-orange-500">{showStats.pending}</p>
                                    <p className="text-xs text-muted-foreground">Pending</p>
                                  </div>
                                  <div className="text-center p-3 rounded-lg bg-yellow-500/10">
                                    <p className="text-2xl font-bold text-yellow-500">{showStats.featured}</p>
                                    <p className="text-xs text-muted-foreground">Featured</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Individual Show View */}
            {currentView === 'show' && selectedShow && (
              <div className="space-y-6">
                {(() => {
                  const show = tours.find(t => t.id === selectedShow);
                  const showPhotos = getPhotosByShow(selectedShow);
                  const filteredPhotos = getFilteredPhotos(showPhotos);
                  const featuredPhoto = getFeaturedPhotoByShow(selectedShow);
                  
                  return (
                    <>
                      {/* Featured Photo Section */}
                      {featuredPhoto && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Star className="w-5 h-5 text-yellow-500 fill-current" />
                              Featured Photo
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                              <div className="lg:col-span-2">
                                <div className="aspect-video overflow-hidden rounded-lg">
                                  <img 
                                    src={featuredPhoto.url} 
                                    alt={featuredPhoto.caption}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <p className="font-medium mb-2">{featuredPhoto.caption}</p>
                                  <p className="text-sm text-muted-foreground">by {featuredPhoto.author}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Heart className="w-4 h-4" />
                                  <span>{featuredPhoto.likes} likes</span>
                                </div>
                                <Button 
                                  variant="outline" 
                                  onClick={() => {
                                    // Open featured photo selection modal
                                    setSelectedPhoto(featuredPhoto);
                                  }}
                                >
                                  Change Featured Photo
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Photos Grid */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">
                            All Photos ({filteredPhotos.length})
                          </h3>
                          {selectedPhotos.length === 0 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedPhotos(filteredPhotos.map(p => p.id))}
                            >
                              Select All
                            </Button>
                          )}
                        </div>
                        
                        {filteredPhotos.length === 0 ? (
                          <Card>
                            <CardContent className="p-8 text-center">
                              <Camera className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                              <p className="text-muted-foreground">No photos found matching your filters.</p>
                            </CardContent>
                          </Card>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                            {filteredPhotos.map((photo) => (
                              <PhotoCard 
                                key={photo.id} 
                                photo={photo} 
                                showCheckbox={showBulkActions}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* Pending Review */}
            {currentView === 'pending' && (
              <div className="space-y-6">
                {pendingPhotos.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                      <p className="text-muted-foreground">No photos are currently waiting for review.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">
                        Pending Review ({pendingPhotos.length})
                      </h3>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setSelectedPhotos(pendingPhotos.map(p => p.id))}
                          variant="outline"
                          size="sm"
                        >
                          Select All
                        </Button>
                        <Button
                          onClick={() => {
                            bulkApprove(pendingPhotos.map(p => p.id));
                            toast({ title: "All photos approved!" });
                          }}
                          className="bg-green-600 hover:bg-green-700"
                          size="sm"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Approve All
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                      {getFilteredPhotos(pendingPhotos).map((photo) => (
                        <PhotoCard 
                          key={photo.id} 
                          photo={photo} 
                          showCheckbox={showBulkActions}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Analytics */}
            {currentView === 'analytics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Top Contributors */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Top Contributors
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {topContributors.slice(0, 5).map((contributor: any, index) => (
                          <div key={contributor.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-medium">{index + 1}</span>
                              </div>
                              <div>
                                <p className="font-medium">{contributor.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {contributor.approvedCount} approved • {contributor.featuredCount} featured
                                </p>
                              </div>
                            </div>
                            <Badge variant="secondary">{contributor.photoCount} photos</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quality Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Photo Quality
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>High Quality</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-green-500" 
                                style={{ width: `${(stats.highQuality / stats.total) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm">{stats.highQuality}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 pt-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-500">{stats.highQuality}</p>
                            <p className="text-xs text-muted-foreground">High Quality</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-yellow-500">
                              {photos.filter(p => p.quality === 'medium').length}
                            </p>
                            <p className="text-xs text-muted-foreground">Medium Quality</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-red-500">
                              {photos.filter(p => p.quality === 'low').length}
                            </p>
                            <p className="text-xs text-muted-foreground">Low Quality</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {photos
                        .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
                        .slice(0, 10)
                        .map((photo) => (
                          <div key={photo.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                            <div className="w-12 h-12 rounded-lg overflow-hidden">
                              <img 
                                src={photo.url} 
                                alt={photo.caption}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{photo.author} uploaded a photo</p>
                              <p className="text-sm text-muted-foreground">
                                {photo.showTitle} • {formatDateTime(photo.uploadDate)}
                              </p>
                            </div>
                            <Badge variant={
                              photo.status === 'approved' ? 'default' : 
                              photo.status === 'pending' ? 'secondary' : 'destructive'
                            }>
                              {photo.status}
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>

        {/* Photo Detail Modal */}
        {selectedPhoto && (
          <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Photo Details</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="aspect-video overflow-hidden rounded-lg">
                    <img 
                      src={selectedPhoto.url} 
                      alt={selectedPhoto.caption}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Caption</h4>
                    <p className="text-sm">{selectedPhoto.caption}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Author:</span>
                      <p className="font-medium">{selectedPhoto.author}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Show:</span>
                      <p className="font-medium">{selectedPhoto.showTitle}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Upload Date:</span>
                      <p className="font-medium">{formatDateTime(selectedPhoto.uploadDate)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant={
                        selectedPhoto.status === 'approved' ? 'default' : 
                        selectedPhoto.status === 'pending' ? 'secondary' : 'destructive'
                      }>
                        {selectedPhoto.status}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Quality:</span>
                      <Badge variant="outline" className={
                        selectedPhoto.quality === 'high' ? 'border-green-500 text-green-500' :
                        selectedPhoto.quality === 'medium' ? 'border-yellow-500 text-yellow-500' :
                        'border-red-500 text-red-500'
                      }>
                        {selectedPhoto.quality}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Resolution:</span>
                      <p className="font-medium">{selectedPhoto.resolution}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {selectedPhoto.status === 'approved' && !selectedPhoto.featured && (
                      <Button 
                        onClick={() => {
                          setFeaturedPhoto(selectedPhoto.id, selectedPhoto.showId);
                          setSelectedPhoto(null);
                          toast({ title: "Featured photo updated" });
                        }}
                        className="w-full"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Set as Featured
                      </Button>
                    )}
                    
                    {selectedPhoto.status === 'pending' && (
                      <>
                        <Button 
                          onClick={() => {
                            approvePhoto(selectedPhoto.id);
                            setSelectedPhoto(null);
                            toast({ title: "Photo approved" });
                          }}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Approve Photo
                        </Button>
                        <Button 
                          onClick={() => {
                            rejectPhoto(selectedPhoto.id);
                            setSelectedPhoto(null);
                            toast({ title: "Photo rejected" });
                          }}
                          variant="destructive"
                          className="w-full"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Reject Photo
                        </Button>
                      </>
                    )}
                    
                    <Button 
                      onClick={() => {
                        deletePhoto(selectedPhoto.id);
                        setSelectedPhoto(null);
                        toast({ title: "Photo deleted" });
                      }}
                      variant="outline"
                      className="w-full text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Photo
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </SidebarProvider>
  );
};