"use client";

import { useState, useEffect, useRef } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Play,
  Code,
  Settings,
  Eye,
  Copy,
  Download,
  RotateCcw,
  Zap,
  Palette,
  Type,
  Layout,
  MousePointer,
  Upload,
  File,
  X,
} from "lucide-react";
import { useToast } from "@/components/ui/toaster";

// Sample components for playground
const sampleComponents = {
  Button: {
    name: "Button",
    props: {
      variant: {
        type: "select",
        options: [
          "default",
          "destructive",
          "outline",
          "secondary",
          "ghost",
          "link",
        ],
        default: "default",
      },
      size: {
        type: "select",
        options: ["default", "sm", "lg", "icon"],
        default: "default",
      },
      disabled: { type: "boolean", default: false },
      children: { type: "text", default: "Click me" },
    },
    render: (props: any) =>
      `<Button variant="${props.variant}" size="${props.size}"${props.disabled ? " disabled" : ""}>\n  ${props.children}\n</Button>`,
  },
  Card: {
    name: "Card",
    props: {
      title: { type: "text", default: "Card Title" },
      content: { type: "textarea", default: "Card content goes here..." },
      className: { type: "text", default: "" },
    },
    render: (props: any) =>
      `<Card className="${props.className}">\n  <CardHeader>\n    <CardTitle>${props.title}</CardTitle>\n  </CardHeader>\n  <CardContent>\n    <p>${props.content}</p>\n  </CardContent>\n</Card>`,
  },
  Input: {
    name: "Input",
    props: {
      type: {
        type: "select",
        options: ["text", "email", "password", "number"],
        default: "text",
      },
      placeholder: { type: "text", default: "Enter text..." },
      disabled: { type: "boolean", default: false },
      className: { type: "text", default: "" },
    },
    render: (props: any) =>
      `<Input type="${props.type}" placeholder="${props.placeholder}"${props.disabled ? " disabled" : ""} className="${props.className}" />`,
  },
  Badge: {
    name: "Badge",
    props: {
      variant: {
        type: "select",
        options: ["default", "secondary", "destructive", "outline"],
        default: "default",
      },
      children: { type: "text", default: "Badge" },
    },
    render: (props: any) =>
      `<Badge variant="${props.variant}">${props.children}</Badge>`,
  },
};

