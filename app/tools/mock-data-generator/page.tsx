import { Metadata } from "next";
import MockDataGeneratorClient from "@/components/tools/MockDataGeneratorClient";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Mock Data Generator - Create Realistic Test Data | Multi Tool Platform",
  description: "Generate realistic mock data for testing APIs, forms, and databases. Create custom schemas with various data types including names, addresses, emails, and more with multiple export formats.",
  keywords: [
    "mock data",
    "test data",
    "fake data",
    "data generator",
    "API testing",
    "database seeding",
    "form testing",
    "dummy data",
    "sample data",
    "data mocking",
    "JSON generator",
    "CSV generator",
    "SQL insert",
    "random data",
    "test fixtures",
    "data seeding",
    "development data",
    "prototype data",
    "faker data",
    "synthetic data",
    "realistic data",
    "test data generation",
    "database testing",
    "API mock data",
    "form data generator",
    "random data generator",
    "sample database",
    "test data sets",
    "data prototyping",
    "development testing",
    "quality assurance data",
    "software testing data",
    "database population",
    "data simulation",
    "artificial data",
    "generated data",
    "data fabrication",
    "test scenarios",
    "data variety",
    "realistic samples"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multitoolplatform.com"),
  alternates: {
    canonical: "/tools/mock-data-generator",
  },
  openGraph: {
    title: "Mock Data Generator - Create Realistic Test Data | Multi Tool Platform",
    description: "Generate realistic mock data for APIs, forms, and databases with custom schemas and multiple export formats.",
    url: "/tools/mock-data-generator",
    siteName: "Multi Tool Platform",
    images: [
      {
        url: "/og-mock-data.jpg",
        width: 1200,
        height: 630,
        alt: "Mock Data Generator Tool",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mock Data Generator - Create Realistic Test Data",
    description: "Generate realistic mock data for APIs, forms, and databases with custom schemas and multiple export formats.",
    images: ["/og-mock-data.jpg"],
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
  category: "data tools",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Mock Data Generator",
  "description": "Generate realistic mock data for testing APIs, forms, and databases with custom schemas and multiple export formats including JSON, CSV, and SQL.",
  "url": "https://multitoolplatform.com/tools/mock-data-generator",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
  },
  "featureList": [
    "Custom schema builder",
    "Multiple data types",
    "Realistic data generation",
    "JSON export",
    "CSV export",
    "SQL insert statements",
    "Bulk data generation",
    "Data validation",
    "Field customization",
    "Relationship support",
    "Export templates",
    "Data preview",
    "Field constraints",
    "Data formatting",
    "Import schemas",
    "Share schemas",
    "API integration",
    "Batch processing",
    "Data anonymization",
    "Localization support"
  ],
  "screenshot": "/og-mock-data.jpg",
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
      "name": "Mock Data Generator",
      "item": "https://multitoolplatform.com/tools/mock-data-generator"
    }
  ]
};

