import { Metadata } from "next";
import { CodeBeautifierClient } from "@/components/tools/code-beautifier-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Code Beautifier - Format HTML, CSS, and JavaScript Code",
  description:
    "Free online code beautifier and formatter. Format HTML, CSS, JavaScript, and JSON code with proper indentation and syntax highlighting.",
  keywords: [
    "code beautifier",
    "code formatter",
    "HTML formatter",
    "CSS formatter",
    "JavaScript formatter",
    "code indenter",
  ],
  alternates: { canonical: "/tools/code-beautifier" },
};

const jsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Code Beautifier",
  applicationCategory: "DeveloperApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free online code beautifier and formatter for HTML, CSS, JavaScript, and JSON",
};

export default function CodeBeautifierPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />
      <div className="tool-container">
        <div className="tool-header">
          <h1 className="tool-title">Code Beautifier</h1>
          <p className="tool-description">
            Format and beautify HTML, CSS, JavaScript, and JSON code
          </p>
        </div>
        <CodeBeautifierClient />
      </div>
    </>
  );
}