export default function ComponentPlaygroundClient() {
  const [selectedComponent, setSelectedComponent] = useState("Button");
  const [componentProps, setComponentProps] = useState<any>({});
  const [generatedCode, setGeneratedCode] = useState("");
  const [previewMode, setPreviewMode] = useState<"preview" | "code">("preview");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // File upload handlers
  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    const validFiles: File[] = [];
    const maxSize = 5 * 1024 * 1024; // 5MB limit

    Array.from(files).forEach((file) => {
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 5MB limit`,
          variant: "destructive",
        });
        return;
      }

      const allowedTypes = [
        "application/json",
        "text/javascript",
        "text/typescript",
        "application/javascript",
        "application/typescript",
        "text/plain",
      ];

      if (!allowedTypes.includes(file.type) && !file.name.match(/\.(json|js|ts|tsx|jsx)$/)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported file type`,
          variant: "destructive",
        });
        return;
      }

      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      setUploadedFiles((prev) => [...prev, ...validFiles]);
      processUploadedFiles(validFiles);
    }
  };

  const processUploadedFiles = async (files: File[]) => {
    setIsProcessing(true);
    try {
      for (const file of files) {
        const content = await file.text();

        // Call API to process the component
        const response = await fetch("/api/tools/component-playground", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "process-component",
            data: {
              fileContent: content,
              fileName: file.name,
            },
          }),
        });

        const result = await response.json();

        if (result.success && result.component) {
          const componentConfig = result.component;

          // Add new component to sampleComponents
          (sampleComponents as any)[componentConfig.name] = {
            name: componentConfig.name,
            props: componentConfig.props,
            render: componentConfig.render || ((props: any) => `<${componentConfig.name} />`),
          };

          toast({
            title: "Component imported",
            description: `Successfully imported ${componentConfig.name} component`,
          });
        } else {
          toast({
            title: "Processing failed",
            description: result.error || "Failed to process component file",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Processing error",
        description: "Failed to process uploaded files",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files);
  };

  // Initialize component props when component changes
  useEffect(() => {
    const component =
      sampleComponents[selectedComponent as keyof typeof sampleComponents];
    if (component) {
      const initialProps: any = {};
      Object.entries(component.props).forEach(([key, config]) => {
        initialProps[key] = config.default;
      });
      setComponentProps(initialProps);
    }
  }, [selectedComponent]);

  // Generate code when props change
  useEffect(() => {
    const component =
      sampleComponents[selectedComponent as keyof typeof sampleComponents];
    if (component) {
      setGeneratedCode(component.render(componentProps));
    }
  }, [componentProps, selectedComponent]);

  const handlePropChange = (propName: string, value: any) => {
    setComponentProps((prev: any) => ({
      ...prev,
      [propName]: value,
    }));
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      toast({
        title: "Copied!",
        description: "Code copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy code",
        variant: "destructive",
      });
    }
  };

  const resetProps = () => {
    const component =
      sampleComponents[selectedComponent as keyof typeof sampleComponents];
    if (component) {
      const initialProps: any = {};
      Object.entries(component.props).forEach(([key, config]) => {
        initialProps[key] = config.default;
      });
      setComponentProps(initialProps);
    }
  };

  const renderComponentPreview = () => {
    const component =
      sampleComponents[selectedComponent as keyof typeof sampleComponents];
    if (!component) return null;

    switch (selectedComponent) {
      case "Button":
        return (
          <Button
            variant={componentProps.variant}
            size={componentProps.size}
            disabled={componentProps.disabled}
          >
            {componentProps.children}
          </Button>
        );
      case "Card":
        return (
          <Card className={componentProps.className}>
            <CardHeader>
              <CardTitle>{componentProps.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{componentProps.content}</p>
            </CardContent>
          </Card>
        );
      case "Input":
        return (
          <Input
            type={componentProps.type}
            placeholder={componentProps.placeholder}
            disabled={componentProps.disabled}
            className={componentProps.className}
          />
        );
      case "Badge":
        return (
          <Badge variant={componentProps.variant}>
            {componentProps.children}
          </Badge>
        );
      default:
        return <div>Component not found</div>;
    }
  };

  const renderPropControl = (propName: string, config: any) => {
    switch (config.type) {
      case "text":
        return (
          <div key={propName} className="space-y-2">
            <Label htmlFor={propName} className="text-sm font-medium">
              {propName}
            </Label>
            <Input
              id={propName}
              value={componentProps[propName] || ""}
              onChange={(e) => handlePropChange(propName, e.target.value)}
              placeholder={`Enter ${propName}`}
            />
          </div>
        );
      case "textarea":
        return (
          <div key={propName} className="space-y-2">
            <Label htmlFor={propName} className="text-sm font-medium">
              {propName}
            </Label>
            <Textarea
              id={propName}
              value={componentProps[propName] || ""}
              onChange={(e) => handlePropChange(propName, e.target.value)}
              placeholder={`Enter ${propName}`}
              rows={3}
            />
          </div>
        );
      case "select":
        return (
          <div key={propName} className="space-y-2">
            <Label htmlFor={propName} className="text-sm font-medium">
              {propName}
            </Label>
            <Select
              value={componentProps[propName] || config.default}
              onValueChange={(value) => handlePropChange(propName, value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {config.options.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case "boolean":
        return (
          <div key={propName} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={propName}
              checked={componentProps[propName] || false}
              onChange={(e) => handlePropChange(propName, e.target.checked)}
              className="rounded"
            />
            <Label htmlFor={propName} className="text-sm font-medium">
              {propName}
            </Label>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Component Playground</h1>
        <p className="text-muted-foreground">
          Interactive component inspector with live preview, props panel, and
          code generation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Props Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Component Props
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  <Label className="text-sm font-medium">Import Components</Label>
                </div>

                {/* Drag and Drop Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                    isDragOver
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-muted-foreground/50"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        Drop component files here or{" "}
                        <button
                          type="button"
                          className="text-primary hover:underline"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          browse
                        </button>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Supports JSON configs, JS/TS files (max 5MB)
                      </p>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".json,.js,.ts,.tsx,.jsx"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Uploaded Files</Label>
                    <div className="space-y-1">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-muted rounded-md"
                        >
                          <div className="flex items-center gap-2">
                            <File className="h-4 w-4" />
                            <span className="text-sm truncate">{file.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {(file.size / 1024).toFixed(1)}KB
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isProcessing && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                    Processing files...
                  </div>
                )}
              </div>

              <Separator />

              {/* Component Selector */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Component</Label>
                <Select
                  value={selectedComponent}
                  onValueChange={setSelectedComponent}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(sampleComponents).map((componentName) => (
                      <SelectItem key={componentName} value={componentName}>
                        {componentName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Props Controls */}
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {sampleComponents[
                    selectedComponent as keyof typeof sampleComponents
                  ] &&
                    Object.entries(
                      sampleComponents[
                        selectedComponent as keyof typeof sampleComponents
                      ].props,
                    ).map(([propName, config]) =>
                      renderPropControl(propName, config),
                    )}
                </div>
              </ScrollArea>

              <Separator />

              {/* Actions */}
              <div className="flex gap-2">
                <Button onClick={resetProps} variant="outline" size="sm">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview/Code Panel */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {previewMode === "preview" ? (
                    <>
                      <Eye className="h-5 w-5" />
                      Live Preview
                    </>
                  ) : (
                    <>
                      <Code className="h-5 w-5" />
                      Generated Code
                    </>
                  )}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={previewMode === "preview" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewMode("preview")}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    variant={previewMode === "code" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewMode("code")}
                  >
                    <Code className="h-4 w-4 mr-2" />
                    Code
                  </Button>
                  <Button onClick={copyToClipboard} variant="outline" size="sm">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {previewMode === "preview" ? (
                <div className="min-h-64 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
                  <div className="text-center">{renderComponentPreview()}</div>
                </div>
              ) : (
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{generatedCode}</code>
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Component Info */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Component Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {
                      Object.keys(
                        sampleComponents[
                          selectedComponent as keyof typeof sampleComponents
                        ]?.props || {},
                      ).length
                    }
                  </div>
                  <div className="text-sm text-muted-foreground">Props</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {sampleComponents[
                      selectedComponent as keyof typeof sampleComponents
                    ]?.props
                      ? Object.values(
                          sampleComponents[
                            selectedComponent as keyof typeof sampleComponents
                          ].props,
                        ).filter((config: any) => config.type === "select")
                          .length
                      : 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Variants</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {generatedCode.split("\n").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Lines</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {generatedCode.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Chars</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
