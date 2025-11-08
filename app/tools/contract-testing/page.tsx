import { Metadata } from "next";
import ContractTestingClient from "@/components/tools/contract-testing-client";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contract Testing Runner - Pact-Style Testing Tool | Multi-Tool Platform",
  description: "Run consumer-driven contract tests with Pact-style validation. Upload contract files, test consumer-provider interactions, and explore detailed test results with comprehensive reporting.",
  keywords: [
    "contract testing",
    "Pact testing",
    "consumer-driven contracts",
    "API contract testing",
    "microservices testing",
    "contract validation",
    "API testing",
    "integration testing",
    "consumer testing",
    "provider testing",
    "contract verification",
    "API compatibility"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multi-tool-platform.com"),
  alternates: {
    canonical: "/tools/contract-testing",
  },
  openGraph: {
    title: "Contract Testing Runner - Pact-Style Testing Tool",
    description: "Run consumer-driven contract tests with Pact-style validation. Test API contracts and verify compatibility.",
    url: "/tools/contract-testing",
    siteName: "Multi-Tool Platform",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-contract-testing.png",
        width: 1200,
        height: 630,
        alt: "Contract Testing Runner Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contract Testing Runner - Pact-Style Testing Tool",
    description: "Run consumer-driven contract tests with Pact-style validation.",
    images: ["/og-contract-testing.png"],
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
  category: "testing tools",
};

export default function ContractTestingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Contract Testing Runner",
    "description": "Professional contract testing tool for consumer-driven contracts with Pact-style validation, comprehensive test execution, and detailed result reporting.",
    "url": "https://multi-tool-platform.com/tools/contract-testing",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "Pact-style contract testing",
      "Consumer-provider validation",
      "Contract file upload",
      "Automated test execution",
      "Detailed result explorer",
      "API compatibility checking",
      "Test history tracking",
      "Comprehensive reporting"
    ],
    "screenshot": "/og-contract-testing.png",
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
              Contract Testing Runner
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Run consumer-driven contract tests with Pact-style validation. Ensure API compatibility
              between consumers and providers with automated testing and comprehensive result analysis.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Pact-Style
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Consumer-Driven
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Automated Testing
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                Result Explorer
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
              <h3 className="text-lg font-semibold mb-2">Contract Upload</h3>
              <p className="text-muted-foreground">
                Upload Pact contract files in JSON format. Supports consumer and provider contract definitions.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Automated Validation</h3>
              <p className="text-muted-foreground">
                Automatically validate consumer expectations against provider responses with detailed comparisons.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Fast Execution</h3>
              <p className="text-muted-foreground">
                Run contract tests quickly with parallel execution and optimized validation algorithms.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Result Explorer</h3>
              <p className="text-muted-foreground">
                Explore test results with detailed breakdowns, failure reasons, and suggested fixes.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Test History</h3>
              <p className="text-muted-foreground">
                Track contract test history with timestamps, versions, and trend analysis over time.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">CI/CD Integration</h3>
              <p className="text-muted-foreground">
                Export test results in standard formats for easy integration with CI/CD pipelines.
              </p>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6">How to Use Contract Testing Runner</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">1. Upload Contract File</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Upload Pact contract JSON file</li>
                  <li>• Define consumer and provider details</li>
                  <li>• Specify API interactions and expectations</li>
                  <li>• Set request/response matching rules</li>
                  <li>• Configure validation settings</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">2. Configure Test</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Set provider endpoint URL</li>
                  <li>• Configure authentication if needed</li>
                  <li>• Add custom headers or parameters</li>
                  <li>• Set timeout and retry options</li>
                  <li>• Enable detailed logging</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">3. Execute Tests</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Run contract validation tests</li>
                  <li>• Monitor test execution progress</li>
                  <li>• View real-time test results</li>
                  <li>• Identify failing interactions</li>
                  <li>• Analyze response mismatches</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">4. Review Results</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Explore detailed test reports</li>
                  <li>• View expected vs actual responses</li>
                  <li>• Identify breaking changes</li>
                  <li>• Export results for documentation</li>
                  <li>• Track test trends over time</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contract Testing Component */}
          <ContractTestingClient />

          {/* FAQ Section */}
          <div className="bg-card rounded-lg p-8 border mt-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What is contract testing?</h3>
                <p className="text-muted-foreground">
                  Contract testing verifies that APIs meet the expectations defined in consumer-provider contracts. It ensures that services can communicate correctly without breaking changes.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">What is Pact-style testing?</h3>
                <p className="text-muted-foreground">
                  Pact is a popular contract testing framework. Pact-style testing means consumer-driven contracts where consumers define their expectations and providers verify they meet them.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Do I need to install anything?</h3>
                <p className="text-muted-foreground">
                  No installation required! Upload your contract files and run tests directly in the browser. Results are available instantly with detailed analysis.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I test private APIs?</h3>
                <p className="text-muted-foreground">
                  Yes, you can test any API accessible from your browser. For internal APIs, ensure they're reachable from your network or use appropriate authentication.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
