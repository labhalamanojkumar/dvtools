import { Metadata } from "next";
import CodeFormattingToolsClient from "@/components/tools/code-formatting-tools-client";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Code Formatting, Linters & Productivity Tools | Multi-Tool Platform",
  description: "Professional code formatting and linting tools with ESLint, Prettier, Flake8, RuboCop, Stylelint. Custom formatter profiles, snippet library, dependency updater, and local dev tunneling.",
  keywords: [
    "code formatting",
    "linter",
    "ESLint",
    "Prettier",
    "Flake8",
    "RuboCop",
    "Stylelint",
    "code quality",
    "formatter profiles",
    "snippet library",
    "dependency updater",
    "dev tunneling",
    "ngrok",
    "cloudflared",
    "code beautifier",
    "linting tools",
    "code formatter",
    "productivity tools",
    "developer tools",
    "code quality tools",
    "JavaScript linter",
    "Python linter",
    "Ruby linter",
    "CSS linter",
    "code snippets",
    "boilerplates",
    "CLI scaffolds",
    "npm outdated",
    "vulnerability scanning",
    "local development",
    "tunnel commands",
    "dev server exposure"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multi-tool-platform.com"),
  alternates: {
    canonical: "/tools/code-formatting-tools",
  },
  openGraph: {
    title: "Code Formatting, Linters & Productivity Tools",
    description: "Professional code formatting and linting tools with ESLint, Prettier, Flake8, RuboCop, Stylelint. Custom profiles, snippets, dependency updates, and dev tunneling.",
    url: "/tools/code-formatting-tools",
    siteName: "Multi Tool Platform",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-code-formatting-tools.png",
        width: 1200,
        height: 630,
        alt: "Code Formatting, Linters & Productivity Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Code Formatting, Linters & Productivity Tools",
    description: "Professional code formatting and linting tools with ESLint, Prettier, Flake8, RuboCop, Stylelint.",
    images: ["/og-code-formatting-tools.png"],
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

export default function CodeFormattingToolsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Code Formatting, Linters & Productivity Tools",
    "description": "Comprehensive code quality and productivity suite with multi-language linting, formatting, snippets, dependency management, and development tunneling.",
    "url": "https://multi-tool-platform.com/tools/code-formatting-tools",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "Multi-language Linter Runner with ESLint, Flake8, RuboCop, Stylelint",
      "Formatter Profiles with custom Prettier/Black configurations",
      "Snippet Library with team-shared templates and boilerplates",
      "Dependency Updater with vulnerability scanning and PR generation",
      "Local Dev Tunneler with ngrok and cloudflared integration",
      "Inline code fixes and suggestions",
      "Real-time code analysis and validation",
      "Cross-platform compatibility",
      "Secure local processing",
      "Professional developer workflows"
    ],
    "screenshot": "/og-code-formatting-tools.png",
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
              Code Formatting, Linters & Productivity Tools
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Professional-grade code quality and productivity suite. Multi-language linting with inline fixes,
              custom formatter profiles, shared snippet libraries, dependency management, and development tunneling.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                ESLint
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Prettier
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                Flake8
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                RuboCop
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Stylelint
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                Snippets
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
              <h3 className="text-lg font-semibold mb-2">Multi-language Linter Runner</h3>
              <p className="text-muted-foreground">
                Run ESLint, Flake8, RuboCop, and Stylelint with automatic inline fixes and error detection across multiple programming languages.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Formatter Profiles</h3>
              <p className="text-muted-foreground">
                Custom Prettier and Black configurations with one-click apply and live preview. Save and share formatting profiles across teams.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Snippet Library & Templates</h3>
              <p className="text-muted-foreground">
                Team-shared code snippets, boilerplates, and CLI scaffolds. Organize and search through categorized code templates and patterns.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Dependency Updater</h3>
              <p className="text-muted-foreground">
                Scan for outdated dependencies, highlight security vulnerabilities, and generate pull requests for automated dependency updates.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Local Dev Tunneler</h3>
              <p className="text-muted-foreground">
                Integrated ngrok and cloudflared control panel for exposing local development servers. Generate secure tunnels with custom domains.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Professional Workflows</h3>
              <p className="text-muted-foreground">
                Streamlined developer workflows with automated fixes, team collaboration features, and enterprise-grade security and reliability.
              </p>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6">How to Use Code Formatting Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">1. Linter Runner</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Select programming language and linter</li>
                  <li>• Paste or upload your code</li>
                  <li>• Run linting with automatic fixes</li>
                  <li>• Review and apply suggested changes</li>
                  <li>• Export cleaned code</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">2. Formatter Profiles</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Choose formatter (Prettier/Black)</li>
                  <li>• Select or create custom profile</li>
                  <li>• Preview formatting changes</li>
                  <li>• Apply formatting to code</li>
                  <li>• Save profiles for team sharing</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">3. Snippet Library</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Browse categorized snippets</li>
                  <li>• Search by language or framework</li>
                  <li>• Copy snippets to clipboard</li>
                  <li>• Create and share custom snippets</li>
                  <li>• Import/export snippet collections</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">4. Dependency Updater</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Upload package.json or requirements.txt</li>
                  <li>• Scan for outdated dependencies</li>
                  <li>• Review security vulnerabilities</li>
                  <li>• Generate update commands</li>
                  <li>• Create automated PR templates</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">5. Dev Tunneler</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Choose tunneling service (ngrok/cloudflared)</li>
                  <li>• Configure local port and domain</li>
                  <li>• Generate tunnel commands</li>
                  <li>• Monitor tunnel status</li>
                  <li>• Share secure development URLs</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">6. Best Practices</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Run linters before committing code</li>
                  <li>• Use consistent formatting profiles</li>
                  <li>• Regularly update dependencies</li>
                  <li>• Share snippets across teams</li>
                  <li>• Test tunnels in staging environments</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Code Formatting Tools Component */}
          <CodeFormattingToolsClient />

          {/* FAQ Section */}
          <div className="bg-card rounded-lg p-8 border mt-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What programming languages are supported?</h3>
                <p className="text-muted-foreground">
                  We support JavaScript/TypeScript (ESLint), Python (Flake8), Ruby (RuboCop), and CSS/SCSS (Stylelint).
                  Additional languages and linters can be added based on community demand.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Are my code snippets stored securely?</h3>
                <p className="text-muted-foreground">
                  All code processing happens locally in your browser. Snippets are stored in local browser storage
                  and can be exported/imported as JSON files for backup and sharing.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I create custom formatting profiles?</h3>
                <p className="text-muted-foreground">
                  Yes, you can create, save, and share custom Prettier and Black configuration profiles.
                  Profiles include indentation, line length, quote style, and other formatting options.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">How does the dependency scanner work?</h3>
                <p className="text-muted-foreground">
                  The dependency updater analyzes your package.json or requirements.txt files, checks for outdated packages
                  using npm outdated or pip list, and highlights security vulnerabilities from security advisories.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Is tunneling secure for development?</h3>
                <p className="text-muted-foreground">
                  Both ngrok and cloudflared provide secure HTTPS tunnels. We generate commands for secure tunnel creation
                  with authentication and recommend using them only for development and testing purposes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}