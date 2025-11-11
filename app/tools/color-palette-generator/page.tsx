import { Metadata } from "next";
import Script from "next/script";
import ColorPaletteGeneratorClient from "@/components/tools/color-palette-generator-client";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Color Palette Generator - Create Color Schemes Online | DVtools",
  description: "Professional color palette generator and color scheme creator. Generate harmonious color palettes with complementary, analogous, triadic, tetradic, and monochromatic color schemes. Extract dominant colors from images with advanced color picker. Export palettes to CSS variables and JSON. Display colors in HEX, RGB, and HSL formats. Perfect for designers, developers, and digital artists. Free online tool with no registration required.",
  keywords: [
    "color palette generator",
    "color scheme generator",
    "complementary colors",
    "analogous colors",
    "triadic colors",
    "color harmony",
    "color picker",
    "palette creator",
    "color scheme tool",
    "hex color generator",
    "RGB to hex",
    "HSL colors",
    "color extractor",
    "image color picker",
    "design colors",
    "color combination",
    "color theory",
    "color wheel tool",
    "CSS color variables",
    "color palette export",
    "monochromatic colors",
    "tetradic colors",
    "color design tool",
    "web design colors",
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://dvtools.dev"),
  alternates: {
    canonical: "/tools/color-palette-generator",
  },
  openGraph: {
    title: "Color Palette Generator - Create Color Schemes | DVtools",
    description: "Professional color palette generator. Create harmonious color schemes, extract colors from images, and export to CSS/JSON. Multiple scheme types supported.",
    url: "/tools/color-palette-generator",
    siteName: "DVtools",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-color-palette-generator.png",
        width: 1200,
        height: 630,
        alt: "Color Palette Generator Tool - DVtools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Palette Generator - Create Color Schemes | DVtools",
    description: "Professional color palette generator. Create harmonious color schemes, extract colors from images, and export to CSS/JSON.",
    images: ["/og-color-palette-generator.png"],
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
  category: "design tools",
};

export default function ColorPaletteGeneratorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Color Palette Generator",
    "description": "Professional color palette generator and color scheme creator. Generate harmonious color palettes, extract colors from images, and export to multiple formats.",
    "url": "https://dvtools.dev/tools/color-palette-generator",
    "applicationCategory": "DesignApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "5 color scheme types: Complementary, Analogous, Triadic, Tetradic, Monochromatic",
      "Extract dominant colors from uploaded images",
      "Display colors in HEX, RGB, and HSL formats",
      "Export palettes to CSS variables",
      "Export palettes to JSON format",
      "Copy individual colors to clipboard",
      "Interactive color picker",
      "Manual hex color input",
      "Color theory reference guide"
    ],
  };

  return (
    <>
      <Script
        id="color-palette-generator-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ColorPaletteGeneratorClient />
    </>
  );
}
