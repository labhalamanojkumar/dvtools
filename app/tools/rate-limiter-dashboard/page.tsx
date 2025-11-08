import { Metadata } from "next";
import RateLimiterDashboardClient from "@/components/tools/rate-limiter-dashboard-client";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Rate Limiter Dashboard - API Traffic Management",
  description: "Monitor and control API rate limits with real-time analytics, rule management, and traffic simulation. Implement fixed-window, sliding-window, token-bucket, and leaky-bucket algorithms.",
  keywords: [
    "rate limiter",
    "API rate limiting",
    "traffic control",
    "rate limiting dashboard",
    "API protection",
    "traffic monitoring",
    "rate limit rules",
    "fixed window",
    "sliding window",
    "token bucket",
    "leaky bucket"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multitoolplatform.com"),
  alternates: {
    canonical: "/tools/rate-limiter-dashboard",
  },
  openGraph: {
    title: "Rate Limiter Dashboard - API Traffic Control & Monitoring",
    description: "Advanced rate limiting dashboard with real-time analytics, multiple algorithms, and comprehensive API protection features for developers and DevOps teams.",
    url: "/tools/rate-limiter-dashboard",
    siteName: "Multi-Tool Platform",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-rate-limiter.jpg",
        width: 1200,
        height: 630,
        alt: "Rate Limiter Dashboard - API Traffic Management",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rate Limiter Dashboard - API Rate Limiting & Analytics",
    description: "Monitor API traffic, configure rate limits, and protect against abuse with advanced rate limiting algorithms and real-time monitoring.",
    images: ["/og-rate-limiter.jpg"],
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
  category: "developer tools",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Rate Limiter Dashboard",
  "description": "Monitor and control API rate limits with real-time analytics, rule management, and traffic simulation. Implement fixed-window, sliding-window, token-bucket, and leaky-bucket algorithms.",
  "url": "https://multitoolplatform.com/tools/rate-limiter-dashboard",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
  },
  "featureList": [
    "Real-time rate limiting analytics",
    "Multiple rate limiting algorithms",
    "API traffic monitoring",
    "Rule-based rate limit configuration",
    "Traffic simulation and testing",
    "Client activity tracking",
    "Export/import configuration",
    "Request blocking statistics"
  ],
  "screenshot": "/og-rate-limiter.jpg",
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
      "name": "Rate Limiter Dashboard",
      "item": "https://multitoolplatform.com/tools/rate-limiter-dashboard"
    }
  ]
};

