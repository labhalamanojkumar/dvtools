import { Metadata } from 'next';
import Script from 'next/script';
import CodeBeautifierClient from '@/components/tools/code-beautifier-enhanced-client';

export const metadata: Metadata = {
  title: 'HTML CSS JavaScript Beautifier - Code Formatter Online | DvTools',
  description: 'Beautify and format HTML, CSS, and JavaScript code with customizable indentation. Unminify code, improve readability, and maintain consistent formatting. Free online code beautifier with file upload.',
  keywords: [
    'HTML beautifier',
    'CSS beautifier',
    'JavaScript beautifier',
    'code formatter',
    'code prettifier',
    'unminify code',
    'HTML formatter',
    'CSS formatter',
    'JS formatter',
    'code beautifier online',
    'format HTML',
    'format CSS',
    'format JavaScript',
    'pretty print code',
    'code indentation tool',
    'minified code formatter',
    'code cleaner',
    'beautify code online',
    'format code tool',
    'code styling tool',
    'developer tools',
    'frontend tools'
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
    canonical: '/tools/code-beautifier-enhanced',
  },
  openGraph: {
    title: 'HTML CSS JS Beautifier - Code Formatter Tool | DvTools',
    description: 'Beautify and format your HTML, CSS, and JavaScript code instantly with customizable options.',
    url: 'https://dvtools.in/tools/code-beautifier-enhanced',
    siteName: 'DvTools',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DvTools Code Beautifier',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Code Beautifier Tool | DvTools',
    description: 'Format HTML, CSS, and JavaScript code with customizable indentation. Free online tool.',
    images: ['/og-image.png'],
    creator: '@dvtools',
  },
  category: 'developer tools',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'HTML CSS JavaScript Code Beautifier',
  description: 'Professional code formatter for beautifying HTML, CSS, and JavaScript with customizable indentation and formatting options.',
  url: 'https://dvtools.in/tools/code-beautifier-enhanced',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  permissions: 'browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Format HTML, CSS, JavaScript',
    'Customizable indentation',
    'File upload support',
    'Copy and download results',
    'Syntax-aware formatting',
    'Unminify production code',
    'No registration required',
    'Free to use'
  ],
};

export default function CodeBeautifierPage() {
  return (
    <>
      <Script
        id="code-beautifier-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CodeBeautifierClient />
    </>
  );
}
