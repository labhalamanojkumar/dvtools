import { Metadata } from "next";
import PrivacyComplianceHelperClient from "../../../components/tools/privacy-compliance-helper-client";

export const metadata: Metadata = {
  title: "Privacy Compliance Helper - GDPR, CCPA, HIPAA Compliance Checker | Multi-Tool Platform",
  description: "Comprehensive privacy compliance tool for GDPR, CCPA, HIPAA, and other regulations. Check data processing practices, generate compliance reports, and ensure legal compliance with automated privacy assessments.",
  keywords: [
    "privacy compliance",
    "GDPR compliance",
    "CCPA compliance",
    "HIPAA compliance",
    "data protection",
    "privacy regulations",
    "compliance checker",
    "privacy audit",
    "data privacy",
    "legal compliance",
    "privacy assessment",
    "data processing",
    "privacy laws",
    "compliance reporting",
    "privacy tools"
  ],
  authors: [{ name: "Multi-Tool Platform" }],
  creator: "Multi-Tool Platform",
  publisher: "Multi-Tool Platform",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multi-tool-platform.vercel.app"),
  alternates: {
    canonical: "/tools/privacy-compliance-helper",
  },
  openGraph: {
    title: "Privacy Compliance Helper - GDPR, CCPA, HIPAA Compliance Checker",
    description: "Comprehensive privacy compliance tool for GDPR, CCPA, HIPAA, and other regulations. Check data processing practices, generate compliance reports, and ensure legal compliance.",
    url: "/tools/privacy-compliance-helper",
    siteName: "Multi-Tool Platform",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-privacy-compliance.png",
        width: 1200,
        height: 630,
        alt: "Privacy Compliance Helper - GDPR, CCPA, HIPAA Compliance Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Compliance Helper - GDPR, CCPA, HIPAA Compliance Checker",
    description: "Comprehensive privacy compliance tool for GDPR, CCPA, HIPAA, and other regulations. Check data processing practices and ensure legal compliance.",
    images: ["/og-privacy-compliance.png"],
    creator: "@multitoolplatform",
    site: "@multitoolplatform",
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
  category: "privacy tools",
  classification: "Privacy Compliance Tool",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Privacy Compliance Helper",
  description: "Comprehensive privacy compliance tool for GDPR, CCPA, HIPAA, and other regulations. Check data processing practices, generate compliance reports, and ensure legal compliance.",
  url: "https://multi-tool-platform.vercel.app/tools/privacy-compliance-helper",
  applicationCategory: "PrivacyApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  creator: {
    "@type": "Organization",
    name: "Multi-Tool Platform",
    url: "https://multi-tool-platform.vercel.app",
  },
  featureList: [
    "GDPR Compliance Assessment",
    "CCPA Compliance Checker",
    "HIPAA Compliance Analysis",
    "Data Processing Audit",
    "Privacy Policy Generator",
    "Compliance Reporting",
    "Risk Assessment",
    "Legal Documentation"
  ],
  screenshot: "/og-privacy-compliance.png",
};

export default function PrivacyComplianceHelperPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Privacy & Security Tools
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Privacy Compliance Helper
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Ensure your organization meets privacy regulations with comprehensive compliance assessments for GDPR, CCPA, HIPAA, and other data protection laws.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">GDPR Compliance</h3>
            <p className="text-slate-600 dark:text-slate-300">Comprehensive GDPR assessment with automated compliance checking and gap analysis.</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">CCPA Compliance</h3>
            <p className="text-slate-600 dark:text-slate-300">California Consumer Privacy Act compliance checker with automated assessment tools.</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">HIPAA Compliance</h3>
            <p className="text-slate-600 dark:text-slate-300">Healthcare data protection compliance with PHI handling and security assessments.</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Compliance Reports</h3>
            <p className="text-slate-600 dark:text-slate-300">Generate detailed compliance reports with actionable recommendations and remediation steps.</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Risk Assessment</h3>
            <p className="text-slate-600 dark:text-slate-300">Identify privacy risks and vulnerabilities with automated risk scoring and prioritization.</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Policy Generator</h3>
            <p className="text-slate-600 dark:text-slate-300">Generate privacy policies and consent forms tailored to your specific compliance needs.</p>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">How to Use</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Getting Started</h3>
              <ol className="space-y-3 text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">1</span>
                  <span>Select the privacy regulation you need to comply with (GDPR, CCPA, HIPAA, etc.)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">2</span>
                  <span>Upload your current privacy policy, data processing records, or system configurations</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">3</span>
                  <span>Answer the compliance questionnaire to assess your current practices</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">4</span>
                  <span>Review the automated compliance assessment and risk analysis</span>
                </li>
              </ol>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Advanced Features</h3>
              <ul className="space-y-3 text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Generate customized privacy policies and consent forms</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Export detailed compliance reports in multiple formats</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Track compliance progress with automated monitoring</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Receive alerts for compliance deadlines and updates</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tool Component */}
        <PrivacyComplianceHelperClient />

        {/* FAQ Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">What privacy regulations does this tool support?</h3>
              <p className="text-slate-600 dark:text-slate-300">The Privacy Compliance Helper supports GDPR (EU), CCPA (California), HIPAA (Healthcare), PIPEDA (Canada), LGPD (Brazil), and other major privacy regulations worldwide.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Can I upload my existing privacy documents?</h3>
              <p className="text-slate-600 dark:text-slate-300">Yes, you can upload privacy policies, data processing agreements, consent forms, and other documents for automated analysis and compliance checking.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">How accurate is the compliance assessment?</h3>
              <p className="text-slate-600 dark:text-slate-300">The tool provides automated assessments based on established compliance frameworks, but it should be used as a guide alongside legal consultation for complete compliance assurance.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Can I generate custom privacy policies?</h3>
              <p className="text-slate-600 dark:text-slate-300">Yes, the tool can generate customized privacy policies, consent forms, and data processing agreements based on your specific business needs and regulatory requirements.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Is my data secure when using this tool?</h3>
              <p className="text-slate-600 dark:text-slate-300">All data processing is done locally in your browser. Uploaded files are processed client-side and are not stored on external servers, ensuring your privacy documents remain secure.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}