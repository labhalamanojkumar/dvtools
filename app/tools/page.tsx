import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ToolsPage() {
  const tools = [
    {
      name: "JSON Formatter",
      description: "Format, validate, and beautify JSON data",
      href: "/tools/json-formatter",
      category: "Data",
    },
    {
      name: "Base64 Encoder",
      description: "Encode and decode Base64 strings",
      href: "/tools/base64",
      category: "Encoding",
    },
    {
      name: "Code Beautifier",
      description: "Format HTML, CSS, and JavaScript code",
      href: "/tools/code-beautifier",
      category: "Development",
    },
    {
      name: "URL Encoder",
      description: "Encode and decode URLs and query strings",
      href: "/tools/url-encoder",
      category: "Web",
    },
    {
      name: "JWT Decoder",
      description: "Decode and validate JSON Web Tokens",
      href: "/tools/jwt-decoder",
      category: "Security",
    },
    {
      name: "RegExp Tester",
      description: "Test regular expressions with real-time matching",
      href: "/tools/regexp-tester",
      category: "Development",
    },
    {
      name: "Component Playground",
      description: "Interactive React component explorer with live previews",
      href: "/tools/component-playground",
      category: "Development",
    },
    {
      name: "CSS Linter & Optimizer",
      description: "Validate and optimize CSS with linting rules",
      href: "/tools/css-linter-optimizer",
      category: "Development",
    },
    {
      name: "Responsive Design Tester",
      description: "Test websites across different device sizes",
      href: "/tools/responsive-design-tester",
      category: "Design",
    },
    {
      name: "Image Optimizer & Converter",
      description: "Compress and convert images with batch processing",
      href: "/tools/image-optimizer-converter",
      category: "Media",
    },
    {
      name: "Accessibility Scanner",
      description: "WCAG compliance checker for web accessibility",
      href: "/tools/accessibility-scanner",
      category: "Testing",
    },
    {
      name: "Performance Profiler",
      description: "Analyze Core Web Vitals and performance metrics",
      href: "/tools/performance-profiler",
      category: "Testing",
    },
    {
      name: "Static Site Exporter",
      description: "Export websites to static HTML with asset optimization",
      href: "/tools/static-site-exporter",
      category: "Development",
    },
    {
      name: "Theme Builder",
      description: "Create custom themes with color palettes and typography",
      href: "/tools/theme-builder",
      category: "Design",
    },
  ];

  const categories = Array.from(new Set(tools.map((t) => t.category)));

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Developer Tools</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Professional-grade tools for developers. All tools are free, secure,
          and process data locally in your browser.
        </p>
      </div>

      {categories.map((category) => (
        <div key={category} className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">{category}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tools
              .filter((tool) => tool.category === category)
              .map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.href}
                  className="group rounded-lg border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
                >
                  <h3 className="mb-2 text-xl font-semibold group-hover:text-primary">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {tool.description}
                  </p>
                  <Button variant="link" className="mt-4 p-0">
                    Try it now →
                  </Button>
                </Link>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export const metadata = {
  title:
    "Developer Tools - Free Online Tools for Developers | Multi Tool Platform",
  description:
    "Free online developer tools for JSON formatting, Base64 encoding, JWT decoding, CSS optimization, accessibility testing, performance profiling, and more. All tools are secure and process data locally.",
  keywords: [
    "developer tools",
    "online tools",
    "JSON formatter",
    "Base64 encoder",
    "JWT decoder",
    "code beautifier",
    "CSS optimizer",
    "accessibility scanner",
    "performance profiler",
    "responsive design tester",
    "image optimizer",
    "theme builder",
    "static site exporter",
    "component playground",
    "regex tester",
    "URL encoder",
    "web development tools",
    "programming tools",
    "free developer tools",
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
    canonical: "/tools",
  },
  openGraph: {
    title: "Developer Tools - Free Online Tools for Developers",
    description:
      "Professional-grade developer tools for JSON, CSS, accessibility testing, performance analysis, and more. All tools are free, secure, and work offline.",
    url: "/tools",
    siteName: "Multi Tool Platform",
    images: [
      {
        url: "/og-tools.jpg",
        width: 1200,
        height: 630,
        alt: "Developer Tools - Multi Tool Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer Tools - Free Online Tools for Developers",
    description:
      "Professional-grade developer tools for JSON, CSS, accessibility testing, performance analysis, and more.",
    images: ["/og-tools.jpg"],
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
};
