import { Metadata } from "next";
import CompressionToolsClient from "@/components/tools/compression-tools-client";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Compression Tools - File Compression & Decompression | Multi-Tool Platform",
  description: "Professional file compression and decompression tool supporting Gzip, Brotli, and Zstd algorithms. Compare compression ratios, optimize file sizes, and manage compressed files with ease.",
  keywords: [
    "file compression",
    "data compression",
    "gzip compression",
    "brotli compression",
    "zstd compression",
    "file decompression",
    "compression ratio",
    "file optimizer",
    "compress files online",
    "decompress files"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multi-tool-platform.com"),
  alternates: {
    canonical: "/tools/compression-tools",
  },
  openGraph: {
    title: "Compression Tools - File Compression & Decompression",
    description: "Professional file compression and decompression tool supporting Gzip, Brotli, and Zstd algorithms.",
    url: "/tools/compression-tools",
    siteName: "Multi-Tool Platform",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-compression-tools.png",
        width: 1200,
        height: 630,
        alt: "Compression Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Compression Tools - File Compression & Decompression",
    description: "Professional file compression and decompression tool supporting Gzip, Brotli, and Zstd algorithms.",
    images: ["/og-compression-tools.png"],
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
  category: "compression tools",
};

export default function CompressionToolsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Compression Tools",
    "description": "Professional file compression and decompression tool with support for Gzip, Brotli, and Zstd algorithms. Optimize file sizes and compare compression ratios.",
    "url": "https://multi-tool-platform.com/tools/compression-tools",
    "applicationCategory": "UtilitySoftware",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "Gzip compression and decompression",
      "Brotli compression and decompression",
      "Zstd compression and decompression",
      "Multiple file compression",
      "Compression ratio comparison",
      "Algorithm performance analysis",
      "File size optimization",
      "Batch file processing",
      "Download compressed files"
    ],
    "screenshot": "/og-compression-tools.png",
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
              Compression Tools
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Professional file compression and decompression tool with support for Gzip, Brotli, and Zstd algorithms.
              Compare compression ratios, optimize file sizes, and manage compressed files efficiently.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Gzip
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Brotli
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Zstd
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                Batch Processing
              </span>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Gzip Compression</h3>
              <p className="text-muted-foreground">
                Industry-standard Gzip algorithm with configurable compression levels (1-9) for optimal balance between speed and size.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Brotli Compression</h3>
              <p className="text-muted-foreground">
                Google's Brotli algorithm offering superior compression ratios (1-11) ideal for web content and text files.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Zstd Compression</h3>
              <p className="text-muted-foreground">
                Facebook's Zstandard algorithm providing exceptional speed (1-22) with excellent compression ratios for all file types.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Algorithm Comparison</h3>
              <p className="text-muted-foreground">
                Compare compression ratios, speeds, and efficiency across all algorithms with detailed performance metrics.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Batch Processing</h3>
              <p className="text-muted-foreground">
                Process multiple files simultaneously with batch compression and decompression operations for efficiency.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
              <p className="text-muted-foreground">
                All compression operations happen locally. Your files never leave your device ensuring complete privacy.
              </p>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6">How to Use Compression Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">1. Upload Files</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Select files to compress or decompress</li>
                  <li>• Supports all file types and formats</li>
                  <li>• Maximum file size: 100MB per file</li>
                  <li>• Drag and drop or click to browse</li>
                  <li>• Multiple file selection supported</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">2. Choose Algorithm & Settings</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Gzip: Fast, universal compatibility</li>
                  <li>• Brotli: Best compression for web content</li>
                  <li>• Zstd: Optimal speed-to-ratio balance</li>
                  <li>• Configure compression levels</li>
                  <li>• Select compression or decompression mode</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">3. Process & Analyze</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Real-time compression progress tracking</li>
                  <li>• View detailed compression statistics</li>
                  <li>• Compare compression ratios across algorithms</li>
                  <li>• Analyze performance metrics and speeds</li>
                  <li>• Preview file size reductions</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">4. Download & Export</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Download individual compressed files</li>
                  <li>• Batch download all processed files</li>
                  <li>• Export compression statistics</li>
                  <li>• Save algorithm comparison reports</li>
                  <li>• Generate optimization recommendations</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Compression Tools Component */}
          <CompressionToolsClient />

          {/* FAQ Section */}
          <div className="bg-card rounded-lg p-8 border mt-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Which compression algorithm should I use?</h3>
                <p className="text-muted-foreground">
                  Choose based on your requirements: Gzip for universal compatibility, Brotli for maximum compression on web content, and Zstd for the best speed-to-compression ratio. Use the comparison feature to test which works best for your specific files.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Is my data secure and private?</h3>
                <p className="text-muted-foreground">
                  Yes, all compression and decompression operations happen locally in your browser. Your files are never uploaded to any server, ensuring complete privacy and security. All data stays on your device.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">What file types are supported?</h3>
                <p className="text-muted-foreground">
                  All file types can be compressed and decompressed including documents, images, videos, archives, code files, and more. Text-based files typically achieve better compression ratios than pre-compressed formats like JPEG or MP4.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I batch process multiple files?</h3>
                <p className="text-muted-foreground">
                  Yes, you can select and process multiple files simultaneously. The tool supports batch compression and decompression, allowing you to handle large numbers of files efficiently with a single operation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}