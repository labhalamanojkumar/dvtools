import { Metadata } from "next";
import ApiSimulatorClient from "@/components/tools/api-simulator-client";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "API Request Simulator - Test HTTP Requests with Authentication & Assertions | Multi-Tool Platform",
  description: "Free online API request simulator for testing REST APIs. Send HTTP requests with authentication, custom headers, payload templates, and response assertions. Supports GET, POST, PUT, DELETE methods with Bearer tokens, Basic auth, and API keys.",
  keywords: [
    "API simulator",
    "HTTP request tester",
    "REST API testing",
    "API authentication",
    "request assertions",
    "HTTP client",
    "API testing tool",
    "REST client",
    "HTTP methods",
    "API headers",
    "JSON payload",
    "Bearer token",
    "Basic auth",
    "API key authentication",
    "OAuth 2.0",
    "response validation",
    "API debugging",
    "HTTP status codes",
    "request history",
    "timeout controls"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multitoolplatform.com"),
  alternates: {
    canonical: "/tools/api-simulator",
  },
  openGraph: {
    title: "API Request Simulator - Test HTTP Requests with Authentication & Assertions",
    description: "Send HTTP requests with authentication, custom headers, and response assertions. Test REST APIs with our free online API simulator supporting all HTTP methods.",
    url: "/tools/api-simulator",
    siteName: "Multi Tool Platform",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-api-simulator.png",
        width: 1200,
        height: 630,
        alt: "API Request Simulator Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "API Request Simulator - Test HTTP Requests with Authentication & Assertions",
    description: "Send HTTP requests with authentication, custom headers, and response assertions. Test REST APIs with our free online API simulator.",
    images: ["/og-api-simulator.png"],
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
  category: "developer tools",
};

export default function ApiSimulatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "API Request Simulator",
    "description": "Advanced online API request simulator for comprehensive REST API testing with authentication, custom headers, payload templates, and powerful response assertions supporting all HTTP methods.",
    "url": "https://multitoolplatform.com/tools/api-simulator",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "Complete HTTP methods support (GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS)",
      "Multiple authentication types (Basic, Bearer Token, API Key, OAuth 2.0)",
      "Custom headers and request body with JSON/XML/text support",
      "Powerful response assertions and validation system",
      "Request history and template management",
      "Response time monitoring and performance tracking",
      "Timeout and redirect controls",
      "Request/response size tracking",
      "CORS header validation",
      "JSON schema validation",
      "Request cloning and modification",
      "Environment variable support"
    ],
    "screenshot": "/og-api-simulator.png",
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
        "name": "API Simulator",
        "item": "https://multitoolplatform.com/tools/api-simulator"
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
              API Request Simulator
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Test HTTP requests with authentication, custom headers, payload templates, and response assertions.
              Perfect for API testing, debugging, and development with support for all HTTP methods and authentication types.
            </p>

            {/* Key Features */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
              <div className="bg-card p-4 rounded-lg border">
                <div className="text-2xl mb-2">🌐</div>
                <h3 className="font-semibold mb-1">HTTP Methods</h3>
                <p className="text-sm text-muted-foreground">
                  Full support for GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS
                </p>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <div className="text-2xl mb-2">🔐</div>
                <h3 className="font-semibold mb-1">Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  Basic, Bearer, API Key, and OAuth 2.0 authentication
                </p>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <div className="text-2xl mb-2">✅</div>
                <h3 className="font-semibold mb-1">Assertions</h3>
                <p className="text-sm text-muted-foreground">
                  Powerful response validation and testing capabilities
                </p>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <div className="text-2xl mb-2">📊</div>
                <h3 className="font-semibold mb-1">Performance</h3>
                <p className="text-sm text-muted-foreground">
                  Response time monitoring and performance tracking
                </p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-1.657 0-3-4.03-3-9s1.343-9 3-9m0 18c1.657 0 3-4.03 3-9s-1.343-9-3-9" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">HTTP Methods Support</h3>
              <p className="text-muted-foreground">
                Complete support for all HTTP methods including GET, POST, PUT, DELETE, PATCH, HEAD, and OPTIONS with proper method handling.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Authentication Types</h3>
              <p className="text-muted-foreground">
                Multiple authentication methods including Basic Auth, Bearer Tokens, API Keys, and OAuth 2.0 for comprehensive API testing.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Response Assertions</h3>
              <p className="text-muted-foreground">
                Powerful assertion system to validate HTTP status codes, response headers, JSON fields, response times, and content patterns.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Request History</h3>
              <p className="text-muted-foreground">
                Save and manage request history for quick re-testing, template creation, and documentation of API interactions.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Performance Monitoring</h3>
              <p className="text-muted-foreground">
                Track response times, monitor request/response sizes, and set timeout controls for comprehensive API performance testing.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Data Formats</h3>
              <p className="text-muted-foreground">
                Support for JSON, XML, form data, and plain text payloads with syntax highlighting and validation for all formats.
              </p>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6">How to Test APIs with the Simulator</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">1. Configure Request</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Select HTTP method (GET, POST, PUT, DELETE, etc.)</li>
                  <li>• Enter the API endpoint URL</li>
                  <li>• Choose authentication type if required</li>
                  <li>• Add custom headers for the request</li>
                  <li>• Configure timeout and redirect settings</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">2. Set Request Body</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Choose content type (JSON, XML, Form Data, Text)</li>
                  <li>• Enter or paste request payload</li>
                  <li>• Use syntax highlighting for JSON/XML</li>
                  <li>• Validate payload format before sending</li>
                  <li>• Save as template for reuse</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">3. Add Assertions</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Set expected HTTP status code</li>
                  <li>• Validate response headers</li>
                  <li>• Check JSON field values and structure</li>
                  <li>• Verify response time limits</li>
                  <li>• Test for text patterns in response</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">4. Send & Analyze</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Send the request and view response</li>
                  <li>• Check assertion results</li>
                  <li>• Review response time and size</li>
                  <li>• Save request to history</li>
                  <li>• Debug failed requests</li>
                </ul>
              </div>
            </div>
          </div>

          {/* API Simulator Component */}
          <div className="mb-12">
            <ApiSimulatorClient />
          </div>

          {/* Documentation Section */}
          <div className="mt-16 space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">How to Use</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Follow these steps to effectively test and debug your APIs
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Getting Started */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">1. Configure Request</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Select HTTP method (GET, POST, PUT, DELETE, etc.)</p>
                    <p>• Enter the API endpoint URL</p>
                    <p>• Choose authentication type if required</p>
                    <p>• Add custom headers for the request</p>
                    <p>• Configure timeout and redirect settings</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">2. Set Request Body</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Choose content type (JSON, XML, Form Data, Text)</p>
                    <p>• Enter or paste request payload</p>
                    <p>• Use syntax highlighting for JSON/XML</p>
                    <p>• Validate payload format before sending</p>
                    <p>• Save as template for reuse</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">3. Add Assertions</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Set expected HTTP status code</p>
                    <p>• Validate response headers</p>
                    <p>• Check JSON field values and structure</p>
                    <p>• Verify response time limits</p>
                    <p>• Test for text patterns in response</p>
                  </div>
                </div>
              </div>

              {/* Advanced Features */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">4. Send & Analyze</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Send the request and view response</p>
                    <p>• Check assertion results</p>
                    <p>• Review response time and size</p>
                    <p>• Save request to history</p>
                    <p>• Debug failed requests</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">5. Monitor Performance</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Track response times and latency</p>
                    <p>• Monitor request/response sizes</p>
                    <p>• Set up performance thresholds</p>
                    <p>• Identify slow endpoints</p>
                    <p>• Generate performance reports</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">6. Save & Reuse</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Save requests to history</p>
                    <p>• Create reusable templates</p>
                    <p>• Share requests with team members</p>
                    <p>• Import/export request collections</p>
                    <p>• Organize requests by project</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Use Cases */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Common Use Cases</h3>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">API Development</h4>
                  <p className="text-sm text-muted-foreground">
                    Test API endpoints during development, validate request/response formats,
                    and ensure proper authentication and authorization mechanisms.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Integration Testing</h4>
                  <p className="text-sm text-muted-foreground">
                    Test third-party API integrations, validate webhook endpoints,
                    and ensure seamless communication between different services.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Performance Testing</h4>
                  <p className="text-sm text-muted-foreground">
                    Monitor API response times, test under different load conditions,
                    and identify performance bottlenecks in your API infrastructure.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Security Testing</h4>
                  <p className="text-sm text-muted-foreground">
                    Test authentication mechanisms, validate security headers,
                    and ensure proper handling of sensitive data in API requests.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Documentation</h4>
                  <p className="text-sm text-muted-foreground">
                    Create comprehensive API documentation with working examples,
                    test cases, and validation rules for developers and consumers.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Debugging</h4>
                  <p className="text-sm text-muted-foreground">
                    Debug API issues, inspect request/response data, and validate
                    that APIs behave correctly under various conditions and inputs.
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
                    API Testing Best Practices
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
                    <div>
                      <strong>Test All Methods:</strong> Ensure comprehensive coverage of GET, POST, PUT, DELETE, and other HTTP methods for each endpoint.
                    </div>
                    <div>
                      <strong>Validate Authentication:</strong> Test all authentication methods thoroughly and validate proper error handling for unauthorized requests.
                    </div>
                    <div>
                      <strong>Use Assertions:</strong> Implement comprehensive assertions to validate response status, headers, content, and performance metrics.
                    </div>
                    <div>
                      <strong>Test Edge Cases:</strong> Include tests for malformed requests, large payloads, special characters, and boundary conditions.
                    </div>
                    <div>
                      <strong>Monitor Performance:</strong> Set up performance monitoring and alerts for response times and identify slow endpoints early.
                    </div>
                    <div>
                      <strong>Document Everything:</strong> Save test cases, create templates, and maintain comprehensive documentation for API behavior.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Educational Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* About API Testing */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4">About API Request Simulation</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p>
                  Test and debug REST APIs with our comprehensive API request simulator. Send HTTP requests with various authentication methods,
                  custom headers, and request bodies. Validate responses with powerful assertion capabilities to ensure your APIs work as expected.
                </p>

                <h3>Why API Testing Matters</h3>
                <ul>
                  <li><strong>Reliability:</strong> Ensure APIs work correctly under different conditions</li>
                  <li><strong>Security:</strong> Validate authentication and authorization mechanisms</li>
                  <li><strong>Performance:</strong> Monitor response times and identify bottlenecks</li>
                  <li><strong>Integration:</strong> Test third-party API integrations and dependencies</li>
                  <li><strong>Documentation:</strong> Create examples and test cases for API documentation</li>
                </ul>

                <h3>Supported Authentication Methods</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Basic Authentication</h4>
                    <p className="text-sm text-muted-foreground">
                      Username and password encoded in base64 for simple auth scenarios
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Bearer Token</h4>
                    <p className="text-sm text-muted-foreground">
                      JWT or access tokens in Authorization header for modern APIs
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950 dark:to-violet-900 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">API Key</h4>
                    <p className="text-sm text-muted-foreground">
                      Custom header with API key for service-to-service authentication
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-950 dark:to-amber-900 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">OAuth 2.0</h4>
                    <p className="text-sm text-muted-foreground">
                      Bearer token authentication for OAuth 2.0 flows and integrations
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* HTTP Methods & Assertions */}
            <div>
              <h3 className="text-lg font-semibold mb-4">HTTP Methods & Assertions</h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">HTTP Methods</h4>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    {["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"].map(method => (
                      <div key={method} className="bg-white dark:bg-gray-800 rounded px-2 py-1 text-center">
                        {method}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Response Assertions</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Status Code Validation</li>
                    <li>• Header Presence/Values</li>
                    <li>• JSON Field Validation</li>
                    <li>• Response Time Checks</li>
                    <li>• Text Pattern Matching</li>
                    <li>• Content Size Limits</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950 dark:to-violet-900 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Performance Metrics</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Response Time Tracking</li>
                    <li>• Request/Response Size</li>
                    <li>• Timeout Configuration</li>
                    <li>• Redirect Handling</li>
                    <li>• Connection Details</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">How API Simulation Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold mb-2">Configure Request</h3>
                <p className="text-muted-foreground">
                  Set HTTP method, URL, authentication, headers, and request body with full customization options.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold mb-2">Add Assertions</h3>
                <p className="text-muted-foreground">
                  Define validation rules for status codes, headers, response content, and performance metrics.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold mb-2">Send & Monitor</h3>
                <p className="text-muted-foreground">
                  Execute the request and monitor response time, size, and assertion results in real-time.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  4
                </div>
                <h3 className="text-lg font-semibold mb-2">Analyze Results</h3>
                <p className="text-muted-foreground">
                  Review detailed response data, assertion outcomes, and save requests for future testing.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-card rounded-lg p-8 border mt-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What HTTP methods are supported?</h3>
                <p className="text-muted-foreground">
                  We support all standard HTTP methods including GET, POST, PUT, DELETE, PATCH, HEAD, and OPTIONS.
                  Each method is handled according to HTTP specifications with proper request formatting.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">How do I test authenticated APIs?</h3>
                <p className="text-muted-foreground">
                  Choose from multiple authentication methods: Basic Auth (username/password), Bearer Token (JWT), API Key (custom header),
                  or OAuth 2.0. The tool automatically formats and includes the appropriate Authorization headers.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">What are response assertions?</h3>
                <p className="text-muted-foreground">
                  Assertions are validation rules that check if the API response meets your expectations. You can validate HTTP status codes,
                  response headers, JSON field values, response times, and text patterns to ensure API reliability.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I save and reuse requests?</h3>
                <p className="text-muted-foreground">
                  Yes! The request history feature allows you to save, modify, and quickly re-run previous requests.
                  You can also create templates for common API operations and share them with your team.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">How do I test API performance?</h3>
                <p className="text-muted-foreground">
                  Monitor response times, set timeout limits, and track request/response sizes. Use assertions to validate
                  that your APIs meet performance requirements and identify potential bottlenecks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}