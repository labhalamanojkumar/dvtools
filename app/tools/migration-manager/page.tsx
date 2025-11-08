import { Metadata } from "next";
import MigrationManagerClient from "@/components/tools/migration-manager-client";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Migration Manager - Database Migration Tool | Multi-Tool Platform",
  description: "Manage database migrations with preview, execution, and rollback capabilities. Support for PostgreSQL and MySQL databases with SQL script validation and version control.",
  keywords: [
    "database migration",
    "PostgreSQL migration",
    "MySQL migration",
    "database schema",
    "migration rollback",
    "SQL migration",
    "database versioning",
    "schema migration tool",
    "database deployment",
    "migration scripts"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multi-tool-platform.com"),
  alternates: {
    canonical: "/tools/migration-manager",
  },
  openGraph: {
    title: "Migration Manager - Database Migration Tool",
    description: "Manage database migrations with preview, execution, and rollback capabilities. Support for PostgreSQL and MySQL databases.",
    url: "/tools/migration-manager",
    siteName: "Multi-Tool Platform",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-migration-manager.png",
        width: 1200,
        height: 630,
        alt: "Migration Manager Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Migration Manager - Database Migration Tool",
    description: "Manage database migrations with preview, execution, and rollback capabilities.",
    images: ["/og-migration-manager.png"],
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
  category: "database tools",
};

export default function MigrationManagerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Migration Manager",
    "description": "Database migration management tool with preview, execution, and rollback capabilities for PostgreSQL and MySQL databases.",
    "url": "https://multi-tool-platform.com/tools/migration-manager",
    "applicationCategory": "DatabaseManagementSoftware",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "Database migration creation",
      "Migration preview and validation",
      "Migration execution with rollback",
      "PostgreSQL and MySQL support",
      "SQL script management",
      "Migration history tracking",
      "Schema versioning",
      "Database deployment automation"
    ],
    "screenshot": "/og-migration-manager.png",
    "author": {
      "@type": "Organization",
      "name": "Multi-Tool Platform",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Multi-Tool Platform",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
              Migration Manager
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Professional database migration management tool with preview, execution, and rollback capabilities.
              Supports PostgreSQL and MySQL databases with comprehensive SQL script validation.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                PostgreSQL
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                MySQL
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Migration Preview
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Rollback Support
              </span>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Migration Creation</h3>
              <p className="text-muted-foreground">
                Create database migrations with up and down scripts. Define schema changes with proper SQL syntax validation.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Migration Preview</h3>
              <p className="text-muted-foreground">
                Preview migration scripts before execution. Validate SQL syntax and review changes before applying to database.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Rollback Support</h3>
              <p className="text-muted-foreground">
                Safely rollback migrations with down scripts. Maintain database integrity with proper rollback procedures.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Multi-Database Support</h3>
              <p className="text-muted-foreground">
                Support for PostgreSQL and MySQL databases. Connect to any database instance with SSL support.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Migration History</h3>
              <p className="text-muted-foreground">
                Track migration execution history with timestamps. Monitor migration status and execution results.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Execution</h3>
              <p className="text-muted-foreground">
                Execute migrations securely with proper error handling. Validate connections and SQL syntax before execution.
              </p>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6">How to Use Migration Manager</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">1. Configure Database</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Select database type (PostgreSQL/MySQL)</li>
                  <li>• Enter connection details (host, port, database)</li>
                  <li>• Provide authentication credentials</li>
                  <li>• Enable SSL if required</li>
                  <li>• Test connection by loading migrations</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">2. Create Migration</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Enter descriptive migration name</li>
                  <li>• Write up script for schema changes</li>
                  <li>• Write down script for rollback</li>
                  <li>• Preview migration before execution</li>
                  <li>• Execute or save migration</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">3. Manage Migrations</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• View migration history and status</li>
                  <li>• Rollback executed migrations</li>
                  <li>• Track execution timestamps</li>
                  <li>• Monitor migration checksums</li>
                  <li>• Export migration scripts</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">4. Best Practices</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Always write down scripts</li>
                  <li>• Test migrations on staging first</li>
                  <li>• Use descriptive migration names</li>
                  <li>• Backup database before migration</li>
                  <li>• Validate SQL syntax before execution</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Migration Manager Component */}
          <MigrationManagerClient />

          {/* FAQ Section */}
          <div className="bg-card rounded-lg p-8 border mt-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What databases are supported?</h3>
                <p className="text-muted-foreground">
                  Migration Manager supports PostgreSQL and MySQL databases. Both databases offer full migration management capabilities including preview, execution, and rollback.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Are migrations reversible?</h3>
                <p className="text-muted-foreground">
                  Yes, migrations can be rolled back if they include a down script. The down script defines how to undo the changes made by the up script.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Is my data safe?</h3>
                <p className="text-muted-foreground">
                  Migration Manager executes migrations directly on your database. While we validate SQL syntax, we recommend backing up your database before running migrations in production.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I preview migrations before execution?</h3>
                <p className="text-muted-foreground">
                  Yes, you can preview migration scripts to see exactly what SQL statements will be executed. This helps validate your migration logic before applying changes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}