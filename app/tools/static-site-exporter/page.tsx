import { Metadata } from "next";
import StaticSiteExporterClient from "@/components/tools/static-site-exporter-client";
import ScrollToStaticExporterButton from "@/components/tools/scroll-to-static-exporter-button";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Static Site Exporter - Convert Dynamic Sites to Static HTML | Multi-Tool Platform",
  description: "Free online static site exporter. Convert dynamic websites to static HTML files with asset extraction, code minification, and optimization. Perfect for CDN hosting, GitHub Pages, and static deployment.",
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
    "dynamic to static",
    "website archiver",
    "static site deployment"
  ],
  ...SHARED_METADATA,
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
    title: "Static Site Exporter - Convert Dynamic Sites to Static HTML",
    description: "Transform dynamic websites into static HTML files with asset extraction, minification, and optimization for static hosting and CDNs.",
    url: "/tools/static-site-exporter",
    siteName: "Multi Tool Platform",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-static-site-exporter.png",
        width: 1200,
        height: 630,
        alt: "Static Site Exporter Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Static Site Exporter - Convert Dynamic Sites to Static HTML",
    description: "Transform dynamic websites into static HTML files with asset extraction, minification, and optimization for static hosting and CDNs.",
    images: ["/og-static-site-exporter.png"],
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
  category: "development tools",
};

