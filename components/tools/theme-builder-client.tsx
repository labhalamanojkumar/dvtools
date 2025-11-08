"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Palette,
  Download,
  RefreshCw,
  Copy,
  Eye,
  Settings,
  Type,
  Droplet,
  Sun,
  Moon,
  Shuffle,
  CheckCircle,
  AlertTriangle,
  Upload,
  FileCode,
  Loader2,
} from "lucide-react";
import { useToast } from "@/components/ui/toaster";
import { toast as sonnerToast } from "sonner";

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
}

interface TypographySettings {
  fontFamily: string;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

interface ThemeSettings {
  name: string;
  mode: "light" | "dark" | "auto";
  colors: ColorPalette;
  typography: TypographySettings;
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
  };
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

const defaultTheme: ThemeSettings = {
  name: "Custom Theme",
  mode: "light",
  colors: {
    primary: "#3b82f6",
    secondary: "#64748b",
    accent: "#f59e0b",
    background: "#ffffff",
    surface: "#f8fafc",
    text: "#1e293b",
    textSecondary: "#64748b",
    border: "#e2e8f0",
    error: "#ef4444",
    success: "#10b981",
    warning: "#f59e0b",
  },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.625,
    },
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
  },
  borderRadius: {
    none: "0",
    sm: "0.125rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },
};

const predefinedPalettes = {
  blue: {
    primary: "#3b82f6",
    secondary: "#64748b",
    accent: "#f59e0b",
    background: "#ffffff",
    surface: "#f8fafc",
    text: "#1e293b",
    textSecondary: "#64748b",
    border: "#e2e8f0",
    error: "#ef4444",
    success: "#10b981",
    warning: "#f59e0b",
  },
  green: {
    primary: "#10b981",
    secondary: "#64748b",
    accent: "#f59e0b",
    background: "#ffffff",
    surface: "#f0fdf4",
    text: "#14532d",
    textSecondary: "#64748b",
    border: "#dcfce7",
    error: "#ef4444",
    success: "#10b981",
    warning: "#f59e0b",
  },
  purple: {
    primary: "#8b5cf6",
    secondary: "#64748b",
    accent: "#f59e0b",
    background: "#ffffff",
    surface: "#faf5ff",
    text: "#581c87",
    textSecondary: "#64748b",
    border: "#e9d5ff",
    error: "#ef4444",
    success: "#10b981",
    warning: "#f59e0b",
  },
  dark: {
    primary: "#60a5fa",
    secondary: "#94a3b8",
    accent: "#fbbf24",
    background: "#0f172a",
    surface: "#1e293b",
    text: "#f8fafc",
    textSecondary: "#cbd5e1",
    border: "#334155",
    error: "#f87171",
    success: "#34d399",
    warning: "#fbbf24",
  },
};

