import { Metadata } from "next";
import FormatterProfilesClient from "@/components/tools/formatter-profiles-client";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Formatter Profiles - Code Formatting Tool | Multi-Tool Platform",
  description: "Professional code formatting with Prettier and Black. Apply custom formatting profiles, preview changes, and maintain consistent code style across JavaScript, TypeScript, Python, CSS, and more.",
  keywords: [
    "code formatter",
    "Prettier",
    "Black",
    "code formatting",
    "JavaScript formatter",
    "TypeScript formatter",
    "Python formatter",
    "CSS formatter",
    "JSON formatter",
    "code style",
    "formatting rules",
    "code consistency",
    "development tools",
    "code beautifier",
    "auto format",
    "formatting profiles",
    "custom config",
    "code standards",
    "linting and formatting",
    "code quality tools"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multi-tool-platform.com"),
  alternates: {
    canonical: "/tools/formatter-profiles",
  },
  openGraph: {
    title: "Formatter Profiles - Code Formatting Tool",
    description: "Professional code formatting with Prettier and Black. Apply custom profiles for consistent code style across languages.",
    url: "/tools/formatter-profiles",
    siteName: "Multi Tool Platform",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-formatter-profiles.png",
        width: 1200,
        height: 630,
        alt: "Formatter Profiles Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Formatter Profiles - Code Formatting Tool",
    description: "Professional code formatting with Prettier and Black. Custom profiles for consistent code style.",
    images: ["/og-formatter-profiles.png"],
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

export default function FormatterProfilesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Formatter Profiles",
    "description": "Professional code formatting tool with Prettier and Black support. Apply custom formatting profiles and maintain consistent code style across JavaScript, TypeScript, Python, CSS, and JSON.",
    "url": "https://multi-tool-platform.com/tools/formatter-profiles",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "Prettier integration for JavaScript, TypeScript, CSS, HTML, JSON, and more",
      "Black formatter for Python with PEP 8 compliance",
      "Custom formatting profiles and configurations",
      "Real-time formatting preview and comparison",
      "Multiple preset profiles (Standard, Airbnb, Google style guides)",
      "Configurable formatting rules (semicolons, quotes, indentation, line width)",
      "Batch formatting for multiple files",
      "Export formatted code with custom settings",
      "Team-shared formatting configurations",
      "Integration with popular IDEs and editors"
    ],
    "screenshot": "/og-formatter-profiles.png",
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
              Formatter Profiles
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Professional code formatting with Prettier and Black. Apply custom formatting profiles and maintain
              consistent code style across JavaScript, TypeScript, Python, CSS, and JSON.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Prettier
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Black
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Custom Profiles
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                Real-time Preview
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                Batch Format
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
              <h3 className="text-lg font-semibold mb-2">Multi-language Support</h3>
              <p className="text-muted-foreground">
                Comprehensive formatting support for JavaScript, TypeScript, Python, CSS, HTML, JSON, and more with language-specific rules.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Custom Profiles</h3>
              <p className="text-muted-foreground">
                Create and save custom formatting profiles with your preferred rules for semicolons, quotes, indentation, and line width.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-time Preview</h3>
              <p className="text-muted-foreground">
                See formatting changes instantly as you type. Compare original and formatted code side-by-side with syntax highlighting.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Preset Profiles</h3>
              <p className="text-muted-foreground">
                Choose from popular preset profiles including Standard, Airbnb, Google style guides, and custom configurations.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Batch Processing</h3>
              <p className="text-muted-foreground">
                Format multiple files at once. Upload files or paste multiple code snippets for batch processing and consistent formatting.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Export & Share</h3>
              <p className="text-muted-foreground">
                Export formatted code and share formatting profiles with your team. Download files or copy to clipboard.
              </p>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6">How to Use Formatter Profiles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">1. Select Formatter & Profile</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Choose Prettier or Black formatter</li>
                  <li>• Select a preset profile or create custom</li>
                  <li>• Configure formatting rules as needed</li>
                  <li>• Enable/disable specific formatting options</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">2. Input Your Code</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Paste or type your code in the editor</li>
                  <li>• Upload files for batch processing</li>
                  <li>• Support for multiple file formats</li>
                  <li>• Real-time syntax highlighting</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">3. Preview & Format</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• See real-time formatting preview</li>
                  <li>• Compare original vs formatted code</li>
                  <li>• Apply formatting with one click</li>
                  <li>• Review formatting changes</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">4. Export Results</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Copy formatted code to clipboard</li>
                  <li>• Download formatted files</li>
                  <li>• Save custom profiles for reuse</li>
                  <li>• Share profiles with team members</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Formatter Profiles Component */}
          <FormatterProfilesClient />

          {/* FAQ Section */}
          <div className="bg-card rounded-lg p-8 border mt-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What's the difference between Prettier and Black?</h3>
                <p className="text-muted-foreground">
                  Prettier is an opinionated code formatter that supports JavaScript, TypeScript, CSS, HTML, JSON, and more.
                  Black is Python's uncompromising code formatter that follows PEP 8 style guidelines. Both ensure consistent code formatting.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I create custom formatting rules?</h3>
                <p className="text-muted-foreground">
                  Yes, you can customize formatting options like semicolons, quotes, indentation, line width, and trailing commas.
                  Save your custom configurations as profiles for reuse across projects.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Does this replace my IDE's formatter?</h3>
                <p className="text-muted-foreground">
                  This tool complements your IDE's formatter. Use it for one-off formatting, batch processing, or when you need
                  specific formatting profiles that differ from your default IDE settings.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Is my code secure when using this tool?</h3>
                <p className="text-muted-foreground">
                  Absolutely. All code processing happens locally in your browser. Your code never leaves your device or gets sent to external servers.
                  This ensures complete privacy and security.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I format multiple files at once?</h3>
                <p className="text-muted-foreground">
                  Yes, the tool supports batch processing. You can upload multiple files or paste multiple code snippets
                  to format them all at once with consistent rules and profiles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}