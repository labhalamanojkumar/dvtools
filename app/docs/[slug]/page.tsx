import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Code2,
  FileJson,
  Binary,
  Lock,
  Regex,
  Zap,
  CheckCircle,
  AlertTriangle,
  Info,
  ExternalLink,
  Copy,
  Download,
} from "lucide-react";

interface DocPage {
  title: string;
  description: string;
  content: React.ReactNode;
  metadata: {
    title: string;
    description: string;
    keywords: string[];
    lastUpdated?: string;
  };
  relatedPages?: Array<{
    title: string;
    href: string;
    description: string;
  }>;
  toc?: Array<{
    id: string;
    title: string;
    level: number;
  }>;
}

const docPages: Record<string, DocPage> = {
  "getting-started": {
    title: "Getting Started with DvTools",
    description: "Your complete guide to getting started with DvTools. Learn the basics, explore features, and start using our developer tools effectively.",
    metadata: {
      title: "Getting Started | DvTools Documentation",
      description: "Complete guide to getting started with DvTools. Learn the basics and start using our developer tools effectively.",
      keywords: ["getting started", "tutorial", "guide", "basics", "introduction"],
      lastUpdated: "2025-01-15",
    },
    toc: [
      { id: "welcome", title: "Welcome to DvTools", level: 2 },
      { id: "what-is-dvtools", title: "What is DvTools?", level: 2 },
      { id: "first-steps", title: "Your First Steps", level: 2 },
      { id: "exploring-tools", title: "Exploring Our Tools", level: 2 },
      { id: "next-steps", title: "What's Next?", level: 2 },
    ],
    content: (
      <div className="space-y-8">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Welcome! This guide will get you up and running with DvTools in just a few minutes.
          </AlertDescription>
        </Alert>

        <div className="prose prose-lg max-w-none">
          <h2 id="welcome">Welcome to DvTools</h2>
          <p>
            Congratulations on discovering DvTools! You're about to explore a comprehensive suite of
            developer tools designed to streamline your development workflow. Whether you're a seasoned
            developer or just getting started, DvTools has something to offer.
          </p>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-6 rounded-lg my-8">
            <h3 className="text-lg font-semibold mb-2">🎯 What You'll Learn</h3>
            <ul className="space-y-1">
              <li>How to navigate and use our tools</li>
              <li>Essential features for common development tasks</li>
              <li>Best practices for getting the most out of DvTools</li>
              <li>Where to find help when you need it</li>
            </ul>
          </div>

          <h2 id="what-is-dvtools">What is DvTools?</h2>
          <p>
            DvTools is a modern, web-based platform that provides professional-grade developer tools
            right in your browser. No installation required, no setup needed. Just visit our site and
            start using powerful tools for:
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FileJson className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">JSON Processing</h3>
                  <p className="text-sm text-muted-foreground">Format, validate, and minify JSON data</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Binary className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Encoding & Decoding</h3>
                  <p className="text-sm text-muted-foreground">Base64, URL encoding, and more</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Security Tools</h3>
                  <p className="text-sm text-muted-foreground">JWT decoding and validation</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Regex className="h-5 w-5 text-orange-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Regular Expressions</h3>
                  <p className="text-sm text-muted-foreground">Test and debug regex patterns</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Code2 className="h-5 w-5 text-red-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Code Formatting</h3>
                  <p className="text-sm text-muted-foreground">Beautify and format code</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-yellow-600 mt-1" />
                <div>
                  <h3 className="font-semibold">And Much More</h3>
                  <p className="text-sm text-muted-foreground">15+ professional tools available</p>
                </div>
              </div>
            </div>
          </div>

          <h2 id="first-steps">Your First Steps</h2>

          <h3>1. Visit Our Tools Page</h3>
          <p>
            Start by navigating to our <Link href="/tools" className="text-primary hover:underline">Tools page</Link>.
            Here you'll find all available tools organized by category.
          </p>

          <h3>2. Choose Your First Tool</h3>
          <p>
            Let's start with something simple. Try the JSON Formatter:
          </p>
          <ol className="list-decimal list-inside space-y-2 my-4">
            <li>Click on "JSON Formatter" from the tools list</li>
            <li>Copy and paste some JSON data into the input field</li>
            <li>Click "Format JSON" to see the beautified result</li>
            <li>Use the "Copy" button to copy the formatted JSON</li>
          </ol>

          <div className="bg-muted p-4 rounded-lg my-6">
            <h4 className="font-semibold mb-2">Example JSON to try:</h4>
            <pre className="text-sm bg-background p-2 rounded border overflow-x-auto">
              {`{"name":"John","age":30,"city":"New York","hobbies":["reading","coding","gaming"]}`}
            </pre>
          </div>

          <h3>3. Explore More Tools</h3>
          <p>
            Once you're comfortable with the JSON Formatter, explore other tools:
          </p>
          <ul>
            <li><strong>Base64 Encoder:</strong> Encode text to Base64 or decode Base64 back to text</li>
            <li><strong>JWT Decoder:</strong> Paste a JWT token to see its header, payload, and verify signatures</li>
            <li><strong>RegExp Tester:</strong> Test regular expressions against sample text</li>
          </ul>

          <h2 id="exploring-tools">Exploring Our Tools</h2>

          <div className="my-8 space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Essential Tools for Every Developer</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 bg-card">
                  <h4 className="font-semibold mb-2">JSON Formatter</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Format and validate JSON data with syntax highlighting
                  </p>
                  <Link href="/tools#json-formatter" className="text-primary hover:underline text-sm">
                    Try It →
                  </Link>
                </div>
                <div className="border rounded-lg p-4 bg-card">
                  <h4 className="font-semibold mb-2">Base64 Encoder</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Encode and decode Base64 strings
                  </p>
                  <Link href="/tools#base64-encoder" className="text-primary hover:underline text-sm">
                    Try It →
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Advanced Tools for Power Users</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 bg-card">
                  <h4 className="font-semibold mb-2">JWT Decoder</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Decode and verify JWT tokens
                  </p>
                  <Link href="/tools#jwt-decoder" className="text-primary hover:underline text-sm">
                    Try It →
                  </Link>
                </div>
                <div className="border rounded-lg p-4 bg-card">
                  <h4 className="font-semibold mb-2">RegExp Tester</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Test regular expressions with real-time feedback
                  </p>
                  <Link href="/tools#regexp-tester" className="text-primary hover:underline text-sm">
                    Try It →
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Specialized Tools</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 bg-card">
                  <h4 className="font-semibold mb-2">URL Encoder</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Encode and decode URLs safely
                  </p>
                  <Link href="/tools#url-encoder" className="text-primary hover:underline text-sm">
                    Try It →
                  </Link>
                </div>
                <div className="border rounded-lg p-4 bg-card">
                  <h4 className="font-semibold mb-2">Code Beautifier</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Format and beautify code in multiple languages
                  </p>
                  <Link href="/tools#code-beautifier" className="text-primary hover:underline text-sm">
                    Try It →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <h2 id="next-steps">What's Next?</h2>

          <h3>Deepen Your Knowledge</h3>
          <p>
            Now that you know the basics, dive deeper into specific tools:
          </p>
          <ul>
            <li><Link href="/docs/json-tools" className="text-primary hover:underline">JSON Tools Guide</Link> - Master JSON formatting and validation</li>
            <li><Link href="/docs/encoding-tools" className="text-primary hover:underline">Encoding Tools Guide</Link> - Learn about Base64 and URL encoding</li>
            <li><Link href="/docs/jwt-tools" className="text-primary hover:underline">JWT Tools Guide</Link> - Understand JWT tokens and security</li>
          </ul>

          <h3>Get Help When You Need It</h3>
          <p>
            Don't hesitate to reach out if you need assistance:
          </p>
          <ul>
            <li>Check our <Link href="/docs/faq" className="text-primary hover:underline">FAQ</Link> for common questions</li>
            <li>Visit our <Link href="/docs/support" className="text-primary hover:underline">Support page</Link> for additional help</li>
            <li>Report issues on <a href="https://github.com/yourusername/dvtools/issues" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">GitHub</a></li>
          </ul>

          <Alert className="my-8">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>You're all set!</strong> Start exploring DvTools and see how it can improve your development workflow.
              Remember, all our tools work directly in your browser with no installation required.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    ),
    relatedPages: [
      { title: "Quick Start Guide", href: "/docs/quick-start", description: "Step-by-step tutorial" },
      { title: "JSON Tools", href: "/docs/json-tools", description: "Master JSON formatting" },
      { title: "Tools Overview", href: "/tools", description: "Try all our tools" },
    ],
  },

  "introduction": {
    title: "Introduction to DvTools",
    description: "Learn about DvTools, a comprehensive suite of developer tools designed to streamline your development workflow.",
    metadata: {
      title: "Introduction | DvTools Documentation",
      description: "Learn about DvTools, a comprehensive suite of developer tools for JSON formatting, Base64 encoding, JWT decoding, and more.",
      keywords: ["introduction", "overview", "DvTools", "developer tools"],
      lastUpdated: "2025-01-15",
    },
    toc: [
      { id: "what-is-dvtools", title: "What is DvTools?", level: 2 },
      { id: "key-features", title: "Key Features", level: 2 },
      { id: "use-cases", title: "Use Cases", level: 2 },
      { id: "getting-started", title: "Getting Started", level: 2 },
    ],
    content: (
      <div className="space-y-8">
        <div className="prose prose-lg max-w-none">
          <h2 id="what-is-dvtools">What is DvTools?</h2>
          <p>
            DvTools is a comprehensive, production-ready multi-tool web platform built specifically for developers.
            It provides professional-grade tools for JSON formatting, Base64 encoding/decoding, JWT token handling,
            regular expression testing, code beautification, and much more.
          </p>

          <h2 id="key-features">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold">Professional Tools</h3>
                <p className="text-sm text-muted-foreground">Industry-standard tools with advanced features</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold">SEO Optimized</h3>
                <p className="text-sm text-muted-foreground">Server-side rendering and meta optimization</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold">Security First</h3>
                <p className="text-sm text-muted-foreground">Client-side processing, no data tracking</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold">Mobile Friendly</h3>
                <p className="text-sm text-muted-foreground">Responsive design works on all devices</p>
              </div>
            </div>
          </div>

          <h2 id="use-cases">Use Cases</h2>
          <ul>
            <li><strong>API Development:</strong> Format and validate JSON responses</li>
            <li><strong>Security Testing:</strong> Decode and analyze JWT tokens</li>
            <li><strong>Data Processing:</strong> Encode/decode data for transmission</li>
            <li><strong>Code Quality:</strong> Beautify and format code snippets</li>
            <li><strong>Pattern Matching:</strong> Test and debug regular expressions</li>
          </ul>

          <h2 id="getting-started">Getting Started</h2>
          <p>
            Ready to start using DvTools? Head over to our{" "}
            <Link href="/docs/quick-start" className="text-primary hover:underline">
              Quick Start Guide
            </Link>{" "}
            to get up and running in minutes.
          </p>
        </div>
      </div>
    ),
    relatedPages: [
      { title: "Quick Start Guide", href: "/docs/quick-start", description: "Get started in 5 minutes" },
      { title: "Installation", href: "/docs/installation", description: "Complete setup instructions" },
    ],
  },

  "quick-start": {
    title: "Quick Start Guide",
    description: "Get up and running with DvTools in just 5 minutes. Follow this step-by-step guide to start using our developer tools.",
    metadata: {
      title: "Quick Start Guide | DvTools Documentation",
      description: "Get started with DvTools in 5 minutes. Step-by-step guide to using our developer tools effectively.",
      keywords: ["quick start", "getting started", "tutorial", "guide"],
      lastUpdated: "2025-01-15",
    },
    toc: [
      { id: "prerequisites", title: "Prerequisites", level: 2 },
      { id: "first-tool", title: "Using Your First Tool", level: 2 },
      { id: "common-workflows", title: "Common Workflows", level: 2 },
      { id: "next-steps", title: "Next Steps", level: 2 },
    ],
    content: (
      <div className="space-y-8">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            This guide assumes you have a modern web browser. No installation required!
          </AlertDescription>
        </Alert>

        <div className="prose prose-lg max-w-none">
          <h2 id="prerequisites">Prerequisites</h2>
          <ul>
            <li>A modern web browser (Chrome, Firefox, Safari, Edge)</li>
            <li>Internet connection</li>
            <li>Basic understanding of the tool you want to use</li>
          </ul>

          <h2 id="first-tool">Using Your First Tool</h2>
          <ol>
            <li>Navigate to <Link href="/tools" className="text-primary hover:underline">/tools</Link></li>
            <li>Choose a tool from the available options</li>
            <li>Enter your data in the input field</li>
            <li>Click the process button</li>
            <li>View and copy your results</li>
          </ol>

          <div className="bg-muted p-4 rounded-lg my-6">
            <h3 className="font-semibold mb-2">Example: JSON Formatter</h3>
            <ol className="text-sm space-y-1">
              <li>Go to JSON Formatter tool</li>
              <li>Paste your JSON in the input area</li>
              <li>Click "Format JSON"</li>
              <li>Your formatted JSON appears in the output</li>
            </ol>
          </div>

          <h2 id="common-workflows">Common Workflows</h2>

          <h3>API Development</h3>
          <ol>
            <li>Use JSON Formatter to validate API responses</li>
            <li>Decode JWT tokens from authentication headers</li>
            <li>URL encode query parameters</li>
          </ol>

          <h3>Security Testing</h3>
          <ol>
            <li>Decode Base64 encoded data</li>
            <li>Verify JWT token signatures</li>
            <li>Test regular expressions for input validation</li>
          </ol>

          <h2 id="next-steps">Next Steps</h2>
          <p>
            Now that you're familiar with the basics, explore our detailed guides for each tool:
          </p>
          <ul>
            <li><Link href="/docs/json-tools" className="text-primary hover:underline">JSON Tools Guide</Link></li>
            <li><Link href="/docs/encoding-tools" className="text-primary hover:underline">Encoding Tools Guide</Link></li>
            <li><Link href="/docs/jwt-tools" className="text-primary hover:underline">JWT Tools Guide</Link></li>
          </ul>
        </div>
      </div>
    ),
    relatedPages: [
      { title: "JSON Tools", href: "/docs/json-tools", description: "Master JSON formatting and validation" },
      { title: "Installation", href: "/docs/installation", description: "Advanced setup options" },
    ],
  },

  "json-tools": {
    title: "JSON Tools Guide",
    description: "Master JSON formatting, validation, and manipulation with our comprehensive JSON tools suite.",
    metadata: {
      title: "JSON Tools Guide | DvTools Documentation",
      description: "Learn to format, validate, minify, and work with JSON data using DvTools professional JSON tools.",
      keywords: ["JSON", "formatter", "validator", "minifier", "JSON tools"],
      lastUpdated: "2025-01-15",
    },
    toc: [
      { id: "json-formatter", title: "JSON Formatter", level: 2 },
      { id: "json-validator", title: "JSON Validator", level: 2 },
      { id: "json-minifier", title: "JSON Minifier", level: 2 },
      { id: "advanced-features", title: "Advanced Features", level: 2 },
      { id: "best-practices", title: "Best Practices", level: 2 },
    ],
    content: (
      <div className="space-y-8">
        <div className="prose prose-lg max-w-none">
          <h2 id="json-formatter">JSON Formatter</h2>
          <p>
            The JSON Formatter tool helps you beautify and format JSON data with proper indentation,
            syntax highlighting, and error detection.
          </p>

          <h3>Features</h3>
          <ul>
            <li>Syntax highlighting for better readability</li>
            <li>Automatic error detection and reporting</li>
            <li>Tree view for complex JSON structures</li>
            <li>Customizable indentation (2 or 4 spaces)</li>
            <li>One-click copy to clipboard</li>
          </ul>

          <h3>How to Use</h3>
          <ol>
            <li>Paste your JSON in the input field</li>
            <li>Click "Format JSON" or use Ctrl+Enter</li>
            <li>Review the formatted output</li>
            <li>Copy the result or download as file</li>
          </ol>

          <Alert className="my-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Tip:</strong> The formatter automatically detects and highlights syntax errors,
              making it easy to identify and fix JSON issues.
            </AlertDescription>
          </Alert>

          <h2 id="json-validator">JSON Validator</h2>
          <p>
            Validate your JSON against the JSON specification and catch common errors before they cause issues.
          </p>

          <h3>Validation Checks</h3>
          <ul>
            <li>Syntax validation</li>
            <li>Structure validation</li>
            <li>UTF-8 encoding verification</li>
            <li>Duplicate key detection</li>
          </ul>

          <h2 id="json-minifier">JSON Minifier</h2>
          <p>
            Reduce JSON file size by removing unnecessary whitespace and formatting.
          </p>

          <h3>Use Cases</h3>
          <ul>
            <li>Optimize JSON for production</li>
            <li>Reduce bandwidth usage</li>
            <li>Prepare data for storage</li>
          </ul>

          <h2 id="advanced-features">Advanced Features</h2>

          <h3>Schema Validation</h3>
          <p>
            Use JSON Schema to validate complex data structures and ensure data integrity.
          </p>

          <h3>Tree View</h3>
          <p>
            Navigate large JSON objects with our interactive tree view, perfect for exploring APIs.
          </p>

          <h2 id="best-practices">Best Practices</h2>

          <h3>API Development</h3>
          <ul>
            <li>Always validate JSON responses from APIs</li>
            <li>Use consistent indentation in your codebase</li>
            <li>Minify JSON for production deployments</li>
          </ul>

          <h3>Debugging</h3>
          <ul>
            <li>Use the formatter to debug minified JSON</li>
            <li>Check for trailing commas in arrays/objects</li>
            <li>Verify string escaping</li>
          </ul>
        </div>
      </div>
    ),
    relatedPages: [
      { title: "Encoding Tools", href: "/docs/encoding-tools", description: "Base64 and URL encoding" },
      { title: "API Reference", href: "/docs/api-overview", description: "JSON API endpoints" },
    ],
  },

  "encoding-tools": {
    title: "Encoding Tools Guide",
    description: "Learn to encode and decode data with Base64, URL encoding, and other encoding schemes.",
    metadata: {
      title: "Encoding Tools Guide | DvTools Documentation",
      description: "Master Base64 encoding/decoding, URL encoding, and data transformation with DvTools encoding tools.",
      keywords: ["Base64", "encoding", "decoding", "URL encoding", "data transformation"],
      lastUpdated: "2025-01-15",
    },
    toc: [
      { id: "base64-tools", title: "Base64 Tools", level: 2 },
      { id: "url-tools", title: "URL Tools", level: 2 },
      { id: "file-encoding", title: "File Encoding", level: 2 },
      { id: "use-cases", title: "Common Use Cases", level: 2 },
    ],
    content: (
      <div className="space-y-8">
        <div className="prose prose-lg max-w-none">
          <h2 id="base64-tools">Base64 Tools</h2>
          <p>
            Encode and decode Base64 strings with support for text and binary data.
          </p>

          <h3>Features</h3>
          <ul>
            <li>Text and file encoding/decoding</li>
            <li>MIME type detection</li>
            <li>URL-safe Base64 support</li>
            <li>Binary data handling</li>
          </ul>

          <h3>Text Encoding</h3>
          <div className="bg-muted p-4 rounded-lg my-4">
            <p className="font-mono text-sm">
              Input: "Hello World"<br/>
              Base64: "SGVsbG8gV29ybGQ="
            </p>
          </div>

          <h2 id="url-tools">URL Tools</h2>
          <p>
            Encode and decode URLs and query parameters safely.
          </p>

          <h3>URL Encoding</h3>
          <ul>
            <li>Percent encoding for special characters</li>
            <li>Query string parameter handling</li>
            <li>Unicode character support</li>
          </ul>

          <h2 id="file-encoding">File Encoding</h2>
          <p>
            Handle binary files and data streams with proper encoding.
          </p>

          <h3>Supported Formats</h3>
          <ul>
            <li>Images (PNG, JPEG, GIF, WebP)</li>
            <li>Documents (PDF, DOC, XLS)</li>
            <li>Binary data streams</li>
            <li>Custom MIME types</li>
          </ul>

          <h2 id="use-cases">Common Use Cases</h2>

          <h3>Web Development</h3>
          <ul>
            <li>Embedding images in CSS/HTML</li>
            <li>API authentication tokens</li>
            <li>Data URL creation</li>
          </ul>

          <h3>API Development</h3>
          <ul>
            <li>Binary data transmission</li>
            <li>Secure token handling</li>
            <li>File upload/download</li>
          </ul>
        </div>
      </div>
    ),
    relatedPages: [
      { title: "JSON Tools", href: "/docs/json-tools", description: "JSON data handling" },
      { title: "JWT Tools", href: "/docs/jwt-tools", description: "Token encoding/decoding" },
    ],
  },

  "jwt-tools": {
    title: "JWT Tools Guide",
    description: "Decode, validate, and analyze JWT tokens with signature verification and payload inspection.",
    metadata: {
      title: "JWT Tools Guide | DvTools Documentation",
      description: "Learn to decode, validate, and analyze JWT tokens with signature verification using DvTools JWT tools.",
      keywords: ["JWT", "JSON Web Token", "authentication", "security", "token validation"],
      lastUpdated: "2025-01-15",
    },
    toc: [
      { id: "jwt-basics", title: "JWT Basics", level: 2 },
      { id: "decoding-jwt", title: "Decoding JWT Tokens", level: 2 },
      { id: "signature-verification", title: "Signature Verification", level: 2 },
      { id: "security-considerations", title: "Security Considerations", level: 2 },
    ],
    content: (
      <div className="space-y-8">
        <div className="prose prose-lg max-w-none">
          <h2 id="jwt-basics">JWT Basics</h2>
          <p>
            JSON Web Tokens (JWT) are a compact, URL-safe means of representing claims
            between two parties. They consist of three parts: Header, Payload, and Signature.
          </p>

          <h3>JWT Structure</h3>
          <div className="bg-muted p-4 rounded-lg my-4">
            <p className="font-mono text-sm break-all">
              eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Header.Payload.Signature
            </p>
          </div>

          <h2 id="decoding-jwt">Decoding JWT Tokens</h2>
          <p>
            Our JWT decoder automatically parses and displays all three parts of the token.
          </p>

          <h3>Header Information</h3>
          <ul>
            <li>Algorithm used (HS256, RS256, etc.)</li>
            <li>Token type (JWT)</li>
            <li>Key ID (kid) if present</li>
          </ul>

          <h3>Payload Data</h3>
          <ul>
            <li>User claims (sub, name, email)</li>
            <li>Expiration time (exp)</li>
            <li>Issued at time (iat)</li>
            <li>Custom claims</li>
          </ul>

          <h2 id="signature-verification">Signature Verification</h2>
          <p>
            Verify token authenticity using the correct algorithm and secret/key.
          </p>

          <h3>Supported Algorithms</h3>
          <ul>
            <li>HS256 (HMAC SHA-256)</li>
            <li>RS256 (RSA SHA-256)</li>
            <li>ES256 (ECDSA SHA-256)</li>
          </ul>

          <Alert className="my-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Security Note:</strong> Never expose your signing secrets in client-side code.
              Signature verification should be done server-side.
            </AlertDescription>
          </Alert>

          <h2 id="security-considerations">Security Considerations</h2>

          <h3>Token Validation</h3>
          <ul>
            <li>Always verify signatures</li>
            <li>Check expiration times</li>
            <li>Validate issuer and audience claims</li>
            <li>Use HTTPS for token transmission</li>
          </ul>

          <h3>Best Practices</h3>
          <ul>
            <li>Use short-lived tokens</li>
            <li>Implement token refresh</li>
            <li>Store tokens securely</li>
            <li>Validate all claims</li>
          </ul>
        </div>
      </div>
    ),
    relatedPages: [
      { title: "Encoding Tools", href: "/docs/encoding-tools", description: "Base64 encoding for tokens" },
      { title: "API Overview", href: "/docs/api-overview", description: "JWT in API authentication" },
    ],
  },

  "installation": {
    title: "Installation Guide",
    description: "Complete setup instructions for running DvTools locally or deploying to production.",
    metadata: {
      title: "Installation Guide | DvTools Documentation",
      description: "Complete installation and setup guide for DvTools. Learn to run locally or deploy to production.",
      keywords: ["installation", "setup", "deployment", "local development"],
      lastUpdated: "2025-01-15",
    },
    content: (
      <div className="space-y-8">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            For basic usage, no installation is required. Visit our tools directly in your browser.
          </AlertDescription>
        </Alert>

        <div className="prose prose-lg max-w-none">
          <h2>Prerequisites</h2>
          <ul>
            <li>Node.js 18+ and npm 9+</li>
            <li>PostgreSQL database (or SQLite for development)</li>
            <li>Redis server (optional, for caching)</li>
          </ul>

          <h2>Local Development Setup</h2>

          <h3>1. Clone and Install</h3>
          <pre className="bg-muted p-4 rounded-lg">
            <code>{`git clone https://github.com/yourusername/dvtools.git
cd dvtools
npm install`}</code>
          </pre>

          <h3>2. Environment Configuration</h3>
          <pre className="bg-muted p-4 rounded-lg">
            <code>{`cp .env.example .env
# Edit .env with your database credentials`}</code>
          </pre>

          <h3>3. Database Setup</h3>
          <pre className="bg-muted p-4 rounded-lg">
            <code>{`npx prisma generate
npx prisma db push
npm run dev`}</code>
          </pre>

          <h2>Production Deployment</h2>

          <h3>Vercel (Recommended)</h3>
          <ol>
            <li>Push code to GitHub</li>
            <li>Import project in Vercel</li>
            <li>Add environment variables</li>
            <li>Deploy automatically</li>
          </ol>

          <h3>Docker Deployment</h3>
          <pre className="bg-muted p-4 rounded-lg">
            <code>{`docker build -t dvtools .
docker run -p 3000:3000 dvtools`}</code>
          </pre>
        </div>
      </div>
    ),
  },

  "regexp-tools": {
    title: "Regular Expression Tools",
    description: "Test, debug, and optimize regular expressions with our comprehensive RegEx tools.",
    metadata: {
      title: "RegExp Tools | DvTools Documentation",
      description: "Master regular expressions with our testing and debugging tools. Real-time matching and pattern analysis.",
      keywords: ["regex", "regexp", "regular expressions", "pattern matching", "testing"],
      lastUpdated: "2025-01-15",
    },
    content: (
      <div className="space-y-8">
        <div className="prose prose-lg max-w-none">
          <h2>RegExp Tester</h2>
          <p>Test and debug regular expressions with real-time feedback and match highlighting.</p>
          
          <h3>Features</h3>
          <ul>
            <li>Real-time pattern matching</li>
            <li>Match highlighting</li>
            <li>Capture group display</li>
            <li>Flag support (global, multiline, case-insensitive)</li>
          </ul>
        </div>
      </div>
    ),
  },

  "code-tools": {
    title: "Code Formatting Tools",
    description: "Beautify and format code in multiple programming languages.",
    metadata: {
      title: "Code Tools | DvTools Documentation",
      description: "Format and beautify code in JavaScript, Python, HTML, CSS, and more.",
      keywords: ["code formatter", "beautifier", "syntax highlighting", "code tools"],
      lastUpdated: "2025-01-15",
    },
    content: (
      <div className="space-y-8">
        <div className="prose prose-lg max-w-none">
          <h2>Code Beautifier</h2>
          <p>Format and beautify code in multiple programming languages with proper indentation and syntax highlighting.</p>
          
          <h3>Supported Languages</h3>
          <ul>
            <li>JavaScript/TypeScript</li>
            <li>HTML/CSS</li>
            <li>Python</li>
            <li>JSON</li>
          </ul>
        </div>
      </div>
    ),
  },

  "api-overview": {
    title: "API Overview",
    description: "Learn about DvTools API, authentication, and integration.",
    metadata: {
      title: "API Overview | DvTools Documentation",
      description: "Complete guide to integrating DvTools API into your applications.",
      keywords: ["API", "REST API", "authentication", "integration", "endpoints"],
      lastUpdated: "2025-01-15",
    },
    content: (
      <div className="space-y-8">
        <div className="prose prose-lg max-w-none">
          <h2>DvTools API</h2>
          <p>Integrate DvTools functionality into your applications with our RESTful API.</p>
          
          <h3>Authentication</h3>
          <p>All API requests require an API key passed in the Authorization header:</p>
          <pre className="bg-muted p-4 rounded-lg">
            <code>{`Authorization: Bearer YOUR_API_KEY`}</code>
          </pre>

          <h3>Base URL</h3>
          <pre className="bg-muted p-4 rounded-lg">
            <code>{`https://devtoolshub.com/api/v1`}</code>
          </pre>
        </div>
      </div>
    ),
  },

  "api-endpoints": {
    title: "API Endpoints",
    description: "Complete reference of all available API endpoints.",
    metadata: {
      title: "API Endpoints | DvTools Documentation",
      description: "Detailed documentation of all DvTools API endpoints with examples.",
      keywords: ["API endpoints", "REST API", "API reference", "documentation"],
      lastUpdated: "2025-01-15",
    },
    content: (
      <div className="space-y-8">
        <div className="prose prose-lg max-w-none">
          <h2>Available Endpoints</h2>
          
          <h3>JSON Tools</h3>
          <ul>
            <li><code>POST /api/v1/json/format</code> - Format JSON</li>
            <li><code>POST /api/v1/json/validate</code> - Validate JSON</li>
            <li><code>POST /api/v1/json/minify</code> - Minify JSON</li>
          </ul>

          <h3>Encoding Tools</h3>
          <ul>
            <li><code>POST /api/v1/encode/base64</code> - Encode to Base64</li>
            <li><code>POST /api/v1/decode/base64</code> - Decode from Base64</li>
            <li><code>POST /api/v1/encode/url</code> - URL encode</li>
          </ul>
        </div>
      </div>
    ),
  },

  "api-limits": {
    title: "API Rate Limits",
    description: "Understanding API rate limits and quotas.",
    metadata: {
      title: "API Rate Limits | DvTools Documentation",
      description: "Learn about API rate limits, quotas, and best practices.",
      keywords: ["rate limits", "quotas", "API limits", "throttling"],
      lastUpdated: "2025-01-15",
    },
    content: (
      <div className="space-y-8">
        <div className="prose prose-lg max-w-none">
          <h2>Rate Limits</h2>
          
          <h3>Free Tier</h3>
          <ul>
            <li>1,000 requests per day</li>
            <li>10 requests per minute</li>
          </ul>

          <h3>Pro Tier</h3>
          <ul>
            <li>100,000 requests per day</li>
            <li>1,000 requests per minute</li>
          </ul>

          <h3>Enterprise</h3>
          <ul>
            <li>Unlimited requests</li>
            <li>Custom rate limits</li>
          </ul>
        </div>
      </div>
    ),
  },

  "api-sdks": {
    title: "API SDKs",
    description: "Official SDKs and client libraries for DvTools API.",
    metadata: {
      title: "API SDKs | DvTools Documentation",
      description: "Official SDKs for JavaScript, Python, and other languages.",
      keywords: ["SDK", "client library", "npm", "pip", "API client"],
      lastUpdated: "2025-01-15",
    },
    content: (
      <div className="space-y-8">
        <div className="prose prose-lg max-w-none">
          <h2>Official SDKs</h2>
          
          <h3>JavaScript/TypeScript</h3>
          <pre className="bg-muted p-4 rounded-lg">
            <code>{`npm install @dvtools/sdk`}</code>
          </pre>

          <h3>Python</h3>
          <pre className="bg-muted p-4 rounded-lg">
            <code>{`pip install dvtools`}</code>
          </pre>
        </div>
      </div>
    ),
  },

  "faq": {
    title: "Frequently Asked Questions",
    description: "Answers to common questions about DvTools.",
    metadata: {
      title: "FAQ | DvTools Documentation",
      description: "Find answers to frequently asked questions about DvTools.",
      keywords: ["FAQ", "questions", "help", "support"],
      lastUpdated: "2025-01-15",
    },
    content: (
      <div className="space-y-8">
        <div className="prose prose-lg max-w-none">
          <h2>General Questions</h2>
          
          <h3>Is DvTools free to use?</h3>
          <p>Yes! All basic tools are completely free to use with no registration required.</p>

          <h3>Do you store my data?</h3>
          <p>No. All processing happens in your browser. We don't store or track your data.</p>

          <h3>Can I use DvTools offline?</h3>
          <p>Most tools work offline once the page is loaded, thanks to our PWA implementation.</p>

          <h3>Is there an API available?</h3>
          <p>Yes! Check our <Link href="/docs/api-overview" className="text-primary hover:underline">API documentation</Link> for details.</p>

          <h2>Technical Questions</h2>

          <h3>What browsers are supported?</h3>
          <p>We support all modern browsers: Chrome, Firefox, Safari, and Edge (latest 2 versions).</p>

          <h3>Can I contribute to DvTools?</h3>
          <p>Absolutely! Visit our GitHub repository to contribute or report issues.</p>
        </div>
      </div>
    ),
  },

  "troubleshooting": {
    title: "Troubleshooting",
    description: "Common issues and how to resolve them.",
    metadata: {
      title: "Troubleshooting | DvTools Documentation",
      description: "Solutions to common problems and issues with DvTools.",
      keywords: ["troubleshooting", "problems", "issues", "help", "debugging"],
      lastUpdated: "2025-01-15",
    },
    content: (
      <div className="space-y-8">
        <div className="prose prose-lg max-w-none">
          <h2>Common Issues</h2>
          
          <h3>Tool not loading</h3>
          <p><strong>Solution:</strong> Clear your browser cache and refresh the page. Make sure JavaScript is enabled.</p>

          <h3>JSON formatting not working</h3>
          <p><strong>Solution:</strong> Ensure your JSON is valid. Check for missing commas, brackets, or quotes.</p>

          <h3>Base64 decoding fails</h3>
          <p><strong>Solution:</strong> Verify that the input is valid Base64. Look for invalid characters.</p>

          <h3>JWT decoder shows error</h3>
          <p><strong>Solution:</strong> Make sure the token is a valid JWT format (three parts separated by dots).</p>

          <h2>Browser Issues</h2>

          <h3>Features not working in Safari</h3>
          <p><strong>Solution:</strong> Update to the latest Safari version. Some features require modern browser APIs.</p>

          <h3>Copy to clipboard not working</h3>
          <p><strong>Solution:</strong> Grant clipboard permissions in your browser settings.</p>
        </div>
      </div>
    ),
  },

  "changelog": {
    title: "Changelog",
    description: "Latest updates, features, and improvements to DvTools.",
    metadata: {
      title: "Changelog | DvTools Documentation",
      description: "See what's new in DvTools. Latest updates, features, and bug fixes.",
      keywords: ["changelog", "updates", "releases", "new features", "version history"],
      lastUpdated: "2025-01-15",
    },
    content: (
      <div className="space-y-8">
        <div className="prose prose-lg max-w-none">
          <h2>Version 2.0.0 - January 2025</h2>
          <h3>New Features</h3>
          <ul>
            <li>Added A/B Testing Manager</li>
            <li>New Machine Learning tools</li>
            <li>Enhanced JSON formatter with schema validation</li>
            <li>PWA support for offline usage</li>
          </ul>

          <h3>Improvements</h3>
          <ul>
            <li>Faster JSON processing</li>
            <li>Better mobile responsiveness</li>
            <li>Improved dark mode</li>
            <li>Enhanced SEO optimization</li>
          </ul>

          <h3>Bug Fixes</h3>
          <ul>
            <li>Fixed JWT decoder signature verification</li>
            <li>Resolved Base64 encoding issues with large files</li>
            <li>Fixed RegExp tester with Unicode patterns</li>
          </ul>

          <h2>Version 1.5.0 - December 2024</h2>
          <h3>New Features</h3>
          <ul>
            <li>Added URL encoder/decoder</li>
            <li>New code beautifier</li>
            <li>API endpoints for all tools</li>
          </ul>

          <h3>Improvements</h3>
          <ul>
            <li>Better error messages</li>
            <li>Improved performance</li>
            <li>Updated UI components</li>
          </ul>
        </div>
      </div>
    ),
  },

  "support": {
    title: "Support",
    description: "Get help and support for DvTools.",
    metadata: {
      title: "Support | DvTools Documentation",
      description: "Get help with DvTools. Contact support, report issues, and access resources.",
      keywords: ["support", "help", "contact", "assistance", "customer service"],
      lastUpdated: "2025-01-15",
    },
    content: (
      <div className="space-y-8">
        <div className="prose prose-lg max-w-none">
          <h2>Get Support</h2>
          
          <h3>Documentation</h3>
          <p>Start with our comprehensive documentation:</p>
          <ul>
            <li><Link href="/docs/getting-started" className="text-primary hover:underline">Getting Started Guide</Link></li>
            <li><Link href="/docs/faq" className="text-primary hover:underline">FAQ</Link></li>
            <li><Link href="/docs/troubleshooting" className="text-primary hover:underline">Troubleshooting</Link></li>
          </ul>

          <h3>Community Support</h3>
          <p>Join our community for help and discussions:</p>
          <ul>
            <li>GitHub Discussions</li>
            <li>Discord Server</li>
            <li>Stack Overflow (tag: dvtools)</li>
          </ul>

          <h3>Report Issues</h3>
          <p>Found a bug? Report it on our <a href="https://github.com/yourusername/dvtools/issues" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">GitHub Issues</a> page.</p>

          <h3>Contact Us</h3>
          <p>For business inquiries or enterprise support:</p>
          <ul>
            <li>Email: connect@dvtools.in</li>
            <li>Twitter: @dvtools</li>
          </ul>

          <h3>Enterprise Support</h3>
          <p>Need dedicated support? Check out our <Link href="/pricing" className="text-primary hover:underline">Enterprise plans</Link> for:</p>
          <ul>
            <li>24/7 priority support</li>
            <li>Dedicated account manager</li>
            <li>Custom SLA agreements</li>
            <li>On-premise deployment assistance</li>
          </ul>
        </div>
      </div>
    ),
  },

  "tools": {
    title: "Tools Overview",
    description: "Explore all available developer tools in DvTools. From JSON formatting to JWT decoding, find the right tool for your development needs.",
    metadata: {
      title: "Tools Overview | DvTools Documentation",
      description: "Complete overview of all developer tools available in DvTools. Find the perfect tool for your development workflow.",
      keywords: ["tools", "overview", "developer tools", "JSON", "Base64", "JWT", "regex"],
      lastUpdated: "2025-01-15",
    },
    toc: [
      { id: "available-tools", title: "Available Tools", level: 2 },
      { id: "tool-categories", title: "Tool Categories", level: 2 },
      { id: "getting-started", title: "Getting Started with Tools", level: 2 },
      { id: "tool-features", title: "Common Features", level: 2 },
    ],
    content: (
      <div className="space-y-8">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            All tools work directly in your browser with no installation required. Your data never leaves your device.
          </AlertDescription>
        </Alert>

        <div className="prose prose-lg max-w-none">
          <h2 id="available-tools">Available Tools</h2>
          <p>
            DvTools provides a comprehensive suite of professional-grade developer tools,
            all accessible through your web browser. Each tool is designed for maximum usability
            and performance.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
            <div className="border rounded-lg p-6 bg-card hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <FileJson className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold">JSON Tools</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Format, validate, minify, and work with JSON data
              </p>
              <div className="space-y-2">
                <Link href="/tools#json-formatter" className="text-primary hover:underline text-sm block">JSON Formatter</Link>
                <Link href="/tools#json-validator" className="text-primary hover:underline text-sm block">JSON Validator</Link>
                <Link href="/tools#json-minifier" className="text-primary hover:underline text-sm block">JSON Minifier</Link>
              </div>
            </div>

            <div className="border rounded-lg p-6 bg-card hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Binary className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold">Encoding Tools</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Encode and decode data in various formats
              </p>
              <div className="space-y-2">
                <Link href="/tools#base64-encoder" className="text-primary hover:underline text-sm block">Base64 Encoder</Link>
                <Link href="/tools#base64-decoder" className="text-primary hover:underline text-sm block">Base64 Decoder</Link>
                <Link href="/tools#url-encoder" className="text-primary hover:underline text-sm block">URL Encoder</Link>
              </div>
            </div>

            <div className="border rounded-lg p-6 bg-card hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Lock className="h-6 w-6 text-purple-600" />
                <h3 className="text-lg font-semibold">Security Tools</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Work with authentication and security tokens
              </p>
              <div className="space-y-2">
                <Link href="/tools#jwt-decoder" className="text-primary hover:underline text-sm block">JWT Decoder</Link>
                <Link href="/tools#jwt-verifier" className="text-primary hover:underline text-sm block">JWT Verifier</Link>
              </div>
            </div>

            <div className="border rounded-lg p-6 bg-card hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Regex className="h-6 w-6 text-orange-600" />
                <h3 className="text-lg font-semibold">Regular Expressions</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Test and debug regular expression patterns
              </p>
              <div className="space-y-2">
                <Link href="/tools#regexp-tester" className="text-primary hover:underline text-sm block">RegExp Tester</Link>
              </div>
            </div>

            <div className="border rounded-lg p-6 bg-card hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Code2 className="h-6 w-6 text-red-600" />
                <h3 className="text-lg font-semibold">Code Tools</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Format and beautify code in multiple languages
              </p>
              <div className="space-y-2">
                <Link href="/tools#code-beautifier" className="text-primary hover:underline text-sm block">Code Beautifier</Link>
              </div>
            </div>

            <div className="border rounded-lg p-6 bg-card hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="h-6 w-6 text-yellow-600" />
                <h3 className="text-lg font-semibold">Advanced Tools</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Specialized tools for advanced use cases
              </p>
              <div className="space-y-2">
                <Link href="/tools#ab-test-manager" className="text-primary hover:underline text-sm block">A/B Test Manager</Link>
                <Link href="/tools#ml-tools" className="text-primary hover:underline text-sm block">ML Tools</Link>
              </div>
            </div>
          </div>

          <h2 id="tool-categories">Tool Categories</h2>

          <h3>Data Processing Tools</h3>
          <p>
            Tools for working with structured data, including JSON, XML, and other formats.
            These tools help you validate, format, and transform data for development and debugging.
          </p>

          <h3>Encoding & Security Tools</h3>
          <p>
            Handle data encoding, decoding, and security-related tasks. Perfect for API development,
            authentication, and data transmission.
          </p>

          <h3>Development Utilities</h3>
          <p>
            Everyday tools that make development faster and more efficient, from code formatting
            to regular expression testing.
          </p>

          <h2 id="getting-started">Getting Started with Tools</h2>

          <h3>Accessing Tools</h3>
          <ol>
            <li>Navigate to the <Link href="/tools" className="text-primary hover:underline">Tools page</Link></li>
            <li>Browse available tools by category</li>
            <li>Click on any tool to start using it</li>
            <li>All tools work instantly in your browser</li>
          </ol>

          <h3>Your First Tool</h3>
          <p>
            If you're new to DvTools, we recommend starting with the JSON Formatter:
          </p>
          <div className="bg-muted p-4 rounded-lg my-4">
            <ol className="text-sm space-y-1">
              <li>Go to JSON Formatter tool</li>
              <li>Paste any JSON data (or use our sample)</li>
              <li>Click "Format JSON"</li>
              <li>See your beautifully formatted JSON</li>
              <li>Use "Copy" to copy the result</li>
            </ol>
          </div>

          <h2 id="tool-features">Common Features</h2>

          <h3>Universal Features</h3>
          <ul>
            <li><strong>Real-time Processing:</strong> Instant results as you type</li>
            <li><strong>Copy to Clipboard:</strong> One-click copying of results</li>
            <li><strong>Download Support:</strong> Save results as files</li>
            <li><strong>Responsive Design:</strong> Works on all devices</li>
            <li><strong>Dark Mode:</strong> Automatic theme switching</li>
            <li><strong>No Data Storage:</strong> Your data stays on your device</li>
          </ul>

          <h3>Advanced Features</h3>
          <ul>
            <li><strong>Syntax Highlighting:</strong> Color-coded output for better readability</li>
            <li><strong>Error Detection:</strong> Clear error messages and suggestions</li>
            <li><strong>Batch Processing:</strong> Handle multiple inputs at once</li>
            <li><strong>API Integration:</strong> Use tools programmatically</li>
          </ul>

          <Alert className="my-8">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Pro Tip:</strong> All tools include comprehensive help documentation.
              Look for the "?" icon in each tool for detailed usage instructions.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    ),
    relatedPages: [
      { title: "Getting Started", href: "/docs/getting-started", description: "Learn the basics" },
      { title: "JSON Tools", href: "/docs/json-tools", description: "Master JSON processing" },
      { title: "API Overview", href: "/docs/api-overview", description: "Use tools programmatically" },
    ],
  },

  "api": {
    title: "API Documentation",
    description: "Complete API reference for DvTools. Learn how to integrate our tools into your applications programmatically.",
    metadata: {
      title: "API Documentation | DvTools",
      description: "Complete API reference for integrating DvTools into your applications. RESTful endpoints, authentication, and examples.",
      keywords: ["API", "REST API", "integration", "endpoints", "authentication", "documentation"],
      lastUpdated: "2025-01-15",
    },
    toc: [
      { id: "api-overview", title: "API Overview", level: 2 },
      { id: "authentication", title: "Authentication", level: 2 },
      { id: "base-url", title: "Base URL", level: 2 },
      { id: "rate-limits", title: "Rate Limits", level: 2 },
      { id: "endpoints", title: "API Endpoints", level: 2 },
      { id: "sdks", title: "SDKs & Libraries", level: 2 },
    ],
    content: (
      <div className="space-y-8">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Our API allows you to integrate DvTools functionality into your applications programmatically.
          </AlertDescription>
        </Alert>

        <div className="prose prose-lg max-w-none">
          <h2 id="api-overview">API Overview</h2>
          <p>
            The DvTools API provides programmatic access to all our developer tools through
            RESTful endpoints. Process data, validate formats, and integrate powerful tools
            directly into your applications.
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">RESTful Design</h3>
                  <p className="text-sm text-muted-foreground">Standard HTTP methods and JSON responses</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Comprehensive Coverage</h3>
                  <p className="text-sm text-muted-foreground">All tools available via API</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">High Performance</h3>
                  <p className="text-sm text-muted-foreground">Optimized for speed and reliability</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Security First</h3>
                  <p className="text-sm text-muted-foreground">HTTPS only, secure authentication</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">SDK Support</h3>
                  <p className="text-sm text-muted-foreground">Official libraries for popular languages</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Developer Friendly</h3>
                  <p className="text-sm text-muted-foreground">Clear documentation and examples</p>
                </div>
              </div>
            </div>
          </div>

          <h2 id="authentication">Authentication</h2>
          <p>
            All API requests require authentication using an API key. Include your API key
            in the Authorization header of all requests.
          </p>

          <h3>Getting an API Key</h3>
          <ol>
            <li>Sign up for a DvTools account</li>
            <li>Navigate to your account settings</li>
            <li>Generate an API key</li>
            <li>Use the key in all API requests</li>
          </ol>

          <h3>Using Your API Key</h3>
          <p>Include the API key in the Authorization header:</p>
          <pre className="bg-muted p-4 rounded-lg">
            <code>{`Authorization: Bearer YOUR_API_KEY_HERE`}</code>
          </pre>

          <Alert className="my-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Security Note:</strong> Keep your API key secure and never expose it in client-side code.
              Rotate keys regularly and revoke compromised keys immediately.
            </AlertDescription>
          </Alert>

          <h2 id="base-url">Base URL</h2>
          <p>All API endpoints use the following base URL:</p>
          <pre className="bg-muted p-4 rounded-lg">
            <code>{`https://api.dvtools.dev/v1`}</code>
          </pre>

          <h2 id="rate-limits">Rate Limits</h2>

          <h3>Free Tier</h3>
          <ul>
            <li>1,000 requests per day</li>
            <li>10 requests per minute</li>
            <li>Basic support</li>
          </ul>

          <h3>Pro Tier</h3>
          <ul>
            <li>100,000 requests per day</li>
            <li>1,000 requests per minute</li>
            <li>Priority support</li>
            <li>Higher limits available</li>
          </ul>

          <h3>Enterprise Tier</h3>
          <ul>
            <li>Unlimited requests</li>
            <li>Custom rate limits</li>
            <li>Dedicated support</li>
            <li>SLA guarantees</li>
          </ul>

          <h3>Rate Limit Headers</h3>
          <p>The API returns rate limit information in response headers:</p>
          <pre className="bg-muted p-4 rounded-lg">
            <code>{`X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200`}</code>
          </pre>

          <h2 id="endpoints">API Endpoints</h2>

          <h3>JSON Tools</h3>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Format JSON</h4>
              <pre className="text-sm bg-background p-2 rounded border mb-2">
                <code>{`POST /json/format`}</code>
              </pre>
              <p className="text-sm text-muted-foreground">Format and beautify JSON data</p>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Validate JSON</h4>
              <pre className="text-sm bg-background p-2 rounded border mb-2">
                <code>{`POST /json/validate`}</code>
              </pre>
              <p className="text-sm text-muted-foreground">Validate JSON syntax and structure</p>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Minify JSON</h4>
              <pre className="text-sm bg-background p-2 rounded border mb-2">
                <code>{`POST /json/minify`}</code>
              </pre>
              <p className="text-sm text-muted-foreground">Remove whitespace and compress JSON</p>
            </div>
          </div>

          <h3>Encoding Tools</h3>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Base64 Encode</h4>
              <pre className="text-sm bg-background p-2 rounded border mb-2">
                <code>{`POST /encode/base64`}</code>
              </pre>
              <p className="text-sm text-muted-foreground">Encode data to Base64 format</p>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Base64 Decode</h4>
              <pre className="text-sm bg-background p-2 rounded border mb-2">
                <code>{`POST /decode/base64`}</code>
              </pre>
              <p className="text-sm text-muted-foreground">Decode Base64 data back to original format</p>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">URL Encode</h4>
              <pre className="text-sm bg-background p-2 rounded border mb-2">
                <code>{`POST /encode/url`}</code>
              </pre>
              <p className="text-sm text-muted-foreground">Encode URLs and query parameters</p>
            </div>
          </div>

          <h3>Security Tools</h3>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">JWT Decode</h4>
              <pre className="text-sm bg-background p-2 rounded border mb-2">
                <code>{`POST /jwt/decode`}</code>
              </pre>
              <p className="text-sm text-muted-foreground">Decode and inspect JWT tokens</p>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">JWT Verify</h4>
              <pre className="text-sm bg-background p-2 rounded border mb-2">
                <code>{`POST /jwt/verify`}</code>
              </pre>
              <p className="text-sm text-muted-foreground">Verify JWT signatures and claims</p>
            </div>
          </div>

          <h3>Other Tools</h3>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">RegExp Test</h4>
              <pre className="text-sm bg-background p-2 rounded border mb-2">
                <code>{`POST /regexp/test`}</code>
              </pre>
              <p className="text-sm text-muted-foreground">Test regular expressions against text</p>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Code Beautify</h4>
              <pre className="text-sm bg-background p-2 rounded border mb-2">
                <code>{`POST /code/beautify`}</code>
              </pre>
              <p className="text-sm text-muted-foreground">Format and beautify code</p>
            </div>
          </div>

          <h3>Example API Request</h3>
          <p>Here's how to format JSON using our API:</p>
          <pre className="bg-muted p-4 rounded-lg">
            <code>{`curl -X POST https://api.dvtools.dev/v1/json/format \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"John","age":30,"city":"New York"}'`}</code>
          </pre>

          <h3>Example API Response</h3>
          <pre className="bg-muted p-4 rounded-lg">
            <code>{`{
  "success": true,
  "data": {
    "name": "John",
    "age": 30,
    "city": "New York"
  },
  "processingTime": 12
}`}</code>
          </pre>

          <h2 id="sdks">SDKs & Libraries</h2>

          <h3>Official SDKs</h3>
          <p>We provide official SDKs for popular programming languages:</p>

          <div className="grid md:grid-cols-2 gap-4 my-6">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">JavaScript/TypeScript</h4>
              <pre className="text-sm bg-background p-2 rounded border mb-2">
                <code>{`npm install @dvtools/sdk`}</code>
              </pre>
              <Link href="/docs/api-sdks#javascript" className="text-primary hover:underline text-sm">
                View Documentation →
              </Link>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Python</h4>
              <pre className="text-sm bg-background p-2 rounded border mb-2">
                <code>{`pip install dvtools`}</code>
              </pre>
              <Link href="/docs/api-sdks#python" className="text-primary hover:underline text-sm">
                View Documentation →
              </Link>
            </div>
          </div>

          <h3>Community SDKs</h3>
          <p>Community-maintained libraries are available for additional languages:</p>
          <ul>
            <li>Go: <code>go get github.com/dvtools/go-sdk</code></li>
            <li>Ruby: <code>gem install dvtools</code></li>
            <li>PHP: <code>composer require dvtools/sdk</code></li>
            <li>Java: Available on Maven Central</li>
          </ul>

          <Alert className="my-8">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Need Help?</strong> Check our <Link href="/docs/api-endpoints" className="text-primary hover:underline">detailed API reference</Link> for complete documentation,
              or visit our <Link href="/docs/support" className="text-primary hover:underline">support page</Link> for assistance.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    ),
    relatedPages: [
      { title: "API Endpoints", href: "/docs/api-endpoints", description: "Complete endpoint reference" },
      { title: "API SDKs", href: "/docs/api-sdks", description: "Official libraries" },
      { title: "Rate Limits", href: "/docs/api-limits", description: "Usage limits and quotas" },
    ],
  },
};

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = docPages[params.slug];

  if (!page) {
    return {
      title: "Page Not Found | DvTools Documentation",
    };
  }

  return {
    title: page.metadata.title,
    description: page.metadata.description,
    keywords: page.metadata.keywords,
    openGraph: {
      title: page.metadata.title,
      description: page.metadata.description,
      type: "article",
      url: `/docs/${params.slug}`,
      siteName: "DvTools",
      images: [
        {
          url: "/docs-og.jpg",
          width: 1200,
          height: 630,
          alt: `DvTools Documentation - ${page.title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.metadata.title,
      description: page.metadata.description,
      images: ["/docs-og.jpg"],
    },
    alternates: {
      canonical: `/docs/${params.slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    other: {
      "article:author": "DvTools Team",
      "article:published_time": page.metadata.lastUpdated || new Date().toISOString(),
      "article:section": "Documentation",
    },
  };
}

export default function DocPage({ params }: PageProps) {
  const page = docPages[params.slug];

  if (!page) {
    console.error(`Page not found for slug: ${params.slug}`);
    console.log('Available slugs:', Object.keys(docPages));
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/docs" className="hover:text-primary">
              Docs
            </Link>
          </li>
          <li>/</li>
          <li className="text-foreground font-medium">{page.title}</li>
        </ol>
      </nav>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline: page.title,
            description: page.description,
            url: `https://devtoolshub.com/docs/${params.slug}`,
            datePublished: page.metadata.lastUpdated || new Date().toISOString(),
            dateModified: page.metadata.lastUpdated || new Date().toISOString(),
            author: {
              "@type": "Organization",
              name: "DvTools Team",
            },
            publisher: {
              "@type": "Organization",
              name: "DvTools",
              logo: {
                "@type": "ImageObject",
                url: "https://devtoolshub.com/logo.png",
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://devtoolshub.com/docs/${params.slug}`,
            },
            articleSection: "Documentation",
            keywords: page.metadata.keywords?.join(", ") || "",
          }),
        }}
      />

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <header className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              {page.title}
            </h1>
            <p className="text-xl text-muted-foreground">
              {page.description}
            </p>
            {page.metadata.lastUpdated && (
              <p className="text-sm text-muted-foreground mt-2">
                Last updated: {new Date(page.metadata.lastUpdated).toLocaleDateString()}
              </p>
            )}
          </header>

          {/* Table of Contents */}
          {page.toc && page.toc.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg">Table of Contents</CardTitle>
              </CardHeader>
              <CardContent>
                <nav>
                  <ul className="space-y-2">
                    {page.toc.map((item) => (
                      <li
                        key={item.id}
                        className={`${item.level === 3 ? "ml-4" : ""}`}
                      >
                        <a
                          href={`#${item.id}`}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </CardContent>
            </Card>
          )}

          {/* Page Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            {page.content}
          </div>

          {/* Related Pages */}
          {page.relatedPages && page.relatedPages.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Related Documentation</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {page.relatedPages.map((relatedPage) => (
                  <Card key={relatedPage.href} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <Link href={relatedPage.href}>
                        <h3 className="font-semibold mb-2 hover:text-primary transition-colors">
                          {relatedPage.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {relatedPage.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Navigation */}
          <nav className="flex items-center justify-between mt-12 pt-8 border-t">
            <Button variant="outline" asChild>
              <Link href="/docs">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Docs
              </Link>
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Copy className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                PDF
              </Button>
            </div>
          </nav>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" asChild>
                  <Link href="/tools">
                    Try Tools
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/docs">
                    All Documentation
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* On This Page */}
            {page.toc && page.toc.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">On This Page</CardTitle>
                </CardHeader>
                <CardContent>
                  <nav>
                    <ul className="space-y-2">
                      {page.toc.map((item) => (
                        <li
                          key={item.id}
                          className={`${item.level === 3 ? "ml-4" : ""}`}
                        >
                          <a
                            href={`#${item.id}`}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors block py-1"
                          >
                            {item.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </CardContent>
              </Card>
            )}

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/docs/faq">
                    FAQ
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/docs/support">
                    Support
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="https://github.com/yourusername/dvtools/issues" target="_blank">
                    GitHub Issues
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate static params for all doc pages
export async function generateStaticParams() {
  return Object.keys(docPages).map((slug) => ({
    slug,
  }));
}

// Allow dynamic params for pages not in generateStaticParams
export const dynamicParams = true;