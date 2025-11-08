import type { Metadata } from "next";
import WebhookTesterClient from "@/components/tools/webhook-tester-client";

export const metadata: Metadata = {
  title: "Webhook Tester & Replay - Test Webhook Endpoints | Malti Tool Platform",
  description: "Receive, inspect, and replay webhook payloads with request logging, HMAC/JWT signature validation, and payload editor. Test webhook integrations instantly.",
  keywords: [
    "webhook tester",
    "webhook debugging",
    "webhook replay",
    "webhook inspector",
    "HMAC signature",
    "JWT webhook",
    "webhook validation",
    "payload testing",
    "webhook endpoint",
    "API webhooks",
    "webhook logs",
    "webhook simulator"
  ],
  openGraph: {
    title: "Webhook Tester & Replay - Test Webhook Endpoints",
    description: "Receive, inspect, and replay webhook payloads with signature validation and request logging.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Webhook Tester & Replay",
    description: "Test and debug webhook integrations with request inspection and replay functionality.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const features = [
  {
    title: "Unique Webhook URLs",
    description: "Generate unique webhook endpoints instantly to receive and test webhook payloads from any service.",
  },
  {
    title: "Request Inspector",
    description: "View complete request details including headers, body, query parameters, and timestamps.",
  },
  {
    title: "Signature Validation",
    description: "Validate HMAC SHA-256, HMAC SHA-512, and JWT signatures with custom secret keys.",
  },
  {
    title: "Payload Replay",
    description: "Replay captured webhook payloads to different endpoints for testing and debugging.",
  },
  {
    title: "Request History",
    description: "Browse and search through webhook request history with filtering and sorting capabilities.",
  },
  {
    title: "Custom Response",
    description: "Configure custom response status codes and bodies to simulate different webhook behaviors.",
  },
];

export default function WebhookTesterPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Webhook Tester & Replay
          </h1>
          <p className="text-xl text-muted-foreground">
            Test, inspect, and replay webhook payloads with signature validation and request logging.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              Webhook Testing
            </span>
            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              Signature Validation
            </span>
            <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
              Request Replay
            </span>
            <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
              Real-time Logs
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
              <h3 className="text-lg font-semibold mb-2">1. Create Webhook Endpoint</h3>
              <p className="text-muted-foreground">
                Click "Generate Webhook URL" to create a unique endpoint. Copy the URL and configure it in your webhook provider (Stripe, GitHub, etc.).
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">2. Send Test Webhooks</h3>
              <p className="text-muted-foreground">
                Trigger webhooks from your service or use the built-in payload editor to send manual test requests to your endpoint.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">3. Inspect Requests</h3>
              <p className="text-muted-foreground">
                View complete request details including headers, body, timestamps, and signature validation results in the request history.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">4. Replay & Debug</h3>
              <p className="text-muted-foreground">
                Replay captured payloads to different endpoints, modify parameters, and validate signature verification logic.
              </p>
            </div>
          </div>
        </div>

        <WebhookTesterClient />

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">How long are webhook URLs active?</h3>
              <p className="text-muted-foreground">
                Webhook URLs remain active for the duration of your session. Request history is kept for 24 hours, after which old requests are automatically cleaned up.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What signature algorithms are supported?</h3>
              <p className="text-muted-foreground">
                We support HMAC SHA-256, HMAC SHA-512, and JWT (HS256) signature validation. You can configure the signature header name and secret key for verification.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Can I replay webhooks to production endpoints?</h3>
              <p className="text-muted-foreground">
                Yes, but use with caution. Replaying webhooks can trigger real actions. We recommend testing against staging or development endpoints first.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Is request data secure?</h3>
              <p className="text-muted-foreground">
                Webhook data is stored temporarily in memory and automatically expires after 24 hours. For production use, consider self-hosting with proper encryption.
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
            "name": "Webhook Tester & Replay",
            "description": "Test, inspect, and replay webhook payloads with signature validation",
            "applicationCategory": "DeveloperApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "Unique webhook URL generation",
              "Request inspection and logging",
              "HMAC and JWT signature validation",
              "Payload replay functionality",
              "Request history with filtering",
              "Custom response configuration"
            ]
          })
        }}
      />
    </div>
  );
}