export default function RateLimiterDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
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
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            Rate Limiter Dashboard
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Monitor and control your API traffic with advanced rate limiting. Implement
            multiple algorithms, track client behavior, and protect your services from
            abuse with real-time analytics and comprehensive rule management.
          </p>

          {/* Key Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold mb-1">Real-time Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Live monitoring of API traffic and rate limiting effectiveness
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">⚙️</div>
              <h3 className="font-semibold mb-1">Multiple Algorithms</h3>
              <p className="text-sm text-muted-foreground">
                Fixed-window, sliding-window, token-bucket, and leaky-bucket
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-semibold mb-1">Rule Management</h3>
              <p className="text-sm text-muted-foreground">
                Flexible rule configuration for different endpoints and methods
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">🧪</div>
              <h3 className="font-semibold mb-1">Traffic Simulation</h3>
              <p className="text-sm text-muted-foreground">
                Test rate limiting rules with simulated API requests
              </p>
            </div>
          </div>
        </div>

        {/* Tool Component */}
        <RateLimiterDashboardClient />

        {/* Documentation Section */}
        <div className="mt-16 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">How to Use</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Follow these steps to effectively implement and monitor API rate limiting
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Getting Started */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">1. Create Rate Limiting Rules</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Click &quot;Add Rule&quot; to create a new rate limiting rule</p>
                  <p>• Define the endpoint pattern (e.g., /api/* or /api/users)</p>
                  <p>• Set the HTTP method (GET, POST, etc.) or ALL for all methods</p>
                  <p>• Configure the request limit and time window</p>
                  <p>• Choose from available rate limiting algorithms</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">2. Choose Rate Limiting Algorithm</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div>
                    <strong>Fixed Window:</strong> Simple time-based windows, allows bursts at window boundaries
                  </div>
                  <div>
                    <strong>Sliding Window:</strong> Smooth rate limiting, prevents boundary bursts
                  </div>
                  <div>
                    <strong>Token Bucket:</strong> Allows bursts while maintaining average rate
                  </div>
                  <div>
                    <strong>Leaky Bucket:</strong> Smooth traffic flow, constant output rate
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">3. Monitor API Traffic</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• View real-time statistics in the Analytics tab</p>
                  <p>• Monitor allowed vs blocked requests</p>
                  <p>• Track top clients by request volume</p>
                  <p>• Review recent activity and response times</p>
                  <p>• Set up alerts for high block rates</p>
                </div>
              </div>
            </div>

            {/* Advanced Features */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">4. Test with Simulation</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Use the Simulation tab to test your rules</p>
                  <p>• Simulate requests from different clients</p>
                  <p>• Test various endpoints and HTTP methods</p>
                  <p>• Verify rate limiting behavior before deployment</p>
                  <p>• Check remaining requests and reset times</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">5. Manage Configuration</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Export your configuration for backup or migration</p>
                  <p>• Reset statistics to start fresh monitoring</p>
                  <p>• Enable/disable rules without deleting them</p>
                  <p>• Update rule parameters as your needs change</p>
                  <p>• Monitor rule effectiveness over time</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">6. Best Practices</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Start with generous limits and adjust based on usage</p>
                  <p>• Use different limits for different API endpoints</p>
                  <p>• Monitor for legitimate high-usage clients</p>
                  <p>• Implement gradual limit increases for growing applications</p>
                  <p>• Regularly review and update rate limiting rules</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rate Limiting Algorithms */}
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Rate Limiting Algorithms</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    Fixed Window
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Divides time into fixed intervals. Simple to implement but allows bursts at window boundaries.
                  </p>
                  <div className="text-xs text-muted-foreground">
                    <strong>Pros:</strong> Easy to understand, low overhead<br/>
                    <strong>Cons:</strong> Boundary bursts, not smooth
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    Sliding Window
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Tracks requests in a moving time window for smoother rate limiting.
                  </p>
                  <div className="text-xs text-muted-foreground">
                    <strong>Pros:</strong> Prevents boundary bursts, fair distribution<br/>
                    <strong>Cons:</strong> More complex, higher memory usage
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    Token Bucket
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Tokens are added at a fixed rate and removed when requests are made. Allows bursts.
                  </p>
                  <div className="text-xs text-muted-foreground">
                    <strong>Pros:</strong> Allows bursts, smooth rate limiting<br/>
                    <strong>Cons:</strong> More complex state management
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    Leaky Bucket
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Requests are processed at a constant rate, like water leaking from a bucket.
                  </p>
                  <div className="text-xs text-muted-foreground">
                    <strong>Pros:</strong> Smooth output, prevents bursts<br/>
                    <strong>Cons:</strong> No burst handling, queue management needed
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Use Cases */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Common Use Cases</h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">API Protection</h4>
                <p className="text-sm text-muted-foreground">
                  Protect your APIs from abuse, DoS attacks, and excessive usage by implementing
                  appropriate rate limits for different endpoints.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Cost Control</h4>
                <p className="text-sm text-muted-foreground">
                  Control API usage costs by limiting requests from individual clients,
                  preventing unexpected billing increases.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Fair Usage</h4>
                <p className="text-sm text-muted-foreground">
                  Ensure fair access to your API resources among all clients,
                  preventing any single user from monopolizing capacity.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Performance Protection</h4>
                <p className="text-sm text-muted-foreground">
                  Maintain API performance and availability by preventing traffic spikes
                  that could overwhelm your infrastructure.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Tiered Access</h4>
                <p className="text-sm text-muted-foreground">
                  Implement different rate limits for different user tiers (free, premium, enterprise)
                  to encourage upgrades and manage resources.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Bot Protection</h4>
                <p className="text-sm text-muted-foreground">
                  Mitigate automated attacks and scraping by implementing strict rate limits
                  and monitoring suspicious traffic patterns.
                </p>
              </div>
            </div>
          </div>

          {/* Implementation Guide */}
          <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <div className="text-blue-600 dark:text-blue-400 mt-0.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Implementation Best Practices
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
                  <div>
                    <strong>Start Conservative:</strong> Begin with higher limits and gradually decrease based on usage patterns and performance metrics.
                  </div>
                  <div>
                    <strong>Monitor Impact:</strong> Track how rate limiting affects legitimate users and adjust limits to balance protection with usability.
                  </div>
                  <div>
                    <strong>Use Appropriate Algorithms:</strong> Choose algorithms based on your specific use case - token bucket for bursty traffic, leaky bucket for smooth flows.
                  </div>
                  <div>
                    <strong>Implement Graceful Degradation:</strong> Return proper HTTP status codes (429 Too Many Requests) and include retry-after headers.
                  </div>
                  <div>
                    <strong>Consider User Experience:</strong> Communicate rate limits clearly in API documentation and provide upgrade paths for power users.
                  </div>
                  <div>
                    <strong>Regular Review:</strong> Periodically audit your rate limiting rules and adjust them based on changing usage patterns and business requirements.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Frequently Asked Questions</h3>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">What&apos;s the difference between rate limiting and throttling?</h4>
                <p className="text-sm text-muted-foreground">
                  Rate limiting blocks requests that exceed a threshold, while throttling slows down requests.
                  This dashboard focuses on rate limiting with hard limits and request blocking.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">How do I choose the right algorithm for my use case?</h4>
                <p className="text-sm text-muted-foreground">
                  Use fixed-window for simple scenarios, sliding-window for fairness, token-bucket when bursts are acceptable,
                  and leaky-bucket when you need smooth, consistent output regardless of input patterns.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Can I apply different rules to different API endpoints?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, each rule can target specific endpoint patterns. You can create multiple rules for different
                  parts of your API with varying limits based on the sensitivity and cost of each endpoint.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">What happens when a request is blocked?</h4>
                <p className="text-sm text-muted-foreground">
                  Blocked requests are rejected with appropriate responses. In a production implementation,
                  you should return HTTP 429 (Too Many Requests) with a Retry-After header indicating when the client can retry.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">How do I handle legitimate high-usage clients?</h4>
                <p className="text-sm text-muted-foreground">
                  Monitor your analytics to identify power users. Consider implementing tiered rate limits,
                  providing higher limits for premium users, or offering dedicated endpoints for high-volume clients.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Can I integrate this with my existing API gateway?</h4>
                <p className="text-sm text-muted-foreground">
                  This dashboard is designed for monitoring and testing. For production use, integrate rate limiting
                  into your API gateway (Kong, NGINX, AWS API Gateway) or application middleware using the rules and
                  algorithms you&apos;ve configured here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}