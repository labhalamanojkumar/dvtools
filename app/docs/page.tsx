import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Code2,
  FileJson,
  Binary,
  Lock,
  Regex,
  ArrowRight,
  Search,
  Zap,
  Shield,
  Smartphone,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Documentation | DvTools - Developer Tools Guide",
  description:
    "Comprehensive documentation for DvTools. Learn how to use JSON formatter, Base64 encoder, JWT decoder, RegExp tester, code beautifier, and more developer tools.",
  keywords: [
    "documentation",
    "developer tools",
    "JSON formatter docs",
    "Base64 encoder guide",
    "JWT decoder documentation",
    "RegExp tester manual",
    "code beautifier docs",
    "URL encoder guide",
  ],
  openGraph: {
    title: "Documentation | DvTools - Developer Tools Guide",
    description:
      "Comprehensive documentation for DvTools. Learn how to use our developer tools effectively.",
    type: "website",
    url: "/docs",
    siteName: "DvTools",
    images: [
      {
        url: "/docs-og.jpg",
        width: 1200,
        height: 630,
        alt: "DvTools Documentation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Documentation | DvTools - Developer Tools Guide",
    description:
      "Comprehensive documentation for DvTools. Learn how to use our developer tools effectively.",
    images: ["/docs-og.jpg"],
  },
  alternates: {
    canonical: "/docs",
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

const docCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Learn the basics and get up and running quickly",
    icon: <BookOpen className="h-8 w-8" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950",
    sections: [
      {
        title: "Introduction",
        href: "/docs/introduction",
        description: "Overview of DvTools",
      },
      {
        title: "Quick Start Guide",
        href: "/docs/quick-start",
        description: "Get started in 5 minutes",
      },
      {
        title: "Installation",
        href: "/docs/installation",
        description: "How to install and setup",
      },
    ],
  },
  {
    id: "tools",
    title: "Tools Documentation",
    description: "Detailed guides for each tool and feature",
    icon: <Code2 className="h-8 w-8" />,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950",
    sections: [
      {
        title: "JSON Tools",
        href: "/docs/json-tools",
        description: "Format, validate, and minify JSON",
      },
      {
        title: "Encoding Tools",
        href: "/docs/encoding-tools",
        description: "Base64, URL encoding/decoding",
      },
      {
        title: "JWT Tools",
        href: "/docs/jwt-tools",
        description: "Decode and verify JWT tokens",
      },
      {
        title: "RegExp Tools",
        href: "/docs/regexp-tools",
        description: "Test and debug regular expressions",
      },
      {
        title: "Code Tools",
        href: "/docs/code-tools",
        description: "Beautify and format code",
      },
    ],
  },
  {
    id: "api",
    title: "API Reference",
    description: "Integrate DvTools into your applications",
    icon: <Zap className="h-8 w-8" />,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950",
    sections: [
      {
        title: "API Overview",
        href: "/docs/api-overview",
        description: "API basics and authentication",
      },
      {
        title: "Endpoints",
        href: "/docs/api-endpoints",
        description: "Available API endpoints",
      },
      {
        title: "Rate Limits",
        href: "/docs/api-limits",
        description: "API usage limits and quotas",
      },
      {
        title: "SDKs",
        href: "/docs/api-sdks",
        description: "Official SDKs and libraries",
      },
    ],
  },
];

const featuredTools = [
  {
    icon: <FileJson className="h-6 w-6" />,
    title: "JSON Formatter",
    description: "Validate, format, and beautify JSON with syntax highlighting",
    href: "/docs/json-tools",
    features: [
      "Syntax highlighting",
      "Error detection",
      "Tree view",
      "Minification",
    ],
  },
  {
    icon: <Binary className="h-6 w-6" />,
    title: "Base64 Encoder",
    description: "Encode and decode Base64 strings and files",
    href: "/docs/encoding-tools",
    features: [
      "Text encoding",
      "File support",
      "MIME detection",
      "URL-safe mode",
    ],
  },
  {
    icon: <Lock className="h-6 w-6" />,
    title: "JWT Decoder",
    description: "Decode and validate JWT tokens with signature verification",
    href: "/docs/jwt-tools",
    features: [
      "Token decoding",
      "Signature verification",
      "Payload inspection",
      "Header analysis",
    ],
  },
  {
    icon: <Regex className="h-6 w-6" />,
    title: "RegExp Tester",
    description: "Test regular expressions with real-time match highlighting",
    href: "/docs/regexp-tools",
    features: [
      "Real-time testing",
      "Match highlighting",
      "Group capture",
      "Flags support",
    ],
  },
];

const quickLinks = [
  {
    title: "FAQ",
    href: "/docs/faq",
    description: "Frequently asked questions",
  },
  {
    title: "Troubleshooting",
    href: "/docs/troubleshooting",
    description: "Common issues and solutions",
  },
  {
    title: "Changelog",
    href: "/docs/changelog",
    description: "Latest updates and changes",
  },
  {
    title: "Support",
    href: "/docs/support",
    description: "Get help and contact support",
  },
];

export default function DocsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            name: "DvTools Documentation",
            description:
              "Comprehensive documentation for developer tools including JSON formatter, Base64 encoder, JWT decoder, and more",
            url: "https://devtoolshub.com/docs",
            publisher: {
              "@type": "Organization",
              name: "DvTools",
              logo: {
                "@type": "ImageObject",
                url: "https://devtoolshub.com/logo.png",
              },
            },
            mainEntity: {
              "@type": "ItemList",
              name: "Documentation Categories",
              itemListElement: docCategories.map((category, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: category.title,
                description: category.description,
              })),
            },
          }),
        }}
      />

      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Developer Tools <span className="text-primary">Documentation</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Comprehensive guides, tutorials, and API references to help you make
          the most of DvTools. From basic usage to advanced integrations.
        </p>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search documentation..."
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">15+</div>
            <div className="text-sm text-muted-foreground">Tools Covered</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">50+</div>
            <div className="text-sm text-muted-foreground">Pages</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">100+</div>
            <div className="text-sm text-muted-foreground">Examples</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">24/7</div>
            <div className="text-sm text-muted-foreground">Support</div>
          </div>
        </div>
      </div>

      {/* Documentation Categories */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Documentation Categories
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {docCategories.map((category) => (
            <Card
              key={category.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div
                  className={`w-16 h-16 rounded-lg ${category.bgColor} flex items-center justify-center mb-4`}
                >
                  <div className={category.color}>{category.icon}</div>
                </div>
                <CardTitle className="text-xl">{category.title}</CardTitle>
                <p className="text-muted-foreground">{category.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {category.sections.map((section) => (
                    <li key={section.title}>
                      <Link
                        href={section.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center"
                      >
                        <ArrowRight className="h-3 w-3 mr-2" />
                        {section.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full">
                  <Link href={`/docs/${category.id}`}>
                    View All {category.title}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Tools */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Popular Tools</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {featuredTools.map((tool) => (
            <Card
              key={tool.title}
              className="hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-primary">{tool.icon}</div>
                  <div className="flex-1">
                    <Link href={tool.href}>
                      <h3 className="text-lg font-semibold mb-2 hover:text-primary transition-colors">
                        {tool.title}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground mb-4">
                      {tool.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tool.features.map((feature) => (
                        <Badge
                          key={feature}
                          variant="secondary"
                          className="text-xs"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={tool.href}>
                        Learn More
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Key Features */}
      <section className="mb-16 bg-muted/50 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Our Documentation?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Comprehensive Coverage
            </h3>
            <p className="text-muted-foreground">
              Every tool and feature is thoroughly documented with examples and
              best practices.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Up-to-Date</h3>
            <p className="text-muted-foreground">
              Documentation is regularly updated with the latest features and
              improvements.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Developer Friendly</h3>
            <p className="text-muted-foreground">
              Written by developers, for developers. Clear, concise, and
              actionable guidance.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Quick Links</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map((link) => (
            <Card
              key={link.title}
              className="hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6 text-center">
                <Link href={link.href}>
                  <h3 className="font-semibold mb-2 hover:text-primary transition-colors">
                    {link.title}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground">
                  {link.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center bg-primary text-primary-foreground rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
          Jump into our documentation and start building amazing things with
          DvTools.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" asChild>
            <Link href="/docs/getting-started">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
            asChild
          >
            <Link href="/tools">Try Tools Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
