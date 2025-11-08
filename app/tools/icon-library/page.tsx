import { Metadata } from "next";
import IconLibraryClient from "@/components/tools/IconLibraryClient";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Icon & Illustration Library - Free SVG Icons & Illustrations | Multi Tool Platform",
  description: "Browse and download free SVG icons and illustrations. Search through thousands of icons, customize colors and sizes, and export in multiple formats for your projects.",
  keywords: [
    "free icons",
    "svg icons",
    "illustrations",
    "icon library",
    "vector icons",
    "icon pack",
    "illustration library",
    "icon search",
    "svg illustrations",
    "icon collection",
    "design assets",
    "ui icons",
    "web icons",
    "mobile icons",
    "icon customization",
    "icon export",
    "vector graphics",
    "design resources",
    "icon toolkit",
    "illustration assets",
    "free svg icons",
    "icon download",
    "icon editor",
    "icon converter",
    "icon optimization",
    "responsive icons",
    "icon accessibility",
    "icon categories",
    "icon tags",
    "design system icons"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multitoolplatform.com"),
  alternates: {
    canonical: "/tools/icon-library",
  },
  openGraph: {
    title: "Icon & Illustration Library - Free SVG Icons & Illustrations",
    description: "Access thousands of free SVG icons and illustrations. Search, customize colors and sizes, and download icons in multiple formats for your design projects.",
    url: "/tools/icon-library",
    siteName: "Multi Tool Platform",
    images: [
      {
        url: "/og-icon-library.jpg",
        width: 1200,
        height: 630,
        alt: "Icon & Illustration Library - Free SVG Icons and Illustrations",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Icon & Illustration Library - Free SVG Icons & Illustrations",
    description: "Browse thousands of free SVG icons and illustrations. Customize and download for your design projects with multiple export formats.",
    images: ["/og-icon-library.jpg"],
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
  category: "design tools",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Icon & Illustration Library",
  "description": "Browse and download free SVG icons and illustrations. Search through thousands of icons, customize colors and sizes, and export in multiple formats for your projects.",
  "url": "https://multitoolplatform.com/tools/icon-library",
  "applicationCategory": "DesignApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
  },
  "featureList": [
    "Free SVG icons collection",
    "Vector illustrations library",
    "Advanced icon search",
    "Color customization",
    "Size adjustment",
    "Multiple export formats",
    "Icon categorization",
    "Real-time preview",
    "Accessibility features",
    "Design system integration"
  ],
  "screenshot": "/og-icon-library.jpg",
  "author": {
    "@type": "Organization",
    "name": "Multi Tool Platform",
  },
  "publisher": {
    "@type": "Organization",
    "name": "Multi Tool Platform",
  },
  "datePublished": new Date().toISOString().split('T')[0],
  "dateModified": new Date().toISOString().split('T')[0],
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
      "name": "Icon Library",
      "item": "https://multitoolplatform.com/tools/icon-library"
    }
  ]
};

