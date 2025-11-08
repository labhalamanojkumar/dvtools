"use client";

import { useCallback, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Code2, CheckCircle2, AlertTriangle, Copy, Download, Upload, FileText } from "lucide-react";

type LinterTool = "eslint" | "stylelint" | "flake8" | "rubocop";

export default function LinterRunnerClient() {
  // Linters state
  const [linter, setLinter] = useState<LinterTool>("eslint");
  const [code, setCode] = useState<string>("// Paste your JavaScript/TypeScript code here for linting\n\nfunction example() {\n  const message = 'Hello World';\n  console.log(message);\n}\n");
  const [fix, setFix] = useState<boolean>(true);
  const [linting, setLinting] = useState<boolean>(false);
  const [lintResult, setLintResult] = useState<any>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const runLinter = useCallback(async () => {
    if (!code.trim()) {
      toast.error("Please enter some code to lint");
      return;
    }

    setLinting(true);
    setLintResult(null);

    try {
      const res = await fetch("/api/tools/linter-runner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: linter, content: code, fix }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to run linter");
      }

      setLintResult({
        ...data.result,
        suggestions: data.result.diagnostics?.length || 0,
        output: data.result.output || JSON.stringify(data.result.diagnostics || [], null, 2)
      });

      if (data.result.notAvailable) {
        toast.warning(`${linter} is not available in this environment. Results shown are for demonstration.`);
      } else if (data.result?.fixedContent && fix) {
        setCode(data.result.fixedContent);
        toast.success("Code automatically fixed and applied");
      } else {
        toast.success(`${linter} linting completed`);
      }
    } catch (e: any) {
      toast.error(`Linter error: ${e.message}`);
    } finally {
      setLinting(false);
    }
  }, [linter, code, fix]);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (e) {
      toast.error("Failed to copy to clipboard");
    }
  }, []);

  const downloadCode = useCallback(() => {
    if (!lintResult?.fixedContent) {
      toast.error("No fixed code available to download");
      return;
    }

    const blob = new Blob([lintResult.fixedContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `linted-code.${getFileExtension(linter)}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Code downloaded");
  }, [lintResult, linter]);

  const getFileExtension = (tool: LinterTool): string => {
    switch (tool) {
      case "eslint": return "js";
      case "stylelint": return "css";
      case "flake8": return "py";
      case "rubocop": return "rb";
      default: return "txt";
    }
  };

  const getFileAcceptPattern = (tool: LinterTool): string => {
    switch (tool) {
      case "eslint": return ".js,.jsx,.ts,.tsx,.mjs,.cjs";
      case "stylelint": return ".css,.scss,.sass,.less";
      case "flake8": return ".py,.pyw";
      case "rubocop": return ".rb,.rake,.ru";
      default: return "*/*";
    }
  };

  const getLinterFileTypes = (tool: LinterTool): string => {
    switch (tool) {
      case "eslint": return "JavaScript/TypeScript";
      case "stylelint": return "CSS/SCSS";
      case "flake8": return "Python";
      case "rubocop": return "Ruby";
      default: return "code";
    }
  };

  const getLinterDescription = (tool: LinterTool): string => {
    switch (tool) {
      case "eslint": return "JavaScript/TypeScript linting with automatic fixes";
      case "stylelint": return "CSS/SCSS linting with style guide enforcement";
      case "flake8": return "Python linting with PEP 8 compliance";
      case "rubocop": return "Ruby linting with Rails best practices";
      default: return "";
    }
  };

  const getSampleCode = (tool: LinterTool): string => {
    switch (tool) {
      case "eslint":
        return `// Sample JavaScript code for ESLint
function greetUser(name) {
  const greeting = 'Hello, ' + name + '!';
  console.log(greeting);
  return greeting;
}

greetUser('World');`;
      case "stylelint":
        return `/* Sample CSS for Stylelint */
.header {
  background-color: #fff;
  color: #333;
  padding: 20px;
}

.button {
  border: none;
  background: blue;
  color: white;
  padding: 10px 20px;
}`;
      case "flake8":
        return `# Sample Python code for Flake8
def calculate_average(numbers):
    total = sum(numbers)
    count = len(numbers)
    if count == 0:
        return 0
    return total / count

result = calculate_average([1, 2, 3, 4, 5])
print(f"Average: {result}")`;
      case "rubocop":
        return `# Sample Ruby code for RuboCop
class Calculator
  def initialize
    @result = 0
  end

  def add(number)
    @result += number
    self
  end

  def multiply(number)
    @result *= number
    self
  end

  def value
    @result
  end
end

calc = Calculator.new.add(5).multiply(3)
puts calc.value`;
      default:
        return "// Select a linter to see sample code";
    }
  };

  const loadSampleCode = () => {
    setCode(getSampleCode(linter));
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
  }, [linter]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await processUploadedFile(file);
  }, [linter]);

  const processUploadedFile = useCallback(async (file: File) => {
    // Check file extension based on linter
    const allowedExtensions = {
      eslint: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'],
      stylelint: ['.css', '.scss', '.sass', '.less'],
      flake8: ['.py', '.pyw'],
      rubocop: ['.rb', '.rake', '.ru']
    };

    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    const allowed = allowedExtensions[linter];

    if (!allowed.includes(extension)) {
      toast.error(`Invalid file type for ${linter}. Allowed: ${allowed.join(', ')}`);
      return;
    }

    try {
      const text = await file.text();
      setCode(text);
      setUploadedFile(file);
      toast.success(`File "${file.name}" loaded successfully`);
    } catch (err) {
      toast.error("Failed to read file: " + (err as Error).message);
    }
  }, [linter]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code2 className="w-6 h-6" />
            <span>Linter Runner</span>
          </CardTitle>
          <CardDescription>
            Run professional linters for multiple programming languages with automatic code fixes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Linter Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linter-select">Linter Tool</Label>
              <Select value={linter} onValueChange={(v) => setLinter(v as LinterTool)}>
                <SelectTrigger id="linter-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eslint">
                    <div className="flex flex-col">
                      <span>ESLint</span>
                      <span className="text-xs text-muted-foreground">JavaScript/TypeScript</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="stylelint">
                    <div className="flex flex-col">
                      <span>Stylelint</span>
                      <span className="text-xs text-muted-foreground">CSS/SCSS</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="flake8">
                    <div className="flex flex-col">
                      <span>Flake8</span>
                      <span className="text-xs text-muted-foreground">Python</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="rubocop">
                    <div className="flex flex-col">
                      <span>RuboCop</span>
                      <span className="text-xs text-muted-foreground">Ruby</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fix-select">Auto Fix</Label>
              <Select value={fix ? "yes" : "no"} onValueChange={(v) => setFix(v === "yes")}>
                <SelectTrigger id="fix-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Enable Auto Fix</SelectItem>
                  <SelectItem value="no">Report Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quick Actions</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={loadSampleCode}>
                  Load Sample
                </Button>
                <Button variant="outline" size="sm" onClick={() => { setCode(""); setUploadedFile(null); }}>
                  Clear
                </Button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              {getLinterDescription(linter)}
            </p>
          </div>

          {/* Code Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="code-input">Code Input</Label>
              <Badge variant="secondary">{code.length} characters</Badge>
            </div>

            {/* File Upload Section */}
            <div>
              <Label htmlFor="file-upload">Upload Code File (Optional)</Label>
              <div
                className={`mt-1 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragOver
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className={`h-8 w-8 mx-auto mb-2 ${isDragOver ? 'text-primary' : 'text-muted-foreground'}`} />
                <p className="text-sm text-muted-foreground mb-2">
                  {isDragOver ? 'Drop your code file here' : 'Drag & drop a code file here, or click to browse'}
                </p>
                <Input
                  id="file-upload"
                  type="file"
                  onChange={handleFileUpload}
                  accept={getFileAcceptPattern(linter)}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Browse Files
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Upload {getLinterFileTypes(linter)} files for {linter.toUpperCase()} linting
              </p>
            </div>

            {uploadedFile && (
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{uploadedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(uploadedFile.size / 1024).toFixed(2)} KB • {uploadedFile.type || 'Unknown type'}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  File Loaded
                </Badge>
              </div>
            )}

            <Textarea
              id="code-input"
              rows={12}
              className="font-mono text-sm"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here or upload a file..."
            />
          </div>

          {/* Run Button */}
          <div className="flex justify-center">
            <Button
              onClick={runLinter}
              disabled={linting || !code.trim()}
              size="lg"
              className="px-8"
            >
              {linting ? "Running Linter..." : `Run ${linter.toUpperCase()}`}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {lintResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Linting Results</span>
              </div>
              {lintResult?.fixedContent && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(lintResult.fixedContent)}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy Fixed Code
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
            </CardTitle>
            <CardDescription>
              Analysis completed for {linter.toUpperCase()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {lintResult.errors || 0}
                </div>
                <div className="text-sm text-muted-foreground">Errors</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {lintResult.warnings || 0}
                </div>
                <div className="text-sm text-muted-foreground">Warnings</div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {lintResult.suggestions || 0}
                </div>
                <div className="text-sm text-muted-foreground">Suggestions</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {lintResult.fixed ? "Yes" : "No"}
                </div>
                <div className="text-sm text-muted-foreground">Auto Fixed</div>
              </div>
            </div>

            <Separator />

            {/* Detailed Output */}
            <div className="space-y-2">
              <Label>Detailed Output</Label>
              <ScrollArea className="h-96 w-full rounded-md border">
                <div className="p-4">
                  <pre className="text-sm font-mono whitespace-pre-wrap">
                    {lintResult.output || JSON.stringify(lintResult, null, 2)}
                  </pre>
                </div>
              </ScrollArea>
            </div>

            {/* Fixed Code Preview */}
            {lintResult?.fixedContent && (
              <>
                <Separator />
                <div className="space-y-2">
                  <Label>Fixed Code Preview</Label>
                  <ScrollArea className="h-64 w-full rounded-md border bg-muted/30">
                    <div className="p-4">
                      <pre className="text-sm font-mono whitespace-pre-wrap">
                        {lintResult.fixedContent}
                      </pre>
                    </div>
                  </ScrollArea>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

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
                  <h4 className="font-medium">Select Linter</h4>
                  <p className="text-sm text-muted-foreground">
                    Choose from ESLint, Stylelint, Flake8, or RuboCop based on your programming language.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <h4 className="font-medium">Configure Options</h4>
                  <p className="text-sm text-muted-foreground">
                    Enable auto-fix to automatically correct common issues, or run in report-only mode.
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
                  <h4 className="font-medium">Run Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    Click "Run Linter" to analyze your code and get detailed feedback with error locations.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  4
                </div>
                <div>
                  <h4 className="font-medium">Apply Fixes</h4>
                  <p className="text-sm text-muted-foreground">
                    Review and apply automatic fixes, or manually correct issues based on the detailed report.
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
