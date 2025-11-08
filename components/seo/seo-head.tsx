"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  structuredData?: object;
}

export default function SEOHead({
  title = "Developer Tools Platform - Professional Suite of Development Utilities",
  description = "Comprehensive suite of professional developer tools including code formatters, encryption utilities, database managers, and more. Fast, secure, and optimized for developers.",
  keywords = [
    "developer tools",
    "code formatter",
    "base64 encoder",
    "database migration",
    "developer utilities",
    "JSON formatter",
    "regex tester",
    "JWT decoder",
    "color palette",
    "CSV tools"
  ],
  image = "/og-image.jpg",
  url,
  type = "website",
  author = "Developer Tools Platform",
  publishedTime,
  modifiedTime,
  structuredData
}: SEOHeadProps) {
  const pathname = usePathname();
  const canonicalUrl = url || `${process.env.NEXT_PUBLIC_BASE_URL || 'https://devtools.example.com'}${pathname}`;

  useEffect(() => {
    // Update title
    if (title) {
      document.title = title;
    }

    // Update meta tags
    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords.join(", "));
    updateMetaTag("author", author);

    // Open Graph tags
    updateMetaTag("og:title", title, "property");
    updateMetaTag("og:description", description, "property");
    updateMetaTag("og:image", image, "property");
    updateMetaTag("og:url", canonicalUrl, "property");
    updateMetaTag("og:type", type, "property");
    updateMetaTag("og:site_name", "Developer Tools Platform", "property");

    // Twitter Card tags
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", image);
    updateMetaTag("twitter:creator", "@devtools");

    // Additional SEO meta tags
    updateMetaTag("robots", "index, follow");
    updateMetaTag("googlebot", "index, follow");
    updateMetaTag("theme-color", "#3b82f6");
    updateMetaTag("msapplication-TileColor", "#3b82f6");

    // Schema.org structured data
    if (structuredData) {
      let structuredDataScript = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
      if (!structuredDataScript) {
        structuredDataScript = document.createElement("script");
        structuredDataScript.type = "application/ld+json";
        document.head.appendChild(structuredDataScript);
      }
      structuredDataScript.textContent = JSON.stringify(structuredData);
    }

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;

    // Preload critical resources
    const preloadLinks = [
      { href: "/fonts/inter.woff2", as: "font", type: "font/woff2", crossorigin: "anonymous" },
      { href: "/fonts/jetbrains-mono.woff2", as: "font", type: "font/woff2", crossorigin: "anonymous" }
    ];

    preloadLinks.forEach(({ href, as, type, crossorigin }) => {
      let link = document.querySelector(`link[href="${href}"]`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link");
        link.rel = "preload";
        (link as any).as = as;
        if (type) link.type = type;
        if (crossorigin) (link as any).crossOrigin = crossorigin;
        link.href = href;
        document.head.appendChild(link);
      }
    });

  }, [title, description, keywords, image, canonicalUrl, type, author, structuredData]);

  return null;
}

function updateMetaTag(name: string, content: string, attribute: "name" | "property" = "name") {
  if (!content) return;
  
  let metaTag = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  if (!metaTag) {
    metaTag = document.createElement("meta");
    metaTag.setAttribute(attribute, name);
    document.head.appendChild(metaTag);
  }
  metaTag.content = content;
}

// Structured data generators
export const generateToolStructuredData = (tool: {
  name: string;
  description: string;
  url: string;
  category: string;
  features?: string[];
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.name,
    "description": tool.description,
    "url": tool.url,
    "applicationCategory": tool.category,
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": tool.features || [],
    "provider": {
      "@type": "Organization",
      "name": "Developer Tools Platform",
      "url": "https://devtools.example.com"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1247"
    }
  };
};

export const generateBreadcrumbStructuredData = (breadcrumbs: Array<{ name: string; url: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};