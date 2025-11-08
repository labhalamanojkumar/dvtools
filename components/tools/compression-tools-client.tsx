"use client";

import { useState, useCallback, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { 
  Upload, 
  Download, 
  FileArchive, 
  Info, 
  Zap, 
  Shield, 
  BarChart3,
  Trash2,
  Settings,
  AlertCircle
} from "lucide-react";

interface CompressionResult {
  id: string;
  fileName: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  algorithm: string;
  level: number;
  processingTime: number;
  compressedData?: string;
  timestamp: Date;
}

interface ComparisonResult {
  fileName: string;
  originalSize: number;
  results: {
    algorithm: string;
    level: number;
    compressedSize: number;
    compressionRatio: number;
    processingTime: number;
  }[];
}

export default function CompressionToolsClient() {
  const [files, setFiles] = useState<CompressionResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [algorithm, setAlgorithm] = useState<"gzip" | "brotli" | "zstd">("gzip");
  const [compressionLevel, setCompressionLevel] = useState<number>(6);
  const [comparisonResults, setComparisonResults] = useState<ComparisonResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const compareInputRef = useRef<HTMLInputElement>(null);

  const getMaxLevel = (algo: string) => {
    switch (algo) {
      case "gzip": return 9;
      case "brotli": return 11;
      case "zstd": return 22;
      default: return 9;
    }
  };

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    setIsProcessing(true);

    // Process files in parallel for better performance
    const filePromises = Array.from(uploadedFiles).map(async (file, i) => {
      if (file.size > 100 * 1024 * 1024) {
        toast.error(`File ${file.name} exceeds 100MB limit`);
        return null;
      }

      try {
        const arrayBuffer = await file.arrayBuffer();
        
        // More efficient base64 conversion using chunks
        const uint8Array = new Uint8Array(arrayBuffer);
        const chunkSize = 32768; // 32KB chunks
        let base64Data = '';
        
        for (let offset = 0; offset < uint8Array.length; offset += chunkSize) {
          const chunk = uint8Array.subarray(offset, offset + chunkSize);
          base64Data += String.fromCharCode.apply(null, Array.from(chunk));
        }
        base64Data = btoa(base64Data);

        const startTime = performance.now();
        
        const response = await fetch("/api/tools/compression", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "compress",
            data: base64Data,
            algorithm,
            level: compressionLevel,
            fileName: file.name
          })
        });

        const endTime = performance.now();

        if (!response.ok) {
          const error = await response.json();
          toast.error(`Failed to compress ${file.name}: ${error.error}`);
          return null;
        }

        const result = await response.json();

        return {
          id: `${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
          fileName: file.name,
          originalSize: file.size,
          compressedSize: result.compressedSize,
          compressionRatio: result.compressionRatio,
          algorithm,
          level: compressionLevel,
          processingTime: endTime - startTime,
          compressedData: result.compressedData,
          timestamp: new Date()
        } as CompressionResult;

      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        toast.error(`Failed to process ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return null;
      }
    });

    const results = await Promise.all(filePromises);
    const successfulResults = results.filter((result): result is CompressionResult => result !== null);
    
    if (successfulResults.length > 0) {
      setFiles(prev => [...successfulResults, ...prev]);
      toast.success(`Successfully compressed ${successfulResults.length} file${successfulResults.length > 1 ? 's' : ''}`);
    }

    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [algorithm, compressionLevel]);

  const handleDownload = useCallback((result: CompressionResult) => {
    if (!result.compressedData) {
      toast.error("Compressed data not available");
      return;
    }

    try {
      // More efficient binary conversion using chunks
      const binaryString = atob(result.compressedData);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      
      // Batch character code extraction for better performance
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${result.fileName}.${result.algorithm}`;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      
      // Cleanup after a short delay to ensure download starts
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast.success("File downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download file");
    }
  }, []);

  const handleDecompress = useCallback(async (result: CompressionResult) => {
    if (!result.compressedData) {
      toast.error("Compressed data not available");
      return;
    }

    try {
      setIsProcessing(true);

      const response = await fetch("/api/tools/compression", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "decompress",
          data: result.compressedData,
          algorithm: result.algorithm,
          fileName: result.fileName
        })
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(`Decompression failed: ${error.error}`);
        return;
      }

      const decompressedResult = await response.json();

      // Efficient binary conversion
      const binaryString = atob(decompressedResult.decompressedData);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.fileName;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);

      toast.success("File decompressed and downloaded");
    } catch (error) {
      console.error("Decompression error:", error);
      toast.error("Failed to decompress file");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleCompareAlgorithms = async (providedFile?: File) => {
    const file = providedFile || fileInputRef.current?.files?.[0];
    
    if (!file) {
      toast.error("Please select a file first");
      return;
    }
    
    if (file.size > 100 * 1024 * 1024) {
      toast.error("File exceeds 100MB limit");
      return;
    }

    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Efficient chunked base64 conversion
      const chunkSize = 32768;
      let base64Data = '';
      
      for (let i = 0; i < uint8Array.length; i += chunkSize) {
        const chunk = uint8Array.slice(i, i + chunkSize);
        base64Data += String.fromCharCode.apply(null, Array.from(chunk));
      }
      
      base64Data = btoa(base64Data);

      const algorithms: Array<"gzip" | "brotli" | "zstd"> = ["gzip", "brotli", "zstd"];
      const results = [];

      for (const algo of algorithms) {
        const startTime = performance.now();
        
        const response = await fetch("/api/tools/compression", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "compress",
            data: base64Data,
            algorithm: algo,
            level: 6,
            fileName: file.name
          })
        });

        const endTime = performance.now();

        if (response.ok) {
          const result = await response.json();
          results.push({
            algorithm: algo,
            level: 6,
            compressedSize: result.compressedSize,
            compressionRatio: ((1 - result.compressedSize / file.size) * 100),
            processingTime: endTime - startTime
          });
        }
      }

      setComparisonResults({
        fileName: file.name,
        originalSize: file.size,
        results
      });

      toast.success("Comparison complete");
    } catch (error) {
      console.error("Comparison error:", error);
      toast.error("Failed to compare algorithms");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const clearHistory = () => {
    setFiles([]);
    setComparisonResults(null);
    toast.success("History cleared");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Tabs defaultValue="compress" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="compress">Compress Files</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="compare">Compare Algorithms</TabsTrigger>
        </TabsList>

        <TabsContent value="compress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileArchive className="w-5 h-5" />
                File Compression
              </CardTitle>
              <CardDescription>
                Compress files using Gzip, Brotli, or Zstandard algorithms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="w-4 h-4" />
                <AlertDescription>
                  Maximum file size: 100MB. Supported formats: All file types
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="algorithm">Compression Algorithm</Label>
                  <Select value={algorithm} onValueChange={(value: any) => setAlgorithm(value)}>
                    <SelectTrigger id="algorithm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gzip">Gzip (Standard)</SelectItem>
                      <SelectItem value="brotli">Brotli (Web Optimized)</SelectItem>
                      <SelectItem value="zstd">Zstandard (Fast & Efficient)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">
                    Compression Level (1-{getMaxLevel(algorithm)})
                  </Label>
                  <Input
                    id="level"
                    type="number"
                    min="1"
                    max={getMaxLevel(algorithm)}
                    value={compressionLevel}
                    onChange={(e) => setCompressionLevel(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Select Files</Label>
                <Input
                  id="file"
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  disabled={isProcessing}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isProcessing ? "Processing..." : "Upload & Compress"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleCompareAlgorithms()}
                  disabled={isProcessing}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Compare Algorithms
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Speed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      {algorithm === "gzip" && "Balanced speed and compression"}
                      {algorithm === "brotli" && "Slower, better compression"}
                      {algorithm === "zstd" && "Fastest processing"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Efficiency
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      {algorithm === "gzip" && "Standard compression ratio"}
                      {algorithm === "brotli" && "Highest compression ratio"}
                      {algorithm === "zstd" && "Excellent balance"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Use Case
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      {algorithm === "gzip" && "General purpose"}
                      {algorithm === "brotli" && "Web assets, fonts"}
                      {algorithm === "zstd" && "Large files, databases"}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Compression History</CardTitle>
                  <CardDescription>View and download your compressed files</CardDescription>
                </div>
                {files.length > 0 && (
                  <Button variant="outline" size="sm" onClick={clearHistory}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Algorithm</TableHead>
                    <TableHead>Original Size</TableHead>
                    <TableHead>Compressed Size</TableHead>
                    <TableHead>Ratio</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {files.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell className="font-medium">{file.fileName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{file.algorithm.toUpperCase()}</Badge>
                      </TableCell>
                      <TableCell>{formatBytes(file.originalSize)}</TableCell>
                      <TableCell>{formatBytes(file.compressedSize)}</TableCell>
                      <TableCell>
                        <Badge variant={file.compressionRatio > 50 ? "default" : "secondary"}>
                          {file.compressionRatio.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell>{file.processingTime.toFixed(0)}ms</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(file)}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDecompress(file)}
                          >
                            Decompress
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {files.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileArchive className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No files processed yet. Upload files to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compare" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Algorithm Comparison</CardTitle>
              <CardDescription>
                Compare compression performance across different algorithms
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Hidden file input - always present in DOM */}
              <input
                type="file"
                ref={compareInputRef}
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleCompareAlgorithms(e.target.files[0]);
                    // Reset input so same file can be selected again
                    e.target.value = '';
                  }
                }}
                disabled={isProcessing}
              />
              
              {!comparisonResults && (
                <div className="space-y-4 mb-6">
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload a file to compare all compression algorithms
                    </p>
                    <Button
                      onClick={() => compareInputRef.current?.click()}
                      disabled={isProcessing}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isProcessing ? "Processing..." : "Select File to Compare"}
                    </Button>
                  </div>
                </div>
              )}

              {comparisonResults ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div>
                      <p className="font-semibold">{comparisonResults.fileName}</p>
                      <p className="text-sm text-muted-foreground">
                        Original Size: {formatBytes(comparisonResults.originalSize)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => compareInputRef.current?.click()}
                        disabled={isProcessing}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Compare Another
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setComparisonResults(null)}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Algorithm</TableHead>
                        <TableHead>Compressed Size</TableHead>
                        <TableHead>Compression Ratio</TableHead>
                        <TableHead>Processing Time</TableHead>
                        <TableHead>Efficiency Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comparisonResults.results.map((result, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Badge variant="outline">{result.algorithm.toUpperCase()}</Badge>
                          </TableCell>
                          <TableCell>{formatBytes(result.compressedSize)}</TableCell>
                          <TableCell>
                            <Badge variant={result.compressionRatio > 50 ? "default" : "secondary"}>
                              {result.compressionRatio.toFixed(1)}%
                            </Badge>
                          </TableCell>
                          <TableCell>{result.processingTime.toFixed(0)}ms</TableCell>
                          <TableCell>
                            <Badge>
                              {(result.compressionRatio / (result.processingTime / 1000)).toFixed(1)} pts
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <Alert>
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription>
                      <strong>Recommendation:</strong>{" "}
                      {comparisonResults.results.reduce((best, current) =>
                        current.compressionRatio > best.compressionRatio ? current : best
                      ).algorithm.toUpperCase()}{" "}
                      provides the best compression ratio for this file.
                    </AlertDescription>
                  </Alert>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}