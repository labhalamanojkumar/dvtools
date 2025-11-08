import { Metadata } from "next";
import PrototypeLinkerClient from "@/components/tools/PrototypeLinkerClient";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Prototype Linker - Create Interactive Clickable Prototypes | Multi Tool Platform",
  description: "Build interactive prototypes with clickable elements, user feedback collection, and analytics. Connect screens and create realistic user flows for testing and validation.",
  keywords: [
    "prototype linker",
    "interactive prototype",
    "clickable prototype",
    "user flow",
    "prototype testing",
    "user feedback",
    "screen linking",
    "wireframe linking",
    "prototype analytics",
    "usability testing",
    "design validation",
    "user experience",
    "interaction design",
    "prototype tool",
    "design handoff",
    "user testing",
    "click tracking",
    "heat maps",
    "conversion tracking",
    "A/B testing",
    "user journey",
    "flow diagram",
    "interaction prototyping",
    "design prototyping",
    "user flow mapping",
    "clickable wireframes",
    "prototype sharing",
    "user feedback collection",
    "design iteration",
    "usability validation"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multitoolplatform.com"),
  alternates: {
    canonical: "/tools/prototype-linker",
  },
  openGraph: {
    title: "Prototype Linker - Create Interactive Clickable Prototypes",
    description: "Build interactive prototypes with clickable elements, user feedback collection, and analytics for comprehensive design validation and user testing.",
    url: "/tools/prototype-linker",
    siteName: "Multi Tool Platform",
    images: [
      {
        url: "/og-prototype-linker.jpg",
        width: 1200,
        height: 630,
        alt: "Prototype Linker - Interactive Prototype Creation Tool",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prototype Linker - Create Interactive Clickable Prototypes",
    description: "Build interactive prototypes with clickable elements, user feedback collection, and analytics for design validation and testing.",
    images: ["/og-prototype-linker.jpg"],
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
  "name": "Prototype Linker",
  "description": "Build interactive prototypes with clickable elements, user feedback collection, and analytics. Connect screens and create realistic user flows for testing and validation.",
  "url": "https://multitoolplatform.com/tools/prototype-linker",
  "applicationCategory": "DesignApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
  },
  "featureList": [
    "Interactive prototype creation",
    "Clickable element linking",
    "User flow mapping",
    "Feedback collection",
    "Analytics and tracking",
    "Screen transitions",
    "User journey visualization",
    "A/B testing capabilities",
    "Heat map generation",
    "Conversion tracking"
  ],
  "screenshot": "/og-prototype-linker.jpg",
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

export default function PrototypeLinkerPage() {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            Prototype Linker
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Transform static wireframes into interactive prototypes with clickable elements,
            user feedback collection, and comprehensive analytics. Create realistic user flows
            and validate design decisions with real user testing and data-driven insights.
          </p>

          {/* Key Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">🔗</div>
              <h3 className="font-semibold mb-1">Screen Linking</h3>
              <p className="text-sm text-muted-foreground">
                Connect screens with clickable elements and transitions
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold mb-1">User Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Track user interactions and behavior patterns
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">💬</div>
              <h3 className="font-semibold mb-1">Feedback Collection</h3>
              <p className="text-sm text-muted-foreground">
                Gather user feedback and design insights
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-semibold mb-1">User Flow Mapping</h3>
              <p className="text-sm text-muted-foreground">
                Visualize and optimize user journey paths
              </p>
            </div>
          </div>
        </div>

        {/* Tool Component */}
        <PrototypeLinkerClient />

        {/* Documentation Section */}
        <div className="mt-16 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">How to Use</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Follow these steps to create interactive prototypes and gather valuable user insights
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Getting Started */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">1. Upload Screens</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Import your wireframes or design screens</p>
                  <p>• Support for PNG, JPG, and SVG formats</p>
                  <p>• Organize screens in logical flow order</p>
                  <p>• Create a new project or add to existing one</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">2. Define Clickable Areas</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Select elements that should be interactive</p>
                  <p>• Draw hotspot areas on your screens</p>
                  <p>• Assign actions to each clickable element</p>
                  <p>• Set hover states and visual feedback</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">3. Link Screens</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Connect hotspots to destination screens</p>
                  <p>• Create conditional navigation paths</p>
                  <p>• Add transition animations and effects</p>
                  <p>• Build complex user flow diagrams</p>
                </div>
              </div>
            </div>

            {/* Advanced Features */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">4. Add Interactions</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Include micro-interactions and animations</p>
                  <p>• Add form validation and error states</p>
                  <p>• Create loading states and progress indicators</p>
                  <p>• Implement gesture-based interactions</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">5. Enable Analytics</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Track click patterns and user behavior</p>
                  <p>• Generate heat maps of user interactions</p>
                  <p>• Monitor conversion funnels and drop-off points</p>
                  <p>• Set up A/B testing for different flows</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">6. Share & Test</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Generate shareable prototype links</p>
                  <p>• Collect user feedback through integrated forms</p>
                  <p>• Test on multiple devices and screen sizes</p>
                  <p>• Iterate based on user testing results</p>
                </div>
              </div>
            </div>
          </div>

          {/* Prototype Types */}
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Types of Prototypes You Can Create</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500/10 rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">L</span>
                </div>
                <div>
                  <div className="font-medium">Low-Fidelity</div>
                  <div className="text-sm text-muted-foreground">
                    Basic wireframes with simple linking for early concept validation
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500/10 rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">M</span>
                </div>
                <div>
                  <div className="font-medium">Medium-Fidelity</div>
                  <div className="text-sm text-muted-foreground">
                    Detailed wireframes with interactions and basic animations
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-500/10 rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-purple-600 dark:text-purple-400">H</span>
                </div>
                <div>
                  <div className="font-medium">High-Fidelity</div>
                  <div className="text-sm text-muted-foreground">
                    Pixel-perfect designs with complex interactions and micro-animations
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-500/10 rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-orange-600 dark:text-orange-400">C</span>
                </div>
                <div>
                  <div className="font-medium">Clickable</div>
                  <div className="text-sm text-muted-foreground">
                    Focus on user flows and navigation with minimal visual design
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-500/10 rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">F</span>
                </div>
                <div>
                  <div className="font-medium">Functional</div>
                  <div className="text-sm text-muted-foreground">
                    Working prototypes with real data and backend integration
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-indigo-500/10 rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">I</span>
                </div>
                <div>
                  <div className="font-medium">Interactive</div>
                  <div className="text-sm text-muted-foreground">
                    Rich interactions with gestures, animations, and complex behaviors
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
                  <span className="text-2xl">📤</span>
                </div>
                <h4 className="font-semibold mb-2">1. Import & Setup</h4>
                <p className="text-sm text-muted-foreground">
                  Upload your design screens and set up your prototype project.
                  Organize screens and define the basic structure of your user flows.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔗</span>
                </div>
                <h4 className="font-semibold mb-2">2. Link & Interact</h4>
                <p className="text-sm text-muted-foreground">
                  Define clickable areas, link screens together, and add interactions.
                  Create realistic user flows with conditional logic and animations.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h4 className="font-semibold mb-2">3. Test & Analyze</h4>
                <p className="text-sm text-muted-foreground">
                  Share your prototype, collect user feedback, and analyze interaction data.
                  Use insights to iterate and improve your design decisions.
                </p>
              </div>
            </div>
          </div>

          {/* Use Cases */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Common Use Cases</h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">User Flow Validation</h4>
                <p className="text-sm text-muted-foreground">
                  Test and validate user flows before development begins.
                  Identify usability issues and navigation problems early.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Stakeholder Presentations</h4>
                <p className="text-sm text-muted-foreground">
                  Create impressive presentations with interactive prototypes
                  that demonstrate the user experience more effectively than static slides.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Usability Testing</h4>
                <p className="text-sm text-muted-foreground">
                  Conduct remote usability testing with clickable prototypes.
                  Gather quantitative data and qualitative feedback from real users.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Design Handoff</h4>
                <p className="text-sm text-muted-foreground">
                  Bridge the gap between design and development with interactive
                  prototypes that clearly communicate intended user interactions.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">A/B Testing</h4>
                <p className="text-sm text-muted-foreground">
                  Test different design variations and user flows to determine
                  which approaches perform better with your target audience.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Concept Validation</h4>
                <p className="text-sm text-muted-foreground">
                  Quickly validate design concepts and ideas with stakeholders
                  and users before investing significant time in high-fidelity designs.
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
                  Prototype Best Practices
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
                  <div>
                    <strong>Start Simple:</strong> Begin with basic user flows and gradually add complexity as you validate core interactions.
                  </div>
                  <div>
                    <strong>Focus on Key Flows:</strong> Identify and prototype the most important user journeys first, not every possible interaction.
                  </div>
                  <div>
                    <strong>Test Early & Often:</strong> Share prototypes with users and stakeholders frequently to gather feedback and iterate quickly.
                  </div>
                  <div>
                    <strong>Use Real Content:</strong> Replace lorem ipsum with realistic content to better evaluate the user experience.
                  </div>
                  <div>
                    <strong>Consider Context:</strong> Test prototypes in the actual usage environment (mobile, desktop, tablet) for accurate results.
                  </div>
                  <div>
                    <strong>Document Insights:</strong> Keep track of user feedback, issues discovered, and design decisions made during testing.
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
                <h4 className="font-medium mb-2">What&apos;s the difference between a wireframe and a prototype?</h4>
                <p className="text-sm text-muted-foreground">
                  Wireframes are static representations of layout and structure, while prototypes are interactive
                  simulations that allow users to click through and experience the flow of an application.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Do I need design skills to create prototypes?</h4>
                <p className="text-sm text-muted-foreground">
                  While design skills help, you can create effective prototypes using existing wireframes or designs.
                  The focus is on interaction and flow rather than visual perfection.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">How many screens should my prototype have?</h4>
                <p className="text-sm text-muted-foreground">
                  Focus on key user flows rather than comprehensive coverage. Start with 5-15 screens that cover
                  your primary user journeys, then expand based on testing feedback.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Can I test prototypes on mobile devices?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, prototypes can be tested on any device with a web browser. Share the prototype link
                  and users can interact with it on phones, tablets, or desktops.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">How do I know when my prototype is ready for development?</h4>
                <p className="text-sm text-muted-foreground">
                  Your prototype is ready when you've validated key user flows, gathered feedback from stakeholders
                  and users, and identified the interactions that need to be built.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">What analytics can I track with prototypes?</h4>
                <p className="text-sm text-muted-foreground">
                  Track click patterns, time spent on screens, drop-off points, conversion funnels,
                  and user flow completion rates to understand how users interact with your design.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}