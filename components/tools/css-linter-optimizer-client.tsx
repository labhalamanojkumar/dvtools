'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Code,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Copy,
  Download,
  Zap,
  Palette,
  Settings,
  Eye,
  FileText
} from 'lucide-react';
import { useToast } from '@/components/ui/toaster';

interface LintIssue {
  line: number;
  column: number;
  severity: 'error' | 'warning' | 'info';
  message: string;
  rule: string;
  source: string;
}

interface OptimizationResult {
  originalSize: number;
  optimizedSize: number;
  savings: number;
  savingsPercent: number;
  issues: LintIssue[];
  optimized: string;
}

const sampleCSS = `/* Sample CSS with issues */
.button {
  background-color: red;
  border: 1px solid #ff0000;
  padding: 10px 20px;
  margin: 0 auto;
  font-size: 16px;
  color: #000;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 20px;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .button {
    padding: 8px 16px;
    font-size: 14px;
  }
}

/* Unused selector */
.unused-class {
  color: blue;
  font-weight: bold;
}

/* Duplicate properties */
.duplicate {
  color: red;
  color: blue;
  font-size: 12px;
}`;

export default function CssLinterOptimizerClient() {
  const [input, setInput] = useState(sampleCSS);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lintLevel, setLintLevel] = useState('standard');
  const [optimizationLevel, setOptimizationLevel] = useState('balanced');
  const { toast } = useToast();

  const lintRules = {
    'color-named': { severity: 'warning', message: 'Use hex colors instead of named colors' },
    'duplicate-properties': { severity: 'error', message: 'Duplicate CSS properties found' },
    'unused-selectors': { severity: 'info', message: 'Potentially unused CSS selector' },
    'missing-semicolon': { severity: 'error', message: 'Missing semicolon after property' },
    'invalid-property': { severity: 'error', message: 'Invalid CSS property' },
    'important-usage': { severity: 'warning', message: 'Avoid using !important' },
    'long-selector': { severity: 'info', message: 'Consider shortening this selector' },
    'vendor-prefix': { severity: 'info', message: 'Vendor prefix detected' }
  };

  const analyzeCSS = (css: string): LintIssue[] => {
    const issues: LintIssue[] = [];
    const lines = css.split('\n');

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      // Check for named colors
      if (lintLevel !== 'basic' && /color:\s*(red|blue|green|yellow|black|white|gray|purple|orange|pink)/gi.test(line)) {
        issues.push({
          line: lineNumber,
          column: line.indexOf('color:') + 1,
          severity: 'warning',
          message: lintRules['color-named'].message,
          rule: 'color-named',
          source: line.trim()
        });
      }

      // Check for !important
      if (lintLevel === 'strict' && /!important/gi.test(line)) {
        issues.push({
          line: lineNumber,
          column: line.indexOf('!important') + 1,
          severity: 'warning',
          message: lintRules['important-usage'].message,
          rule: 'important-usage',
          source: line.trim()
        });
      }

      // Check for missing semicolons
      if (/[^;{}]\s*$/.test(line) && !line.includes('{') && !line.includes('}') && !line.includes('/*') && line.trim()) {
        issues.push({
          line: lineNumber,
          column: line.length,
          severity: 'error',
          message: lintRules['missing-semicolon'].message,
          rule: 'missing-semicolon',
          source: line.trim()
        });
      }

      // Check for long selectors
      if (lintLevel === 'strict' && line.includes('{') && line.replace(/\s+/g, '').length > 50) {
        issues.push({
          line: lineNumber,
          column: 1,
          severity: 'info',
          message: lintRules['long-selector'].message,
          rule: 'long-selector',
          source: line.trim()
        });
      }
    });

    // Check for duplicate properties within the same rule
    const rules = css.split('}');
    rules.forEach((rule, ruleIndex) => {
      const properties = rule.split('{')[1]?.split(';') || [];
      const seen = new Set<string>();

      properties.forEach((prop, propIndex) => {
        const cleanProp = prop.trim().split(':')[0]?.trim();
        if (cleanProp && seen.has(cleanProp)) {
          const lineOffset = rule.split('\n').slice(0, propIndex + 1).join('\n').split('\n').length;
          issues.push({
            line: ruleIndex * 5 + lineOffset, // Approximate line number
            column: 1,
            severity: 'error',
            message: lintRules['duplicate-properties'].message,
            rule: 'duplicate-properties',
            source: cleanProp
          });
        }
        if (cleanProp) seen.add(cleanProp);
      });
    });

    return issues;
  };

  const optimizeCSS = (css: string, issues: LintIssue[]): string => {
    let optimized = css;

    // Remove extra whitespace
    optimized = optimized.replace(/\s+/g, ' ');
    optimized = optimized.replace(/\s*{\s*/g, '{');
    optimized = optimized.replace(/\s*}\s*/g, '}');
    optimized = optimized.replace(/\s*;\s*/g, ';');
    optimized = optimized.replace(/;\s*}/g, '}');

    // Remove comments if aggressive optimization
    if (optimizationLevel === 'aggressive') {
      optimized = optimized.replace(/\/\*[\s\S]*?\*\//g, '');
    }

    // Remove empty rules
    optimized = optimized.replace(/{[^{}]*}/g, (match) => {
      return match.length > 2 ? match : '';
    });

    // Clean up multiple spaces
    optimized = optimized.replace(/\s+/g, ' ').trim();

    return optimized;
  };

  const handleAnalyze = async () => {
    if (!input.trim()) {
      toast({
        title: "Error",
        description: "Please enter CSS code to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const issues = analyzeCSS(input);
      const optimized = optimizeCSS(input, issues);
      const originalSize = new Blob([input]).size;
      const optimizedSize = new Blob([optimized]).size;
      const savings = originalSize - optimizedSize;
      const savingsPercent = originalSize > 0 ? (savings / originalSize) * 100 : 0;

      const result: OptimizationResult = {
        originalSize,
        optimizedSize,
        savings,
        savingsPercent,
        issues,
        optimized
      };

      setResult(result);

      toast({
        title: "Analysis Complete",
        description: `Found ${issues.length} issues, saved ${savings} bytes (${savingsPercent.toFixed(1)}%)`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze CSS",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Code copied to clipboard",
    });
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'destructive';
      case 'warning': return 'secondary';
      case 'info': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            CSS Input
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lint-level">Lint Level</Label>
              <Select value={lintLevel} onValueChange={setLintLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="strict">Strict</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="optimization-level">Optimization Level</Label>
              <Select value={optimizationLevel} onValueChange={setOptimizationLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">Conservative</SelectItem>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="aggressive">Aggressive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="css-input">CSS Code</Label>
            <Textarea
              id="css-input"
              placeholder="Paste your CSS code here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Zap className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Analyze & Optimize
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <Tabs defaultValue="optimized" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="optimized">Optimized CSS</TabsTrigger>
            <TabsTrigger value="issues">Issues ({result.issues.length})</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="optimized" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Optimized CSS
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(result.optimized)}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadFile(result.optimized, 'optimized.css')}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] w-full">
                  <pre className="text-sm font-mono whitespace-pre-wrap">
                    {result.optimized}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="issues" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Lint Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.issues.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-lg font-medium">No issues found!</p>
                    <p className="text-muted-foreground">Your CSS looks good.</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px] w-full">
                    <div className="space-y-3">
                      {result.issues.map((issue, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 border rounded-lg"
                        >
                          {getSeverityIcon(issue.severity)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant={getSeverityColor(issue.severity) as any}>
                                {issue.severity}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                Line {issue.line}, Column {issue.column}
                              </span>
                            </div>
                            <p className="font-medium">{issue.message}</p>
                            <p className="text-sm text-muted-foreground font-mono">
                              {issue.source}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Rule: {issue.rule}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Original Size</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{result.originalSize} bytes</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Optimized Size</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{result.optimizedSize} bytes</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Space Saved</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {result.savings} bytes ({result.savingsPercent.toFixed(1)}%)
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Issue Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {result.issues.filter(i => i.severity === 'error').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Errors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {result.issues.filter(i => i.severity === 'warning').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Warnings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {result.issues.filter(i => i.severity === 'info').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Info</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {result.issues.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Total</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}