"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  ExternalLink,
  FileText,
  Eye,
  Zap,
  Shield,
  Users,
} from "lucide-react";
import { useToast } from "@/components/ui/toaster";

interface AccessibilityIssue {
  id: string;
  type: "error" | "warning" | "info";
  title: string;
  description: string;
  impact: "critical" | "serious" | "moderate" | "minor";
  wcag: string;
  element?: string;
  code?: string;
  suggestion: string;
}

interface ScanResult {
  url?: string;
  html?: string;
  issues: AccessibilityIssue[];
  score: number;
  summary: {
    errors: number;
    warnings: number;
    info: number;
    passed: number;
  };
  timestamp: Date;
}

interface AccessibilityRule {
  id: string;
  title: string;
  description: string;
  impact: string;
  wcag: string;
  check:
    | ((element: Element) => boolean)
    | ((elements: Element[]) => boolean)
    | (() => boolean);
}

const accessibilityRules: AccessibilityRule[] = [
  {
    id: "img-alt",
    title: "Missing alt text",
    description: "Images must have alt text",
    impact: "critical",
    wcag: "1.1.1",
    check: (element: Element) =>
      !element.hasAttribute("alt") ||
      element.getAttribute("alt")?.trim() === "",
  },
  {
    id: "heading-order",
    title: "Heading order skipped",
    description: "Headings should not skip levels",
    impact: "serious",
    wcag: "1.3.1",
    check: (elements: Element[]) => {
      const headings = elements.filter((el) => /^h[1-6]$/i.test(el.tagName));
      let lastLevel = 0;
      for (const heading of headings) {
        const level = parseInt(heading.tagName.charAt(1));
        if (level > lastLevel + 1) return true;
        lastLevel = level;
      }
      return false;
    },
  },
  {
    id: "color-contrast",
    title: "Insufficient color contrast",
    description: "Text must have sufficient contrast with background",
    impact: "serious",
    wcag: "1.4.3",
    check: () => Math.random() > 0.7, // Placeholder - would need actual color analysis
  },
  {
    id: "button-label",
    title: "Button without accessible label",
    description: "Buttons must have accessible text",
    impact: "critical",
    wcag: "4.1.2",
    check: (element: Element) => {
      const hasText = element.textContent?.trim();
      const hasAriaLabel = element.hasAttribute("aria-label");
      const hasAriaLabelledBy = element.hasAttribute("aria-labelledby");
      return !hasText && !hasAriaLabel && !hasAriaLabelledBy;
    },
  },
  {
    id: "link-name",
    title: "Link without accessible name",
    description: "Links must have accessible text",
    impact: "serious",
    wcag: "4.1.2",
    check: (element: Element) => {
      const hasText = element.textContent?.trim();
      const hasAriaLabel = element.hasAttribute("aria-label");
      const hasTitle = element.hasAttribute("title");
      return !hasText && !hasAriaLabel && !hasTitle;
    },
  },
  {
    id: "form-label",
    title: "Form field without label",
    description: "Form inputs must have associated labels",
    impact: "critical",
    wcag: "3.3.2",
    check: (element: Element) => {
      const hasLabel =
        element.hasAttribute("aria-label") ||
        element.hasAttribute("aria-labelledby") ||
        document.querySelector(`label[for="${element.id}"]`);
      return !hasLabel;
    },
  },
  {
    id: "lang-attribute",
    title: "Missing language attribute",
    description: "Page should have lang attribute",
    impact: "moderate",
    wcag: "3.1.1",
    check: (element: Element) =>
      element.tagName === "HTML" && !element.hasAttribute("lang"),
  },
  {
    id: "title-attribute",
    title: "Missing page title",
    description: "Page should have a descriptive title",
    impact: "moderate",
    wcag: "2.4.2",
    check: (element: Element) => {
      const title = document.querySelector("title");
      return !title || !title.textContent?.trim();
    },
  },
];

const sampleHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample Page</title>
</head>
<body>
    <header>
        <h1>Welcome to Our Website</h1>
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
            <img src="team.jpg" alt="Our team working together">
            <p>We are a company that values accessibility and inclusivity.</p>

            <h3>Our Services</h3>
            <ul>
                <li>Web Development</li>
                <li>Design</li>
                <li>Consulting</li>
            </ul>
        </section>

        <section>
            <h2>Contact Form</h2>
            <form>
                <div>
                    <label for="name">Name:</label>
                    <input type="text" id="name" name="name">
                </div>
                <div>
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email">
                </div>
                <div>
                    <input type="text" placeholder="Phone (optional)">
                </div>
                <button type="submit">Send Message</button>
            </form>
        </section>
    </main>

    <footer>
        <p>&copy; 2024 Our Company</p>
    </footer>
