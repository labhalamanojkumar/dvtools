import { Metadata } from "next";
import MockServerClient from "@/components/tools/mock-server-client";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Mock Server Generator - API Mocking Tool | Multi-Tool Platform",
  description: "Generate mock API servers from OpenAPI specifications or custom payloads. Create, test, and share mock endpoints for rapid development and testing without backend dependencies.",
  keywords: [
    "mock server",
    "API mocking",
    "mock API",
    "API testing",
    "mock endpoints",
    "OpenAPI mocking",
    "REST API mock",
    "API simulator",
    "mock data generator",
    "API prototyping",
    "backend mocking",
    "fake API server"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multi-tool-platform.com"),
  alternates: {
    canonical: "/tools/mock-server",
  },
  openGraph: {
    title: "Mock Server Generator - API Mocking Tool",
    description: "Generate mock API servers from OpenAPI specs or custom payloads. Create and test mock endpoints instantly.",
    url: "/tools/mock-server",
    siteName: "Multi-Tool Platform",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-mock-server.png",
        width: 1200,
        height: 630,
        alt: "Mock Server Generator Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mock Server Generator - API Mocking Tool",
    description: "Generate mock API servers from OpenAPI specs or custom payloads.",
    images: ["/og-mock-server.png"],
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
  category: "api tools",
};

export default function MockServerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Mock Server Generator",
    "description": "Professional API mocking tool that generates mock servers from OpenAPI specifications or custom JSON payloads for rapid development and testing.",
    "url": "https://multi-tool-platform.com/tools/mock-server",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "OpenAPI specification mocking",
      "Custom payload support",
      "Dynamic mock endpoint generation",
      "Response customization",
      "Request/response logging",
      "Mock data validation",
      "Shareable mock URLs",
      "Real-time testing"
    ],
    "screenshot": "/og-mock-server.png",
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
              Mock Server Generator
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Generate instant mock API servers from OpenAPI specifications or custom payloads.
              Perfect for frontend development, testing, and prototyping without backend dependencies.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                OpenAPI Support
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Custom Payloads
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Live Testing
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                Shareable URLs
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
              <h3 className="text-lg font-semibold mb-2">OpenAPI Import</h3>
              <p className="text-muted-foreground">
                Import OpenAPI/Swagger specifications to automatically generate mock endpoints with realistic responses.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Custom Endpoints</h3>
              <p className="text-muted-foreground">
                Create custom mock endpoints with your own JSON payloads, status codes, and response headers.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Instant Deployment</h3>
              <p className="text-muted-foreground">
                Mock servers are deployed instantly with unique URLs. Start testing your API clients immediately.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Request Logging</h3>
              <p className="text-muted-foreground">
                View all requests made to your mock server with full headers, body, and response details.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Response Customization</h3>
              <p className="text-muted-foreground">
                Customize response delays, status codes, headers, and data to simulate various scenarios.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Team Sharing</h3>
              <p className="text-muted-foreground">
                Share mock server URLs with your team for collaborative development and testing.
              </p>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6">How to Use Mock Server Generator</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">1. Create Mock Server</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Upload OpenAPI specification file</li>
                  <li>• Or define custom endpoints manually</li>
                  <li>• Set response payloads and status codes</li>
                  <li>• Configure response delays if needed</li>
                  <li>• Generate unique mock server URL</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">2. Configure Endpoints</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Add multiple endpoints with different paths</li>
                  <li>• Support GET, POST, PUT, DELETE methods</li>
                  <li>• Customize response headers</li>
                  <li>• Set dynamic path parameters</li>
                  <li>• Configure query parameter handling</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">3. Test & Monitor</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Make requests to mock endpoints</li>
                  <li>• View real-time request logs</li>
                  <li>• Inspect request/response details</li>
                  <li>• Test error scenarios</li>
                  <li>• Monitor API usage statistics</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">4. Share & Collaborate</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Copy shareable mock server URL</li>
                  <li>• Share with team members</li>
                  <li>• Use in frontend development</li>
                  <li>• Integrate with testing tools</li>
                  <li>• Export mock configurations</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Mock Server Component */}
          <MockServerClient />

          {/* FAQ Section */}
          <div className="bg-card rounded-lg p-8 border mt-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What is a mock server?</h3>
                <p className="text-muted-foreground">
                  A mock server simulates API endpoints by returning predefined responses. It's perfect for frontend development when the backend isn't ready or for testing edge cases.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I import OpenAPI specifications?</h3>
                <p className="text-muted-foreground">
                  Yes! Upload your OpenAPI/Swagger specification file, and we'll automatically generate mock endpoints with realistic example responses based on your schemas.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">How long do mock servers stay active?</h3>
                <p className="text-muted-foreground">
                  Mock servers remain active for 7 days by default. You can refresh the expiration by accessing the server or save configurations for later reuse.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I customize response delays?</h3>
                <p className="text-muted-foreground">
                  Yes, you can add artificial delays to mock endpoints to simulate slow network conditions or test loading states in your application.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
