import { Metadata } from "next";
import StaticSiteExporterClient from "@/components/tools/static-site-exporter-client";
import ScrollToStaticExporterButton from "@/components/tools/scroll-to-static-exporter-button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title:
    "Static Site Exporter - Convert Dynamic Sites to Static HTML | Multi Tool Platform",
  description:
    "Transform your dynamic websites into static HTML files. Export complete websites with assets, minify code, and create self-contained static sites. Perfect for hosting on CDNs, GitHub Pages, or any static hosting service.",
  keywords: [
    "static site exporter",
    "HTML export",
    "website to static",
    "static site generator",
    "HTML minifier",
    "asset extraction",
    "static hosting",
    "CDN deployment",
    "GitHub Pages",
    "static website converter",
  ],
  authors: [{ name: "Multi Tool Platform" }],
  creator: "Multi Tool Platform",
  publisher: "Multi Tool Platform",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multitoolplatform.com"),
  alternates: {
    canonical: "/tools/static-site-exporter",
  },
  openGraph: {
    title: "Static Site Exporter - Convert Websites to Static HTML",
    description:
      "Transform dynamic websites into static HTML files with asset extraction, minification, and optimization for static hosting.",
    url: "/tools/static-site-exporter",
    siteName: "Multi Tool Platform",
    images: [
      {
        url: "/og-static-site-exporter.jpg",
        width: 1200,
        height: 630,
        alt: "Static Site Exporter Tool",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Static Site Exporter - Convert Websites to Static HTML",
    description:
      "Transform dynamic websites into static HTML files with asset extraction, minification, and optimization.",
    images: ["/twitter-static-site-exporter.jpg"],
    creator: "@multitoolplatform",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "developer tools",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Static Site Exporter",
  description:
    "Convert dynamic websites to static HTML files with asset extraction and optimization",
  url: "https://multitoolplatform.com/tools/static-site-exporter",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  creator: {
    "@type": "Organization",
    name: "Multi Tool Platform",
    url: "https://multitoolplatform.com",
  },
  featureList: [
    "HTML export with asset extraction",
    "Code minification and optimization",
    "Base64 image encoding",
    "Script removal options",
    "Custom CSS injection",
    "ZIP package generation",
    "Live preview functionality",
  ],
  screenshot: "/static-site-exporter-screenshot.jpg",
};

export default function StaticSiteExporterPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Static Site Exporter
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
          Transform your dynamic websites into static HTML files. Extract
          assets, minify code, and create self-contained static sites perfect
          for CDN hosting, GitHub Pages, or any static hosting service.
        </p>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            HTML Export
          </span>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            Asset Extraction
          </span>
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
            Code Minification
          </span>
          <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
            Static Hosting Ready
          </span>
        </div>
      </div>

      {/* Main Tool Component */}
      <div className="mb-12">
        <StaticSiteExporterClient />
      </div>

      {/* Educational Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* What is Static Site Export */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            What is Static Site Export?
          </h2>
          <div className="prose prose-lg max-w-none">
            <p>
              Static site export transforms dynamic web applications into static
              HTML files that can be served directly from any web server or CDN.
              This process eliminates the need for server-side processing,
              database connections, or complex runtime environments.
            </p>

            <h3>Key Benefits</h3>
            <ul>
              <li>
                <strong>Lightning Fast:</strong> No server processing means
                instant page loads
              </li>
              <li>
                <strong>Highly Reliable:</strong> No database or server failures
                to worry about
              </li>
              <li>
                <strong>Cost Effective:</strong> Host on free services like
                GitHub Pages or Netlify
              </li>
              <li>
                <strong>SEO Friendly:</strong> Search engines love fast,
                crawlable static content
              </li>
              <li>
                <strong>Version Control:</strong> Entire site can be tracked in
                Git
              </li>
              <li>
                <strong>Security:</strong> No server-side vulnerabilities or
                database attacks
              </li>
            </ul>

            <h3>Perfect For</h3>
            <ul>
              <li>Marketing websites and landing pages</li>
              <li>Portfolio sites and personal blogs</li>
              <li>Documentation and help centers</li>
              <li>Event pages and campaign microsites</li>
              <li>Prototypes and demos</li>
              <li>Offline-capable web applications</li>
            </ul>
          </div>
        </div>

        {/* Quick Stats */}
        <div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Export Capabilities
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">HTML Minification</span>
                <span className="text-sm font-medium text-green-600">✓</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">CSS Optimization</span>
                <span className="text-sm font-medium text-green-600">✓</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Asset Extraction</span>
                <span className="text-sm font-medium text-green-600">✓</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Base64 Encoding</span>
                <span className="text-sm font-medium text-green-600">✓</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Script Removal</span>
                <span className="text-sm font-medium text-green-600">✓</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">ZIP Packaging</span>
                <span className="text-sm font-medium text-green-600">✓</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Performance Impact
            </h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">10x</div>
              <div className="text-sm text-gray-600 mb-4">
                Faster Load Times
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-2">99.9%</div>
              <div className="text-sm text-gray-600">Uptime Reliability</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 rounded-lg p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          How Static Site Export Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              1
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Input Processing
            </h3>
            <p className="text-gray-600">
              Upload your HTML file or paste the code. The tool analyzes the
              structure and identifies embedded styles, scripts, and assets.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              2
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Optimization
            </h3>
            <p className="text-gray-600">
              Apply minification, asset extraction, and optimization settings.
              Remove unnecessary scripts, inline critical CSS, and encode
              images.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-purple-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              3
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Export & Download
            </h3>
            <p className="text-gray-600">
              Generate optimized static files. Download as a single HTML file or
              complete ZIP package ready for static hosting deployment.
            </p>
          </div>
        </div>
      </div>

      {/* Advanced Features */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Advanced Export Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Asset Management
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Extract inline CSS to separate files</li>
              <li>• Convert images to Base64 for single-file exports</li>
              <li>• Remove or preserve JavaScript based on needs</li>
              <li>• Optimize file sizes with minification</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Customization Options
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Inject custom CSS styles</li>
              <li>• Update page titles and metadata</li>
              <li>• Configure export formats (HTML/ZIP)</li>
              <li>• Live preview before export</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Optimization Features
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• HTML and CSS minification</li>
              <li>• Whitespace and comment removal</li>
              <li>• Asset size optimization</li>
              <li>• Performance-focused transformations</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Deployment Ready
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Compatible with all static hosts</li>
              <li>• GitHub Pages optimized</li>
              <li>• CDN deployment ready</li>
              <li>• Offline-capable websites</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="bg-blue-50 rounded-lg p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Perfect Use Cases
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Marketing Sites
            </h3>
            <p className="text-gray-600 mb-4">
              Create fast-loading landing pages and campaign sites that convert
              visitors without server dependencies.
            </p>
            <div className="text-sm text-blue-600 font-medium">
              → 300% faster load times
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Documentation
            </h3>
            <p className="text-gray-600 mb-4">
              Host API docs, user guides, and help centers that are always
              available and searchable by search engines.
            </p>
            <div className="text-sm text-green-600 font-medium">
              → Perfect SEO scores
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Portfolio Websites
            </h3>
            <p className="text-gray-600 mb-4">
              Showcase your work with beautiful, fast-loading portfolio sites
              hosted on free platforms like GitHub Pages.
            </p>
            <div className="text-sm text-purple-600 font-medium">
              → Zero hosting costs
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Event Pages
            </h3>
            <p className="text-gray-600 mb-4">
              Create event microsites and registration pages that handle traffic
              spikes without server scaling concerns.
            </p>
            <div className="text-sm text-orange-600 font-medium">
              → Unlimited scalability
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Prototypes & Demos
            </h3>
            <p className="text-gray-600 mb-4">
              Share interactive prototypes and product demos as self-contained
              files that work offline and load instantly.
            </p>
            <div className="text-sm text-red-600 font-medium">
              → Offline capable
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Backup Archives
            </h3>
            <p className="text-gray-600 mb-4">
              Create permanent archives of websites that will remain accessible
              even if the original servers go down.
            </p>
            <div className="text-sm text-indigo-600 font-medium">
              → Permanent preservation
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          <details className="bg-white border border-gray-200 rounded-lg p-6">
            <summary className="font-semibold text-gray-900 cursor-pointer">
              What types of websites can be exported?
            </summary>
            <div className="mt-4 text-gray-600">
              Any website that can be rendered as HTML can be exported. This
              includes static sites, dynamic sites with client-side JavaScript,
              and even complex web applications. The tool works best with
              content that doesn&apos;t require server-side processing.
            </div>
          </details>

          <details className="bg-white border border-gray-200 rounded-lg p-6">
            <summary className="font-semibold text-gray-900 cursor-pointer">
              Will interactive features still work after export?
            </summary>
            <div className="mt-4 text-gray-600">
              Client-side JavaScript functionality will be preserved unless you
              choose to remove scripts. Server-side features like forms,
              databases, and authentication will not work in the static version.
              Consider these as &quot;read-only&quot; versions of your dynamic
              sites.
            </div>
          </details>

          <details className="bg-white border border-gray-200 rounded-lg p-6">
            <summary className="font-semibold text-gray-900 cursor-pointer">
              What&apos;s the difference between single HTML and ZIP export?
            </summary>
            <div className="mt-4 text-gray-600">
              Single HTML creates one self-contained file with all assets
              embedded (Base64 images, inline CSS). ZIP export creates separate
              files for HTML, CSS, JavaScript, and assets, which is better for
              larger sites and allows for better organization and caching.
            </div>
          </details>

          <details className="bg-white border border-gray-200 rounded-lg p-6">
            <summary className="font-semibold text-gray-900 cursor-pointer">
              Can I host the exported site anywhere?
            </summary>
            <div className="mt-4 text-gray-600">
              Yes! Static sites can be hosted on any web server, CDN, or static
              hosting service including: GitHub Pages, Netlify, Vercel, AWS S3,
              Google Cloud Storage, Azure Static Web Apps, and traditional web
              hosting providers.
            </div>
          </details>

          <details className="bg-white border border-gray-200 rounded-lg p-6">
            <summary className="font-semibold text-gray-900 cursor-pointer">
              How much smaller are the exported files?
            </summary>
            <div className="mt-4 text-gray-600">
              Minification typically reduces file sizes by 20-50%. Additional
              optimizations like Base64 encoding for small images and asset
              extraction can further optimize loading. The exact savings depend
              on your original code quality and chosen options.
            </div>
          </details>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">
          Ready to Export Your Static Site?
        </h2>
        <p className="text-lg mb-6 opacity-90">
          Transform your dynamic website into a fast, reliable static site in
          seconds. Perfect for marketing pages, portfolios, documentation, and
          more.
        </p>
        <ScrollToStaticExporterButton />
      </div>
    </div>
  );
}
