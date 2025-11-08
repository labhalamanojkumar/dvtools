import { Metadata } from "next";
import DesignToCodeExporterClient from "@/components/tools/DesignToCodeExporterClient";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Design-to-Code Exporter - Convert Figma to React/Vue Components | Multi Tool Platform",
  description: "Convert Figma frames to React and Vue component scaffolds. Export design tokens, generate responsive components, and create production-ready code from your Figma designs.",
  keywords: [
    "design to code",
    "figma to react",
    "figma to vue",
    "component generator",
    "design system",
    "ui to code",
    "figma exporter",
    "react components",
    "vue components",
    "design tokens",
    "component scaffold",
    "frontend generator",
    "design to development",
    "figma integration",
    "component library",
    "ui components",
    "design automation",
    "code generation",
    "figma api",
    "design handoff",
    "responsive design",
    "component props",
    "design system tokens",
    "frontend development",
    "ui development",
    "design collaboration",
    "developer handoff",
    "component architecture",
    "design consistency",
    "code reusability"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multitoolplatform.com"),
  alternates: {
    canonical: "/tools/design-to-code-exporter",
  },
  openGraph: {
    title: "Design-to-Code Exporter - Convert Figma to React/Vue Components",
    description: "Transform Figma designs into production-ready React and Vue components. Generate design tokens, responsive layouts, and complete component scaffolds with automated code generation.",
    url: "/tools/design-to-code-exporter",
    siteName: "Multi Tool Platform",
    images: [
      {
        url: "/og-design-to-code.jpg",
        width: 1200,
        height: 630,
        alt: "Design-to-Code Exporter - Convert Figma Designs to Code",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Design-to-Code Exporter - Figma to React/Vue Converter",
    description: "Transform Figma designs into production-ready React and Vue components with design tokens, responsive layouts, and automated code generation.",
    images: ["/og-design-to-code.jpg"],
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
  category: "developer tools",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Design-to-Code Exporter",
  "description": "Convert Figma frames to React and Vue component scaffolds. Export design tokens, generate responsive components, and create production-ready code from your Figma designs.",
  "url": "https://multitoolplatform.com/tools/design-to-code-exporter",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
  },
  "featureList": [
    "Figma to React conversion",
    "Figma to Vue conversion",
    "Design token extraction",
    "Responsive component generation",
    "Component scaffold creation",
    "CSS/SCSS export",
    "Design system integration",
    "Code customization",
    "Preview and testing",
    "Batch processing"
  ],
  "screenshot": "/og-design-to-code.jpg",
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
      "name": "Design-to-Code Exporter",
      "item": "https://multitoolplatform.com/tools/design-to-code-exporter"
    }
  ]
};

