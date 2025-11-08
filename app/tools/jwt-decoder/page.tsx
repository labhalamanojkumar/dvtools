import { Metadata } from "next";
import { JwtDecoderClient } from "@/components/tools/jwt-decoder-client";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "JWT Decoder - Decode and Verify JSON Web Tokens Online | Multi-Tool Platform",
  description: "Free online JWT decoder and validator. Decode JWT headers and payloads, verify signatures, check token expiration, and inspect claims. Essential tool for API authentication debugging.",
  keywords: [
    "JWT decoder",
    "JWT validator",
    "JSON web token",
    "decode JWT",
    "verify JWT",
    "JWT inspector",
    "token decoder",
    "JWT claims",
    "JWT header",
    "JWT payload",
    "token expiration",
    "API authentication",
    "OAuth tokens",
    "bearer tokens",
    "JWT debugger"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multitoolplatform.com"),
  alternates: {
    canonical: "/tools/jwt-decoder",
  },
  openGraph: {
    title: "JWT Decoder - Decode and Verify JSON Web Tokens Online",
    description: "Free online JWT decoder and validator with signature verification and expiration checking.",
    url: "/tools/jwt-decoder",
    siteName: "Multi Tool Platform",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-jwt-decoder.png",
        width: 1200,
        height: 630,
        alt: "JWT Decoder Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JWT Decoder - Decode and Verify JSON Web Tokens Online",
    description: "Free online JWT decoder and validator with signature verification and expiration checking.",
    images: ["/og-jwt-decoder.png"],
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

export default function JwtDecoderPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "JWT Decoder",
    "description": "Free online JWT decoder and validator for inspecting JSON Web Tokens, verifying signatures, and checking token expiration.",
    "url": "https://multitoolplatform.com/tools/jwt-decoder",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "JWT header decoding",
      "JWT payload inspection",
      "Token expiration checking",
      "Signature verification",
      "Claims validation",
      "JSON formatting",
      "Copy to clipboard",
      "Token debugging",
      "Security analysis",
      "Client-side processing"
    ],
    "screenshot": "/og-jwt-decoder.png",
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
        "name": "JWT Decoder",
        "item": "https://multitoolplatform.com/tools/jwt-decoder"
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
              JWT Decoder
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Professional JWT decoding and validation tool for inspecting JSON Web Tokens, verifying signatures, and debugging authentication issues.
              Essential for API development and security testing.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Token Decoding
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Signature Verification
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Expiration Check
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                Claims Inspection
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
              <h3 className="text-lg font-semibold mb-2">Header Decoding</h3>
              <p className="text-muted-foreground">
                Decode and inspect JWT headers containing algorithm type, token type, and additional metadata.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Payload Inspection</h3>
              <p className="text-muted-foreground">
                Examine JWT payload claims including user information, permissions, and custom data fields.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Expiration Checking</h3>
              <p className="text-muted-foreground">
                Automatically check token expiration dates and warn about expired or soon-to-expire tokens.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Signature Verification</h3>
              <p className="text-muted-foreground">
                Verify JWT signatures using the appropriate algorithm (HS256, RS256, etc.) to ensure token integrity.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Claims Analysis</h3>
              <p className="text-muted-foreground">
                Analyze standard JWT claims (iss, sub, aud, exp, iat) and custom claims for security assessment.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Decoding</h3>
              <p className="text-muted-foreground">
                Decode tokens locally in your browser. JWT contents never leave your device for maximum security.
              </p>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6">How to Use JWT Decoder</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">1. Input JWT Token</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Paste your JWT token in the input field</li>
                  <li>• Token format: header.payload.signature</li>
                  <li>• Supports any valid JWT structure</li>
                  <li>• Base64url encoded components</li>
                  <li>• Click "Decode JWT" to process</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">2. Inspect Components</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• View decoded header information</li>
                  <li>• Examine payload claims and data</li>
                  <li>• Check token expiration status</li>
                  <li>• Verify signature validity</li>
                  <li>• Copy decoded sections to clipboard</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">3. Security Analysis</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Identify token issuer and audience</li>
                  <li>• Check expiration timestamps</li>
                  <li>• Validate signature algorithms</li>
                  <li>• Inspect custom claims</li>
                  <li>• Detect potential security issues</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">4. Debugging Tips</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Use for API authentication debugging</li>
                  <li>• Verify token contents in development</li>
                  <li>• Check OAuth flow tokens</li>
                  <li>• Validate third-party JWTs</li>
                  <li>• Debug authentication failures</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-8 border mb-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Decode Your JWT Tokens?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Start inspecting and validating your JSON Web Tokens now. Decode headers, verify signatures, and check expiration with our comprehensive JWT analysis tool.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Start Decoding JWT
                </button>
                <button className="border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 px-6 py-3 rounded-lg font-medium transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* JWT Decoder Component */}
          <JwtDecoderClient />

          {/* FAQ Section */}
          <div className="bg-card rounded-lg p-8 border mt-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What is a JWT?</h3>
                <p className="text-muted-foreground">
                  JWT (JSON Web Token) is a compact, URL-safe means of representing claims to be transferred between two parties. It's commonly used for authentication and information exchange in web applications.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">How does JWT work?</h3>
                <p className="text-muted-foreground">
                  A JWT consists of three parts: Header (algorithm and token type), Payload (claims/data), and Signature (verification). The token is Base64url encoded and signed for integrity.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Why decode JWT tokens?</h3>
                <p className="text-muted-foreground">
                  Decoding JWTs helps developers inspect token contents, verify claims, check expiration, and debug authentication issues. It's essential for API development and security testing.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Are JWTs secure?</h3>
                <p className="text-muted-foreground">
                  JWTs are secure when properly implemented with strong signatures and HTTPS. However, never store sensitive information in JWT payloads as they are only Base64 encoded, not encrypted.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">What are JWT claims?</h3>
                <p className="text-muted-foreground">
                  JWT claims are statements about an entity (user) and additional metadata. Standard claims include 'iss' (issuer), 'sub' (subject), 'aud' (audience), 'exp' (expiration), and 'iat' (issued at).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
