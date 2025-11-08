import { Metadata } from "next";
import { CodeBeautifierClient } from "@/components/tools/code-beautifier-client";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Code Beautifier - Format HTML, CSS, JavaScript and JSON Online | Multi-Tool Platform",
  description: "Free online code beautifier and formatter with file upload support. Format HTML, CSS, JavaScript, and JSON code with proper indentation, syntax highlighting, and customizable formatting options. Upload files directly for instant beautification.",
  keywords: [
    "code beautifier",
    "code formatter",
    "HTML formatter",
    "CSS formatter",
    "JavaScript formatter",
    "JSON formatter",
    "code indenter",
    "pretty print",
    "syntax highlighting",
    "code cleanup",
    "web formatter",
    "frontend formatter",
    "code minifier reverse",
    "beautify code",
    "format code online"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multitoolplatform.com"),
  alternates: {
    canonical: "/tools/code-beautifier",
  },
  openGraph: {
    title: "Code Beautifier - Format HTML, CSS, JavaScript and JSON Online",
    description: "Free online code beautifier with support for HTML, CSS, JavaScript, and JSON formatting.",
    url: "/tools/code-beautifier",
    siteName: "Multi Tool Platform",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-code-beautifier.png",
        width: 1200,
        height: 630,
        alt: "Code Beautifier Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Code Beautifier - Format HTML, CSS, JavaScript and JSON Online",
    description: "Free online code beautifier with support for HTML, CSS, JavaScript, and JSON formatting.",
    images: ["/og-code-beautifier.png"],
    creator: "@multitoolplatform",
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
  category: "development tools",
};

export default function CodeBeautifierPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Code Beautifier",
    "description": "Free online code beautifier and formatter supporting HTML, CSS, JavaScript, and JSON with customizable indentation and syntax highlighting.",
    "url": "https://multitoolplatform.com/tools/code-beautifier",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "HTML code formatting",
      "CSS code beautification",
      "JavaScript code formatting",
      "JSON pretty printing",
      "File upload support",
      "Drag and drop interface",
      "Customizable indentation",
      "Syntax highlighting",
      "Copy formatted code",
      "Download formatted files",
      "Real-time formatting",
      "Multi-language support"
    ],
    "screenshot": "/og-code-beautifier.png",
    "author": {
      "@type": "Organization",
      "name": "Multi-Tool Platform",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Multi-Tool Platform",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://multitoolplatform.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Tools",
        "item": "https://multitoolplatform.com/tools"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Code Beautifier",
        "item": "https://multitoolplatform.com/tools/code-beautifier"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
              Code Beautifier
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Professional code formatting and beautification tool supporting HTML, CSS, JavaScript, and JSON.
              Upload files directly or paste code to transform minified or messy code into clean, readable, and properly indented code.
            </p>

            {/* Key Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-card rounded-lg p-4 border">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold mb-1">Multi-Language</h3>
                <p className="text-xs text-muted-foreground">HTML, CSS, JS, JSON</p>
              </div>

              <div className="bg-card rounded-lg p-4 border">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold mb-1">File Upload</h3>
                <p className="text-xs text-muted-foreground">Drag & drop files</p>
              </div>

              <div className="bg-card rounded-lg p-4 border">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold mb-1">Instant Format</h3>
                <p className="text-xs text-muted-foreground">Real-time processing</p>
              </div>

              <div className="bg-card rounded-lg p-4 border">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold mb-1">Customizable</h3>
                <p className="text-xs text-muted-foreground">Indentation & style options</p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">HTML Formatting</h3>
              <p className="text-muted-foreground">
                Format HTML code with proper indentation, tag alignment, and attribute organization for better readability.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">File Upload Support</h3>
              <p className="text-muted-foreground">
                Drag and drop code files directly into the tool. Supports JavaScript, HTML, CSS, JSON, and other code files with automatic language detection.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">JavaScript Formatting</h3>
              <p className="text-muted-foreground">
                Format JavaScript code with proper indentation, semicolon placement, and code structure optimization.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0V1m10 3V1m0 3l1 1v16a2 2 0 01-2 2H6a2 2 0 01-2-2V5l1-1z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">JSON Pretty Print</h3>
              <p className="text-muted-foreground">
                Transform minified JSON into human-readable format with proper indentation and key-value alignment.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Customizable Options</h3>
              <p className="text-muted-foreground">
                Adjust indentation size, character preferences, and formatting rules to match your coding standards.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Processing</h3>
              <p className="text-muted-foreground">
                All code formatting happens locally in your browser. Your source code never leaves your device.
              </p>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6">How to Use Code Beautifier</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">1. Select Language</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Choose HTML for markup formatting</li>
                  <li>• Select CSS for stylesheet beautification</li>
                  <li>• Pick JavaScript for script formatting</li>
                  <li>• Choose JSON for data structure formatting</li>
                  <li>• Language detection for mixed content</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">2. Input Your Code</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Paste minified or messy code</li>
                  <li>• Upload code files directly via drag & drop</li>
                  <li>• Supports large code blocks and files up to 10MB</li>
                  <li>• Handles various encodings and file types</li>
                  <li>• Real-time input processing with auto-detection</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">3. Format Code</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Click "Beautify Code" button</li>
                  <li>• Instant formatting results</li>
                  <li>• Syntax highlighting applied</li>
                  <li>• Error detection and reporting</li>
                  <li>• Preview before downloading</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">4. Export Results</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Copy formatted code to clipboard</li>
                  <li>• Download as formatted file</li>
                  <li>• Maintains original file extensions</li>
                  <li>• Ready for production use</li>
                  <li>• Share formatted code easily</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Code Beautifier Component */}
          <CodeBeautifierClient />

          {/* Documentation Section */}
          <div className="mt-16 space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Transform messy, minified code into clean, readable, and professionally formatted code
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📝</span>
                </div>
                <h4 className="font-semibold mb-2">1. Input Code</h4>
                <p className="text-sm text-muted-foreground">
                  Paste your minified or messy code, or upload files containing HTML, CSS, JavaScript, or JSON code that needs formatting.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚙️</span>
                </div>
                <h4 className="font-semibold mb-2">2. Configure & Format</h4>
                <p className="text-sm text-muted-foreground">
                  Select the appropriate language, adjust indentation preferences, and click beautify to transform your code instantly.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📤</span>
                </div>
                <h4 className="font-semibold mb-2">3. Export Results</h4>
                <p className="text-sm text-muted-foreground">
                  Copy the beautifully formatted code to your clipboard or download it as a properly formatted file for immediate use.
                </p>
              </div>
            </div>

            {/* Use Cases */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Common Use Cases</h3>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Web Development</h4>
                  <p className="text-sm text-muted-foreground">
                    Format HTML templates, CSS stylesheets, and JavaScript files for better readability and maintainability in web projects.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">API Development</h4>
                  <p className="text-sm text-muted-foreground">
                    Pretty-print JSON responses and requests for debugging APIs, testing endpoints, and documenting data structures.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Code Review</h4>
                  <p className="text-sm text-muted-foreground">
                    Clean up code before sharing for review, making it easier for team members to understand and provide feedback.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Learning & Teaching</h4>
                  <p className="text-sm text-muted-foreground">
                    Format code examples for tutorials, documentation, and educational content to improve comprehension.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Legacy Code Cleanup</h4>
                  <p className="text-sm text-muted-foreground">
                    Restore readability to old, minified, or poorly formatted code from legacy systems and third-party sources.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Configuration Files</h4>
                  <p className="text-sm text-muted-foreground">
                    Format JSON configuration files, package.json, and other structured data files for better organization and editing.
                  </p>
                </div>
              </div>
            </div>

            {/* Best Practices */}
            <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <div className="text-blue-600 dark:text-blue-400 mt-0.5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    Code Formatting Best Practices
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
                    <div>
                      <strong>Consistent Indentation:</strong> Use 2 or 4 spaces consistently across your project. Avoid mixing tabs and spaces.
                    </div>
                    <div>
                      <strong>Language-Specific Rules:</strong> Follow language conventions - HTML uses 2 spaces, CSS uses 2-4 spaces, JavaScript varies by project.
                    </div>
                    <div>
                      <strong>Team Standards:</strong> Match your team's coding standards and use tools like ESLint or Prettier for consistency.
                    </div>
                    <div>
                      <strong>Minification Strategy:</strong> Keep formatted versions for development and minify only for production deployment.
                    </div>
                    <div>
                      <strong>Version Control:</strong> Format code before committing to avoid unnecessary diffs from formatting changes.
                    </div>
                    <div>
                      <strong>Performance Impact:</strong> Balance readability with performance - minification is crucial for production CSS/JS delivery.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-card rounded-lg p-8 border mt-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What languages does the beautifier support?</h3>
                <p className="text-muted-foreground">
                  The code beautifier supports HTML, CSS, JavaScript, and JSON formatting. Each language has optimized formatting rules for proper syntax and readability.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Does it fix syntax errors?</h3>
                <p className="text-muted-foreground">
                  The beautifier focuses on formatting and indentation. It will highlight syntax issues but doesn't automatically fix logical errors or missing code elements.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I customize the formatting style?</h3>
                <p className="text-muted-foreground">
                  Yes, you can adjust indentation size, character preferences, and other formatting options to match your coding standards and team preferences.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Is my code secure?</h3>
                <p className="text-muted-foreground">
                  Absolutely. All code processing happens locally in your browser. Your source code never gets transmitted to external servers or stored anywhere.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">What file sizes are supported?</h3>
                <p className="text-muted-foreground">
                  The tool can handle large code files, but for optimal performance, files under 1MB are recommended. Very large files may take longer to process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
