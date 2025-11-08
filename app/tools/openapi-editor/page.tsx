import { Metadata } from "next";
import OpenAPIEditorClient from "@/components/tools/openapi-editor-client";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "OpenAPI/Swagger Editor - API Design & Validation Tool | Multi-Tool Platform",
  description: "Design, validate, and preview API documentation with OpenAPI/Swagger specifications. Upload YAML/JSON files, edit specs, generate example responses, and validate against OpenAPI 3.0 standards.",
  keywords: [
    "OpenAPI editor",
    "Swagger editor",
    "API design",
    "API documentation",
    "OpenAPI validator",
    "Swagger validator",
    "API specification",
    "REST API design",
    "OpenAPI 3.0",
    "API schema validation",
    "Swagger UI",
    "API examples"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multi-tool-platform.com"),
  alternates: {
    canonical: "/tools/openapi-editor",
  },
  openGraph: {
    title: "OpenAPI/Swagger Editor - API Design & Validation Tool",
    description: "Design, validate, and preview API documentation with OpenAPI/Swagger specifications. Upload files, edit specs, and generate examples.",
    url: "/tools/openapi-editor",
    siteName: "Multi-Tool Platform",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-openapi-editor.png",
        width: 1200,
        height: 630,
        alt: "OpenAPI/Swagger Editor Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenAPI/Swagger Editor - API Design & Validation Tool",
    description: "Design, validate, and preview API documentation with OpenAPI/Swagger specifications.",
    images: ["/og-openapi-editor.png"],
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

export default function OpenAPIEditorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "OpenAPI/Swagger Editor",
    "description": "Professional API design and documentation tool with OpenAPI/Swagger specification validation, real-time preview, and example response generation.",
    "url": "https://multi-tool-platform.com/tools/openapi-editor",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "OpenAPI 3.0 specification editing",
      "YAML and JSON format support",
      "Real-time validation",
      "API documentation preview",
      "Example response generation",
      "Schema validation",
      "File upload and download",
      "Syntax highlighting"
    ],
    "screenshot": "/og-openapi-editor.png",
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
              OpenAPI/Swagger Editor
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Design, validate, and preview professional API documentation with OpenAPI 3.0 specifications.
              Upload YAML/JSON files, edit specs in real-time, and generate example responses.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                OpenAPI 3.0
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                YAML/JSON
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Real-time Validation
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                API Preview
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
              <h3 className="text-lg font-semibold mb-2">Spec Editor</h3>
              <p className="text-muted-foreground">
                Edit OpenAPI specifications in YAML or JSON format with syntax highlighting and auto-completion.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-time Validation</h3>
              <p className="text-muted-foreground">
                Validate API specifications against OpenAPI 3.0 standards with instant error detection and suggestions.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Live Preview</h3>
              <p className="text-muted-foreground">
                Preview API documentation in real-time with interactive Swagger UI and example responses.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Example Generation</h3>
              <p className="text-muted-foreground">
                Automatically generate example responses and requests based on schema definitions and data types.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">File Upload</h3>
              <p className="text-muted-foreground">
                Upload existing OpenAPI specifications in YAML or JSON format for quick editing and validation.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Schema Validation</h3>
              <p className="text-muted-foreground">
                Validate request/response schemas, parameters, and data models against OpenAPI standards.
              </p>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6">How to Use OpenAPI Editor</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">1. Upload or Create Specification</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Upload existing YAML/JSON OpenAPI file</li>
                  <li>• Or start with a blank template</li>
                  <li>• Choose between YAML or JSON format</li>
                  <li>• Editor supports OpenAPI 3.0 standard</li>
                  <li>• Syntax highlighting for easy editing</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">2. Edit API Specification</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Define API endpoints and methods</li>
                  <li>• Add request/response schemas</li>
                  <li>• Configure parameters and headers</li>
                  <li>• Set authentication requirements</li>
                  <li>• Add descriptions and examples</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">3. Validate & Preview</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Real-time validation as you type</li>
                  <li>• View errors and warnings instantly</li>
                  <li>• Preview API docs in Swagger UI</li>
                  <li>• Test example responses</li>
                  <li>• Validate against OpenAPI 3.0 spec</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">4. Export & Share</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Download validated specification</li>
                  <li>• Export as YAML or JSON</li>
                  <li>• Generate example responses</li>
                  <li>• Share with team members</li>
                  <li>• Use in API development tools</li>
                </ul>
              </div>
            </div>
          </div>

          {/* OpenAPI Editor Component */}
          <OpenAPIEditorClient />

          {/* FAQ Section */}
          <div className="bg-card rounded-lg p-8 border mt-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What is OpenAPI/Swagger?</h3>
                <p className="text-muted-foreground">
                  OpenAPI (formerly Swagger) is a specification format for describing RESTful APIs. It provides a standard way to document API endpoints, parameters, responses, and authentication methods.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Which OpenAPI version is supported?</h3>
                <p className="text-muted-foreground">
                  This editor supports OpenAPI 3.0 specifications in both YAML and JSON formats. OpenAPI 3.0 is the latest and recommended version for modern API design.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I upload existing specifications?</h3>
                <p className="text-muted-foreground">
                  Yes, you can upload existing OpenAPI files in YAML or JSON format. The editor will validate and display your specification for editing and preview.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">How does validation work?</h3>
                <p className="text-muted-foreground">
                  The editor validates your specification in real-time against OpenAPI 3.0 standards, checking syntax, required fields, data types, and schema consistency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
