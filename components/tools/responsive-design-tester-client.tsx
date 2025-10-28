"use client";

import { useState, useEffect } from "react";
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
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Monitor,
  Smartphone,
  Tablet,
  RotateCcw,
  Eye,
  Settings,
  Copy,
  ExternalLink,
  SmartphoneIcon,
  MonitorIcon,
  TabletIcon,
} from "lucide-react";
import { useToast } from "@/components/ui/toaster";

interface DevicePreset {
  name: string;
  width: number;
  height: number;
  icon: React.ReactNode;
  category: string;
}

const devicePresets: DevicePreset[] = [
  // Phones
  {
    name: "iPhone 14",
    width: 390,
    height: 844,
    icon: <SmartphoneIcon className="h-4 w-4" />,
    category: "phone",
  },
  {
    name: "iPhone 14 Pro Max",
    width: 428,
    height: 926,
    icon: <SmartphoneIcon className="h-4 w-4" />,
    category: "phone",
  },
  {
    name: "Samsung Galaxy S23",
    width: 360,
    height: 780,
    icon: <SmartphoneIcon className="h-4 w-4" />,
    category: "phone",
  },
  {
    name: "Google Pixel 7",
    width: 412,
    height: 915,
    icon: <SmartphoneIcon className="h-4 w-4" />,
    category: "phone",
  },

  // Tablets
  {
    name: "iPad",
    width: 810,
    height: 1080,
    icon: <TabletIcon className="h-4 w-4" />,
    category: "tablet",
  },
  {
    name: 'iPad Pro 12.9"',
    width: 1024,
    height: 1366,
    icon: <TabletIcon className="h-4 w-4" />,
    category: "tablet",
  },
  {
    name: "Samsung Galaxy Tab S8",
    width: 800,
    height: 1280,
    icon: <TabletIcon className="h-4 w-4" />,
    category: "tablet",
  },

  // Desktops
  {
    name: "Desktop 1080p",
    width: 1920,
    height: 1080,
    icon: <MonitorIcon className="h-4 w-4" />,
    category: "desktop",
  },
  {
    name: "Desktop 1440p",
    width: 2560,
    height: 1440,
    icon: <MonitorIcon className="h-4 w-4" />,
    category: "desktop",
  },
  {
    name: "Desktop 4K",
    width: 3840,
    height: 2160,
    icon: <MonitorIcon className="h-4 w-4" />,
    category: "desktop",
  },

  // Custom breakpoints
  {
    name: "Mobile (sm)",
    width: 640,
    height: 800,
    icon: <SmartphoneIcon className="h-4 w-4" />,
    category: "breakpoint",
  },
  {
    name: "Tablet (md)",
    width: 768,
    height: 1024,
    icon: <TabletIcon className="h-4 w-4" />,
    category: "breakpoint",
  },
  {
    name: "Desktop (lg)",
    width: 1024,
    height: 768,
    icon: <MonitorIcon className="h-4 w-4" />,
    category: "breakpoint",
  },
  {
    name: "Large Desktop (xl)",
    width: 1280,
    height: 720,
    icon: <MonitorIcon className="h-4 w-4" />,
    category: "breakpoint",
  },
];

const sampleHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Responsive Test Page</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
        }

        .hero {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            align-items: center;
            padding: 60px 0;
        }

        .hero-content h1 {
            font-size: 3rem;
            margin-bottom: 20px;
        }

        .hero-content p {
            font-size: 1.2rem;
            margin-bottom: 30px;
            opacity: 0.9;
        }

        .hero-image {
            background: #f0f0f0;
            border-radius: 10px;
            height: 300px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            color: #666;
        }

        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            padding: 60px 0;
        }

        .feature-card {
            background: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            text-align: center;
        }

        .feature-card h3 {
            font-size: 1.5rem;
            margin-bottom: 15px;
        }

        .btn {
            background: #667eea;
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 5px;
            font-size: 1rem;
            cursor: pointer;
            transition: background 0.3s;
        }

        .btn:hover {
            background: #5a6fd8;
        }

        @media (max-width: 768px) {
            .hero {
                grid-template-columns: 1fr;
                text-align: center;
            }

            .hero-content h1 {
                font-size: 2rem;
            }

            .hero-content p {
                font-size: 1rem;
            }

            .features {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 480px) {
            .container {
                padding: 10px;
            }

            .header {
                padding: 30px 15px;
            }

            .hero-content h1 {
                font-size: 1.8rem;
            }

            .feature-card {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <h1>Responsive Design Tester</h1>
            <p>Test how your website looks on different devices</p>
        </div>
    </header>

    <main class="container">
        <section class="hero">
            <div class="hero-content">
                <h1>Build Responsive Websites</h1>
                <p>Create websites that work perfectly on all devices, from mobile phones to desktop computers.</p>
                <button class="btn">Get Started</button>
            </div>
            <div class="hero-image">
                📱 Responsive Design
            </div>
        </section>

        <section class="features">
            <div class="feature-card">
                <h3>Mobile First</h3>
                <p>Design for mobile devices first, then enhance for larger screens.</p>
            </div>
            <div class="feature-card">
                <h3>Flexible Layouts</h3>
                <p>Use flexible grid systems and media queries for adaptive layouts.</p>
            </div>
            <div class="feature-card">
                <h3>Touch Friendly</h3>
                <p>Ensure buttons and interactive elements are touch-friendly.</p>
            </div>
        </section>
    </main>
</body>
</html>`;

export default function ResponsiveDesignTesterClient() {
  const [url, setUrl] = useState("");
  const [html, setHtml] = useState(sampleHTML);
  const [selectedDevice, setSelectedDevice] = useState<DevicePreset>(
    devicePresets[0],
  );
  const [customWidth, setCustomWidth] = useState("");
  const [customHeight, setCustomHeight] = useState("");
  const [zoom, setZoom] = useState(100);
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "portrait",
  );
  const [inputMode, setInputMode] = useState<"url" | "html">("html");
  const { toast } = useToast();

  const handleDeviceSelect = (device: DevicePreset) => {
    setSelectedDevice(device);
    setCustomWidth(device.width.toString());
    setCustomHeight(device.height.toString());
  };

  const handleCustomSize = () => {
    const width = parseInt(customWidth);
    const height = parseInt(customHeight);

    if (width && height && width > 0 && height > 0) {
      setSelectedDevice({
        name: "Custom",
        width,
        height,
        icon: <Monitor className="h-4 w-4" />,
        category: "custom",
      });
    } else {
      toast({
        title: "Invalid Dimensions",
        description: "Please enter valid width and height values",
        variant: "destructive",
      });
    }
  };

  const rotateDevice = () => {
    const newOrientation =
      orientation === "portrait" ? "landscape" : "portrait";
    setOrientation(newOrientation);

    if (selectedDevice.category !== "custom") {
      // Swap width and height for rotation
      const temp = customWidth;
      setCustomWidth(customHeight);
      setCustomHeight(temp);
    }
  };

  const getViewportDimensions = () => {
    const width = parseInt(customWidth) || selectedDevice.width;
    const height = parseInt(customHeight) || selectedDevice.height;

    if (orientation === "landscape") {
      return { width: height, height: width };
    }

    return { width, height };
  };

  const copyEmbedCode = () => {
    const dimensions = getViewportDimensions();
    const embedCode = `<iframe
  src="${url || "data:text/html," + encodeURIComponent(html)}"
  width="${dimensions.width}"
  height="${dimensions.height}"
  style="border: 1px solid #ccc; border-radius: 8px;"
  title="Responsive Preview"
></iframe>`;

    navigator.clipboard.writeText(embedCode);
    toast({
      title: "Copied",
      description: "Embed code copied to clipboard",
    });
  };

  const openInNewTab = () => {
    if (inputMode === "url" && url) {
      window.open(url, "_blank");
    } else if (inputMode === "html") {
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      URL.revokeObjectURL(url);
    }
  };

  const dimensions = getViewportDimensions();
  const scale = zoom / 100;
  const containerWidth = Math.min(dimensions.width * scale, 800); // Max container width
  const containerHeight = Math.min(dimensions.height * scale, 600); // Max container height

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Test Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs
            value={inputMode}
            onValueChange={(value) => setInputMode(value as "url" | "html")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url">URL</TabsTrigger>
              <TabsTrigger value="html">HTML Code</TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-4">
              <div>
                <Label htmlFor="url-input">Website URL</Label>
                <Input
                  id="url-input"
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="html" className="space-y-4">
              <div>
                <Label htmlFor="html-input">HTML Code</Label>
                <textarea
                  id="html-input"
                  placeholder="Paste your HTML code here..."
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                  className="w-full h-64 p-3 border border-input rounded-md text-sm font-mono resize-none"
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Device Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Device Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Device Presets */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Popular Devices
            </Label>
            <ScrollArea className="w-full">
              <div className="flex gap-2 pb-2">
                {devicePresets.map((device) => (
                  <Button
                    key={device.name}
                    variant={
                      selectedDevice.name === device.name
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => handleDeviceSelect(device)}
                    className="flex items-center gap-2 whitespace-nowrap"
                  >
                    {device.icon}
                    {device.name}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>

          <Separator />

          {/* Custom Dimensions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="custom-width">Width (px)</Label>
              <Input
                id="custom-width"
                type="number"
                placeholder="390"
                value={customWidth}
                onChange={(e) => setCustomWidth(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="custom-height">Height (px)</Label>
              <Input
                id="custom-height"
                type="number"
                placeholder="844"
                value={customHeight}
                onChange={(e) => setCustomHeight(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="zoom">Zoom (%)</Label>
              <Select
                value={zoom.toString()}
                onValueChange={(value) => setZoom(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50">50%</SelectItem>
                  <SelectItem value="75">75%</SelectItem>
                  <SelectItem value="100">100%</SelectItem>
                  <SelectItem value="125">125%</SelectItem>
                  <SelectItem value="150">150%</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button variant="outline" onClick={handleCustomSize}>
                Apply
              </Button>
              <Button variant="outline" size="icon" onClick={rotateDevice}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Live Preview
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {dimensions.width} × {dimensions.height}px
              </Badge>
              <Badge variant="outline">{zoom}%</Badge>
              <Button variant="outline" size="sm" onClick={copyEmbedCode}>
                <Copy className="h-4 w-4 mr-1" />
                Embed
              </Button>
              <Button variant="outline" size="sm" onClick={openInNewTab}>
                <ExternalLink className="h-4 w-4 mr-1" />
                Open
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg overflow-hidden bg-gray-50"
              style={{
                width: containerWidth,
                height: containerHeight,
                maxWidth: "100%",
                maxHeight: "600px",
              }}
            >
              <iframe
                src={
                  inputMode === "url"
                    ? url
                    : `data:text/html;charset=utf-8,${encodeURIComponent(html)}`
                }
                width="100%"
                height="100%"
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                  width: `${dimensions.width}px`,
                  height: `${dimensions.height}px`,
                  border: "none",
                }}
                title="Responsive Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>

          {/* Device Info */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-sm text-muted-foreground">Device</div>
              <div className="font-medium">{selectedDevice.name}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Resolution</div>
              <div className="font-medium">
                {dimensions.width} × {dimensions.height}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Orientation</div>
              <div className="font-medium capitalize">{orientation}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Zoom</div>
              <div className="font-medium">{zoom}%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Breakpoint Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Responsive Breakpoints Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-lg font-bold text-blue-600">Mobile</div>
              <div className="text-sm text-muted-foreground">320px - 767px</div>
              <div className="text-xs mt-2">Small phones to large phones</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-lg font-bold text-green-600">Tablet</div>
              <div className="text-sm text-muted-foreground">
                768px - 1023px
              </div>
              <div className="text-xs mt-2">Tablets and small laptops</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-lg font-bold text-orange-600">Desktop</div>
              <div className="text-sm text-muted-foreground">
                1024px - 1279px
              </div>
              <div className="text-xs mt-2">Laptops and desktops</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-lg font-bold text-purple-600">Large</div>
              <div className="text-sm text-muted-foreground">1280px+</div>
              <div className="text-xs mt-2">Large desktops and TVs</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
