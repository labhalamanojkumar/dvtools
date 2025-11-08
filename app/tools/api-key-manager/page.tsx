import type { Metadata } from "next";
import APIKeyManagerClient from "@/components/tools/api-key-manager-client";

export const metadata: Metadata = {
  title: "API Key & Quota Manager - Manage API Keys & Usage | Malti Tool Platform",
  description: "Generate, manage, and monitor API keys with quota limits, usage tracking, and revocation capabilities. Secure API key management made simple.",
  keywords: [
    "API key manager",
    "API key generation",
    "quota management",
    "usage tracking",
    "API key revocation",
    "rate limiting",
    "API authentication",
    "key rotation",
    "usage analytics",
    "API security",
    "access control",
    "API keys"
  ],
  openGraph: {
    title: "API Key & Quota Manager - Manage API Keys & Usage",
    description: "Generate, manage API keys with quota limits and usage tracking.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "API Key & Quota Manager",
    description: "Secure API key management with quota limits and usage analytics.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const features = [
  {
    title: "Key Generation",
    description: "Generate secure API keys with custom prefixes and automatic expiration dates.",
  },
  {
    title: "Quota Management",
    description: "Set daily, weekly, or monthly request quotas to control API usage per key.",
  },
  {
    title: "Usage Tracking",
    description: "Monitor real-time usage statistics and track requests per API key.",
  },
  {
    title: "Key Revocation",
    description: "Instantly revoke compromised or unused API keys with one click.",
  },
  {
    title: "Metadata & Labels",
    description: "Add custom metadata and labels to organize and identify API keys.",
  },
  {
    title: "Export & Analytics",
    description: "Export usage data and view detailed analytics for each API key.",
  },
];

export default function APIKeyManagerPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            API Key & Quota Manager
          </h1>
          <p className="text-xl text-muted-foreground">
            Generate, manage, and monitor API keys with quota limits and usage tracking.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              Key Generation
            </span>
            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              Quota Management
            </span>
            <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
              Usage Analytics
            </span>
            <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
              Revocation
            </span>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg border bg-background p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">How to Use</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">1. Create API Key</h3>
              <p className="text-muted-foreground">
                Click "Generate API Key" and configure settings like name, quota limits, expiration date, and metadata. Copy the generated key immediately as it won't be shown again.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">2. Set Quota Limits</h3>
              <p className="text-muted-foreground">
                Define request quotas (daily, weekly, monthly) to control API usage. Quotas automatically reset based on your configured schedule.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">3. Monitor Usage</h3>
              <p className="text-muted-foreground">
                Track real-time usage statistics, view request history, and monitor quota consumption for each API key in the dashboard.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">4. Revoke Keys</h3>
              <p className="text-muted-foreground">
                Instantly revoke API keys that are compromised, no longer needed, or have exceeded their usage limits. Revoked keys cannot be reactivated.
              </p>
            </div>
          </div>
        </div>

        <APIKeyManagerClient />

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">How are API keys stored?</h3>
              <p className="text-muted-foreground">
                API keys are hashed using SHA-256 before storage. Only the hash is stored, making keys unrecoverable if lost. Always save generated keys securely.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Can I modify quota limits after creation?</h3>
              <p className="text-muted-foreground">
                Yes, you can update quota limits, expiration dates, and metadata for existing keys at any time without invalidating the key.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What happens when quota is exceeded?</h3>
              <p className="text-muted-foreground">
                When a key exceeds its quota limit, further requests are rejected with a 429 (Too Many Requests) status until the quota resets.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Can revoked keys be reactivated?</h3>
              <p className="text-muted-foreground">
                No, revoked keys cannot be reactivated for security reasons. You'll need to generate a new API key if you need access again.
              </p>
            </div>
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "API Key & Quota Manager",
            "description": "Generate and manage API keys with quota limits and usage tracking",
            "applicationCategory": "DeveloperApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "Secure API key generation",
              "Quota limit management",
              "Real-time usage tracking",
              "Key revocation",
              "Custom metadata and labels",
              "Usage analytics and export"
            ]
          })
        }}
      />
    </div>
  );
}
