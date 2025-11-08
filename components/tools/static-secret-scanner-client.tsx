"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Upload, FileText, AlertTriangle, CheckCircle, XCircle, Download, Eye, EyeOff } from "lucide-react";

interface SecretFinding {
  id: string;
  type: string;
  value: string;
  line: number;
  column: number;
  file: string;
  severity: "high" | "medium" | "low";
  context: string;
  redacted: string;
}

interface ScanResult {
  totalFiles: number;
  totalSecrets: number;
  findings: SecretFinding[];
  scanTime: number;
}

const SECRET_TYPES = [
  { id: "api_keys", label: "API Keys", checked: true },
  { id: "passwords", label: "Passwords", checked: true },
  { id: "tokens", label: "Tokens", checked: true },
  { id: "private_keys", label: "Private Keys", checked: true },
  { id: "credentials", label: "Database Credentials", checked: true },
  { id: "custom", label: "Custom Patterns", checked: false },
];

export default function StaticSecretScannerClient() {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedTypes, setSelectedTypes] = useState(SECRET_TYPES);
  const [showRedacted, setShowRedacted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(selectedFiles);
    setError(null);
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles(droppedFiles);
    setError(null);
  }, []);

  const scanSecrets = async () => {
    if (!input.trim() && files.length === 0) {
      setError("Please provide code input or upload files to scan.");
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("input", input);
      formData.append("secretTypes", JSON.stringify(selectedTypes.filter(t => t.checked).map(t => t.id)));

      files.forEach((file) => {
        formData.append("files", file);
      });

      // Simulate progress
      const progressInterval = setInterval(() => {
        setScanProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch("/api/tools/static-secret-scanner", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error("Failed to scan for secrets");
      }

      const result = await response.json();
      setScanResult(result);
      setScanProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during scanning");
      setScanProgress(0);
    } finally {
      setIsScanning(false);
    }
  };

  const exportResults = () => {
    if (!scanResult) return;

    const dataStr = JSON.stringify(scanResult, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = "secret-scan-results.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-500";
      case "medium": return "bg-orange-500";
      case "low": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Input Source
          </CardTitle>
          <CardDescription>
            Paste code snippets or upload files to scan for secrets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="code" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="code">Code Input</TabsTrigger>
              <TabsTrigger value="files">File Upload</TabsTrigger>
            </TabsList>

            <TabsContent value="code" className="space-y-4">
              <Textarea
                placeholder="Paste your code here to scan for secrets..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
            </TabsContent>

            <TabsContent value="files" className="space-y-4">
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">Drop files here or click to upload</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Support for code files, config files, and text documents
                </p>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".js,.ts,.py,.java,.cpp,.c,.php,.rb,.go,.rs,.swift,.kt,.scala,.sh,.yml,.yaml,.json,.xml,.txt,.md,.env,.config,.conf"
                />
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Selected Files:</h4>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <FileText className="w-4 h-4" />
                        <span className="truncate">{file.name}</span>
                        <span className="text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Scan Options */}
      <Card>
        <CardHeader>
          <CardTitle>Scan Options</CardTitle>
          <CardDescription>
            Select the types of secrets to scan for
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {selectedTypes.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <Checkbox
                  id={type.id}
                  checked={type.checked}
                  onCheckedChange={(checked) => {
                    setSelectedTypes(prev =>
                      prev.map(t => t.id === type.id ? { ...t, checked: !!checked } : t)
                    );
                  }}
                />
                <Label htmlFor={type.id} className="text-sm font-medium">
                  {type.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scan Button */}
      <div className="flex justify-center">
        <Button
          onClick={scanSecrets}
          disabled={isScanning || (!input.trim() && files.length === 0)}
          size="lg"
          className="px-8"
        >
          {isScanning ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Scanning...
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 mr-2" />
              Scan for Secrets
            </>
          )}
        </Button>
      </div>

      {/* Progress Bar */}
      {isScanning && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Scanning in progress...</span>
                <span>{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results Section */}
      {scanResult && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Scan Results
                </CardTitle>
                <CardDescription>
                  Found {scanResult.totalSecrets} potential secrets in {scanResult.totalFiles} files
                  (scanned in {scanResult.scanTime}ms)
                </CardDescription>
              </div>
              <Button onClick={exportResults} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Results
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {scanResult.findings.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                <h3 className="text-lg font-semibold mb-2">No secrets detected!</h3>
                <p className="text-muted-foreground">
                  Your code appears to be free of detectable secrets. Keep up the good security practices!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowRedacted(!showRedacted)}
                  >
                    {showRedacted ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                    {showRedacted ? "Hide" : "Show"} Redacted Values
                  </Button>
                </div>

                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {scanResult.findings.map((finding, index) => (
                      <div key={finding.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge className={getSeverityColor(finding.severity)}>
                              {finding.severity.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">{finding.type}</Badge>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {finding.file}:{finding.line}:{finding.column}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <Label className="text-sm font-medium">Context:</Label>
                            <pre className="text-sm bg-muted p-2 rounded mt-1 overflow-x-auto">
                              {finding.context}
                            </pre>
                          </div>

                          {showRedacted && (
                            <div>
                              <Label className="text-sm font-medium">Redacted Value:</Label>
                              <code className="text-sm bg-muted p-2 rounded mt-1 block">
                                {finding.redacted}
                              </code>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}