"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DOMPurify from 'dompurify';
import {
  Search,
  Upload,
  Download,
  Copy,
  Palette,
  Grid,
  List,
  Star,
  Loader2,
  Check,
  FileCode,
} from "lucide-react";
import { toast } from "sonner";

interface Icon {
  id: string;
  name: string;
  category: string;
  tags: string[];
  svg: string;
  selected?: boolean;
}

// Sanitize SVG content to prevent XSS
const sanitizeSvg = (svgContent: string): string => {
  return DOMPurify.sanitize(svgContent, {
    ALLOWED_TAGS: ['svg', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'g', 'defs', 'linearGradient', 'radialGradient', 'stop'],
    ALLOWED_ATTR: ['d', 'cx', 'cy', 'r', 'x', 'y', 'width', 'height', 'x1', 'y1', 'x2', 'y2', 'points', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'viewBox', 'xmlns', 'transform', 'id', 'class']
  });
};

const categories = [
  { name: 'All', slug: 'all' },
  { name: 'General', slug: 'general' },
  { name: 'UI/UX', slug: 'ui-ux' },
  { name: 'Social Media', slug: 'social' },
  { name: 'Technology', slug: 'tech' },
  { name: 'Business', slug: 'business' },
];

export default function IconLibraryClient() {
  const [icons, setIcons] = useState<Icon[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedIcons, setSelectedIcons] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(false);
  const [customColor, setCustomColor] = useState("#000000");
  const [iconSize, setIconSize] = useState("24");

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/tools/icon-library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'search',
          query: searchQuery,
          category: selectedCategory !== 'all' ? selectedCategory : undefined
        })
      });

      const data = await response.json();
      if (data.success) {
        setIcons(data.results);
        toast.success(`Found ${data.results.length} icons`);
      } else {
        toast.error(data.error || 'Search failed');
      }
    } catch (error) {
      console.error('Error searching icons:', error);
      toast.error('Failed to search icons');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach(file => {
      if (file.name.endsWith('.svg')) {
        formData.append('files', file);
      }
    });

    setIsLoading(true);
    try {
      const response = await fetch('/api/tools/icon-library', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setIcons(prev => [...prev, ...data.icons]);
        toast.success(`Uploaded ${data.icons.length} icons successfully`);
      } else {
        toast.error(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading icons:', error);
      toast.error('Failed to upload icons');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleIconSelection = (iconId: string) => {
    setSelectedIcons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(iconId)) {
        newSet.delete(iconId);
      } else {
        newSet.add(iconId);
      }
      return newSet;
    });
  };

  const handleExport = async (format: string) => {
    if (selectedIcons.size === 0) {
      toast.error('Please select at least one icon');
      return;
    }

    const iconsToExport = icons.filter(icon => selectedIcons.has(icon.id));
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/tools/icon-library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'export',
          icons: iconsToExport,
          format
        })
      });

      const data = await response.json();
      if (data.success) {
        // Download as ZIP or individual files
        toast.success(`Exported ${iconsToExport.length} icons as ${format.toUpperCase()}`);
      } else {
        toast.error(data.error || 'Export failed');
      }
    } catch (error) {
      console.error('Error exporting icons:', error);
      toast.error('Failed to export icons');
    } finally {
      setIsLoading(false);
    }
  };

  const copyIconSVG = (svg: string) => {
    navigator.clipboard.writeText(svg);
    toast.success('SVG copied to clipboard');
  };

  return (
    <div className="space-y-6">
      {/* Search and Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Icon Search & Upload</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Icons</Label>
              <div className="flex gap-2">
                <Input
                  id="search"
                  placeholder="Search by name or tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => document.getElementById('icon-upload')?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Upload SVG Icons
            </Button>
            <input
              id="icon-upload"
              type="file"
              accept=".svg"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {selectedIcons.size > 0 && (
              <Badge variant="secondary">
                {selectedIcons.size} selected
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Customization */}
      <Card>
        <CardHeader>
          <CardTitle>Icon Customization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="color">Color</Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="size">Size (px)</Label>
              <Select value={iconSize} onValueChange={setIconSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="16">16px</SelectItem>
                  <SelectItem value="24">24px</SelectItem>
                  <SelectItem value="32">32px</SelectItem>
                  <SelectItem value="48">48px</SelectItem>
                  <SelectItem value="64">64px</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <Label>Export Format</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport('svg')}
                  disabled={selectedIcons.size === 0 || isLoading}
                >
                  SVG
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport('react')}
                  disabled={selectedIcons.size === 0 || isLoading}
                >
                  React
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport('vue')}
                  disabled={selectedIcons.size === 0 || isLoading}
                >
                  Vue
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport('png')}
                  disabled={selectedIcons.size === 0 || isLoading}
                >
                  PNG
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Icon Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Icons ({icons.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {icons.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No icons found. Search or upload icons to get started.</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {icons.map((icon) => (
                <button
                  key={icon.id}
                  onClick={() => toggleIconSelection(icon.id)}
                  className={`
                    relative p-4 border rounded-lg hover:bg-accent transition-colors
                    ${selectedIcons.has(icon.id) ? 'border-primary bg-primary/10' : ''}
                  `}
                >
                  {selectedIcons.has(icon.id) && (
                    <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                  <div 
                    className="w-full h-16 flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: sanitizeSvg(icon.svg) }}
                    style={{ color: customColor }}
                  />
                  <p className="text-xs mt-2 truncate">{icon.name}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {icons.map((icon) => (
                <div
                  key={icon.id}
                  className={`
                    flex items-center gap-4 p-3 border rounded-lg hover:bg-accent transition-colors
                    ${selectedIcons.has(icon.id) ? 'border-primary bg-primary/10' : ''}
                  `}
                >
                  <button
                    onClick={() => toggleIconSelection(icon.id)}
                    className="flex-shrink-0"
                  >
                    <div className={`
                      w-5 h-5 border-2 rounded flex items-center justify-center
                      ${selectedIcons.has(icon.id) ? 'border-primary bg-primary' : 'border-muted'}
                    `}>
                      {selectedIcons.has(icon.id) && (
                        <Check className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>
                  </button>
                  
                  <div 
                    className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                    dangerouslySetInnerHTML={{ __html: sanitizeSvg(icon.svg) }}
                    style={{ color: customColor }}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{icon.name}</p>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {icon.category}
                      </Badge>
                      {icon.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyIconSVG(icon.svg)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
