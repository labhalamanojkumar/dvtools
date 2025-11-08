import { Metadata } from "next";
import SerializationConvertersClient from "@/components/tools/serialization-converters-client";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Serialization Converters - Data Format Tools | Multi-Tool Platform",
  description: "Convert between different data serialization formats including Protobuf, Avro, and MessagePack. Validate schemas and transform data structures.",
  keywords: [
    "serialization converters",
    "protobuf converter",
    "avro converter",
    "messagepack converter",
    "data serialization",
    "schema validation",
    "format conversion",
    "data transformation",
    "binary serialization",
    "protocol buffers"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multi-tool-platform.com"),
  alternates: {
    canonical: "/tools/serialization-converters",
  },
  openGraph: {
    title: "Serialization Converters - Data Format Tools",
    description: "Convert between different data serialization formats including Protobuf, Avro, and MessagePack.",
    url: "/tools/serialization-converters",
    siteName: "Multi-Tool Platform",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-serialization-converters.png",
        width: 1200,
        height: 630,
        alt: "Serialization Converters Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Serialization Converters - Data Format Tools",
    description: "Convert between different data serialization formats including Protobuf, Avro, and MessagePack.",
    images: ["/og-serialization-converters.png"],
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

export default function SerializationConvertersPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Serialization Converters",
    "description": "Convert between different data serialization formats including Protobuf, Avro, and MessagePack with schema validation and data transformation capabilities.",
    "url": "https://multi-tool-platform.com/tools/serialization-converters",
    "applicationCategory": "DataConversionSoftware",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "Protobuf serialization and deserialization",
      "Avro schema validation and conversion",
      "MessagePack encoding and decoding",
      "Schema definition and validation",
      "Data structure visualization",
      "Format conversion between protocols",
      "Binary data inspection",
      "Schema compatibility checking",
      "Real-time validation",
      "Export converted data"
    ],
    "screenshot": "/og-serialization-converters.png",
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
              Serialization Converters
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Convert between different data serialization formats including Protobuf, Avro, and MessagePack.
              Validate schemas and transform data structures with comprehensive format support.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Protobuf
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Avro
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                MessagePack
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                Schema Validation
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
              <h3 className="text-lg font-semibold mb-2">Protobuf Support</h3>
              <p className="text-muted-foreground">
                Full Protocol Buffers support with schema definition, message encoding/decoding, and validation.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Avro Schemas</h3>
              <p className="text-muted-foreground">
                Apache Avro schema validation and data serialization with JSON schema support and type checking.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0V1m10 3V1m0 3l1 1v16a2 2 0 01-2 2H6a2 2 0 01-2-2V5l1-1z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">MessagePack</h3>
              <p className="text-muted-foreground">
                Efficient MessagePack encoding/decoding with compact binary format and fast processing.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Schema Validation</h3>
              <p className="text-muted-foreground">
                Comprehensive schema validation with error reporting and compatibility checking across formats.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Data Visualization</h3>
              <p className="text-muted-foreground">
                Visual representation of serialized data structures with expandable nodes and type information.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Format Conversion</h3>
              <p className="text-muted-foreground">
                Convert between different serialization formats with automatic type mapping and validation.
              </p>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6">How to Use Serialization Converters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">1. Define Schema</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Create or load schema definitions</li>
                  <li>• Support for Protobuf (.proto), Avro (.avsc)</li>
                  <li>• JSON schema for MessagePack structures</li>
                  <li>• Validate schema syntax and structure</li>
                  <li>• Import existing schema files</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">2. Input Data</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Enter JSON data for serialization</li>
                  <li>• Upload binary serialized files</li>
                  <li>• Support for nested objects and arrays</li>
                  <li>• Type validation against schema</li>
                  <li>• Real-time syntax checking</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">3. Convert & Validate</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Serialize to binary formats</li>
                  <li>• Deserialize from binary to JSON</li>
                  <li>• Cross-format conversion</li>
                  <li>• Schema validation and error reporting</li>
                  <li>• Performance metrics and statistics</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">4. Export Results</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Download serialized binary files</li>
                  <li>• Export JSON representations</li>
                  <li>• Generate schema documentation</li>
                  <li>• Copy to clipboard functionality</li>
                  <li>• Batch processing support</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Serialization Converters Component */}
          <SerializationConvertersClient />

          {/* FAQ Section */}
          <div className="bg-card rounded-lg p-8 border mt-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What serialization formats are supported?</h3>
                <p className="text-muted-foreground">
                  We support Protocol Buffers (Protobuf), Apache Avro, and MessagePack. Each format has its own strengths for different use cases.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Do I need to define schemas?</h3>
                <p className="text-muted-foreground">
                  Yes, schemas are required for Protobuf and Avro to ensure type safety and proper serialization. MessagePack can work with or without schemas.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Is my data secure?</h3>
                <p className="text-muted-foreground">
                  All processing happens locally in your browser. Schemas and data are never sent to external servers. Your data remains completely private.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I convert between formats?</h3>
                <p className="text-muted-foreground">
                  Yes, you can convert data between supported formats. For example, deserialize from Protobuf and serialize to Avro, with automatic type mapping.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}