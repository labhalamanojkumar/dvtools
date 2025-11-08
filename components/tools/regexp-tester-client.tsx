"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { copyToClipboard, downloadFile } from "../../lib/utils";
import { useToast } from "../ui/toaster";
import { Copy, Download, CheckCircle, XCircle, Upload, FileText } from "lucide-react";

// Utility function to escape HTML special characters
const escapeHtml = (str: string): string => {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return str.replace(/[&<>"']/g, match => htmlEscapes[match]);
};

export function RegexpTesterClient() {
  // Application state
  const [pattern, setPattern] = useState("");
  const [testString, setTestString] = useState("");
  const [flags, setFlags] = useState("g");
  const [matches, setMatches] = useState<RegExpExecArray[]>([]);
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [highlightedText, setHighlightedText] = useState("");
  const [hasError, setHasError] = useState(false);
  const { toast } = useToast();

  // Generate highlighted HTML from text and matches with special character escaping
  const generateHighlightedText = (text: string, matchArray: RegExpExecArray[]) => {
    if (!text || matchArray.length === 0) {
      return escapeHtml(text);
    }

    // Sort matches by position to handle overlapping matches
    const sortedMatches = [...matchArray].sort((a, b) => a.index - b.index);

    let result = "";
    let lastIndex = 0;

    sortedMatches.forEach((match, index) => {
      // Add text before the match with HTML escaping
      if (match.index > lastIndex) {
        result += escapeHtml(text.slice(lastIndex, match.index));
      }

      // Add highlighted match with HTML escaping
      const matchText = escapeHtml(match[0]);
      const highlightClass = `bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 px-1 rounded border border-yellow-300 dark:border-yellow-600 cursor-pointer hover:bg-yellow-300 dark:hover:bg-yellow-700 transition-colors`;
      result += `<span class="${highlightClass}" data-match-index="${index}" onclick="handleMatchClick(${index})" onmouseover="handleMatchHover(${index}, true)" onmouseout="handleMatchHover(${index}, false)" title="Match ${index + 1}: ${matchText}">${matchText}</span>`;

      lastIndex = match.index + match[0].length;
    });

    // Add remaining text with HTML escaping
    if (lastIndex < text.length) {
      result += escapeHtml(text.slice(lastIndex));
    }

    return result;
  };

  // Handle text input changes
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setTestString(newText);
  };

  useEffect(() => {
    // Set up global functions for match interaction
    (window as any).handleMatchClick = (matchIndex: number) => {
      const resultElement = document.querySelector(`[data-result-index="${matchIndex}"]`);
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Add temporary highlight
        resultElement.classList.add('ring-2', 'ring-blue-500', 'ring-opacity-50');
        setTimeout(() => {
          resultElement.classList.remove('ring-2', 'ring-blue-500', 'ring-opacity-50');
        }, 2000);
      }
    };

    (window as any).handleMatchHover = (matchIndex: number, isHover: boolean) => {
      const resultElement = document.querySelector(`[data-result-index="${matchIndex}"]`);
      if (resultElement) {
        if (isHover) {
          resultElement.classList.add('bg-blue-50', 'dark:bg-blue-950', 'border-blue-200', 'dark:border-blue-800');
        } else {
          resultElement.classList.remove('bg-blue-50', 'dark:bg-blue-950', 'border-blue-200', 'dark:border-blue-800');
        }
      }
    };

    return () => {
      // Cleanup
      delete (window as any).handleMatchClick;
      delete (window as any).handleMatchHover;
    };
  }, []);

  // Error recovery
  const resetError = () => {
    setHasError(false);
    setError("");
  };

  // Main regex processing effect
  useEffect(() => {
    resetError();

    if (!pattern.trim()) {
      setMatches([]);
      setIsValid(false);
      setHighlightedText("");
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      setIsValid(true);

      if (!testString.trim()) {
        setMatches([]);
        setHighlightedText("");
        return;
      }

      const matchesArray: RegExpExecArray[] = [];
      let match;

      // Timeout guard for catastrophic backtracking
      const timeoutId = setTimeout(() => {
        setError("Pattern execution timed out. Possible catastrophic backtracking.");
        setHasError(true);
        setMatches([]);
        setHighlightedText(testString);
      }, 1000);

      try {
        // Reset lastIndex for global regex
        regex.lastIndex = 0;

        // Find all matches
        while ((match = regex.exec(testString)) !== null) {
          matchesArray.push(match);

          // Prevent infinite loop for zero-width matches
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }

          // Break if too many matches (performance safeguard)
          if (matchesArray.length > 10000) {
            setError("Too many matches (>10000). Try a more specific pattern.");
            break;
          }
        }

        clearTimeout(timeoutId);
        setMatches(matchesArray);
        setHighlightedText(generateHighlightedText(testString, matchesArray));
      } catch (innerErr) {
        clearTimeout(timeoutId);
        throw innerErr;
      }
    } catch (err) {
      setError((err as Error).message);
      setHasError(true);
      setIsValid(false);
      setMatches([]);
      setHighlightedText(testString);
    }
  }, [pattern, flags, testString]);

  // Update highlighted text when matches change
  useEffect(() => {
    setHighlightedText(generateHighlightedText(testString, matches));
  }, [matches, testString]);

  const copyMatches = () => {
    const matchText = matches
      .map(
        (match, index) =>
          `Match ${index + 1}: "${match[0]}" at position ${match.index}`,
      )
      .join("\n");
    copyToClipboard(matchText);
    toast({ title: "Success", description: "Matches copied to clipboard" });
  };

  const downloadMatches = () => {
    const matchText = matches
      .map(
        (match, index) =>
          `Match ${index + 1}: "${match[0]}" at position ${match.index}`,
      )
      .join("\n");
    downloadFile(matchText, "regex-matches.txt", "text/plain");
  };

  const toggleFlag = (flag: string) => {
    setFlags((prev) =>
      prev.includes(flag) ? prev.replace(flag, "") : prev + flag,
    );
  };

  const handleFileUpload = (file: File) => {
    if (!file) return;

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
      setTestString(content);
      // Highlighted text will be updated by useEffect
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

  return (
    <div className="space-y-6">
      {/* Pattern Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Regular Expression Pattern
            {isValid ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter regex pattern (e.g., \w+@\w+\.\w+)"
              className="font-mono"
            />
            {pattern && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPattern("");
                  setTestString("");
                  setMatches([]);
                  setHighlightedText("");
                }}
                title="Clear pattern and text"
              >
                Clear
              </Button>
            )}
          </div>

          {/* Flags */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: "g", label: "Global", desc: "Find all matches" },
              { key: "i", label: "Case Insensitive", desc: "Ignore case" },
              {
                key: "m",
                label: "Multiline",
                desc: "^ and $ match line starts/ends",
              },
              { key: "s", label: "Dot All", desc: ". matches newlines" },
              { key: "u", label: "Unicode", desc: "Unicode support" },
              { key: "y", label: "Sticky", desc: "Sticky matching" },
            ].map(({ key, label, desc }) => (
              <Button
                key={key}
                variant={flags.includes(key) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleFlag(key)}
                title={desc}
              >
                {key} - {label}
              </Button>
            ))}
          </div>

          {error && (
            <div className="text-red-500 text-sm font-mono bg-red-50 dark:bg-red-950 p-2 rounded border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {isValid && pattern && (
            <div className="text-green-600 text-sm font-mono bg-green-50 dark:bg-green-950 p-2 rounded border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Valid regex pattern</span>
                {flags && <span className="text-muted-foreground">with flags: {flags}</span>}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test String Input */}
      <Card>
        <CardHeader>
          <CardTitle>Test String</CardTitle>
        </CardHeader>
        <CardContent>
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
                Drag & drop a text file here, or click to browse
              </p>
              <input
                type="file"
                accept=".txt,.log,.md,.json,.xml,.csv,.html,.css,.js,.ts,.py,.java,.cpp,.c,.php,.rb,.go,.rs,.sh,.yml,.yaml,text/*"
                onChange={handleFileInputChange}
                className="hidden"
                id="text-file-input"
              />
              <label htmlFor="text-file-input">
                <Button variant="outline" size="sm" asChild>
                  <span className="cursor-pointer">
                    <Upload className="mr-2 h-4 w-4" />
                    Choose File
                  </span>
                </Button>
              </label>
              <p className="text-xs text-muted-foreground mt-2">
                Supports text files up to 10MB
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Textarea
              value={testString}
              onChange={handleTextChange}
              placeholder="Enter text to test against the regex pattern, or upload a file above..."
              className="font-mono text-sm h-[200px]"
            />

            {pattern && testString && (
              <div
                className="p-3 border rounded-md bg-background text-foreground font-mono text-sm leading-relaxed whitespace-pre-wrap min-h-[100px]"
                dangerouslySetInnerHTML={{ __html: highlightedText }}
                style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
              />
            )}
          </div>
          {testString && (
            <div className="flex justify-between items-center text-xs text-muted-foreground mt-2 px-1">
              <span>
                {testString.length} characters, {testString.split('\n').length} lines
              </span>
              {matches.length > 0 && (
                <span>
                  {matches.length} match{matches.length !== 1 ? 'es' : ''} found
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle>Matches ({matches.length})</CardTitle>
              {matches.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Pattern: <code className="bg-muted px-1 rounded text-xs">{pattern}</code></span>
                  <span>Flags: <code className="bg-muted px-1 rounded text-xs">{flags || 'none'}</code></span>
                </div>
              )}
            </div>
            {matches.length > 0 && (
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={copyMatches} aria-label="Copy matches">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={downloadMatches} aria-label="Download matches">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {matches.length > 0 && (
            <div className="mb-4 p-3 bg-muted/50 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">Total Matches:</span>
                  <span className="ml-2 font-semibold text-green-600">{matches.length}</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Match Rate:</span>
                  <span className="ml-2 font-semibold">
                    {testString ? ((matches.length / testString.length) * 100).toFixed(2) : 0}%
                  </span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Avg. Length:</span>
                  <span className="ml-2 font-semibold">
                    {matches.length > 0 ? (matches.reduce((sum, m) => sum + m[0].length, 0) / matches.length).toFixed(1) : 0} chars
                  </span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Coverage:</span>
                  <span className="ml-2 font-semibold">
                    {testString && matches.length > 0
                      ? ((matches.reduce((sum, m) => sum + m[0].length, 0) / testString.length) * 100).toFixed(1)
                      : 0}% of text
                  </span>
                </div>
              </div>
            </div>
          )}

          {matches.length === 0 ? (
            <div className="text-muted-foreground">
              {testString
                ? "No matches found"
                : "Enter a test string to see matches"}
            </div>
          ) : (
            <div className="space-y-3">
              {matches.map((match, index) => (
                <div key={index} className="border rounded-lg p-4 transition-colors" data-result-index={index}>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">Match {index + 1}</Badge>
                    <span className="text-sm text-muted-foreground">
                      Position: {match.index}
                    </span>
                  </div>
                  <div className="font-mono bg-muted p-2 rounded text-sm">
                    &ldquo;{match[0]}&rdquo;
                  </div>
                  {match.length > 1 && (
                    <div className="mt-2">
                      <div className="text-sm font-semibold mb-1">Groups:</div>
                      <div className="grid gap-1">
                        {match.slice(1).map((group, groupIndex) => (
                          <div key={groupIndex} className="text-sm">
                            <span className="font-mono">
                              Group {groupIndex + 1}:
                            </span>{" "}
                            &ldquo;{group}&rdquo;
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Button
              variant="outline"
              className="justify-start text-left h-auto p-4"
              onClick={() => {
                setPattern("\\w+@\\w+\\.\\w+");
                setTestString(
                  "Contact us at support@example.com or admin@test.org",
                );
              }}
            >
              <div>
                <div className="font-semibold">Email Addresses</div>
                <div className="text-sm text-muted-foreground">
                  \w+@\w+\.\w+
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="justify-start text-left h-auto p-4"
              onClick={() => {
                setPattern("\\d{3}-\\d{3}-\\d{4}");
                setTestString("Call me at 555-123-4567 or 999-888-7777");
              }}
            >
              <div>
                <div className="font-semibold">Phone Numbers</div>
                <div className="text-sm text-muted-foreground">
                  \d{3}-\d{3}-\d{4}
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="justify-start text-left h-auto p-4"
              onClick={() => {
                setPattern("https?://\\S+");
                setTestString(
                  "Visit https://example.com and http://test.org for more info",
                );
              }}
            >
              <div>
                <div className="font-semibold">URLs</div>
                <div className="text-sm text-muted-foreground">
                  https?://\S+
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="justify-start text-left h-auto p-4"
              onClick={() => {
                setPattern("#[0-9a-fA-F]{6}");
                setTestString("Colors: #FF0000, #00FF00, #0000FF, #invalid");
              }}
            >
              <div>
                <div className="font-semibold">Hex Colors</div>
                <div className="text-sm text-muted-foreground">
                  #[0-9a-fA-F]{6}
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="justify-start text-left h-auto p-4"
              onClick={() => {
                setPattern("\\b\\d{4}-\\d{2}-\\d{2}\\b");
                setTestString("Dates: 2023-12-25, 2024-01-01, invalid-date");
              }}
            >
              <div>
                <div className="font-semibold">ISO Dates</div>
                <div className="text-sm text-muted-foreground">
                  \b\d{4}-\d{2}-\d{2}\b
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="justify-start text-left h-auto p-4"
              onClick={() => {
                setPattern("\\b\\w+\\b");
                setTestString("Hello world! This is a test.");
              }}
            >
              <div>
                <div className="font-semibold">Words</div>
                <div className="text-sm text-muted-foreground">\b\w+\b</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Help */}
      <Card>
        <CardHeader>
          <CardTitle>Regex Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-2">Common Patterns</h4>
              <div className="space-y-1 text-sm">
                <div>
                  <code>\d</code> - Digit (0-9)
                </div>
                <div>
                  <code>\w</code> - Word character (a-z, A-Z, 0-9, _)
                </div>
                <div>
                  <code>\s</code> - Whitespace
                </div>
                <div>
                  <code>.</code> - Any character
                </div>
                <div>
                  <code>\b</code> - Word boundary
                </div>
                <div>
                  <code>^</code> - Start of string/line
                </div>
                <div>
                  <code>$</code> - End of string/line
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Quantifiers</h4>
              <div className="space-y-1 text-sm">
                <div>
                  <code>*</code> - Zero or more
                </div>
                <div>
                  <code>+</code> - One or more
                </div>
                <div>
                  <code>?</code> - Zero or one
                </div>
                <div>
                  <code>{"{n}"}</code> - Exactly n times
                </div>
                <div>
                  <code>{"{n,}"}</code> - n or more times
                </div>
                <div>
                  <code>{"{n,m}"}</code> - Between n and m times
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
