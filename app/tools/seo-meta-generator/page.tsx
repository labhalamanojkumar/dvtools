import { Metadata } from 'next';
import SeoMetaGeneratorClient from '@/components/tools/seo-meta-generator-client';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'SEO Meta Tag Generator - OpenGraph, Twitter Cards, JSON-LD | DvTools',
  description: 'Generate optimized meta tags for SEO and social media. Create OpenGraph tags, Twitter Cards, JSON-LD schema, and basic meta tags to improve your website visibility and search engine rankings.',
  keywords: [
    'SEO meta tags',
    'meta tag generator',
    'OpenGraph generator',
    'Twitter Card generator',
    'JSON-LD generator',
    'og tags',
    'social media tags',
    'meta description generator',
    'SEO tools',
    'website SEO',
    'meta keywords',
    'structured data',
    'schema markup',
    'Facebook meta tags',
    'Twitter meta tags',
    'SEO optimization',
    'meta tag creator',
    'social sharing tags',
    'search engine optimization',
    'website metadata',
    'SEO meta generator',
    'page metadata'
  ],
  authors: [{ name: 'DvTools' }],
  creator: 'DvTools',
  publisher: 'DvTools',
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
  openGraph: {
    title: 'SEO Meta Tag Generator - OpenGraph & Twitter Cards',
    description: 'Generate comprehensive meta tags for SEO and social media sharing. Create OpenGraph, Twitter Cards, and JSON-LD structured data instantly.',
    url: 'https://dvtools.in/tools/seo-meta-generator',
    siteName: 'DvTools',
    images: [
      {
        url: 'https://dvtools.in/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'DvTools SEO Meta Tag Generator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Meta Tag Generator | DvTools',
    description: 'Generate optimized meta tags for search engines and social media',
    creator: '@dvtools',
    images: ['https://dvtools.in/og-image.jpg'],
  },
  alternates: {
    canonical: '/tools/seo-meta-generator',
  },
  category: 'SEO tools',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'SEO Meta Tag Generator',
  applicationCategory: 'BusinessApplication',
  description: 'Generate comprehensive SEO meta tags including OpenGraph, Twitter Cards, and JSON-LD',
  url: 'https://dvtools.in/tools/seo-meta-generator',
  operatingSystem: 'Any',
  permissions: 'browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Generate basic meta tags',
    'OpenGraph / Facebook tags',
    'Twitter Card tags',
    'JSON-LD structured data',
    'Social media preview',
    'Copy individual sections',
    'Download complete HTML',
    'SEO optimization'
  ],
};

export default function SeoMetaGeneratorPage() {
  return (
    <>
      <Script
        id="seo-meta-generator-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SeoMetaGeneratorClient />
    </>
  );
}
