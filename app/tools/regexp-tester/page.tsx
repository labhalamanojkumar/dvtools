import { Metadata } from "next";
import { RegexpTesterClient } from "@/components/tools/regexp-tester-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Regexp Tester - Test and Validate Regular Expressions Online",
  description:
    "Free online regular expression tester. Test regex patterns with real-time matching, supports all flags, and provides detailed match information.",
  keywords: [
    "regex tester",
    "regular expression",
    "regexp validator",
    "pattern matching",
    "javascript regex",
    "regex flags",
  ],
  openGraph: {
    title: "Regexp Tester - Multi-Tool Platform",
    description:
      "Test and validate regular expressions with real-time matching",
    type: "website",
  },
  alternates: {
    canonical: "/tools/regexp-tester",
  },
};

const jsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Regexp Tester",
  applicationCategory: "DeveloperApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free online regular expression tester with real-time matching and flag support",
};

export default function RegexpTesterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Regexp Tester</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Test and validate regular expressions with real-time matching.
              Supports all regex flags and provides detailed match information.
            </p>
          </div>

          <RegexpTesterClient />
        </div>
      </div>
    </>
  );
}
