import { Metadata } from "next";
import DatabaseQueryRunnerClient from "@/components/tools/database-query-runner-client";
import ScrollToQueryButton from "@/components/ui/scroll-to-query-button";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Database Query Runner - Execute SQL Queries with EXPLAIN Plans | Multi-Tool Platform",
  description: "Free online database query runner for PostgreSQL and MySQL. Execute SQL queries, view EXPLAIN plans, format queries, and export results. Safe read-only sandbox environment for database testing and optimization.",
  keywords: [
    "database query runner",
    "SQL executor",
    "PostgreSQL query",
    "MySQL query",
    "EXPLAIN plan",
    "SQL formatter",
    "database testing",
    "query optimization",
    "SQL execution",
    "database sandbox",
    "read-only queries",
    "SQL analyzer",
    "query performance",
    "database optimization",
    "SQL debugging",
    "index analysis",
    "query execution plan"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multitoolplatform.com"),
  alternates: {
    canonical: "/tools/database-query-runner",
  },
  openGraph: {
    title: "Database Query Runner - Execute SQL Queries with EXPLAIN Plans",
    description: "Run SQL queries on PostgreSQL and MySQL databases with EXPLAIN plans, query formatting, and result export. Safe read-only environment for database testing and optimization.",
    url: "/tools/database-query-runner",
    siteName: "Multi Tool Platform",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-database-query-runner.png",
        width: 1200,
        height: 630,
        alt: "Database Query Runner Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Database Query Runner - Execute SQL Queries with EXPLAIN Plans",
    description: "Run SQL queries on PostgreSQL and MySQL databases with EXPLAIN plans, query formatting, and result export. Safe read-only environment for database testing.",
    images: ["/og-database-query-runner.png"],
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

export default function DatabaseQueryRunnerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Database Query Runner",
    "description": "Advanced online database query runner for PostgreSQL and MySQL with EXPLAIN plan analysis, SQL formatting, query optimization, and safe read-only execution environment.",
    "url": "https://multitoolplatform.com/tools/database-query-runner",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "PostgreSQL and MySQL database support with native query execution",
      "Comprehensive EXPLAIN plan analysis for query optimization",
      "Advanced SQL query formatting and beautification",
      "CSV and JSON export of query results",
      "Read-only sandbox environment for maximum security",
      "Query execution timing and performance metrics",
      "Sample database with common schema for testing",
      "Real-time query validation and syntax highlighting",
      "Index usage analysis and optimization suggestions",
      "Query history and bookmarking for repeated testing",
      "Multi-tab interface for comparing query variations",
      "Database schema exploration and visualization"
    ],
    "screenshot": "/og-database-query-runner.png",
    "author": {
      "@type": "Organization",
      "name": "Multi-Tool Platform",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Multi-Tool Platform",
    },
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
        "name": "Database Query Runner",
        "item": "https://multitoolplatform.com/tools/database-query-runner"
      }
    ]
  };

  return (
    <>
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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
              Database Query Runner
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Execute SQL queries on PostgreSQL and MySQL databases with EXPLAIN plans, query formatting, and result export.
              Safe read-only environment for database testing, optimization, and learning.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                SQL Execution
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                EXPLAIN Plans
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Query Optimization
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                Read-Only Safety
              </span>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Multi-Database Support</h3>
              <p className="text-muted-foreground">
                Native support for PostgreSQL and MySQL with optimized query execution, proper data type handling, and database-specific features.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">EXPLAIN Plan Analysis</h3>
              <p className="text-muted-foreground">
                Detailed execution plan analysis showing index usage, cost estimates, table scans, and optimization opportunities for query performance.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0V1m10 3V1m0 3l1 1v16a2 2 0 01-2 2H6a2 2 0 01-2-2V5l1-1z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">SQL Formatting</h3>
              <p className="text-muted-foreground">
                Professional SQL formatting with proper indentation, keyword capitalization, and readability improvements for better code maintenance.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Export Results</h3>
              <p className="text-muted-foreground">
                Export query results in multiple formats including CSV, JSON, and SQL for further analysis, reporting, or data migration.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Read-Only Security</h3>
              <p className="text-muted-foreground">
                Completely safe environment with read-only operations, query validation, timeout protection, and no data modification capabilities.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Performance Metrics</h3>
              <p className="text-muted-foreground">
                Detailed execution timing, row counts, data transfer sizes, and performance insights to optimize query efficiency and database performance.
              </p>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6">How to Test Database Queries</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">1. Select Database</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Choose PostgreSQL or MySQL</li>
                  <li>• Use sample database or connect to your own</li>
                  <li>• Explore available tables and schemas</li>
                  <li>• Review table structures and relationships</li>
                  <li>• Understand data types and constraints</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">2. Write & Format Query</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Write your SQL SELECT statement</li>
                  <li>• Use syntax highlighting for better readability</li>
                  <li>• Format query for professional appearance</li>
                  <li>• Validate syntax before execution</li>
                  <li>• Save queries for future use</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">3. Analyze Performance</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Run EXPLAIN to see execution plan</li>
                  <li>• Check index usage and table scans</li>
                  <li>• Review cost estimates and timing</li>
                  <li>• Identify optimization opportunities</li>
                  <li>• Compare different query approaches</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">4. Export & Share</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• View formatted query results</li>
                  <li>• Export data as CSV or JSON</li>
                  <li>• Copy queries for documentation</li>
                  <li>• Share execution plans with team</li>
                  <li>• Generate performance reports</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Test Your SQL Queries?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Start executing SQL queries with EXPLAIN plan analysis in our safe, read-only environment.
              Optimize performance and learn database best practices instantly.
            </p>
            <ScrollToQueryButton className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Query Testing
            </ScrollToQueryButton>
          </div>

          {/* Database Query Runner Component */}
          <div className="mb-12">
            <DatabaseQueryRunnerClient />
          </div>

          {/* Educational Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* About Database Query Testing */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4">About Database Query Execution</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p>
                  Test and analyze your SQL queries with our comprehensive database query runner. Execute SELECT statements, view EXPLAIN plans for performance analysis,
                  format queries for better readability, and export results for further analysis. All operations are read-only for maximum security.
                </p>

                <h3>Supported Database Engines</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">PostgreSQL</h4>
                    <p className="text-sm text-muted-foreground">
                      Advanced open-source relational database with powerful features like JSON support, advanced indexing, window functions, and comprehensive EXPLAIN plans.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">MySQL</h4>
                    <p className="text-sm text-muted-foreground">
                      Popular open-source relational database known for its speed, reliability, and ease of use. Supports comprehensive EXPLAIN analysis and optimization.
                    </p>
                  </div>
                </div>

                <h3>EXPLAIN Plan Analysis</h3>
                <ul>
                  <li><strong>Execution Strategy:</strong> Understand how the database plans to execute your query</li>
                  <li><strong>Index Usage:</strong> See which indexes are being used and which are missing</li>
                  <li><strong>Cost Estimation:</strong> View the database's cost estimates for operations</li>
                  <li><strong>Performance Insights:</strong> Identify bottlenecks and optimization opportunities</li>
                  <li><strong>Table Scans:</strong> Detect expensive full table scans vs index lookups</li>
                </ul>
              </div>
            </div>

            {/* Security & Best Practices */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Security & Best Practices</h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Read-Only Safety</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• No data modification allowed</li>
                    <li>• Query validation prevents dangerous operations</li>
                    <li>• Timeout protection for long queries</li>
                    <li>• Connection limits prevent resource exhaustion</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Query Optimization</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Always use EXPLAIN for complex queries</li>
                    <li>• Test with LIMIT to avoid large result sets</li>
                    <li>• Use proper indexing for performance</li>
                    <li>• Avoid SELECT * in production</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950 dark:to-violet-900 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Performance Monitoring</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Monitor query execution times</li>
                    <li>• Check index usage in EXPLAIN plans</li>
                    <li>• Identify expensive operations</li>
                    <li>• Compare query variations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">How Database Query Testing Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold mb-2">Select Database</h3>
                <p className="text-muted-foreground">
                  Choose PostgreSQL or MySQL and explore the sample database schema with tables, relationships, and sample data.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold mb-2">Write Query</h3>
                <p className="text-muted-foreground">
                  Compose your SQL SELECT statement with syntax highlighting, formatting, and real-time validation.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold mb-2">Analyze & Execute</h3>
                <p className="text-muted-foreground">
                  Run EXPLAIN to analyze the execution plan, then execute the query to see results and performance metrics.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  4
                </div>
                <h3 className="text-lg font-semibold mb-2">Optimize & Export</h3>
                <p className="text-muted-foreground">
                  Review performance insights, optimize queries, and export results in your preferred format.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-card rounded-lg p-8 border mt-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What databases are supported?</h3>
                <p className="text-muted-foreground">
                  We support PostgreSQL and MySQL databases with native query execution. Each database engine has its own optimized execution environment
                  and supports database-specific features like PostgreSQL's advanced JSON functions or MySQL's various storage engines.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Is the environment safe for testing?</h3>
                <p className="text-muted-foreground">
                  Yes, completely safe! All operations are read-only, meaning you can only execute SELECT statements. There's no risk of data modification,
                  deletion, or any other destructive operations. Query validation prevents potentially harmful statements.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">What is an EXPLAIN plan?</h3>
                <p className="text-muted-foreground">
                  An EXPLAIN plan shows how the database plans to execute your query. It reveals which indexes are used, whether table scans occur,
                  cost estimates, and potential optimization opportunities. This is crucial for understanding and improving query performance.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I export query results?</h3>
                <p className="text-muted-foreground">
                  Yes! You can export query results in multiple formats including CSV for spreadsheet analysis, JSON for programmatic processing,
                  and formatted SQL for documentation or sharing with your team.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">How do I optimize slow queries?</h3>
                <p className="text-muted-foreground">
                  Use the EXPLAIN feature to analyze your query execution plan. Look for table scans (which are slow), missing indexes,
                  and high cost estimates. Consider adding appropriate indexes, rewriting joins, or restructuring complex queries for better performance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}