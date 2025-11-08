import { Metadata } from "next";
import PenetrationTestChecklistClient from "../../../components/tools/penetration-test-checklist-client";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Penetration Test Checklist & Issue Tracker - Security Tool | Multi-Tool Platform",
  description: "Comprehensive penetration testing checklist with issue tracking. Organize security assessments, track vulnerabilities, and manage remediation workflows.",
  keywords: [
    "penetration testing",
    "security checklist",
    "vulnerability tracking",
    "issue tracker",
    "security assessment",
    "pentest checklist",
    "vulnerability management",
    "security workflow",
    "assessment tracker",
    "remediation tracking"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multi-tool-platform.com"),
  alternates: {
    canonical: "/tools/penetration-test-checklist",
  },
  openGraph: {
    title: "Penetration Test Checklist & Issue Tracker - Security Tool",
    description: "Comprehensive penetration testing checklist with issue tracking and remediation management.",
    url: "/tools/penetration-test-checklist",
    siteName: "Multi-Tool Platform",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-penetration-test-checklist.png",
        width: 1200,
        height: 630,
        alt: "Penetration Test Checklist & Issue Tracker Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Penetration Test Checklist & Issue Tracker - Security Tool",
    description: "Comprehensive penetration testing checklist with issue tracking.",
    images: ["/og-penetration-test-checklist.png"],
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

export default function PenetrationTestChecklistPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Penetration Test Checklist & Issue Tracker",
    "description": "Comprehensive security assessment tool for penetration testing with structured checklists, issue tracking, and remediation workflow management.",
    "url": "https://multi-tool-platform.com/tools/penetration-test-checklist",
    "applicationCategory": "SecuritySoftware",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "Comprehensive penetration testing checklists",
      "Structured assessment workflows",
      "Issue tracking and prioritization",
      "Vulnerability management",
      "Remediation tracking",
      "Risk assessment scoring",
      "Compliance mapping",
      "Report generation",
      "Team collaboration",
      "Progress monitoring"
    ],
    "screenshot": "/og-penetration-test-checklist.png",
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
              Penetration Test Checklist & Issue Tracker
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Structured penetration testing framework with comprehensive checklists, issue tracking,
              and remediation management for thorough security assessments.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                Pentest Framework
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                Issue Tracking
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Assessment Workflow
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Remediation Management
              </span>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Comprehensive Checklists</h3>
              <p className="text-muted-foreground">
                Pre-built checklists covering reconnaissance, scanning, exploitation, post-exploitation, and reporting phases.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Issue Tracking</h3>
              <p className="text-muted-foreground">
                Track vulnerabilities, assign priorities, set deadlines, and monitor remediation progress with detailed notes.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Risk Assessment</h3>
              <p className="text-muted-foreground">
                Automated risk scoring based on vulnerability severity, exploitability, and business impact analysis.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Team Collaboration</h3>
              <p className="text-muted-foreground">
                Multi-user support with role-based access, comment threads, and collaborative assessment workflows.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Compliance Mapping</h3>
              <p className="text-muted-foreground">
                Map findings to compliance frameworks like OWASP, NIST, ISO 27001, and PCI-DSS requirements.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Executive Reports</h3>
              <p className="text-muted-foreground">
                Generate comprehensive reports with executive summaries, technical details, and remediation roadmaps.
              </p>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6">How to Use Penetration Test Checklist & Issue Tracker</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">1. Assessment Setup</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Create new assessment project</li>
                  <li>• Define scope and objectives</li>
                  <li>• Select checklist templates</li>
                  <li>• Configure team roles</li>
                  <li>• Set assessment timeline</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">2. Testing Workflow</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Follow structured checklists</li>
                  <li>• Document findings systematically</li>
                  <li>• Capture evidence and screenshots</li>
                  <li>• Assign severity and impact</li>
                  <li>• Track testing progress</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">3. Issue Management</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Create detailed issue reports</li>
                  <li>• Assign to team members</li>
                  <li>• Set remediation priorities</li>
                  <li>• Track resolution progress</li>
                  <li>• Validate fixes</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">4. Reporting & Compliance</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Generate comprehensive reports</li>
                  <li>• Map to compliance frameworks</li>
                  <li>• Create executive summaries</li>
                  <li>• Export findings data</li>
                  <li>• Schedule follow-up assessments</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Penetration Test Checklist Component */}
          <PenetrationTestChecklistClient />

          {/* FAQ Section */}
          <div className="bg-card rounded-lg p-8 border mt-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What methodologies are supported?</h3>
                <p className="text-muted-foreground">
                  The tool supports OWASP Testing Guide, PTES, OSSTMM, NIST SP 800-115, and custom methodologies with comprehensive checklists for each phase.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I customize checklists?</h3>
                <p className="text-muted-foreground">
                  Yes, you can create custom checklists, modify existing templates, add organization-specific requirements, and save them for future assessments.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">How does issue tracking work?</h3>
                <p className="text-muted-foreground">
                  Issues are tracked with full lifecycle management including creation, assignment, status updates, evidence attachment, and resolution verification.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Is this suitable for compliance audits?</h3>
                <p className="text-muted-foreground">
                  Yes, the tool includes compliance mapping for various frameworks and generates audit-ready reports with evidence and remediation tracking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}