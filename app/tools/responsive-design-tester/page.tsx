import { Metadata } from "next";
import ResponsiveDesignTesterClient from "@/components/tools/responsive-design-tester-client";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Responsive Design Tester - Test Websites on Multiple Devices Online | Multi-Tool Platform",
  description: "Free online responsive design tester. Preview and test websites across phones, tablets, and desktops with interactive device emulation. Ensure perfect responsiveness with live previews and custom screen sizes.",
  keywords: [
    "responsive design tester",
    "device emulator",
    "mobile testing",
    "responsive preview",
    "cross-device testing",
    "website testing",
    "device simulation",
    "mobile preview",
    "tablet testing",
    "desktop preview",
    "responsive breakpoints",
    "device rotation",
    "screen size testing",
    "mobile optimization",
    "responsive web design"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multitoolplatform.com"),
  alternates: {
    canonical: "/tools/responsive-design-tester",
  },
  openGraph: {
    title: "Responsive Design Tester - Test Websites on Multiple Devices Online",
    description: "Free online responsive design tester with device emulation and live previews across phones, tablets, and desktops.",
    url: "/tools/responsive-design-tester",
    siteName: "Multi Tool Platform",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-responsive-tester.png",
        width: 1200,
        height: 630,
        alt: "Responsive Design Tester Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Responsive Design Tester - Test Websites on Multiple Devices Online",
    description: "Free online responsive design tester with device emulation and live previews across phones, tablets, and desktops.",
    images: ["/og-responsive-tester.png"],
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

export default function ResponsiveDesignTesterPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Responsive Design Tester",
    "description": "Interactive responsive design testing tool with device emulation, live previews, and cross-device compatibility testing for modern web development.",
    "url": "https://multitoolplatform.com/tools/responsive-design-tester",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "Live website preview across multiple devices",
      "Pre-configured device presets (phones, tablets, desktops)",
      "Custom screen dimensions and zoom levels",
      "Device rotation and orientation testing",
      "Responsive breakpoint visualization",
      "URL and HTML code testing",
      "Embed code generation for sharing",
      "Real-time responsive testing",
      "Touch-friendly interface testing",
      "Performance optimization insights"
    ],
    "screenshot": "/og-responsive-tester.png",
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
        "name": "Responsive Design Tester",
        "item": "https://multitoolplatform.com/tools/responsive-design-tester"
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
              Responsive Design Tester
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Test your website's responsiveness across different devices and screen sizes with interactive previews and device emulation.
              Ensure perfect user experience on all devices.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Device Emulation
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Live Preview
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Cross-Device Testing
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                Responsive Breakpoints
              </span>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Device Emulation</h3>
              <p className="text-muted-foreground">
                Test websites on popular devices including iPhone, iPad, Samsung Galaxy, and custom screen sizes with accurate emulation.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Live Preview</h3>
              <p className="text-muted-foreground">
                Real-time preview of websites and HTML code across different devices with instant updates and responsive testing.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Custom Dimensions</h3>
              <p className="text-muted-foreground">
                Test with custom screen dimensions, zoom levels, and aspect ratios to cover all possible device configurations.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Device Rotation</h3>
              <p className="text-muted-foreground">
                Test portrait and landscape orientations to ensure your design works perfectly in both device positions.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Breakpoint Testing</h3>
              <p className="text-muted-foreground">
                Visualize and test responsive breakpoints with clear indicators showing when your design adapts to different screen sizes.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Testing</h3>
              <p className="text-muted-foreground">
                All testing happens locally in your browser. Websites are loaded through secure proxies without compromising your data.
              </p>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6">How to Use Responsive Design Tester</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">1. Enter Website URL</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Input any website URL to test</li>
                  <li>• Supports HTTP and HTTPS websites</li>
                  <li>• Test local development servers</li>
                  <li>• Works with staging environments</li>
                  <li>• Real-time loading and preview</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">2. Select Device Preset</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Choose from popular device presets</li>
                  <li>• iPhone, iPad, Samsung Galaxy options</li>
                  <li>• Desktop resolutions available</li>
                  <li>• Custom device configurations</li>
                  <li>• One-click device switching</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">3. Test Responsiveness</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Rotate device orientation</li>
                  <li>• Adjust zoom levels</li>
                  <li>• Test touch interactions</li>
                  <li>• Check breakpoint behavior</li>
                  <li>• Identify responsive issues</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">4. Generate Reports</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Create embed codes for sharing</li>
                  <li>• Export test configurations</li>
                  <li>• Document responsive issues</li>
                  <li>• Share test results with team</li>
                  <li>• Save test scenarios</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-8 border mb-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Test Your Website's Responsiveness?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Start testing your website across different devices and screen sizes now. Preview your site on phones, tablets, and desktops with our interactive responsive design tester.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Start Testing Responsiveness
                </button>
                <button className="border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 px-6 py-3 rounded-lg font-medium transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* Responsive Design Tester Component */}
          <ResponsiveDesignTesterClient />

          {/* Educational Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* What is Responsive Design Testing */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4">About Responsive Design Testing</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p>
                  Responsive design testing ensures your website looks great and functions perfectly on all devices. Our interactive tool lets you preview your site on popular devices and custom screen sizes, helping you identify and fix responsive design issues before they affect your users.
                </p>

                <h3>Why Responsive Testing Matters</h3>
                <ul>
                  <li><strong>Mobile-First World:</strong> Over 60% of web traffic comes from mobile devices</li>
                  <li><strong>User Experience:</strong> Poor mobile experience leads to higher bounce rates</li>
                  <li><strong>SEO Impact:</strong> Google prioritizes mobile-friendly websites in search results</li>
                  <li><strong>Business Impact:</strong> Mobile optimization directly affects conversion rates</li>
                  <li><strong>Cross-Device Consistency:</strong> Ensure brand consistency across all devices</li>
                </ul>
              </div>
            </div>

            {/* Device Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Supported Devices</h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    📱 Mobile Phones
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• iPhone 14, 14 Pro Max</li>
                    <li>• Samsung Galaxy S23</li>
                    <li>• Google Pixel 7</li>
                    <li>• Custom mobile sizes</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    📱 Tablets
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• iPad, iPad Pro 12.9"</li>
                    <li>• Samsung Galaxy Tab S8</li>
                    <li>• Custom tablet sizes</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950 dark:to-violet-900 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    🖥️ Desktops
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 1080p, 1440p, 4K displays</li>
                    <li>• Custom desktop resolutions</li>
                    <li>• Multiple aspect ratios</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Best Practices */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Responsive Design Best Practices</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Layout & Structure</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Use fluid grid systems with relative units</li>
                  <li>• Implement mobile-first design approach</li>
                  <li>• Apply CSS media queries for breakpoints</li>
                  <li>• Use flexible images and media</li>
                  <li>• Design touch-friendly interfaces</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Performance & UX</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Optimize images for different screen sizes</li>
                  <li>• Ensure readable font sizes on mobile</li>
                  <li>• Maintain proper contrast ratios</li>
                  <li>• Test loading speeds on mobile networks</li>
                  <li>• Validate form usability on small screens</li>
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-card rounded-lg p-8 border mt-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What is responsive design testing?</h3>
                <p className="text-muted-foreground">
                  Responsive design testing ensures your website adapts properly to different screen sizes and devices. It involves checking layouts, content, and functionality across phones, tablets, and desktops to provide optimal user experience.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Why is mobile testing important?</h3>
                <p className="text-muted-foreground">
                  Mobile devices account for over 60% of web traffic. Poor mobile experience leads to higher bounce rates, lower conversion rates, and negatively impacts SEO rankings. Mobile-first testing ensures your site meets user expectations.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">What devices should I test on?</h3>
                <p className="text-muted-foreground">
                  Test on popular devices like iPhone, iPad, Samsung Galaxy phones and tablets, and various desktop resolutions. Focus on the most common screen sizes in your target audience's device usage statistics.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">How do I test local development sites?</h3>
                <p className="text-muted-foreground">
                  You can test local development servers by entering localhost URLs (e.g., http://localhost:3000) or your local IP address. Make sure your development server allows cross-origin requests if needed.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Is my website data secure during testing?</h3>
                <p className="text-muted-foreground">
                  Yes, all testing happens locally in your browser. Websites are loaded through secure proxies, and no data is stored or transmitted to external servers. Your testing remains completely private and secure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

        {/* SEO Content */}
        <section className="mt-12 space-y-6">
          <div>
            <h2 className="mb-4 text-2xl font-bold">
              About Responsive Design Testing
            </h2>
            <p className="text-muted-foreground">
              Ensure your website looks great and functions perfectly on all
              devices. Our responsive design tester lets you preview your site
              on popular devices and custom screen sizes, helping you identify
              and fix responsive design issues before they affect your users.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-semibold">Key Features</h3>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li>Live preview of websites and HTML code</li>
              <li>
                Pre-configured device presets (iPhone, iPad, Desktop, etc.)
              </li>
              <li>Custom screen dimensions and zoom levels</li>
              <li>Device rotation and orientation testing</li>
              <li>Responsive breakpoint visualization</li>
              <li>Embed code generation for sharing previews</li>
              <li>Real-time testing without leaving your browser</li>
              <li>
                Completely client-side &mdash; your data never leaves your
                browser
              </li>
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
                  Enter any website URL to test its responsiveness. Perfect for
                  testing live websites, staging environments, or local
                  development servers.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">HTML Code Testing</h4>
                <p className="text-sm text-muted-foreground">
                  Paste HTML code directly for testing. Ideal for prototyping,
                  testing code snippets, or validating responsive design
                  patterns.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-semibold">
              Responsive Design Best Practices
            </h3>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li>
                <strong>Mobile-first approach:</strong> Design for mobile
                devices first, then enhance for larger screens
              </li>
              <li>
                <strong>Flexible layouts:</strong> Use relative units (%, em,
                rem) instead of fixed pixels
              </li>
              <li>
                <strong>Media queries:</strong> Apply different styles based on
                screen size breakpoints
              </li>
              <li>
                <strong>Touch-friendly:</strong> Ensure buttons and interactive
                elements are at least 44px
              </li>
              <li>
                <strong>Readable text:</strong> Maintain good contrast ratios
                and readable font sizes
              </li>
              <li>
                <strong>Performance:</strong> Optimize images and reduce HTTP
                requests for mobile users
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-semibold">
              Common Issues to Check
            </h3>
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
