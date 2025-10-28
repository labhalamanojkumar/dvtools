import { Metadata } from 'next';
import { JsonFormatterClient } from '../../../components/tools/json-formatter-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'JSON Formatter & Validator - Format and Validate JSON Online',
  description: 'Free online JSON formatter and validator. Pretty-print, minify, validate JSON with syntax highlighting, error detection, and JSON Schema validation. Fast and secure.',
  keywords: ['JSON formatter', 'JSON validator', 'JSON beautifier', 'JSON minifier', 'JSON schema', 'validate JSON online'],
  openGraph: {
    title: 'JSON Formatter & Validator - DevTools Hub',
    description: 'Format, validate, and beautify JSON with schema support and error detection',
    type: 'website',
  },
  alternates: {
    canonical: '/tools/json-formatter',
  },
};

const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'JSON Formatter & Validator',
  applicationCategory: 'DeveloperApplication',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  description: 'Free online JSON formatter, validator, and beautifier with schema support',
};

export default function JsonFormatterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />
      <div className="tool-container">
        <div className="tool-header">
          <h1 className="tool-title">JSON Formatter & Validator</h1>
          <p className="tool-description">
            Format, validate, and beautify JSON with syntax highlighting and schema validation
          </p>
        </div>
        
        <JsonFormatterClient />

        {/* SEO Content */}
        <section className="mt-12 space-y-6">
          <div>
            <h2 className="mb-4 text-2xl font-bold">About JSON Formatter</h2>
            <p className="text-muted-foreground">
              Our JSON formatter helps you beautify, validate, and work with JSON data effortlessly. 
              Whether you&apos;re debugging API responses, formatting configuration files, or validating 
              JSON schemas, our tool provides instant feedback with clear error messages.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-semibold">Key Features</h3>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li>Instant JSON formatting and beautification</li>
              <li>Real-time validation with detailed error messages</li>
              <li>JSON Schema validation support</li>
              <li>Syntax highlighting for better readability</li>
              <li>Minify/compact JSON for production use</li>
              <li>Copy to clipboard and download options</li>
              <li>Completely client-side &mdash; your data never leaves your browser</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-semibold">Common Use Cases</h3>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li>Format messy JSON from API responses</li>
              <li>Validate JSON configuration files</li>
              <li>Debug JSON parsing errors in applications</li>
              <li>Convert between minified and pretty-printed JSON</li>
              <li>Validate data against JSON Schemas</li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
