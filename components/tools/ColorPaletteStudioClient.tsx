'use client';

import { useState, useCallback, useMemo } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Palette,
  Plus,
  Trash2,
  Copy,
  Download,
  Eye,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Shuffle,
  Save,
  Upload
} from 'lucide-react';
import { useToast } from '@/components/ui/toaster';

interface ColorStop {
  id: string;
  hex: string;
  name: string;
  hsl: { h: number; s: number; l: number };
  rgb: { r: number; g: number; b: number };
}

interface Palette {
  id: string;
  name: string;
  colors: ColorStop[];
  createdAt: Date;
}

const PALETTE_PRESETS = {
  'monochrome': ['#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF'],
  'complementary': ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'],
  'triadic': ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF', '#FFD93D', '#FF8B94'],
  'analogous': ['#FF6B6B', '#FF8E53', '#FFBC42', '#FFD23F', '#FF6B9D', '#C06C84'],
  'material': ['#6200EE', '#3700B3', '#03DAC6', '#018786', '#B00020', '#CF6679'],
};

const CONTRAST_THRESHOLDS = {
  normal: 4.5,
  large: 3.0,
};

export default function ColorPaletteStudioClient() {
  const [activeTab, setActiveTab] = useState<'generator' | 'accessibility' | 'export'>('generator');
  const [currentPalette, setCurrentPalette] = useState<ColorStop[]>([]);
  const [savedPalettes, setSavedPalettes] = useState<Palette[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string>('monochrome');
  const [paletteName, setPaletteName] = useState('');
  const [checkAccessibility, setCheckAccessibility] = useState(true);
  const [textSize, setTextSize] = useState<'normal' | 'large'>('normal');

  const { toast } = useToast();

  // Generate random color
  const generateRandomColor = useCallback((): ColorStop => {
    const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    return hexToColorStop(randomHex);
  }, []);

  // Convert hex to color stop with all formats
  const hexToColorStop = useCallback((hex: string): ColorStop => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    // Convert RGB to HSL
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
        case gNorm: h = (bNorm - rNorm) / d + 2; break;
        case bNorm: h = (rNorm - gNorm) / d + 4; break;
      }
      h /= 6;
    }

    return {
      id: Math.random().toString(36).substr(2, 9),
      hex,
      name: `Color ${hex.toUpperCase()}`,
      hsl: { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) },
      rgb: { r, g, b },
    };
  }, []);

  // Calculate contrast ratio
  const getContrastRatio = useCallback((color1: string, color2: string): number => {
    const getLuminance = (hex: string) => {
      const rgb = parseInt(hex.slice(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;

      const rsRGB = r / 255;
      const gsRGB = g / 255;
      const bsRGB = b / 255;

      const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
      const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
      const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

      return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
    };

    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);

    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
  }, []);

  // Check accessibility for a color combination
  const checkAccessibilityForPair = useCallback((bgColor: string, textColor: string) => {
    const ratio = getContrastRatio(bgColor, textColor);
    const threshold = CONTRAST_THRESHOLDS[textSize];

    if (ratio >= threshold) {
      return { status: 'pass', ratio: ratio.toFixed(2) };
    } else {
      return { status: 'fail', ratio: ratio.toFixed(2) };
    }
  }, [textSize, getContrastRatio]);

  // Generate palette from preset
  const generateFromPreset = useCallback(() => {
    const presetColors = PALETTE_PRESETS[selectedPreset as keyof typeof PALETTE_PRESETS];
    const newPalette = presetColors.map(hex => hexToColorStop(hex));
    setCurrentPalette(newPalette);
  }, [selectedPreset, hexToColorStop]);

  // Add random color
  const addRandomColor = useCallback(() => {
    const newColor = generateRandomColor();
    setCurrentPalette(prev => [...prev, newColor]);
  }, [generateRandomColor]);

  // Remove color
  const removeColor = useCallback((id: string) => {
    setCurrentPalette(prev => prev.filter(color => color.id !== id));
  }, []);

  // Update color
  const updateColor = useCallback((id: string, hex: string) => {
    setCurrentPalette(prev =>
      prev.map(color =>
        color.id === id ? hexToColorStop(hex) : color
      )
    );
  }, [hexToColorStop]);

  // Save palette
  const savePalette = useCallback(() => {
    if (!paletteName.trim()) {
      toast({
        title: "Palette name required",
        description: "Please enter a name for your palette",
        variant: "destructive",
      });
      return;
    }

    const newPalette: Palette = {
      id: Math.random().toString(36).substr(2, 9),
      name: paletteName,
      colors: currentPalette,
      createdAt: new Date(),
    };

    setSavedPalettes(prev => [...prev, newPalette]);
    setPaletteName('');
    toast({
      title: "Palette saved",
      description: "Your color palette has been saved successfully",
    });
  }, [paletteName, currentPalette, toast]);

  // Load palette
  const loadPalette = useCallback((palette: Palette) => {
    setCurrentPalette(palette.colors);
    setPaletteName(palette.name);
  }, []);

  // Export palette
  const exportPalette = useCallback((format: 'css' | 'json' | 'scss') => {
    let content = '';
    const timestamp = new Date().toISOString().split('T')[0];

    switch (format) {
      case 'css':
        content = `:root {\n${currentPalette.map((color, index) =>
          `  --color-${index + 1}: ${color.hex};`
        ).join('\n')}\n}`;
        break;
      case 'scss':
        content = currentPalette.map((color, index) =>
          `$color-${index + 1}: ${color.hex};`
        ).join('\n');
        break;
      case 'json':
        content = JSON.stringify({
          name: paletteName || 'Color Palette',
          created: timestamp,
          colors: currentPalette.map(color => ({
            name: color.name,
            hex: color.hex,
            hsl: color.hsl,
            rgb: color.rgb,
          })),
        }, null, 2);
        break;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `palette-${timestamp}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Palette exported",
      description: `Exported as ${format.toUpperCase()} file`,
    });
  }, [currentPalette, paletteName, toast]);

  // Generate harmonious colors
  const generateHarmonious = useCallback((baseColor: ColorStop, type: 'complementary' | 'triadic' | 'analogous') => {
    const { h, s, l } = baseColor.hsl;
    let newColors: ColorStop[] = [];

    switch (type) {
      case 'complementary':
        newColors = [
          hexToColorStop(`hsl(${(h + 180) % 360}, ${s}%, ${l}%)`),
        ];
        break;
      case 'triadic':
        newColors = [
          hexToColorStop(`hsl(${(h + 120) % 360}, ${s}%, ${l}%)`),
          hexToColorStop(`hsl(${(h + 240) % 360}, ${s}%, ${l}%)`),
        ];
        break;
      case 'analogous':
        newColors = [
          hexToColorStop(`hsl(${(h + 30) % 360}, ${s}%, ${l}%)`),
          hexToColorStop(`hsl(${(h - 30 + 360) % 360}, ${s}%, ${l}%)`),
        ];
        break;
    }

    setCurrentPalette(prev => [...prev, ...newColors]);
  }, [hexToColorStop]);

  const accessibilityResults = useMemo(() => {
    if (!checkAccessibility || currentPalette.length < 2) return [];

    const results = [];
    for (let i = 0; i < currentPalette.length; i++) {
      for (let j = i + 1; j < currentPalette.length; j++) {
        const bgColor = currentPalette[i];
        const textColor = currentPalette[j];
        const check = checkAccessibilityForPair(bgColor.hex, textColor.hex);

        results.push({
          bgColor,
          textColor,
          ...check,
        });
      }
    }
    return results;
  }, [currentPalette, checkAccessibility, checkAccessibilityForPair]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Color Palette Studio</h1>
        <p className="text-muted-foreground">
          Generate beautiful, accessible color palettes for your design system
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generator">Generator</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Palette Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Preset Palettes</Label>
                  <Select value={selectedPreset} onValueChange={setSelectedPreset}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monochrome">Monochrome</SelectItem>
                      <SelectItem value="complementary">Complementary</SelectItem>
                      <SelectItem value="triadic">Triadic</SelectItem>
                      <SelectItem value="analogous">Analogous</SelectItem>
                      <SelectItem value="material">Material Design</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={generateFromPreset} className="w-full">
                    Generate from Preset
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button onClick={addRandomColor} variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Random Color
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Palette Name</Label>
                  <Input
                    placeholder="My Color Palette"
                    value={paletteName}
                    onChange={(e) => setPaletteName(e.target.value)}
                  />
                  <Button onClick={savePalette} disabled={!paletteName.trim()} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Save Palette
                  </Button>
                </div>

                {savedPalettes.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <Label>Saved Palettes</Label>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {savedPalettes.map(palette => (
                          <Button
                            key={palette.id}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => loadPalette(palette)}
                          >
                            {palette.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Color Palette Display */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Current Palette</CardTitle>
                  <CardDescription>
                    {currentPalette.length} color{currentPalette.length !== 1 ? 's' : ''} in your palette
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {currentPalette.length === 0 ? (
                    <div className="text-center py-12">
                      <Palette className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No colors yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Generate a preset palette or add random colors to get started.
                      </p>
                      <Button onClick={generateFromPreset}>
                        Generate Preset Palette
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {currentPalette.map((color) => (
                        <div key={color.id} className="space-y-3">
                          <div
                            className="w-full h-24 rounded-lg border-2 border-border relative group"
                            style={{ backgroundColor: color.hex }}
                          >
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                              onClick={() => removeColor(color.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={color.hex}
                                onChange={(e) => updateColor(color.id, e.target.value)}
                                className="w-8 h-8 rounded border cursor-pointer"
                              />
                              <Input
                                value={color.hex}
                                onChange={(e) => updateColor(color.id, e.target.value)}
                                className="flex-1 font-mono text-sm"
                              />
                            </div>

                            <div className="text-xs text-muted-foreground space-y-1">
                              <div>RGB: {color.rgb.r}, {color.rgb.g}, {color.rgb.b}</div>
                              <div>HSL: {color.hsl.h}°, {color.hsl.s}%, {color.hsl.l}%</div>
                            </div>

                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigator.clipboard.writeText(color.hex)}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => generateHarmonious(color, 'complementary')}
                              >
                                <Shuffle className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Accessibility Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="check-accessibility"
                  checked={checkAccessibility}
                  onCheckedChange={(checked) => setCheckAccessibility(checked === true)}
                />
                <Label htmlFor="check-accessibility">Check color contrast accessibility</Label>
              </div>

              <div className="space-y-2">
                <Label>Text Size</Label>
                <Select value={textSize} onValueChange={(value: 'normal' | 'large') => setTextSize(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal Text (4.5:1 ratio)</SelectItem>
                    <SelectItem value="large">Large Text (3.0:1 ratio)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {checkAccessibility && (
            <Card>
              <CardHeader>
                <CardTitle>Contrast Analysis</CardTitle>
                <CardDescription>
                  WCAG {textSize === 'normal' ? 'AA' : 'AAA'} compliance check for color combinations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {accessibilityResults.length === 0 ? (
                  <p className="text-muted-foreground">Add at least 2 colors to see contrast analysis.</p>
                ) : (
                  <div className="space-y-3">
                    {accessibilityResults.map((result, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1">
                            <div
                              className="w-6 h-6 rounded border"
                              style={{ backgroundColor: result.bgColor.hex }}
                            />
                            <div
                              className="w-6 h-6 rounded border"
                              style={{ backgroundColor: result.textColor.hex }}
                            />
                          </div>
                          <div className="text-sm">
                            <div className="font-medium">
                              {result.bgColor.hex} on {result.textColor.hex}
                            </div>
                            <div className="text-muted-foreground">
                              Contrast ratio: {result.ratio}:1
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {result.status === 'pass' ? (
                            <Badge variant="default" className="bg-green-500">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Pass
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <XCircle className="w-3 h-3 mr-1" />
                              Fail
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
              <CardDescription>
                Export your color palette in various formats for use in your projects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button onClick={() => exportPalette('css')} disabled={currentPalette.length === 0}>
                  <Download className="w-4 h-4 mr-2" />
                  Export as CSS
                </Button>
                <Button onClick={() => exportPalette('scss')} disabled={currentPalette.length === 0}>
                  <Download className="w-4 h-4 mr-2" />
                  Export as SCSS
                </Button>
                <Button onClick={() => exportPalette('json')} disabled={currentPalette.length === 0}>
                  <Download className="w-4 h-4 mr-2" />
                  Export as JSON
                </Button>
              </div>

              {currentPalette.length > 0 && (
                <Alert>
                  <Eye className="h-4 w-4" />
                  <AlertDescription>
                    Your palette contains {currentPalette.length} colors and will be exported with all color formats (HEX, RGB, HSL).
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}