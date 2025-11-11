'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Copy,
  Download,
  Upload,
  GitCompare,
  CheckCircle2,
  FileText,
  RotateCw,
  ChevronRight,
  Plus,
  Minus,
  ArrowRight,
} from 'lucide-react';
import { useToast } from '@/components/ui/toaster';

interface DiffResult {
  type: 'equal' | 'insert' | 'delete' | 'replace';
  oldLine?: string;
  newLine?: string;
  oldLineNum?: number;
  newLineNum?: number;
}

interface DiffStats {
  additions: number;
  deletions: number;
  modifications: number;
  unchanged: number;
}

export default function TextDiffCheckerClient() {
  const [originalText, setOriginalText] = useState('');
  const [modifiedText, setModifiedText] = useState('');
  const [diffResult, setDiffResult] = useState<DiffResult[]>([]);
  const [diffStats, setDiffStats] = useState<DiffStats | null>(null);
  const [viewMode, setViewMode] = useState<'side-by-side' | 'unified' | 'split'>('side-by-side');
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);
  const { toast } = useToast();

  const computeDiff = useCallback(() => {
    if (!originalText && !modifiedText) {
      toast({
        title: 'Error',
        description: 'Please provide text to compare',
        variant: 'destructive',
      });
      return;
    }

    let original = originalText;
    let modified = modifiedText;

    // Apply options
    if (ignoreWhitespace) {
      original = original.replace(/\s+/g, ' ').trim();
      modified = modified.replace(/\s+/g, ' ').trim();
    }
    if (ignoreCase) {
      original = original.toLowerCase();
      modified = modified.toLowerCase();
    }

    const originalLines = original.split('\n');
    const modifiedLines = modified.split('\n');

    const diffs: DiffResult[] = [];
    const stats: DiffStats = {
      additions: 0,
      deletions: 0,
      modifications: 0,
      unchanged: 0,
    };

    let oldIdx = 0;
    let newIdx = 0;

    // Simple line-by-line diff algorithm
    while (oldIdx < originalLines.length || newIdx < modifiedLines.length) {
      const oldLine = originalLines[oldIdx];
      const newLine = modifiedLines[newIdx];

      if (oldIdx >= originalLines.length) {
        // Only new lines remaining
        diffs.push({
          type: 'insert',
          newLine,
          newLineNum: newIdx + 1,
        });
        stats.additions++;
        newIdx++;
      } else if (newIdx >= modifiedLines.length) {
        // Only old lines remaining
        diffs.push({
          type: 'delete',
          oldLine,
          oldLineNum: oldIdx + 1,
        });
        stats.deletions++;
        oldIdx++;
      } else if (oldLine === newLine) {
        // Lines are equal
        diffs.push({
          type: 'equal',
          oldLine,
          newLine,
          oldLineNum: oldIdx + 1,
          newLineNum: newIdx + 1,
        });
        stats.unchanged++;
        oldIdx++;
        newIdx++;
      } else {
        // Lines are different - check if it's a modification or insert/delete
        const nextOldLine = originalLines[oldIdx + 1];
        const nextNewLine = modifiedLines[newIdx + 1];

        if (newLine === nextOldLine) {
          // Current old line was deleted
          diffs.push({
            type: 'delete',
            oldLine,
            oldLineNum: oldIdx + 1,
          });
          stats.deletions++;
          oldIdx++;
        } else if (oldLine === nextNewLine) {
          // Current new line was inserted
          diffs.push({
            type: 'insert',
            newLine,
            newLineNum: newIdx + 1,
          });
          stats.additions++;
          newIdx++;
        } else {
          // Lines were replaced/modified
          diffs.push({
            type: 'replace',
            oldLine,
            newLine,
            oldLineNum: oldIdx + 1,
            newLineNum: newIdx + 1,
          });
          stats.modifications++;
          oldIdx++;
          newIdx++;
        }
      }
    }

    setDiffResult(diffs);
    setDiffStats(stats);

    toast({
      title: 'Diff Computed',
      description: `Found ${stats.additions} additions, ${stats.deletions} deletions, ${stats.modifications} modifications`,
    });
  }, [originalText, modifiedText, ignoreWhitespace, ignoreCase, toast]);

  const handleFileUpload = (file: File, target: 'original' | 'modified') => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (target === 'original') {
        setOriginalText(content);
      } else {
        setModifiedText(content);
      }
      toast({
        title: 'File Loaded',
        description: `${file.name} loaded successfully`,
      });
    };
    reader.onerror = () => {
      toast({
        title: 'Error',
        description: 'Failed to read file',
        variant: 'destructive',
      });
    };
    reader.readAsText(file);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'Diff result copied to clipboard',
    });
  };

  const downloadDiff = () => {
    if (!diffResult.length) {
      toast({
        title: 'Error',
        description: 'No diff to download',
        variant: 'destructive',
      });
      return;
    }

    let diffText = '--- Original\n+++ Modified\n\n';
    diffResult.forEach((diff) => {
      if (diff.type === 'delete') {
        diffText += `- ${diff.oldLine}\n`;
      } else if (diff.type === 'insert') {
        diffText += `+ ${diff.newLine}\n`;
      } else if (diff.type === 'replace') {
        diffText += `- ${diff.oldLine}\n+ ${diff.newLine}\n`;
      } else {
        diffText += `  ${diff.oldLine}\n`;
      }
    });

    const blob = new Blob([diffText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diff-${Date.now()}.diff`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Downloaded',
      description: 'Diff file downloaded successfully',
    });
  };

  const resetAll = () => {
    setOriginalText('');
    setModifiedText('');
    setDiffResult([]);
    setDiffStats(null);
    toast({
      title: 'Reset',
      description: 'All fields cleared',
    });
  };

  const renderSideBySide = () => (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="text-sm font-semibold mb-2 text-red-600 dark:text-red-400">
          Original (Deletions)
        </h3>
        <div className="border rounded-md p-4 bg-muted/30 font-mono text-xs max-h-[500px] overflow-auto">
          {diffResult.map((diff, idx) => {
            if (diff.type === 'delete' || diff.type === 'replace') {
              return (
                <div key={idx} className="flex items-start gap-2 bg-red-50 dark:bg-red-950/30 px-2 py-1 mb-1 rounded">
                  <span className="text-red-600 dark:text-red-400 font-bold min-w-[40px]">
                    {diff.oldLineNum}
                  </span>
                  <Minus className="h-3 w-3 text-red-600 dark:text-red-400 mt-0.5" />
                  <span className="text-red-700 dark:text-red-300">{diff.oldLine}</span>
                </div>
              );
            } else if (diff.type === 'equal') {
              return (
                <div key={idx} className="flex items-start gap-2 px-2 py-1 mb-1">
                  <span className="text-muted-foreground min-w-[40px]">{diff.oldLineNum}</span>
                  <span className="w-3" />
                  <span className="text-muted-foreground">{diff.oldLine}</span>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2 text-green-600 dark:text-green-400">
          Modified (Additions)
        </h3>
        <div className="border rounded-md p-4 bg-muted/30 font-mono text-xs max-h-[500px] overflow-auto">
          {diffResult.map((diff, idx) => {
            if (diff.type === 'insert' || diff.type === 'replace') {
              return (
                <div key={idx} className="flex items-start gap-2 bg-green-50 dark:bg-green-950/30 px-2 py-1 mb-1 rounded">
                  <span className="text-green-600 dark:text-green-400 font-bold min-w-[40px]">
                    {diff.newLineNum}
                  </span>
                  <Plus className="h-3 w-3 text-green-600 dark:text-green-400 mt-0.5" />
                  <span className="text-green-700 dark:text-green-300">{diff.newLine}</span>
                </div>
              );
            } else if (diff.type === 'equal') {
              return (
                <div key={idx} className="flex items-start gap-2 px-2 py-1 mb-1">
                  <span className="text-muted-foreground min-w-[40px]">{diff.newLineNum}</span>
                  <span className="w-3" />
                  <span className="text-muted-foreground">{diff.newLine}</span>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );

  const renderUnified = () => (
    <div className="border rounded-md p-4 bg-muted/30 font-mono text-xs max-h-[500px] overflow-auto">
      {diffResult.map((diff, idx) => {
        if (diff.type === 'delete') {
          return (
            <div key={idx} className="flex items-start gap-2 bg-red-50 dark:bg-red-950/30 px-2 py-1 mb-1 rounded">
              <span className="text-red-600 dark:text-red-400 font-bold min-w-[40px]">
                {diff.oldLineNum}
              </span>
              <Minus className="h-3 w-3 text-red-600 dark:text-red-400 mt-0.5" />
              <span className="text-red-700 dark:text-red-300">{diff.oldLine}</span>
            </div>
          );
        } else if (diff.type === 'insert') {
          return (
            <div key={idx} className="flex items-start gap-2 bg-green-50 dark:bg-green-950/30 px-2 py-1 mb-1 rounded">
              <span className="text-green-600 dark:text-green-400 font-bold min-w-[40px]">
                {diff.newLineNum}
              </span>
              <Plus className="h-3 w-3 text-green-600 dark:text-green-400 mt-0.5" />
              <span className="text-green-700 dark:text-green-300">{diff.newLine}</span>
            </div>
          );
        } else if (diff.type === 'replace') {
          return (
            <div key={idx} className="mb-1">
              <div className="flex items-start gap-2 bg-red-50 dark:bg-red-950/30 px-2 py-1 rounded-t">
                <span className="text-red-600 dark:text-red-400 font-bold min-w-[40px]">
                  {diff.oldLineNum}
                </span>
                <Minus className="h-3 w-3 text-red-600 dark:text-red-400 mt-0.5" />
                <span className="text-red-700 dark:text-red-300">{diff.oldLine}</span>
              </div>
              <div className="flex items-start gap-2 bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded-b">
                <span className="text-green-600 dark:text-green-400 font-bold min-w-[40px]">
                  {diff.newLineNum}
                </span>
                <Plus className="h-3 w-3 text-green-600 dark:text-green-400 mt-0.5" />
                <span className="text-green-700 dark:text-green-300">{diff.newLine}</span>
              </div>
            </div>
          );
        } else {
          return (
            <div key={idx} className="flex items-start gap-2 px-2 py-1 mb-1">
              <span className="text-muted-foreground min-w-[40px]">{diff.oldLineNum}</span>
              <span className="w-3" />
              <span className="text-muted-foreground">{diff.oldLine}</span>
            </div>
          );
        }
      })}
    </div>
  );

  return (
    <div className="container mx-auto max-w-7xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Text Diff Checker</h1>
          <p className="text-muted-foreground">
            Compare text files, code, configurations side-by-side
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          <GitCompare className="mr-1 h-3 w-3" />
          Version Control
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About This Tool</CardTitle>
          <CardDescription>
            Professional diff checker for code review, configuration comparison, and debugging
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Compare two versions of text, code, or configuration files with highlighted differences. 
            Perfect for reviewing changes, debugging issues, and understanding version control diffs. 
            Supports side-by-side and unified diff views with customizable comparison options.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                Key Features
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Side-by-side comparison view</li>
                <li>• Unified diff format</li>
                <li>• Line-by-line highlighting</li>
                <li>• File upload support</li>
                <li>• Ignore whitespace option</li>
                <li>• Case-insensitive comparison</li>
                <li>• Download diff results</li>
                <li>• Detailed statistics</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <FileText className="mr-2 h-4 w-4 text-primary" />
                Use Cases
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Code review and pull requests</li>
                <li>• Configuration file comparison</li>
                <li>• Debugging text changes</li>
                <li>• Version control analysis</li>
                <li>• Document revisions</li>
                <li>• API response comparison</li>
                <li>• Log file analysis</li>
                <li>• Merge conflict resolution</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Original Text
              <Button
                size="sm"
                variant="outline"
                onClick={() => document.getElementById('original-file')?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </CardTitle>
            <input
              id="original-file"
              type="file"
              accept=".txt,.md,.json,.xml,.csv,.log,.conf,.config,.js,.ts,.jsx,.tsx,.py,.java,.c,.cpp,.html,.css"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, 'original');
              }}
            />
          </CardHeader>
          <CardContent>
            <Textarea
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              placeholder="Paste or upload original text..."
              rows={15}
              className="font-mono text-xs"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Modified Text
              <Button
                size="sm"
                variant="outline"
                onClick={() => document.getElementById('modified-file')?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </CardTitle>
            <input
              id="modified-file"
              type="file"
              accept=".txt,.md,.json,.xml,.csv,.log,.conf,.config,.js,.ts,.jsx,.tsx,.py,.java,.c,.cpp,.html,.css"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, 'modified');
              }}
            />
          </CardHeader>
          <CardContent>
            <Textarea
              value={modifiedText}
              onChange={(e) => setModifiedText(e.target.value)}
              placeholder="Paste or upload modified text..."
              rows={15}
              className="font-mono text-xs"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comparison Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="ignore-whitespace"
                checked={ignoreWhitespace}
                onChange={(e) => setIgnoreWhitespace(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="ignore-whitespace">Ignore Whitespace</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="ignore-case"
                checked={ignoreCase}
                onChange={(e) => setIgnoreCase(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="ignore-case">Ignore Case</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Label>View Mode:</Label>
              <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="side-by-side">Side by Side</SelectItem>
                  <SelectItem value="unified">Unified</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={computeDiff} className="flex-1">
              <GitCompare className="mr-2 h-4 w-4" />
              Compare
            </Button>
            <Button variant="outline" onClick={resetAll}>
              <RotateCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {diffStats && (
        <Card>
          <CardHeader>
            <CardTitle>Diff Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/30">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  +{diffStats.additions}
                </div>
                <div className="text-sm text-muted-foreground">Additions</div>
              </div>
              <div className="p-4 border rounded-lg bg-red-50 dark:bg-red-950/30">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  -{diffStats.deletions}
                </div>
                <div className="text-sm text-muted-foreground">Deletions</div>
              </div>
              <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950/30">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {diffStats.modifications}
                </div>
                <div className="text-sm text-muted-foreground">Modifications</div>
              </div>
              <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/30">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {diffStats.unchanged}
                </div>
                <div className="text-sm text-muted-foreground">Unchanged</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {diffResult.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Diff Results
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const diffText = diffResult
                      .map((d) => {
                        if (d.type === 'delete') return `- ${d.oldLine}`;
                        if (d.type === 'insert') return `+ ${d.newLine}`;
                        if (d.type === 'replace') return `- ${d.oldLine}\n+ ${d.newLine}`;
                        return `  ${d.oldLine}`;
                      })
                      .join('\n');
                    copyToClipboard(diffText);
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={downloadDiff}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {viewMode === 'side-by-side' ? renderSideBySide() : renderUnified()}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
