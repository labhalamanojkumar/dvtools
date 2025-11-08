import { Metadata } from "next";
import UsageAnalyticsExplorerClient from "@/components/tools/UsageAnalyticsExplorerClient";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Usage Analytics Explorer - Track User Behavior & Events | Multi Tool Platform",
  description: "Comprehensive usage analytics dashboard for tracking user behavior, events, page views, and conversion metrics. Real-time analytics with advanced filtering, segmentation, and data export capabilities.",
  keywords: [
    "usage analytics",
    "user behavior tracking",
    "event analytics",
    "page view analytics",
    "conversion tracking",
    "user engagement metrics",
    "analytics dashboard",
    "real-time analytics",
    "user segmentation",
    "behavior analysis",
    "event tracking",
    "analytics reporting",
    "user insights",
    "performance metrics",
    "conversion funnel",
    "cohort analysis",
    "retention analytics",
    "user journey mapping",
    "click tracking",
    "interaction analytics",
    "web analytics",
    "product analytics",
    "user experience analytics",
    "engagement metrics",
    "behavioral analytics",
    "conversion optimization",
    "analytics platform",
    "data visualization",
    "user flow analysis",
    "session tracking",
    "event funnel",
    "user retention",
    "cohort tracking",
    "analytics insights"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multitoolplatform.com"),
  alternates: {
    canonical: "/tools/usage-analytics",
  },
  openGraph: {
    title: "Usage Analytics Explorer - Track User Behavior & Events | Multi Tool Platform",
    description: "Comprehensive usage analytics dashboard for tracking user behavior, events, page views, and conversion metrics with real-time insights.",
    url: "/tools/usage-analytics",
    siteName: "Multi Tool Platform",
    images: [
      {
        url: "/og-usage-analytics.jpg",
        width: 1200,
        height: 630,
        alt: "Usage Analytics Explorer Tool",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Usage Analytics Explorer - Track User Behavior & Events",
    description: "Comprehensive usage analytics dashboard for tracking user behavior, events, and conversion metrics with real-time insights.",
    images: ["/og-usage-analytics.jpg"],
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
  category: "analytics tools",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Usage Analytics Explorer",
  "description": "Comprehensive usage analytics dashboard for tracking user behavior, events, page views, and conversion metrics with real-time insights and advanced filtering.",
  "url": "https://multitoolplatform.com/tools/usage-analytics",
  "applicationCategory": "AnalyticsSoftware",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
  },
  "featureList": [
    "Real-time event tracking",
    "User behavior analysis",
    "Page view analytics",
    "Conversion funnel tracking",
    "Advanced filtering and segmentation",
    "Custom event definitions",
    "Data export capabilities",
    "Interactive dashboards",
    "Performance metrics monitoring",
    "User journey mapping",
    "Cohort analysis",
    "Retention tracking",
    "Click tracking",
    "Interaction analytics",
    "Custom reporting",
    "Real-time alerts",
    "Historical data analysis",
    "Multi-channel tracking"
  ],
  "screenshot": "/og-usage-analytics.jpg",
  "author": {
    "@type": "Organization",
    "name": "Multi Tool Platform",
  },
  "publisher": {
    "@type": "Organization",
    "name": "Multi Tool Platform",
  },
  "datePublished": new Date().toISOString().split('T')[0],
  "dateModified": new Date().toISOString().split('T')[0]
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
      "name": "Usage Analytics Explorer",
      "item": "https://multitoolplatform.com/tools/usage-analytics"
    }
  ]
};

