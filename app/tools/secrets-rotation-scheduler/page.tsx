import { Metadata } from "next";
import SecretsRotationSchedulerClient from "@/components/tools/secrets-rotation-scheduler-client";

export const metadata: Metadata = {
  title: "Secrets Rotation Scheduler - Automated Secret Management Tool | Malti Tool Platform",
  description: "Automate secret rotation scheduling and tracking with notifications. Manage API keys, database credentials, certificates, and access tokens with automatic rotation policies and audit logs.",
  keywords: [
    "secrets rotation",
    "credential management",
    "api key rotation",
    "password rotation",
    "certificate renewal",
    "secrets manager",
    "automated rotation",
    "security compliance",
    "access token refresh",
    "secret lifecycle",
    "audit logging",
    "compliance tracking"
  ],
  openGraph: {
    title: "Secrets Rotation Scheduler - Automated Secret Management",
    description: "Schedule and track automatic secret rotations with notifications and compliance monitoring",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Secrets Rotation Scheduler",
  description: "Automated secret rotation scheduling and tracking with notifications, audit logs, and compliance monitoring",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Automatic Rotation Scheduling",
    "Notification System",
    "Audit Logs",
    "Compliance Tracking",
    "Multi-Secret Support",
    "Custom Policies"
  ],
};

export default function SecretsRotationSchedulerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Secrets Rotation Scheduler</h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Automate secret rotation scheduling and tracking with comprehensive notifications, audit logs, and 
              compliance monitoring. Manage API keys, database credentials, certificates, and access tokens securely.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg space-y-2">
              <h3 className="font-semibold text-lg">Automatic Scheduling</h3>
              <p className="text-sm text-muted-foreground">
                Set up automated rotation schedules based on time intervals or compliance requirements
              </p>
            </div>
            <div className="p-6 border rounded-lg space-y-2">
              <h3 className="font-semibold text-lg">Smart Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Get alerts before secrets expire via email, Slack, or webhook integrations
              </p>
            </div>
            <div className="p-6 border rounded-lg space-y-2">
              <h3 className="font-semibold text-lg">Audit Logging</h3>
              <p className="text-sm text-muted-foreground">
                Complete audit trail of all rotation activities for compliance and security reviews
              </p>
            </div>
            <div className="p-6 border rounded-lg space-y-2">
              <h3 className="font-semibold text-lg">Multi-Secret Support</h3>
              <p className="text-sm text-muted-foreground">
                Manage API keys, database passwords, certificates, OAuth tokens, and more
              </p>
            </div>
            <div className="p-6 border rounded-lg space-y-2">
              <h3 className="font-semibold text-lg">Custom Policies</h3>
              <p className="text-sm text-muted-foreground">
                Define rotation policies based on your organization's security requirements
              </p>
            </div>
            <div className="p-6 border rounded-lg space-y-2">
              <h3 className="font-semibold text-lg">Compliance Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Monitor compliance with security standards like SOC 2, ISO 27001, and PCI DSS
              </p>
            </div>
          </div>

          {/* Main Tool */}
          <SecretsRotationSchedulerClient />

          {/* Usage Guide */}
          <div className="space-y-6 pt-8 border-t">
            <h2 className="text-2xl font-semibold">How to Use the Secrets Rotation Scheduler</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1. Add Secrets to Monitor</h3>
                <p className="text-muted-foreground">
                  Register your secrets (API keys, database credentials, certificates) with metadata like type, 
                  expiration date, and rotation frequency. The tool supports various secret types and storage backends.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">2. Configure Rotation Policies</h3>
                <p className="text-muted-foreground">
                  Set up automatic rotation schedules based on time intervals (30, 60, 90 days) or custom policies. 
                  Define notification thresholds and grace periods for critical secrets.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. Set Up Notifications</h3>
                <p className="text-muted-foreground">
                  Configure notification channels (email, Slack, webhooks) to receive alerts before secrets expire. 
                  Customize notification timing and escalation policies for different secret types.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">4. Monitor and Audit</h3>
                <p className="text-muted-foreground">
                  Review audit logs to track rotation history, compliance status, and access patterns. Generate 
                  compliance reports for security audits and regulatory requirements.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="space-y-6 pt-8 border-t">
            <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">What types of secrets can be rotated?</h3>
                <p className="text-muted-foreground">
                  The tool supports API keys, database passwords, OAuth tokens, SSH keys, TLS certificates, 
                  service account credentials, and custom secret types. Integration with popular secret managers 
                  like AWS Secrets Manager, Azure Key Vault, and HashiCorp Vault is supported.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">How are rotation notifications delivered?</h3>
                <p className="text-muted-foreground">
                  Notifications can be sent via email, Slack, Microsoft Teams, PagerDuty, or custom webhooks. 
                  You can configure multiple channels and set different alert thresholds (7 days, 3 days, 1 day before expiration).
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Is the rotation process automatic or manual?</h3>
                <p className="text-muted-foreground">
                  The tool supports both automatic and manual rotation workflows. Automatic rotation requires 
                  integration with your secret management system. Manual rotation provides reminders and tracking 
                  while you perform the rotation yourself.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">How are audit logs maintained?</h3>
                <p className="text-muted-foreground">
                  All rotation activities are logged with timestamps, user information, and status. Audit logs 
                  are immutable and can be exported for compliance reporting. Logs include rotation attempts, 
                  successes, failures, and notification deliveries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
