"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { EncodingDetectionResult, EncodingConversionResult, EncodingConfig } from "@/types";
import { Upload, Download, Play, FileText, CheckCircle, XCircle, AlertTriangle, Settings, Zap } from "lucide-react";

const CharacterEncodingConverterClient: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [sourceEncoding, setSourceEncoding] = useState("auto");
  const [targetEncoding, setTargetEncoding] = useState("utf-8");
  const [detectAutomatically, setDetectAutomatically] = useState(true);
  const [errorHandling, setErrorHandling] = useState<"strict" | "replace" | "ignore">("replace");
  const [replacementChar, setReplacementChar] = useState("�");
  const [result, setResult] = useState<EncodingConversionResult | null>(null);
  const [detectionResult, setDetectionResult] = useState<EncodingDetectionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [conversionProgress, setConversionProgress] = useState(0);

  // Supported encodings
  const supportedEncodings = useMemo(() => [
    { value: "utf-8", label: "UTF-8", description: "Universal character set, variable length" },
    { value: "utf-16", label: "UTF-16", description: "16-bit Unicode, variable length" },
    { value: "utf-16be", label: "UTF-16 BE", description: "UTF-16 Big Endian" },
    { value: "utf-16le", label: "UTF-16 LE", description: "UTF-16 Little Endian" },
    { value: "utf-32", label: "UTF-32", description: "32-bit Unicode, fixed length" },
    { value: "iso-8859-1", label: "ISO-8859-1", description: "Latin-1, Western European" },
    { value: "windows-1252", label: "Windows-1252", description: "Windows Latin-1" },
    { value: "ascii", label: "ASCII", description: "7-bit American Standard Code" },
    { value: "cp437", label: "CP437", description: "DOS Latin US" },
    { value: "macroman", label: "Mac Roman", description: "Macintosh Roman" },
  ], []);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Detect encoding if auto-detection is enabled
      if (detectAutomatically) {
        await detectEncoding(uint8Array);
      }

      // For display purposes, try to decode as UTF-8
      try {
        const text = new TextDecoder('utf-8').decode(uint8Array);
        setInputText(text);
      } catch {
        // If UTF-8 decoding fails, show a message
        setInputText("File uploaded. Encoding will be detected during conversion.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process file");
    } finally {
      setIsProcessing(false);
    }
  }, [detectAutomatically]);

  const detectEncoding = useCallback(async (data: Uint8Array): Promise<void> => {
    try {
      const response = await fetch('/api/tools/character-encoding-converter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'detect',
          data: Buffer.from(data).toString('base64'),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to detect encoding');
      }

      const result: EncodingDetectionResult = await response.json();
      setDetectionResult(result);
      setSourceEncoding(result.encoding);
    } catch (err) {
      setError("Encoding detection failed");
    }
  }, []);

  const detectAnomalies = useCallback((data: Uint8Array, encoding: string): EncodingDetectionResult["anomalies"] => {
    // Anomalies are now detected by the API
    return [];
  }, []);

  const convertEncoding = useCallback(async () => {
    if (!inputText && !uploadedFile) {
      setError("Please enter text or upload a file to convert");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setConversionProgress(0);

    try {
      let sourceData: string;
      let actualSourceEncoding = sourceEncoding;

      if (uploadedFile) {
        const arrayBuffer = await uploadedFile.arrayBuffer();
        sourceData = Buffer.from(arrayBuffer).toString('base64');
        if (detectAutomatically && !detectionResult) {
          await detectEncoding(new Uint8Array(arrayBuffer));
        }
        actualSourceEncoding = detectionResult?.encoding || sourceEncoding;
      } else {
        // For text input, we'll send it as UTF-8 and let the API handle conversion
        sourceData = Buffer.from(inputText, 'utf-8').toString('base64');
        actualSourceEncoding = sourceEncoding === "auto" ? "utf-8" : sourceEncoding;
      }

      setConversionProgress(25);

      // Call the API to convert encoding
      const response = await fetch('/api/tools/character-encoding-converter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'convert',
          data: sourceData,
          sourceEncoding: actualSourceEncoding,
          targetEncoding,
          errorHandling,
          replacementChar,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to convert encoding');
      }

      const apiResult = await response.json();

      setConversionProgress(75);

      // Convert the base64 result back to Uint8Array
      const convertedData = new Uint8Array(Buffer.from(apiResult.convertedData, 'base64'));

      const conversionResult: EncodingConversionResult = {
        originalEncoding: apiResult.originalEncoding,
        targetEncoding: apiResult.targetEncoding,
        originalData: new Uint8Array(Buffer.from(sourceData, 'base64')),
        convertedData,
        convertedText: apiResult.convertedText,
        byteChanges: apiResult.byteChanges,
        characterChanges: apiResult.characterChanges,
      };

      setResult(conversionResult);
      setConversionProgress(100);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed");
    } finally {
      setIsProcessing(false);
      setTimeout(() => setConversionProgress(0), 1000);
    }
  }, [inputText, uploadedFile, sourceEncoding, targetEncoding, detectAutomatically, detectionResult, errorHandling, replacementChar]);

  const downloadResult = useCallback(() => {
    if (!result) return;

    const extension = targetEncoding.includes("utf-16") ? ".txt" :
                     targetEncoding.includes("utf-32") ? ".txt" : ".txt";
    const mimeType = targetEncoding === "utf-8" ? "text/plain;charset=utf-8" : "application/octet-stream";

        const blob = new Blob([new Uint8Array(result.convertedData)], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted_text_${targetEncoding}${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [result, targetEncoding]);

  const copyToClipboard = useCallback(async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result.convertedText);
      // Could add toast notification here
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  }, [result]);

  const formatSize = useCallback((bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }, []);

  const getEncodingInfo = useCallback((encoding: string) => {
    return supportedEncodings.find(enc => enc.value === encoding);
  }, [supportedEncodings]);

  return (
    <div className="space-y-6">
      {/* Configuration Section */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>
            Configure encoding conversion settings and options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="source-encoding">Source Encoding</Label>
              <Select value={sourceEncoding} onValueChange={setSourceEncoding}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto Detect</SelectItem>
                  {supportedEncodings.map((enc) => (
                    <SelectItem key={enc.value} value={enc.value}>
                      {enc.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="target-encoding">Target Encoding</Label>
              <Select value={targetEncoding} onValueChange={setTargetEncoding}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {supportedEncodings.map((enc) => (
                    <SelectItem key={enc.value} value={enc.value}>
                      {enc.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="auto-detect"
                checked={detectAutomatically}
                onCheckedChange={(checked) => setDetectAutomatically(checked === true)}
              />
              <Label htmlFor="auto-detect">Auto Detect Source Encoding</Label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <Label htmlFor="error-handling">Error Handling</Label>
              <Select value={errorHandling} onValueChange={(value: "strict" | "replace" | "ignore") => setErrorHandling(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strict">Strict (Throw Errors)</SelectItem>
                  <SelectItem value="replace">Replace Invalid Chars</SelectItem>
                  <SelectItem value="ignore">Ignore Errors</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="replacement-char">Replacement Character</Label>
              <Input
                id="replacement-char"
                value={replacementChar}
                onChange={(e) => setReplacementChar(e.target.value)}
                maxLength={1}
                disabled={errorHandling !== "replace"}
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={convertEncoding}
                disabled={isProcessing || (!inputText && !uploadedFile)}
                className="w-full"
              >
                {isProcessing ? "Converting..." : "Convert Encoding"}
              </Button>
            </div>
          </div>

          {isProcessing && (
            <div className="mt-4">
              <Label>Conversion Progress</Label>
              <Progress value={conversionProgress} className="mt-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Data Input</CardTitle>
          <CardDescription>
            Upload a file or paste text to convert
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="file-upload">Upload File</Label>
              <Input
                id="file-upload"
                type="file"
                onChange={handleFileUpload}
                accept="text/*,.txt,.csv,.json,.xml,.html"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="text-input">Or Paste Text</Label>
              <Textarea
                id="text-input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your text here..."
                rows={6}
                className="font-mono text-sm mt-1"
              />
            </div>

            {uploadedFile && (
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span className="text-sm">{uploadedFile.name}</span>
                <Badge variant="secondary">{formatSize(uploadedFile.size)}</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detection Results */}
      {detectionResult && (
        <Card>
          <CardHeader>
            <CardTitle>Encoding Detection Results</CardTitle>
            <CardDescription>
              Automatic encoding detection and anomaly analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label className="text-sm font-medium">Detected Encoding</Label>
                <p className="text-lg font-semibold">{detectionResult.encoding.toUpperCase()}</p>
                <p className="text-sm text-muted-foreground">
                  {getEncodingInfo(detectionResult.encoding)?.description}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Confidence</Label>
                <p className="text-lg font-semibold">{(detectionResult.confidence * 100).toFixed(1)}%</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Language</Label>
                <p className="text-lg font-semibold">{detectionResult.language || "Unknown"}</p>
              </div>
            </div>

            {detectionResult.anomalies.length > 0 && (
              <div>
                <Label className="text-sm font-medium mb-2 block">Detected Anomalies ({detectionResult.anomalies.length})</Label>
                <ScrollArea className="h-32 w-full border rounded">
                  <div className="p-2 space-y-1">
                    {detectionResult.anomalies.map((anomaly, index) => (
                      <div key={index} className="text-sm text-orange-600">
                        {anomaly.position >= 0 ? `Position ${anomaly.position}: ` : ""}
                        {anomaly.character ? `"${anomaly.character}" - ` : ""}
                        {anomaly.issue}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Conversion Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Conversion Results</CardTitle>
            <CardDescription>
              Encoding conversion results and statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <Label className="text-sm font-medium">Source</Label>
                <p className="text-lg font-semibold">{result.originalEncoding.toUpperCase()}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Target</Label>
                <p className="text-lg font-semibold">{result.targetEncoding.toUpperCase()}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Byte Changes</Label>
                <p className="text-lg font-semibold">{result.byteChanges}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Char Changes</Label>
                <p className="text-lg font-semibold">{result.characterChanges}</p>
              </div>
            </div>

            <Tabs defaultValue="preview" className="w-full">
              <TabsList>
                <TabsTrigger value="preview">Text Preview</TabsTrigger>
                <TabsTrigger value="comparison">Comparison</TabsTrigger>
                <TabsTrigger value="hex">Hex View</TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Converted Text</Label>
                  <ScrollArea className="h-64 w-full border rounded p-4">
                    <pre className="text-sm font-mono whitespace-pre-wrap">
                      {result.convertedText}
                    </pre>
                  </ScrollArea>
                </div>
              </TabsContent>

              <TabsContent value="comparison" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Original ({result.originalEncoding})</Label>
                    <ScrollArea className="h-48 w-full border rounded p-4">
                      <pre className="text-sm font-mono whitespace-pre-wrap">
                        {inputText || "Original text not available"}
                      </pre>
                    </ScrollArea>
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Converted ({result.targetEncoding})</Label>
                    <ScrollArea className="h-48 w-full border rounded p-4">
                      <pre className="text-sm font-mono whitespace-pre-wrap">
                        {result.convertedText}
                      </pre>
                    </ScrollArea>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="hex" className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Hex Representation</Label>
                  <ScrollArea className="h-64 w-full border rounded p-4">
                    <pre className="text-sm font-mono">
                      {Array.from(result.convertedData.slice(0, 256))
                        .map(b => b.toString(16).padStart(2, '0'))
                        .join(' ')
                        .match(/.{1,48}/g)?.join('\n') || ''}
                      {result.convertedData.length > 256 ? '\n...' : ''}
                    </pre>
                  </ScrollArea>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex space-x-2 mt-4">
              <Button onClick={downloadResult}>
                <Download className="h-4 w-4 mr-2" />
                Download Converted File
              </Button>
              <Button variant="outline" onClick={copyToClipboard}>
                <FileText className="h-4 w-4 mr-2" />
                Copy to Clipboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default CharacterEncodingConverterClient;