import { Metadata } from "next";
import BackgroundJobDebuggerClient from "@/components/tools/background-job-debugger-client";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Background Job Debugger - Multi-Tool Platform",
  description: "Debug and manage background job queues with Redis. Inspect Bull queues, view job details, retry failed jobs, and monitor queue performance in real-time.",
  keywords: [
    "background job debugger",
    "redis queue inspector",
    "bull queue manager",
    "job queue monitoring",
    "redis job debugging",
    "background job management",
    "queue performance monitoring",
    "failed job retry",
    "job queue cleanup",
    "redis bull debugger"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multitoolplatform.com"),
  alternates: {
    canonical: "/tools/background-job-debugger",
  },
  openGraph: {
    title: "Background Job Debugger - Debug Redis Queues",
    description: "Powerful Redis queue debugging tool for Bull job queues. Monitor, inspect, and manage background jobs with real-time queue statistics.",
    url: "/tools/background-job-debugger",
    siteName: "Multi-Tool Platform",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-background-job-debugger.jpg",
        width: 1200,
        height: 630,
        alt: "Background Job Debugger - Redis Queue Management",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Background Job Debugger - Redis Queue Inspector",
    description: "Debug and manage Redis Bull queues. Monitor job performance, retry failed jobs, and clean up completed tasks.",
    images: ["/og-background-job-debugger.jpg"],
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
  "name": "Background Job Debugger",
  "description": "Debug and manage background job queues with Redis. Inspect Bull queues, view job details, retry failed jobs, and monitor queue performance.",
  "url": "https://multitoolplatform.com/tools/background-job-debugger",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
  },
  "featureList": [
    "Redis queue inspection",
    "Real-time job monitoring",
    "Failed job retry functionality",
    "Queue cleanup operations",
    "Job details viewer",
    "Multi-queue support",
    "Bull queue compatibility",
    "Performance metrics",
    "Queue health monitoring",
    "Job progress tracking",
    "Bulk job operations",
    "Queue statistics dashboard"
  ],
  "screenshot": "/og-background-job-debugger.jpg",
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
      "name": "Background Job Debugger",
      "item": "https://multitoolplatform.com/tools/background-job-debugger"
    }
  ]
};

