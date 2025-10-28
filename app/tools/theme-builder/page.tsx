import ThemeBuilderClient from "@/components/tools/theme-builder-client";
import ScrollToThemeBuilderButton from "@/components/tools/scroll-to-theme-builder-button";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Theme Builder",
  description:
    "Create comprehensive design systems with color palettes, typography scales, and CSS variables",
  url: "https://multitoolplatform.com/tools/theme-builder",
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
    "Color palette generator with complementary colors",
    "Typography scale builder with font weights and line heights",
    "Spacing system with consistent scale",
    "Border radius and shadow configurations",
    "CSS custom properties generation",
    "Live theme preview",
    "Predefined theme palettes",
    "CSS export and clipboard copy",
  ],
  screenshot: "/theme-builder-screenshot.jpg",
};

export default function ThemeBuilderPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Theme Builder</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
          Create comprehensive design systems with beautiful color palettes,
          typography scales, spacing systems, and CSS variables. Generate
          production-ready themes for consistent UI design.
        </p>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            Design Systems
          </span>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            CSS Variables
          </span>
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
            Color Palettes
          </span>
          <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
            Typography Scale
          </span>
        </div>
      </div>

      {/* Main Tool Component */}
      <div className="mb-12">
        <ThemeBuilderClient />
      </div>

      {/* Educational Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* What is a Design System */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            What is a Design System?
          </h2>
          <div className="prose prose-lg max-w-none">
            <p>
              A design system is a comprehensive set of standards, components,
              and guidelines that ensure consistency across all digital
              products. It includes color palettes, typography scales, spacing
              systems, component libraries, and usage guidelines that work
              together to create cohesive user experiences.
            </p>

            <h3>Key Components</h3>
            <ul>
              <li>
                <strong>Color Palette:</strong> Primary, secondary, and accent
                colors with semantic meanings
              </li>
              <li>
                <strong>Typography Scale:</strong> Font families, sizes,
                weights, and line heights
              </li>
              <li>
                <strong>Spacing System:</strong> Consistent spacing tokens for
                margins and padding
              </li>
              <li>
                <strong>Component Library:</strong> Reusable UI components built
                with the design tokens
              </li>
              <li>
                <strong>Guidelines:</strong> Usage rules and best practices for
                implementation
              </li>
            </ul>

            <h3>Benefits of Design Systems</h3>
            <ul>
              <li>
                <strong>Consistency:</strong> Unified look and feel across all
                products
              </li>
              <li>
                <strong>Efficiency:</strong> Faster development with reusable
                components
              </li>
              <li>
                <strong>Scalability:</strong> Easy to maintain and extend as
                products grow
              </li>
              <li>
                <strong>Collaboration:</strong> Clear guidelines for
                cross-functional teams
              </li>
              <li>
                <strong>Quality:</strong> Reduced errors and improved user
                experience
              </li>
            </ul>
          </div>
        </div>

        {/* Theme Builder Features */}
        <div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Theme Builder Features
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  Color Palette Generator
                </span>
                <span className="text-sm font-medium text-green-600">✓</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Typography Scale</span>
                <span className="text-sm font-medium text-green-600">✓</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Spacing System</span>
                <span className="text-sm font-medium text-green-600">✓</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">CSS Variables</span>
                <span className="text-sm font-medium text-green-600">✓</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Live Preview</span>
                <span className="text-sm font-medium text-green-600">✓</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Export Ready</span>
                <span className="text-sm font-medium text-green-600">✓</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Design Token Types
            </h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">4</div>
              <div className="text-sm text-gray-600 mb-4">Core Categories</div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>• Colors & Gradients</div>
                <div>• Typography</div>
                <div>• Spacing</div>
                <div>• Effects</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 rounded-lg p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          How Theme Builder Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              1
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Choose Colors
            </h3>
            <p className="text-gray-600">
              Select primary colors or use predefined palettes. The tool
              generates complementary colors for a complete palette.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              2
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Configure Typography
            </h3>
            <p className="text-gray-600">
              Set font families, sizes, weights, and line heights. Create a
              consistent typographic hierarchy.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-purple-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              3
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Define Spacing
            </h3>
            <p className="text-gray-600">
              Establish a spacing scale and border radius system. Create
              consistent spacing throughout your design.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              4
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Generate & Export
            </h3>
            <p className="text-gray-600">
              Preview your theme and generate CSS custom properties. Export
              ready-to-use stylesheets for your projects.
            </p>
          </div>
        </div>
      </div>

      {/* Advanced Features */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Advanced Theme Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Color Harmony
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Complementary color generation</li>
              <li>• Semantic color assignments</li>
              <li>• Dark mode support</li>
              <li>• Accessibility contrast checking</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Typography System
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Modular scale typography</li>
              <li>• Font weight progression</li>
              <li>• Line height optimization</li>
              <li>• Responsive text sizing</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Spacing Scale
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Consistent spacing tokens</li>
              <li>• Border radius system</li>
              <li>• Shadow definitions</li>
              <li>• Layout grid system</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              CSS Architecture
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• CSS custom properties</li>
              <li>• Utility class generation</li>
              <li>• Theme switching support</li>
              <li>• Framework agnostic</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Developer Experience
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Live preview updates</li>
              <li>• Copy to clipboard</li>
              <li>• File export options</li>
              <li>• JSON configuration</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Integration Ready
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• React component props</li>
              <li>• Tailwind CSS config</li>
              <li>• Figma design tokens</li>
              <li>• Storybook theming</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="bg-blue-50 rounded-lg p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Perfect For These Projects
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Design System Creation
            </h3>
            <p className="text-gray-600 mb-4">
              Build comprehensive design systems for large organizations with
              multiple products and consistent branding requirements.
            </p>
            <div className="text-sm text-blue-600 font-medium">
              → Enterprise Scale
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Component Libraries
            </h3>
            <p className="text-gray-600 mb-4">
              Create themeable component libraries that can adapt to different
              brands and visual styles while maintaining consistency.
            </p>
            <div className="text-sm text-green-600 font-medium">
              → Reusable Components
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Brand Guidelines
            </h3>
            <p className="text-gray-600 mb-4">
              Convert brand guidelines into actionable design tokens that
              developers can implement consistently across platforms.
            </p>
            <div className="text-sm text-purple-600 font-medium">
              → Brand Consistency
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Multi-Product Companies
            </h3>
            <p className="text-gray-600 mb-4">
              Maintain visual consistency across multiple products and services
              while allowing for product-specific customizations.
            </p>
            <div className="text-sm text-orange-600 font-medium">
              → Product Ecosystem
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              White-label Solutions
            </h3>
            <p className="text-gray-600 mb-4">
              Build customizable themes for white-label products that clients
              can easily rebrand with their own colors and typography.
            </p>
            <div className="text-sm text-red-600 font-medium">
              → White-label Ready
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Developer Tools
            </h3>
            <p className="text-gray-600 mb-4">
              Create theming systems for developer tools and platforms that need
              to support multiple themes and customization options.
            </p>
            <div className="text-sm text-indigo-600 font-medium">
              → Developer Experience
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
              How do CSS custom properties work?
            </summary>
            <div className="mt-4 text-gray-600">
              CSS custom properties (variables) are defined using
              --variable-name syntax and used with var(--variable-name). They
              allow you to store values that can be reused throughout your CSS.
              Changes to the variable automatically update all usages, making
              themes easy to modify.
            </div>
          </details>

          <details className="bg-white border border-gray-200 rounded-lg p-6">
            <summary className="font-semibold text-gray-900 cursor-pointer">
              Can I use this with existing CSS frameworks?
            </summary>
            <div className="mt-4 text-gray-600">
              Absolutely! The generated CSS variables work with any CSS
              framework or methodology. You can integrate them with Tailwind
              CSS, Bootstrap, or custom CSS. Many frameworks even support CSS
              custom properties for theming.
            </div>
          </details>

          <details className="bg-white border border-gray-200 rounded-lg p-6">
            <summary className="font-semibold text-gray-900 cursor-pointer">
              How do I implement dark mode?
            </summary>
            <div className="mt-4 text-gray-600">
              The tool includes dark mode support through CSS media queries. You
              can define different values for light and dark themes using @media
              (prefers-color-scheme: dark). The generated CSS includes examples
              of how to implement theme switching.
            </div>
          </details>

          <details className="bg-white border border-gray-200 rounded-lg p-6">
            <summary className="font-semibold text-gray-900 cursor-pointer">
              What&apos;s the difference between design tokens and CSS
              variables?
            </summary>
            <div className="mt-4 text-gray-600">
              Design tokens are the abstract values (like
              &quot;primary-blue&quot;: &quot;#3b82f6&quot;), while CSS
              variables are the implementation (like --color-primary: #3b82f6).
              This tool bridges the gap by generating CSS variables from your
              design token inputs.
            </div>
          </details>

          <details className="bg-white border border-gray-200 rounded-lg p-6">
            <summary className="font-semibold text-gray-900 cursor-pointer">
              How do I maintain consistency across team members?
            </summary>
            <div className="mt-4 text-gray-600">
              Export your theme as JSON or CSS and share it with your team. Use
              version control to track changes to your design tokens. Consider
              creating a shared theme package that team members can import into
              their projects.
            </div>
          </details>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">
          Ready to Build Your Design System?
        </h2>
        <p className="text-lg mb-6 opacity-90">
          Create professional design systems with consistent colors, typography,
          and spacing. Generate production-ready CSS themes in minutes.
        </p>
        <ScrollToThemeBuilderButton />
      </div>
    </div>
  );
}