export default function ThemeBuilderClient() {
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);
  const [previewMode, setPreviewMode] = useState<"light" | "dark">("light");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCSS, setGeneratedCSS] = useState("");
  const [analysis, setAnalysis] = useState<any | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      const fileType = file.name.endsWith('.json') ? 'json' : 'css';
      
      setIsLoading(true);
      const response = await fetch('/api/tools/theme-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'import',
          fileContent: content,
          fileType
        })
      });

      const data = await response.json();
      if (data.success && data.theme) {
        setTheme(data.theme);
        sonnerToast.success('Theme imported successfully');
      } else {
        sonnerToast.error(data.error || 'Failed to import theme');
      }
    } catch (error) {
      console.error('Error importing theme:', error);
      sonnerToast.error('Failed to import theme file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportTheme = async (format: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/tools/theme-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'export',
          theme,
          format
        })
      });

      const data = await response.json();
      if (data.success) {
        const blob = new Blob([data.data], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `theme.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        sonnerToast.success(`Theme exported as ${format.toUpperCase()}`);
      } else {
        sonnerToast.error(data.error || 'Export failed');
      }
    } catch (error) {
      console.error('Error exporting theme:', error);
      sonnerToast.error('Failed to export theme');
    } finally {
      setIsLoading(false);
    }
  };

  const generateRandomColor = (): string => {
    return (
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
    );
  };

  const generateComplementaryPalette = (baseColor: string): ColorPalette => {
    // Simple color manipulation for complementary colors
    const color = baseColor.replace("#", "");
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);

    return {
      primary: baseColor,
      secondary: `hsl(${Math.random() * 360}, 20%, 50%)`,
      accent: `hsl(${Math.random() * 360}, 70%, 60%)`,
      background: "#ffffff",
      surface: "#f8fafc",
      text: "#1e293b",
      textSecondary: "#64748b",
      border: "#e2e8f0",
      error: "#ef4444",
      success: "#10b981",
      warning: "#f59e0b",
    };
  };

  const applyPalette = (palette: ColorPalette) => {
    setTheme((prev) => ({
      ...prev,
      colors: palette,
    }));
    toast({
      title: "Palette applied",
      description: "Color palette has been updated",
    });
  };

  const randomizePalette = () => {
    const baseColor = generateRandomColor();
    const palette = generateComplementaryPalette(baseColor);
    applyPalette(palette);
  };

  const generateCSS = (themeParam?: ThemeSettings): string => {
    const t = themeParam || theme
    const cssVars = [];

    // Color variables
    Object.entries(t.colors || {}).forEach(([key, value]) => {
      cssVars.push(`  --color-${key}: ${value};`);
    });

    // Typography variables
    cssVars.push(`  --font-family: ${theme.typography.fontFamily};`);
    Object.entries((t.typography && t.typography.fontSize) || {}).forEach(([key, value]) => {
      cssVars.push(`  --font-size-${key}: ${value};`);
    });
    Object.entries((t.typography && t.typography.fontWeight) || {}).forEach(([key, value]) => {
      cssVars.push(`  --font-weight-${key}: ${value};`);
    });
    Object.entries((t.typography && t.typography.lineHeight) || {}).forEach(([key, value]) => {
      cssVars.push(`  --line-height-${key}: ${value};`);
    });

    // Spacing variables
    Object.entries(t.spacing || {}).forEach(([key, value]) => {
      cssVars.push(`  --spacing-${key}: ${value};`);
    });

    // Border radius variables
    Object.entries(t.borderRadius || {}).forEach(([key, value]) => {
      cssVars.push(`  --border-radius-${key}: ${value};`);
    });

    // Shadow variables
    Object.entries(t.shadows || {}).forEach(([key, value]) => {
      cssVars.push(`  --shadow-${key}: ${value};`);
    });

    const css = `:root {
${cssVars.join("\n")}
}

/* Dark mode overrides */
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #0f172a;
    --color-surface: #1e293b;
    --color-text: #f8fafc;
    --color-text-secondary: #cbd5e1;
    --color-border: #334155;
  }
}

/* Utility classes */
.text-primary { color: var(--color-primary); }
.text-secondary { color: var(--color-secondary); }
.text-accent { color: var(--color-accent); }
.text-error { color: var(--color-error); }
.text-success { color: var(--color-success); }
.text-warning { color: var(--color-warning); }

.bg-primary { background-color: var(--color-primary); }
.bg-secondary { background-color: var(--color-secondary); }
.bg-accent { background-color: var(--color-accent); }
.bg-surface { background-color: var(--color-surface); }

.border-primary { border-color: var(--color-primary); }
.border-secondary { border-color: var(--color-secondary); }
.border-accent { border-color: var(--color-accent); }

.font-size-xs { font-size: var(--font-size-xs); }
.font-size-sm { font-size: var(--font-size-sm); }
.font-size-base { font-size: var(--font-size-base); }
.font-size-lg { font-size: var(--font-size-lg); }
.font-size-xl { font-size: var(--font-size-xl); }
.font-size-2xl { font-size: var(--font-size-2xl); }
.font-size-3xl { font-size: var(--font-size-3xl); }

