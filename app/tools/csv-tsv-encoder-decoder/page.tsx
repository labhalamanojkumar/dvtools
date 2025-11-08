import { Metadata } from "next";
import CSVTSVEncoderDecoderClient from "@/components/tools/csv-tsv-encoder-decoder-client";

export const metadata: Metadata = {
  title: "CSV/TSV Encoder-Decoder | Multi-Tool Platform",
  description: "Professional CSV and TSV file processing tool with parsing, validation, encoding conversion, and schema detection. Supports large files, custom delimiters, and data transformation.",
  keywords: [
    "csv parser",
    "tsv converter",
    "data processing",
    "file encoding",
    "spreadsheet tools",
    "data validation",
    "csv to json",
    "tsv to csv",
    "bulk data processing",
    "data transformation"
  ],
  authors: [{ name: "Multi-Tool Platform" }],
  openGraph: {
    title: "CSV/TSV Encoder-Decoder | Multi-Tool Platform",
    description: "Professional CSV and TSV file processing tool with advanced parsing, validation, and conversion features.",
    type: "website",
    url: "/tools/csv-tsv-encoder-decoder",
  },
  twitter: {
    card: "summary_large_image",
    title: "CSV/TSV Encoder-Decoder | Multi-Tool Platform",
    description: "Professional CSV and TSV file processing tool with advanced parsing, validation, and conversion features.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/tools/csv-tsv-encoder-decoder",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "CSV/TSV Encoder-Decoder",
  "description": "Professional CSV and TSV file processing tool with parsing, validation, encoding conversion, and schema detection.",
  "url": "/tools/csv-tsv-encoder-decoder",
  "applicationCategory": "DataProcessing",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "CSV and TSV parsing with custom delimiters",
    "Data validation and error detection",
    "Encoding conversion (UTF-8, UTF-16, ISO-8859-1)",
    "Schema detection and type inference",
    "Large file processing support",
    "Data transformation and filtering",
    "Export to multiple formats",
    "Real-time preview and editing"
  ]
};

export default function CSVTSVEncoderDecoderPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">CSV/TSV Encoder-Decoder</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Professional CSV and TSV file processing tool with advanced parsing, validation,
          encoding conversion, and intelligent schema detection.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Advanced Parsing</h3>
          <p className="text-muted-foreground">
            Intelligent CSV/TSV parsing with custom delimiters, quote handling,
            and escape character support.
          </p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Data Validation</h3>
          <p className="text-muted-foreground">
            Comprehensive data validation with type checking, constraint validation,
            and error reporting.
          </p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Encoding Support</h3>
          <p className="text-muted-foreground">
            Convert between UTF-8, UTF-16, ISO-8859-1, and other character encodings
            with automatic detection.
          </p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Schema Detection</h3>
          <p className="text-muted-foreground">
            Automatic schema detection and type inference for structured data
            processing.
          </p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Large File Support</h3>
          <p className="text-muted-foreground">
            Process large CSV/TSV files efficiently with streaming and chunked
            processing.
          </p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Data Transformation</h3>
          <p className="text-muted-foreground">
            Transform, filter, and manipulate data with powerful query and
            transformation tools.
          </p>
        </div>
      </div>

      {/* Tool Component */}
      <CSVTSVEncoderDecoderClient />

      {/* Usage Instructions */}
      <div className="mt-12 bg-muted p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">How to Use</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">Basic Usage</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Upload your CSV or TSV file, or paste data directly</li>
              <li>Configure parsing options (delimiter, encoding, headers)</li>
              <li>Review the parsed data preview</li>
              <li>Apply transformations or validations as needed</li>
              <li>Export the processed data in your desired format</li>
            </ol>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Advanced Features</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Use custom delimiters for non-standard formats</li>
              <li>Handle files with or without headers</li>
              <li>Convert between different encodings</li>
              <li>Apply data type validation and constraints</li>
              <li>Filter and transform data with queries</li>
              <li>Process large files with streaming support</li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="bg-card p-6 rounded-lg border">
            <summary className="font-semibold cursor-pointer">
              What file formats are supported?
            </summary>
            <p className="mt-3 text-muted-foreground">
              The tool supports CSV (Comma-Separated Values) and TSV (Tab-Separated Values)
              files, with support for custom delimiters. Files can be uploaded or data can be
              pasted directly into the input area.
            </p>
          </details>
          <details className="bg-card p-6 rounded-lg border">
            <summary className="font-semibold cursor-pointer">
              How large can my files be?
            </summary>
            <p className="mt-3 text-muted-foreground">
              The tool can handle files up to 50MB in size. For larger files, consider using
              the streaming processing option or splitting your data into smaller chunks.
            </p>
          </details>
          <details className="bg-card p-6 rounded-lg border">
            <summary className="font-semibold cursor-pointer">
              What character encodings are supported?
            </summary>
            <p className="mt-3 text-muted-foreground">
              The tool supports UTF-8, UTF-16, UTF-32, ISO-8859-1 (Latin-1), Windows-1252,
              and automatic encoding detection. You can convert between different encodings
              during processing.
            </p>
          </details>
          <details className="bg-card p-6 rounded-lg border">
            <summary className="font-semibold cursor-pointer">
              Can I validate my data?
            </summary>
            <p className="mt-3 text-muted-foreground">
              Yes, the tool provides comprehensive data validation including type checking
              (string, number, date, boolean), required field validation, custom regex patterns,
              and range validation for numeric fields.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}