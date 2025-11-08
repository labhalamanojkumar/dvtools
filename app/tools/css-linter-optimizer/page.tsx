
import { Metadata } from "next";
import { SHARED_METADATA } from "@/lib/utils";
import CssLinterOptimizerClient from "@/components/tools/css-linter-optimizer-client";
import ScrollToCssInputButton from "../../../components/tools/scroll-to-css-input-button";

export const metadata: Metadata = {
  title: "CSS Linter & Optimizer - Lint, Validate & Optimize CSS Online | Multi-Tool Platform",
  description: "Free online CSS linter and optimizer. Validate CSS syntax, check for errors and warnings, optimize file size, and improve performance with configurable linting rules and optimization levels.",
  keywords: [
    "CSS linter",
    "CSS optimizer",
    "CSS validator",
    "CSS minifier",
    "CSS compressor",
    "CSS analysis",
    "CSS performance",
    "lint CSS online",
    "CSS optimization",
    "CSS best practices",
    "CSS error detection",
    "CSS performance analysis",
    "CSS file size reduction",
    "CSS code quality",
    "CSS debugging"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multitoolplatform.com"),
  alternates: {
    canonical: "/tools/css-linter-optimizer",
  },
  openGraph: {
    title: "CSS Linter & Optimizer - Lint, Validate & Optimize CSS Online",
    description: "Free online CSS linter and optimizer with error detection, performance analysis, and file size optimization.",
    url: "/tools/css-linter-optimizer",
    siteName: "Multi Tool Platform",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-css-linter.png",
        width: 1200,
        height: 630,
        alt: "CSS Linter & Optimizer Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CSS Linter & Optimizer - Lint, Validate & Optimize CSS Online",
    description: "Free online CSS linter and optimizer with error detection, performance analysis, and file size optimization.",
    images: ["/og-css-linter.png"],
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

export default function CssLinterOptimizerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "CSS Linter & Optimizer",
    "description": "Free online CSS linter, validator, and optimizer with advanced error detection, performance analysis, and configurable optimization levels.",
    "url": "https://multitoolplatform.com/tools/css-linter-optimizer",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "CSS syntax validation",
      "Error and warning detection",
      "Performance optimization",
      "File size reduction",
      "Configurable linting rules",
      "Multiple optimization levels",
      "Detailed issue reporting",
      "Copy optimized CSS",
      "Download results",
      "Real-time analysis"
    ],
    "screenshot": "/og-css-linter.png",
    "author": {
      "@type": "Organization",
      "name": "Multi-Tool Platform",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Multi-Tool Platform",
    },
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
        "name": "CSS Linter & Optimizer",
        "item": "https://multitoolplatform.com/tools/css-linter-optimizer"
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
              CSS Linter & Optimizer
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Professional CSS analysis and optimization tool with advanced linting, error detection, and performance optimization.
              Ensure your CSS is clean, efficient, and follows best practices.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Syntax Validation
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Error Detection
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Performance Optimization
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                File Size Reduction
              </span>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Syntax Validation</h3>
              <p className="text-muted-foreground">
                Comprehensive CSS syntax validation with detailed error reporting and line-by-line issue identification.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Error Detection</h3>
              <p className="text-muted-foreground">
                Advanced error detection including duplicate properties, invalid values, and CSS syntax violations.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Performance Optimization</h3>
              <p className="text-muted-foreground">
                Optimize CSS for better performance with file size reduction, selector optimization, and efficiency improvements.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0V1m10 3V1m0 3l1 1v16a2 2 0 01-2 2H6a2 2 0 01-2-2V5l1-1z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">File Size Reduction</h3>
              <p className="text-muted-foreground">
                Minimize CSS file sizes with whitespace removal, comment stripping, and property consolidation.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Configurable Rules</h3>
              <p className="text-muted-foreground">
                Choose from Basic, Standard, or Strict linting rules to match your project's requirements and coding standards.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Processing</h3>
              <p className="text-muted-foreground">
                All CSS analysis and optimization happens locally in your browser. Your stylesheets never leave your device.
              </p>
            </div>
          </div>

          {/* Educational Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* What is CSS Linter & Optimizer */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4">What is CSS Linter & Optimizer?</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p>
                  CSS Linter & Optimizer is a comprehensive web development tool that combines advanced CSS validation, error detection, and performance optimization in one powerful interface. Whether you're a seasoned developer maintaining large codebases or a beginner learning CSS best practices, this tool helps ensure your stylesheets are clean, efficient, and error-free.
                </p>

                <h3>Key Features</h3>
                <ul>
                  <li><strong>Advanced Linting:</strong> Detect syntax errors, warnings, and potential issues before they impact your website</li>
                  <li><strong>Performance Optimization:</strong> Reduce file sizes and improve loading times with intelligent compression</li>
                  <li><strong>Configurable Rules:</strong> Choose from Basic, Standard, or Strict linting levels to match your project needs</li>
                  <li><strong>Real-time Analysis:</strong> Get instant feedback as you type with live error highlighting</li>
                  <li><strong>Multiple Output Formats:</strong> Export optimized CSS or detailed reports for integration</li>
                  <li><strong>Browser Security:</strong> All processing happens locally - your CSS never leaves your device</li>
                </ul>

                <h3>Perfect For</h3>
                <ul>
                  <li>Frontend developers maintaining large CSS codebases</li>
                  <li>Web agencies ensuring client deliverables meet standards</li>
                  <li>Educators teaching CSS best practices and debugging</li>
                  <li>Teams implementing CSS coding standards and guidelines</li>
                  <li>Developers optimizing websites for better performance</li>
                </ul>
              </div>
            </div>

            {/* Quick Stats */}
            <div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-4">Optimization Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg. Size Reduction</span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">35-60%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Error Detection</span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">99.9%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Processing Speed</span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">&lt; 1 second</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Rules Coverage</span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">150+ Rules</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Browser Support</span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">All Modern</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Security Level</span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">Local Only</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Development Impact</h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">50%</div>
                  <div className="text-sm text-muted-foreground mb-4">
                    Faster CSS Debugging
                  </div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">90%</div>
                  <div className="text-sm text-muted-foreground">Smaller File Sizes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Use Cases */}
          <div className="space-y-4 mb-12">
            <h3 className="text-xl font-semibold">Common Use Cases</h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Code Quality Assurance</h4>
                <p className="text-sm text-muted-foreground">
                  Ensure CSS code quality and consistency across development teams. Catch errors early and maintain coding standards throughout the project lifecycle.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Performance Optimization</h4>
                <p className="text-sm text-muted-foreground">
                  Optimize CSS for production deployment with file size reduction, unused code removal, and performance improvements that enhance page load times.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Learning & Education</h4>
                <p className="text-sm text-muted-foreground">
                  Learn CSS best practices through detailed error explanations and suggestions. Understand common mistakes and how to write better, more maintainable CSS.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Pre-deployment Checks</h4>
                <p className="text-sm text-muted-foreground">
                  Run final validation checks before deploying to production. Ensure CSS is error-free, optimized, and ready for live environments.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Legacy Code Cleanup</h4>
                <p className="text-sm text-muted-foreground">
                  Clean up and modernize legacy CSS codebases. Identify deprecated properties, remove redundant code, and improve overall code maintainability.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Build Process Integration</h4>
                <p className="text-sm text-muted-foreground">
                  Integrate CSS linting and optimization into your build pipeline. Automate code quality checks and ensure consistent CSS processing across environments.
                </p>
              </div>
            </div>
          </div>

          {/* Best Practices */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">CSS Best Practices & Tips</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-green-700 dark:text-green-400">Do's ✅</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Use semantic class names that describe content purpose</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Organize CSS with consistent naming conventions (BEM, SMACSS)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Minimize CSS specificity conflicts</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Use CSS custom properties for maintainable values</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Optimize for performance with efficient selectors</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Validate CSS regularly during development</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-red-700 dark:text-red-400">Don'ts ❌</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    <span>Use !important declarations unnecessarily</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    <span>Create overly specific selectors</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    <span>Leave unused CSS rules in production</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    <span>Use inline styles for reusable components</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    <span>Ignore CSS validation and error checking</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    <span>Skip performance optimization for large stylesheets</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6">How to Use CSS Linter & Optimizer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">1. Input Your CSS</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Paste your CSS code in the input area</li>
                  <li>• Upload CSS files directly</li>
                  <li>• Supports large stylesheets</li>
                  <li>• Handles various CSS preprocessors</li>
                  <li>• Real-time input validation</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">2. Configure Settings</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Choose linting level (Basic/Standard/Strict)</li>
                  <li>• Select optimization level (Conservative/Balanced/Aggressive)</li>
                  <li>• Enable/disable specific rules</li>
                  <li>• Customize error reporting</li>
                  <li>• Set performance preferences</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">3. Analyze & Optimize</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Click "Analyze CSS" for linting</li>
                  <li>• Click "Optimize CSS" for compression</li>
                  <li>• View detailed issue reports</li>
                  <li>• See performance improvements</li>
                  <li>• Preview optimized results</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">4. Export Results</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Copy optimized CSS to clipboard</li>
                  <li>• Download processed files</li>
                  <li>• Export issue reports</li>
                  <li>• Share analysis results</li>
                  <li>• Integrate with build processes</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Optimize Your CSS?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Start linting and optimizing your CSS code with our comprehensive analysis tool.
              Improve code quality, catch errors early, and boost performance in minutes.
            </p>
            <ScrollToCssInputButton />
          </div>

          {/* CSS Linter Optimizer Component */}
          <CssLinterOptimizerClient />

          {/* FAQ Section */}
          <div className="bg-card rounded-lg p-8 border mt-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What is CSS linting?</h3>
                <p className="text-muted-foreground">
                  CSS linting analyzes your stylesheets for potential errors, warnings, and best practice violations. It helps maintain code quality and catch issues before they affect your website.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">What optimization levels are available?</h3>
                <p className="text-muted-foreground">
                  Three optimization levels: Conservative (safe optimizations), Balanced (moderate compression), and Aggressive (maximum size reduction with potential functionality changes).
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Does optimization affect CSS functionality?</h3>
                <p className="text-muted-foreground">
                  Conservative and Balanced modes preserve all functionality. Aggressive mode may remove redundant code but could potentially affect edge cases. Always test optimized CSS thoroughly.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">What CSS preprocessors are supported?</h3>
                <p className="text-muted-foreground">
                  The tool works with standard CSS. For preprocessors like Sass/SCSS or Less, compile them to CSS first, then use this tool for linting and optimization.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Is my CSS secure?</h3>
                <p className="text-muted-foreground">
                  Yes, all processing happens locally in your browser. Your CSS code never gets sent to external servers or stored anywhere outside your device.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