export default function DesignToCodeExporterPage() {
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
            Design-to-Code Exporter
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Transform your Figma designs into production-ready React and Vue components.
            Extract design tokens, generate responsive layouts, and create complete component
            scaffolds with automated code generation that bridges the gap between design and development.
          </p>

          {/* Key Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">🎨</div>
              <h3 className="font-semibold mb-1">Figma Integration</h3>
              <p className="text-sm text-muted-foreground">
                Direct connection to Figma files and frames
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">⚛️</div>
              <h3 className="font-semibold mb-1">Multi-Framework</h3>
              <p className="text-sm text-muted-foreground">
                React and Vue component generation
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-semibold mb-1">Design Tokens</h3>
              <p className="text-sm text-muted-foreground">
                Automatic extraction of colors, typography, and spacing
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">📱</div>
              <h3 className="font-semibold mb-1">Responsive Design</h3>
              <p className="text-sm text-muted-foreground">
                Mobile-first responsive component generation
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Convert Your Designs?
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Start transforming Figma designs into production-ready React and Vue components.
            Bridge the gap between design and development with automated code generation.
          </p>
          <a
            href="#design-to-code-tool"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Start Converting Designs
          </a>
        </div>

        {/* Tool Component */}
        <div id="design-to-code-tool">
          <DesignToCodeExporterClient />
        </div>

        {/* Documentation Section */}
        <div className="mt-16 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">How to Use</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Follow these steps to convert your Figma designs into production-ready code
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Getting Started */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">1. Connect to Figma</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Obtain your Figma access token from Figma settings</p>
                  <p>• Enter your Figma file URL or file ID</p>
                  <p>• Grant necessary permissions for design access</p>
                  <p>• Test the connection to ensure proper access</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">2. Select Design Elements</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Browse your Figma file structure and frames</p>
                  <p>• Choose specific components or entire artboards</p>
                  <p>• Preview selected elements before conversion</p>
                  <p>• Select target framework (React or Vue)</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">3. Configure Export Settings</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Choose component naming conventions</p>
                  <p>• Select CSS framework (Tailwind, Styled Components, etc.)</p>
                  <p>• Configure responsive breakpoints</p>
                  <p>• Set up design token extraction preferences</p>
                </div>
              </div>
            </div>

            {/* Advanced Features */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">4. Generate Components</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Click &quot;Generate Code&quot; to start the conversion</p>
                  <p>• Monitor the progress of component generation</p>
                  <p>• Review generated code for accuracy</p>
                  <p>• Download individual components or entire libraries</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">5. Extract Design Tokens</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Automatically extract colors, fonts, and spacing</p>
                  <p>• Generate CSS custom properties or SCSS variables</p>
                  <p>• Create design system documentation</p>
                  <p>• Export tokens for integration with design systems</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">6. Customize and Refine</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Edit generated code to match your requirements</p>
                  <p>• Add custom props and event handlers</p>
                  <p>• Integrate with your existing component library</p>
                  <p>• Test components across different devices</p>
                </div>
              </div>
            </div>
          </div>

          {/* Supported Frameworks */}
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Supported Frameworks & Features</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">R</span>
                </div>
                <div>
                  <div className="font-medium">React</div>
                  <div className="text-sm text-muted-foreground">JSX components with hooks</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">V</span>
                </div>
                <div>
                  <div className="font-medium">Vue 3</div>
                  <div className="text-sm text-muted-foreground">Composition API components</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-purple-600 dark:text-purple-400">T</span>
                </div>
                <div>
                  <div className="font-medium">Tailwind CSS</div>
                  <div className="text-sm text-muted-foreground">Utility-first styling</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-orange-600 dark:text-orange-400">S</span>
                </div>
                <div>
                  <div className="font-medium">Styled Components</div>
                  <div className="text-sm text-muted-foreground">CSS-in-JS styling</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">E</span>
                </div>
                <div>
                  <div className="font-medium">Emotion</div>
                  <div className="text-sm text-muted-foreground">CSS-in-JS with performance</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">F</span>
                </div>
                <div>
                  <div className="font-medium">Figma API</div>
                  <div className="text-sm text-muted-foreground">Direct design file access</div>
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
                  <span className="text-2xl">🔗</span>
                </div>
                <h4 className="font-semibold mb-2">1. Connect & Analyze</h4>
                <p className="text-sm text-muted-foreground">
                  Connect to your Figma file and analyze design elements, extracting
                  layout information, styles, and component structure.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚙️</span>
                </div>
                <h4 className="font-semibold mb-2">2. Process & Transform</h4>
                <p className="text-sm text-muted-foreground">
                  Transform design elements into code structures, converting Figma
                  properties to appropriate framework syntax and styling.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h4 className="font-semibold mb-2">3. Generate & Export</h4>
                <p className="text-sm text-muted-foreground">
                  Generate production-ready components with proper imports, props,
                  and styling, ready for integration into your project.
                </p>
              </div>
            </div>
          </div>

          {/* Use Cases */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Common Use Cases</h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Design System Creation</h4>
                <p className="text-sm text-muted-foreground">
                  Build consistent design systems by converting Figma components
                  into reusable code components with shared design tokens.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Rapid Prototyping</h4>
                <p className="text-sm text-muted-foreground">
                  Quickly convert design mockups into functional prototypes,
                  accelerating the design-to-development workflow.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Component Library Development</h4>
                <p className="text-sm text-muted-foreground">
                  Generate foundation components for your design system,
                  ensuring consistency across all applications.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Cross-Platform Development</h4>
                <p className="text-sm text-muted-foreground">
                  Create components that work across web and mobile platforms
                  by generating code for multiple frameworks.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Developer Handoff</h4>
                <p className="text-sm text-muted-foreground">
                  Streamline the handoff process between designers and developers
                  with automatically generated, production-ready code.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Design Consistency</h4>
                <p className="text-sm text-muted-foreground">
                  Maintain design consistency by automatically generating code
                  that perfectly matches the original Figma designs.
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
                  Best Practices for Design-to-Code Conversion
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
                  <div>
                    <strong>Organize Figma Files:</strong> Use clear naming conventions and organize components in frames for better conversion results.
                  </div>
                  <div>
                    <strong>Use Design Tokens:</strong> Define colors, typography, and spacing as design tokens in Figma for automatic extraction.
                  </div>
                  <div>
                    <strong>Component Structure:</strong> Create reusable components in Figma that translate well to code component architecture.
                  </div>
                  <div>
                    <strong>Responsive Design:</strong> Design with responsive breakpoints in mind for better mobile and tablet support.
                  </div>
                  <div>
                    <strong>Accessibility:</strong> Include accessibility considerations in your designs for better inclusive component generation.
                  </div>
                  <div>
                    <strong>Version Control:</strong> Keep your design files versioned and communicate changes to the development team.
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
                <h4 className="font-medium mb-2">What Figma permissions do I need?</h4>
                <p className="text-sm text-muted-foreground">
                  You need a Figma access token with file read permissions. For team projects,
                  ensure the token has access to the specific files you want to convert.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Can I convert complex animations or interactions?</h4>
                <p className="text-sm text-muted-foreground">
                  The tool focuses on static component generation. Complex animations and interactions
                  need to be implemented manually after the initial code generation.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">How accurate is the code generation?</h4>
                <p className="text-sm text-muted-foreground">
                  The generated code provides a solid foundation but may require manual adjustments
                  for complex layouts, custom interactions, or specific framework optimizations.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Can I customize the generated code style?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, you can choose between different CSS frameworks and configure naming conventions.
                  The tool generates clean, readable code that follows best practices.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">What if my design uses custom fonts?</h4>
                <p className="text-sm text-muted-foreground">
                  Custom fonts are referenced in the generated CSS, but you'll need to ensure
                  the font files are available in your project and properly configured.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Is there a limit to the number of components I can convert?</h4>
                <p className="text-sm text-muted-foreground">
                  There are no strict limits, but very large files with many components may take
                  longer to process. Consider breaking large design systems into smaller, manageable chunks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
