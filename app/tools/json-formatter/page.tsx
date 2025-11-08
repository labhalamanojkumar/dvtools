import { Metadata } from "next";
import { ReactNode } from "react";
import dynamic from 'next/dynamic';
import { SHARED_METADATA } from '@/lib/utils';
import { AdPlacement } from '@/components/ads/ad-placement';

// Dynamically import the client component to avoid hydration issues
const JsonFormatterClient = dynamic(() => import('@/components/tools/json-formatter-client').then(mod => ({ default: mod.JsonFormatterClient })), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center p-8">Loading JSON Formatter...</div>
});

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  color: string;
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    red: "bg-red-500",
    indigo: "bg-indigo-500",
    pink: "bg-pink-500",
  };
  const colorClass = colorMap[color] ?? "bg-blue-500";
  return (
    <div className="bg-card rounded-lg p-6 border">
      <div className={`w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

export const metadata: Metadata = {
  title: "JSON Formatter & Validator - Format, Validate and Beautify JSON Online | Multi-Tool Platform",
  description: "Free online JSON formatter, validator, and beautifier. Pretty-print JSON, validate syntax, minify JSON, and validate against JSON Schema. Fast, secure, and works offline.",
  keywords: [
    "JSON formatter",
    "JSON validator",
    "JSON beautifier",
    "JSON minifier",
    "JSON schema validator",
    "validate JSON online",
    "format JSON",
    "beautify JSON",
    "JSON syntax checker",
    "JSON parser",
    "JSON lint",
    "JSON pretty print",
    "JSON compressor",
    "JSON validation",
    "JSON Schema validation"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multi-tool-platform.com"),
  alternates: {
    canonical: "/tools/json-formatter",
  },
  openGraph: {
    title: "JSON Formatter & Validator - Format and Validate JSON Online",
    description: "Free online JSON formatter, validator, and beautifier with schema validation and syntax highlighting. Fast and secure.",
    url: "/tools/json-formatter",
    siteName: "Multi Tool Platform",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-json-formatter.png",
        width: 1200,
        height: 630,
        alt: "JSON Formatter Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Formatter & Validator - Format and Validate JSON Online",
    description: "Free online JSON formatter, validator, and beautifier with schema validation.",
    images: ["/og-json-formatter.png"],
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
  category: "data tools",
};

export default function JsonFormatterPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "JSON Formatter & Validator",
    "description": "Free online JSON formatter, validator, and beautifier with schema validation, syntax highlighting, and error detection.",
    "url": "https://multi-tool-platform.com/tools/json-formatter",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "JSON formatting and beautification",
      "JSON validation with error detection",
      "JSON Schema validation support",
      "JSON minification for production",
      "File upload with drag-and-drop support",
      "Syntax highlighting",
      "Copy to clipboard functionality",
      "Download formatted JSON",
      "Real-time validation feedback",
      "Client-side processing for security"
    ],
    "screenshot": "/og-json-formatter.png",
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
              JSON Formatter & Validator
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Professional JSON formatting and validation tool with schema support, syntax highlighting, and real-time error detection.
              Perfect for developers working with JSON data, APIs, and configuration files.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                JSON Schema
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Syntax Validation
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Pretty Print
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                Minification
              </span>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <FeatureCard
              color="blue"
              title="JSON Formatting"
              description="Instantly format and beautify JSON with proper indentation, spacing, and structure for better readability."
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />

            <FeatureCard
              color="green"
              title="Syntax Validation"
              description="Real-time JSON syntax validation with detailed error messages and line number references for quick debugging."
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />

            <FeatureCard
              color="purple"
              title="Schema Validation"
              description="Validate JSON against JSON Schema specifications with comprehensive error reporting and compliance checking."
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              }
            />

            <FeatureCard
              color="orange"
              title="Minification"
              description="Compress JSON by removing whitespace and formatting for production use and reduced file sizes."
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              }
            />

            <FeatureCard
              color="red"
              title="Copy & Download"
              description="Easily copy formatted JSON to clipboard or download as a file for use in your applications and projects."
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              }
            />

            <FeatureCard
              color="indigo"
              title="File Upload"
              description="Upload JSON files directly with drag-and-drop support. Supports files up to 10MB with automatic validation."
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              }
            />

            <FeatureCard
              color="pink"
              title="Secure & Private"
              description="All processing happens in your browser. Your JSON data never leaves your device for maximum security and privacy."
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />
          </div>

          {/* Usage Instructions */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6">How to Use JSON Formatter</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">1. Input Your JSON</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Paste your JSON in the input area</li>
                  <li>• Upload a JSON file by dragging & dropping or clicking "Choose File"</li>
                  <li>• Raw or minified JSON both work</li>
                  <li>• Maximum file size: 10MB</li>
                  <li>• Supports nested objects and arrays</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">2. Choose Operation</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Click "Format JSON" for pretty printing</li>
                  <li>• Click "Minify JSON" for compression</li>
                  <li>• Enable schema validation if needed</li>
                  <li>• View real-time validation results</li>
                  <li>• Check for syntax errors instantly</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">3. Use Results</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Copy formatted JSON to clipboard</li>
                  <li>• Download as a .json file</li>
                  <li>• Use in your applications</li>
                  <li>• Share with team members</li>
                  <li>• Debug API responses</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">4. Advanced Features</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• JSON Schema validation</li>
                  <li>• Syntax error highlighting</li>
                  <li>• Line and column error reporting</li>
                  <li>• Tree view for complex objects</li>
                  <li>• Search and filter capabilities</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Ad placement before tool */}
          <AdPlacement
            placementKey="tool_page_top"
            className="py-4"
          />

          {/* JSON Formatter Component */}
          <JsonFormatterClient />

          {/* FAQ Section */}
          <div className="bg-card rounded-lg p-8 border mt-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What is JSON formatting?</h3>
                <p className="text-muted-foreground">
                  JSON formatting, also called pretty-printing, adds proper indentation, spacing, and line breaks to make JSON data more readable for humans while maintaining the same data structure.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Why validate JSON?</h3>
                <p className="text-muted-foreground">
                  JSON validation ensures your data follows the correct syntax rules. Invalid JSON can cause parsing errors in applications, APIs, and data processing systems.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">What is JSON Schema validation?</h3>
                <p className="text-muted-foreground">
                  JSON Schema validation checks if your JSON data conforms to a predefined structure and data types. This is useful for ensuring API responses and configuration files meet expected formats.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Is my data secure?</h3>
                <p className="text-muted-foreground">
                  Yes, all JSON processing happens locally in your browser. Your data never gets sent to our servers, ensuring complete privacy and security for sensitive information.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">What file sizes are supported?</h3>
                <p className="text-muted-foreground">
                  The tool supports JSON files up to 10MB in size. For larger files, consider processing them in smaller chunks or using command-line JSON processing tools.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">How do I upload a JSON file?</h3>
                <p className="text-muted-foreground">
                  You can upload JSON files by dragging and dropping them onto the upload area or by clicking "Choose File" to browse your computer. The tool supports .json files and validates file types automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
