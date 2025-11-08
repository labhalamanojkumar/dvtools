import { Metadata } from "next";
import LinterRunnerClient from "@/components/tools/linter-runner-client";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Linter Runner - Multi-language Code Linting Tool | Multi-Tool Platform",
  description: "Professional multi-language linter runner with ESLint, Flake8, RuboCop, and Stylelint. Automatic code fixes, error detection, and inline suggestions for JavaScript, Python, Ruby, and CSS.",
  keywords: [
    "linter",
    "ESLint",
    "Flake8",
    "RuboCop",
    "Stylelint",
    "code linting",
    "JavaScript linter",
    "Python linter",
    "Ruby linter",
    "CSS linter",
    "code quality",
    "automatic fixes",
    "code analysis",
    "error detection",
    "code suggestions",
    "static analysis",
    "code standards",
    "linting rules",
    "code formatting",
    "developer tools"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multi-tool-platform.com"),
  alternates: {
    canonical: "/tools/linter-runner",
  },
  openGraph: {
    title: "Linter Runner - Multi-language Code Linting Tool",
    description: "Professional multi-language linter with ESLint, Flake8, RuboCop, Stylelint. Automatic fixes and error detection for JavaScript, Python, Ruby, CSS.",
    url: "/tools/linter-runner",
    siteName: "Multi Tool Platform",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-linter-runner.png",
        width: 1200,
        height: 630,
        alt: "Linter Runner Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Linter Runner - Multi-language Code Linting Tool",
    description: "Professional multi-language linter with ESLint, Flake8, RuboCop, Stylelint. Automatic fixes for JavaScript, Python, Ruby, CSS.",
    images: ["/og-linter-runner.png"],
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

export default function LinterRunnerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Linter Runner",
    "description": "Multi-language code linting tool with ESLint, Flake8, RuboCop, and Stylelint support. Automatic code fixes and error detection for JavaScript, Python, Ruby, and CSS.",
    "url": "https://multi-tool-platform.com/tools/linter-runner",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "ESLint for JavaScript/TypeScript with automatic fixes",
      "Flake8 for Python with PEP 8 compliance",
      "RuboCop for Ruby with Rails best practices",
      "Stylelint for CSS/SCSS with modern standards",
      "Real-time code analysis and error detection",
      "Automatic code formatting and fixes",
      "Inline suggestions and rule explanations",
      "Multi-language support with unified interface",
      "Customizable linting rules and configurations",
      "Export cleaned and formatted code"
    ],
    "screenshot": "/og-linter-runner.png",
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
              Linter Runner
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Professional multi-language code linting tool with automatic fixes. Support for ESLint, Flake8, RuboCop, and Stylelint
              with real-time error detection and inline suggestions.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                ESLint
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Flake8
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                RuboCop
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Stylelint
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                Auto Fix
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
                Comprehensive linting support for JavaScript/TypeScript, Python, Ruby, and CSS/SCSS with language-specific rules and best practices.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Automatic Fixes</h3>
              <p className="text-muted-foreground">
                Apply automatic fixes for common linting issues. One-click code formatting and error correction with preview of changes.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-time Analysis</h3>
              <p className="text-muted-foreground">
                Instant code analysis with real-time error detection, warnings, and suggestions as you type. No waiting for results.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Rule Explanations</h3>
              <p className="text-muted-foreground">
                Detailed explanations for each linting rule violation with links to documentation and examples of correct usage.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Export Results</h3>
              <p className="text-muted-foreground">
                Export linting results, fixed code, and reports in multiple formats. Share findings with your development team.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Customizable Rules</h3>
              <p className="text-muted-foreground">
                Configure linting rules and severity levels. Create custom rule sets tailored to your project's coding standards.
              </p>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6">How to Use Linter Runner</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">1. Select Language & Linter</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Choose your programming language</li>
                  <li>• Select appropriate linter (ESLint, Flake8, etc.)</li>
                  <li>• Configure rule severity if needed</li>
                  <li>• Enable auto-fix options</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">2. Input Your Code</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Paste or type your code in the editor</li>
                  <li>• Upload code files for batch processing</li>
                  <li>• Support for multiple file formats</li>
                  <li>• Real-time syntax highlighting</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">3. Run Linting</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Click "Run Linter" to analyze code</li>
                  <li>• View errors, warnings, and suggestions</li>
                  <li>• Apply automatic fixes where available</li>
                  <li>• Review rule explanations</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">4. Export Results</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Copy fixed code to clipboard</li>
                  <li>• Download formatted code files</li>
                  <li>• Export linting reports</li>
                  <li>• Share results with team members</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Linter Runner Component */}
          <LinterRunnerClient />

          {/* FAQ Section */}
          <div className="bg-card rounded-lg p-8 border mt-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What programming languages are supported?</h3>
                <p className="text-muted-foreground">
                  Linter Runner supports JavaScript/TypeScript (ESLint), Python (Flake8), Ruby (RuboCop), and CSS/SCSS (Stylelint).
                  Each language has its own specialized linting rules and best practices.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Are the linting results accurate?</h3>
                <p className="text-muted-foreground">
                  Yes, Linter Runner uses the official linting tools for each language. Results are identical to running the linters
                  locally on your development environment.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I customize the linting rules?</h3>
                <p className="text-muted-foreground">
                  Yes, you can configure rule severity levels and disable specific rules. The tool supports standard configuration
                  formats for each linter (eslint.config.js, .flake8, .rubocop.yml, .stylelintrc).
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
                <h3 className="text-lg font-semibold mb-2">What types of issues can be automatically fixed?</h3>
                <p className="text-muted-foreground">
                  Many common issues can be auto-fixed, including formatting problems, unused imports, missing semicolons, indentation issues,
                  and other style violations. Complex logic errors require manual review and fixing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
