import type { Metadata } from 'next';
import CSVExcelInspectorTransformerClient from '@/components/tools/CSVExcelInspectorTransformerClient';
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: 'Advanced CSV/Excel Inspector & Transformer Tool | Professional Data Processing',
  description: 'Powerful CSV and Excel file inspector with advanced data transformation, validation, cleaning, and export capabilities. Analyze, transform, and export spreadsheet data with professional-grade tools.',
  keywords: [
    'CSV inspector',
    'Excel analyzer',
    'data transformation',
    'spreadsheet processing',
    'data cleaning',
    'file validation',
    'data export',
    'CSV to Excel',
    'Excel to CSV',
    'data analysis',
    'spreadsheet tools',
    'data processing',
    'file converter',
    'data validation',
    'spreadsheet editor',
    'data wrangling',
    'ETL tool',
    'data preprocessing',
    'spreadsheet converter',
    'data quality',
    'data profiling',
    'data cleansing',
    'file format converter',
    'spreadsheet analysis',
    'data manipulation',
    'batch processing',
    'data visualization',
    'data filtering',
    'data sorting',
    'data aggregation'
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://multitoolplatform.com'),
  alternates: {
    canonical: '/tools/csv-excel-inspector',
  },
  openGraph: {
    title: 'Advanced CSV/Excel Inspector & Transformer Tool | Professional Data Processing',
    description: 'Powerful CSV and Excel file inspector with advanced data transformation, validation, cleaning, and export capabilities.',
    url: '/tools/csv-excel-inspector',
    siteName: 'Multi Tool Platform',
    images: [
      {
        url: '/og-csv-excel-inspector.jpg',
        width: 1200,
        height: 630,
        alt: 'CSV/Excel Inspector & Transformer Tool',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Advanced CSV/Excel Inspector & Transformer Tool',
    description: 'Professional CSV and Excel file processing with advanced data transformation capabilities.',
    images: ['/og-csv-excel-inspector.jpg'],
    creator: '@multitoolplatform',
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
  category: 'data processing tools',
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Advanced CSV/Excel Inspector & Transformer Tool",
  "description": "Professional CSV and Excel file processing tool with advanced data transformation, validation, and export capabilities.",
  "url": "https://multitoolplatform.com/tools/csv-excel-inspector",
  "applicationCategory": "DataProcessingTool",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "CSV file inspection and analysis",
    "Excel spreadsheet processing",
    "Data transformation and cleaning",
    "File validation and error detection",
    "Multiple export formats",
    "Advanced filtering and sorting",
    "Data visualization",
    "Batch processing capabilities",
    "Data profiling and quality checks",
    "Real-time data preview",
    "Custom transformation rules",
    "Data type detection and conversion"
  ],
  "screenshot": "/og-csv-excel-inspector.jpg",
  "author": {
    "@type": "Organization",
    "name": "Multi Tool Platform"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Multi Tool Platform"
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
      "name": "CSV/Excel Inspector & Transformer",
      "item": "https://multitoolplatform.com/tools/csv-excel-inspector"
    }
  ]
};

export default function CSVExcelInspectorTransformerPage() {
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
            Advanced CSV/Excel Inspector & Transformer Tool
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Professional-grade CSV and Excel file processing tool with advanced data transformation,
            validation, cleaning, and export capabilities. Analyze, transform, and export spreadsheet
            data with powerful ETL features and data quality assurance.
          </p>

          {/* Key Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">🔍</div>
              <h3 className="font-semibold mb-1">Data Inspection</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive analysis and profiling of CSV/Excel files
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">🔄</div>
              <h3 className="font-semibold mb-1">Data Transformation</h3>
              <p className="text-sm text-muted-foreground">
                Advanced data cleaning, filtering, and transformation rules
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">✅</div>
              <h3 className="font-semibold mb-1">Validation & Quality</h3>
              <p className="text-sm text-muted-foreground">
                Data quality checks and validation with error reporting
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">📤</div>
              <h3 className="font-semibold mb-1">Multiple Export Formats</h3>
              <p className="text-sm text-muted-foreground">
                Export to various formats with customizable options
              </p>
            </div>
          </div>
        </div>

        {/* Tool Component */}
        <CSVExcelInspectorTransformerClient />

        {/* Documentation Section */}
        <div className="mt-16 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">How to Use</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Follow these steps to effectively process and transform your CSV and Excel data
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Getting Started */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">1. Upload Files</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Drag and drop CSV or Excel files (.csv, .xlsx, .xls)</p>
                  <p>• Support for large files with efficient processing</p>
                  <p>• Preview data structure before processing</p>
                  <p>• Automatic encoding detection and handling</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">2. Inspect Data</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• View data profiling and statistics</p>
                  <p>• Identify data types and column structures</p>
                  <p>• Detect missing values and data quality issues</p>
                  <p>• Preview data distribution and patterns</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">3. Apply Transformations</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Clean and standardize data formats</p>
                  <p>• Apply filtering and sorting rules</p>
                  <p>• Transform data types and values</p>
                  <p>• Handle duplicates and missing data</p>
                </div>
              </div>
            </div>

            {/* Advanced Features */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">4. Validate & Clean</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Run data quality validation rules</p>
                  <p>• Identify and fix data inconsistencies</p>
                  <p>• Apply custom validation logic</p>
                  <p>• Generate data quality reports</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">5. Export Results</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Export to CSV, Excel, JSON, or XML formats</p>
                  <p>• Customize export settings and delimiters</p>
                  <p>• Download processed files securely</p>
                  <p>• Batch processing for multiple files</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">6. Advanced Options</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Create custom transformation pipelines</p>
                  <p>• Save and reuse processing templates</p>
                  <p>• Schedule automated data processing</p>
                  <p>• Integrate with external data sources</p>
                </div>
              </div>
            </div>
          </div>

          {/* Supported Formats */}
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Supported File Formats & Features</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">CSV</span>
                </div>
                <div>
                  <div className="font-medium">CSV Files</div>
                  <div className="text-sm text-muted-foreground">Comma/tab/custom delimited</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">XLS</span>
                </div>
                <div>
                  <div className="font-medium">Excel Files</div>
                  <div className="text-sm text-muted-foreground">.xlsx, .xls formats</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-purple-600 dark:text-purple-400">JSON</span>
                </div>
                <div>
                  <div className="font-medium">JSON Export</div>
                  <div className="text-sm text-muted-foreground">Structured data output</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-orange-600 dark:text-orange-400">XML</span>
                </div>
                <div>
                  <div className="font-medium">XML Export</div>
                  <div className="text-sm text-muted-foreground">Hierarchical data format</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">TSV</span>
                </div>
                <div>
                  <div className="font-medium">TSV Files</div>
                  <div className="text-sm text-muted-foreground">Tab-separated values</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">SQL</span>
                </div>
                <div>
                  <div className="font-medium">SQL Export</div>
                  <div className="text-sm text-muted-foreground">Database insert statements</div>
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
                <h4 className="font-semibold mb-2">1. Upload & Analyze</h4>
                <p className="text-sm text-muted-foreground">
                  Upload your CSV or Excel files and get instant analysis of data structure,
                  types, and quality metrics.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔧</span>
                </div>
                <h4 className="font-semibold mb-2">2. Transform & Clean</h4>
                <p className="text-sm text-muted-foreground">
                  Apply powerful transformation rules, clean data, validate quality,
                  and prepare for export.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h4 className="font-semibold mb-2">3. Export & Integrate</h4>
                <p className="text-sm text-muted-foreground">
                  Export processed data in your preferred format and integrate
                  with your data pipeline or applications.
                </p>
              </div>
            </div>
          </div>

          {/* Use Cases */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Common Use Cases</h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Data Migration</h4>
                <p className="text-sm text-muted-foreground">
                  Clean and transform data before migrating between systems,
                  ensuring data integrity and format compatibility.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Data Quality Assurance</h4>
                <p className="text-sm text-muted-foreground">
                  Validate data quality, identify inconsistencies, and generate
                  reports for data governance and compliance.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">ETL Processes</h4>
                <p className="text-sm text-muted-foreground">
                  Extract, transform, and load data from various sources,
                  preparing it for analysis or integration.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Report Generation</h4>
                <p className="text-sm text-muted-foreground">
                  Process raw data into clean, formatted reports with
                  consistent structure and validated content.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Data Integration</h4>
                <p className="text-sm text-muted-foreground">
                  Combine data from multiple sources, standardize formats,
                  and resolve conflicts for unified datasets.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Data Cleaning</h4>
                <p className="text-sm text-muted-foreground">
                  Remove duplicates, handle missing values, standardize formats,
                  and improve overall data quality.
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
                  Data Processing Best Practices
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
                  <div>
                    <strong>Data Backup:</strong> Always create backups before processing large or critical datasets.
                  </div>
                  <div>
                    <strong>Validation First:</strong> Run data profiling and validation before applying transformations.
                  </div>
                  <div>
                    <strong>Incremental Processing:</strong> Process data in batches for large files to avoid memory issues.
                  </div>
                  <div>
                    <strong>Format Consistency:</strong> Standardize date formats, number formats, and text encoding.
                  </div>
                  <div>
                    <strong>Quality Checks:</strong> Implement data quality rules and validation at each processing step.
                  </div>
                  <div>
                    <strong>Documentation:</strong> Document transformation rules and processing steps for reproducibility.
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
                <h4 className="font-medium mb-2">What file formats are supported?</h4>
                <p className="text-sm text-muted-foreground">
                  The tool supports CSV files (with various delimiters), Excel files (.xlsx, .xls),
                  and can export to JSON, XML, SQL, and other formats. Large files are handled efficiently.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">How large can my files be?</h4>
                <p className="text-sm text-muted-foreground">
                  The tool can process files up to several gigabytes in size through efficient streaming
                  and batch processing. For extremely large files, consider splitting them or using filtering.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Can I automate data processing?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, you can save transformation templates and processing rules for reuse.
                  Advanced users can create custom processing pipelines for automated workflows.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Is my data secure?</h4>
                <p className="text-sm text-muted-foreground">
                  All data processing happens locally in your browser. Files are not uploaded to any servers,
                  ensuring your data remains private and secure throughout the processing.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">What transformations are available?</h4>
                <p className="text-sm text-muted-foreground">
                  The tool offers data type conversion, text cleaning, duplicate removal, filtering,
                  sorting, column operations, and custom transformation rules using formulas and logic.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Can I validate data quality?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, comprehensive data quality validation includes checking for missing values,
                  data type consistency, format validation, duplicate detection, and custom business rules.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
