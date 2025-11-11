import { Metadata } from 'next';
import DateTimezoneToolClient from '@/components/tools/date-timezone-tool-client';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Date & Timezone Converter - Unix Timestamp, UTC Converter | DvTools',
  description: 'Convert dates and times between timezones, work with Unix timestamps, view current time across multiple timezones. Essential tool for developers working with global applications and APIs.',
  keywords: [
    'timezone converter',
    'date converter',
    'unix timestamp converter',
    'UTC converter',
    'time converter',
    'epoch converter',
    'timestamp to date',
    'date to timestamp',
    'world clock',
    'time zone calculator',
    'date formatter',
    'timezone tool',
    'GMT converter',
    'IST converter',
    'PST converter',
    'EST converter',
    'date time converter',
    'timestamp generator',
    'epoch time converter',
    'unix time converter',
    'global time',
    'international time'
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
    title: 'Date & Timezone Converter - Unix Timestamp Tool',
    description: 'Convert dates between timezones, work with Unix timestamps, and view world clocks. Professional time conversion tool for developers.',
    url: 'https://dvtools.in/tools/date-timezone-tool',
    siteName: 'DvTools',
    images: [
      {
        url: 'https://dvtools.in/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'DvTools Date & Timezone Converter',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Date & Timezone Converter | DvTools',
    description: 'Convert dates, times, and timestamps across timezones',
    creator: '@dvtools',
    images: ['https://dvtools.in/og-image.jpg'],
  },
  alternates: {
    canonical: '/tools/date-timezone-tool',
  },
  category: 'developer tools',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Date & Timezone Converter',
  applicationCategory: 'DeveloperApplication',
  description: 'Convert dates and times between timezones with Unix timestamp support',
  url: 'https://dvtools.in/tools/date-timezone-tool',
  operatingSystem: 'Any',
  permissions: 'browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Convert between timezones',
    'Unix timestamp converter',
    'World clock display',
    'Date format conversion',
    'Current time in multiple zones',
    'Copy results instantly',
    'Support major timezones',
    'API timestamp parser'
  ],
};

export default function DateTimezoneToolPage() {
  return (
    <>
      <Script
        id="date-timezone-tool-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DateTimezoneToolClient />
    </>
  );
}