export default function BackgroundJobDebuggerPage() {
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
            Background Job Debugger
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Debug and manage your Redis-based background job queues. Inspect Bull queues,
            monitor job performance, retry failed jobs, and maintain queue health with
            real-time monitoring and management tools.
          </p>

          {/* Key Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">🔍</div>
              <h3 className="font-semibold mb-1">Queue Inspection</h3>
              <p className="text-sm text-muted-foreground">
                Deep dive into Redis queues and job states
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold mb-1">Real-time Monitoring</h3>
              <p className="text-sm text-muted-foreground">
                Live queue statistics and job progress tracking
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">🔄</div>
              <h3 className="font-semibold mb-1">Job Management</h3>
              <p className="text-sm text-muted-foreground">
                Retry failed jobs and manage queue operations
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">🧹</div>
              <h3 className="font-semibold mb-1">Queue Maintenance</h3>
              <p className="text-sm text-muted-foreground">
                Clean up completed and failed jobs efficiently
              </p>
            </div>
          </div>
        </div>

        {/* Tool Component */}
        <BackgroundJobDebuggerClient />

        {/* Documentation Section */}
        <div className="mt-16 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">How to Use</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Follow these steps to effectively debug and manage your background job queues
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Getting Started */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">1. Connect to Redis</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Enter your Redis connection details (host, port, password, database)</p>
                  <p>• Enable TLS if your Redis instance uses SSL/TLS encryption</p>
                  <p>• Click &quot;Connect&quot; to establish the connection</p>
                  <p>• The tool will automatically discover all available queues</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">2. Explore Queues</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• View all discovered queues with their current statistics</p>
                  <p>• See counts for waiting, active, completed, failed, and delayed jobs</p>
                  <p>• Click on queue cards to explore jobs in different states</p>
                  <p>• Use the refresh button to get updated queue information</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">3. Inspect Jobs</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Select a queue and choose a job state (waiting, active, completed, failed, delayed)</p>
                  <p>• Browse through jobs with pagination support</p>
                  <p>• View job progress, attempts made, and timestamps</p>
                  <p>• Click the eye icon to see detailed job information</p>
                </div>
              </div>
            </div>

            {/* Advanced Features */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">4. Job Management</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Retry failed jobs by clicking the play button</p>
                  <p>• Permanently delete jobs using the trash icon</p>
                  <p>• View detailed job data, options, and error information</p>
                  <p>• Monitor job progress and execution history</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">5. Queue Maintenance</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Clean up completed jobs to free up Redis memory</p>
                  <p>• Remove failed jobs that are no longer needed</p>
                  <p>• Bulk operations for efficient queue management</p>
                  <p>• Monitor queue performance and health metrics</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">6. Best Practices</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Regularly clean up completed and old failed jobs</p>
                  <p>• Monitor queue lengths to prevent memory issues</p>
                  <p>• Set up alerts for high failure rates</p>
                  <p>• Use appropriate retry strategies for failed jobs</p>
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
                  <span className="text-2xl">🔗</span>
                </div>
                <h4 className="font-semibold mb-2">1. Connect</h4>
                <p className="text-sm text-muted-foreground">
                  Establish secure connection to your Redis instance
                  and authenticate with your credentials.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h4 className="font-semibold mb-2">2. Discover</h4>
                <p className="text-sm text-muted-foreground">
                  Automatically scan and identify all Bull queues
                  with their current job states and statistics.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚙️</span>
                </div>
                <h4 className="font-semibold mb-2">3. Manage</h4>
                <p className="text-sm text-muted-foreground">
                  Inspect jobs, retry failures, clean up queues,
                  and monitor performance in real-time.
                </p>
              </div>
            </div>
          </div>

          {/* Use Cases */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Common Use Cases</h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Development Debugging</h4>
                <p className="text-sm text-muted-foreground">
                  Debug background job processing during development.
                  Inspect job data, monitor execution flow, and identify bottlenecks.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Production Monitoring</h4>
                <p className="text-sm text-muted-foreground">
                  Monitor queue health and job processing in production.
                  Set up alerts for failed jobs and performance issues.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Job Recovery</h4>
                <p className="text-sm text-muted-foreground">
                  Recover from job failures by retrying failed jobs
                  with different parameters or fixing underlying issues.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Queue Maintenance</h4>
                <p className="text-sm text-muted-foreground">
                  Perform regular cleanup of completed and failed jobs
                  to maintain optimal Redis memory usage and performance.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Performance Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Analyze job processing times, failure rates, and queue
                  throughput to optimize background job performance.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Incident Response</h4>
                <p className="text-sm text-muted-foreground">
                  Quickly respond to job processing incidents by inspecting
                  failed jobs and taking corrective actions.
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
                  Background Job Management Best Practices
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
                  <div>
                    <strong>Regular Monitoring:</strong> Monitor queue lengths and job failure rates continuously to catch issues early.
                  </div>
                  <div>
                    <strong>Proper Cleanup:</strong> Regularly clean up completed and old failed jobs to prevent memory bloat.
                  </div>
                  <div>
                    <strong>Retry Strategies:</strong> Implement appropriate retry logic with exponential backoff for transient failures.
                  </div>
                  <div>
                    <strong>Security First:</strong> Never expose Redis ports publicly and always use authentication and TLS.
                  </div>
                  <div>
                    <strong>Performance Tuning:</strong> Monitor job processing times and optimize slow jobs to improve throughput.
                  </div>
                  <div>
                    <strong>Error Handling:</strong> Implement comprehensive error handling and logging for better debugging.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Supported Frameworks */}
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Supported Job Queue Frameworks</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold">B</span>
                </div>
                <div>
                  <div className="font-medium">Bull</div>
                  <div className="text-sm text-muted-foreground">Primary support</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold">B4</span>
                </div>
                <div>
                  <div className="font-medium">Bull 4.x</div>
                  <div className="text-sm text-muted-foreground">Latest version</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold">R</span>
                </div>
                <div>
                  <div className="font-medium">Redis</div>
                  <div className="text-sm text-muted-foreground">Direct Redis support</div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-yellow-50 dark:bg-yellow-950/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start gap-3">
              <div className="text-yellow-600 dark:text-yellow-400 mt-0.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  Security Notice
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  This tool requires direct access to your Redis instance. Ensure your Redis server is properly secured with authentication and network restrictions. Never expose Redis ports publicly without proper security measures in place.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Frequently Asked Questions</h3>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">What Redis configurations are supported?</h4>
                <p className="text-sm text-muted-foreground">
                  The tool supports standard Redis configurations including password authentication, custom databases, and TLS/SSL encryption. Both single-node and clustered Redis setups are compatible.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Can I monitor multiple queues simultaneously?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, the tool automatically discovers and displays all queues in your Redis instance. You can switch between queues and monitor their statistics in real-time.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">What job states can I inspect?</h4>
                <p className="text-sm text-muted-foreground">
                  You can view jobs in all standard Bull queue states: waiting, active, completed, failed, and delayed. Each state provides different insights into your job processing pipeline.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Is there a limit to how many jobs I can view?</h4>
                <p className="text-sm text-muted-foreground">
                  By default, the tool shows up to 50 jobs per state. You can adjust this limit in the interface to view more jobs if needed, though larger result sets may impact performance.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Can I modify job data or options?</h4>
                <p className="text-sm text-muted-foreground">
                  The tool provides read-only access to job data for safety. You can retry failed jobs or delete them, but job data and options cannot be modified to prevent accidental corruption of your job queue.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}