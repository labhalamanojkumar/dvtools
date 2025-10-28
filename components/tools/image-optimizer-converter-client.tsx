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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Upload,
  Download,
  Image as ImageIcon,
  Zap,
  Settings,
  FileImage,
  Shrink,
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
  const [useServer, setUseServer] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
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

      // Process each file sequentially to avoid race conditions
      for (const file of validFiles) {
        try {
          const preview = URL.createObjectURL(file);

          // Get image dimensions
          const dimensions = await getImageDimensions(file);

          const newImage: ImageFile = {
            file,
            preview,
            originalSize: file.size,
            format: file.type.split("/")[1].toUpperCase(),
            dimensions,
            status: "pending",
          };

          setImages((prev) => [...prev, newImage]);
        } catch (error) {
          toast({
            title: "Error loading image",
            description: `Failed to load ${file.name}`,
            variant: "destructive",
          });
        }
      }

      // Reset input
      event.target.value = "";
    },
    [toast],
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length === 0) return;

      // Process files directly instead of creating synthetic event
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

      // Process each file sequentially to avoid race conditions
      for (const file of validFiles) {
        try {
          const preview = URL.createObjectURL(file);

          // Get image dimensions
          const dimensions = await getImageDimensions(file);

          const newImage: ImageFile = {
            file,
            preview,
            originalSize: file.size,
            format: file.type.split("/")[1].toUpperCase(),
            dimensions,
            status: "pending",
          };

          setImages((prev) => [...prev, newImage]);
        } catch (error) {
          toast({
            title: "Error loading image",
            description: `Failed to load ${file.name}`,
            variant: "destructive",
          });
        }
      }
    },
    [toast],
  );

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      // We don't keep a persistent object URL for the optimized blob
      // (we create and revoke it on download). So don't create/revoke
      // a new temporary URL here — it is unnecessary.
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = () => reject(new Error("Failed to load image"));
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
        try {
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

          // Try to export using the requested format. Some browsers
          // (or platforms) may not support all MIME types (eg. WebP / AVIF).
          // If the first attempt yields a null blob, try safe fallbacks.
          const tryExport = (
            types: { mime: string; quality?: number }[],
            idx = 0,
          ) => {
            if (idx >= types.length) {
              reject(new Error("Failed to compress image: unsupported format"));
              return;
            }

            const { mime, quality } = types[idx];
            canvas.toBlob(
              (blob) => {
                if (blob && blob.size > 0) {
                  // If we had to fallback (idx > 0), notify the user once.
                  if (idx > 0) {
                    try {
                      toast?.({
                        title: "Format fallback",
                        description: `Requested format not supported in this browser; exported as ${mime.split('/').pop()}`,
                      });
                    } catch (e) {
                      /* ignore toast failures */
                    }
                  }

                  resolve(blob);
                } else {
                  // try next fallback
                  tryExport(types, idx + 1);
                }
              },
              mime,
              quality,
            );
          };

          const preferredMime = `image/${settings.format}`;
          // Fallback order: preferred -> jpeg -> png
          const mimeAttempts = [
            { mime: preferredMime, quality: settings.quality / 100 },
            { mime: "image/jpeg", quality: settings.quality / 100 },
            { mime: "image/png" },
          ];

          tryExport(mimeAttempts);
        } catch (error) {
          reject(new Error("Failed to process image"));
        }
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

        if (useServer) {
          // Send image to server-side conversion endpoint as data URL
          try {
            const dataUrl = await fileToDataUrl(images[i].file);
            const res = await fetch("/api/tools/image-optimizer", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                image: dataUrl,
                format: settings.format,
                quality: settings.quality,
              }),
            });

            if (!res.ok) {
              const text = await res.text();
              throw new Error(text || `Server conversion failed: ${res.status}`);
            }

            const blob = await res.blob();
            updatedImages[i] = {
              ...updatedImages[i],
              optimized: blob,
              optimizedSize: blob.size,
              status: "completed",
            };
          } catch (err) {
            throw err;
          }
        } else {
          const optimized = await optimizeImage(images[i], settings);
          updatedImages[i] = {
            ...updatedImages[i],
            optimized,
            optimizedSize: optimized.size,
            status: "completed",
          };
        }

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

    const url = URL.createObjectURL(blob as Blob);
    const link = document.createElement("a");
    link.href = url;

    // Derive extension from the blob MIME type when possible to match
    // the actual exported format (falls back to settings/filename).
    const mimeType = (blob as Blob).type || "";
    let extension = "";
    if (mimeType) {
      extension = mimeType.split("/").pop() || "bin";
      // normalize jpeg -> jpg for nicer filenames
      if (extension === "jpeg") extension = "jpg";
    } else {
      extension = type === "optimized" ? settings.format : image.format.toLowerCase();
    }

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

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
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
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <FileImage className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">
              {isDragOver ? "Drop images here" : "Drop images here or click to browse"}
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
            <div className="col-span-full flex items-center gap-2">
              <input
                id="use-server"
                type="checkbox"
                checked={useServer}
                onChange={(e) => setUseServer(e.target.checked)}
                className="mr-2"
              />
              <Label htmlFor="use-server">Use server-side conversion</Label>
            </div>
            <div>
              <Label htmlFor="format">Output Format</Label>
              <Select
                value={settings.format}
                onValueChange={(value: "webp" | "jpeg" | "png" | "avif") =>
                  setSettings((prev) => ({ ...prev, format: value }))
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
                            <div className="flex gap-2 mt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  downloadImage(image, "optimized")
                                }
                                className="flex items-center gap-1"
                              >
                                <Download className="h-3 w-3" />
                                Download Optimized
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  downloadImage(image, "original")
                                }
                                className="text-xs"
                              >
                                Original
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

      {/* Download Summary */}
      {images.some((img) => img.status === "completed") && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Download Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {images.filter((img) => img.status === "completed").length}
                </div>
                <p className="text-sm text-muted-foreground">Images Optimized</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {formatBytes(
                    images.reduce(
                      (sum, img) => sum + (img.optimizedSize || 0),
                      0,
                    ),
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Total Optimized Size</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {images.length > 0
                    ? Math.round(
                        images.reduce(
                          (sum, img) =>
                            sum +
                            getCompressionRatio(
                              img.originalSize,
                              img.optimizedSize || 0,
                            ),
                          0,
                        ) / images.filter((img) => img.optimizedSize).length,
                      )
                    : 0}
                  %
                </div>
                <p className="text-sm text-muted-foreground">Avg. Compression</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={downloadAll}
                disabled={!images.some((img) => img.status === "completed")}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download All Optimized Images
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const completedImages = images.filter(
                    (img) => img.status === "completed",
                  );
                  if (completedImages.length === 0) return;

                  const csvContent = [
                    ["Filename", "Original Size", "Optimized Size", "Compression %", "Format"],
                    ...completedImages.map((img) => [
                      img.file.name,
                      formatBytes(img.originalSize),
                      formatBytes(img.optimizedSize || 0),
                      getCompressionRatio(
                        img.originalSize,
                        img.optimizedSize || 0,
                      ).toFixed(1) + "%",
                      settings.format.toUpperCase(),
                    ]),
                  ]
                    .map((row) => row.map((cell) => `"${cell}"`).join(","))
                    .join("\n");

                  const blob = new Blob([csvContent], { type: "text/csv" });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = "optimization-report.csv";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);

                  toast({
                    title: "Report Downloaded",
                    description: "Optimization report saved as CSV",
                  });
                }}
                disabled={!images.some((img) => img.status === "completed")}
                className="flex items-center gap-2"
              >
                <FileImage className="h-4 w-4" />
                Download Report (CSV)
              </Button>
            </div>

            <div className="text-sm text-muted-foreground text-center">
              💡 Tip: Individual download buttons are available for each optimized image above
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
