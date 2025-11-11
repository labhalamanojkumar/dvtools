import { Metadata } from 'next';
import Script from 'next/script';
import HMACGeneratorClient from '@/components/tools/hmac-generator-client';

export const metadata: Metadata = {
  title: 'HMAC Generator Online - SHA-256, SHA-512, MD5 Hash Tool | DvTools',
  description: 'Generate secure HMAC (Hash-based Message Authentication Code) hashes for API authentication, webhook signatures, and data integrity verification. Supports SHA-256, SHA-512, SHA-1, and MD5 algorithms with text and file input.',
  keywords: [
    'HMAC generator',
    'HMAC hash calculator',
    'SHA-256 HMAC',
    'SHA-512 HMAC',
    'HMAC authentication',
    'API authentication tool',
    'webhook signature',
    'HMAC SHA256',
    'message authentication code',
    'cryptographic hash',
    'JWT signing',
    'secure hash generator',
    'HMAC MD5',
    'HMAC SHA1',
    'data integrity verification',
    'API security tool',
    'HMAC online tool',
    'hash-based authentication',
    'secure authentication',
    'cryptography tool',
    'security tools',
    'developer tools'
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
    canonical: '/tools/hmac-generator',
  },
  openGraph: {
    title: 'HMAC Generator - Secure Hash Authentication Tool | DvTools',
    description: 'Generate secure HMAC hashes for API authentication and data integrity verification. Supports SHA-256, SHA-512, and more.',
    url: 'https://dvtools.in/tools/hmac-generator',
    siteName: 'DvTools',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DvTools HMAC Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HMAC Generator Tool | DvTools',
    description: 'Generate secure HMAC hashes for API authentication. Free online tool.',
    images: ['/og-image.png'],
    creator: '@dvtools',
  },
  category: 'security tools',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'HMAC Generator',
  description: 'Generate secure HMAC (Hash-based Message Authentication Code) hashes for API authentication, webhook signatures, and data integrity verification using SHA-256, SHA-512, SHA-1, and MD5 algorithms.',
  url: 'https://dvtools.in/tools/hmac-generator',
  applicationCategory: 'SecurityApplication',
  operatingSystem: 'Any',
  permissions: 'browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'SHA-256, SHA-512, SHA-1, MD5 algorithms',
    'Text and file input support',
    'Random secure key generation',
    'Real-time hash computation',
    'Copy and download results',
    'Hex output format',
    'Client-side processing',
    'Free to use'
  ],
};

export default function HMACGeneratorPage() {
  return (
    <>
      <Script
        id="hmac-generator-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HMACGeneratorClient />
    </>
  );
}
