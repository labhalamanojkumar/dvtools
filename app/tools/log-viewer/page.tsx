import { Metadata } from 'next';
import LogViewerSearchClient from '@/components/tools/LogViewerSearchClient';
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: 'Advanced Log Viewer & Search Tool | Free Online Log Analysis',
  description: 'Powerful log viewer and search tool for developers. Analyze, filter, and search through application logs with advanced features like real-time monitoring, regex search, and export capabilities.',
  keywords: [
    'log viewer',
    'log analyzer',
    'log search',
    'application logs',
    'log monitoring',
    'log parser',
    'debugging tool',
    'log analysis',
    'server logs',
    'error logs',
    'log filtering',
    'log export',
    'regex search',
    'log management',
    'log aggregation',
    'log parsing',
    'log search tool',
    'application debugging',
    'log file analyzer',
    'system logs',
    'access logs',
    'error tracking',
    'log correlation',
    'log visualization',
    'log insights',
    'performance monitoring',
    'troubleshooting tool'
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://multitoolplatform.com'),
  alternates: {
    canonical: '/tools/log-viewer',
  },
  openGraph: {
    title: 'Advanced Log Viewer & Search Tool | Free Online Log Analysis',
    description: 'Powerful log viewer and search tool for developers. Analyze, filter, and search through application logs with real-time monitoring, regex search, and export capabilities.',
    url: '/tools/log-viewer',
    siteName: 'Multi Tool Platform',
    images: [
      {
        url: '/og-log-viewer.jpg',
        width: 1200,
        height: 630,
        alt: 'Advanced Log Viewer & Search Tool',
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Advanced Log Viewer & Search Tool',
    description: 'Powerful log viewer and search tool for developers. Analyze, filter, and search through application logs with advanced features.',
    images: ['/og-log-viewer.jpg'],
    creator: "@multitoolplatform",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: "developer tools",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Advanced Log Viewer & Search Tool",
  "description": "Powerful log viewer and search tool for developers. Analyze, filter, and search through application logs with advanced features like real-time monitoring, regex search, and export capabilities.",
  "url": "https://multitoolplatform.com/tools/log-viewer",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
  },
  "featureList": [
    "Real-time log monitoring",
    "Advanced search and filtering",
    "Regex pattern matching",
    "Log parsing and analysis",
    "Export capabilities",
    "Error tracking and alerts",
    "Log correlation",
    "Performance insights",
    "Multi-format support",
    "Historical log analysis"
  ],
  "screenshot": "/og-log-viewer.jpg",
  "author": {
    "@type": "Organization",
    "name": "Multi Tool Platform",
  },
  "publisher": {
    "@type": "Organization",
    "name": "Multi Tool Platform",
  },
  "datePublished": new Date().toISOString().split('T')[0],
  "dateModified": new Date().toISOString().split('T')[0],
};

export default function LogViewerPage() {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            Advanced Log Viewer & Search Tool
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Powerful log analysis tool for developers and system administrators. Parse, search,
            filter, and analyze application logs with advanced features like real-time monitoring,
            regex search, error tracking, and comprehensive export capabilities.
          </p>

          {/* Key Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">🔍</div>
              <h3 className="font-semibold mb-1">Advanced Search</h3>
              <p className="text-sm text-muted-foreground">
                Powerful search with regex patterns and filters
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold mb-1">Real-time Monitoring</h3>
              <p className="text-sm text-muted-foreground">
                Live log streaming and instant updates
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">🔧</div>
              <h3 className="font-semibold mb-1">Log Parsing</h3>
              <p className="text-sm text-muted-foreground">
                Intelligent parsing of various log formats
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">📤</div>
              <h3 className="font-semibold mb-1">Export & Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Export filtered logs and generate insights
              </p>
            </div>
          </div>
        </div>

        {/* Tool Component */}
        <LogViewerSearchClient />

        {/* Documentation Section */}
        <div className="mt-16 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">How to Use</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Follow these steps to effectively analyze and troubleshoot your application logs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Getting Started */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">1. Upload Log Files</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Drag and drop log files or click to browse</p>
                  <p>• Support for .log, .txt, and compressed files</p>
                  <p>• Handle large files with efficient streaming</p>
                  <p>• Automatic encoding detection</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">2. Configure Parsing</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Select log format (Apache, Nginx, JSON, etc.)</p>
                  <p>• Define custom parsing rules if needed</p>
                  <p>• Set timestamp formats and field mappings</p>
                  <p>• Preview parsing results before analysis</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">3. Apply Filters</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Filter by log level (ERROR, WARN, INFO, DEBUG)</p>
                  <p>• Set time range filters for specific periods</p>
                  <p>• Include/exclude specific keywords or patterns</p>
                  <p>• Combine multiple filters for precise results</p>
                </div>
              </div>
            </div>

            {/* Advanced Features */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">4. Search & Analyze</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Use regex patterns for complex searches</p>
                  <p>• Search across multiple fields simultaneously</p>
                  <p>• Highlight matching terms and context</p>
                  <p>• Save frequently used search queries</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">5. Monitor in Real-time</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Connect to live log streams</p>
                  <p>• Set up alerts for specific patterns</p>
                  <p>• Monitor error rates and performance metrics</p>
                  <p>• Get notifications for critical events</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">6. Export & Report</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Export filtered results in various formats</p>
                  <p>• Generate summary reports and statistics</p>
                  <p>• Create visualizations of log patterns</p>
                  <p>• Share findings with your development team</p>
                </div>
              </div>
            </div>
          </div>

          {/* Supported Log Formats */}
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Supported Log Formats & Sources</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">A</span>
                </div>
                <div>
                  <div className="font-medium">Apache/Nginx</div>
                  <div className="text-sm text-muted-foreground">Web server access logs</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">J</span>
                </div>
                <div>
                  <div className="font-medium">JSON Logs</div>
                  <div className="text-sm text-muted-foreground">Structured application logs</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-purple-600 dark:text-purple-400">S</span>
                </div>
                <div>
                  <div className="font-medium">Syslog</div>
                  <div className="text-sm text-muted-foreground">System and application logs</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-orange-600 dark:text-orange-400">C</span>
                </div>
                <div>
                  <div className="font-medium">Custom Format</div>
                  <div className="text-sm text-muted-foreground">Define your own parsing rules</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">D</span>
                </div>
                <div>
                  <div className="font-medium">Database Logs</div>
                  <div className="text-sm text-muted-foreground">SQL and NoSQL query logs</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">A</span>
                </div>
                <div>
                  <div className="font-medium">Application Logs</div>
                  <div className="text-sm text-muted-foreground">Framework-specific logs</div>
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
                  <span className="text-2xl">📤</span>
                </div>
                <h4 className="font-semibold mb-2">1. Ingest & Parse</h4>
                <p className="text-sm text-muted-foreground">
                  Upload or stream log files and automatically parse them using
                  intelligent format detection and custom parsing rules.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h4 className="font-semibold mb-2">2. Search & Filter</h4>
                <p className="text-sm text-muted-foreground">
                  Apply powerful search queries, regex patterns, and filters to
                  quickly find the information you need in large log files.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h4 className="font-semibold mb-2">3. Analyze & Export</h4>
                <p className="text-sm text-muted-foreground">
                  Generate insights, create reports, and export filtered results
                  for further analysis or sharing with your team.
                </p>
              </div>
            </div>
          </div>

          {/* Use Cases */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Common Use Cases</h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Debugging Issues</h4>
                <p className="text-sm text-muted-foreground">
                  Quickly identify error patterns, stack traces, and failure points
                  in your application logs to resolve bugs faster.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Performance Monitoring</h4>
                <p className="text-sm text-muted-foreground">
                  Track response times, throughput, and resource usage patterns
                  to identify performance bottlenecks and optimization opportunities.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Security Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Monitor for suspicious activities, failed authentication attempts,
                  and security-related events in your application logs.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">User Behavior Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Understand how users interact with your application by analyzing
                  access patterns, feature usage, and navigation flows.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Compliance Auditing</h4>
                <p className="text-sm text-muted-foreground">
                  Maintain audit trails and generate compliance reports by analyzing
                  access logs and system events for regulatory requirements.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">System Monitoring</h4>
                <p className="text-sm text-muted-foreground">
                  Monitor system health, resource utilization, and infrastructure
                  performance through comprehensive log analysis and alerting.
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
                  Log Analysis Best Practices
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
                  <div>
                    <strong>Structured Logging:</strong> Use structured logging formats (JSON) for easier parsing and analysis of log data.
                  </div>
                  <div>
                    <strong>Consistent Levels:</strong> Use appropriate log levels (DEBUG, INFO, WARN, ERROR) consistently across your application.
                  </div>
                  <div>
                    <strong>Include Context:</strong> Add relevant context information like user IDs, request IDs, and session data to logs.
                  </div>
                  <div>
                    <strong>Regular Rotation:</strong> Implement log rotation to prevent files from becoming too large and unmanageable.
                  </div>
                  <div>
                    <strong>Security First:</strong> Never log sensitive information like passwords, API keys, or personal data.
                  </div>
                  <div>
                    <strong>Monitor Trends:</strong> Look for patterns and trends in your logs to proactively identify issues before they become critical.
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
                <h4 className="font-medium mb-2">What log formats does the tool support?</h4>
                <p className="text-sm text-muted-foreground">
                  The tool supports common formats including plain text, JSON, Apache/Nginx access logs, syslog,
                  and custom formats. You can also define your own parsing rules for proprietary log formats.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">How large can log files be?</h4>
                <p className="text-sm text-muted-foreground">
                  The tool can handle large files efficiently through streaming and pagination.
                  For extremely large files, consider filtering and searching rather than loading everything at once.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Can I search logs in real-time?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, you can connect to live log streams for real-time monitoring and searching.
                  Set up alerts and notifications for specific patterns or error conditions.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">What regex patterns are supported?</h4>
                <p className="text-sm text-muted-foreground">
                  The tool supports standard JavaScript regex patterns including capture groups,
                  lookaheads, and common regex features for powerful pattern matching in logs.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Is my log data secure?</h4>
                <p className="text-sm text-muted-foreground">
                  Log files are processed locally in your browser and are not uploaded to any servers.
                  Your log data remains private and secure throughout the analysis process.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Can I save my search queries?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, you can save frequently used search queries and filters for quick access.
                  Create custom dashboards with your most important log searches and monitoring views.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
