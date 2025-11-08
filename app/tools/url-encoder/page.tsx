import { Metadata } from "next";
import { UrlEncoderClient } from "@/components/tools/url-encoder-client";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "URL Encoder/Decoder - Encode and Decode URLs Online | Multi-Tool Platform",
  description: "Free online URL encoder and decoder. Encode and decode URLs, query strings, and special characters for web development. Supports both encodeURIComponent and encodeURI methods.",
  keywords: [
    "URL encoder",
    "URL decoder",
    "encode URL",
    "decode URL",
    "URL encoding",
    "percent encoding",
    "encodeURIComponent",
    "encodeURI",
    "decodeURIComponent",
    "decodeURI",
    "URL escape",
    "URL unescape",
    "query string encoding",
    "web encoding",
    "URI encoding"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multitoolplatform.com"),
  alternates: {
    canonical: "/tools/url-encoder",
  },
  openGraph: {
    title: "URL Encoder/Decoder - Encode and Decode URLs Online",
    description: "Free online URL encoder and decoder with support for encodeURIComponent and encodeURI methods.",
    url: "/tools/url-encoder",
    siteName: "Multi Tool Platform",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-url-encoder.png",
        width: 1200,
        height: 630,
        alt: "URL Encoder/Decoder Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "URL Encoder/Decoder - Encode and Decode URLs Online",
    description: "Free online URL encoder and decoder with support for encodeURIComponent and encodeURI methods.",
    images: ["/og-url-encoder.png"],
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
  category: "web tools",
};

export default function UrlEncoderPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "URL Encoder/Decoder",
    "description": "Free online URL encoder and decoder supporting encodeURIComponent, encodeURI, decodeURIComponent, and decodeURI methods for web development.",
    "url": "https://multitoolplatform.com/tools/url-encoder",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "URL encoding and decoding",
      "encodeURIComponent support",
      "encodeURI support",
      "Query string encoding",
      "Special character handling",
      "Copy to clipboard",
      "Real-time processing",
      "Error handling",
      "Web standards compliance",
      "Client-side security"
    ],
    "screenshot": "/og-url-encoder.png",
    "author": {
      "@type": "Organization",
      "name": "Multi-Tool Platform",
    },
    "publisher": {
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
        "name": "URL Encoder",
        "item": "https://multitoolplatform.com/tools/url-encoder"
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
              URL Encoder / Decoder
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Professional URL encoding and decoding tool supporting both encodeURIComponent and encodeURI methods.
              Essential for web developers working with URLs, query strings, and web APIs.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                encodeURIComponent
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                encodeURI
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Query Strings
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                Web Standards
              </span>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">encodeURIComponent</h3>
              <p className="text-muted-foreground">
                Encode URLs and query parameters safely. Encodes all special characters except URI-safe ones like colons and slashes.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">encodeURI</h3>
              <p className="text-muted-foreground">
                Encode complete URIs while preserving URI structure. Leaves colons, slashes, and other URI components intact.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Query String Encoding</h3>
              <p className="text-muted-foreground">
                Properly encode query parameters and form data. Handles spaces, special characters, and Unicode text.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Bidirectional Conversion</h3>
              <p className="text-muted-foreground">
                Encode and decode URLs with proper error handling. Supports both directions of conversion seamlessly.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Standards Compliant</h3>
              <p className="text-muted-foreground">
                Follows RFC 3986 URI standards and WHATWG URL specifications for proper encoding behavior.
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
                All URL processing happens locally in your browser. Your URLs and data never leave your device.
              </p>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6">How to Use URL Encoder/Decoder</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">1. Choose Encoding Method</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• encodeURIComponent: For query parameters</li>
                  <li>• Encodes all special characters except : / ? # [ ] @</li>
                  <li>• Safe for use in query strings and form data</li>
                  <li>• Use for individual URL components</li>
                  <li>• Most commonly used method</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">2. encodeURI Method</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• encodeURI: For complete URLs</li>
                  <li>• Preserves URI structure and characters</li>
                  <li>• Leaves : / ? # [ ] @ intact</li>
                  <li>• Use for encoding complete URLs</li>
                  <li>• Less aggressive encoding</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">3. Input Your Text</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Paste URL or text to encode/decode</li>
                  <li>• Supports Unicode characters</li>
                  <li>• Handles special characters and symbols</li>
                  <li>• Works with query strings and parameters</li>
                  <li>• Real-time processing</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">4. Process and Use</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Click encode or decode button</li>
                  <li>• Results appear instantly</li>
                  <li>• Copy encoded/decoded text</li>
                  <li>• Use in web applications</li>
                  <li>• Safe for API calls and forms</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-8 border mb-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Encode Your URLs?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Start encoding and decoding URLs safely with support for both encodeURIComponent and encodeURI methods. Perfect for web developers working with APIs and query strings.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Start Encoding URLs
                </button>
                <button className="border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 px-6 py-3 rounded-lg font-medium transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* URL Encoder Component */}
          <UrlEncoderClient />

          {/* FAQ Section */}
          <div className="bg-card rounded-lg p-8 border mt-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What's the difference between encodeURIComponent and encodeURI?</h3>
                <p className="text-muted-foreground">
                  encodeURIComponent encodes all special characters except URI-safe ones, making it safe for query parameters. encodeURI is less aggressive and preserves URI structure characters like colons and slashes.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">When should I use URL encoding?</h3>
                <p className="text-muted-foreground">
                  URL encoding is needed when sending data in URLs, query strings, or form submissions. It ensures special characters don't break URL parsing or cause security issues.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">What characters get encoded?</h3>
                <p className="text-muted-foreground">
                  Characters like spaces, quotes, angle brackets, and non-ASCII characters get percent-encoded (%XX format). Different methods encode different sets of characters.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Is double encoding a problem?</h3>
                <p className="text-muted-foreground">
                  Yes, double encoding can cause issues. Only encode data once before transmission. The receiving end should decode once to get the original data.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Is my data secure?</h3>
                <p className="text-muted-foreground">
                  Yes, all URL processing happens locally in your browser. Your URLs and encoded data never get sent to external servers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