.font-weight-light { font-weight: var(--font-weight-light); }
.font-weight-normal { font-weight: var(--font-weight-normal); }
.font-weight-medium { font-weight: var(--font-weight-medium); }
.font-weight-semibold { font-weight: var(--font-weight-semibold); }
.font-weight-bold { font-weight: var(--font-weight-bold); }

.line-height-tight { line-height: var(--line-height-tight); }
.line-height-normal { line-height: var(--line-height-normal); }
.line-height-relaxed { line-height: var(--line-height-relaxed); }

.p-xs { padding: var(--spacing-xs); }
.p-sm { padding: var(--spacing-sm); }
.p-md { padding: var(--spacing-md); }
.p-lg { padding: var(--spacing-lg); }
.p-xl { padding: var(--spacing-xl); }
.p-2xl { padding: var(--spacing-2xl); }

.m-xs { margin: var(--spacing-xs); }
.m-sm { margin: var(--spacing-sm); }
.m-md { margin: var(--spacing-md); }
.m-lg { margin: var(--spacing-lg); }
.m-xl { margin: var(--spacing-xl); }
.m-2xl { margin: var(--spacing-2xl); }

.rounded-none { border-radius: var(--border-radius-none); }
.rounded-sm { border-radius: var(--border-radius-sm); }
.rounded-md { border-radius: var(--border-radius-md); }
.rounded-lg { border-radius: var(--border-radius-lg); }
.rounded-xl { border-radius: var(--border-radius-xl); }
.rounded-full { border-radius: var(--border-radius-full); }

.shadow-sm { box-shadow: var(--shadow-sm); }
.shadow-md { box-shadow: var(--shadow-md); }
.shadow-lg { box-shadow: var(--shadow-lg); }
.shadow-xl { box-shadow: var(--shadow-xl); }

