"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { copyToClipboard, downloadFile } from "../../lib/utils";
import { useToast } from "../ui/toaster";
import { 
  Copy, 
  Download, 
  Upload, 
  FileText, 
  Settings,
  RotateCw,
  CheckCircle,
} from "lucide-react";
import * as beautify from "js-beautify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger 
} from "../ui/tabs";

type Language = 'javascript' | 'typescript' | 'html' | 'css' | 'json' | 'python' | 'sql' | 'xml' | 'yaml';

type LanguageInfo = {
  name: string;
  extension: string;
  mode: string;
};

const languageMap: Record<Language, LanguageInfo> = {
  javascript: { name: "JavaScript", extension: "js", mode: "javascript" },
  typescript: { name: "TypeScript", extension: "ts", mode: "typescript" },
  html: { name: "HTML", extension: "html", mode: "html" },
  css: { name: "CSS", extension: "css", mode: "css" },
  json: { name: "JSON", extension: "json", mode: "json" },
  python: { name: "Python", extension: "py", mode: "python" },
  sql: { name: "SQL", extension: "sql", mode: "sql" },
  xml: { name: "XML", extension: "xml", mode: "xml" },
  yaml: { name: "YAML", extension: "yml", mode: "yaml" },
};

export function CodeBeautifierClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState<Language>("javascript");
  const [theme, setTheme] = useState("vs-dark");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [formatOptions, setFormatOptions] = useState({
    indentSize: 2,
    useTabs: false,
    insertSpaces: true,
    preserveNewlines: true,
    maxPreserveNewlines: 2,
    endWithNewline: false,
    wrapLineLength: 80,
  });

  const { toast } = useToast();

  const formatCode = () => {
    try {
      let formatted = "";

      switch (language) {
        case "html":
          formatted = beautify.html(input, {
            indent_size: formatOptions.indentSize,
            indent_char: formatOptions.useTabs ? "\t" : " ",
            max_preserve_newlines: formatOptions.maxPreserveNewlines,
            preserve_newlines: formatOptions.preserveNewlines,
            end_with_newline: formatOptions.endWithNewline,
            wrap_line_length: formatOptions.wrapLineLength,
          });
          break;

        case "css":
          formatted = beautify.css(input, {
            indent_size: formatOptions.indentSize,
            indent_char: formatOptions.useTabs ? "\t" : " ",
            max_preserve_newlines: formatOptions.maxPreserveNewlines,
            preserve_newlines: formatOptions.preserveNewlines,
            end_with_newline: formatOptions.endWithNewline,
          });
          break;

        case "json":
          try {
            // Parse JSON to validate and format with proper indentation
            const parsed = JSON.parse(input);
            formatted = JSON.stringify(parsed, null, formatOptions.indentSize);
          } catch (jsonError) {
            throw new Error("Invalid JSON");
          }
          break;

        case "javascript":
        case "typescript":
        default:
          formatted = beautify.js(input, {
            indent_size: formatOptions.indentSize,
            indent_char: formatOptions.useTabs ? "\t" : " ",
            max_preserve_newlines: formatOptions.maxPreserveNewlines,
            preserve_newlines: formatOptions.preserveNewlines,
            end_with_newline: formatOptions.endWithNewline,
            wrap_line_length: formatOptions.wrapLineLength,
          });
          break;
      }

      setOutput(formatted);
      toast({ 
        title: "Success", 
        description: "Code formatted successfully",
      });
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to format code",
        variant: "destructive",
      });
    }
  };

  const minifyCode = () => {
    try {
      let minified = "";

      switch (language) {
        case "html":
          minified = beautify.html(input, {
            indent_size: 0,
            indent_char: " ",
            max_preserve_newlines: 0,
            preserve_newlines: false,
            end_with_newline: false,
            wrap_line_length: 0,
          });
          break;

        case "css":
          minified = beautify.css(input, {
            indent_size: 0,
            indent_char: " ",
            max_preserve_newlines: 0,
            preserve_newlines: false,
            end_with_newline: false,
          });
          break;

        case "json":
          try {
            const parsed = JSON.parse(input);
            minified = JSON.stringify(parsed);
          } catch (jsonError) {
            throw new Error("Invalid JSON");
          }
          break;

        case "javascript":
        case "typescript":
        default:
          minified = beautify.js(input, {
            indent_size: 0,
            indent_char: " ",
            max_preserve_newlines: 0,
            preserve_newlines: false,
            end_with_newline: false,
            wrap_line_length: 0,
          });
          break;
      }

      setOutput(minified);
      toast({ 
        title: "Success", 
        description: "Code minified successfully",
      });
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to minify code",
        variant: "destructive",
      });
    }
  };

  // File handler helpers
  const detectLanguage = (fileName: string): Language => {
    for (const [key, info] of Object.entries(languageMap)) {
      if (fileName.toLowerCase().endsWith(`.${info.extension}`)) {
        return key as Language;
      }
    }
    return 'javascript'; // Default to JavaScript if no match
  };

  const validateFile = (file: File): boolean => {
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "File size must be less than 10MB",
        variant: "destructive",
      });
      return false;
    }

    const fileName = file.name.toLowerCase();
    const allowedExtensions = Object.values(languageMap).map(info => `.${info.extension}`);
    const isValidType = allowedExtensions.some(ext => fileName.endsWith(ext)) ||
                       file.type.startsWith('text/') ||
                       ['javascript', 'html', 'css', 'json'].some(type => file.type.includes(type));

    if (!isValidType) {
      toast({
        title: "Invalid File Type",
        description: "Please select a supported code file",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFileUpload = async (file: File) => {
    if (!file || !validateFile(file)) return;

    try {
      const content = await file.text();
      const detectedLanguage = detectLanguage(file.name);

      setInput(content);
      setLanguage(detectedLanguage);

      // No-op: Monaco editor may not be installed in this environment.

      toast({
        title: "File Loaded",
        description: `Successfully loaded ${file.name} as ${languageMap[detectedLanguage].name}`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to read the file",
        variant: "destructive",
      });
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

    return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Input Code</h3>
                <div className="flex gap-2">
                  <Select value={language} onValueChange={(value: string) => setLanguage(value as Language)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(languageMap).map(([key, info]) => (
                        <SelectItem key={key} value={key}>{info.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editor Settings</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Theme</Label>
                            <Select value={theme} onValueChange={setTheme}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="vs">Light</SelectItem>
                                <SelectItem value="vs-dark">Dark</SelectItem>
                                <SelectItem value="monokai">Monokai</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Indent Size</Label>
                            <Select 
                              value={formatOptions.indentSize.toString()} 
                              onValueChange={(v: string) => setFormatOptions({
                                ...formatOptions,
                                indentSize: parseInt(v),
                              })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="2">2 spaces</SelectItem>
                                <SelectItem value="4">4 spaces</SelectItem>
                                <SelectItem value="8">8 spaces</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Use Tabs</Label>
                            <Switch
                              checked={formatOptions.useTabs}
                              onCheckedChange={(checked: boolean) => setFormatOptions({
                                ...formatOptions,
                                useTabs: checked,
                                insertSpaces: !checked,
                              })}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Preserve Newlines</Label>
                            <Switch
                              checked={formatOptions.preserveNewlines}
                              onCheckedChange={(checked: boolean) => setFormatOptions({
                                ...formatOptions,
                                preserveNewlines: checked,
                              })}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>End with Newline</Label>
                            <Switch
                              checked={formatOptions.endWithNewline}
                              onCheckedChange={(checked: boolean) => setFormatOptions({
                                ...formatOptions,
                                endWithNewline: checked,
                              })}
                            />
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
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
                    Drag & drop a code file here, or click to browse
                  </p>
                  <input
                    type="file"
                    accept=".js,.jsx,.ts,.tsx,.html,.htm,.css,.scss,.sass,.json,.py,.sql,.xml,.yml,text/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                    id="code-file-input"
                  />
                  <label htmlFor="code-file-input">
                    <Button variant="outline" size="sm" asChild>
                      <span className="cursor-pointer">
                        <Upload className="mr-2 h-4 w-4" />
                        Choose File
                      </span>
                    </Button>
                  </label>
                  <p className="text-xs text-muted-foreground mt-2">
                    Supports multiple file formats up to 10MB
                  </p>
                </div>
              </div>

              <textarea
                className="w-full h-[400px] font-mono text-sm p-3 border rounded bg-white dark:bg-slate-900 text-foreground"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ whiteSpace: 'pre', fontFamily: "'JetBrains Mono', monospace" }}
              />

              <div className="mt-4 flex gap-2">
                <Button onClick={formatCode}>Format</Button>
                <Button onClick={minifyCode} variant="outline">
                  Minify
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Quick Examples</h3>
              <Tabs defaultValue="js" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="js">JavaScript</TabsTrigger>
                  <TabsTrigger value="html">HTML</TabsTrigger>
                  <TabsTrigger value="css">CSS</TabsTrigger>
                  <TabsTrigger value="json">JSON</TabsTrigger>
                </TabsList>
                <TabsContent value="js">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto p-4"
                    onClick={() => {
                      setLanguage("javascript");
                      setInput(`function calculateSum(numbers) {
  return numbers.reduce((sum, num) => sum + num, 0);
}

const numbers = [1, 2, 3, 4, 5];
const total = calculateSum(numbers);
console.log("Sum:", total);`);
                    }}
                  >
                    <div>
                      <div className="font-semibold">Array Sum Function</div>
                      <div className="text-sm text-muted-foreground">
                        Simple array reduction example
                      </div>
                    </div>
                  </Button>
                </TabsContent>
                <TabsContent value="html">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto p-4"
                    onClick={() => {
                      setLanguage("html");
                      setInput(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample Page</title>
</head>
<body>
    <header>
        <h1>Welcome</h1>
        <nav>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <section>
            <h2>About Us</h2>
            <p>Welcome to our website!</p>
        </section>
    </main>
    <footer>
        <p>&copy; 2024</p>
    </footer>
</body>
</html>`);
                    }}
                  >
                    <div>
                      <div className="font-semibold">Basic HTML Template</div>
                      <div className="text-sm text-muted-foreground">
                        Standard HTML5 structure
                      </div>
                    </div>
                  </Button>
                </TabsContent>
                <TabsContent value="css">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto p-4"
                    onClick={() => {
                      setLanguage("css");
                      setInput(`/* Modern CSS Reset */
*,
*::before,
*::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: system-ui, -apple-system, sans-serif;
    line-height: 1.5;
    color: #333;
}

.container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
}

.button {
    display: inline-block;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.button:hover {
    background-color: #0056b3;
}`);
                    }}
                  >
                    <div>
                      <div className="font-semibold">Modern CSS Template</div>
                      <div className="text-sm text-muted-foreground">
                        Basic CSS reset and utilities
                      </div>
                    </div>
                  </Button>
                </TabsContent>
                <TabsContent value="json">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto p-4"
                    onClick={() => {
                      setLanguage("json");
                      setInput(`{
  "name": "example-project",
  "version": "1.0.0",
  "description": "A sample project configuration",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "jest",
    "build": "webpack"
  },
  "dependencies": {
    "express": "^4.17.1",
    "react": "^17.0.2",
    "typescript": "^4.5.4"
  },
  "devDependencies": {
    "jest": "^27.4.7",
    "webpack": "^5.65.0"
  },
  "author": "",
  "license": "MIT"
}`);
                    }}
                  >
                    <div>
                      <div className="font-semibold">package.json Template</div>
                      <div className="text-sm text-muted-foreground">
                        Sample Node.js project config
                      </div>
                    </div>
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Formatted Code</h3>
              {output && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      copyToClipboard(output);
                      toast({
                        title: "Copied",
                        description: "Code copied to clipboard",
                      });
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      const ext = languageMap[language]?.extension || "txt";
                      downloadFile(output, `formatted.${ext}`, "text/plain");
                      toast({
                        title: "Downloaded",
                        description: "Formatted code downloaded successfully",
                      });
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <textarea
              className="w-full h-[400px] font-mono text-sm p-3 border rounded bg-white dark:bg-slate-900 text-foreground"
              value={output}
              readOnly
              style={{ whiteSpace: 'pre', fontFamily: "'JetBrains Mono', monospace" }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
