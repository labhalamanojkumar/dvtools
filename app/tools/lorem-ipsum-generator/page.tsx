import { Metadata } from "next";
import { LoremIpsumGeneratorClient } from "@/components/tools/lorem-ipsum-generator-client";
import { SHARED_METADATA } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator - Generate Dummy Text Online | Free Developer Tool",
  description:
    "Free online Lorem Ipsum generator for developers and designers. Generate paragraphs, sentences, words, or characters of dummy text. Perfect for wireframing, prototyping, and content placeholders.",
  keywords: [
    "lorem ipsum generator",
    "dummy text generator",
    "placeholder text",
    "sample text",
    "fake text",
    "developer tools",
    "design prototyping",
    "wireframing",
    "content placeholder",
    "text generator online",
    "lorem ipsum text",
    "dummy content",
    "filler text",
    "mock text",
    "prototype text",
    "design mockup",
    "typography testing",
    "layout testing",
    "web development",
    "UI design",
    "print design",
    "graphic design",
    "content strategy",
    "copywriting placeholder"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://multitoolplatform.com'),
  alternates: {
    canonical: "/tools/lorem-ipsum-generator"
  },
  openGraph: {
    title: "Lorem Ipsum Generator - Generate Dummy Text Online | Free Developer Tool",
    description: "Free online Lorem Ipsum generator for developers and designers. Generate paragraphs, sentences, words, or characters of dummy text for wireframing and prototyping.",
    url: "/tools/lorem-ipsum-generator",
    siteName: "Multi Tool Platform",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-lorem-ipsum-generator.jpg",
        width: 1200,
        height: 630,
        alt: "Lorem Ipsum Generator - Free Dummy Text Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lorem Ipsum Generator - Generate Dummy Text Online",
    description: "Free online Lorem Ipsum generator for developers and designers. Generate paragraphs, sentences, words, or characters of dummy text for prototyping.",
    images: ["/og-lorem-ipsum-generator.jpg"],
    creator: "@multitoolplatform",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: "developer tools",
};

const jsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Lorem Ipsum Generator",
  "description": "Free online Lorem Ipsum generator for developers and designers. Generate paragraphs, sentences, words, or characters of dummy text for prototyping and wireframing.",
  "url": "https://multitoolplatform.com/tools/lorem-ipsum-generator",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
  },
  "featureList": [
    "Generate paragraphs of lorem ipsum text",
    "Generate sentences of lorem ipsum text",
    "Generate words of lorem ipsum text",
    "Generate characters of lorem ipsum text",
    "HTML and plain text format support",
    "Copy to clipboard functionality",
    "Download as file functionality",
    "Customizable text generation options",
    "Real-time preview",
    "Multiple language variations"
  ],
  "screenshot": "/og-lorem-ipsum-generator.jpg",
  "author": {
    "@type": "Organization",
    "name": "Multi Tool Platform"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Multi Tool Platform"
  },
  "datePublished": new Date().toISOString().split('T')[0],
  "dateModified": new Date().toISOString().split('T')[0],
};

const breadcrumbSchema = {
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
      "name": "Lorem Ipsum Generator",
      "item": "https://multitoolplatform.com/tools/lorem-ipsum-generator"
    }
  ]
};

