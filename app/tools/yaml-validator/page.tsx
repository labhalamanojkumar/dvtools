import { Metadata } from "next";
import Script from "next/script";
import YAMLValidatorClient from "@/components/tools/yaml-validator-client";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "YAML Validator & JSON Converter | DVtools - Online YAML Tool",
  description: "Professional YAML validator and converter tool. Validate YAML syntax, convert YAML to JSON, JSON to YAML instantly. Upload .yaml, .yml, .json files, detect errors with detailed messages, and download results. Perfect for DevOps engineers, developers, and configuration management. Free online tool with no registration required.",
  keywords: [
    "YAML validator",
    "YAML to JSON",
    "JSON to YAML",
    "YAML converter",
    "YAML syntax checker",
    "YAML parser",
    "YAML validation",
    "online YAML tool",
    "YAML formatter",
    "YAML editor",
    "validate YAML online",
    "convert YAML",
    "YAML file upload",
    "YAML syntax error",
    "YAML lint",
    "YAML configuration",
    "DevOps tools",
    "config validator",
    "YAML download",
    "free YAML tool",
    "YAML debugging",
    "configuration file validator",
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://dvtools.dev"),
  alternates: {
    canonical: "/tools/yaml-validator",
  },
  openGraph: {
    title: "YAML Validator & JSON Converter | DVtools",
    description: "Professional YAML validator and converter. Validate YAML syntax, convert YAML↔JSON instantly. Upload files, detect errors, and download results.",
    url: "/tools/yaml-validator",
    siteName: "DVtools",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-yaml-validator.png",
        width: 1200,
        height: 630,
        alt: "YAML Validator & JSON Converter - DVtools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YAML Validator & JSON Converter | DVtools",
    description: "Professional YAML validator and converter. Validate YAML syntax, convert YAML↔JSON instantly. Free developer tool.",
    images: ["/og-yaml-validator.png"],
    creator: "@dvtools",
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

export default function YAMLValidatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "YAML Validator & JSON Converter",
    "description": "Professional YAML validator and converter tool. Validate YAML syntax, convert between YAML and JSON formats instantly with detailed error messages.",
    "url": "https://dvtools.dev/tools/yaml-validator",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "Real-time YAML syntax validation",
      "Bidirectional YAML ↔ JSON conversion",
      "File upload support (.yaml, .yml, .json)",
      "Detailed error messages with line numbers",
      "Download validated and converted files",
      "Copy to clipboard functionality",
      "YAML syntax reference guide",
      "Multi-tab interface for different operations"
    ],
  };

  return (
    <>
      <Script
        id="yaml-validator-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <YAMLValidatorClient />
    </>
  );
}
