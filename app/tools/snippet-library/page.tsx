import { Metadata } from "next";
import SnippetLibraryClient from "@/components/tools/snippet-library-client";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Snippet Library - Code Snippet Manager | Multi-Tool Platform",
  description: "Professional code snippet library for developers. Store, organize, and share reusable code snippets across JavaScript, Python, React, Node.js, and more. Team collaboration and quick access.",
  keywords: [
    "code snippets",
    "snippet library",
    "code templates",
    "reusable code",
    "JavaScript snippets",
    "Python snippets",
    "React snippets",
    "Node.js snippets",
    "code sharing",
    "developer tools",
    "code management",
    "team collaboration",
    "code repository",
    "programming snippets",
    "code examples",
    "boilerplate code",
    "code patterns",
    "development workflow",
    "code organization"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multi-tool-platform.com"),
  alternates: {
    canonical: "/tools/snippet-library",
  },
  openGraph: {
    title: "Snippet Library - Code Snippet Manager",
    description: "Store, organize, and share reusable code snippets. Professional library for JavaScript, Python, React, Node.js with team collaboration.",
    url: "/tools/snippet-library",
    siteName: "Multi Tool Platform",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-snippet-library.png",
        width: 1200,
        height: 630,
        alt: "Snippet Library Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Snippet Library - Code Snippet Manager",
    description: "Professional code snippet library for developers. Store and share reusable code snippets with team collaboration.",
    images: ["/og-snippet-library.png"],
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

export default function SnippetLibraryPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Snippet Library",
    "description": "Professional code snippet library for developers. Store, organize, and share reusable code snippets across JavaScript, Python, React, Node.js, and more with team collaboration features.",
    "url": "https://multi-tool-platform.com/tools/snippet-library",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "Organize code snippets by language and category",
      "Team collaboration and sharing capabilities",
      "Syntax highlighting for multiple programming languages",
      "Search and filter snippets by keywords and tags",
      "Import/export snippets in multiple formats",
      "Version control for snippet updates",
      "Private and public snippet collections",
      "Quick copy to clipboard functionality",
      "Integration with popular IDEs and editors",
      "Backup and restore snippet collections"
    ],
    "screenshot": "/og-snippet-library.png",
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
              Snippet Library
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Professional code snippet manager for developers. Store, organize, and share reusable code snippets
              across JavaScript, Python, React, Node.js, and more with team collaboration features.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                JavaScript
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Python
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                React
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                Node.js
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                Team Sharing
              </span>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Organized Collections</h3>
              <p className="text-muted-foreground">
                Organize snippets by language, framework, and category. Create custom collections and folders
                for different projects and use cases.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Team Collaboration</h3>
              <p className="text-muted-foreground">
                Share snippet collections with your team. Collaborate on code patterns and maintain
                consistent coding standards across projects.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Search</h3>
              <p className="text-muted-foreground">
                Powerful search and filtering capabilities. Find snippets by keywords, tags, language,
                or content. Save frequently used searches.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Syntax Highlighting</h3>
              <p className="text-muted-foreground">
                Beautiful syntax highlighting for 100+ programming languages. Clear, readable code
                presentation with proper formatting and colors.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V7M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Quick Copy</h3>
              <p className="text-muted-foreground">
                One-click copy to clipboard. Instantly paste snippets into your code editor or IDE.
                No need to manually select and copy text.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Backup & Sync</h3>
              <p className="text-muted-foreground">
                Automatic backup and cloud synchronization. Never lose your valuable code snippets.
                Export/import collections for migration.
              </p>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6">How to Use Snippet Library</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">1. Create Collections</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Organize snippets by project or language</li>
                  <li>• Create custom categories and tags</li>
                  <li>• Set up team-shared collections</li>
                  <li>• Import existing snippet files</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">2. Add Snippets</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Write or paste code snippets</li>
                  <li>• Add titles, descriptions, and tags</li>
                  <li>• Choose programming language</li>
                  <li>• Include usage examples</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">3. Search & Filter</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Search by keywords or content</li>
                  <li>• Filter by language or category</li>
                  <li>• Use tags to find related snippets</li>
                  <li>• Save favorite searches</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">4. Share & Export</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Share collections with team members</li>
                  <li>• Export snippets in multiple formats</li>
                  <li>• Generate documentation</li>
                  <li>• Backup your collections</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Snippet Library Component */}
          <SnippetLibraryClient />

          {/* FAQ Section */}
          <div className="bg-card rounded-lg p-8 border mt-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">How many snippets can I store?</h3>
                <p className="text-muted-foreground">
                  There's no limit to the number of snippets you can store. Collections can contain thousands of snippets
                  organized by language, project, or category for easy access.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I share snippets with my team?</h3>
                <p className="text-muted-foreground">
                  Yes, you can create team-shared collections and invite team members to collaborate. Control access permissions
                  and maintain version history for shared snippets.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">What programming languages are supported?</h3>
                <p className="text-muted-foreground">
                  Snippet Library supports syntax highlighting for 100+ programming languages including JavaScript, TypeScript,
                  Python, Java, C++, Go, Rust, PHP, Ruby, and many more.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Is my data secure?</h3>
                <p className="text-muted-foreground">
                  Absolutely. All snippets are stored securely with encryption. Private collections are only accessible to you,
                  and shared collections have granular permission controls.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I import snippets from other tools?</h3>
                <p className="text-muted-foreground">
                  Yes, you can import snippets from popular tools like VS Code, Sublime Text, Atom, and other snippet managers.
                  Support for JSON, XML, and plain text formats.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}