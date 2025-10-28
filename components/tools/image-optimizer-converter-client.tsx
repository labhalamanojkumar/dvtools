"use client";

import { useState, useRef, useCallback } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  Download,
  Image as ImageIcon,
  Zap,
  Settings,
  FileImage,
  Shrink,
  Palette,
  RotateCcw,
  Copy,
  Trash2,
} from "lucide-react";
import { useToast } from "@/components/ui/toaster";

interface ImageFile {
  file: File;
  preview: string;
  optimized?: Blob;
  originalSize: number;
  optimizedSize?: number;
  format: string;
  dimensions: { width: number; height: number };
  status: "pending" | "processing" | "completed" | "error";
  error?: string;
}

interface OptimizationSettings {
  quality: number;
  format: "webp" | "jpeg" | "png" | "avif";
  maxWidth?: number;
  maxHeight?: number;
  maintainAspectRatio: boolean;
}

const supportedFormats = [
  {
    value: "webp",
    label: "WebP",
    description: "Best compression, modern browsers",
  },
  {
    value: "jpeg",
    label: "JPEG",
    description: "Good for photos, smaller file size",
  },
  { value: "png", label: "PNG", description: "Lossless, good for graphics" },
  {
    value: "avif",
    label: "AVIF",
    description: "Best compression, limited browser support",
  },
];