export default function IconLibraryPage() {
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
            Icon & Illustration Library
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Access thousands of free, high-quality SVG icons and illustrations for your projects.
            Search, customize, and download icons in multiple formats with advanced filtering
            and real-time preview capabilities to enhance your design workflow.
          </p>

          {/* Key Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">🔍</div>
              <h3 className="font-semibold mb-1">Advanced Search</h3>
              <p className="text-sm text-muted-foreground">
                Find icons instantly with powerful search and filtering
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">🎨</div>
              <h3 className="font-semibold mb-1">Customization</h3>
              <p className="text-sm text-muted-foreground">
                Customize colors, sizes, and styles in real-time
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">📥</div>
              <h3 className="font-semibold mb-1">Multiple Formats</h3>
              <p className="text-sm text-muted-foreground">
                Download in SVG, PNG, and other popular formats
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">🏷️</div>
              <h3 className="font-semibold mb-1">Categorized</h3>
              <p className="text-sm text-muted-foreground">
                Organized by categories and tags for easy discovery
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
  <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Find Perfect Icons?
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Start browsing thousands of free SVG icons and illustrations.
            Customize, download, and enhance your designs with our comprehensive icon library.
          </p>
          <a
            href="#icon-library-tool"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Browse Icon Library
          </a>
        </div>

        {/* Tool Component */}
        <div id="icon-library-tool">
          <IconLibraryClient />
        </div>

        {/* Documentation Section */}
        <div className="mt-16 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">How to Use</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Follow these steps to find and customize the perfect icons for your project
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Getting Started */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">1. Search & Browse</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Use the search bar to find icons by name or keyword</p>
                  <p>• Browse by categories (UI, commerce, social, etc.)</p>
                  <p>• Filter by style (outline, filled, hand-drawn, etc.)</p>
                  <p>• View trending and recently added icons</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">2. Preview & Select</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Click on any icon to see a larger preview</p>
                  <p>• View icon details including size and format options</p>
                  <p>• Check compatibility with your design system</p>
                  <p>• Add icons to your favorites for quick access</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">3. Customize</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Adjust icon size with the size slider</p>
                  <p>• Change colors using the color picker</p>
                  <p>• Apply stroke width adjustments</p>
                  <p>• Preview changes in real-time</p>
                </div>
              </div>
            </div>

            {/* Advanced Features */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">4. Choose Format</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Select SVG for scalable vector graphics</p>
                  <p>• Choose PNG for raster images with transparency</p>
                  <p>• Download multiple sizes at once</p>
                  <p>• Get optimized files for web or print</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">5. Download & Export</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Click download to get individual icons</p>
                  <p>• Export multiple icons as a package</p>
                  <p>• Get CSS classes for web integration</p>
                  <p>• Download with proper attribution if required</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">6. Integration</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Copy SVG code directly to your clipboard</p>
                  <p>• Import into design tools (Figma, Sketch, etc.)</p>
                  <p>• Use in development frameworks and libraries</p>
                  <p>• Integrate with icon font systems</p>
                </div>
              </div>
            </div>
          </div>

          {/* Icon Categories */}
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Icon Categories & Styles</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">UI</span>
                </div>
                <div>
                  <div className="font-medium">User Interface</div>
                  <div className="text-sm text-muted-foreground">Navigation, controls, actions</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">E</span>
                </div>
                <div>
                  <div className="font-medium">E-commerce</div>
                  <div className="text-sm text-muted-foreground">Shopping, payment, commerce</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-purple-600 dark:text-purple-400">S</span>
                </div>
                <div>
                  <div className="font-medium">Social Media</div>
                  <div className="text-sm text-muted-foreground">Platforms, sharing, communication</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-orange-600 dark:text-orange-400">B</span>
                </div>
                <div>
                  <div className="font-medium">Business</div>
                  <div className="text-sm text-muted-foreground">Corporate, productivity, finance</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">T</span>
                </div>
                <div>
                  <div className="font-medium">Technology</div>
                  <div className="text-sm text-muted-foreground">Development, cloud, data</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">A</span>
                </div>
                <div>
                  <div className="font-medium">Illustrations</div>
                  <div className="text-sm text-muted-foreground">Hand-drawn, abstract, decorative</div>
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
                  <span className="text-2xl">🔍</span>
                </div>
                <h4 className="font-semibold mb-2">1. Discover</h4>
                <p className="text-sm text-muted-foreground">
                  Search through our extensive collection of icons and illustrations
                  using keywords, categories, or visual browsing.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎨</span>
                </div>
                <h4 className="font-semibold mb-2">2. Customize</h4>
                <p className="text-sm text-muted-foreground">
                  Adjust colors, sizes, and styles to match your brand and design
                  requirements with our real-time customization tools.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📥</span>
                </div>
                <h4 className="font-semibold mb-2">3. Download</h4>
                <p className="text-sm text-muted-foreground">
                  Download your customized icons in the format you need, ready to
                  use in your projects, designs, or applications.
                </p>
              </div>
            </div>
          </div>

          {/* Use Cases */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Common Use Cases</h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Web Development</h4>
                <p className="text-sm text-muted-foreground">
                  Enhance websites and web applications with consistent, scalable
                  icons that work across all devices and screen sizes.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Mobile Apps</h4>
                <p className="text-sm text-muted-foreground">
                  Create intuitive mobile interfaces with icons optimized for touch
                  interactions and various mobile screen densities.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">UI/UX Design</h4>
                <p className="text-sm text-muted-foreground">
                  Build comprehensive design systems with consistent iconography
                  that enhances user experience and visual communication.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Marketing Materials</h4>
                <p className="text-sm text-muted-foreground">
                  Create professional marketing collateral, presentations, and
                  graphics with high-quality, customizable illustrations.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Brand Guidelines</h4>
                <p className="text-sm text-muted-foreground">
                  Develop and maintain brand consistency with a curated set of
                  icons that align with your brand identity and guidelines.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Print Design</h4>
                <p className="text-sm text-muted-foreground">
                  Use vector illustrations for print materials, ensuring crisp,
                  scalable graphics for brochures, posters, and packaging.
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
                  Icon Design Best Practices
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
                  <div>
                    <strong>Consistency:</strong> Use icons from the same style family to maintain visual coherence across your interface.
                  </div>
                  <div>
                    <strong>Accessibility:</strong> Ensure sufficient color contrast and consider how icons appear for users with visual impairments.
                  </div>
                  <div>
                    <strong>Scalability:</strong> Choose SVG format for crisp display at any size, especially important for responsive designs.
                  </div>
                  <div>
                    <strong>Meaning:</strong> Select icons that clearly communicate their function without requiring additional explanation.
                  </div>
                  <div>
                    <strong>Size Guidelines:</strong> Use appropriate sizes (16px, 24px, 32px, 48px) based on context and importance.
                  </div>
                  <div>
                    <strong>Touch Targets:</strong> Ensure interactive icons meet minimum touch target sizes for mobile interfaces.
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
                <h4 className="font-medium mb-2">Are all icons free to use?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, all icons in our library are free to use for personal and commercial projects.
                  Some icons may require attribution - this will be indicated when downloading.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Can I modify the icons?</h4>
                <p className="text-sm text-muted-foreground">
                  Absolutely! You can customize colors, sizes, and styles using our built-in tools.
                  For more advanced modifications, download the SVG and edit in your preferred vector software.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">What formats are available for download?</h4>
                <p className="text-sm text-muted-foreground">
                  We offer SVG (recommended for web), PNG (with transparency), and other popular formats.
                  SVG files are scalable and perfect for responsive designs.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">How often is the library updated?</h4>
                <p className="text-sm text-muted-foreground">
                  Our library is regularly updated with new icons and illustrations.
                  We add trending icons and respond to community requests for specific icon types.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Can I request specific icons?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes! We welcome icon requests from our community. If you need a specific icon that's not in our library,
                  you can submit a request and we'll consider adding it to our collection.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Are the icons optimized for performance?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, all icons are optimized for web performance. SVG files are minified, and PNG files are compressed
                  while maintaining quality. This ensures fast loading times for your projects.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
