import { Metadata } from "next";
import { Base64Client } from "@/components/tools/base64-client";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Base64 Encoder/Decoder - Encode and Decode Base64 Online | Multi-Tool Platform",
  description: "Free online Base64 encoder and decoder. Convert text and files to Base64 and back with MIME type detection. Secure, fast, and works offline with support for binary files.",
  keywords: [
    "Base64 encoder",
    "Base64 decoder",
    "Base64 converter",
    "encode Base64",
    "decode Base64",
    "Base64 file encoder",
    "Base64 text converter",
    "MIME type detection",
    "binary to Base64",
    "Base64 to binary",
    "Base64 online tool",
    "Base64 utility",
    "data URL encoder",
    "Base64 string converter"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multitoolplatform.com"),
  alternates: {
    canonical: "/tools/base64",
  },
  openGraph: {
    title: "Base64 Encoder/Decoder - Encode and Decode Base64 Online",
    description: "Free online Base64 encoder and decoder with MIME type detection and file support. Secure and fast.",
    url: "/tools/base64",
    siteName: "Multi Tool Platform",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-base64.png",
        width: 1200,
        height: 630,
        alt: "Base64 Encoder/Decoder Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Base64 Encoder/Decoder - Encode and Decode Base64 Online",
    description: "Free online Base64 encoder and decoder with MIME type detection and file support.",
    images: ["/og-base64.png"],
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
  category: "encoding tools",
};

export default function Base64Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Base64 Encoder/Decoder",
    "description": "Free online Base64 encoder and decoder with MIME type detection, file support, and data URL conversion capabilities.",
    "url": "https://multitoolplatform.com/tools/base64",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "Base64 encoding and decoding",
      "File to Base64 conversion",
      "MIME type detection",
      "Data URL support",
      "Binary file handling",
      "Copy to clipboard",
      "Download encoded files",
      "Real-time processing",
      "Client-side security"
    ],
    "screenshot": "/og-base64.png",
    "author": {
      "@type": "Organization",
      "name": "Multi-Tool Platform",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Multi-Tool Platform",
    },
    "datePublished": new Date().toISOString().split('T')[0],
    "dateModified": new Date().toISOString().split('T')[0],
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
        "name": "Base64 Encoder/Decoder",
        "item": "https://multitoolplatform.com/tools/base64"
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
              Base64 Encoder / Decoder
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Professional Base64 encoding and decoding tool with file support, MIME type detection, and data URL conversion.
              Perfect for developers working with binary data, images, and API communications.
            </p>

            {/* Key Features */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
              <div className="bg-card p-4 rounded-lg border">
                <div className="text-2xl mb-2">🔄</div>
                <h3 className="font-semibold mb-1">Encode/Decode</h3>
                <p className="text-sm text-muted-foreground">
                  Convert text and files to/from Base64 format
                </p>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <div className="text-2xl mb-2">📁</div>
                <h3 className="font-semibold mb-1">File Support</h3>
                <p className="text-sm text-muted-foreground">
                  Upload and encode any file type including images
                </p>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <div className="text-2xl mb-2">🔍</div>
                <h3 className="font-semibold mb-1">MIME Detection</h3>
                <p className="text-sm text-muted-foreground">
                  Automatic MIME type detection for proper encoding
                </p>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <div className="text-2xl mb-2">🔒</div>
                <h3 className="font-semibold mb-1">Secure</h3>
                <p className="text-sm text-muted-foreground">
                  Client-side processing, your data stays private
                </p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0V1m10 3V1m0 3l1 1v16a2 2 0 01-2 2H6a2 2 0 01-2-2V5l1-1z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Text Encoding</h3>
              <p className="text-muted-foreground">
                Encode plain text to Base64 format and decode Base64 strings back to readable text with instant results.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">File Processing</h3>
              <p className="text-muted-foreground">
                Upload files and convert them to Base64 encoded strings. Supports images, documents, and binary files.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">MIME Type Detection</h3>
              <p className="text-muted-foreground">
                Automatically detect and display MIME types for encoded files. Essential for data URL creation and file identification.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Data URL Support</h3>
              <p className="text-muted-foreground">
                Create data URLs with proper MIME types for embedding images and files directly in HTML and CSS.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Copy & Download</h3>
              <p className="text-muted-foreground">
                Copy encoded strings to clipboard or download files. Perfect for integration with other tools and applications.
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
                All encoding and decoding happens locally in your browser. Your files and data never leave your device.
              </p>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6">How to Use Base64 Encoder/Decoder</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">1. Text Encoding/Decoding</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Enter text in the input field</li>
                  <li>• Click "Encode" to convert to Base64</li>
                  <li>• Click "Decode" to convert from Base64</li>
                  <li>• Results appear instantly</li>
                  <li>• Copy results to clipboard</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">2. File Processing</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Click "Upload File" to select a file</li>
                  <li>• Supported: images, documents, binaries</li>
                  <li>• File is encoded to Base64 automatically</li>
                  <li>• MIME type is detected and displayed</li>
                  <li>• Download or copy the encoded result</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">3. Data URLs</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Encode files to create data URLs</li>
                  <li>• Format: data:[MIME-type];base64,[data]</li>
                  <li>• Use in HTML img src attributes</li>
                  <li>• Embed images in CSS backgrounds</li>
                  <li>• Inline small files in web pages</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">4. Advanced Usage</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• API authentication with Basic Auth</li>
                  <li>• Embedding images in HTML/CSS</li>
                  <li>• Binary data transmission</li>
                  <li>• Email attachments encoding</li>
                  <li>• Configuration file encoding</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Base64 Component */}
          <Base64Client />

          {/* Documentation Section */}
          <div className="mt-16 space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Follow these steps to encode and decode Base64 data effectively
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📥</span>
                </div>
                <h4 className="font-semibold mb-2">1. Input Data</h4>
                <p className="text-sm text-muted-foreground">
                  Provide text, files, or binary data to be encoded
                  or Base64 strings to be decoded back to original format.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚙️</span>
                </div>
                <h4 className="font-semibold mb-2">2. Process</h4>
                <p className="text-sm text-muted-foreground">
                  Client-side algorithms convert data using Base64 encoding,
                  detect MIME types, and format data URLs automatically.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📤</span>
                </div>
                <h4 className="font-semibold mb-2">3. Output</h4>
                <p className="text-sm text-muted-foreground">
                  Receive encoded strings, decoded content, or data URLs
                  ready for use in applications, APIs, or web development.
                </p>
              </div>
            </div>

            {/* Use Cases */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Common Use Cases</h3>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">API Authentication</h4>
                  <p className="text-sm text-muted-foreground">
                    Encode credentials for Basic Authentication headers,
                    create JWT tokens, and handle API key encoding for secure communications.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Image Embedding</h4>
                  <p className="text-sm text-muted-foreground">
                    Embed small images directly in HTML and CSS using data URLs,
                    reducing HTTP requests and improving page load performance.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">File Transmission</h4>
                  <p className="text-sm text-muted-foreground">
                    Convert binary files to text format for transmission over text-only protocols
                    like JSON APIs, email attachments, and configuration files.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Data Storage</h4>
                  <p className="text-sm text-muted-foreground">
                    Store binary data in text-based databases, configuration files,
                    and environments that don't support binary data types.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Web Development</h4>
                  <p className="text-sm text-muted-foreground">
                    Inline small assets in HTML/CSS, create favicons, embed fonts,
                    and handle various web development encoding requirements.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Security Testing</h4>
                  <p className="text-sm text-muted-foreground">
                    Test application security by encoding payloads, analyzing encoded data,
                    and understanding how applications handle Base64 encoded content.
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
                    Base64 Encoding Best Practices
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
                    <div>
                      <strong>Size Considerations:</strong> Base64 increases file size by ~33%. Use for small files and consider alternatives for large data.
                    </div>
                    <div>
                      <strong>Security Awareness:</strong> Base64 is encoding, not encryption. Don't rely on it for securing sensitive data.
                    </div>
                    <div>
                      <strong>MIME Types:</strong> Always include proper MIME types in data URLs to ensure correct browser handling.
                    </div>
                    <div>
                      <strong>Validation:</strong> Always validate Base64 strings before decoding to prevent errors and security issues.
                    </div>
                    <div>
                      <strong>Performance:</strong> For large files, consider server-side processing or streaming to avoid browser memory limits.
                    </div>
                    <div>
                      <strong>Standards Compliance:</strong> Use RFC 4648 compliant Base64 encoding for maximum compatibility.
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
                <h3 className="text-lg font-semibold mb-2">What is Base64 encoding?</h3>
                <p className="text-muted-foreground">
                  Base64 is a binary-to-text encoding scheme that converts binary data into a text format using 64 different ASCII characters. It's commonly used to encode binary data for transmission over text-based protocols.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">When should I use Base64?</h3>
                <p className="text-muted-foreground">
                  Base64 is useful for encoding binary data in text-only formats like JSON, XML, or email. Common use cases include embedding images in HTML/CSS, API authentication, and transmitting binary files over text protocols.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">What are data URLs?</h3>
                <p className="text-muted-foreground">
                  Data URLs allow you to embed small files directly into HTML or CSS using Base64 encoding. They're useful for small images, icons, or other assets that you want to include without separate HTTP requests.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Is Base64 encoding secure?</h3>
                <p className="text-muted-foreground">
                  Base64 is an encoding scheme, not encryption. It doesn't provide security - anyone can decode Base64 strings. For security, combine Base64 with proper encryption methods.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Does Base64 increase file size?</h3>
                <p className="text-muted-foreground">
                  Yes, Base64 encoding increases file size by approximately 33%. This is because it converts 3 bytes of binary data into 4 bytes of text. Consider this overhead when choosing Base64 for large files.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
