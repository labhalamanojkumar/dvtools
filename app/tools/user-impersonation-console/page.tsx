import type { Metadata } from "next";
import UserImpersonationConsoleClient from "@/components/tools/user-impersonation-console-client";

export const metadata: Metadata = {
  title: "User Impersonation Console - Safe Debugging Tool | Malti Tool Platform",
  description:
    "Safely impersonate users for debugging with comprehensive consent logging, session tracking, and audit trails. Enterprise-grade user impersonation with compliance controls.",
  keywords: [
    "user impersonation",
    "safe debugging",
    "consent logging",
    "session tracking",
    "support console",
    "customer support",
    "user debugging",
    "impersonation audit",
    "compliance logging",
    "support tools",
    "user session",
    "debug console"
  ],
};

export default function UserImpersonationConsolePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "User Impersonation Console",
    description:
      "Safely impersonate users for debugging with comprehensive consent logging, session tracking, and audit trails.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Safe user impersonation",
      "Consent logging",
      "Session tracking",
      "Comprehensive audit trails",
      "Time-limited access",
      "Activity monitoring",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            User Impersonation Console
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Safely impersonate users to debug issues and provide support while maintaining comprehensive
            audit trails, consent logging, and time-limited access controls for compliance and security.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="p-6 border rounded-lg bg-card">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Safe User Impersonation</h3>
            <p className="text-sm text-muted-foreground">
              Access user accounts securely to diagnose issues and provide support with built-in safeguards and permission checks.
            </p>
          </div>

          <div className="p-6 border rounded-lg bg-card">
            <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-cyan-600 dark:text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Consent Logging</h3>
            <p className="text-sm text-muted-foreground">
              Automatically log user consent and notifications when impersonation begins, ensuring transparency and compliance.
            </p>
          </div>

          <div className="p-6 border rounded-lg bg-card">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Session Tracking</h3>
            <p className="text-sm text-muted-foreground">
              Monitor active impersonation sessions with time limits, activity tracking, and automatic session termination.
            </p>
          </div>

          <div className="p-6 border rounded-lg bg-card">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-purple-600 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Comprehensive Audit Trails</h3>
            <p className="text-sm text-muted-foreground">
              Detailed logs of all impersonation activities, including who, when, why, and what actions were performed during the session.
            </p>
          </div>

          <div className="p-6 border rounded-lg bg-card">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-orange-600 dark:text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Time-Limited Access</h3>
            <p className="text-sm text-muted-foreground">
              Set maximum session durations with automatic expiration, preventing indefinite access and ensuring security best practices.
            </p>
          </div>

          <div className="p-6 border rounded-lg bg-card">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Activity Monitoring</h3>
            <p className="text-sm text-muted-foreground">
              Real-time monitoring of actions performed during impersonation sessions with detailed activity logs and alerts.
            </p>
          </div>
        </div>

        {/* Main Tool Component */}
        <UserImpersonationConsoleClient />

        {/* Usage Guide */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-bold">How to Use the User Impersonation Console</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 border rounded-lg bg-card">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Select User & Justify</h3>
                  <p className="text-sm text-muted-foreground">
                    Search for the user you need to impersonate and provide a clear business justification for the impersonation. This is required for audit compliance.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border rounded-lg bg-card">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-cyan-100 dark:bg-cyan-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-cyan-600 dark:text-cyan-400 font-semibold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Start Impersonation Session</h3>
                  <p className="text-sm text-muted-foreground">
                    Set session duration (max 60 minutes) and initiate the impersonation. User consent is logged automatically, and notifications are sent.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border rounded-lg bg-card">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 dark:text-green-400 font-semibold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Debug & Document</h3>
                  <p className="text-sm text-muted-foreground">
                    Perform necessary debugging or support actions. All activities are automatically logged with timestamps and details for audit purposes.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border rounded-lg bg-card">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 dark:text-purple-400 font-semibold">4</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">End Session & Review</h3>
                  <p className="text-sm text-muted-foreground">
                    Manually end the session when done or let it expire automatically. Review session logs and audit trails for compliance reporting.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="p-6 border rounded-lg bg-card">
              <summary className="font-semibold cursor-pointer">
                When should I use user impersonation?
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">
                User impersonation should only be used for legitimate support and debugging purposes, such as investigating reported bugs,
                troubleshooting user-specific issues, or providing hands-on support when users cannot resolve problems independently. Always
                document the reason and obtain proper authorization before impersonating a user. It should never be used for surveillance
                or unauthorized access to user data.
              </p>
            </details>

            <details className="p-6 border rounded-lg bg-card">
              <summary className="font-semibold cursor-pointer">
                How does consent logging work?
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">
                When you start an impersonation session, the system automatically logs the consent event with details about who initiated it,
                why, and when. The user receives a notification (email or in-app) informing them that their account is being accessed for
                support purposes. All consent logs are immutable and stored for compliance purposes, typically for 7 years or as required by
                your industry regulations.
              </p>
            </details>

            <details className="p-6 border rounded-lg bg-card">
              <summary className="font-semibold cursor-pointer">
                What happens if a session expires?
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">
                When a session reaches its time limit (default 30 minutes, max 60 minutes), it automatically terminates and you're logged out
                of the impersonated account. A session summary is generated with all actions performed, and you're returned to the console.
                You can start a new session if more time is needed, but you must provide additional justification. This ensures time-limited
                access and prevents indefinite impersonation.
              </p>
            </details>

            <details className="p-6 border rounded-lg bg-card">
              <summary className="font-semibold cursor-pointer">
                Are there restrictions on what I can do during impersonation?
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">
                Yes. During impersonation, certain actions are typically restricted to prevent accidental or malicious changes, such as changing
                passwords, deleting accounts, modifying billing information, or accessing financial data without additional approval. The system
                logs all actions and flags any attempts to perform restricted operations. Your organization can configure which actions are
                allowed based on your security policies and compliance requirements.
              </p>
            </details>
          </div>
        </div>
      </div>
    </>
  );
}