export default function ImageOptimizerConverterClient() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [settings, setSettings] = useState<OptimizationSettings>({
    quality: 80,
    format: "webp",
    maintainAspectRatio: true,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);

      if (files.length === 0) return;

      // Check file types
      const validFiles = files.filter((file) => {
        const isValidType = file.type.startsWith("image/");
        if (!isValidType) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not a supported image format`,
            variant: "destructive",
          });
        }
        return isValidType;
      });

      if (validFiles.length === 0) return;

      // Process each file
      validFiles.forEach(async (file) => {
        const preview = URL.createObjectURL(file);

        // Get image dimensions
        const img = new Image();
        img.onload = () => {
          const newImage: ImageFile = {
            file,
            preview,
            originalSize: file.size,
            format: file.type.split("/")[1].toUpperCase(),
            dimensions: { width: img.width, height: img.height },
            status: "pending",
          };

          setImages((prev) => [...prev, newImage]);
          URL.revokeObjectURL(preview);
        };
        img.src = preview;
      });

      // Reset input
      event.target.value = "";
    },
    [toast],
  );

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      if (newImages[index].optimized) {
        URL.revokeObjectURL(URL.createObjectURL(newImages[index].optimized!));
      }
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const getImageDimensions = (
    file: File,
  ): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.src = URL.createObjectURL(file);
    });
  };

  const optimizeImage = async (
    image: ImageFile,
    settings: OptimizationSettings,
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context not available"));
        return;
      }

      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;

        if (settings.maxWidth && width > settings.maxWidth) {
          height = (height * settings.maxWidth) / width;
          width = settings.maxWidth;
        }

        if (settings.maxHeight && height > settings.maxHeight) {
          width = (width * settings.maxHeight) / height;
          height = settings.maxHeight;
        }

        // Set canvas size
        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to compress image"));
            }
          },
          `image/${settings.format}`,
          settings.quality / 100,
        );
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = image.preview;
    });
  };

  const processBatch = async () => {
    if (images.length === 0) {
      toast({
        title: "No images",
        description: "Please add some images to optimize",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setBatchProgress(0);

    const updatedImages = [...images];

    for (let i = 0; i < images.length; i++) {
      try {
        updatedImages[i].status = "processing";
        setImages([...updatedImages]);

        const optimized = await optimizeImage(images[i], settings);
        updatedImages[i] = {
          ...updatedImages[i],
          optimized,
          optimizedSize: optimized.size,
          status: "completed",
        };

        setImages([...updatedImages]);
      } catch (error) {
        updatedImages[i] = {
          ...updatedImages[i],
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        };
        setImages([...updatedImages]);
      }

      setBatchProgress(((i + 1) / images.length) * 100);
    }

    setIsProcessing(false);

    const successful = updatedImages.filter(
      (img) => img.status === "completed",
    ).length;
    toast({
      title: "Batch processing complete",
      description: `Successfully optimized ${successful} of ${images.length} images`,
    });
  };

  const downloadImage = (
    image: ImageFile,
    type: "original" | "optimized" = "optimized",
  ) => {
    const blob = type === "optimized" ? image.optimized : image.file;
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    const extension =
      type === "optimized" ? settings.format : image.format.toLowerCase();
    link.download = `${image.file.name.replace(/\.[^/.]+$/, "")}_${type}.${extension}`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    const completedImages = images.filter((img) => img.status === "completed");
    if (completedImages.length === 0) return;

    completedImages.forEach((image) => downloadImage(image, "optimized"));
  };

  const clearAll = () => {
    images.forEach((image) => {
      URL.revokeObjectURL(image.preview);
      if (image.optimized) {
        URL.revokeObjectURL(URL.createObjectURL(image.optimized));
      }
    });
    setImages([]);
    setBatchProgress(0);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getCompressionRatio = (original: number, optimized: number) => {
    if (!optimized) return 0;
    return ((original - optimized) / original) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
            <FileImage className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">
              Drop images here or click to browse
            </p>
            <p className="text-muted-foreground mb-4">
              Supports JPEG, PNG, WebP, and other common image formats
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button onClick={() => fileInputRef.current?.click()}>
              Choose Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Optimization Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="format">Output Format</Label>
              <Select
                value={settings.format}
                onValueChange={(value) =>
                  setSettings((prev) => ({ ...prev, format: value as any }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {supportedFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quality">Quality ({settings.quality}%)</Label>
              <Input
                id="quality"
                type="range"
                min="1"
                max="100"
                value={settings.quality}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    quality: parseInt(e.target.value),
                  }))
                }
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="max-width">Max Width (px)</Label>
              <Input
                id="max-width"
                type="number"
                placeholder="Optional"
                value={settings.maxWidth || ""}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    maxWidth: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  }))
                }
              />
            </div>

            <div>
              <Label htmlFor="max-height">Max Height (px)</Label>
              <Input
                id="max-height"
                type="number"
                placeholder="Optional"
                value={settings.maxHeight || ""}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    maxHeight: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  }))
                }
              />
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            {
              supportedFormats.find((f) => f.value === settings.format)
                ?.description
            }
          </div>
        </CardContent>
      </Card>

      {/* Images List */}
      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Images ({images.length})
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={processBatch}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Zap className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Shrink className="mr-2 h-4 w-4" />
                      Optimize All
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadAll}
                  disabled={!images.some((img) => img.status === "completed")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download All
                </Button>
                <Button variant="outline" size="sm" onClick={clearAll}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isProcessing && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Processing images...</span>
                  <span>{Math.round(batchProgress)}%</span>
                </div>
                <Progress value={batchProgress} />
              </div>
            )}

            <ScrollArea className="h-[600px] w-full">
              <div className="space-y-4">
                {images.map((image, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <img
                          src={image.preview}
                          alt={image.file.name}
                          className="w-20 h-20 object-cover rounded border"
                        />
                        <Badge
                          variant={
                            image.status === "completed"
                              ? "default"
                              : image.status === "error"
                                ? "destructive"
                                : image.status === "processing"
                                  ? "secondary"
                                  : "outline"
                          }
                          className="absolute -top-2 -right-2"
                        >
                          {image.status}
                        </Badge>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium truncate">
                            {image.file.name}
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeImage(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">
                              Original
                            </div>
                            <div className="font-medium">
                              {formatBytes(image.originalSize)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {image.dimensions.width} ×{" "}
                              {image.dimensions.height}
                            </div>
                          </div>

                          {image.optimizedSize && (
                            <div>
                              <div className="text-muted-foreground">
                                Optimized
                              </div>
                              <div className="font-medium text-green-600">
                                {formatBytes(image.optimizedSize)}
                              </div>
                              <div className="text-xs text-green-600">
                                -
                                {getCompressionRatio(
                                  image.originalSize,
                                  image.optimizedSize,
                                ).toFixed(1)}
                                %
                              </div>
                            </div>
                          )}

                          <div>
                            <div className="text-muted-foreground">Format</div>
                            <div className="font-medium">{image.format}</div>
                          </div>

                          {image.status === "completed" && (
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  downloadImage(image, "optimized")
                                }
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>

                        {image.error && (
                          <div className="mt-2 text-sm text-red-600">
                            Error: {image.error}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{images.length}</div>
              <p className="text-xs text-muted-foreground">Total Images</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {images.filter((img) => img.status === "completed").length}
              </div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">
                {formatBytes(
                  images.reduce((sum, img) => sum + img.originalSize, 0),
                )}
              </div>
              <p className="text-xs text-muted-foreground">Original Size</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {formatBytes(
                  images.reduce(
                    (sum, img) => sum + (img.optimizedSize || 0),
                    0,
                  ),
                )}
              </div>
              <p className="text-xs text-muted-foreground">Optimized Size</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
