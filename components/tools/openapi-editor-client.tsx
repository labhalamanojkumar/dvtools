"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Upload, 
  Download, 
  FileCode,
  CheckCircle2,
  AlertCircle,
  Eye,
  Code,
  FileJson,
  FileText
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ValidationError {
  path: string;
  message: string;
  severity: "error" | "warning";
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  version: string;
  endpoints: number;
}

interface PreviewEndpoint {
  path: string;
  method: string;
  summary: string;
  description: string;
  parameters: any[];
  responses: Record<string, any>;
}

export default function OpenAPIEditorClient() {
  const [spec, setSpec] = useState<string>("");
  const [format, setFormat] = useState<"yaml" | "json">("yaml");
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [preview, setPreview] = useState<PreviewEndpoint[]>([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState<PreviewEndpoint | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const detectedFormat = fileName.endsWith('.json') ? 'json' : 'yaml';
    
    try {
      const text = await file.text();
      setSpec(text);
      setFormat(detectedFormat);
      toast.success(`File uploaded: ${file.name}`);
      
      // Auto-validate after upload
      await validateSpec(text, detectedFormat);
    } catch (error) {
      console.error("File upload error:", error);
      toast.error("Failed to read file");
    }
  }, []);

  const validateSpec = useCallback(async (specContent: string = spec, specFormat: string = format) => {
    if (!specContent.trim()) {
      toast.error("Please enter or upload an OpenAPI specification");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/tools/openapi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "validate",
          spec: specContent,
          format: specFormat
        })
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(`Validation failed: ${error.error}`);
        return;
      }

      const result = await response.json();
      setValidationResult(result);

      if (result.valid) {
        toast.success("Specification is valid!");
      } else {
        toast.error(`Found ${result.errors.length} errors`);
      }
    } catch (error) {
      console.error("Validation error:", error);
      toast.error("Failed to validate specification");
    } finally {
      setIsProcessing(false);
    }
  }, [spec, format]);

  const generatePreview = useCallback(async () => {
    if (!spec.trim()) {
      toast.error("Please enter or upload an OpenAPI specification");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/tools/openapi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "preview",
          spec,
          format
        })
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(`Preview generation failed: ${error.error}`);
        return;
      }

      const result = await response.json();
      setPreview(result.endpoints);
      toast.success(`Generated preview for ${result.endpoints.length} endpoints`);
    } catch (error) {
      console.error("Preview generation error:", error);
      toast.error("Failed to generate preview");
    } finally {
      setIsProcessing(false);
    }
  }, [spec, format]);

  const generateExamples = useCallback(async () => {
    if (!spec.trim()) {
      toast.error("Please enter or upload an OpenAPI specification");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/tools/openapi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generateExamples",
          spec,
          format
        })
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(`Example generation failed: ${error.error}`);
        return;
      }

      const result = await response.json();
      setSpec(result.specWithExamples);
      toast.success("Examples generated successfully");
    } catch (error) {
      console.error("Example generation error:", error);
      toast.error("Failed to generate examples");
    } finally {
      setIsProcessing(false);
    }
  }, [spec, format]);

  const handleDownload = useCallback(() => {
    if (!spec.trim()) {
      toast.error("No specification to download");
      return;
    }

    const blob = new Blob([spec], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `openapi-spec.${format}`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);

    toast.success("Specification downloaded");
  }, [spec, format]);

  const convertFormat = useCallback(async () => {
    if (!spec.trim()) {
      toast.error("No specification to convert");
      return;
    }

    const newFormat = format === "yaml" ? "json" : "yaml";
    setIsProcessing(true);

    try {
      const response = await fetch("/api/tools/openapi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "convert",
          spec,
          format,
          targetFormat: newFormat
        })
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(`Conversion failed: ${error.error}`);
        return;
      }

      const result = await response.json();
      setSpec(result.converted);
      setFormat(newFormat);
      toast.success(`Converted to ${newFormat.toUpperCase()}`);
    } catch (error) {
      console.error("Conversion error:", error);
      toast.error("Failed to convert format");
    } finally {
      setIsProcessing(false);
    }
  }, [spec, format]);

  const loadTemplate = useCallback(() => {
    const template = format === "yaml" ? `openapi: 3.0.0
info:
  title: Sample API
  version: 1.0.0
  description: A sample API specification
servers:
  - url: https://api.example.com/v1
paths:
  /users:
    get:
      summary: Get all users
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    id:
                      type: integer
                    name:
                      type: string
                    email:
                      type: string
    post:
      summary: Create a user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                email:
                  type: string
      responses:
        '201':
          description: User created
  /users/{id}:
    get:
      summary: Get user by ID
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Successful response
        '404':
          description: User not found` : `{
  "openapi": "3.0.0",
  "info": {
    "title": "Sample API",
    "version": "1.0.0",
    "description": "A sample API specification"
  },
  "servers": [
    {
      "url": "https://api.example.com/v1"
    }
  ],
  "paths": {
    "/users": {
      "get": {
        "summary": "Get all users",
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "id": { "type": "integer" },
                      "name": { "type": "string" },
                      "email": { "type": "string" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}`;

    setSpec(template);
    toast.success("Template loaded");
  }, [format]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Specification Editor</CardTitle>
                  <CardDescription>Edit your OpenAPI specification in YAML or JSON format</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select value={format} onValueChange={(value: "yaml" | "json") => setFormat(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yaml">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          YAML
                        </div>
                      </SelectItem>
                      <SelectItem value="json">
                        <div className="flex items-center gap-2">
                          <FileJson className="w-4 h-4" />
                          JSON
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".yaml,.yml,.json"
                onChange={handleFileUpload}
              />

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  variant="outline"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File
                </Button>
                <Button
                  onClick={loadTemplate}
                  disabled={isProcessing}
                  variant="outline"
                >
                  <FileCode className="w-4 h-4 mr-2" />
                  Load Template
                </Button>
                <Button
                  onClick={() => validateSpec()}
                  disabled={isProcessing || !spec.trim()}
                  variant="default"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Validate
                </Button>
                <Button
                  onClick={convertFormat}
                  disabled={isProcessing || !spec.trim()}
                  variant="outline"
                >
                  <Code className="w-4 h-4 mr-2" />
                  Convert to {format === "yaml" ? "JSON" : "YAML"}
                </Button>
                <Button
                  onClick={generateExamples}
                  disabled={isProcessing || !spec.trim()}
                  variant="outline"
                >
                  <FileCode className="w-4 h-4 mr-2" />
                  Generate Examples
                </Button>
                <Button
                  onClick={handleDownload}
                  disabled={!spec.trim()}
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>

              <div className="relative">
                <Textarea
                  value={spec}
                  onChange={(e) => setSpec(e.target.value)}
                  placeholder={`Paste your OpenAPI ${format.toUpperCase()} specification here or upload a file...`}
                  className="min-h-[500px] font-mono text-sm"
                />
                {spec && (
                  <Badge className="absolute top-2 right-2" variant="secondary">
                    {spec.split('\n').length} lines
                  </Badge>
                )}
              </div>

              {validationResult && (
                <Alert variant={validationResult.valid ? "default" : "destructive"}>
                  {validationResult.valid ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  <AlertDescription>
                    {validationResult.valid ? (
                      <span>
                        ✓ Valid OpenAPI {validationResult.version} specification with {validationResult.endpoints} endpoints
                      </span>
                    ) : (
                      <span>
                        Found {validationResult.errors.length} errors and {validationResult.warnings.length} warnings
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Validation Results</CardTitle>
              <CardDescription>Review errors and warnings in your specification</CardDescription>
            </CardHeader>
            <CardContent>
              {validationResult ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 pb-4 border-b">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-semibold flex items-center gap-2">
                        {validationResult.valid ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            Valid
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            Invalid
                          </>
                        )}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Version</p>
                      <p className="font-semibold">{validationResult.version}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Endpoints</p>
                      <p className="font-semibold">{validationResult.endpoints}</p>
                    </div>
                  </div>

                  {validationResult.errors.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-red-500">Errors ({validationResult.errors.length})</h3>
                      <div className="space-y-2">
                        {validationResult.errors.map((error, index) => (
                          <Alert key={index} variant="destructive">
                            <AlertCircle className="w-4 h-4" />
                            <AlertDescription>
                              <p className="font-semibold">{error.path}</p>
                              <p className="text-sm">{error.message}</p>
                            </AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </div>
                  )}

                  {validationResult.warnings.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-yellow-500">Warnings ({validationResult.warnings.length})</h3>
                      <div className="space-y-2">
                        {validationResult.warnings.map((warning, index) => (
                          <Alert key={index}>
                            <AlertCircle className="w-4 h-4" />
                            <AlertDescription>
                              <p className="font-semibold">{warning.path}</p>
                              <p className="text-sm">{warning.message}</p>
                            </AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </div>
                  )}

                  {validationResult.valid && (
                    <Alert>
                      <CheckCircle2 className="w-4 h-4" />
                      <AlertDescription>
                        Your OpenAPI specification is valid and ready to use!
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No validation results yet. Validate your specification in the Editor tab.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>API Documentation Preview</CardTitle>
                  <CardDescription>Preview your API endpoints and responses</CardDescription>
                </div>
                <Button
                  onClick={generatePreview}
                  disabled={isProcessing || !spec.trim()}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Generate Preview
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {preview.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid gap-3">
                    {preview.map((endpoint, index) => (
                      <div
                        key={index}
                        className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => setSelectedEndpoint(endpoint)}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant={
                            endpoint.method === 'GET' ? 'default' :
                            endpoint.method === 'POST' ? 'secondary' :
                            endpoint.method === 'PUT' ? 'outline' :
                            'destructive'
                          }>
                            {endpoint.method}
                          </Badge>
                          <code className="text-sm font-mono">{endpoint.path}</code>
                        </div>
                        <p className="text-sm text-muted-foreground">{endpoint.summary}</p>
                      </div>
                    ))}
                  </div>

                  {selectedEndpoint && (
                    <Card className="mt-4">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <Badge>{selectedEndpoint.method}</Badge>
                          <code className="text-sm font-mono">{selectedEndpoint.path}</code>
                        </div>
                        <CardDescription>{selectedEndpoint.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {selectedEndpoint.parameters.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">Parameters</h4>
                            <div className="space-y-2">
                              {selectedEndpoint.parameters.map((param: any, index: number) => (
                                <div key={index} className="text-sm p-2 bg-muted rounded">
                                  <span className="font-mono">{param.name}</span>
                                  <Badge variant="outline" className="ml-2">{param.in}</Badge>
                                  {param.required && <Badge variant="secondary" className="ml-2">required</Badge>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <h4 className="font-semibold mb-2">Responses</h4>
                          <div className="space-y-2">
                            {Object.entries(selectedEndpoint.responses).map(([status, response]: [string, any]) => (
                              <div key={status} className="border rounded p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant={status.startsWith('2') ? 'default' : 'destructive'}>
                                    {status}
                                  </Badge>
                                  <span className="text-sm">{response.description}</span>
                                </div>
                                {response.content && (
                                  <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                                    {JSON.stringify(response.content, null, 2)}
                                  </pre>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No preview available. Click "Generate Preview" to see your API documentation.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