export default function StaticSiteExporterPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Static Site Exporter",
    "description": "Advanced online tool for converting dynamic websites to static HTML files with comprehensive asset extraction, code optimization, and deployment-ready packaging.",
    "url": "https://multitoolplatform.com/tools/static-site-exporter",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "Complete HTML export with asset extraction",
      "Advanced code minification and optimization",
      "Base64 image encoding for single-file exports",
      "Flexible script removal and preservation options",
      "Custom CSS injection and styling",
      "ZIP package generation for organized deployment",
      "Live preview functionality before export",
      "Multiple export formats (HTML/ZIP)",
      "GitHub Pages and CDN optimization",
      "Offline-capable static website creation"
    ],
    "screenshot": "/og-static-site-exporter.png",
    "author": {
      "@type": "Organization",
      "name": "Multi-Tool Platform",
    },
  };

  const breadcrumbLd = {
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
        "name": "Static Site Exporter",
        "item": "https://multitoolplatform.com/tools/static-site-exporter"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbLd),
        }}
      />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
              Static Site Exporter
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Transform dynamic websites into static HTML files with asset extraction, code minification, and optimization.
              Create deployment-ready static sites perfect for CDN hosting, GitHub Pages, and any static hosting service.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                HTML Export
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Asset Extraction
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Code Minification
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                Static Hosting Ready
              </span>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Complete HTML Export</h3>
              <p className="text-muted-foreground">
                Transform entire dynamic websites into static HTML files with all content, styles, and functionality preserved for static hosting.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Asset Extraction</h3>
              <p className="text-muted-foreground">
                Automatically extract and optimize all website assets including images, CSS, JavaScript, and external resources for static deployment.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0V1m10 3V1m0 3l1 1v16a2 2 0 01-2 2H6a2 2 0 01-2-2V5l1-1z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Code Minification</h3>
              <p className="text-muted-foreground">
                Minify HTML, CSS, and JavaScript code to reduce file sizes and improve loading performance for production deployment.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Base64 Encoding</h3>
              <p className="text-muted-foreground">
                Convert images and assets to Base64 encoding for single-file HTML exports, eliminating external dependencies and improving portability.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">ZIP Packaging</h3>
              <p className="text-muted-foreground">
                Generate organized ZIP packages with separate files for HTML, CSS, JavaScript, and assets, perfect for version control and deployment.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Live Preview</h3>
              <p className="text-muted-foreground">
                Preview exported results in real-time before downloading, ensuring the static version meets your requirements and expectations.
              </p>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6">How to Use Static Site Exporter</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">1. Input Your Website</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Upload HTML file or paste website code</li>
                  <li>• Enter website URL for direct processing</li>
                  <li>• Support for complete web pages with all assets</li>
                  <li>• Automatic detection of embedded resources</li>
                  <li>• Preview input content before processing</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">2. Configure Export Options</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Choose export format (single HTML or ZIP)</li>
                  <li>• Enable/disable code minification</li>
                  <li>• Configure asset extraction settings</li>
                  <li>• Set Base64 encoding options for images</li>
                  <li>• Customize script removal preferences</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">3. Optimize & Process</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Apply HTML and CSS minification</li>
                  <li>• Extract and optimize all assets</li>
                  <li>• Convert images to Base64 if selected</li>
                  <li>• Remove unnecessary scripts and code</li>
                  <li>• Generate optimized static files</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">4. Download & Deploy</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Download single HTML file or ZIP package</li>
                  <li>• Deploy to GitHub Pages, Netlify, or CDN</li>
                  <li>• Upload to any static hosting service</li>
                  <li>• Share static version with stakeholders</li>
                  <li>• Archive for permanent preservation</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-8 border mb-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Export Your Website to Static Files?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Start converting your dynamic website to static HTML files now. Extract assets, minify code, and create deployment-ready static sites for CDN hosting.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Start Exporting Site
                </button>
                <button className="border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 px-6 py-3 rounded-lg font-medium transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* Static Site Exporter Component */}
          <div className="mb-12">
            <StaticSiteExporterClient />
          </div>

          {/* Educational Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* About Static Site Export */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4">What is Static Site Export?</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p>
                  Static site export transforms dynamic web applications into static HTML files that can be served directly from any web server or CDN.
                  This process eliminates the need for server-side processing, database connections, or complex runtime environments.
                </p>

                <h3>Key Benefits of Static Sites</h3>
                <ul>
                  <li><strong>Lightning Fast:</strong> No server processing means instant page loads</li>
                  <li><strong>Highly Reliable:</strong> No database or server failures to worry about</li>
                  <li><strong>Cost Effective:</strong> Host on free services like GitHub Pages or Netlify</li>
                  <li><strong>SEO Friendly:</strong> Search engines love fast, crawlable static content</li>
                  <li><strong>Version Control:</strong> Entire site can be tracked in Git</li>
                  <li><strong>Security:</strong> No server-side vulnerabilities or database attacks</li>
                </ul>
              </div>
            </div>

            {/* Export Capabilities */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Export Capabilities</h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">HTML Minification</h4>
                  <p className="text-sm text-muted-foreground">
                    Remove unnecessary whitespace, comments, and optimize HTML structure
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Asset Extraction</h4>
                  <p className="text-sm text-muted-foreground">
                    Extract inline CSS, JavaScript, and optimize external resources
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950 dark:to-violet-900 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Base64 Encoding</h4>
                  <p className="text-sm text-muted-foreground">
                    Convert images to Base64 for single-file HTML exports
                  </p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-950 dark:to-amber-900 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">ZIP Packaging</h4>
                  <p className="text-sm text-muted-foreground">
                    Generate organized ZIP packages for deployment and version control
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">How Static Site Export Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold mb-2">Input Processing</h3>
                <p className="text-muted-foreground">
                  Upload your HTML file or paste the code. The tool analyzes the structure and identifies embedded styles, scripts, and assets.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold mb-2">Optimization</h3>
                <p className="text-muted-foreground">
                  Apply minification, asset extraction, and optimization settings. Remove unnecessary scripts, inline critical CSS, and encode images.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold mb-2">Export & Download</h3>
                <p className="text-muted-foreground">
                  Generate optimized static files. Download as a single HTML file or complete ZIP package ready for static hosting deployment.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-card rounded-lg p-8 border mt-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What types of websites can be exported?</h3>
                <p className="text-muted-foreground">
                  Any website that can be rendered as HTML can be exported. This includes static sites, dynamic sites with client-side JavaScript, and even complex web applications. The tool works best with content that doesn't require server-side processing.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Will interactive features still work after export?</h3>
                <p className="text-muted-foreground">
                  Client-side JavaScript functionality will be preserved unless you choose to remove scripts. Server-side features like forms, databases, and authentication will not work in the static version. Consider these as "read-only" versions of your dynamic sites.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">What's the difference between single HTML and ZIP export?</h3>
                <p className="text-muted-foreground">
                  Single HTML creates one self-contained file with all assets embedded (Base64 images, inline CSS). ZIP export creates separate files for HTML, CSS, JavaScript, and assets, which is better for larger sites and allows for better organization and caching.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I host the exported site anywhere?</h3>
                <p className="text-muted-foreground">
                  Yes! Static sites can be hosted on any web server, CDN, or static hosting service including GitHub Pages, Netlify, Vercel, AWS S3, Google Cloud Storage, Azure Static Web Apps, and traditional web hosting providers.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">How much smaller are the exported files?</h3>
                <p className="text-muted-foreground">
                  Minification typically reduces file sizes by 20-50%. Additional optimizations like Base64 encoding for small images and asset extraction can further optimize loading. The exact savings depend on your original code quality and chosen options.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
