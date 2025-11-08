'use client';

import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Link,
  MousePointer,
  Eye,
  BarChart3,
  MessageSquare,
  Share,
  Download,
  Upload,
  Plus,
  Trash2,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Zap
} from 'lucide-react';
import { useToast } from '@/components/ui/toaster';

interface Screen {
  id: string;
  name: string;
  imageUrl?: string;
  description?: string;
  hotspots: Hotspot[];
}

interface Hotspot {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  targetScreenId: string;
  action: 'navigate' | 'modal' | 'tooltip' | 'feedback';
  label?: string;
  feedbackQuestion?: string;
}

interface Prototype {
  id: string;
  name: string;
  description?: string;
  screens: Screen[];
  startScreenId: string;
  analytics: {
    views: number;
    clicks: number;
    completions: number;
    feedback: any[];
  };
}

interface FeedbackResponse {
  id: string;
  hotspotId: string;
  screenId: string;
  response: string;
  timestamp: Date;
  userId?: string;
}

export default function PrototypeLinkerClient() {
  const [activeTab, setActiveTab] = useState<'builder' | 'preview' | 'analytics'>('builder');
  const [currentPrototype, setCurrentPrototype] = useState<Prototype>({
    id: '1',
    name: 'New Prototype',
    screens: [],
    startScreenId: '',
    analytics: {
      views: 0,
      clicks: 0,
      completions: 0,
      feedback: [],
    },
  });
  const [selectedScreen, setSelectedScreen] = useState<Screen | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [currentPreviewScreen, setCurrentPreviewScreen] = useState<Screen | null>(null);
  const [feedbackResponses, setFeedbackResponses] = useState<FeedbackResponse[]>([]);
  const [isCreatingHotspot, setIsCreatingHotspot] = useState(false);
  const [hotspotStart, setHotspotStart] = useState<{ x: number; y: number } | null>(null);
  const [prototypesList, setPrototypesList] = useState<any[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Handle file upload for screens
  const handleScreenUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    // mark action so server can detect upload intent
    formData.append('action', 'upload-screens');
    // attach prototype id when available so server can associate uploads
    if (currentPrototype?.id) formData.append('prototypeId', currentPrototype.id);
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('/api/tools/prototype-linker', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success && data.screens) {
        const newScreens: Screen[] = data.screens.map((screenData: any) => ({
          id: screenData.id || Math.random().toString(36).substr(2, 9),
          name: screenData.name,
          imageUrl: screenData.imageUrl,
          hotspots: []
        }));

        setCurrentPrototype(prev => ({
          ...prev,
          screens: [...prev.screens, ...newScreens],
          startScreenId: prev.startScreenId || newScreens[0]?.id || '',
        }));

        toast({
          title: "Screens uploaded",
          description: `${newScreens.length} screen(s) added to your prototype`,
        });
      }
    } catch (error) {
      console.error('Error uploading screens:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload screen images",
        variant: "destructive",
      });
    }
  };

  // Save/create prototype on server
  const savePrototype = useCallback(async () => {
    try {
      const resp = await fetch('/api/tools/prototype-linker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', prototype: { name: currentPrototype.name, description: currentPrototype.description } })
      });

      const data = await resp.json();
      if (data.success && data.prototype) {
        setCurrentPrototype(prev => ({ ...prev, id: data.prototype.id, url: data.prototype.url } as any));
        toast({ title: 'Prototype saved', description: 'Prototype created on server' });
      }
    } catch (err) {
      console.error(err);
      toast({ title: 'Save failed', description: 'Could not save prototype', variant: 'destructive' });
    }
  }, [currentPrototype.name, currentPrototype.description, toast]);

  // List prototypes from server
  const fetchPrototypes = useCallback(async () => {
    try {
      const resp = await fetch('/api/tools/prototype-linker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'list' })
      })

      const data = await resp.json()
      if (data.success) {
        setPrototypesList(data.prototypes || [])
        toast({ title: 'Prototypes loaded', description: `${(data.prototypes || []).length} prototype(s) found` })
      }
    } catch (err) {
      console.error(err)
      toast({ title: 'Failed', description: 'Could not load prototypes', variant: 'destructive' })
    }
  }, [toast])

  // Load prototype into editor
  const loadPrototype = useCallback(async (id: string) => {
    try {
      const resp = await fetch('/api/tools/prototype-linker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get-prototype', prototypeId: id })
      })

      const data = await resp.json()
      if (data.success && data.prototype) {
        setCurrentPrototype(data.prototype)
        setSelectedScreen(null)
        toast({ title: 'Prototype loaded', description: data.prototype.name })
      } else {
        toast({ title: 'Load failed', description: 'Prototype not found', variant: 'destructive' })
      }
    } catch (err) {
      console.error(err)
      toast({ title: 'Load failed', description: 'Could not load prototype', variant: 'destructive' })
    }
  }, [toast])

  // Delete prototype
  const deletePrototype = useCallback(async (id: string) => {
    try {
      const resp = await fetch('/api/tools/prototype-linker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', prototypeId: id })
      })

      const data = await resp.json()
      if (data.success) {
        setPrototypesList(prev => prev.filter(p => p.id !== id))
        if (currentPrototype?.id === id) {
          setCurrentPrototype({ id: '1', name: 'New Prototype', screens: [], startScreenId: '', analytics: { views: 0, clicks: 0, completions: 0, feedback: [] } } as any)
          setSelectedScreen(null)
        }
        toast({ title: 'Deleted', description: 'Prototype deleted' })
      } else {
        toast({ title: 'Delete failed', description: data.message || 'Could not delete', variant: 'destructive' })
      }
    } catch (err) {
      console.error(err)
      toast({ title: 'Delete failed', description: 'Could not delete prototype', variant: 'destructive' })
    }
  }, [currentPrototype, toast])

  // Add new screen
  const addScreen = useCallback(() => {
    const newScreen: Screen = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Screen ${currentPrototype.screens.length + 1}`,
      hotspots: [],
    };

    setCurrentPrototype(prev => ({
      ...prev,
      screens: [...prev.screens, newScreen],
      startScreenId: prev.startScreenId || newScreen.id,
    }));

    // Auto-select the newly added screen for editing
    setSelectedScreen(newScreen);

    toast({
      title: "Screen added",
      description: "New screen added to your prototype",
    });
  }, [currentPrototype.screens.length, toast]);

  // Remove screen
  const removeScreen = useCallback((screenId: string) => {
    setCurrentPrototype(prev => ({
      ...prev,
      screens: prev.screens.filter(s => s.id !== screenId),
      startScreenId: prev.startScreenId === screenId ? (prev.screens.find(s => s.id !== screenId)?.id || '') : prev.startScreenId,
    }));

    if (selectedScreen?.id === screenId) {
      setSelectedScreen(null);
    }

    toast({
      title: "Screen removed",
      description: "Screen removed from your prototype",
    });
  }, [selectedScreen, toast]);

  // Update screen
  const updateScreen = useCallback((screenId: string, updates: Partial<Screen>) => {
    setCurrentPrototype(prev => ({
      ...prev,
      screens: prev.screens.map(screen =>
        screen.id === screenId ? { ...screen, ...updates } : screen
      ),
    }));

    // Also update the selectedScreen state if it's the same screen
    if (selectedScreen?.id === screenId) {
      setSelectedScreen(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [selectedScreen]);

  // Add hotspot
  const addHotspot = useCallback((screenId: string, hotspot: Omit<Hotspot, 'id'>) => {
    const newHotspot: Hotspot = {
      id: Math.random().toString(36).substr(2, 9),
      ...hotspot,
    };

    const updatedHotspots = [...(currentPrototype.screens.find(s => s.id === screenId)?.hotspots || []), newHotspot];

    setCurrentPrototype(prev => ({
      ...prev,
      screens: prev.screens.map(screen =>
        screen.id === screenId ? { ...screen, hotspots: updatedHotspots } : screen
      ),
    }));

    // Update selectedScreen if it's the same screen
    if (selectedScreen?.id === screenId) {
      setSelectedScreen(prev => prev ? { ...prev, hotspots: updatedHotspots } : null);
    }

    toast({
      title: "Hotspot added",
      description: "Clickable area added to screen",
    });
  }, [currentPrototype.screens, selectedScreen, toast]);

  // Remove hotspot
  const removeHotspot = useCallback((screenId: string, hotspotId: string) => {
    const screen = currentPrototype.screens.find(s => s.id === screenId);
    if (screen) {
      const updatedHotspots = screen.hotspots.filter(h => h.id !== hotspotId);

      setCurrentPrototype(prev => ({
        ...prev,
        screens: prev.screens.map(s =>
          s.id === screenId ? { ...s, hotspots: updatedHotspots } : s
        ),
      }));

      // Update selectedScreen if it's the same screen
      if (selectedScreen?.id === screenId) {
        setSelectedScreen(prev => prev ? { ...prev, hotspots: updatedHotspots } : null);
      }
    }

    toast({
      title: "Hotspot removed",
      description: "Clickable area removed from screen",
    });
  }, [currentPrototype.screens, selectedScreen, toast]);

  // Handle canvas click for hotspot creation
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isCreatingHotspot || !selectedScreen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (!hotspotStart) {
      setHotspotStart({ x, y });
    } else {
      const width = Math.abs(x - hotspotStart.x);
      const height = Math.abs(y - hotspotStart.y);
      const startX = Math.min(x, hotspotStart.x);
      const startY = Math.min(y, hotspotStart.y);

      addHotspot(selectedScreen.id, {
        x: startX,
        y: startY,
        width,
        height,
        targetScreenId: '',
        action: 'navigate',
        label: `Hotspot ${selectedScreen.hotspots.length + 1}`,
      });

      setHotspotStart(null);
      setIsCreatingHotspot(false);
    }
  }, [isCreatingHotspot, selectedScreen, hotspotStart, addHotspot]);

  // Start preview
  const startPreview = useCallback(() => {
    if (currentPrototype.screens.length === 0) {
      toast({
        title: "No screens",
        description: "Add at least one screen to preview your prototype",
        variant: "destructive",
      });
      return;
    }

    const startScreen = currentPrototype.screens.find(s => s.id === currentPrototype.startScreenId);
    if (!startScreen) {
      toast({
        title: "No start screen",
        description: "Set a start screen for your prototype",
        variant: "destructive",
      });
      return;
    }

    setCurrentPreviewScreen(startScreen);
    setIsPreviewMode(true);
    setActiveTab('preview');

    // Increment view count
    setCurrentPrototype(prev => ({
      ...prev,
      analytics: {
        ...prev.analytics,
        views: prev.analytics.views + 1,
      },
    }));
  }, [currentPrototype, toast]);

  // Handle hotspot click in preview
  const handleHotspotClick = useCallback((hotspot: Hotspot) => {
    // Increment click count
    setCurrentPrototype(prev => ({
      ...prev,
      analytics: {
        ...prev.analytics,
        clicks: prev.analytics.clicks + 1,
      },
    }));

    if (hotspot.action === 'navigate') {
      const targetScreen = currentPrototype.screens.find(s => s.id === hotspot.targetScreenId);
      if (targetScreen) {
        setCurrentPreviewScreen(targetScreen);
      }
    } else if (hotspot.action === 'feedback') {
      // Show feedback modal
      const response = prompt(hotspot.feedbackQuestion || 'Please provide feedback:');
      if (response) {
        const feedbackResponse: FeedbackResponse = {
          id: Math.random().toString(36).substr(2, 9),
          hotspotId: hotspot.id,
          screenId: currentPreviewScreen?.id || '',
          response,
          timestamp: new Date(),
        };

        setFeedbackResponses(prev => [...prev, feedbackResponse]);

        setCurrentPrototype(prev => ({
          ...prev,
          analytics: {
            ...prev.analytics,
            feedback: [...prev.analytics.feedback, feedbackResponse],
          },
        }));

        toast({
          title: "Feedback submitted",
          description: "Thank you for your feedback!",
        });
      }
    }
  }, [currentPrototype.screens, currentPreviewScreen, toast]);

  // Export prototype
  const exportPrototype = useCallback(() => {
    // If prototype exists on server, call server export to get a download URL
    (async () => {
      if (currentPrototype?.id) {
        try {
          const resp = await fetch('/api/tools/prototype-linker', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'export', prototypeId: currentPrototype.id, format: 'html' })
          });

          const data = await resp.json();
          if (data.success && data.data?.downloadUrl) {
            // open/download the provided URL
            const downloadUrl = data.data.downloadUrl;
            window.open(downloadUrl, '_blank');
            toast({ title: 'Export started', description: 'Export prepared on server' });
            return;
          }
        } catch (err) {
          console.error('Export error', err);
        }
      }

      // Fallback: client-side JSON export
      const exportData = {
        ...currentPrototype,
        exportedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentPrototype.name.toLowerCase().replace(/\s+/g, '-')}-prototype.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Prototype exported",
        description: "Prototype configuration exported successfully",
      });
    })();
  }, [currentPrototype, toast]);

  // Generate shareable link
  const generateShareableLink = useCallback(() => {
    (async () => {
      try {
        const resp = await fetch('/api/tools/prototype-linker', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'generate-share-link', prototypeId: currentPrototype.id })
        });

        const data = await resp.json();
        if (data.success && data.shareUrl) {
          await navigator.clipboard.writeText(data.shareUrl);
          toast({ title: 'Share link copied', description: 'Shareable prototype link copied to clipboard' });
          return;
        }
      } catch (err) {
        console.error('Share link error', err);
      }

      // Fallback local link
      const shareId = Math.random().toString(36).substr(2, 9);
      const shareUrl = `${window.location.origin}/prototype/${shareId}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast({ title: 'Share link copied', description: 'Shareable prototype link copied to clipboard' });
      });
    })();
  }, [toast]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Prototype Linker</h1>
        <p className="text-muted-foreground">
          Create interactive prototypes with clickable elements and user feedback
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="builder">Builder</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Controls */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Prototype Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Prototype Name</Label>
                  <Input
                    value={currentPrototype.name}
                    onChange={(e) => setCurrentPrototype(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Start Screen</Label>
                  <Select
                    value={currentPrototype.startScreenId}
                    onValueChange={(value) => setCurrentPrototype(prev => ({ ...prev, startScreenId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select start screen" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentPrototype.screens.map(screen => (
                        <SelectItem key={screen.id} value={screen.id}>
                          {screen.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <Button onClick={addScreen} variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Screen
                </Button>

                <Button onClick={savePrototype} variant="secondary" className="w-full">
                  <Zap className="w-4 h-4 mr-2" />
                  Save Prototype
                </Button>

                <Button onClick={startPreview} className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Preview Prototype
                </Button>

                <Separator />

                <div className="space-y-2">
                  <Button onClick={exportPrototype} variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button onClick={generateShareableLink} variant="outline" className="w-full">
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Saved Prototypes</h4>
                    <Button size="sm" variant="ghost" onClick={fetchPrototypes}>
                      <RotateCcw className="w-4 h-4 mr-2" /> Refresh
                    </Button>
                  </div>

                  {prototypesList.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No saved prototypes</div>
                  ) : (
                    <div className="space-y-2">
                      {prototypesList.map(p => (
                        <div key={p.id} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <div className="font-medium text-sm">{p.name}</div>
                            <div className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleString()}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost" onClick={() => loadPrototype(p.id)}>
                              <Link className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => deletePrototype(p.id)} className="text-red-500">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Screen List */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Screens</CardTitle>
              </CardHeader>
              <CardContent>
                {currentPrototype.screens.length === 0 ? (
                  <div className="text-center py-8">
                    <Eye className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No screens yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {currentPrototype.screens.map(screen => (
                      <div
                        key={screen.id}
                        className={`p-3 border rounded cursor-pointer transition-colors ${
                          selectedScreen?.id === screen.id ? 'border-primary bg-primary/5' : 'hover:bg-muted'
                        }`}
                        onClick={() => setSelectedScreen(screen)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{screen.name}</span>
                          <div className="flex items-center gap-1">
                            <Badge variant="secondary" className="text-xs">
                              {screen.hotspots.length}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeScreen(screen.id);
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Screen Editor */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>
                  {selectedScreen ? `Editing: ${selectedScreen.name}` : 'Select a Screen'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedScreen ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Screen Name</Label>
                        <Input
                          value={selectedScreen.name}
                          onChange={(e) => updateScreen(selectedScreen.id, { name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Image URL (Optional)</Label>
                        <Input
                          placeholder="https://example.com/screen.png"
                          value={selectedScreen.imageUrl || ''}
                          onChange={(e) => updateScreen(selectedScreen.id, { imageUrl: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Describe this screen..."
                        value={selectedScreen.description || ''}
                        onChange={(e) => updateScreen(selectedScreen.id, { description: e.target.value })}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Hotspots ({selectedScreen.hotspots.length})</h4>
                        <Button
                          onClick={() => setIsCreatingHotspot(!isCreatingHotspot)}
                          variant={isCreatingHotspot ? "default" : "outline"}
                          size="sm"
                        >
                          <MousePointer className="w-4 h-4 mr-2" />
                          {isCreatingHotspot ? 'Cancel' : 'Add Hotspot'}
                        </Button>
                      </div>

                      {isCreatingHotspot && (
                        <Alert>
                          <MousePointer className="h-4 w-4" />
                          <AlertDescription>
                            Click and drag on the canvas below to create a clickable hotspot.
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="relative border-2 border-dashed border-muted-foreground/25 rounded-lg overflow-hidden">
                        <canvas
                          ref={canvasRef}
                          width={400}
                          height={300}
                          className="w-full h-auto cursor-crosshair"
                          onClick={handleCanvasClick}
                          style={{
                            backgroundImage: selectedScreen.imageUrl ? `url(${selectedScreen.imageUrl})` : undefined,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        />

                        {selectedScreen.hotspots.map(hotspot => (
                          <div
                            key={hotspot.id}
                            className="absolute border-2 border-red-500 bg-red-500/20 hover:bg-red-500/30 cursor-pointer transition-colors group"
                            style={{
                              left: `${hotspot.x}%`,
                              top: `${hotspot.y}%`,
                              width: `${hotspot.width}%`,
                              height: `${hotspot.height}%`,
                            }}
                            onClick={() => {
                              // For now, just show a toast that hotspots can be configured below
                              toast({
                                title: "Edit Hotspot",
                                description: "Configure this hotspot using the controls below",
                              });
                            }}
                          >
                            <div className="absolute -top-6 left-0 bg-red-500 text-white text-xs px-1 rounded flex items-center gap-1">
                              <span>{hotspot.label || `Hotspot ${selectedScreen.hotspots.indexOf(hotspot) + 1}`}</span>
                              <span className="opacity-0 group-hover:opacity-100 transition-opacity">✏️</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {selectedScreen.hotspots.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="font-medium text-sm">Hotspot Configuration</h5>
                          {selectedScreen.hotspots.map(hotspot => (
                            <div key={hotspot.id} className="flex items-center gap-2 p-2 border rounded">
                              <Input
                                placeholder="Label"
                                value={hotspot.label || ''}
                                onChange={(e) => {
                                  const updatedHotspots = selectedScreen.hotspots.map(h =>
                                    h.id === hotspot.id ? { ...h, label: e.target.value } : h
                                  );
                                  updateScreen(selectedScreen.id, { hotspots: updatedHotspots });
                                }}
                                className="flex-1"
                              />
                              <Select
                                value={hotspot.action}
                                onValueChange={(value: Hotspot['action']) => {
                                  const updatedHotspots = selectedScreen.hotspots.map(h =>
                                    h.id === hotspot.id ? { ...h, action: value } : h
                                  );
                                  updateScreen(selectedScreen.id, { hotspots: updatedHotspots });
                                }}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="navigate">Navigate</SelectItem>
                                  <SelectItem value="modal">Modal</SelectItem>
                                  <SelectItem value="tooltip">Tooltip</SelectItem>
                                  <SelectItem value="feedback">Feedback</SelectItem>
                                </SelectContent>
                              </Select>

                              {hotspot.action === 'navigate' && (
                                <Select
                                  value={hotspot.targetScreenId}
                                  onValueChange={(value) => {
                                    const updatedHotspots = selectedScreen.hotspots.map(h =>
                                      h.id === hotspot.id ? { ...h, targetScreenId: value } : h
                                    );
                                    updateScreen(selectedScreen.id, { hotspots: updatedHotspots });
                                  }}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Target" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {currentPrototype.screens
                                      .filter(s => s.id !== selectedScreen.id)
                                      .map(screen => (
                                        <SelectItem key={screen.id} value={screen.id}>
                                          {screen.name}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              )}

                              {hotspot.action === 'feedback' && (
                                <Input
                                  placeholder="Question?"
                                  value={hotspot.feedbackQuestion || ''}
                                  onChange={(e) => {
                                    const updatedHotspots = selectedScreen.hotspots.map(h =>
                                      h.id === hotspot.id ? { ...h, feedbackQuestion: e.target.value } : h
                                    );
                                    updateScreen(selectedScreen.id, { hotspots: updatedHotspots });
                                  }}
                                  className="w-32"
                                />
                              )}

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeHotspot(selectedScreen.id, hotspot.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Eye className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No screen selected</h3>
                    <p className="text-muted-foreground">
                      Select a screen from the list to start editing hotspots and interactions.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          {isPreviewMode && currentPreviewScreen ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Prototype Preview</CardTitle>
                  <div className="flex gap-2">
                    <Button onClick={() => setIsPreviewMode(false)} variant="outline">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Exit Preview
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative mx-auto max-w-md">
                  <div className="bg-gray-100 rounded-lg overflow-hidden shadow-lg">
                    <div
                      className="relative bg-white"
                      style={{
                        backgroundImage: currentPreviewScreen.imageUrl ? `url(${currentPreviewScreen.imageUrl})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        minHeight: '400px',
                      }}
                    >
                      {currentPreviewScreen.hotspots.map(hotspot => (
                        <button
                          key={hotspot.id}
                          className="absolute bg-blue-500/50 hover:bg-blue-500/70 border-2 border-blue-500 rounded cursor-pointer transition-colors"
                          style={{
                            left: `${hotspot.x}%`,
                            top: `${hotspot.y}%`,
                            width: `${hotspot.width}%`,
                            height: `${hotspot.height}%`,
                          }}
                          onClick={() => handleHotspotClick(hotspot)}
                        >
                          <span className="text-xs text-white font-medium">
                            {hotspot.label || 'Click'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      Currently viewing: <strong>{currentPreviewScreen.name}</strong>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12">
              <Play className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Preview not available</h3>
              <p className="text-muted-foreground mb-4">
                Build your prototype first, then click &quot;Preview Prototype&quot; to test interactions.
              </p>
              <Button onClick={() => setActiveTab('builder')}>
                Go to Builder
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{currentPrototype.analytics.views}</div>
                <p className="text-sm text-muted-foreground">Total prototype views</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MousePointer className="w-5 h-5" />
                  Clicks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{currentPrototype.analytics.clicks}</div>
                <p className="text-sm text-muted-foreground">Total hotspot clicks</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{currentPrototype.analytics.feedback.length}</div>
                <p className="text-sm text-muted-foreground">Feedback responses collected</p>
              </CardContent>
            </Card>
          </div>

          {currentPrototype.analytics.feedback.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Feedback Responses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentPrototype.analytics.feedback.map((feedback: any) => (
                    <div key={feedback.id} className="p-4 border rounded">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          Screen: {currentPrototype.screens.find(s => s.id === feedback.screenId)?.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(feedback.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{feedback.response}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}