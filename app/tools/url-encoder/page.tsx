import { Metadata } from 'next';
import { UrlEncoderClient } from '@/components/tools/url-encoder-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'URL Encoder/Decoder - Encode and Decode URLs Online',
  description: 'Free online URL encoder and decoder. Encode and decode URLs, query strings, and special characters for web development.',
  keywords: ['URL encoder', 'URL decoder', 'encode URL', 'decode URL', 'URL encoding', 'percent encoding'],
  alternates: { canonical: '/tools/url-encoder' },
};

const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'URL Encoder/Decoder',
  applicationCategory: 'DeveloperApplication',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  description: 'Free online URL encoder and decoder for web development',
};

export default function UrlEncoderPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />
      <div className="tool-container">
        <div className="tool-header">
          <h1 className="tool-title">URL Encoder / Decoder</h1>
          <p className="tool-description">
            Encode and decode URLs and query strings
          </p>
        </div>
        <UrlEncoderClient />
      </div>
    </>
  );
}