export default function MockDataGeneratorPage() {
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
            Mock Data Generator
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Generate realistic mock data for testing APIs, forms, and databases. Create custom schemas
            with various data types including names, addresses, emails, phone numbers, and more with
            multiple export formats for seamless integration.
          </p>

          {/* Key Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">🎭</div>
              <h3 className="font-semibold mb-1">Realistic Data</h3>
              <p className="text-sm text-muted-foreground">
                Generate lifelike data that mimics real-world scenarios
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">⚙️</div>
              <h3 className="font-semibold mb-1">Custom Schemas</h3>
              <p className="text-sm text-muted-foreground">
                Build custom data structures with flexible field types
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">📤</div>
              <h3 className="font-semibold mb-1">Multiple Formats</h3>
              <p className="text-sm text-muted-foreground">
                Export in JSON, CSV, SQL, and other popular formats
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">🔄</div>
              <h3 className="font-semibold mb-1">Bulk Generation</h3>
              <p className="text-sm text-muted-foreground">
                Generate thousands of records instantly for large datasets
              </p>
            </div>
          </div>
        </div>

        {/* Tool Component */}
        <MockDataGeneratorClient />

        {/* Documentation Section */}
        <div className="mt-16 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">How to Use</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Follow these steps to generate high-quality mock data for your testing needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Getting Started */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">1. Define Your Schema</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Choose data types for each field</p>
                  <p>• Set field constraints and validation rules</p>
                  <p>• Configure relationships between fields</p>
                  <p>• Add custom formatting options</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">2. Configure Generation Settings</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Set the number of records to generate</p>
                  <p>• Choose randomization options</p>
                  <p>• Configure data distribution patterns</p>
                  <p>• Set up data uniqueness constraints</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">3. Generate and Preview</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Preview generated data before export</p>
                  <p>• Validate data against your schema</p>
                  <p>• Make adjustments as needed</p>
                  <p>• Test data quality and realism</p>
                </div>
              </div>
            </div>

            {/* Advanced Features */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">4. Export Your Data</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Choose from multiple export formats</p>
                  <p>• Download files directly to your device</p>
                  <p>• Copy data to clipboard for quick use</p>
                  <p>• Integrate with APIs and databases</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">5. Save and Reuse</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Save your schemas for future use</p>
                  <p>• Share schemas with team members</p>
                  <p>• Import existing schemas</p>
                  <p>• Create templates for common scenarios</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">6. Advanced Customization</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Use custom data generators</p>
                  <p>• Implement business logic rules</p>
                  <p>• Add localization support</p>
                  <p>• Create conditional field logic</p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Types & Features */}
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Supported Data Types & Features</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">TXT</span>
                </div>
                <div>
                  <div className="font-medium">Text & Strings</div>
                  <div className="text-sm text-muted-foreground">Names, addresses, descriptions</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">NUM</span>
                </div>
                <div>
                  <div className="font-medium">Numbers</div>
                  <div className="text-sm text-muted-foreground">Integers, decimals, ranges</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-purple-600 dark:text-purple-400">DATE</span>
                </div>
                <div>
                  <div className="font-medium">Dates & Times</div>
                  <div className="text-sm text-muted-foreground">Timestamps, date ranges, formats</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-orange-600 dark:text-orange-400">BOOL</span>
                </div>
                <div>
                  <div className="font-medium">Boolean Values</div>
                  <div className="text-sm text-muted-foreground">True/false, yes/no options</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">LIST</span>
                </div>
                <div>
                  <div className="font-medium">Lists & Arrays</div>
                  <div className="text-sm text-muted-foreground">Multiple values, nested structures</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">REL</span>
                </div>
                <div>
                  <div className="font-medium">Relationships</div>
                  <div className="text-sm text-muted-foreground">Linked data, foreign keys</div>
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
                  <span className="text-2xl">📋</span>
                </div>
                <h4 className="font-semibold mb-2">1. Design Schema</h4>
                <p className="text-sm text-muted-foreground">
                  Define your data structure by selecting field types,
                  setting constraints, and configuring relationships.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h4 className="font-semibold mb-2">2. Generate Data</h4>
                <p className="text-sm text-muted-foreground">
                  Use advanced algorithms to create realistic data
                  that matches your schema specifications.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💾</span>
                </div>
                <h4 className="font-semibold mb-2">3. Export & Use</h4>
                <p className="text-sm text-muted-foreground">
                  Export your generated data in the format you need
                  and integrate it into your testing workflow.
                </p>
              </div>
            </div>
          </div>

          {/* Use Cases */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Common Use Cases</h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">API Development</h4>
                <p className="text-sm text-muted-foreground">
                  Generate mock API responses for frontend development
                  and testing before backend implementation is complete.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Database Testing</h4>
                <p className="text-sm text-muted-foreground">
                  Populate test databases with realistic data to validate
                  queries, performance, and application behavior.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">UI/UX Testing</h4>
                <p className="text-sm text-muted-foreground">
                  Fill forms and interfaces with varied data to test
                  user experience and identify edge cases.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Load Testing</h4>
                <p className="text-sm text-muted-foreground">
                  Create large datasets for performance testing and
                  stress testing of applications and systems.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Data Migration</h4>
                <p className="text-sm text-muted-foreground">
                  Generate sample data for testing data migration
                  processes and validating data integrity.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Training & Demos</h4>
                <p className="text-sm text-muted-foreground">
                  Create realistic datasets for training materials,
                  product demos, and sales presentations.
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
                  Mock Data Generation Best Practices
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
                  <div>
                    <strong>Data Realism:</strong> Generate data that closely mimics real-world scenarios and distributions for more accurate testing.
                  </div>
                  <div>
                    <strong>Data Variety:</strong> Include edge cases, null values, and diverse data patterns to thoroughly test your applications.
                  </div>
                  <div>
                    <strong>Schema Validation:</strong> Always validate your generated data against the target schema to ensure compatibility.
                  </div>
                  <div>
                    <strong>Performance Considerations:</strong> Generate appropriate data volumes for your testing needs without overwhelming systems.
                  </div>
                  <div>
                    <strong>Data Privacy:</strong> Avoid using real personal information and ensure generated data doesn't contain sensitive patterns.
                  </div>
                  <div>
                    <strong>Version Control:</strong> Save and version your data schemas for consistent testing across development cycles.
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
                <h4 className="font-medium mb-2">What data types are supported?</h4>
                <p className="text-sm text-muted-foreground">
                  We support a wide range of data types including text, numbers, dates, booleans, lists, and custom types.
                  You can also create complex nested structures and define relationships between fields.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">How realistic is the generated data?</h4>
                <p className="text-sm text-muted-foreground">
                  Our algorithms generate highly realistic data using statistical distributions and pattern recognition.
                  Names, addresses, and other fields follow real-world formatting and distribution patterns.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">What export formats are available?</h4>
                <p className="text-sm text-muted-foreground">
                  You can export data in JSON, CSV, SQL INSERT statements, XML, and other popular formats.
                  Each format is optimized for easy integration with different systems and applications.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Can I save and reuse my schemas?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, you can save your data schemas and reuse them for future projects. Schemas can be shared
                  with team members and imported into other projects for consistent data generation.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Is there a limit on data generation?</h4>
                <p className="text-sm text-muted-foreground">
                  You can generate up to 10,000 records per generation. For larger datasets, you can run multiple
                  generations or use our API for bulk data generation with higher limits.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Can I customize the data generation rules?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, you can customize generation rules with constraints, patterns, and business logic.
                  Advanced users can create custom generators for specific data requirements and formatting needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