export default function LoremIpsumGeneratorPage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
              Lorem Ipsum Generator
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Generate professional placeholder text for your designs and prototypes.
              Create paragraphs, sentences, words, or characters of lorem ipsum text instantly
              with customizable options for developers and designers.
            </p>

            {/* Key Features */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
              <div className="bg-card p-4 rounded-lg border">
                <div className="text-2xl mb-2">📝</div>
                <h3 className="font-semibold mb-1">Multiple Formats</h3>
                <p className="text-sm text-muted-foreground">
                  Generate paragraphs, sentences, words, or characters
                </p>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="font-semibold mb-1">Instant Generation</h3>
                <p className="text-sm text-muted-foreground">
                  Create dummy text instantly with real-time preview
                </p>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <div className="text-2xl mb-2">📋</div>
                <h3 className="font-semibold mb-1">Copy & Download</h3>
                <p className="text-sm text-muted-foreground">
                  Easy clipboard copy and file download options
                </p>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <div className="text-2xl mb-2">🎨</div>
                <h3 className="font-semibold mb-1">Design Focus</h3>
                <p className="text-sm text-muted-foreground">
                  Perfect for wireframing and prototyping
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-8 border mb-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Generate Lorem Ipsum Text?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Start creating placeholder text for your designs and prototypes now. Generate paragraphs, sentences, words, or characters with our customizable lorem ipsum generator.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Start Generating Text
                </button>
                <button className="border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 px-6 py-3 rounded-lg font-medium transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* Main Tool Component */}
          <LoremIpsumGeneratorClient />

          {/* Documentation Section */}
          <div className="mt-16 space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">How to Use</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Follow these simple steps to generate the perfect placeholder text for your project
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Getting Started */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">1. Choose Text Type</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Select paragraphs for large blocks of content</p>
                    <p>• Choose sentences for shorter text segments</p>
                    <p>• Pick words for minimal placeholder text</p>
                    <p>• Use characters for precise text length control</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">2. Set Quantity</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Specify the number of paragraphs, sentences, or words</p>
                    <p>• For characters, set the exact character count</p>
                    <p>• Use the slider or input field for precise control</p>
                    <p>• Preview changes in real-time</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">3. Select Format</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Choose plain text for simple content</p>
                    <p>• Select HTML format with paragraph tags</p>
                    <p>• Format affects how text is structured</p>
                    <p>• HTML format includes proper markup</p>
                  </div>
                </div>
              </div>

              {/* Advanced Features */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">4. Generate Text</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Click the generate button to create your text</p>
                    <p>• View the result in the preview area</p>
                    <p>• Text generates instantly with no delays</p>
                    <p>• Regenerate anytime for different content</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">5. Copy or Download</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Use the copy button for clipboard access</p>
                    <p>• Download as a text file for offline use</p>
                    <p>• Copy works across all devices and browsers</p>
                    <p>• File download preserves formatting</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">6. Integrate</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Paste directly into design tools</p>
                    <p>• Use in code editors and development environments</p>
                    <p>• Import into content management systems</p>
                    <p>• Perfect for templates and wireframes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* About Lorem Ipsum */}
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4">What is Lorem Ipsum?</h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Lorem ipsum is a standard dummy text used in the printing and typesetting industry since the 1500s.
                  It has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a
                  galley of type and scrambled it to make a type specimen book.
                </p>
                <p>
                  The text comes from sections 1.10.32 and 1.10.33 of &quot;de Finibus Bonorum et Malorum&quot;
                  (The Extremes of Good and Evil) by Cicero, written in 45 BC. This ancient text has been used
                  as placeholder content for centuries and continues to serve designers and developers today.
                </p>
              </div>
            </div>

            {/* How It Works */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-center">How It Works</h3>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⚙️</span>
                  </div>
                  <h4 className="font-semibold mb-2">1. Configure</h4>
                  <p className="text-sm text-muted-foreground">
                    Select your desired text type, quantity, and format options
                    to customize the lorem ipsum generation to your specific needs.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h4 className="font-semibold mb-2">2. Generate</h4>
                  <p className="text-sm text-muted-foreground">
                    Click generate to instantly create placeholder text based on
                    your configuration, with real-time preview and instant results.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📤</span>
                  </div>
                  <h4 className="font-semibold mb-2">3. Use</h4>
                  <p className="text-sm text-muted-foreground">
                    Copy to clipboard or download as a file, then integrate the
                    generated text into your designs, prototypes, or development projects.
                  </p>
                </div>
              </div>
            </div>

            {/* Use Cases */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Common Use Cases</h3>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Wireframing</h4>
                  <p className="text-sm text-muted-foreground">
                    Create realistic wireframes with appropriate text lengths
                    to better represent the final design and user experience.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Prototyping</h4>
                  <p className="text-sm text-muted-foreground">
                    Build interactive prototypes with placeholder content that
                    accurately reflects the amount and type of content users will see.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Typography Testing</h4>
                  <p className="text-sm text-muted-foreground">
                    Test font choices, spacing, and readability with various
                    text lengths and paragraph structures.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Layout Design</h4>
                  <p className="text-sm text-muted-foreground">
                    Design page layouts and content structures without being
                    distracted by the meaning of the actual content.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Development Templates</h4>
                  <p className="text-sm text-muted-foreground">
                    Create HTML/CSS templates and components with realistic
                    content placeholders for development and testing.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Content Strategy</h4>
                  <p className="text-sm text-muted-foreground">
                    Plan content structure and length requirements by using
                    placeholder text that matches expected content types.
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
                    Best Practices for Using Lorem Ipsum
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
                    <div>
                      <strong>Match Content Length:</strong> Generate text that matches the expected length of your real content to ensure proper layout testing.
                    </div>
                    <div>
                      <strong>Use Appropriate Formats:</strong> Choose HTML format when working with web projects, plain text for other design contexts.
                    </div>
                    <div>
                      <strong>Test Responsiveness:</strong> Use various text lengths to test how your designs adapt to different content amounts.
                    </div>
                    <div>
                      <strong>Replace Before Launch:</strong> Always replace lorem ipsum text with actual content before publishing or presenting final work.
                    </div>
                    <div>
                      <strong>Consider Readability:</strong> Use readable text for user testing, lorem ipsum for pure design layout testing.
                    </div>
                    <div>
                      <strong>Version Control:</strong> Avoid committing lorem ipsum text to version control; replace with real content early in development.
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
                  <h4 className="font-medium mb-2">What is lorem ipsum text?</h4>
                  <p className="text-sm text-muted-foreground">
                    Lorem ipsum is dummy text derived from sections of Cicero&apos;s philosophical work &quot;De Finibus Bonorum et Malorum&quot;
                    written in 45 BC. It has been used as placeholder text in the printing and typesetting industry for centuries.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Is lorem ipsum text copyrighted?</h4>
                  <p className="text-sm text-muted-foreground">
                    No, lorem ipsum text is not copyrighted. It has been in the public domain for centuries and is free to use
                    for any purpose, including commercial projects. However, it should always be replaced with actual content.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">When should I use lorem ipsum vs. real content?</h4>
                  <p className="text-sm text-muted-foreground">
                    Use lorem ipsum when you need to focus on design elements like layout, typography, and spacing without
                    being distracted by content. Use real content when testing user experience, readability, or when close to final delivery.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Can I customize the lorem ipsum text?</h4>
                  <p className="text-sm text-muted-foreground">
                    While traditional lorem ipsum follows the original Latin text, our generator creates variations.
                    You can control the length, format, and structure, but the core dummy text nature remains the same.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">What&apos;s the difference between HTML and plain text format?</h4>
                  <p className="text-sm text-muted-foreground">
                    HTML format includes paragraph tags (&lt;p&gt;) and proper markup, making it ready for web use.
                    Plain text format provides continuous text without formatting, suitable for design tools and documents.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Can I use this for commercial projects?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes, lorem ipsum can be used freely in commercial projects as placeholder content.
                    Just ensure it&apos;s replaced with actual content before final publication or product launch.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}