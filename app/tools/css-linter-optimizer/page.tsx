import { Metadata } from 'next';
import CssLinterOptimizerClient from '@/components/tools/css-linter-optimizer-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'CSS Linter & Optimizer - Lint, Validate & Optimize CSS Online',
  description: 'Free online CSS linter and optimizer. Validate CSS syntax, check for errors and warnings, optimize file size, and improve performance. Fast, secure, and client-side processing.',
  keywords: ['CSS linter', 'CSS optimizer', 'CSS validator', 'CSS minifier', 'CSS compressor', 'CSS analysis', 'CSS performance', 'lint CSS online'],
  openGraph: {
    title: 'CSS Linter & Optimizer - DevTools Hub',
    description: 'Lint, validate, and optimize CSS with error detection and performance improvements',
    type: 'website',
  },
  alternates: {
    canonical: '/tools/css-linter-optimizer',
  },
};

const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'CSS Linter & Optimizer',
  applicationCategory: 'DeveloperApplication',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  description: 'Free online CSS linter, validator, and optimizer with performance analysis',
};

export default function CssLinterOptimizerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />
      <div className="tool-container">
        <div className="tool-header">
          <h1 className="tool-title">CSS Linter & Optimizer</h1>
          <p className="tool-description">
            Lint, validate, and optimize your CSS code with advanced error detection, performance analysis, and file size reduction
          </p>
        </div>

        <CssLinterOptimizerClient />

        {/* SEO Content */}
        <section className="mt-12 space-y-6">
          <div>
            <h2 className="mb-4 text-2xl font-bold">About CSS Linter & Optimizer</h2>
            <p className="text-muted-foreground">
              Our comprehensive CSS analysis tool helps you write better, faster, and more maintainable CSS.
              Catch errors before they reach production, optimize file sizes for better performance, and follow
              best practices with our intelligent linting rules.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-semibold">Key Features</h3>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li>Advanced CSS syntax validation and error detection</li>
              <li>Performance optimization with file size reduction</li>
              <li>Configurable linting rules (Basic, Standard, Strict)</li>
              <li>Multiple optimization levels (Conservative, Balanced, Aggressive)</li>
              <li>Detailed issue reporting with line and column numbers</li>
              <li>Real-time analysis with instant feedback</li>
              <li>Copy and download optimized CSS</li>
              <li>Completely client-side &mdash; your code never leaves your browser</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-semibold">Linting Rules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Error Level</h4>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li>Duplicate CSS properties</li>
                  <li>Missing semicolons</li>
                  <li>Invalid CSS properties</li>
                  <li>Syntax errors</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Warning Level</h4>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li>Use of named colors</li>
                  <li>!important declarations</li>
                  <li>Performance issues</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-semibold">Optimization Features</h3>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li><strong>Whitespace removal:</strong> Eliminate unnecessary spaces and line breaks</li>
              <li><strong>Comment stripping:</strong> Remove CSS comments (aggressive mode)</li>
              <li><strong>Property consolidation:</strong> Merge duplicate selectors</li>
              <li><strong>Unit optimization:</strong> Use shorthand properties where possible</li>
              <li><strong>Selector optimization:</strong> Simplify complex selectors</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-semibold">Common Use Cases</h3>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li>Validate CSS before deployment</li>
              <li>Optimize CSS for production builds</li>
              <li>Catch CSS errors and warnings</li>
              <li>Improve website performance</li>
              <li>Follow CSS best practices</li>
              <li>Debug CSS issues with detailed reports</li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}