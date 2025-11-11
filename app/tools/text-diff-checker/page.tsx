import { Metadata } from 'next';
import TextDiffCheckerClient from '@/components/tools/text-diff-checker-client';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Text Diff Checker - Compare Files, Code, Configurations | DvTools',
  description: 'Professional text diff checker for comparing code, configurations, and documents. Side-by-side and unified diff views with syntax highlighting. Essential tool for code review, debugging, and version control analysis.',
  keywords: [
    'text diff checker',
    'diff tool',
    'compare files',
    'code comparison',
    'text comparison',
    'file diff',
    'side by side diff',
    'unified diff',
    'code review tool',
    'version control',
    'git diff',
    'text compare',
    'file compare',
    'diff viewer',
    'merge tool',
    'configuration comparison',
    'code diff',
    'document comparison',
    'line by line diff',
    'syntax diff',
    'patch viewer',
    'change detector'
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
    title: 'Text Diff Checker - Compare Files & Code',
    description: 'Professional diff tool for comparing text, code, and configuration files. Side-by-side and unified views with detailed statistics.',
    url: 'https://dvtools.in/tools/text-diff-checker',
    siteName: 'DvTools',
    images: [
      {
        url: 'https://dvtools.in/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'DvTools Text Diff Checker',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Text Diff Checker | DvTools',
    description: 'Compare text files, code, and configurations with side-by-side diff viewer',
    creator: '@dvtools',
    images: ['https://dvtools.in/og-image.jpg'],
  },
  alternates: {
    canonical: '/tools/text-diff-checker',
  },
  category: 'developer tools',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Text Diff Checker',
  applicationCategory: 'DeveloperApplication',
  description: 'Professional text and code diff checker with side-by-side and unified comparison views',
  url: 'https://dvtools.in/tools/text-diff-checker',
  operatingSystem: 'Any',
  permissions: 'browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Side-by-side text comparison',
    'Unified diff view',
    'Line-by-line highlighting',
    'File upload support',
    'Ignore whitespace option',
    'Case-insensitive comparison',
    'Download diff results',
    'Detailed change statistics',
    'Multiple file format support',
    'Real-time diff computation'
  ],
  screenshot: 'https://dvtools.in/og-image.jpg',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '2847',
    bestRating: '5',
    worstRating: '1'
  },
  author: {
    '@type': 'Organization',
    name: 'DvTools',
    url: 'https://dvtools.in'
  }
};

export default function TextDiffCheckerPage() {
  return (
    <>
      <Script
        id="text-diff-checker-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TextDiffCheckerClient />
    </>
  );
}
