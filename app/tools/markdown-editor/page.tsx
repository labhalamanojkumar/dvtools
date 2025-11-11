import { Metadata } from "next";
import Script from "next/script";
import MarkdownEditorClient from "@/components/tools/markdown-editor-client";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Markdown Editor with Live Preview | DVtools - Online Markdown Editor",
  description: "Professional online markdown editor with real-time live preview, syntax highlighting, and file upload support. Edit, preview, and export markdown to HTML. Supports GitHub Flavored Markdown (GFM), tables, code blocks, and more. Free developer tool with no registration required.",
  keywords: [
    "markdown editor",
    "live preview",
    "markdown to HTML",
    "syntax highlighting",
    "GitHub Flavored Markdown",
    "GFM",
    "markdown converter",
    "online markdown editor",
    "markdown preview",
    "free markdown editor",
    "markdown tool",
    "markdown writer",
    "markdown export",
    "markdown download",
    "markdown file upload",
    "code syntax highlighting",
    "markdown tables",
    "markdown formatting",
    "markdown cheatsheet",
    "real-time preview",
    "split view editor",
    "markdown documentation",
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://dvtools.dev"),
  alternates: {
    canonical: "/tools/markdown-editor",
  },
  openGraph: {
    title: "Markdown Editor with Live Preview | DVtools",
    description: "Professional online markdown editor with real-time preview, syntax highlighting, and file upload. Export to HTML instantly. Free developer tool.",
    url: "/tools/markdown-editor",
    siteName: "DVtools",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-markdown-editor.png",
        width: 1200,
        height: 630,
        alt: "Markdown Editor with Live Preview - DVtools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Markdown Editor with Live Preview | DVtools",
    description: "Professional online markdown editor with real-time preview, syntax highlighting, and file upload. Export to HTML instantly.",
    images: ["/og-markdown-editor.png"],
    creator: "@dvtools",
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

export default function MarkdownEditorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Markdown Editor with Live Preview",
    "description": "Professional online markdown editor with real-time live preview, syntax highlighting, and file upload support. Supports GitHub Flavored Markdown (GFM), tables, and code blocks.",
    "url": "https://dvtools.dev/tools/markdown-editor",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "Live preview with syntax highlighting",
      "GitHub Flavored Markdown support",
      "File upload (.md, .markdown)",
      "Export to HTML and Markdown",
      "Split view, edit-only, and preview-only modes",
      "Code syntax highlighting",
      "Copy to clipboard",
      "Markdown cheatsheet reference"
    ],
  };

  return (
    <>
      <Script
        id="markdown-editor-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MarkdownEditorClient />
    </>
  );
}
