'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import {
  Download,
  Upload,
  Copy,
  Palette,
  RefreshCw,
  CheckCircle2,
  Droplet,
  Image as ImageIcon,
} from 'lucide-react';

interface Color {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
}

export default function ColorPaletteGeneratorClient() {
  const [baseColor, setBaseColor] = useState('#667eea');
  const [palette, setPalette] = useState<Color[]>([]);
  const [scheme, setScheme] = useState<'complementary' | 'analogous' | 'triadic' | 'tetradic' | 'monochromatic'>('complementary');

  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const hslToHex = (h: number, s: number, l: number): string => {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0;
    let g = 0;
    let b = 0;

    if (h >= 0 && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (h >= 60 && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (h >= 180 && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (h >= 240 && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (h >= 300 && h < 360) {
      r = c;
      g = 0;
      b = x;
    }

    const toHex = (n: number) =>
      Math.round((n + m) * 255)
        .toString(16)
        .padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const createColor = (hex: string): Color => {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return { hex, rgb, hsl };
  };

  const generatePalette = useCallback(() => {
    const rgb = hexToRgb(baseColor);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const colors: Color[] = [createColor(baseColor)];

    switch (scheme) {
      case 'complementary':
        colors.push(createColor(hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l)));
        colors.push(createColor(hslToHex(hsl.h, hsl.s, Math.max(10, hsl.l - 20))));
        colors.push(createColor(hslToHex(hsl.h, hsl.s, Math.min(90, hsl.l + 20))));
        colors.push(createColor(hslToHex((hsl.h + 180) % 360, hsl.s, Math.max(10, hsl.l - 20))));
        break;

      case 'analogous':
        colors.push(createColor(hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l)));
        colors.push(createColor(hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l)));
        colors.push(createColor(hslToHex((hsl.h + 60) % 360, hsl.s, hsl.l)));
        colors.push(createColor(hslToHex((hsl.h - 60 + 360) % 360, hsl.s, hsl.l)));
        break;

      case 'triadic':
        colors.push(createColor(hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l)));
        colors.push(createColor(hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l)));
        colors.push(createColor(hslToHex(hsl.h, hsl.s, Math.max(10, hsl.l - 20))));
        colors.push(createColor(hslToHex(hsl.h, hsl.s, Math.min(90, hsl.l + 20))));
        break;

      case 'tetradic':
        colors.push(createColor(hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l)));
        colors.push(createColor(hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l)));
        colors.push(createColor(hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l)));
        colors.push(createColor(hslToHex(hsl.h, hsl.s, Math.max(10, hsl.l - 20))));
        break;

      case 'monochromatic':
        for (let i = 1; i <= 4; i++) {
          const lightness = hsl.l + (i * 15 - 30);
          colors.push(createColor(hslToHex(hsl.h, hsl.s, Math.max(10, Math.min(90, lightness)))));
        }
        break;
    }

    setPalette(colors);
  }, [baseColor, scheme]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const colors: { [key: string]: number } = {};

        for (let i = 0; i < imageData.data.length; i += 4) {
          const r = imageData.data[i];
          const g = imageData.data[i + 1];
          const b = imageData.data[i + 2];
          const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
          colors[hex] = (colors[hex] || 0) + 1;
        }

        const sortedColors = Object.entries(colors)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([hex]) => createColor(hex));

        setPalette(sortedColors);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
  };

  const downloadCSS = () => {
    const css = palette
      .map(
        (color, i) => `  --color-${i + 1}: ${color.hex}; /* rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}) */`
      )
      .join('\n');
    const content = `:root {\n${css}\n}`;
    const blob = new Blob([content], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'palette.css';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadJSON = () => {
    const json = JSON.stringify(palette, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'palette.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto max-w-7xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Color Palette Generator</h1>
          <p className="text-muted-foreground">
            Generate harmonious color schemes and extract colors from images
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          <Palette className="mr-1 h-3 w-3" />
          Colors
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About This Tool</CardTitle>
          <CardDescription>
            Professional color palette generator for designers and developers with color theory support
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Generate harmonious color schemes based on color theory principles, extract dominant colors from images, and export palettes in multiple formats. Perfect for creating website color schemes, brand colors, UI design systems, and accessible color combinations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                Key Features
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• 5 color scheme types (complementary, analogous, triadic, tetradic, monochromatic)</li>
                <li>• Extract colors from uploaded images</li>
                <li>• Display HEX, RGB, and HSL formats</li>
                <li>• Export as CSS variables or JSON</li>
                <li>• Copy individual colors instantly</li>
                <li>• Visual color preview cards</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <Palette className="mr-2 h-4 w-4 text-primary" />
                Use Cases
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Design website color schemes</li>
                <li>• Extract brand colors from logos</li>
                <li>• Create UI component palettes</li>
                <li>• Generate accessible color combinations</li>
                <li>• Match colors from reference images</li>
                <li>• Export for CSS custom properties</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generate Palette</CardTitle>
          <CardDescription>Choose a base color and color scheme</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Base Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="w-20 h-10 cursor-pointer"
                />
                <Input
                  type="text"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  placeholder="#667eea"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Color Scheme</Label>
              <select
                value={scheme}
                onChange={(e) => setScheme(e.target.value as any)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                <option value="complementary">Complementary</option>
                <option value="analogous">Analogous</option>
                <option value="triadic">Triadic</option>
                <option value="tetradic">Tetradic</option>
                <option value="monochromatic">Monochromatic</option>
              </select>
            </div>
          </div>

          <Button onClick={generatePalette} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate Palette
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Extract from Image</CardTitle>
          <CardDescription>Upload an image to extract dominant colors</CardDescription>
        </CardHeader>
        <CardContent>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <Button
            variant="outline"
            className="w-full"
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Image
          </Button>
        </CardContent>
      </Card>

      {palette.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Generated Palette</CardTitle>
                <CardDescription>{palette.length} colors</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={downloadCSS}>
                  <Download className="mr-2 h-4 w-4" />
                  CSS
                </Button>
                <Button variant="outline" size="sm" onClick={downloadJSON}>
                  <Download className="mr-2 h-4 w-4" />
                  JSON
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {palette.map((color, index) => (
                <Card key={index} className="overflow-hidden">
                  <div
                    className="h-32 cursor-pointer transition-transform hover:scale-105"
                    style={{ backgroundColor: color.hex }}
                    onClick={() => copyColor(color.hex)}
                  />
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-semibold">{color.hex}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyColor(color.hex)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="text-xs space-y-1 text-muted-foreground">
                      <p>RGB: {color.rgb.r}, {color.rgb.g}, {color.rgb.b}</p>
                      <p>HSL: {color.hsl.h}°, {color.hsl.s}%, {color.hsl.l}%</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Color Scheme Types</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold mb-1">Complementary</p>
            <p className="text-muted-foreground">Colors opposite on the color wheel (180°)</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Analogous</p>
            <p className="text-muted-foreground">Colors adjacent on the wheel (±30°)</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Triadic</p>
            <p className="text-muted-foreground">Three colors evenly spaced (120°)</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Tetradic</p>
            <p className="text-muted-foreground">Four colors forming a rectangle (90°)</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Monochromatic</p>
            <p className="text-muted-foreground">Variations in lightness of one hue</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
