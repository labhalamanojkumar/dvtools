import { Metadata } from "next";
import ComponentPlaygroundClient from "@/components/tools/component-playground-client";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Component Playground - React Component Builder | Multi-Tool Platform",
  description: "Interactive React component playground with live previews, real-time customization, and instant code generation. Build, test, and export React components with drag-and-drop file upload support.",
  keywords: [
    "react component playground",
    "component builder",
    "react development",
    "live preview",
    "component generator",
    "react props",
    "component customization",
    "ui component builder",
    "react code generation",
    "interactive components",
    "component templates",
    "react prototyping"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multi-tool-platform.com"),
  alternates: {
    canonical: "/tools/component-playground",
  },
  openGraph: {
    title: "Component Playground - React Component Builder",
    description: "Interactive React component playground with live previews, real-time customization, and instant code generation.",
    url: "/tools/component-playground",
    siteName: "Multi-Tool Platform",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-component-playground.png",
        width: 1200,
        height: 630,
        alt: "Component Playground Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Component Playground - React Component Builder",
    description: "Interactive React component playground with live previews and real-time customization.",
    images: ["/og-component-playground.png"],
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

export default function ComponentPlaygroundPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Component Playground",
    "description": "Interactive React component playground with live previews, real-time customization, and instant code generation for building and testing UI components.",
    "url": "https://multi-tool-platform.com/tools/component-playground",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "Live component preview",
      "Real-time prop customization",
      "Instant code generation",
      "Component templates",
      "File upload support",
      "Export functionality",
      "Interactive playground",
      "React component builder",
      "UI prototyping",
      "Component testing"
    ],
    "screenshot": "/og-component-playground.png",
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
              Component Playground
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Interactive React component builder with live previews, real-time customization, and instant code generation.
              Upload component configurations, experiment with props, and export production-ready code.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Live Preview
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Real-time Editing
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Code Generation
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                File Upload
              </span>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Live Preview</h3>
              <p className="text-muted-foreground">
                See your components come to life instantly as you adjust props and settings in real-time.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-time Editing</h3>
              <p className="text-muted-foreground">
                Modify component properties with instant visual feedback. No refresh needed to see changes.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Code Generation</h3>
              <p className="text-muted-foreground">
                Generate production-ready React code instantly. Copy, download, or export your components.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">File Upload</h3>
              <p className="text-muted-foreground">
                Import component configurations and templates from JSON files. Share and reuse your setups.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Component Templates</h3>
              <p className="text-muted-foreground">
                Access pre-built component templates and configurations. Start with proven patterns.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Export & Share</h3>
              <p className="text-muted-foreground">
                Export components as React files, JSON configs, or shareable links. Collaborate seamlessly.
              </p>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6">How to Use Component Playground</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">1. Select Component</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Choose from built-in component types</li>
                  <li>• Upload custom component configurations</li>
                  <li>• Start with pre-built templates</li>
                  <li>• Switch between components instantly</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">2. Customize Props</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Adjust component properties in real-time</li>
                  <li>• See live preview of changes</li>
                  <li>• Experiment with different variants</li>
                  <li>• Test edge cases and states</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">3. Generate Code</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• View generated React code instantly</li>
                  <li>• Copy code to clipboard</li>
                  <li>• Download as component file</li>
                  <li>• Export configuration as JSON</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">4. Advanced Features</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Save and load component configurations</li>
                  <li>• Share components with team members</li>
                  <li>• Version control your component designs</li>
                  <li>• Integrate with your development workflow</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Component Playground Component */}
          <ComponentPlaygroundClient />

          {/* FAQ Section */}
          <div className="bg-card rounded-lg p-8 border mt-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What components can I build?</h3>
                <p className="text-muted-foreground">
                  Component Playground supports a wide range of React components including buttons, cards, inputs, badges, and more. You can customize props, variants, and styling options.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I upload my own component configurations?</h3>
                <p className="text-muted-foreground">
                  Yes! You can upload JSON files containing component configurations. This allows you to share component setups, maintain templates, and collaborate with your team.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Is the generated code production-ready?</h3>
                <p className="text-muted-foreground">
                  Absolutely. The generated React code follows best practices and can be directly used in your projects. It includes proper prop types, styling, and component structure.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I save my component configurations?</h3>
                <p className="text-muted-foreground">
                  Yes, you can save component configurations as JSON files. These can be uploaded later to restore your exact component setup, making it easy to maintain design systems and component libraries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
