import { Metadata } from "next";
import ThemeBuilderClient from "@/components/tools/theme-builder-client";
import ScrollToThemeBuilderButton from "@/components/tools/scroll-to-theme-builder-button";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Theme Builder - Create Design Systems with Color Palettes & CSS Variables | Multi-Tool Platform",
  description: "Free online theme builder for creating comprehensive design systems. Generate color palettes, typography scales, spacing systems, and CSS custom properties. Build consistent UI themes for web development.",
  keywords: [
    "theme builder",
    "design system",
    "color palette generator",
    "CSS variables",
    "typography scale",
    "design tokens",
    "UI theme",
    "custom properties",
    "spacing system",
    "brand guidelines",
    "component library",
    "dark mode",
    "CSS framework",
    "design tokens",
    "theme generator"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multitoolplatform.com"),
  alternates: {
    canonical: "/tools/theme-builder",
  },
  openGraph: {
    title: "Theme Builder - Create Design Systems with Color Palettes & CSS Variables",
    description: "Build comprehensive design systems with beautiful color palettes, typography scales, spacing systems, and CSS variables for consistent UI design.",
    url: "/tools/theme-builder",
    siteName: "Multi Tool Platform",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-theme-builder.png",
        width: 1200,
        height: 630,
        alt: "Theme Builder Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Theme Builder - Create Design Systems with Color Palettes & CSS Variables",
    description: "Build comprehensive design systems with beautiful color palettes, typography scales, spacing systems, and CSS variables for consistent UI design.",
    images: ["/og-theme-builder.png"],
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

export default function ThemeBuilderPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Theme Builder",
    "description": "Advanced online tool for creating comprehensive design systems with color palettes, typography scales, spacing systems, and CSS custom properties for consistent UI development.",
    "url": "https://multitoolplatform.com/tools/theme-builder",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "Advanced color palette generator with complementary colors",
      "Comprehensive typography scale builder with font weights and line heights",
      "Consistent spacing system with scalable tokens",
      "Border radius and shadow configuration system",
      "CSS custom properties generation for modern theming",
      "Live theme preview with real-time updates",
      "Predefined theme palettes for quick start",
      "CSS export and clipboard copy functionality",
      "Dark mode support with automatic contrast checking",
      "Framework-agnostic design token generation",
      "Integration with React, Tailwind CSS, and Figma",
      "JSON configuration export for version control"
    ],
    "screenshot": "/og-theme-builder.png",
    "author": {
      "@type": "Organization",
      "name": "Multi-Tool Platform",
    },
    "publisher": {
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
        "name": "Theme Builder",
        "item": "https://multitoolplatform.com/tools/theme-builder"
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
              Theme Builder
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Create comprehensive design systems with beautiful color palettes, typography scales, spacing systems, and CSS variables.
              Generate production-ready themes for consistent UI design across all your projects.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Design Systems
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                CSS Variables
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Color Palettes
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                Typography Scale
              </span>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Color Palette Generator</h3>
              <p className="text-muted-foreground">
                Generate harmonious color palettes with complementary colors, semantic assignments, and accessibility contrast checking for inclusive design.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Typography Scale Builder</h3>
              <p className="text-muted-foreground">
                Create consistent typography systems with modular scales, font weights, line heights, and responsive text sizing for optimal readability.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Spacing System</h3>
              <p className="text-muted-foreground">
                Establish consistent spacing scales, border radius systems, and shadow definitions for cohesive layouts and component spacing.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">CSS Custom Properties</h3>
              <p className="text-muted-foreground">
                Generate modern CSS variables for theming, enabling dynamic theme switching and consistent styling across your entire application.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Live Theme Preview</h3>
              <p className="text-muted-foreground">
                See your design system come to life with real-time preview updates, allowing you to refine colors, typography, and spacing instantly.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Export & Integration</h3>
              <p className="text-muted-foreground">
                Export themes as CSS, JSON, or framework-specific formats. Integrate seamlessly with React, Tailwind CSS, Figma, and Storybook.
              </p>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6">How to Build Your Design System</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">1. Define Your Color Palette</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Choose primary brand colors</li>
                  <li>• Generate complementary color variations</li>
                  <li>• Set semantic color assignments</li>
                  <li>• Ensure accessibility contrast ratios</li>
                  <li>• Configure dark mode variants</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">2. Establish Typography Scale</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Select font families and weights</li>
                  <li>• Define size scale and hierarchy</li>
                  <li>• Set optimal line heights</li>
                  <li>• Configure responsive breakpoints</li>
                  <li>• Test readability across devices</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">3. Create Spacing System</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Define base spacing unit</li>
                  <li>• Generate spacing scale</li>
                  <li>• Set border radius values</li>
                  <li>• Configure shadow definitions</li>
                  <li>• Establish layout grid system</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">4. Generate & Implement</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Generate CSS custom properties</li>
                  <li>• Export theme configurations</li>
                  <li>• Integrate with your framework</li>
                  <li>• Test across components</li>
                  <li>• Document usage guidelines</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-8 border mb-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Build Your Design System?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Start creating comprehensive design systems with beautiful color palettes, typography scales, and CSS variables. Generate production-ready themes for consistent UI design.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Start Building Theme
                </button>
                <button className="border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 px-6 py-3 rounded-lg font-medium transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* Theme Builder Component */}
          <div className="mb-12">
            <ThemeBuilderClient />
          </div>

          {/* Educational Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* About Design Systems */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4">What is a Design System?</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p>
                  A design system is a comprehensive set of standards, components, and guidelines that ensure consistency across all digital products.
                  It includes color palettes, typography scales, spacing systems, component libraries, and usage guidelines that work together to create cohesive user experiences.
                </p>

                <h3>Key Components of Design Systems</h3>
                <ul>
                  <li><strong>Color Palette:</strong> Primary, secondary, and accent colors with semantic meanings</li>
                  <li><strong>Typography Scale:</strong> Font families, sizes, weights, and line heights</li>
                  <li><strong>Spacing System:</strong> Consistent spacing tokens for margins and padding</li>
                  <li><strong>Component Library:</strong> Reusable UI components built with the design tokens</li>
                  <li><strong>Guidelines:</strong> Usage rules and best practices for implementation</li>
                </ul>

                <h3>Benefits of Using Design Systems</h3>
                <ul>
                  <li><strong>Consistency:</strong> Unified look and feel across all products</li>
                  <li><strong>Efficiency:</strong> Faster development with reusable components</li>
                  <li><strong>Scalability:</strong> Easy to maintain and extend as products grow</li>
                  <li><strong>Collaboration:</strong> Clear guidelines for cross-functional teams</li>
                  <li><strong>Quality:</strong> Reduced errors and improved user experience</li>
                </ul>
              </div>
            </div>

            {/* Theme Builder Capabilities */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Theme Builder Capabilities</h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Color Harmony</h4>
                  <p className="text-sm text-muted-foreground">
                    Generate complementary colors with semantic assignments and accessibility checking
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Typography System</h4>
                  <p className="text-sm text-muted-foreground">
                    Create modular scale typography with responsive sizing and optimal readability
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950 dark:to-violet-900 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Spacing Scale</h4>
                  <p className="text-sm text-muted-foreground">
                    Establish consistent spacing tokens and border radius systems
                  </p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-950 dark:to-amber-900 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">CSS Architecture</h4>
                  <p className="text-sm text-muted-foreground">
                    Generate modern CSS custom properties for flexible theming
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">How Theme Builder Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold mb-2">Choose Colors</h3>
                <p className="text-muted-foreground">
                  Select primary colors or use predefined palettes. The tool generates complementary colors for a complete palette with semantic meanings.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold mb-2">Configure Typography</h3>
                <p className="text-muted-foreground">
                  Set font families, sizes, weights, and line heights. Create a consistent typographic hierarchy with responsive scaling.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold mb-2">Define Spacing</h3>
                <p className="text-muted-foreground">
                  Establish a spacing scale, border radius system, and shadow definitions. Create consistent spacing throughout your design.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  4
                </div>
                <h3 className="text-lg font-semibold mb-2">Generate & Export</h3>
                <p className="text-muted-foreground">
                  Preview your theme and generate CSS custom properties. Export ready-to-use stylesheets and configurations for your projects.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-card rounded-lg p-8 border mt-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">How do CSS custom properties work?</h3>
                <p className="text-muted-foreground">
                  CSS custom properties (variables) are defined using --variable-name syntax and used with var(--variable-name).
                  They allow you to store values that can be reused throughout your CSS. Changes to the variable automatically update all usages, making themes easy to modify and maintain.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I use this with existing CSS frameworks?</h3>
                <p className="text-muted-foreground">
                  Absolutely! The generated CSS variables work with any CSS framework or methodology including Tailwind CSS, Bootstrap, Material Design, or custom CSS.
                  Many frameworks even support CSS custom properties for theming, making integration seamless.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">How do I implement dark mode?</h3>
                <p className="text-muted-foreground">
                  The tool includes dark mode support through CSS media queries. You can define different values for light and dark themes using @media (prefers-color-scheme: dark).
                  The generated CSS includes examples of how to implement theme switching and automatic dark mode detection.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">What's the difference between design tokens and CSS variables?</h3>
                <p className="text-muted-foreground">
                  Design tokens are the abstract values (like "primary-blue": "#3b82f6"), while CSS variables are the implementation (like --color-primary: #3b82f6).
                  This tool bridges the gap by generating CSS variables from your design token inputs, making them ready for immediate use in development.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">How do I maintain consistency across team members?</h3>
                <p className="text-muted-foreground">
                  Export your theme as JSON or CSS and share it with your team. Use version control to track changes to your design tokens.
                  Consider creating a shared theme package that team members can import into their projects for consistent implementation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
