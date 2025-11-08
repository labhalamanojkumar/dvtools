"use client";

import { useState, useRef, useEffect } from "react";
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
    // Actual per-element contrast checks are performed in scanAccessibility
    // using computeContrastForElement(). Keep this check as a noop placeholder
    // so rule metadata is present but logic lives in the scanner implementation.
    check: () => false,
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
                    <label for="phone">Phone (optional):</label>
                    <input type="text" id="phone" name="phone" placeholder="Phone (optional)">
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [inputMode, setInputMode] = useState<"url" | "html">("html");
  const { toast } = useToast();

  const scanAccessibility = async (
    content: string,
    sourceUrl?: string,
  ): Promise<ScanResult> => {
    const issues: AccessibilityIssue[] = [];

    // Render the provided HTML into a hidden iframe using srcdoc so we can
    // consult getComputedStyle for more accurate color/background values.
    // This is best-effort: external resources may or may not load depending on
    // the environment, but inline styles and <style> blocks will be applied.
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.left = "-9999px";
    iframe.style.top = "-9999px";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.opacity = "0";
    iframe.srcdoc = content;
    document.body.appendChild(iframe);

    // Wait for the iframe to finish loading styles and content (timeout fallback)
    await new Promise<void>((resolve) => {
      let fired = false;
      const onDone = () => {
        if (fired) return;
        fired = true;
        resolve();
      };
      iframe.onload = onDone;
      // Fallback in case onload doesn't fire quickly
      setTimeout(onDone, 1000);
    });

  const doc = iframe.contentDocument ?? document.implementation.createHTMLDocument();
  const win = iframe.contentWindow ?? window;

  // Debug info: length of content
  console.debug("scanAccessibility: content length", content.length);

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
        // Perform color contrast analysis on text-containing elements
        const textElements = Array.from(
          doc.querySelectorAll(
            "p, span, a, li, button, label, h1, h2, h3, h4, h5, h6",
          ),
        );
        textElements.forEach((el) => {
          try {
            const contrast = computeContrastForElement(el as HTMLElement, win);
            if (contrast !== null && contrast < 4.5) {
              issues.push({
                id: rule.id,
                type: "warning",
                title: rule.title,
                description: `${rule.description} (contrast ratio ${contrast.toFixed(2)})`,
                impact: rule.impact as any,
                wcag: rule.wcag,
                element: el.tagName.toLowerCase() + (el.id ? `#${el.id}` : ""),
                code: el.outerHTML.substring(0, 200) + (el.outerHTML.length > 200 ? "..." : ""),
                suggestion: getSuggestionForRule(rule.id),
              });
            }
          } catch (e) {
            // ignore per-element errors
          }
        });
        console.debug("scanAccessibility: textElements", textElements.length);
      } else {
        const elements = Array.from(doc.querySelectorAll("*"));
        elements.forEach((element) => {
          try {
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
          } catch (err) {
            // ignore element-level errors
          }
        });
      }
    });

    // Clean up iframe
    try {
      document.body.removeChild(iframe);
    } catch (e) {
      // ignore
    }

  // Debug: how many issues found
  console.debug("scanAccessibility: issues", issues.length);

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

  // --- Color parsing and contrast helpers ---
  const parseColor = (color: string | null): [number, number, number] | null => {
    if (!color) return null;
    color = color.trim();
    // hex
    const hexMatch = color.match(/^#([0-9a-f]{3,8})$/i);
    if (hexMatch) {
      let hex = hexMatch[1];
      if (hex.length === 3) {
        hex = hex.split("").map((c) => c + c).join("");
      }
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return [r, g, b];
    }
    // rgb(a)
    const rgbMatch = color.match(/rgba?\(([^)]+)\)/i);
    if (rgbMatch) {
      const parts = rgbMatch[1].split(",").map((p) => p.trim());
      const r = parseInt(parts[0], 10);
      const g = parseInt(parts[1], 10);
      const b = parseInt(parts[2], 10);
      if (!isNaN(r) && !isNaN(g) && !isNaN(b)) return [r, g, b];
    }
    return null;
  };

  const luminance = (rgb: [number, number, number]) => {
    const srgb = rgb.map((v) => v / 255).map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
    return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
  };

  const contrastRatio = (rgb1: [number, number, number], rgb2: [number, number, number]) => {
    const l1 = luminance(rgb1);
    const l2 = luminance(rgb2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  };

  // Try to parse arbitrary CSS color strings (including named colors) using
  // a temporary canvas 2D context. This leverages the browser's CSS parser
  // to normalize color strings into a form our parseColor() function understands.
  const parseCssColor = (color: string | null): [number, number, number] | null => {
    if (!color) return null;
    try {
      const cvs = document.createElement("canvas");
      const ctx = cvs.getContext("2d");
      if (!ctx) return null;
      ctx.fillStyle = color;
      // ctx.fillStyle now contains a normalized color string (e.g., "rgb(r,g,b)" or "#rrggbb")
      const normalized = ctx.fillStyle as string;
      return parseColor(normalized);
    } catch (e) {
      return null;
    }
  };

  const computeContrastForElement = (el: HTMLElement, win: Window): number | null => {
    try {
      const cs = win.getComputedStyle(el);
      const fgRaw = cs.color || "";
      let bgRaw = cs.backgroundColor || "";

      // If the element's background is transparent, walk up the ancestor chain
      // inside the iframe/document and use the first non-transparent background.
      let parent: HTMLElement | null = el;
      while (parent && (!bgRaw || bgRaw === "transparent" || bgRaw === "rgba(0, 0, 0, 0)")) {
        parent = parent.parentElement;
        if (!parent) break;
        bgRaw = win.getComputedStyle(parent).backgroundColor || bgRaw;
      }

      if (!bgRaw || bgRaw === "transparent" || bgRaw === "rgba(0, 0, 0, 0)") {
        bgRaw = "rgb(255,255,255)"; // default to white
      }

      const fg = parseCssColor(fgRaw) ?? parseColor(fgRaw);
      const bg = parseCssColor(bgRaw) ?? parseColor(bgRaw);
      if (!fg || !bg) return null;
      return contrastRatio(fg, bg);
    } catch (e) {
      return null;
    }
  };

  // File upload handler and export helpers
  const handleFileUpload = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = String(e.target?.result || "");
      if (file.name.endsWith(".json")) {
        try {
          const parsed = JSON.parse(text);
          if (parsed && parsed.issues) {
            setResult(parsed as ScanResult);
            toast({ title: "Report loaded", description: "Loaded JSON scan report." });
            return;
          }
        } catch (err) {
          toast({ title: "Invalid JSON", description: "Uploaded JSON could not be parsed.", variant: "destructive" });
          return;
        }
      }
      // Otherwise assume HTML
      setHtml(text);
      setResult(null);
      setInputMode("html");
      toast({ title: "File loaded", description: `Loaded ${file.name}` });
    };
    reader.onerror = () => {
      toast({ title: "Read error", description: "Failed to read file", variant: "destructive" });
    };
    reader.readAsText(file);
  };

  const downloadJSON = (r: ScanResult) => {
    const blob = new Blob([JSON.stringify(r, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `accessibility-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCSV = (r: ScanResult) => {
    const header = ["id","type","title","impact","wcag","element","suggestion"].join(",");
    const lines = r.issues.map(i => {
      const safe = (s?: string) => `"${(s||"").replace(/"/g,'""')}"`;
      return [i.id, i.type, safe(i.title), i.impact, i.wcag, safe(i.element), safe(i.suggestion)].join(",");
    });
    const csv = [header, ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `accessibility-report-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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

    // clear previous result so UI reflects current run
    setResult(null);
    setIsScanning(true);

    try {
      let content = html;
      const sourceUrl = url;

      if (inputMode === "url" && url) {
        // Try to fetch the URL directly from the browser. This will succeed for
        // sites that allow CORS. If fetch fails (CORS/network), fall back to
        // sampleHTML and inform the user to use a server-side proxy for full
        // URL scanning.
        try {
          const controller = new AbortController();
          const timeoutId = window.setTimeout(() => controller.abort(), 5000);
          const res = await fetch(url, { signal: controller.signal });
          clearTimeout(timeoutId);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const ctype = res.headers.get("content-type") || "";
          if (ctype.includes("text/html") || ctype.includes("application/xhtml+xml")) {
            content = await res.text();
          } else {
            // Not HTML: fallback
            toast({ title: "URL not HTML", description: "Fetched resource is not HTML. Using sample HTML instead.", variant: "destructive" });
            content = sampleHTML;
          }
        } catch (err: any) {
          console.debug("fetch error for url", url, err?.message || err);
          toast({
            title: "URL fetch failed",
            description:
              "Unable to fetch URL directly (CORS or network). Using sample HTML. For reliable URL scanning enable a server-side proxy.",
            variant: "destructive",
          });
          content = sampleHTML;
        }
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

  // Auto-scan when HTML content changes (debounced). This enables realtime
  // feedback as the user edits the HTML in the textarea.
  const autoScanTimerRef = useRef<number | null>(null);
  useEffect(() => {
    // Only auto-scan in HTML input mode
    if (inputMode !== "html") return;

    // Clear any existing timer
    if (autoScanTimerRef.current) {
      window.clearTimeout(autoScanTimerRef.current);
      autoScanTimerRef.current = null;
    }

    // If there's no HTML, clear results
    if (!html || !html.trim()) {
      setResult(null);
      return;
    }

    // Debounce scan by 700ms
    autoScanTimerRef.current = window.setTimeout(() => {
      // Kick off the scan but don't block the UI
      handleScan();
      autoScanTimerRef.current = null;
    }, 700);

    // Cleanup on unmount or html change
    return () => {
      if (autoScanTimerRef.current) {
        window.clearTimeout(autoScanTimerRef.current);
        autoScanTimerRef.current = null;
      }
    };
  }, [html, inputMode]);

  // Auto-scan when URL changes (debounced) so users get realtime URL scanning
  // when possible (direct fetch will work if the target allows CORS).
  const urlAutoScanRef = useRef<number | null>(null);
  useEffect(() => {
    if (inputMode !== "url") return;

    if (urlAutoScanRef.current) {
      window.clearTimeout(urlAutoScanRef.current);
      urlAutoScanRef.current = null;
    }

    if (!url || !url.trim()) {
      setResult(null);
      return;
    }

    urlAutoScanRef.current = window.setTimeout(() => {
      handleScan();
      urlAutoScanRef.current = null;
    }, 700);

    return () => {
      if (urlAutoScanRef.current) {
        window.clearTimeout(urlAutoScanRef.current);
        urlAutoScanRef.current = null;
      }
    };
  }, [url, inputMode]);

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
                {/* Live preview of the HTML we're scanning. This helps confirm the
                    iframe rendering and computed styles used for contrast checks. */}
                <div className="mt-3">
                  <Label htmlFor="accessibility-preview" className="text-sm font-medium">Live Preview</Label>
                  <iframe
                    id="accessibility-preview"
                    title="accessibility-preview"
                    srcDoc={html}
                    className="w-full h-64 border mt-2"
                  />
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".html,.htm,.json"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files?.[0] ?? null)}
                  />
                  <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    Upload HTML / JSON
                  </Button>
                  <p className="text-sm text-muted-foreground">You can upload an .html/.htm file or a previously exported .json report.</p>
                </div>
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

          <div className="flex gap-2 justify-end">
            <Button size="sm" variant="outline" onClick={() => downloadCSV(result)}>
              Export CSV
            </Button>
            <Button size="sm" variant="outline" onClick={() => downloadJSON(result)}>
              Export JSON
            </Button>
          </div>

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
