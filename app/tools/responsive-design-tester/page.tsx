import { Metadata } from 'next';
import ResponsiveDesignTesterClient from '@/components/tools/responsive-design-tester-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Responsive Design Tester - Test Websites on Multiple Devices',
  description: 'Test your website responsiveness across different devices and screen sizes. Preview how your site looks on phones, tablets, and desktops with our interactive device emulator.',
  keywords: ['responsive design tester', 'device emulator', 'mobile testing', 'responsive preview', 'cross-device testing', 'website testing', 'device simulation'],
  openGraph: {
    title: 'Responsive Design Tester - DevTools Hub',
    description: 'Test website responsiveness across phones, tablets, and desktops with live previews',
    type: 'website',
  },
  alternates: {
    canonical: '/tools/responsive-design-tester',
  },
};

const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Responsive Design Tester',
  applicationCategory: 'DeveloperApplication',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  description: 'Interactive responsive design testing tool with device emulation and live previews',
};

export default function ResponsiveDesignTesterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />
      <div className="tool-container">
        <div className="tool-header">
          <h1 className="tool-title">Responsive Design Tester</h1>
          <p className="tool-description">
            Test your website&apos;s responsiveness across different devices and screen sizes with interactive previews and device emulation
          </p>
        </div>

        <ResponsiveDesignTesterClient />

        {/* SEO Content */}
        <section className="mt-12 space-y-6">
          <div>
            <h2 className="mb-4 text-2xl font-bold">About Responsive Design Testing</h2>
            <p className="text-muted-foreground">
              Ensure your website looks great and functions perfectly on all devices. Our responsive design tester
              lets you preview your site on popular devices and custom screen sizes, helping you identify and fix
              responsive design issues before they affect your users.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-semibold">Key Features</h3>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li>Live preview of websites and HTML code</li>
              <li>Pre-configured device presets (iPhone, iPad, Desktop, etc.)</li>
              <li>Custom screen dimensions and zoom levels</li>
              <li>Device rotation and orientation testing</li>
              <li>Responsive breakpoint visualization</li>
              <li>Embed code generation for sharing previews</li>
              <li>Real-time testing without leaving your browser</li>
              <li>Completely client-side &mdash; your data never leaves your browser</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-semibold">Supported Devices</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  📱 Mobile Phones
                </h4>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li>iPhone 14, 14 Pro Max</li>
                  <li>Samsung Galaxy S23</li>
                  <li>Google Pixel 7</li>
                  <li>Custom mobile sizes</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  📱 Tablets
                </h4>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li>iPad, iPad Pro 12.9&quot;</li>
                  <li>Samsung Galaxy Tab S8</li>
                  <li>Custom tablet sizes</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  🖥️ Desktops
                </h4>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li>1080p, 1440p, 4K displays</li>
                  <li>Custom desktop resolutions</li>
                  <li>Multiple aspect ratios</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-semibold">Testing Methods</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">URL Testing</h4>
                <p className="text-sm text-muted-foreground">
                  Enter any website URL to test its responsiveness. Perfect for testing live websites,
                  staging environments, or local development servers.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">HTML Code Testing</h4>
                <p className="text-sm text-muted-foreground">
                  Paste HTML code directly for testing. Ideal for prototyping, testing code snippets,
                  or validating responsive design patterns.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-semibold">Responsive Design Best Practices</h3>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li><strong>Mobile-first approach:</strong> Design for mobile devices first, then enhance for larger screens</li>
              <li><strong>Flexible layouts:</strong> Use relative units (%, em, rem) instead of fixed pixels</li>
              <li><strong>Media queries:</strong> Apply different styles based on screen size breakpoints</li>
              <li><strong>Touch-friendly:</strong> Ensure buttons and interactive elements are at least 44px</li>
              <li><strong>Readable text:</strong> Maintain good contrast ratios and readable font sizes</li>
              <li><strong>Performance:</strong> Optimize images and reduce HTTP requests for mobile users</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-semibold">Common Issues to Check</h3>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li>Horizontal scrolling on mobile devices</li>
              <li>Text too small to read on phones</li>
              <li>Images not scaling properly</li>
              <li>Navigation menus not working on touch devices</li>
              <li>Forms difficult to use on small screens</li>
              <li>Content overlapping or breaking layout</li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}