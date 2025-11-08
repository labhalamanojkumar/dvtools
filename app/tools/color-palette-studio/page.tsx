import { Metadata } from "next";
import ColorPaletteStudioClient from "@/components/tools/ColorPaletteStudioClient";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Color Palette Studio - Generate & Manage Color Palettes | Multi Tool Platform",
  description: "Create beautiful color palettes with accessibility checking, export design tokens, and generate component previews. Perfect for UI/UX designers and developers.",
  keywords: [
    "color palette",
    "color generator",
    "design tokens",
    "accessibility",
    "color contrast",
    "WCAG compliance",
    "color picker",
    "palette generator",
    "design system",
    "color theory",
    "UI colors",
    "brand colors",
    "color schemes",
    "hex colors",
    "RGB colors",
    "HSL colors",
    "color harmony",
    "color combinations",
    "palette export",
    "CSS variables",
    "design tokens",
    "component previews",
    "color accessibility",
    "contrast checker",
    "color blindness",
    "inclusive design",
    "color wheel",
    "color psychology",
    "material design colors",
    "tailwind colors",
    "color gradients",
    "color mixing",
    "color spaces",
    "CMYK colors",
    "LAB colors",
    "color temperature",
    "warm colors",
    "cool colors"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multitoolplatform.com"),
  alternates: {
    canonical: "/tools/color-palette-studio",
  },
  openGraph: {
    title: "Color Palette Studio - Generate & Manage Color Palettes",
    description: "Create accessible color palettes with contrast checking, design token export, and component previews for professional UI/UX design and development.",
    url: "/tools/color-palette-studio",
    siteName: "Multi Tool Platform",
    images: [
      {
        url: "/og-color-palette.jpg",
        width: 1200,
        height: 630,
        alt: "Color Palette Studio - Professional Color Palette Generator",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Palette Studio - Generate & Manage Color Palettes",
    description: "Create accessible color palettes with contrast checking, design token export, and component previews for professional design systems.",
    images: ["/og-color-palette.jpg"],
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
  "name": "Color Palette Studio",
  "description": "Create beautiful color palettes with accessibility checking, export design tokens, and generate component previews. Perfect for UI/UX designers and developers.",
  "url": "https://multitoolplatform.com/tools/color-palette-studio",
  "applicationCategory": "DesignApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
  },
  "featureList": [
    "Color palette generation",
    "Accessibility contrast checking",
    "Design token export",
    "Component preview generation",
    "Color theory harmony",
    "Multiple color formats",
    "WCAG compliance checking",
    "Color blindness simulation",
    "Palette sharing and import",
    "Real-time color adjustments"
  ],
  "screenshot": "/og-color-palette.jpg",
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
      "name": "Color Palette Studio",
      "item": "https://multitoolplatform.com/tools/color-palette-studio"
    }
  ]
};