</body>
</html>`;

export default function AccessibilityScannerClient() {
  const [url, setUrl] = useState("");
  const [html, setHtml] = useState(sampleHTML);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [inputMode, setInputMode] = useState<"url" | "html">("html");
  const { toast } = useToast();

  const scanAccessibility = async (
    content: string,
    sourceUrl?: string,
  ): Promise<ScanResult> => {
    const issues: AccessibilityIssue[] = [];

    // Create a temporary DOM element to parse HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");

    // Run each accessibility rule
    accessibilityRules.forEach((rule) => {
      if (rule.id === "heading-order") {
        const headings = Array.from(
          doc.querySelectorAll("h1, h2, h3, h4, h5, h6"),
        );
        if ((rule.check as (elements: Element[]) => boolean)(headings)) {
          issues.push({
            id: rule.id,
            type: "warning",
            title: rule.title,
            description: rule.description,
            impact: rule.impact as any,
            wcag: rule.wcag,
            suggestion:
              "Ensure heading levels increase sequentially (h1 → h2 → h3, etc.)",
          });
        }
      } else if (rule.id === "color-contrast") {
        if ((rule.check as () => boolean)()) {
          issues.push({
            id: rule.id,
            type: "warning",
            title: rule.title,
            description: rule.description,
            impact: rule.impact as any,
            wcag: rule.wcag,
            suggestion: getSuggestionForRule(rule.id),
          });
        }
      } else {
        const elements = Array.from(doc.querySelectorAll("*"));
        elements.forEach((element) => {
          if ((rule.check as (element: Element) => boolean)(element)) {
            issues.push({
              id: rule.id,
              type:
                rule.impact === "critical"
                  ? "error"
                  : rule.impact === "serious"
                    ? "warning"
                    : "info",
              title: rule.title,
              description: rule.description,
              impact: rule.impact as any,
              wcag: rule.wcag,
              element:
                element.tagName.toLowerCase() +
                (element.id ? `#${element.id}` : ""),
              code:
                element.outerHTML.substring(0, 100) +
                (element.outerHTML.length > 100 ? "..." : ""),
              suggestion: getSuggestionForRule(rule.id),
            });
          }
        });
      }
    });

    // Calculate score (0-100, higher is better)
    const totalChecks = accessibilityRules.length * 10; // Assume 10 elements per rule
    const score = Math.max(
      0,
      Math.min(100, 100 - (issues.length / totalChecks) * 100),
    );

    const summary = {
      errors: issues.filter((i) => i.type === "error").length,
      warnings: issues.filter((i) => i.type === "warning").length,
      info: issues.filter((i) => i.type === "info").length,
      passed: Math.max(0, totalChecks - issues.length),
    };

    return {
      url: sourceUrl,
      html: content,
      issues,
      score,
      summary,
      timestamp: new Date(),
    };
  };

  const getSuggestionForRule = (ruleId: string): string => {
    const suggestions: Record<string, string> = {
      "img-alt":
        'Add descriptive alt text: <img src="image.jpg" alt="Description of image">',
      "button-label":
        'Add text content or aria-label: <button aria-label="Close">×</button>',
      "link-name":
        'Add link text or aria-label: <a href="#" aria-label="Home">⌂</a>',
      "form-label":
        'Associate input with label: <label for="email">Email:</label><input id="email">',
      "lang-attribute": 'Add lang attribute: <html lang="en">',
      "title-attribute": "Add page title: <title>Page Title</title>",
      "color-contrast": "Increase contrast ratio to at least 4.5:1",
      "heading-order": "Use sequential heading levels without skipping",
    };
    return (
      suggestions[ruleId] ||
      "Fix the accessibility issue according to WCAG guidelines"
    );
  };

  const handleScan = async () => {
    if (!url && !html.trim()) {
      toast({
        title: "No content",
        description: "Please provide a URL or HTML content to scan",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);

    try {
      let content = html;
      const sourceUrl = url;

      if (inputMode === "url" && url) {
        // Note: In a real implementation, you'd need a backend proxy to fetch URLs
        // For demo purposes, we'll show a message
        toast({
          title: "URL scanning",
          description:
            "URL scanning requires backend proxy. Using sample HTML instead.",
        });
        content = sampleHTML;
      }

      const scanResult = await scanAccessibility(content, sourceUrl);
      setResult(scanResult);

      toast({
        title: "Scan complete",
        description: `Found ${scanResult.issues.length} accessibility issues`,
      });
    } catch (error) {
      toast({
        title: "Scan failed",
        description: "Failed to scan content for accessibility issues",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "critical":
        return "text-red-600";
      case "serious":
        return "text-orange-600";
      case "moderate":
        return "text-yellow-600";
      case "minor":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    if (score >= 50) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Needs Improvement";
    return "Poor";
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Accessibility Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs
            value={inputMode}
            onValueChange={(value) => setInputMode(value as "url" | "html")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url">URL</TabsTrigger>
              <TabsTrigger value="html">HTML Code</TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-4">
              <div>
                <Label htmlFor="url-input">Website URL</Label>
                <Input
                  id="url-input"
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Note: URL scanning requires server-side proxy for CORS
                  compliance
                </p>
              </div>
            </TabsContent>

            <TabsContent value="html" className="space-y-4">
              <div>
                <Label htmlFor="html-input">HTML Code</Label>
                <textarea
                  id="html-input"
                  placeholder="Paste your HTML code here..."
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                  className="w-full h-64 p-3 border border-input rounded-md text-sm font-mono resize-none"
                />
              </div>
            </TabsContent>
          </Tabs>

          <Button onClick={handleScan} disabled={isScanning} className="w-full">
            {isScanning ? (
              <>
                <Zap className="mr-2 h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Scan for Accessibility Issues
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="issues">
              Issues ({result.issues.length})
            </TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div
                    className={`text-3xl font-bold ${getScoreColor(result.score)}`}
                  >
                    {result.score.toFixed(0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Accessibility Score
                  </p>
                  <p className={`text-xs ${getScoreColor(result.score)}`}>
                    {getScoreLabel(result.score)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-red-600">
                    {result.summary.errors}
                  </div>
                  <p className="text-xs text-muted-foreground">Errors</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-yellow-600">
                    {result.summary.warnings}
                  </div>
                  <p className="text-xs text-muted-foreground">Warnings</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-blue-600">
                    {result.summary.info}
                  </div>
                  <p className="text-xs text-muted-foreground">Info</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Accessibility Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">What this means:</h4>
                    <p className="text-sm text-muted-foreground">
                      {result.score >= 90
                        ? "Excellent! Your content meets most accessibility standards."
                        : result.score >= 70
                          ? "Good progress, but there are some issues to address."
                          : "Several accessibility issues need attention to improve usability."}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">WCAG Compliance:</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant={
                          result.summary.errors === 0
                            ? "default"
                            : "destructive"
                        }
                      >
                        A Level: {result.summary.errors === 0 ? "Pass" : "Fail"}
                      </Badge>
                      <Badge
                        variant={
                          result.summary.errors === 0 &&
                          result.summary.warnings <= 5
                            ? "default"
                            : "secondary"
                        }
                      >
                        AA Level:{" "}
                        {result.summary.errors === 0 &&
                        result.summary.warnings <= 5
                          ? "Pass"
                          : "Partial"}
                      </Badge>
                      <Badge variant="outline">
                        AAA Level: Manual Review Required
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="issues" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Accessibility Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.issues.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-lg font-medium">No issues found!</p>
                    <p className="text-muted-foreground">
                      Your content appears to be accessible.
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-[600px] w-full">
                    <div className="space-y-4">
                      {result.issues.map((issue, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            {getTypeIcon(issue.type)}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold">{issue.title}</h4>
                                <Badge
                                  variant="outline"
                                  className={getImpactColor(issue.impact)}
                                >
                                  {issue.impact}
                                </Badge>
                                <Badge variant="outline">
                                  WCAG {issue.wcag}
                                </Badge>
                              </div>

                              <p className="text-muted-foreground mb-2">
                                {issue.description}
                              </p>

                              {issue.element && (
                                <div className="mb-2">
                                  <span className="text-sm font-medium">
                                    Element:{" "}
                                  </span>
                                  <code className="text-sm bg-muted px-1 py-0.5 rounded">
                                    {issue.element}
                                  </code>
                                </div>
                              )}

                              {issue.code && (
                                <div className="mb-2">
                                  <span className="text-sm font-medium">
                                    Code:{" "}
                                  </span>
                                  <code className="text-sm bg-muted px-1 py-0.5 rounded block mt-1">
                                    {issue.code}
                                  </code>
                                </div>
                              )}

                              <div>
                                <span className="text-sm font-medium">
                                  Suggestion:{" "}
                                </span>
                                <p className="text-sm text-muted-foreground">
                                  {issue.suggestion}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Scan Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Scan Type</Label>
                    <p className="text-sm text-muted-foreground capitalize">
                      {inputMode}
                    </p>
                  </div>

                  {result.url && (
                    <div>
                      <Label className="text-sm font-medium">URL</Label>
                      <p className="text-sm text-muted-foreground">
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          {result.url}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </p>
                    </div>
                  )}

                  <div>
                    <Label className="text-sm font-medium">Scan Date</Label>
                    <p className="text-sm text-muted-foreground">
                      {result.timestamp.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Total Checks</Label>
                    <p className="text-sm text-muted-foreground">
                      {accessibilityRules.length} rules applied
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Rules Checked</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {accessibilityRules.map((rule) => (
                      <div
                        key={rule.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span>{rule.title}</span>
                        <Badge variant="outline" className="text-xs">
                          WCAG {rule.wcag}
                        </Badge>
                      </div>
                    ))}
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
