import { Metadata } from "next";
import StaticSecretScannerClient from "../../../components/tools/static-secret-scanner-client";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Static Secret Scanner - Security Tool | Multi-Tool Platform",
  description: "Detect accidental secrets in code and files with advanced pattern matching. Scan for API keys, passwords, tokens, and sensitive data with redaction options.",
  keywords: [
    "secret scanner",
    "security scanner",
    "credential detection",
    "API key scanner",
    "password detection",
    "token scanner",
    "security audit",
    "code security",
    "secret detection",
    "vulnerability scanning"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multi-tool-platform.com"),
  alternates: {
    canonical: "/tools/static-secret-scanner",
  },
  openGraph: {
    title: "Static Secret Scanner - Security Tool",
    description: "Detect accidental secrets in code and files with advanced pattern matching and redaction options.",
    url: "/tools/static-secret-scanner",
    siteName: "Multi-Tool Platform",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-static-secret-scanner.png",
        width: 1200,
        height: 630,
        alt: "Static Secret Scanner Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Static Secret Scanner - Security Tool",
    description: "Detect accidental secrets in code and files with advanced pattern matching.",
    images: ["/og-static-secret-scanner.png"],
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
  category: "security tools",
};

export default function StaticSecretScannerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Static Secret Scanner",
    "description": "Advanced security tool for detecting accidental secrets in code and files with pattern matching and redaction capabilities.",
    "url": "https://multi-tool-platform.com/tools/static-secret-scanner",
    "applicationCategory": "SecuritySoftware",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "API key detection",
      "Password pattern matching",
      "Token identification",
      "File upload scanning",
      "Code snippet analysis",
      "Secret redaction",
      "Multiple format support",
      "Security audit reports",
      "False positive filtering",
      "Custom pattern rules"
    ],
    "screenshot": "/og-static-secret-scanner.png",
    "author": {
      "@type": "Organization",
      "name": "Multi-Tool Platform",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Multi-Tool Platform",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
              Static Secret Scanner
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Advanced security tool to detect accidental secrets in code and files. Scan for API keys, passwords, tokens,
              and sensitive data with intelligent pattern matching and redaction capabilities.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                Security Scanning
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                Secret Detection
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Pattern Matching
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Redaction Tools
              </span>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">API Key Detection</h3>
              <p className="text-muted-foreground">
                Identify API keys, access tokens, and authentication credentials across multiple providers and formats.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Password Detection</h3>
              <p className="text-muted-foreground">
                Detect hardcoded passwords, database credentials, and sensitive authentication data in code.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">File Upload Scanning</h3>
              <p className="text-muted-foreground">
                Upload and scan entire files or code repositories for secrets. Support for multiple file formats and sizes.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Secret Redaction</h3>
              <p className="text-muted-foreground">
                Automatically redact detected secrets with customizable replacement patterns and masking options.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Advanced Pattern Matching</h3>
              <p className="text-muted-foreground">
                Intelligent pattern recognition for various secret types including custom patterns and entropy analysis.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Security Reports</h3>
              <p className="text-muted-foreground">
                Generate detailed security reports with findings, severity levels, and remediation recommendations.
              </p>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6">How to Use Static Secret Scanner</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">1. Input Methods</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Paste code snippets directly</li>
                  <li>• Upload files for scanning</li>
                  <li>• Drag and drop multiple files</li>
                  <li>• Scan entire directories</li>
                  <li>• Real-time scanning as you type</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">2. Scanning Options</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Select specific secret types</li>
                  <li>• Adjust sensitivity levels</li>
                  <li>• Enable entropy analysis</li>
                  <li>• Include custom patterns</li>
                  <li>• Filter by file types</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">3. Results & Actions</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• View detected secrets with context</li>
                  <li>• Apply automatic redaction</li>
                  <li>• Generate security reports</li>
                  <li>• Export findings to JSON/CSV</li>
                  <li>• Track remediation progress</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">4. Best Practices</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Scan before committing code</li>
                  <li>• Use environment variables</li>
                  <li>• Implement secret management</li>
                  <li>• Regular security audits</li>
                  <li>• Team training on security</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Static Secret Scanner Component */}
          <StaticSecretScannerClient />

          {/* FAQ Section */}
          <div className="bg-card rounded-lg p-8 border mt-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What types of secrets can be detected?</h3>
                <p className="text-muted-foreground">
                  The scanner detects API keys, passwords, tokens, database credentials, private keys, and other sensitive data patterns across multiple formats and providers.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">How accurate is the detection?</h3>
                <p className="text-muted-foreground">
                  The scanner uses advanced pattern matching and entropy analysis to minimize false positives while maintaining high detection accuracy for real secrets.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I scan entire repositories?</h3>
                <p className="text-muted-foreground">
                  Yes, you can upload multiple files or entire directories. The scanner processes files efficiently and provides comprehensive reports across all scanned content.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">What about false positives?</h3>
                <p className="text-muted-foreground">
                  The scanner includes filtering options and allows you to mark findings as false positives. Custom patterns can also be configured to reduce unwanted detections.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}