export default function ColorPaletteStudioPage() {
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
            Color Palette Studio
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Create stunning, accessible color palettes with professional-grade tools.
            Generate harmonious color schemes, check accessibility compliance, export design tokens,
            and preview how colors look in real UI components for comprehensive design systems.
          </p>

          {/* Key Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">🎨</div>
              <h3 className="font-semibold mb-1">Palette Generation</h3>
              <p className="text-sm text-muted-foreground">
                Create harmonious color schemes using color theory
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">♿</div>
              <h3 className="font-semibold mb-1">Accessibility</h3>
              <p className="text-sm text-muted-foreground">
                WCAG compliant contrast checking and color blindness simulation
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">📤</div>
              <h3 className="font-semibold mb-1">Design Tokens</h3>
              <p className="text-sm text-muted-foreground">
                Export palettes as CSS variables and design tokens
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">👁️</div>
              <h3 className="font-semibold mb-1">Component Preview</h3>
              <p className="text-sm text-muted-foreground">
                See how colors look in actual UI components
              </p>
            </div>
          </div>
        </div>

        {/* Tool Component */}
        <ColorPaletteStudioClient />

        {/* Documentation Section */}
        <div className="mt-16 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">How to Use</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Follow these steps to create professional, accessible color palettes for your projects
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Getting Started */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">1. Choose Base Colors</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Pick a primary color using the color picker</p>
                  <p>• Select from predefined color palettes</p>
                  <p>• Import colors from images or URLs</p>
                  <p>• Use color theory to generate complementary colors</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">2. Generate Palette</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Choose a color harmony rule (complementary, triadic, etc.)</p>
                  <p>• Adjust the number of colors in your palette</p>
                  <p>• Fine-tune individual colors with sliders</p>
                  <p>• Preview the palette in different arrangements</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">3. Check Accessibility</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Run automatic contrast ratio checks</p>
                  <p>• Test combinations for WCAG AA and AAA compliance</p>
                  <p>• Simulate color blindness to ensure accessibility</p>
                  <p>• Get recommendations for better combinations</p>
                </div>
              </div>
            </div>

            {/* Advanced Features */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">4. Preview Components</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• See how colors look in buttons, inputs, and cards</p>
                  <p>• Test text readability with different backgrounds</p>
                  <p>• Preview hover and focus states</p>
                  <p>• Check color combinations in real UI contexts</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">5. Export Design Tokens</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Export as CSS custom properties</p>
                  <p>• Generate SCSS variables</p>
                  <p>• Create JSON design tokens</p>
                  <p>• Export for popular design tools</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">6. Share & Collaborate</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Generate shareable links for your palettes</p>
                  <p>• Export palette images for presentations</p>
                  <p>• Import palettes from other designers</p>
                  <p>• Save palettes to your workspace</p>
                </div>
              </div>
            </div>
          </div>

          {/* Color Theory */}
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Color Theory & Harmony</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-white">C</span>
                </div>
                <div>
                  <div className="font-medium">Complementary</div>
                  <div className="text-sm text-muted-foreground">
                    Colors opposite on the color wheel for high contrast
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-white">A</span>
                </div>
                <div>
                  <div className="font-medium">Analogous</div>
                  <div className="text-sm text-muted-foreground">
                    Adjacent colors for harmonious, serene palettes
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-white">T</span>
                </div>
                <div>
                  <div className="font-medium">Triadic</div>
                  <div className="text-sm text-muted-foreground">
                    Three colors equally spaced for vibrant schemes
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-white">M</span>
                </div>
                <div>
                  <div className="font-medium">Monochromatic</div>
                  <div className="text-sm text-muted-foreground">
                    Variations of a single hue for elegant designs
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-white">S</span>
                </div>
                <div>
                  <div className="font-medium">Split-Complementary</div>
                  <div className="text-sm text-muted-foreground">
                    Base color with two adjacent to its complement
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-white">T</span>
                </div>
                <div>
                  <div className="font-medium">Tetradic</div>
                  <div className="text-sm text-muted-foreground">
                    Four colors for rich, complex color schemes
                  </div>
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
                  <span className="text-2xl">🎯</span>
                </div>
                <h4 className="font-semibold mb-2">1. Select & Generate</h4>
                <p className="text-sm text-muted-foreground">
                  Choose your base colors and let our algorithms generate harmonious
                  palettes using proven color theory principles.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✅</span>
                </div>
                <h4 className="font-semibold mb-2">2. Test & Refine</h4>
                <p className="text-sm text-muted-foreground">
                  Check accessibility compliance, preview in components, and make
                  adjustments to perfect your color palette.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h4 className="font-semibold mb-2">3. Export & Implement</h4>
                <p className="text-sm text-muted-foreground">
                  Export your palette as design tokens and implement them in your
                  projects for consistent, accessible design systems.
                </p>
              </div>
            </div>
          </div>

          {/* Use Cases */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Common Use Cases</h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Brand Identity</h4>
                <p className="text-sm text-muted-foreground">
                  Create cohesive brand color palettes that work across all marketing
                  materials, websites, and applications.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">UI/UX Design</h4>
                <p className="text-sm text-muted-foreground">
                  Design accessible user interfaces with carefully chosen color
                  combinations that enhance usability and user experience.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Design Systems</h4>
                <p className="text-sm text-muted-foreground">
                  Build scalable design systems with consistent color tokens that
                  maintain harmony across all products and platforms.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Marketing Campaigns</h4>
                <p className="text-sm text-muted-foreground">
                  Develop campaign-specific color schemes that align with brand
                  guidelines while standing out in competitive markets.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Product Design</h4>
                <p className="text-sm text-muted-foreground">
                  Create product color palettes that evoke the right emotions and
                  align with user expectations for different product categories.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Inclusive Design</h4>
                <p className="text-sm text-muted-foreground">
                  Ensure your color choices are accessible to users with visual
                  impairments through comprehensive accessibility testing.
                </p>
              </div>
            </div>
          </div>

          {/* Accessibility Guidelines */}
          <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <div className="text-blue-600 dark:text-blue-400 mt-0.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Accessibility Best Practices
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
                  <div>
                    <strong>WCAG AA Standard:</strong> Maintain 4.5:1 contrast ratio for normal text and 3:1 for large text to ensure readability.
                  </div>
                  <div>
                    <strong>Color Blindness:</strong> Test your palettes with color blindness simulators to ensure information isn't conveyed solely through color.
                  </div>
                  <div>
                    <strong>Focus Indicators:</strong> Ensure focus states have sufficient contrast (at least 3:1) against adjacent colors.
                  </div>
                  <div>
                    <strong>Color Meaning:</strong> Don't rely on color alone to convey important information; use additional visual cues.
                  </div>
                  <div>
                    <strong>Text on Gradients:</strong> Ensure sufficient contrast when text appears over gradient backgrounds.
                  </div>
                  <div>
                    <strong>Dark Mode:</strong> Create separate palettes for light and dark modes, maintaining accessibility in both.
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
                <h4 className="font-medium mb-2">What is color contrast and why does it matter?</h4>
                <p className="text-sm text-muted-foreground">
                  Color contrast refers to the difference in brightness between text and background colors.
                  Good contrast ensures readability for all users, including those with visual impairments.
                  WCAG guidelines specify minimum contrast ratios for different text sizes.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">How do I choose the right color harmony for my project?</h4>
                <p className="text-sm text-muted-foreground">
                  Consider your brand personality and project goals. Complementary colors work well for calls-to-action,
                  analogous colors create calm and professional feels, while triadic schemes offer vibrant energy.
                  Test different harmonies to see what best serves your design objectives.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Can I import colors from existing designs?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes! You can import colors from images, URLs, or existing design files.
                  The tool will extract the dominant colors and help you create a cohesive palette
                  based on your existing brand or design assets.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">What color formats are supported for export?</h4>
                <p className="text-sm text-muted-foreground">
                  We support all major color formats including HEX, RGB, HSL, CMYK, and LAB.
                  You can export design tokens in CSS custom properties, SCSS variables, JSON,
                  and formats compatible with popular design tools like Figma and Sketch.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">How do I test for color blindness accessibility?</h4>
                <p className="text-sm text-muted-foreground">
                  Our built-in color blindness simulator shows how your palette appears to users
                  with different types of color vision deficiency. This helps ensure your design
                  remains usable and accessible to the widest possible audience.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Can I create palettes for both light and dark modes?</h4>
                <p className="text-sm text-muted-foreground">
                  Absolutely! You can create separate palettes optimized for light and dark modes.
                  The tool provides guidance for maintaining accessibility and visual hierarchy
                  in both light and dark environments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
