"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Card, CardContent } from "../ui/card";
import { copyToClipboard, downloadFile } from "../../lib/utils";
import { useToast } from "../ui/toaster";
import {
  Copy,
  Download,
  CheckCircle2,
  AlertCircle,
  Minimize2,
  Maximize2,
  Upload,
  FileText,
} from "lucide-react";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true, verbose: true });
addFormats(ajv);

export function JsonFormatterClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (file: File) => {
    if (!file) return;

    // Check file type
    if (!file.name.toLowerCase().endsWith('.json') && !file.type.includes('json')) {
      toast({
        title: "Invalid File Type",
        description: "Please select a JSON file (.json)",
        variant: "destructive",
      });
      return;
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "File size must be less than 10MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInput(content);
      toast({
        title: "File Loaded",
        description: `Successfully loaded ${file.name}`,
      });
    };
    reader.onerror = () => {
      toast({
        title: "Error",
        description: "Failed to read the file",
        variant: "destructive",
      });
    };
    reader.readAsText(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
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

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const formatJson = (minify = false) => {
    try {
      const parsed = JSON.parse(input);
      const formatted = minify
        ? JSON.stringify(parsed)
        : JSON.stringify(parsed, null, 2);

      setOutput(formatted);
      setError("");
      setIsValid(true);

      toast({
        title: "Success",
        description: minify
          ? "JSON minified successfully"
          : "JSON formatted successfully",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Invalid JSON";
      setError(errorMessage);
      setOutput("");
      setIsValid(false);

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleCopy = async () => {
    await copyToClipboard(output);
    toast({
      title: "Copied",
      description: "JSON copied to clipboard",
    });
  };

  const handleDownload = () => {
    downloadFile(output, "formatted.json", "application/json");
    toast({
      title: "Downloaded",
      description: "JSON file downloaded",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Input JSON</h3>
              {isValid !== null && (
                <div className="flex items-center gap-2">
                  {isValid ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span className="text-sm text-green-500">Valid</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-destructive" />
                      <span className="text-sm text-destructive">Invalid</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* File Upload Section */}
            <div className="mb-4">
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                  isDragOver
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag & drop a JSON file here, or click to browse
                </p>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileInputChange}
                  className="hidden"
                  id="json-file-input"
                />
                <label htmlFor="json-file-input">
                  <Button variant="outline" size="sm" asChild>
                    <span className="cursor-pointer">
                      <Upload className="mr-2 h-4 w-4" />
                      Choose File
                    </span>
                  </Button>
                </label>
                <p className="text-xs text-muted-foreground mt-2">
                  Supports .json files up to 10MB
                </p>
              </div>
            </div>

            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='{"name": "John", "age": 30}'
              className="code-editor min-h-[400px]"
            />

            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={() => formatJson(false)}>
                <Maximize2 className="mr-2 h-4 w-4" />
                Format
              </Button>
              <Button onClick={() => formatJson(true)} variant="outline">
                <Minimize2 className="mr-2 h-4 w-4" />
                Minify
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Formatted JSON</h3>
              {output && (
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={handleCopy}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleDownload}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {error ? (
              <div className="rounded-md border border-destructive bg-destructive/10 p-4">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            ) : output ? (
              <pre className="code-editor min-h-[400px] overflow-auto">
                <code>{output}</code>
              </pre>
            ) : (
              <div className="flex min-h-[400px] items-center justify-center rounded-md border border-dashed">
                <p className="text-sm text-muted-foreground">
                  Formatted JSON will appear here
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Examples */}
      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Quick Examples</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Button
              variant="outline"
              className="justify-start text-left"
              onClick={() =>
                setInput(
                  '{"name":"John Doe","age":30,"city":"New York","isActive":true}',
                )
              }
            >
              Simple Object
            </Button>
            <Button
              variant="outline"
              className="justify-start text-left"
              onClick={() =>
                setInput('[{"id":1,"name":"Item 1"},{"id":2,"name":"Item 2"}]')
              }
            >
              Array of Objects
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
