import { Metadata } from "next";
import BinaryViewerClient from "@/components/tools/binary-viewer-client";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Binary Viewer & Hex Inspector - File Analysis Tool | Multi-Tool Platform",
  description: "Professional binary file viewer with hex display, byte pattern search, and range export capabilities. Analyze binary files, search byte patterns, and export specific ranges.",
  keywords: [
    "binary viewer",
    "hex inspector",
    "file analysis",
    "byte pattern search",
    "hex editor",
    "binary file viewer",
    "hex dump",
    "file forensics",
    "binary analysis tool",
    "hexadecimal viewer"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multi-tool-platform.com"),
  alternates: {
    canonical: "/tools/binary-viewer",
  },
  openGraph: {
    title: "Binary Viewer & Hex Inspector - File Analysis Tool",
    description: "Professional binary file viewer with hex display, byte pattern search, and range export capabilities.",
    url: "/tools/binary-viewer",
    siteName: "Multi-Tool Platform",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-binary-viewer.png",
        width: 1200,
        height: 630,
        alt: "Binary Viewer Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Binary Viewer & Hex Inspector - File Analysis Tool",
    description: "Professional binary file viewer with hex display, byte pattern search, and range export capabilities.",
    images: ["/og-binary-viewer.png"],
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
  category: "file analysis tools",
};

export default function BinaryViewerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Binary Viewer & Hex Inspector",
    "description": "Professional binary file viewer with hex display, byte pattern search, and range export capabilities for analyzing binary files and data.",
    "url": "https://multi-tool-platform.com/tools/binary-viewer",
    "applicationCategory": "FileAnalysisSoftware",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "Hexadecimal file display",
      "ASCII representation",
      "Byte pattern search",
      "Range export functionality",
      "File size analysis",
      "Offset navigation",
      "Binary file forensics",
      "Data inspection tools",
      "Hex dump generation",
      "File structure analysis"
    ],
    "screenshot": "/og-binary-viewer.png",
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
              Binary Viewer & Hex Inspector
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Professional binary file analysis tool with hexadecimal display, byte pattern search,
              and range export capabilities for comprehensive file inspection.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Hex Display
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Byte Search
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Range Export
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                File Analysis
              </span>
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
              <h3 className="text-lg font-semibold mb-2">Hexadecimal Display</h3>
              <p className="text-muted-foreground">
                View files in hexadecimal format with configurable bytes per line and ASCII representation for comprehensive binary analysis.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Byte Pattern Search</h3>
              <p className="text-muted-foreground">
                Search for specific byte patterns within binary files with case-sensitive options and contextual results display.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Range Export</h3>
              <p className="text-muted-foreground">
                Export specific byte ranges from binary files for further analysis or processing with precise offset control.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">File Statistics</h3>
              <p className="text-muted-foreground">
                Get detailed file statistics including size, entropy analysis, and structural information for forensic analysis.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Fast Navigation</h3>
              <p className="text-muted-foreground">
                Navigate through large binary files efficiently with offset jumping, bookmarking, and quick access to specific regions.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Analysis</h3>
              <p className="text-muted-foreground">
                Analyze binary files securely in your browser without uploading to external servers. All processing happens locally.
              </p>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6">How to Use Binary Viewer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">1. Upload File</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Select any binary file from your device</li>
                  <li>• Supported formats: any binary file type</li>
                  <li>• Maximum file size: 50MB</li>
                  <li>• Files are processed locally in your browser</li>
                  <li>• No data is sent to external servers</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">2. Configure Display</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Set bytes per line (8, 16, 32, 64)</li>
                  <li>• Toggle ASCII representation on/off</li>
                  <li>• Choose offset display format</li>
                  <li>• Enable/disable line numbers</li>
                  <li>• Customize color scheme</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">3. Search & Navigate</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Search for byte patterns (hex or text)</li>
                  <li>• Case-sensitive or case-insensitive search</li>
                  <li>• Jump to specific offsets</li>
                  <li>• Bookmark important locations</li>
                  <li>• Navigate with keyboard shortcuts</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">4. Export & Analyze</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Export selected byte ranges</li>
                  <li>• Generate hex dumps for reports</li>
                  <li>• View file statistics and entropy</li>
                  <li>• Analyze file structure and patterns</li>
                  <li>• Download analysis results</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Binary Viewer Component */}
          <BinaryViewerClient />

          {/* FAQ Section */}
          <div className="bg-card rounded-lg p-8 border mt-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What types of files can I analyze?</h3>
                <p className="text-muted-foreground">
                  You can analyze any binary file including executables, images, documents, archives, and custom binary formats. The tool works with any file that contains binary data.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Is my data secure?</h3>
                <p className="text-muted-foreground">
                  Yes, all file processing happens locally in your browser. Files are never uploaded to external servers. Your data remains private and secure.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">What is a hex dump?</h3>
                <p className="text-muted-foreground">
                  A hex dump displays the binary content of a file in hexadecimal format, making it easier to analyze the raw bytes that make up the file.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I search for specific patterns?</h3>
                <p className="text-muted-foreground">
                  Yes, you can search for byte patterns using hexadecimal notation or text strings. The search is case-sensitive and shows contextual results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}