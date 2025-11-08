import { Metadata } from "next";
import CspSecurityHeadersTesterClient from "../../../components/tools/csp-security-headers-tester-client";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "CSP & Security Headers Tester - Security Tool | Multi-Tool Platform",
  description: "Test Content Security Policy (CSP) and security headers implementation. Analyze HTTP security headers, CSP directives, and provide hardening recommendations.",
  keywords: [
    "CSP tester",
    "security headers",
    "content security policy",
    "HTTP headers",
    "security audit",
    "web security",
    "XSS protection",
    "CSRF protection",
    "security hardening",
    "header analysis"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multi-tool-platform.com"),
  alternates: {
    canonical: "/tools/csp-security-headers-tester",
  },
  openGraph: {
    title: "CSP & Security Headers Tester - Security Tool",
    description: "Test Content Security Policy and security headers implementation with detailed analysis and recommendations.",
    url: "/tools/csp-security-headers-tester",
    siteName: "Multi-Tool Platform",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-csp-security-headers-tester.png",
        width: 1200,
        height: 630,
        alt: "CSP & Security Headers Tester Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CSP & Security Headers Tester - Security Tool",
    description: "Test Content Security Policy and security headers implementation.",
    images: ["/og-csp-security-headers-tester.png"],
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
  category: "security tools",
};

export default function CspSecurityHeadersTesterPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "CSP & Security Headers Tester",
    "description": "Advanced security tool for testing Content Security Policy implementation and analyzing HTTP security headers with hardening recommendations.",
    "url": "https://multi-tool-platform.com/tools/csp-security-headers-tester",
    "applicationCategory": "SecuritySoftware",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "Content Security Policy analysis",
      "HTTP security headers testing",
      "CSP directive validation",
      "Security hardening recommendations",
      "XSS protection assessment",
      "CSRF protection evaluation",
      "Mixed content detection",
      "Security score calculation",
      "Implementation guidance",
      "Compliance checking"
    ],
    "screenshot": "/og-csp-security-headers-tester.png",
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
              CSP & Security Headers Tester
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Comprehensive analysis of Content Security Policy (CSP) and HTTP security headers.
              Test your website's security posture and get actionable recommendations for hardening.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                CSP Analysis
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                Header Testing
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Security Audit
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Hardening Guide
              </span>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">CSP Validation</h3>
              <p className="text-muted-foreground">
                Analyze Content Security Policy directives for syntax errors, security gaps, and best practice compliance.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Security Headers</h3>
              <p className="text-muted-foreground">
                Test essential security headers including HSTS, X-Frame-Options, X-Content-Type-Options, and more.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">XSS Protection</h3>
              <p className="text-muted-foreground">
                Evaluate cross-site scripting protection measures and CSP rules effectiveness against XSS attacks.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">CSRF Prevention</h3>
              <p className="text-muted-foreground">
                Assess cross-site request forgery protection mechanisms and SameSite cookie configurations.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Mixed Content Detection</h3>
              <p className="text-muted-foreground">
                Identify mixed content issues and insecure resource loading that could compromise security.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Security Score</h3>
              <p className="text-muted-foreground">
                Calculate overall security score based on implemented protections and provide improvement roadmap.
              </p>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6">How to Use CSP & Security Headers Tester</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">1. URL Testing</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Enter website URL to test</li>
                  <li>• Analyze live website headers</li>
                  <li>• Test CSP implementation</li>
                  <li>• Check security configurations</li>
                  <li>• Real-time security assessment</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">2. Manual Analysis</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Paste CSP policies for validation</li>
                  <li>• Test custom security headers</li>
                  <li>• Validate header syntax</li>
                  <li>• Check directive effectiveness</li>
                  <li>• Generate security reports</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">3. Assessment Features</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Comprehensive security audit</li>
                  <li>• Risk level evaluation</li>
                  <li>• Implementation recommendations</li>
                  <li>• Best practice compliance</li>
                  <li>• Remediation guidance</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">4. Best Practices</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Implement defense in depth</li>
                  <li>• Use strict CSP policies</li>
                  <li>• Enable all security headers</li>
                  <li>• Regular security audits</li>
                  <li>• Monitor for violations</li>
                </ul>
              </div>
            </div>
          </div>

          {/* CSP & Security Headers Tester Component */}
          <CspSecurityHeadersTesterClient />

          {/* FAQ Section */}
          <div className="bg-card rounded-lg p-8 border mt-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What is Content Security Policy (CSP)?</h3>
                <p className="text-muted-foreground">
                  CSP is a security standard that helps prevent cross-site scripting (XSS), clickjacking, and other code injection attacks by defining which resources can be loaded and executed.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Why are security headers important?</h3>
                <p className="text-muted-foreground">
                  Security headers provide additional layers of protection against common web vulnerabilities, helping to mitigate risks from XSS, clickjacking, MIME sniffing, and other attacks.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">How strict should my CSP be?</h3>
                <p className="text-muted-foreground">
                  Start with a restrictive policy and gradually allow necessary resources. Use 'strict-dynamic' and nonces for script execution, and avoid 'unsafe-inline' and 'unsafe-eval' directives.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I test localhost URLs?</h3>
                <p className="text-muted-foreground">
                  Yes, you can test localhost and internal network URLs. The tool will analyze headers and CSP policies from any accessible HTTP/HTTPS endpoint.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}