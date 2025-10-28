import { Metadata } from "next";
import { Base64Client } from "@/components/tools/base64-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Base64 Encoder/Decoder - Encode and Decode Base64 Online",
  description:
    "Free online Base64 encoder and decoder. Convert text and files to Base64 and back with MIME type detection. Secure and fast.",
  keywords: [
    "base64 encoder",
    "base64 decoder",
    "base64 converter",
    "encode base64",
    "decode base64",
  ],
  alternates: { canonical: "/tools/base64" },
};

const jsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Base64 Encoder/Decoder",
  applicationCategory: "DeveloperApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free online Base64 encoder and decoder with MIME type detection",
};

export default function Base64Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />
      <div className="tool-container">
        <div className="tool-header">
          <h1 className="tool-title">Base64 Encoder / Decoder</h1>
          <p className="tool-description">
            Encode and decode Base64 strings and files with MIME type detection
          </p>
        </div>
        <Base64Client />
      </div>
    </>
  );
}
