import { Metadata } from "next";
import CharacterEncodingConverterClient from "@/components/tools/character-encoding-converter-client";

export const metadata: Metadata = {
  title: "Character Encoding Converter | Multi-Tool Platform",
  description: "Convert text between different character encodings (UTF-8, UTF-16, ISO-8859-1, Windows-1252) with automatic detection, anomaly detection, and encoding validation.",
  keywords: [
    "character encoding",
    "text encoding converter",
    "UTF-8 converter",
    "UTF-16 converter",
    "ISO-8859-1",
    "Windows-1252",
    "encoding detection",
    "text conversion",
    "character set conversion",
    "encoding validation"
  ],
  authors: [{ name: "Multi-Tool Platform" }],
  openGraph: {
    title: "Character Encoding Converter | Multi-Tool Platform",
    description: "Convert text between different character encodings with automatic detection and validation.",
    type: "website",
    url: "/tools/character-encoding-converter",
  },
  twitter: {
    card: "summary_large_image",
    title: "Character Encoding Converter | Multi-Tool Platform",
    description: "Convert text between different character encodings with automatic detection and validation.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/tools/character-encoding-converter",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Character Encoding Converter",
  "description": "Convert text between different character encodings with automatic detection, anomaly detection, and encoding validation.",
  "url": "/tools/character-encoding-converter",
  "applicationCategory": "Utility",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "Convert between UTF-8, UTF-16, ISO-8859-1, and Windows-1252",
    "Automatic encoding detection with confidence scores",
    "Anomaly detection for encoding issues",
    "Batch file processing support",
    "Encoding validation and error reporting",
    "Real-time preview and comparison",
    "Support for large text files",
    "Custom replacement characters for invalid sequences"
  ]
};

export default function CharacterEncodingConverterPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Character Encoding Converter</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Convert text between different character encodings with automatic detection,
          anomaly detection, and comprehensive validation.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Multiple Encodings</h3>
          <p className="text-muted-foreground">
            Support for UTF-8, UTF-16, UTF-32, ISO-8859-1, Windows-1252,
            and other common character encodings.
          </p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Auto Detection</h3>
          <p className="text-muted-foreground">
            Intelligent encoding detection with confidence scores and
            language identification for accurate conversion.
          </p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Anomaly Detection</h3>
          <p className="text-muted-foreground">
            Detect encoding anomalies, invalid sequences, and potential
            data corruption with detailed reporting.
          </p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Batch Processing</h3>
          <p className="text-muted-foreground">
            Process multiple files simultaneously with consistent
            encoding conversion and error handling.
          </p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Validation</h3>
          <p className="text-muted-foreground">
            Comprehensive validation with error reporting, character
            mapping, and conversion statistics.
          </p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Large Files</h3>
          <p className="text-muted-foreground">
            Efficient processing of large text files with streaming
            support and memory optimization.
          </p>
        </div>
      </div>

      {/* Tool Component */}
      <CharacterEncodingConverterClient />

      {/* Usage Instructions */}
      <div className="mt-12 bg-muted p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">How to Use</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">Basic Usage</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Upload a text file or paste text directly</li>
              <li>Select source and target encodings</li>
              <li>Enable automatic detection if unsure of source encoding</li>
              <li>Configure error handling preferences</li>
              <li>Convert and download the result</li>
            </ol>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Advanced Features</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Use batch processing for multiple files</li>
              <li>Review anomaly detection reports</li>
              <li>Customize replacement characters for invalid sequences</li>
              <li>Compare original and converted text side-by-side</li>
              <li>Export conversion statistics and reports</li>
              <li>Handle large files with streaming processing</li>
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
              What character encodings are supported?
            </summary>
            <p className="mt-3 text-muted-foreground">
              The tool supports UTF-8, UTF-16 (LE/BE), UTF-32, ISO-8859-1 (Latin-1),
              Windows-1252, ASCII, and many other common character encodings. Additional
              encodings can be added upon request.
            </p>
          </details>
          <details className="bg-card p-6 rounded-lg border">
            <summary className="font-semibold cursor-pointer">
              How does automatic encoding detection work?
            </summary>
            <p className="mt-3 text-muted-foreground">
              The tool uses advanced algorithms to analyze byte patterns, BOM (Byte Order Mark)
              detection, and statistical analysis to determine the most likely encoding.
              Confidence scores are provided for each detection.
            </p>
          </details>
          <details className="bg-card p-6 rounded-lg border">
            <summary className="font-semibold cursor-pointer">
              What happens with invalid character sequences?
            </summary>
            <p className="mt-3 text-muted-foreground">
              You can choose how to handle invalid sequences: strict mode (throw errors),
              replace mode (use custom replacement characters), or ignore mode (skip invalid bytes).
              All anomalies are reported with position and character information.
            </p>
          </details>
          <details className="bg-card p-6 rounded-lg border">
            <summary className="font-semibold cursor-pointer">
              Can I process large files?
            </summary>
            <p className="mt-3 text-muted-foreground">
              Yes, the tool can handle files up to 50MB in size. For larger files,
              streaming processing is available to minimize memory usage and provide
              progress feedback during conversion.
            </p>
          </details>
          <details className="bg-card p-6 rounded-lg border">
            <summary className="font-semibold cursor-pointer">
              What are encoding anomalies?
            </summary>
            <p className="mt-3 text-muted-foreground">
              Anomalies include invalid byte sequences, mixed encodings, corrupted characters,
              and unexpected control characters. The tool detects and reports these issues
              with detailed information about position, character, and potential fixes.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}