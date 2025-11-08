import { Metadata } from "next";
import AccessibilityScannerClient from "@/components/tools/accessibility-scanner-client";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Accessibility Scanner - WCAG Compliance Checker Online | Multi-Tool Platform",
  description: "Free online accessibility scanner for WCAG compliance. Check web accessibility issues, A/AA/AAA compliance, and improve inclusive design for all users. Automated testing with detailed reports.",
  keywords: [
    "accessibility scanner",
    "WCAG checker",
    "web accessibility",
    "a11y testing",
    "accessibility audit",
    "WCAG compliance",
    "accessibility validator",
    "web accessibility checker",
    "ADA compliance",
    "inclusive design",
    "accessibility testing",
    "WCAG guidelines",
    "accessibility audit tool"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multitoolplatform.com"),
  alternates: {
    canonical: "/tools/accessibility-scanner",
  },
  openGraph: {
    title: "Accessibility Scanner - WCAG Compliance Checker Online",
    description: "Automated accessibility testing for WCAG A, AA, and AAA compliance. Ensure your website is accessible to all users.",
    url: "/tools/accessibility-scanner",
    siteName: "Multi Tool Platform",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-accessibility-scanner.png",
        width: 1200,
        height: 630,
        alt: "Accessibility Scanner Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Accessibility Scanner - WCAG Compliance Checker Online",
    description: "Automated accessibility testing for WCAG A, AA, and AAA compliance. Ensure your website is accessible to all users.",
    images: ["/og-accessibility-scanner.png"],
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

export default function AccessibilityScannerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Accessibility Scanner",
    "description": "Comprehensive online accessibility scanner for WCAG compliance testing. Automated web accessibility auditing tool that checks for A, AA, and AAA compliance levels with detailed reports and remediation guidance.",
    "url": "https://multitoolplatform.com/tools/accessibility-scanner",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "Automated WCAG compliance checking for A, AA, and AAA levels",
      "Comprehensive accessibility issue detection and reporting",
      "Real-time scanning with instant results",
      "Detailed remediation guidance and fix suggestions",
      "Multiple testing methods including automated and manual checks",
      "Export accessibility reports in multiple formats",
      "Integration with development workflows",
      "Continuous monitoring capabilities",
      "Color contrast analysis and validation",
      "Keyboard navigation testing and validation"
    ],
    "screenshot": "/og-accessibility-scanner.png",
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
        "name": "Accessibility Scanner",
        "item": "https://multitoolplatform.com/tools/accessibility-scanner"
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
              Accessibility Scanner
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Comprehensive WCAG compliance checker for web accessibility. Scan websites for accessibility issues, ensure A/AA/AAA compliance,
              and create inclusive digital experiences for all users with detailed remediation guidance.
            </p>

            {/* Key Features */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
              <div className="bg-card p-4 rounded-lg border">
                <div className="text-2xl mb-2">♿</div>
                <h3 className="font-semibold mb-1">WCAG Compliance</h3>
                <p className="text-sm text-muted-foreground">
                  Test against A, AA, and AAA compliance levels
                </p>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <div className="text-2xl mb-2">🔍</div>
                <h3 className="font-semibold mb-1">Automated Scanning</h3>
                <p className="text-sm text-muted-foreground">
                  Fast automated detection of accessibility issues
                </p>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <div className="text-2xl mb-2">📋</div>
                <h3 className="font-semibold mb-1">Detailed Reports</h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive reports with severity levels
                </p>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <div className="text-2xl mb-2">🛠️</div>
                <h3 className="font-semibold mb-1">Fix Guidance</h3>
                <p className="text-sm text-muted-foreground">
                  Actionable remediation suggestions
                </p>
              </div>
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
              <h3 className="text-lg font-semibold mb-2">WCAG Compliance</h3>
              <p className="text-muted-foreground">
                Comprehensive testing against WCAG 2.1 guidelines for A, AA, and AAA compliance levels. Ensure legal compliance and accessibility standards.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Automated Scanning</h3>
              <p className="text-muted-foreground">
                Fast automated scanning detects hundreds of accessibility issues including missing alt text, poor contrast, and navigation problems.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0V1m10 3V1m0 3l1 1v16a2 2 0 01-2 2H6a2 2 0 01-2-2V5l1-1z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Detailed Reports</h3>
              <p className="text-muted-foreground">
                Generate comprehensive accessibility reports with severity levels, issue descriptions, and specific code locations for easy remediation.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Remediation Guidance</h3>
              <p className="text-muted-foreground">
                Get actionable fix suggestions with code examples and best practices to resolve accessibility issues quickly and effectively.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Multiple Testing Methods</h3>
              <p className="text-muted-foreground">
                Combine automated testing with manual review capabilities, screen reader simulation, and keyboard navigation testing.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Continuous Monitoring</h3>
              <p className="text-muted-foreground">
                Set up ongoing accessibility monitoring to catch new issues as they arise and maintain compliance over time.
              </p>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6">How to Use Accessibility Scanner</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">1. Enter Website URL</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Enter the URL of the website to scan</li>
                  <li>• Support for HTTP and HTTPS websites</li>
                  <li>• Scan single pages or entire domains</li>
                  <li>• Include or exclude specific paths</li>
                  <li>• Set custom user agents for testing</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">2. Configure Scan Settings</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Choose WCAG compliance level (A, AA, AAA)</li>
                  <li>• Select specific guidelines to test</li>
                  <li>• Set crawl depth and page limits</li>
                  <li>• Configure custom rules and standards</li>
                  <li>• Enable advanced testing options</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">3. Run Accessibility Scan</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Start automated scanning process</li>
                  <li>• Monitor real-time progress updates</li>
                  <li>• View issues as they are detected</li>
                  <li>• Pause and resume scans as needed</li>
                  <li>• Cancel scans if necessary</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">4. Review Results & Fix</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Analyze detailed accessibility reports</li>
                  <li>• Review issues by severity and category</li>
                  <li>• Get specific remediation guidance</li>
                  <li>• Export reports in multiple formats</li>
                  <li>• Track progress and improvements</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Accessibility Scanner Component */}
          <AccessibilityScannerClient />

          {/* Documentation Section */}
          <div className="mt-16 space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">How to Use</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Follow these steps to effectively scan websites for accessibility compliance
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Getting Started */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">1. Enter Website URL</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Enter the URL of the website to scan</p>
                    <p>• Support for HTTP and HTTPS websites</p>
                    <p>• Scan single pages or entire domains</p>
                    <p>• Include or exclude specific paths</p>
                    <p>• Set custom user agents for testing</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">2. Configure Scan Settings</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Choose WCAG compliance level (A, AA, AAA)</p>
                    <p>• Select specific guidelines to test</p>
                    <p>• Set crawl depth and page limits</p>
                    <p>• Configure custom rules and standards</p>
                    <p>• Enable advanced testing options</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">3. Run Accessibility Scan</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Start automated scanning process</p>
                    <p>• Monitor real-time progress updates</p>
                    <p>• View issues as they are detected</p>
                    <p>• Pause and resume scans as needed</p>
                    <p>• Cancel scans if necessary</p>
                  </div>
                </div>
              </div>

              {/* Advanced Features */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">4. Review Results & Fix</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Analyze detailed accessibility reports</p>
                    <p>• Review issues by severity and category</p>
                    <p>• Get specific remediation guidance</p>
                    <p>• Export reports in multiple formats</p>
                    <p>• Track progress and improvements</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">5. Continuous Monitoring</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Set up ongoing accessibility monitoring</p>
                    <p>• Schedule regular compliance checks</p>
                    <p>• Receive alerts for new issues</p>
                    <p>• Track accessibility improvements over time</p>
                    <p>• Generate compliance reports</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">6. Integration & Automation</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Integrate with CI/CD pipelines</p>
                    <p>• Use API for automated testing</p>
                    <p>• Export results to project management tools</p>
                    <p>• Share reports with development teams</p>
                    <p>• Automate accessibility testing workflows</p>
                  </div>
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-center">How It Works</h3>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🌐</span>
                  </div>
                  <h4 className="font-semibold mb-2">1. Website Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    Crawl and analyze website structure, content,
                    and interactive elements for accessibility issues.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <h4 className="font-semibold mb-2">2. Automated Testing</h4>
                  <p className="text-sm text-muted-foreground">
                    Run comprehensive tests against WCAG guidelines
                    using advanced algorithms and rule-based checking.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h4 className="font-semibold mb-2">3. Generate Reports</h4>
                  <p className="text-sm text-muted-foreground">
                    Create detailed reports with issue severity,
                    remediation guidance, and compliance scores.
                  </p>
                </div>
              </div>
            </div>

            {/* Use Cases */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Common Use Cases</h3>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Legal Compliance</h4>
                  <p className="text-sm text-muted-foreground">
                    Ensure websites meet legal accessibility requirements like ADA, Section 508, and WCAG compliance standards.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Development Teams</h4>
                  <p className="text-sm text-muted-foreground">
                    Integrate accessibility testing into development workflows to catch issues early in the development process.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Quality Assurance</h4>
                  <p className="text-sm text-muted-foreground">
                    Include accessibility testing in QA processes to ensure comprehensive coverage of user experience requirements.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Content Management</h4>
                  <p className="text-sm text-muted-foreground">
                    Test content management systems and user-generated content for accessibility issues and compliance.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">E-commerce Sites</h4>
                  <p className="text-sm text-muted-foreground">
                    Ensure online stores are accessible to all customers, including those using assistive technologies.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Government Websites</h4>
                  <p className="text-sm text-muted-foreground">
                    Meet strict accessibility requirements for government and public sector websites and applications.
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
                    Accessibility Testing Best Practices
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
                    <div>
                      <strong>Test Early & Often:</strong> Include accessibility testing from the beginning of development and test regularly throughout the process.
                    </div>
                    <div>
                      <strong>Combine Methods:</strong> Use automated testing alongside manual testing and user testing with people with disabilities.
                    </div>
                    <div>
                      <strong>Focus on Impact:</strong> Prioritize fixing issues that have the greatest impact on users, especially those that completely block access.
                    </div>
                    <div>
                      <strong>Stay Current:</strong> Keep up with evolving accessibility standards and guidelines as they are regularly updated.
                    </div>
                    <div>
                      <strong>Educate Teams:</strong> Train development and design teams on accessibility principles and best practices.
                    </div>
                    <div>
                      <strong>Monitor Continuously:</strong> Set up ongoing monitoring to catch new accessibility issues as they arise.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Educational Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* About Web Accessibility */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4">About Web Accessibility</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p>
                  Web accessibility ensures that websites and web applications are usable by people with disabilities.
                  This includes visual, motor, auditory, speech, cognitive, and neurological disabilities. Following WCAG guidelines
                  helps create inclusive digital experiences for all users.
                </p>

                <h3>WCAG Compliance Levels</h3>
                <p>
                  The Web Content Accessibility Guidelines (WCAG) define three levels of compliance:
                </p>
                <ul>
                  <li><strong>Level A:</strong> Basic accessibility requirements that must be met</li>
                  <li><strong>Level AA:</strong> Most common accessibility requirements for most websites</li>
                  <li><strong>Level AAA:</strong> Highest level of accessibility, may not be possible in all cases</li>
                </ul>
              </div>
            </div>

            {/* POUR Principles */}
            <div>
              <h3 className="text-lg font-semibold mb-4">POUR Principles</h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Perceivable</h4>
                  <p className="text-sm text-muted-foreground">
                    Information must be presentable in different ways
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Operable</h4>
                  <p className="text-sm text-muted-foreground">
                    Interface elements must be operable by all users
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950 dark:to-violet-900 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Understandable</h4>
                  <p className="text-sm text-muted-foreground">
                    Information and operation must be understandable
                  </p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-950 dark:to-amber-900 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Robust</h4>
                  <p className="text-sm text-muted-foreground">
                    Content must work with current and future technologies
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Common Issues */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Common Accessibility Issues</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Content Issues</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Missing alternative text for images</li>
                  <li>• Poor color contrast ratios</li>
                  <li>• Missing form labels and descriptions</li>
                  <li>• Uninformative page titles and headings</li>
                  <li>• Missing language identification</li>
                  <li>• Inaccessible multimedia content</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Navigation Issues</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Keyboard navigation problems</li>
                  <li>• Missing focus indicators</li>
                  <li>• Improper heading hierarchy</li>
                  <li>• Inconsistent navigation patterns</li>
                  <li>• Missing skip links</li>
                  <li>• Time limits without controls</li>
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-card rounded-lg p-8 border mt-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What is WCAG compliance?</h3>
                <p className="text-muted-foreground">
                  WCAG (Web Content Accessibility Guidelines) are international standards for web accessibility. They define how to make web content more accessible to people with disabilities, organized into three compliance levels: A, AA, and AAA.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Why is web accessibility important?</h3>
                <p className="text-muted-foreground">
                  Web accessibility ensures that websites are usable by everyone, including people with disabilities. It's also legally required in many countries, improves SEO, and provides better user experience for all users including mobile and elderly users.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">What accessibility issues can be detected automatically?</h3>
                <p className="text-muted-foreground">
                  Automated tools can detect many issues like missing alt text, poor color contrast, missing form labels, improper heading structure, and keyboard navigation problems. However, some issues require manual testing and human judgment.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">How often should I test for accessibility?</h3>
                <p className="text-muted-foreground">
                  Accessibility testing should be part of your regular development process. Test whenever you make significant changes to your website, and consider setting up continuous monitoring for ongoing compliance.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Is Level AA compliance enough?</h3>
                <p className="text-muted-foreground">
                  Level AA is the most common target for websites and meets legal requirements in most jurisdictions. Level AAA provides enhanced accessibility but may not be achievable for all content types or have business justification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
