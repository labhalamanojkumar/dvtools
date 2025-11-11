import { Metadata } from 'next';
import Script from 'next/script';
import TextToASCIIArtClient from '@/components/tools/text-to-ascii-art-client';

export const metadata: Metadata = {
  title: 'Text to ASCII Art Converter - Create Stylish Text Banners Online | DvTools',
  description: 'Convert plain text into beautiful ASCII art with multiple font styles. Create text banners, logos, and decorative text for README files, documentation, and social media. Free online tool with instant conversion and download.',
  keywords: [
    'ASCII art generator',
    'text to ASCII',
    'ASCII art converter',
    'text banner generator',
    'ASCII text art',
    'text logo maker',
    'ASCII font generator',
    'decorative text creator',
    'README banner maker',
    'ASCII art fonts',
    'text art generator',
    'banner text tool',
    'terminal banner creator',
    'ASCII signature maker',
    'text to ASCII art online',
    'free ASCII art generator',
    'ASCII text converter',
    'stylish text generator',
    'ASCII art styles',
    'text banner design',
    'developer tools',
    'documentation tools'
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
  alternates: {
    canonical: '/tools/text-to-ascii-art',
  },
  openGraph: {
    title: 'Text to ASCII Art Converter - Create Stylish Text Banners | DvTools',
    description: 'Convert plain text into beautiful ASCII art with multiple font styles. Free online tool for creating text banners and decorative text.',
    url: 'https://dvtools.in/tools/text-to-ascii-art',
    siteName: 'DvTools',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DvTools Text to ASCII Art Converter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Text to ASCII Art Converter | DvTools',
    description: 'Convert text into beautiful ASCII art with multiple font styles. Free online tool.',
    images: ['/og-image.png'],
    creator: '@dvtools',
  },
  category: 'developer tools',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Text to ASCII Art Converter',
  description: 'Convert plain text into beautiful ASCII art with multiple font styles for README files, documentation, and social media.',
  url: 'https://dvtools.in/tools/text-to-ascii-art',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  permissions: 'browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Multiple ASCII art font styles',
    'Real-time text conversion',
    'Upload text files',
    'Copy to clipboard',
    'Download as text file',
    'Clean readable output',
    'No registration required',
    'Free to use'
  ],
};

export default function TextToASCIIArtPage() {
  return (
    <>
      <Script
        id="text-to-ascii-art-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TextToASCIIArtClient />
    </>
  );
}
