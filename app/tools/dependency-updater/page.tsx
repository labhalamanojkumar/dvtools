import { Metadata } from "next";
import DependencyUpdaterClient from "@/components/tools/dependency-updater-client";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dependency Updater - NPM Package Manager | Multi-Tool Platform",
  description: "Professional dependency management tool for JavaScript/TypeScript projects. Scan for outdated packages, check security vulnerabilities, and update dependencies safely with automated testing.",
  keywords: [
    "dependency updater",
    "npm update",
    "package manager",
    "security vulnerabilities",
    "outdated packages",
    "JavaScript dependencies",
    "TypeScript dependencies",
    "package.json",
    "npm audit",
    "dependency management",
    "security scanning",
    "package updates",
    "vulnerability checker",
    "dependency analyzer",
    "npm packages",
    "yarn packages",
    "pnpm packages",
    "dependency security",
    "package maintenance",
    "dependency health"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multi-tool-platform.com"),
  alternates: {
    canonical: "/tools/dependency-updater",
  },
  openGraph: {
    title: "Dependency Updater - NPM Package Manager",
    description: "Scan and update JavaScript/TypeScript dependencies with security vulnerability checks and automated testing.",
    url: "/tools/dependency-updater",
    siteName: "Multi Tool Platform",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-dependency-updater.png",
        width: 1200,
        height: 630,
        alt: "Dependency Updater Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dependency Updater - NPM Package Manager",
    description: "Professional dependency management tool for JavaScript/TypeScript projects with security scanning.",
    images: ["/og-dependency-updater.png"],
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

export default function DependencyUpdaterPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Dependency Updater",
    "description": "Professional dependency management tool for JavaScript/TypeScript projects. Scan for outdated packages, check security vulnerabilities, and update dependencies safely with automated testing.",
    "url": "https://multi-tool-platform.com/tools/dependency-updater",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "Scan project dependencies for outdated packages",
      "Check for security vulnerabilities in dependencies",
      "Automated dependency updates with version conflict resolution",
      "Generate dependency update reports and changelogs",
      "Support for npm, yarn, and pnpm package managers",
      "Integration with CI/CD pipelines for automated updates",
      "Dependency health scoring and recommendations",
      "Backup and rollback capabilities for failed updates",
      "Custom update rules and version constraints",
      "Team collaboration features for dependency management"
    ],
    "screenshot": "/og-dependency-updater.png",
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
              Dependency Updater
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Professional dependency management tool for JavaScript/TypeScript projects. Scan for outdated packages,
              check security vulnerabilities, and update dependencies safely with automated testing.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                NPM
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Security Scan
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Auto Update
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                Vulnerability Check
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                CI/CD Ready
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
              <h3 className="text-lg font-semibold mb-2">Security Scanning</h3>
              <p className="text-muted-foreground">
                Comprehensive security vulnerability scanning using npm audit and Snyk database.
                Get detailed reports on known security issues in your dependencies.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Automated Updates</h3>
              <p className="text-muted-foreground">
                Automatically update dependencies to their latest compatible versions.
                Handle version conflicts and breaking changes with intelligent resolution.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Dependency Analysis</h3>
              <p className="text-muted-foreground">
                Deep analysis of your dependency tree including transitive dependencies.
                Identify unused packages, circular dependencies, and optimization opportunities.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Update Reports</h3>
              <p className="text-muted-foreground">
                Generate comprehensive reports of dependency updates including changelogs,
                breaking changes, and migration guides for updated packages.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">CI/CD Integration</h3>
              <p className="text-muted-foreground">
                Integrate with your CI/CD pipelines for automated dependency updates.
                Set up scheduled checks and automated pull requests for dependency updates.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Backup & Rollback</h3>
              <p className="text-muted-foreground">
                Automatic backup of package-lock.json and yarn.lock files before updates.
                Easy rollback capabilities if updates cause issues in your application.
              </p>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6">How to Use Dependency Updater</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">1. Scan Dependencies</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Upload or paste your package.json file</li>
                  <li>• Choose your package manager (npm/yarn/pnpm)</li>
                  <li>• Run comprehensive dependency scan</li>
                  <li>• Review security vulnerabilities found</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">2. Update Dependencies</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Select packages to update</li>
                  <li>• Choose update strategy (patch/minor/major)</li>
                  <li>• Run automated update process</li>
                  <li>• Test compatibility automatically</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">3. Review & Apply</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Review update changelog and breaking changes</li>
                  <li>• Generate migration guide</li>
                  <li>• Apply updates to your project</li>
                  <li>• Backup and rollback options</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">4. Monitor & Maintain</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Set up automated monitoring</li>
                  <li>• Schedule regular dependency checks</li>
                  <li>• Receive security alerts</li>
                  <li>• Track dependency health over time</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Dependency Updater Component */}
          <DependencyUpdaterClient />

          {/* FAQ Section */}
          <div className="bg-card rounded-lg p-8 border mt-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What package managers are supported?</h3>
                <p className="text-muted-foreground">
                  Dependency Updater supports npm, yarn, and pnpm package managers. It can analyze package.json files
                  and generate appropriate commands for each package manager.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">How does security scanning work?</h3>
                <p className="text-muted-foreground">
                  Security scanning uses multiple sources including npm audit, Snyk vulnerability database, and GitHub Security Advisories
                  to identify known security vulnerabilities in your dependencies.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I rollback failed updates?</h3>
                <p className="text-muted-foreground">
                  Yes, the tool automatically creates backups of your lock files before making changes. If an update causes issues,
                  you can easily rollback to the previous state with one click.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Does it handle breaking changes?</h3>
                <p className="text-muted-foreground">
                  The tool analyzes changelogs and breaking changes for each update. It provides detailed migration guides
                  and can help identify potential breaking changes before applying updates.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Can it be integrated with CI/CD?</h3>
                <p className="text-muted-foreground">
                  Absolutely! The tool provides API endpoints and CLI commands that can be integrated into your CI/CD pipelines
                  for automated dependency updates and security monitoring.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}