export default function UsageAnalyticsPage() {
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
            Usage Analytics Explorer
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Comprehensive analytics dashboard for tracking user behavior, events, page views, and conversion metrics.
            Real-time insights with advanced filtering, segmentation, and data visualization capabilities for
            understanding user engagement and optimizing product performance.
          </p>

          {/* Key Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold mb-1">Real-time Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Monitor user behavior and events in real-time with live dashboards
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-semibold mb-1">Event Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Track custom events, user interactions, and conversion funnels
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">👥</div>
              <h3 className="font-semibold mb-1">User Segmentation</h3>
              <p className="text-sm text-muted-foreground">
                Segment users by behavior, demographics, and engagement patterns
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">📈</div>
              <h3 className="font-semibold mb-1">Conversion Insights</h3>
              <p className="text-sm text-muted-foreground">
                Analyze conversion funnels and identify optimization opportunities
              </p>
            </div>
          </div>
        </div>

        {/* Tool Component */}
        <UsageAnalyticsExplorerClient />

        {/* Documentation Section */}
        <div className="mt-16 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">How to Use</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Follow these steps to effectively track and analyze user behavior on your platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Getting Started */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">1. Set Up Event Tracking</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Define key events and user actions to track</p>
                  <p>• Configure event properties and metadata</p>
                  <p>• Set up conversion goals and funnels</p>
                  <p>• Implement tracking across your platform</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">2. Configure Dashboards</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Create custom dashboard layouts</p>
                  <p>• Add relevant charts and visualizations</p>
                  <p>• Set up real-time data refresh rates</p>
                  <p>• Configure alert thresholds and notifications</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">3. Apply Segmentation</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Create user segments based on behavior</p>
                  <p>• Define cohort groups for analysis</p>
                  <p>• Set up custom user properties</p>
                  <p>• Apply filters for targeted insights</p>
                </div>
              </div>
            </div>

            {/* Advanced Features */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">4. Analyze User Journeys</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Map user flow through your platform</p>
                  <p>• Identify drop-off points and bottlenecks</p>
                  <p>• Analyze conversion funnel performance</p>
                  <p>• Track user retention and engagement</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">5. Generate Reports</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Create automated report schedules</p>
                  <p>• Export data in multiple formats</p>
                  <p>• Share insights with stakeholders</p>
                  <p>• Build custom report templates</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">6. Optimize Performance</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Monitor system performance metrics</p>
                  <p>• Identify optimization opportunities</p>
                  <p>• A/B test changes and improvements</p>
                  <p>• Track impact of optimizations over time</p>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Capabilities */}
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Analytics Capabilities & Features</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">RT</span>
                </div>
                <div>
                  <div className="font-medium">Real-time Analytics</div>
                  <div className="text-sm text-muted-foreground">Live data streaming and instant updates</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">EV</span>
                </div>
                <div>
                  <div className="font-medium">Event Tracking</div>
                  <div className="text-sm text-muted-foreground">Custom events with rich properties</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-purple-600 dark:text-purple-400">SEG</span>
                </div>
                <div>
                  <div className="font-medium">User Segmentation</div>
                  <div className="text-sm text-muted-foreground">Advanced user grouping and filtering</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-orange-600 dark:text-orange-400">FUN</span>
                </div>
                <div>
                  <div className="font-medium">Conversion Funnels</div>
                  <div className="text-sm text-muted-foreground">Multi-step conversion analysis</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">COH</span>
                </div>
                <div>
                  <div className="font-medium">Cohort Analysis</div>
                  <div className="text-sm text-muted-foreground">User behavior over time periods</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">RET</span>
                </div>
                <div>
                  <div className="font-medium">Retention Tracking</div>
                  <div className="text-sm text-muted-foreground">User retention and churn analysis</div>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center">How It Works</h3>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📡</span>
                </div>
                <h4 className="font-semibold mb-2">1. Data Collection</h4>
                <p className="text-sm text-muted-foreground">
                  Automatically collect user interactions, events, and behavior data
                  from your platform with comprehensive tracking capabilities.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h4 className="font-semibold mb-2">2. Data Processing</h4>
                <p className="text-sm text-muted-foreground">
                  Process and analyze collected data using advanced algorithms to
                  extract meaningful insights and identify patterns.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h4 className="font-semibold mb-2">3. Insights & Action</h4>
                <p className="text-sm text-muted-foreground">
                  Generate actionable insights through interactive dashboards and
                  visualizations to drive data-informed decisions.
                </p>
              </div>
            </div>
          </div>

          {/* Use Cases */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Common Use Cases</h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Product Optimization</h4>
                <p className="text-sm text-muted-foreground">
                  Identify user pain points, feature usage patterns, and optimization
                  opportunities to improve product experience and engagement.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Conversion Optimization</h4>
                <p className="text-sm text-muted-foreground">
                  Analyze conversion funnels, identify drop-off points, and test
                  improvements to increase conversion rates and revenue.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">User Experience Research</h4>
                <p className="text-sm text-muted-foreground">
                  Understand how users interact with your platform, identify usability
                  issues, and validate design decisions with real user data.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Marketing Campaign Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Track campaign performance, user acquisition channels, and marketing
                  attribution to optimize marketing spend and strategies.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Feature Adoption Tracking</h4>
                <p className="text-sm text-muted-foreground">
                  Monitor how new features are adopted, identify power users, and
                  understand feature usage patterns across user segments.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Customer Success Metrics</h4>
                <p className="text-sm text-muted-foreground">
                  Track customer engagement, product usage, and satisfaction metrics
                  to improve customer success and reduce churn.
                </p>
              </div>
            </div>
          </div>

          {/* Best Practices */}
          <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <div className="text-blue-600 dark:text-blue-400 mt-0.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Analytics Implementation Best Practices
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
                  <div>
                    <strong>Privacy First:</strong> Implement proper user consent, data anonymization, and comply with privacy regulations like GDPR.
                  </div>
                  <div>
                    <strong>Event Naming:</strong> Use consistent, descriptive event names and properties for better analysis and reporting.
                  </div>
                  <div>
                    <strong>Data Quality:</strong> Regularly audit and validate your tracking implementation to ensure data accuracy.
                  </div>
                  <div>
                    <strong>Sampling Strategy:</strong> Use appropriate sampling for high-traffic applications to balance data volume and performance.
                  </div>
                  <div>
                    <strong>Cross-Platform Tracking:</strong> Implement consistent user identification across web, mobile, and other platforms.
                  </div>
                  <div>
                    <strong>Alert Configuration:</strong> Set up meaningful alerts for important metrics and anomalies without alert fatigue.
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
                <h4 className="font-medium mb-2">What types of events can I track?</h4>
                <p className="text-sm text-muted-foreground">
                  You can track any user interactions including page views, button clicks, form submissions,
                  downloads, purchases, video plays, search queries, and custom business events with rich properties.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">How do I ensure user privacy and data security?</h4>
                <p className="text-sm text-muted-foreground">
                  The platform includes privacy controls, data anonymization, consent management, and compliance
                  with regulations like GDPR and CCPA. You can configure data retention policies and user deletion.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Can I track users across different devices and sessions?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, you can implement cross-device tracking using user IDs, authenticated sessions, or
                  probabilistic methods. The platform supports user journey mapping across multiple touchpoints.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">What data export options are available?</h4>
                <p className="text-sm text-muted-foreground">
                  Data can be exported in CSV, JSON, Excel, and Parquet formats. You can also set up automated
                  exports, API access, and integrations with data warehouses and BI tools.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">How does real-time analytics work?</h4>
                <p className="text-sm text-muted-foreground">
                  Real-time analytics processes events as they occur with sub-second latency. You can configure
                  real-time dashboards, alerts, and streaming data pipelines for immediate insights.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Can I create custom dashboards and reports?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, the platform offers fully customizable dashboards with drag-and-drop widgets, custom metrics,
                  and automated report generation. You can save templates and share dashboards with your team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


