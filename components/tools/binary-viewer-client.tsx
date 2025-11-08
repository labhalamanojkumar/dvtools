"use client";

import React, { useState, useCallback, useRef, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { HexViewerResult, HexViewerConfig, HexViewerSearchResult } from "@/types";

const BinaryViewerClient: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<Uint8Array | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<HexViewerConfig>({
    bytesPerLine: 16,
    showAscii: true,
    showLineNumbers: true,
    offsetFormat: "hex",
    startOffset: 0,
    maxLines: 1000,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<HexViewerSearchResult[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [selectedRange, setSelectedRange] = useState<{ start: number; end: number } | null>(null);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);
    setFileData(null);
    setSearchResults([]);
    setSelectedRange(null);
    setBookmarks([]);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      setFile(selectedFile);
      setFileData(uint8Array);
    } catch (err) {
      setError("Failed to read file. Please try again.");
      console.error("File reading error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleConfigChange = useCallback((key: keyof HexViewerConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSearch = useCallback(() => {
    if (!fileData || !searchQuery.trim()) return;

    const results: HexViewerSearchResult[] = [];
    const query = searchQuery.trim();
    const isHex = /^([0-9a-fA-F]{2}\s*)+$/.test(query);

    if (isHex) {
      // Hex search
      const hexBytes = query.split(/\s+/).map(h => parseInt(h, 16));
      for (let i = 0; i <= fileData.length - hexBytes.length; i++) {
        let match = true;
        for (let j = 0; j < hexBytes.length; j++) {
          if (fileData[i + j] !== hexBytes[j]) {
            match = false;
            break;
          }
        }
        if (match) {
          results.push({
            offset: i,
            length: hexBytes.length,
            context: Array.from(fileData.slice(Math.max(0, i - 8), Math.min(fileData.length, i + hexBytes.length + 8))),
            type: "hex",
          });
        }
      }
    } else {
      // Text search
      const textBytes = new TextEncoder().encode(query);
      for (let i = 0; i <= fileData.length - textBytes.length; i++) {
        let match = true;
        for (let j = 0; j < textBytes.length; j++) {
          if (fileData[i + j] !== textBytes[j]) {
            match = false;
            break;
          }
        }
        if (match) {
          results.push({
            offset: i,
            length: textBytes.length,
            context: Array.from(fileData.slice(Math.max(0, i - 8), Math.min(fileData.length, i + textBytes.length + 8))),
            type: "text",
          });
        }
      }
    }

    setSearchResults(results);
    setCurrentSearchIndex(0);
  }, [fileData, searchQuery]);

  const navigateToSearchResult = useCallback((index: number) => {
    if (searchResults[index]) {
      setConfig(prev => ({ ...prev, startOffset: searchResults[index].offset }));
      setCurrentSearchIndex(index);
    }
  }, [searchResults]);

  const addBookmark = useCallback((offset: number) => {
    setBookmarks(prev => [...new Set([...prev, offset])]);
  }, []);

  const removeBookmark = useCallback((offset: number) => {
    setBookmarks(prev => prev.filter(b => b !== offset));
  }, []);

  const exportRange = useCallback(() => {
    if (!fileData || !selectedRange) return;

    const { start, end } = selectedRange;
    const rangeData = fileData.slice(start, end + 1);
    const blob = new Blob([rangeData], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `export_${start.toString(16).padStart(8, "0")}_${end.toString(16).padStart(8, "0")}.bin`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [fileData, selectedRange]);

  const hexViewerResult = useMemo((): HexViewerResult | null => {
    if (!fileData) return null;

    const { bytesPerLine, showAscii, showLineNumbers, offsetFormat, startOffset, maxLines } = config;
    const lines: string[] = [];
    const asciiLines: string[] = [];
    const offsets: string[] = [];

    const endOffset = Math.min(fileData.length, startOffset + (maxLines * bytesPerLine));

    for (let offset = startOffset; offset < endOffset; offset += bytesPerLine) {
      const lineBytes = fileData.slice(offset, Math.min(offset + bytesPerLine, fileData.length));
      const hexLine = Array.from(lineBytes)
        .map(b => b.toString(16).padStart(2, "0"))
        .join(" ");

      const asciiLine = Array.from(lineBytes)
        .map(b => (b >= 32 && b <= 126) ? String.fromCharCode(b) : ".")
        .join("");

      const offsetStr = offsetFormat === "hex"
        ? offset.toString(16).padStart(8, "0")
        : offset.toString().padStart(8, "0");

      lines.push(hexLine);
      asciiLines.push(asciiLine);
      offsets.push(offsetStr);
    }

    return {
      lines,
      asciiLines: showAscii ? asciiLines : [],
      offsets: showLineNumbers ? offsets : [],
      totalBytes: fileData.length,
      displayedBytes: endOffset - startOffset,
      startOffset,
      endOffset,
      bytesPerLine,
    };
  }, [fileData, config]);

  const fileStats = useMemo(() => {
    if (!fileData) return null;

    const entropy = calculateEntropy(fileData);
    const uniqueBytes = new Set(fileData).size;
    const zeroBytes = fileData.filter(b => b === 0).length;
    const printableBytes = fileData.filter(b => b >= 32 && b <= 126).length;

    return {
      size: fileData.length,
      entropy,
      uniqueBytes,
      zeroBytes,
      printableBytes,
      zeroPercentage: (zeroBytes / fileData.length) * 100,
      printablePercentage: (printableBytes / fileData.length) * 100,
    };
  }, [fileData]);

  return (
    <div className="space-y-6">
      {/* File Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>File Upload</CardTitle>
          <CardDescription>
            Select a binary file to analyze. Files are processed locally in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="file-input">Choose File</Label>
              <Input
                id="file-input"
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                accept="*/*"
                className="mt-1"
              />
            </div>
            {file && (
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{file.name}</Badge>
                <Badge variant="outline">{(file.size / 1024).toFixed(2)} KB</Badge>
                <Badge variant="outline">{file.type || "Unknown type"}</Badge>
              </div>
            )}
            {isLoading && (
              <div className="space-y-2">
                <Progress value={undefined} className="w-full" />
                <p className="text-sm text-muted-foreground">Processing file...</p>
              </div>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {fileData && (
        <>
          {/* Configuration Section */}
          <Card>
            <CardHeader>
              <CardTitle>Display Configuration</CardTitle>
              <CardDescription>
                Customize how the binary data is displayed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="bytes-per-line">Bytes per Line</Label>
                  <Select
                    value={config.bytesPerLine.toString()}
                    onValueChange={(value) => handleConfigChange("bytesPerLine", parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8">8</SelectItem>
                      <SelectItem value="16">16</SelectItem>
                      <SelectItem value="32">32</SelectItem>
                      <SelectItem value="64">64</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="offset-format">Offset Format</Label>
                  <Select
                    value={config.offsetFormat}
                    onValueChange={(value: "hex" | "decimal") => handleConfigChange("offsetFormat", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hex">Hexadecimal</SelectItem>
                      <SelectItem value="decimal">Decimal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="max-lines">Max Lines</Label>
                  <Select
                    value={config.maxLines.toString()}
                    onValueChange={(value) => handleConfigChange("maxLines", parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">100</SelectItem>
                      <SelectItem value="500">500</SelectItem>
                      <SelectItem value="1000">1000</SelectItem>
                      <SelectItem value="2000">2000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="start-offset">Start Offset</Label>
                  <Input
                    id="start-offset"
                    type="number"
                    value={config.startOffset}
                    onChange={(e) => handleConfigChange("startOffset", parseInt(e.target.value) || 0)}
                    min="0"
                    max={fileData.length - 1}
                  />
                </div>
              </div>
              <div className="flex space-x-4 mt-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-ascii"
                    checked={config.showAscii}
                    onCheckedChange={(checked) => handleConfigChange("showAscii", checked)}
                  />
                  <Label htmlFor="show-ascii">Show ASCII</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-line-numbers"
                    checked={config.showLineNumbers}
                    onCheckedChange={(checked) => handleConfigChange("showLineNumbers", checked)}
                  />
                  <Label htmlFor="show-line-numbers">Show Line Numbers</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search Section */}
          <Card>
            <CardHeader>
              <CardTitle>Search</CardTitle>
              <CardDescription>
                Search for byte patterns or text strings in the binary data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter hex bytes (e.g., 'FF D8 FF') or text to search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={!searchQuery.trim()}>
                  Search
                </Button>
              </div>
              {searchResults.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Found {searchResults.length} matches
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateToSearchResult(Math.max(0, currentSearchIndex - 1))}
                      disabled={currentSearchIndex === 0}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateToSearchResult(Math.min(searchResults.length - 1, currentSearchIndex + 1))}
                      disabled={currentSearchIndex === searchResults.length - 1}
                    >
                      Next
                    </Button>
                    <span className="text-sm text-muted-foreground self-center">
                      {currentSearchIndex + 1} of {searchResults.length}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Hex Viewer */}
          <Card>
            <CardHeader>
              <CardTitle>Hex Viewer</CardTitle>
              <CardDescription>
                Binary data displayed in hexadecimal format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 w-full rounded-md border p-4 font-mono text-sm">
                {hexViewerResult && (
                  <div className="space-y-1">
                    {hexViewerResult.lines.map((line, index) => (
                      <div key={index} className="flex space-x-4 hover:bg-muted/50 px-2 py-1 rounded">
                        {hexViewerResult.offsets[index] && (
                          <span className="text-muted-foreground w-20 flex-shrink-0">
                            {hexViewerResult.offsets[index]}
                          </span>
                        )}
                        <span className="flex-1 font-mono">{line}</span>
                        {hexViewerResult.asciiLines[index] && (
                          <span className="text-muted-foreground flex-shrink-0">
                            {hexViewerResult.asciiLines[index]}
                          </span>
                        )}
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => addBookmark(parseInt(hexViewerResult.offsets[index], 16))}
                            className="h-6 w-6 p-0"
                          >
                            🔖
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* File Statistics */}
          {fileStats && (
            <Card>
              <CardHeader>
                <CardTitle>File Statistics</CardTitle>
                <CardDescription>
                  Analysis of the binary file structure and content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-sm font-medium">File Size</Label>
                    <p className="text-2xl font-bold">{fileStats.size.toLocaleString()} bytes</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Entropy</Label>
                    <p className="text-2xl font-bold">{fileStats.entropy.toFixed(4)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Unique Bytes</Label>
                    <p className="text-2xl font-bold">{fileStats.uniqueBytes}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Zero Bytes</Label>
                    <p className="text-2xl font-bold">{fileStats.zeroBytes} ({fileStats.zeroPercentage.toFixed(1)}%)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bookmarks */}
          {bookmarks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Bookmarks</CardTitle>
                <CardDescription>
                  Saved positions in the file
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {bookmarks.map((bookmark) => (
                    <Button
                      key={bookmark}
                      variant="outline"
                      size="sm"
                      onClick={() => setConfig(prev => ({ ...prev, startOffset: bookmark }))}
                    >
                      {bookmark.toString(16).padStart(8, "0")}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeBookmark(bookmark);
                        }}
                        className="ml-2 h-4 w-4 p-0"
                      >
                        ×
                      </Button>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Export Section */}
          {selectedRange && (
            <Card>
              <CardHeader>
                <CardTitle>Export Range</CardTitle>
                <CardDescription>
                  Export the selected byte range as a binary file
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <span>
                    Range: 0x{selectedRange.start.toString(16).padStart(8, "0")} - 0x{selectedRange.end.toString(16).padStart(8, "0")}
                  </span>
                  <Button onClick={exportRange}>Export</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

// Utility function to calculate entropy
function calculateEntropy(data: Uint8Array): number {
  const counts = new Array(256).fill(0);
  for (const byte of data) {
    counts[byte]++;
  }

  let entropy = 0;
  for (const count of counts) {
    if (count > 0) {
      const p = count / data.length;
      entropy -= p * Math.log2(p);
    }
  }

  return entropy;
}

export default BinaryViewerClient;