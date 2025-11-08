"use client";

import { useCallback, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { FileText, Settings, Copy, Download, Wand2, Code2, Upload, File } from "lucide-react";

type FormatterType = "prettier" | "black";

interface FormatConfig {
  semi?: boolean;
  singleQuote?: boolean;
  tabWidth?: number;
  useTabs?: boolean;
  printWidth?: number;
  trailingComma?: "none" | "es5" | "all";
  bracketSpacing?: boolean;
  arrowParens?: "avoid" | "always";
  endOfLine?: "lf" | "crlf" | "cr" | "auto";
}

export default function FormatterProfilesClient() {
  // Formatter state
  const [formatter, setFormatter] = useState<FormatterType>("prettier");
  const [inputCode, setInputCode] = useState<string>("function hello(name) {\n  console.log('Hello, ' + name + '!');\n  return 'greeting sent';\n}\n\nhello('World');");
  const [formattedCode, setFormattedCode] = useState<string>("");
  const [formatting, setFormatting] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [config, setConfig] = useState<FormatConfig>({
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    useTabs: false,
    printWidth: 80,
    trailingComma: "es5",
    bracketSpacing: true,
    arrowParens: "avoid",
    endOfLine: "lf",
  });

  const formatCode = useCallback(async () => {
    if (!inputCode.trim()) {
      toast.error("Please enter some code to format");
      return;
    }

    setFormatting(true);
    setFormattedCode("");

    try {
      const res = await fetch("/api/tools/code-formatting/formatter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formatter, config, content: inputCode }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to format code");
      }

      setFormattedCode(data.result.output);
      toast.success(`${formatter} formatting completed`);
    } catch (e: any) {
      toast.error(`Formatting error: ${e.message}`);
    } finally {
      setFormatting(false);
    }
  }, [formatter, config, inputCode]);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (e) {
      toast.error("Failed to copy to clipboard");
    }
  }, []);

  const downloadCode = useCallback(() => {
    if (!formattedCode) {
      toast.error("No formatted code available to download");
      return;
    }

    const extension = formatter === "prettier" ? "js" : "py";
    const blob = new Blob([formattedCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `formatted-code.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Code downloaded");
  }, [formattedCode, formatter]);

  const applyPresetProfile = (preset: string) => {
    switch (preset) {
      case "standard":
        setConfig({
          ...config,
          semi: true,
          singleQuote: true,
          tabWidth: 2,
          useTabs: false,
          printWidth: 80,
          trailingComma: "es5",
          bracketSpacing: true,
          arrowParens: "avoid",
        });
        break;
      case "airbnb":
        setConfig({
          ...config,
          semi: true,
          singleQuote: true,
          tabWidth: 2,
          useTabs: false,
          printWidth: 100,
          trailingComma: "es5",
          bracketSpacing: true,
          arrowParens: "always",
        });
        break;
      case "google":
        setConfig({
          ...config,
          semi: true,
          singleQuote: false,
          tabWidth: 2,
          useTabs: false,
          printWidth: 100,
          trailingComma: "es5",
          bracketSpacing: false,
          arrowParens: "avoid",
        });
        break;
      case "black":
        setConfig({
          ...config,
          semi: false,
          singleQuote: true,
          tabWidth: 4,
          useTabs: false,
          printWidth: 88,
          trailingComma: "es5",
          bracketSpacing: true,
          arrowParens: "avoid",
        });
        break;
    }
    toast.success(`Applied ${preset} profile`);
  };

  const loadSampleCode = (type: string) => {
    let sample = "";
    switch (type) {
      case "js":
        sample = `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price * items[i].quantity;
  }
  return total;
}

const items = [
  { name: 'Widget A', price: 10.99, quantity: 2 },
  { name: 'Widget B', price: 5.50, quantity: 3 }
];

console.log('Total:', calculateTotal(items));`;
        break;
      case "ts":
        sample = `interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

class UserService {
  private users: User[] = [];

  addUser(user: User): void {
    this.users.push(user);
  }

  getActiveUsers(): User[] {
    return this.users.filter(user => user.isActive);
  }
}

const service = new UserService();
service.addUser({
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  isActive: true
});`;
        break;
      case "python":
        sample = `def calculate_fibonacci(n):
    """Calculate the nth Fibonacci number."""
    if n <= 1:
        return n
    else:
        return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)

def main():
    numbers = [calculate_fibonacci(i) for i in range(10)]
    print("Fibonacci sequence:", numbers)

    # Dictionary comprehension example
    squares = {x: x**2 for x in range(1, 6)}
    print("Squares:", squares)

if __name__ == "__main__":
    main()`;
        break;
      case "css":
        sample = `.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.button {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  text-decoration: none;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.button:hover {
  background-color: #2563eb;
}`;
        break;
    }
    setInputCode(sample);
    setUploadedFile(null);
    toast.success("Sample code loaded");
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    const file = files[0];
    await processUploadedFile(file);
  }, [formatter]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await processUploadedFile(file);
  }, [formatter]);

  const processUploadedFile = useCallback(async (file: File) => {
    // Check file extension based on formatter
    const allowedExtensions = {
      prettier: ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.html', '.json', '.md'],
      black: ['.py', '.pyw']
    };

    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    const allowed = allowedExtensions[formatter];

    if (!allowed.includes(extension)) {
      toast.error(`Invalid file type for ${formatter}. Allowed: ${allowed.join(', ')}`);
      return;
    }

    try {
      const text = await file.text();
      setInputCode(text);
      setUploadedFile(file);
      toast.success(`File "${file.name}" loaded successfully`);
    } catch (err) {
      toast.error("Failed to read file: " + (err as Error).message);
    }
  }, [formatter]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wand2 className="w-6 h-6" />
            <span>Code Formatter</span>
          </CardTitle>
          <CardDescription>
            Format your code with Prettier or Black using custom profiles and real-time preview
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Formatter Selection and Presets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="formatter-select">Formatter</Label>
              <Select value={formatter} onValueChange={(v) => setFormatter(v as FormatterType)}>
                <SelectTrigger id="formatter-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prettier">
                    <div className="flex flex-col">
                      <span>Prettier</span>
                      <span className="text-xs text-muted-foreground">JavaScript, TypeScript, CSS, HTML, JSON</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="black">
                    <div className="flex flex-col">
                      <span>Black</span>
                      <span className="text-xs text-muted-foreground">Python</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Preset Profiles</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyPresetProfile("standard")}
                >
                  Standard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyPresetProfile("airbnb")}
                >
                  Airbnb
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyPresetProfile("google")}
                >
                  Google
                </Button>
                {formatter === "black" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyPresetProfile("black")}
                  >
                    Black Default
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Configuration Options */}
          <div className="space-y-4">
            <Label className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Configuration Options</span>
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="semicolons">Semicolons</Label>
                <Select
                  value={config.semi ? "yes" : "no"}
                  onValueChange={(v) => setConfig(c => ({ ...c, semi: v === "yes" }))}
                >
                  <SelectTrigger id="semicolons">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quotes">Quotes</Label>
                <Select
                  value={config.singleQuote ? "single" : "double"}
                  onValueChange={(v) => setConfig(c => ({ ...c, singleQuote: v === "single" }))}
                >
                  <SelectTrigger id="quotes">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="double">Double</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="indentation">Indentation</Label>
                <Select
                  value={config.useTabs ? "tabs" : "spaces"}
                  onValueChange={(v) => setConfig(c => ({ ...c, useTabs: v === "tabs" }))}
                >
                  <SelectTrigger id="indentation">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spaces">Spaces</SelectItem>
                    <SelectItem value="tabs">Tabs</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tab-width">Tab Width</Label>
                <Select
                  value={config.tabWidth?.toString()}
                  onValueChange={(v) => setConfig(c => ({ ...c, tabWidth: parseInt(v) }))}
                >
                  <SelectTrigger id="tab-width">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="8">8</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Sample Code Buttons */}
          <div className="space-y-2">
            <Label>Load Sample Code</Label>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => loadSampleCode("js")}>
                JavaScript
              </Button>
              <Button variant="outline" size="sm" onClick={() => loadSampleCode("ts")}>
                TypeScript
              </Button>
              <Button variant="outline" size="sm" onClick={() => loadSampleCode("python")}>
                Python
              </Button>
              <Button variant="outline" size="sm" onClick={() => loadSampleCode("css")}>
                CSS
              </Button>
              <Button variant="outline" size="sm" onClick={() => setInputCode("")}>
                Clear
              </Button>
            </div>
          </div>

          {/* Code Input and Output */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="input-code">Input Code</Label>
                <Badge variant="secondary">{inputCode.length} characters</Badge>
              </div>

              {/* File Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${
                  isDragOver
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept={formatter === "prettier" ? ".js,.jsx,.ts,.tsx,.css,.scss,.html,.json,.md" : ".py,.pyw"}
                  onChange={handleFileUpload}
                />
                <div className="text-center mb-4">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {uploadedFile ? (
                      <>File loaded: <span className="font-medium">{uploadedFile.name}</span></>
                    ) : (
                      <>Drag & drop a file here, or <label htmlFor="file-upload" className="text-blue-500 hover:text-blue-600 cursor-pointer underline">browse</label></>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
                    Supported formats: {formatter === "prettier" ? "JS, TS, CSS, HTML, JSON, MD" : "Python files"}
                  </p>
                </div>
              </div>

              <Textarea
                id="input-code"
                rows={15}
                className="font-mono text-sm"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Paste your code here or upload a file..."
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="output-code">Formatted Output</Label>
                {formattedCode && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(formattedCode)}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadCode}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
              <Textarea
                id="output-code"
                rows={20}
                readOnly
                className="font-mono text-sm bg-muted/30"
                value={formattedCode}
                placeholder="Formatted code will appear here..."
              />
            </div>
          </div>

          {/* Format Button */}
          <div className="flex justify-center">
            <Button
              onClick={formatCode}
              disabled={formatting || !inputCode.trim()}
              size="lg"
              className="px-8"
            >
              {formatting ? "Formatting..." : `Format with ${formatter.toUpperCase()}`}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Current Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Semicolons:</span> {config.semi ? "Yes" : "No"}
            </div>
            <div>
              <span className="font-medium">Quotes:</span> {config.singleQuote ? "Single" : "Double"}
            </div>
            <div>
              <span className="font-medium">Indentation:</span> {config.useTabs ? "Tabs" : "Spaces"}
            </div>
            <div>
              <span className="font-medium">Tab Width:</span> {config.tabWidth}
            </div>
            <div>
              <span className="font-medium">Print Width:</span> {config.printWidth}
            </div>
            <div>
              <span className="font-medium">Trailing Comma:</span> {config.trailingComma}
            </div>
            <div>
              <span className="font-medium">Bracket Spacing:</span> {config.bracketSpacing ? "Yes" : "No"}
            </div>
            <div>
              <span className="font-medium">Arrow Parens:</span> {config.arrowParens}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <h4 className="font-medium">Choose Formatter</h4>
                  <p className="text-sm text-muted-foreground">
                    Select Prettier for JavaScript/TypeScript/CSS or Black for Python formatting.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <h4 className="font-medium">Configure Rules</h4>
                  <p className="text-sm text-muted-foreground">
                    Customize formatting options like semicolons, quotes, indentation, and line width.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <h4 className="font-medium">Input Code</h4>
                  <p className="text-sm text-muted-foreground">
                    Paste your code or load a sample. See real-time preview of formatting changes.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  4
                </div>
                <div>
                  <h4 className="font-medium">Format & Export</h4>
                  <p className="text-sm text-muted-foreground">
                    Apply formatting and copy or download the beautifully formatted code.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}