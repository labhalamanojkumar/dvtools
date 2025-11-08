"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/toaster";
import { Loader2, Code, AlertTriangle, CheckCircle, Zap, Settings, FileText, Copy, Download } from "lucide-react";

interface LintIssue {
  line: number;
  column: number;
  severity: "error" | "warning" | "info";
  message: string;
  rule: string;
  source: string;
}

interface OptimizationResult {
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
  changes: string[];
}

interface CssLintResult {
  issues: LintIssue[];
  optimizedCss: string;
  optimization: OptimizationResult;
  valid: boolean;
}

interface LintConfig {
  rules: {
    [key: string]: boolean | string | number;
  };
  optimization: {
    removeComments: boolean;
    removeWhitespace: boolean;
    shortenColors: boolean;
    combineSelectors: boolean;
    removeEmptyRules: boolean;
    minify: boolean;
  };
}

export default function CssLinterOptimizerClient() {
  const { toast } = useToast();

  // File drag & drop state
  const [isDragging, setIsDragging] = useState(false);
  const [isReadingFile, setIsReadingFile] = useState(false);

  // CSS input and configuration
  const [cssInput, setCssInput] = useState("");
  const [config, setConfig] = useState<LintConfig>({
    rules: {
      "no-empty-rules": true,
      "no-duplicate-properties": true,
      "no-invalid-properties": true,
      "no-unknown-properties": false,
      "property-case": "lower",
      "selector-max-depth": 3,
      "no-important": false,
    },
    optimization: {
      removeComments: true,
      removeWhitespace: true,
      shortenColors: true,
      combineSelectors: false,
      removeEmptyRules: true,
      minify: true,
    },
  });

  // Results state
  const [result, setResult] = useState<CssLintResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("input");

  const handleConfigChange = (category: "rules" | "optimization", key: string, value: boolean | string | number) => {
    setConfig(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const analyzeCss = useCallback(async () => {
    if (!cssInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter CSS code to analyze",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/tools/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: "css-linter-optimizer",
          input: cssInput,
          config,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.result);
        setActiveTab("results");
        toast({
          title: "Success",
          description: "CSS analysis completed",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to analyze CSS",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to the server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [cssInput, config, toast]);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Success",
        description: "Copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  }, [toast]);

  const downloadResult = useCallback((content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "error":
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Error</Badge>;
      case "warning":
        return <Badge variant="secondary" className="bg-yellow-500"><AlertTriangle className="w-3 h-3 mr-1" />Warning</Badge>;
      default:
        return <Badge variant="outline"><CheckCircle className="w-3 h-3 mr-1" />Info</Badge>;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "error":
        return "text-red-600";
      case "warning":
        return "text-yellow-600";
      default:
        return "text-blue-600";
    }
  };

  // File upload handlers
  const readCssFile = async (file: File): Promise<void> => {
    if (!file) return;

    // Check file type
    if (!file.type && !file.name.endsWith('.css')) {
      toast({
        title: "Error",
        description: "Please provide a valid CSS file",
        variant: "destructive",
      });
      return;
    }

    if (file.type !== "text/css" && !file.name.endsWith('.css')) {
      toast({
        title: "Error",
        description: "Please provide a valid CSS file",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsReadingFile(true);
    try {
      const text = await file.text();
      if (text.trim().length === 0) {
        toast({
          title: "Error",
          description: "The CSS file is empty",
          variant: "destructive",
        });
        return;
      }
      setCssInput(text);
      toast({
        title: "Success",
        description: `Loaded ${file.name} successfully`,
      });
    } catch (error) {
      console.error('Error reading file:', error);
      toast({
        title: "Error",
        description: "Failed to read the CSS file",
        variant: "destructive",
      });
    } finally {
      setIsReadingFile(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await readCssFile(file);
    }
    // Reset input value to allow uploading the same file again
    event.target.value = '';
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      await readCssFile(file);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Code className="w-6 h-6" />
        <h1 className="text-3xl font-bold">CSS Linter & Optimizer</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="input">CSS Input</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>CSS Code Input</CardTitle>
              <CardDescription>
                Enter your CSS code to lint and optimize
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="file-upload"
                    accept=".css"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center justify-center"
                  >
                    {isReadingFile ? (
                      <Loader2 className="w-12 h-12 mb-4 animate-spin text-primary" />
                    ) : (
                      <FileText className={`w-12 h-12 mb-4 transition-colors ${
                        isDragging ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                    )}
                    <span className="text-sm font-medium mb-2">
                      {isReadingFile
                        ? 'Reading file...'
                        : isDragging
                          ? 'Drop your CSS file here'
                          : 'Drag & drop your CSS file here or click to browse'
                      }
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Supports .css files up to 5MB
                    </span>
                  </label>
                </div>

                <div className="flex items-center">
                  <Separator className="flex-1" />
                  <span className="mx-4 text-xs text-muted-foreground">OR</span>
                  <Separator className="flex-1" />
                </div>

                <Label htmlFor="css-input">CSS Code</Label>
                <Textarea
                  id="css-input"
                  value={cssInput}
                  onChange={(e) => setCssInput(e.target.value)}
                  placeholder=".example {
  color: #ff0000;
  font-size: 16px;
  margin: 0 auto;
}

/* Add your CSS here */"
                  rows={15}
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {cssInput.length} characters
                </div>
                <Button onClick={analyzeCss} disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <Zap className="w-4 h-4 mr-2" />
                  Analyze & Optimize
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {result ? (
            <>
              {/* Summary Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {result.issues.filter(i => i.severity === "error").length}
                      </div>
                      <div className="text-sm text-muted-foreground">Errors</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {result.issues.filter(i => i.severity === "warning").length}
                      </div>
                      <div className="text-sm text-muted-foreground">Warnings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {result.optimization.compressionRatio.toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Size Reduction</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Issues Card */}
              {result.issues.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Linting Issues</CardTitle>
                    <CardDescription>
                      Found {result.issues.length} issue{result.issues.length !== 1 ? "s" : ""} in your CSS
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64">
                      <div className="space-y-2">
                        {result.issues.map((issue, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                            {getSeverityBadge(issue.severity)}
                            <div className="flex-1">
                              <div className="font-medium">{issue.message}</div>
                              <div className="text-sm text-muted-foreground">
                                Line {issue.line}, Column {issue.column} • Rule: {issue.rule}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {issue.source}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}

              {/* Optimized CSS Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Optimized CSS</span>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(result.optimizedCss)}
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadResult(result.optimizedCss, "optimized.css")}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    Original: {result.optimization.originalSize} bytes •
                    Optimized: {result.optimization.optimizedSize} bytes •
                    Saved: {result.optimization.originalSize - result.optimization.optimizedSize} bytes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <pre className="text-sm font-mono bg-muted p-4 rounded">
                      {result.optimizedCss}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Optimization Details */}
              {result.optimization.changes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Optimization Changes</CardTitle>
                    <CardDescription>
                      Summary of optimizations applied
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-48">
                      <ul className="space-y-1 text-sm">
                        {result.optimization.changes.map((change, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>{change}</span>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4" />
                  <p>No results yet. Enter CSS code and click "Analyze & Optimize" to get started.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Linting Rules</CardTitle>
              <CardDescription>
                Configure CSS linting rules and validation options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="no-empty-rules"
                      checked={config.rules["no-empty-rules"] as boolean}
                      onCheckedChange={(checked) => handleConfigChange("rules", "no-empty-rules", checked)}
                    />
                    <Label htmlFor="no-empty-rules">No empty rules</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="no-duplicate-properties"
                      checked={config.rules["no-duplicate-properties"] as boolean}
                      onCheckedChange={(checked) => handleConfigChange("rules", "no-duplicate-properties", checked)}
                    />
                    <Label htmlFor="no-duplicate-properties">No duplicate properties</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="no-invalid-properties"
                      checked={config.rules["no-invalid-properties"] as boolean}
                      onCheckedChange={(checked) => handleConfigChange("rules", "no-invalid-properties", checked)}
                    />
                    <Label htmlFor="no-invalid-properties">No invalid properties</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="no-unknown-properties"
                      checked={config.rules["no-unknown-properties"] as boolean}
                      onCheckedChange={(checked) => handleConfigChange("rules", "no-unknown-properties", checked)}
                    />
                    <Label htmlFor="no-unknown-properties">No unknown properties</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="no-important"
                      checked={config.rules["no-important"] as boolean}
                      onCheckedChange={(checked) => handleConfigChange("rules", "no-important", checked)}
                    />
                    <Label htmlFor="no-important">Avoid !important</Label>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="property-case">Property case</Label>
                    <Select
                      value={config.rules["property-case"] as string}
                      onValueChange={(value) => handleConfigChange("rules", "property-case", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lower">Lowercase</SelectItem>
                        <SelectItem value="upper">Uppercase</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="selector-max-depth">Max selector depth</Label>
                    <Input
                      id="selector-max-depth"
                      type="number"
                      min="1"
                      max="10"
                      value={config.rules["selector-max-depth"] as number}
                      onChange={(e) => handleConfigChange("rules", "selector-max-depth", parseInt(e.target.value) || 3)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Optimization Options</CardTitle>
              <CardDescription>
                Configure CSS optimization and minification settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remove-comments"
                      checked={config.optimization.removeComments}
                      onCheckedChange={(checked) => handleConfigChange("optimization", "removeComments", checked)}
                    />
                    <Label htmlFor="remove-comments">Remove comments</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remove-whitespace"
                      checked={config.optimization.removeWhitespace}
                      onCheckedChange={(checked) => handleConfigChange("optimization", "removeWhitespace", checked)}
                    />
                    <Label htmlFor="remove-whitespace">Remove whitespace</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="shorten-colors"
                      checked={config.optimization.shortenColors}
                      onCheckedChange={(checked) => handleConfigChange("optimization", "shortenColors", checked)}
                    />
                    <Label htmlFor="shorten-colors">Shorten colors</Label>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="combine-selectors"
                      checked={config.optimization.combineSelectors}
                      onCheckedChange={(checked) => handleConfigChange("optimization", "combineSelectors", checked)}
                    />
                    <Label htmlFor="combine-selectors">Combine selectors</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remove-empty-rules"
                      checked={config.optimization.removeEmptyRules}
                      onCheckedChange={(checked) => handleConfigChange("optimization", "removeEmptyRules", checked)}
                    />
                    <Label htmlFor="remove-empty-rules">Remove empty rules</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="minify"
                      checked={config.optimization.minify}
                      onCheckedChange={(checked) => handleConfigChange("optimization", "minify", checked)}
                    />
                    <Label htmlFor="minify">Minify output</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}