body {
  font-family: var(--font-family);
  background-color: var(--color-background);
  color: var(--color-text);
  margin: 0;
  padding: 0;
  line-height: var(--line-height-normal);
}`;

    return css;
  };

  const handleGenerateCSS = async () => {
    setIsGenerating(true);

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const css = generateCSS();
    setGeneratedCSS(css);
    setIsGenerating(false);

    toast({
      title: "CSS generated",
      description: "Theme CSS has been generated successfully",
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "CSS has been copied to your clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadCSS = () => {
    const blob = new Blob([generatedCSS], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${theme.name.toLowerCase().replace(/\s+/g, "-")}.css`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Download started",
      description: "CSS file has been downloaded",
    });
  };

  const updateColor = (key: keyof ColorPalette, value: string) => {
    setTheme((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [key]: value,
      },
    }));
  };

  const updateTypography = (
    category: keyof TypographySettings,
    key: string,
    value: string | number,
  ) => {
    setTheme((prev) => {
      if (category === "fontFamily") {
        return {
          ...prev,
          typography: {
            ...prev.typography,
            fontFamily: value as string,
          },
        };
      } else {
        return {
          ...prev,
          typography: {
            ...prev.typography,
            [category]: {
              ...(prev.typography[category] as any),
              [key]: value,
            },
          },
        };
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Theme Builder</h2>
          <p className="text-muted-foreground">
            Create beautiful, consistent design systems
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={randomizePalette}>
            <Shuffle className="mr-2 h-4 w-4" />
            Randomize
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              setIsLoading(true);
              try {
                // Call server to generate a theme based on current settings
                const res = await fetch('/api/tools/theme-builder', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ action: 'generate', theme })
                });

                const data = await res.json();
                if (res.ok && data.success && data.theme) {
                  // Replace theme with server-generated theme
                  setTheme(data.theme)
                  // generate CSS immediately from returned theme object
                  const css = generateCSS(data.theme)
                  setGeneratedCSS(css)
                  sonnerToast.success('Theme generated from server');
                } else {
                  sonnerToast.error(data.error || 'Failed to generate theme');
                }
              } catch (err) {
                console.error('Error generating theme from server:', err);
                sonnerToast.error('Failed to generate theme');
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading}
          >
            <Loader2 className="mr-2 h-4 w-4" />
            Get Results
          </Button>

          <Button
            variant="outline"
            onClick={async () => {
              setIsLoading(true);
              try {
                const res = await fetch('/api/tools/theme-builder', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ action: 'analyze', theme })
                });

                const data = await res.json();
                if (res.ok && data.success && data.analysis) {
                  setAnalysis(data.analysis);
                  sonnerToast.success('Analysis complete');
                } else {
                  sonnerToast.error(data.error || 'Analysis failed');
                }
              } catch (err) {
                console.error('Error analyzing theme:', err);
                sonnerToast.error('Failed to run analysis');
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading}
          >
            <Type className="mr-2 h-4 w-4" />
            Analyze
          </Button>
          <Button onClick={handleGenerateCSS} disabled={isGenerating}>
            {isGenerating ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Palette className="mr-2 h-4 w-4" />
            )}
            Generate CSS
          </Button>
        </div>
      </div>

      <Tabs defaultValue="colors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="spacing">Spacing</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        {/* Colors Tab */}
        <TabsContent value="colors" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Color Picker */}
            <Card>
              <CardHeader>
                <CardTitle>Color Palette</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(theme.colors).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded border-2 border-gray-200"
                      style={{ backgroundColor: value }}
                    />
                    <Label className="flex-1 capitalize">{key}</Label>
                    <Input
                      type="color"
                      value={value}
                      onChange={(e) =>
                        updateColor(key as keyof ColorPalette, e.target.value)
                      }
                      className="w-16 h-8 p-1 border rounded"
                    />
                    <Input
                      value={value}
                      onChange={(e) =>
                        updateColor(key as keyof ColorPalette, e.target.value)
                      }
                      className="w-24 text-sm font-mono"
                      placeholder="#000000"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Predefined Palettes */}
            <Card>
              <CardHeader>
                <CardTitle>Predefined Palettes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(predefinedPalettes).map(([name, palette]) => (
                  <div key={name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="capitalize">{name}</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => applyPalette(palette)}
                      >
                        Apply
                      </Button>
                    </div>
                    <div className="flex gap-1">
                      {Object.values(palette)
                        .slice(0, 5)
                        .map((color, index) => (
                          <div
                            key={index}
                            className="w-6 h-6 rounded"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Typography Tab */}
        <TabsContent value="typography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Typography Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Font Family */}
              <div>
                <Label htmlFor="font-family">Font Family</Label>
                <Input
                  id="font-family"
                  value={theme.typography.fontFamily}
                  onChange={(e) =>
                    setTheme((prev) => ({
                      ...prev,
                      typography: {
                        ...prev.typography,
                        fontFamily: e.target.value,
                      },
                    }))
                  }
                  placeholder="Inter, system-ui, sans-serif"
                />
              </div>

              {/* Font Sizes */}
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Font Sizes
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(theme.typography.fontSize).map(
                    ([key, value]) => (
                      <div key={key}>
                        <Label className="text-sm capitalize">{key}</Label>
                        <Input
                          value={value}
                          onChange={(e) =>
                            updateTypography("fontSize", key, e.target.value)
                          }
                          className="text-sm"
                        />
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Font Weights */}
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Font Weights
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(theme.typography.fontWeight).map(
                    ([key, value]) => (
                      <div key={key}>
                        <Label className="text-sm capitalize">{key}</Label>
                        <Input
                          type="number"
                          value={value}
                          onChange={(e) =>
                            updateTypography(
                              "fontWeight",
                              key,
                              parseInt(e.target.value),
                            )
                          }
                          className="text-sm"
                        />
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Line Heights */}
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Line Heights
                </Label>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(theme.typography.lineHeight).map(
                    ([key, value]) => (
                      <div key={key}>
                        <Label className="text-sm capitalize">{key}</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={value}
                          onChange={(e) =>
                            updateTypography(
                              "lineHeight",
                              key,
                              parseFloat(e.target.value),
                            )
                          }
                          className="text-sm"
                        />
                      </div>
                    ),
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Spacing Tab */}
        <TabsContent value="spacing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Spacing Scale</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(theme.spacing).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-3">
                    <Label className="w-12 capitalize">{key}</Label>
                    <Input
                      value={value}
                      onChange={(e) =>
                        setTheme((prev) => ({
                          ...prev,
                          spacing: {
                            ...prev.spacing,
                            [key]: e.target.value,
                          },
                        }))
                      }
                      className="flex-1"
                    />
                    <div
                      className="w-8 h-4 bg-blue-500 rounded"
                      style={{ width: value }}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Border Radius</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(theme.borderRadius).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-3">
                    <Label className="w-16 capitalize">{key}</Label>
                    <Input
                      value={value}
                      onChange={(e) =>
                        setTheme((prev) => ({
                          ...prev,
                          borderRadius: {
                            ...prev.borderRadius,
                            [key]: e.target.value,
                          },
                        }))
                      }
                      className="flex-1"
                    />
                    <div
                      className="w-8 h-8 bg-blue-500 rounded"
                      style={{ borderRadius: value }}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Theme Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="border rounded-lg p-6 space-y-4"
                style={{
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  fontFamily: theme.typography.fontFamily,
                }}
              >
                <h1
                  className="text-3xl font-bold mb-4"
                  style={{ color: theme.colors.primary }}
                >
                  {theme.name}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className="p-4 rounded"
                    style={{
                      backgroundColor: theme.colors.surface,
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: theme.borderRadius.md,
                    }}
                  >
                    <h3
                      className="font-semibold mb-2"
                      style={{ color: theme.colors.text }}
                    >
                      Surface Card
                    </h3>
                    <p style={{ color: theme.colors.textSecondary }}>
                      This is how cards and surfaces look with your theme.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <button
                      className="px-4 py-2 rounded font-medium mr-2"
                      style={{
                        backgroundColor: theme.colors.primary,
                        color: "white",
                        borderRadius: theme.borderRadius.md,
                      }}
                    >
                      Primary Button
                    </button>
                    <button
                      className="px-4 py-2 rounded font-medium border"
                      style={{
                        backgroundColor: "transparent",
                        color: theme.colors.primary,
                        border: `1px solid ${theme.colors.primary}`,
                        borderRadius: theme.borderRadius.md,
                      }}
                    >
                      Secondary Button
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <span
                    className="px-2 py-1 rounded text-sm"
                    style={{
                      backgroundColor: theme.colors.success,
                      color: "white",
                    }}
                  >
                    Success
                  </span>
                  <span
                    className="px-2 py-1 rounded text-sm"
                    style={{
                      backgroundColor: theme.colors.warning,
                      color: "white",
                    }}
                  >
                    Warning
                  </span>
                  <span
                    className="px-2 py-1 rounded text-sm"
                    style={{
                      backgroundColor: theme.colors.error,
                      color: "white",
                    }}
                  >
                    Error
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Analysis Results */}
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>Theme Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold">Accessibility</h4>
                <p>Contrast ratio: {analysis.accessibility?.contrastRatio ?? 'N/A'}</p>
                <p>WCAG Level: {analysis.accessibility?.wcagLevel ?? 'N/A'}</p>
                <ul className="list-disc ml-5 mt-2">
                  {(analysis.accessibility?.recommendations || []).map((r: string, i: number) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold">Consistency</h4>
                <p>Color Harmony: {analysis.consistency?.colorHarmony ?? 'N/A'}</p>
                <p>Spacing Scale: {analysis.consistency?.spacingScale ?? 'N/A'}</p>
                <p>Typography Scale: {analysis.consistency?.typographyScale ?? 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated CSS */}
      {generatedCSS && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Generated CSS
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(generatedCSS)}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
                <Button onClick={downloadCSS}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full">
              <pre className="text-sm font-mono bg-gray-50 p-4 rounded border overflow-x-auto">
                {generatedCSS}
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
