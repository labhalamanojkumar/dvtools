import { Metadata } from 'next';
import { JwtDecoderClient } from '@/components/tools/jwt-decoder-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'JWT Decoder - Decode and Verify JSON Web Tokens',
  description: 'Free online JWT decoder and validator. Decode JWT headers and payloads, verify signatures, and check token expiration.',
  keywords: ['JWT decoder', 'JWT validator', 'JSON web token', 'decode JWT', 'verify JWT'],
  alternates: { canonical: '/tools/jwt-decoder' },
};

const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'JWT Decoder',
  applicationCategory: 'DeveloperApplication',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  description: 'Free online JWT decoder and validator with signature verification',
};

export default function JwtDecoderPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />
      <div className="tool-container">
        <div className="tool-header">
          <h1 className="tool-title">JWT Decoder</h1>
          <p className="tool-description">
            Decode and validate JSON Web Tokens with signature verification
          </p>
        </div>
        <JwtDecoderClient />
      </div>
    </>
  );
}