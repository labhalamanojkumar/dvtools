import { Metadata } from "next";
import { RegexpTesterClient } from "@/components/tools/regexp-tester-client";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Regular Expression Tester - Test and Validate Regex Patterns Online | Multi-Tool Platform",
  description: "Free online regular expression tester and validator. Test regex patterns with real-time matching, supports all flags (g, i, m, s, u, y), and provides detailed match information with capture groups.",
  keywords: [
    "regex tester",
    "regular expression tester",
    "regexp validator",
    "pattern matching",
    "javascript regex",
    "regex flags",
    "regex patterns",
    "regular expressions",
    "regex validator",
    "pattern tester",
    "regex match",
    "regex groups",
    "regex capture",
    "regex online",
    "regex tool"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multitoolplatform.com"),
  alternates: {
    canonical: "/tools/regexp-tester",
  },
  openGraph: {
    title: "Regular Expression Tester - Test and Validate Regex Patterns Online",
    description: "Free online regex tester with real-time matching, flag support, and detailed match information.",
    url: "/tools/regexp-tester",
    siteName: "Multi Tool Platform",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-regexp-tester.png",
        width: 1200,
        height: 630,
        alt: "Regular Expression Tester Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Regular Expression Tester - Test and Validate Regex Patterns Online",
    description: "Free online regex tester with real-time matching, flag support, and detailed match information.",
    images: ["/og-regexp-tester.png"],
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

export default function RegexpTesterPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Regular Expression Tester",
    "description": "Free online regular expression tester and validator with real-time matching, flag support, and detailed match information for JavaScript regex patterns.",
    "url": "https://multitoolplatform.com/tools/regexp-tester",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "Real-time regex testing",
      "All regex flags support (g, i, m, s, u, y)",
      "Match highlighting",
      "Capture group extraction",
      "Pattern validation",
      "Match position tracking",
      "Copy regex patterns",
      "Export match results",
      "JavaScript regex syntax",
      "Client-side processing",
      "File upload support",
      "Drag and drop interface",
      "Multiple file format support"
    ],
    "screenshot": "/og-regexp-tester.png",
    "author": {
      "@type": "Organization",
      "name": "Multi-Tool Platform",
    },
  };

  const breadcrumbLd = {
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
        "name": "Regular Expression Tester",
        "item": "https://multitoolplatform.com/tools/regexp-tester"
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
          __html: JSON.stringify(breadcrumbLd),
        }}
      />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
              Regular Expression Tester
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Professional regex testing and validation tool with real-time matching, comprehensive flag support, and detailed match analysis.
              Perfect for developers working with pattern matching and text processing.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Real-time Testing
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Flag Support
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Match Analysis
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                Capture Groups
              </span>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-time Testing</h3>
              <p className="text-muted-foreground">
                Test regex patterns instantly as you type with live matching and highlighting in the test string.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Flag Support</h3>
              <p className="text-muted-foreground">
                Support for all JavaScript regex flags: global (g), ignore case (i), multiline (m), dotAll (s), unicode (u), and sticky (y).
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Match Highlighting</h3>
              <p className="text-muted-foreground">
                Visual highlighting of all matches in the test string with position indicators and match details.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Capture Groups</h3>
              <p className="text-muted-foreground">
                Extract and display capture group contents with indexing and detailed group information.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Pattern Validation</h3>
              <p className="text-muted-foreground">
                Validate regex syntax with clear error messages and suggestions for fixing invalid patterns.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">File Upload</h3>
              <p className="text-muted-foreground">
                Upload text files directly with drag-and-drop support. Supports files up to 10MB with automatic validation.
              </p>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6">How to Use Regular Expression Tester</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">1. Enter Regex Pattern</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Type your regex pattern in the pattern field</li>
                  <li>• Use JavaScript regex syntax</li>
                  <li>• Pattern validation happens automatically</li>
                  <li>• Error messages guide pattern correction</li>
                  <li>• Supports complex patterns with groups</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">2. Set Flags</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Choose appropriate regex flags</li>
                  <li>• g: Global matching (all matches)</li>
                  <li>• i: Case insensitive matching</li>
                  <li>• m: Multiline mode (^ and $ match line breaks)</li>
                  <li>• s: Dot matches newlines (dotAll)</li>
                  <li>• u: Unicode support</li>
                  <li>• y: Sticky matching from last position</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">3. Test String</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Enter test text in the string field</li>
                  <li>• Upload a text file by dragging & dropping or clicking "Choose File"</li>
                  <li>• Supports various text formats (.txt, .log, .md, .json, .xml, etc.)</li>
                  <li>• Maximum file size: 10MB</li>
                  <li>• Matches highlight automatically</li>
                  <li>• View match positions and content</li>
                  <li>• See capture group extractions</li>
                  <li>• Multiple matches displayed clearly</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">4. Analyze Results</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Review all match details</li>
                  <li>• Check capture group contents</li>
                  <li>• Copy regex patterns for use</li>
                  <li>• Export match results</li>
                  <li>• Debug and refine patterns</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-8 border mb-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Test Your Regular Expressions?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Start testing and validating your regex patterns now. Get real-time matching, flag support, and detailed match analysis with our comprehensive regex tester.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Start Testing Regex
                </button>
                <button className="border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 px-6 py-3 rounded-lg font-medium transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* Regexp Tester Component */}
          <RegexpTesterClient />

          {/* FAQ Section */}
          <div className="bg-card rounded-lg p-8 border mt-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What is a regular expression?</h3>
                <p className="text-muted-foreground">
                  A regular expression (regex) is a sequence of characters that defines a search pattern. It's used for pattern matching within strings and is supported by most programming languages.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">What regex flags are supported?</h3>
                <p className="text-muted-foreground">
                  This tool supports all JavaScript regex flags: g (global), i (case insensitive), m (multiline), s (dotAll), u (unicode), and y (sticky). Each flag modifies how the regex engine processes the pattern.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">What are capture groups?</h3>
                <p className="text-muted-foreground">
                  Capture groups are parts of the regex pattern enclosed in parentheses. They allow you to extract specific portions of the matched text for further processing or reference.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Why is my regex not working?</h3>
                <p className="text-muted-foreground">
                  Common issues include: missing escape characters for special regex symbols, incorrect flag usage, or JavaScript-specific syntax requirements. Use the error messages to guide corrections.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">What file types are supported for upload?</h3>
                <p className="text-muted-foreground">
                  The tool supports various text-based file formats including .txt, .log, .md, .json, .xml, .csv, .html, .css, .js, .ts, .py, .java, .cpp, .c, .php, .rb, .go, .rs, .sh, .yml, .yaml, and other text files up to 10MB in size.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Is my data secure?</h3>
                <p className="text-muted-foreground">
                  Yes, all regex testing happens locally in your browser. Your patterns and test strings never leave your device, ensuring complete privacy and security.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
