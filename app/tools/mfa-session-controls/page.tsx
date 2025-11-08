import { Metadata } from "next";
import MFASessionControlsClient from "../../../components/tools/mfa-session-controls-client";

export const metadata: Metadata = {
  title: "MFA & Session Controls - Multi-Factor Authentication & Session Management | Multi-Tool Platform",
  description: "Comprehensive MFA and session management tool for implementing secure authentication, session controls, and access management. Configure TOTP, SMS, email verification, and advanced session policies.",
  keywords: [
    "MFA",
    "multi-factor authentication",
    "session management",
    "session controls",
    "TOTP",
    "two-factor authentication",
    "2FA",
    "authentication security",
    "session timeout",
    "access control",
    "security policies",
    "login security",
    "session monitoring",
    "authentication methods",
    "security controls"
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
    canonical: "/tools/mfa-session-controls",
  },
  openGraph: {
    title: "MFA & Session Controls - Multi-Factor Authentication & Session Management",
    description: "Comprehensive MFA and session management tool for implementing secure authentication, session controls, and access management.",
    url: "/tools/mfa-session-controls",
    siteName: "Multi-Tool Platform",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-mfa-session.png",
        width: 1200,
        height: 630,
        alt: "MFA & Session Controls - Multi-Factor Authentication Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MFA & Session Controls - Multi-Factor Authentication & Session Management",
    description: "Comprehensive MFA and session management tool for implementing secure authentication and session controls.",
    images: ["/og-mfa-session.png"],
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
  category: "security tools",
  classification: "MFA and Session Management Tool",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "MFA & Session Controls",
  description: "Comprehensive MFA and session management tool for implementing secure authentication, session controls, and access management.",
  url: "https://multi-tool-platform.vercel.app/tools/mfa-session-controls",
  applicationCategory: "SecurityApplication",
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
    "TOTP Authentication Setup",
    "SMS Verification",
    "Email Authentication",
    "Session Timeout Configuration",
    "Concurrent Session Limits",
    "Device Management",
    "Login Attempt Monitoring",
    "Security Policy Enforcement",
    "Session Monitoring Dashboard",
    "Access Control Policies"
  ],
  screenshot: "/og-mfa-session.png",
};

export default function MFASessionControlsPage() {
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
            Security & Authentication Tools
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            MFA & Session Controls
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Implement robust multi-factor authentication and session management to protect your applications and user accounts from unauthorized access.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">TOTP Authentication</h3>
            <p className="text-slate-600 dark:text-slate-300">Time-based One-Time Password (TOTP) setup with QR code generation and validation.</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">SMS & Email Verification</h3>
            <p className="text-slate-600 dark:text-slate-300">SMS and email-based verification systems with rate limiting and security controls.</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Session Management</h3>
            <p className="text-slate-600 dark:text-slate-300">Configure session timeouts, concurrent session limits, and automatic logout policies.</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Device Management</h3>
            <p className="text-slate-600 dark:text-slate-300">Track and manage trusted devices with device fingerprinting and access controls.</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Brute Force Protection</h3>
            <p className="text-slate-600 dark:text-slate-300">Advanced protection against brute force attacks with progressive delays and account locking.</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Security Monitoring</h3>
            <p className="text-slate-600 dark:text-slate-300">Real-time monitoring of authentication attempts, suspicious activities, and security events.</p>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">How to Use</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Setting Up MFA</h3>
              <ol className="space-y-3 text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">1</span>
                  <span>Choose your preferred MFA method (TOTP, SMS, or Email)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">2</span>
                  <span>Configure authentication settings and security policies</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">3</span>
                  <span>Test the MFA setup with sample authentication flows</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">4</span>
                  <span>Generate configuration code for your application</span>
                </li>
              </ol>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Session Controls</h3>
              <ul className="space-y-3 text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Configure automatic session timeouts and idle detection</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Set limits on concurrent sessions per user</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Monitor active sessions and force logout capabilities</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Implement device fingerprinting and trusted device management</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tool Component */}
        <MFASessionControlsClient />

        {/* FAQ Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">What MFA methods are supported?</h3>
              <p className="text-slate-600 dark:text-slate-300">The tool supports TOTP (Time-based One-Time Password) via authenticator apps, SMS verification, and email-based authentication. You can configure multiple methods for enhanced security.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">How do I integrate this with my application?</h3>
              <p className="text-slate-600 dark:text-slate-300">After configuring your MFA settings, the tool generates implementation code and configuration files that you can integrate into your application's authentication system.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Can I customize session policies?</h3>
              <p className="text-slate-600 dark:text-slate-300">Yes, you can customize session timeouts, concurrent session limits, idle detection periods, and automatic logout policies based on your security requirements.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Is there protection against brute force attacks?</h3>
              <p className="text-slate-600 dark:text-slate-300">Yes, the tool includes advanced brute force protection with progressive delays, account locking, and suspicious activity monitoring to prevent unauthorized access attempts.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">How does device management work?</h3>
              <p className="text-slate-600 dark:text-slate-300">Device management uses fingerprinting techniques to identify trusted devices. Users can mark devices as trusted and receive notifications for login attempts from unrecognized devices.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}