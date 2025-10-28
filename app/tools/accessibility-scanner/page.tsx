import { Metadata } from "next";
import AccessibilityScannerClient from "@/components/tools/accessibility-scanner-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Accessibility Scanner - WCAG Compliance Checker Online",
  description:
    "Free online accessibility scanner. Check WCAG compliance, find accessibility issues, and improve web accessibility for all users. Automated testing for A, AA, and AAA compliance.",
  keywords: [
    "accessibility scanner",
    "WCAG checker",
    "web accessibility",
    "a11y testing",
    "accessibility audit",
    "WCAG compliance",
    "accessibility validator",
  ],
  openGraph: {
    title: "Accessibility Scanner - WCAG Compliance Checker",
    description:
      "Automated accessibility testing for WCAG A, AA, and AAA compliance",
    type: "website",
  },
  alternates: {
    canonical: "/tools/accessibility-scanner",
  },
};

const jsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Accessibility Scanner",
  applicationCategory: "DeveloperApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Automated WCAG accessibility compliance checker and web accessibility scanner",
};

export default function AccessibilityScannerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />
      <div className="tool-container">
        <div className="tool-header">
          <h1 className="tool-title">Accessibility Scanner</h1>
          <p className="tool-description">
            Scan your website for accessibility issues and WCAG compliance.
            Ensure your content is usable by everyone, including people with
            disabilities
          </p>
        </div>

        <AccessibilityScannerClient />

        {/* SEO Content */}
        <section className="mt-12 space-y-6">
          <div>
            <h2 className="mb-4 text-2xl font-bold">About Web Accessibility</h2>
            <p className="text-muted-foreground">
              Web accessibility (a11y) ensures that websites and web
              applications are usable by people with disabilities. This includes
              visual, motor, auditory, speech, cognitive, and neurological
              disabilities. Following WCAG guidelines helps create inclusive
              digital experiences for all users.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-semibold">
              WCAG Compliance Levels
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-green-600">Level A</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Basic accessibility requirements that must be met.
                </p>
                <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground">
                  <li>Alternative text for images</li>
                  <li>Keyboard navigation</li>
                  <li>Form labels</li>
                  <li>Page language identification</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-blue-600">Level AA</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Most common accessibility requirements for most websites.
                </p>
                <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground">
                  <li>Color contrast ratios</li>
                  <li>Resize text up to 200%</li>
                  <li>Audio descriptions</li>
                  <li>Consistent navigation</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-purple-600">
                  Level AAA
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Highest level of accessibility, may not be possible in all
                  cases.
                </p>
                <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground">
                  <li>Enhanced color contrast</li>
                  <li>Sign language interpretation</li>
                  <li>Extended audio descriptions</li>
                  <li>Plain language</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-semibold">
              Key Accessibility Principles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  POUR
                </div>
                <div className="text-sm font-medium">Perceivable</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Information must be presentable in different ways
                </div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  POUR
                </div>
                <div className="text-sm font-medium">Operable</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Interface elements must be operable by all users
                </div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-orange-600 mb-2">
                  POUR
                </div>
                <div className="text-sm font-medium">Understandable</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Information and operation must be understandable
                </div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  POUR
                </div>
                <div className="text-sm font-medium">Robust</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Content must work with current and future technologies
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-semibold">
              Common Accessibility Issues
            </h3>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li>
                <strong>Missing alt text:</strong> Images without descriptive
                alternative text
              </li>
              <li>
                <strong>Poor color contrast:</strong> Text that&apos;s hard to
                read due to insufficient contrast
              </li>
              <li>
                <strong>Missing form labels:</strong> Form inputs without
                associated labels
              </li>
              <li>
                <strong>Keyboard navigation:</strong> Elements that can&apos;t
                be accessed with keyboard only
              </li>
              <li>
                <strong>Heading structure:</strong> Improper heading hierarchy
                (skipping levels)
              </li>
              <li>
                <strong>Link context:</strong> Links without clear purpose or
                context
              </li>
              <li>
                <strong>Page titles:</strong> Missing or uninformative page
                titles
              </li>
              <li>
                <strong>Language attributes:</strong> Missing language
                identification
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-semibold">
              Benefits of Accessibility
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Legal Compliance</h4>
                <p className="text-sm text-muted-foreground">
                  Many countries have laws requiring websites to be accessible,
                  including ADA in the US, Equality Act in the UK, and similar
                  legislation worldwide.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Better User Experience</h4>
                <p className="text-sm text-muted-foreground">
                  Accessible websites work better for everyone, including mobile
                  users, elderly users, and those with temporary disabilities.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">SEO Benefits</h4>
                <p className="text-sm text-muted-foreground">
                  Search engines favor accessible websites, and proper semantic
                  HTML and alt text improve search engine optimization.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Business Impact</h4>
                <p className="text-sm text-muted-foreground">
                  Accessible websites reach a wider audience and can increase
                  customer satisfaction and brand loyalty.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-semibold">Testing Methods</h3>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li>
                <strong>Automated testing:</strong> Tools like this scanner can
                catch many common issues
              </li>
              <li>
                <strong>Manual testing:</strong> Human review for context and
                subjective issues
              </li>
              <li>
                <strong>Screen reader testing:</strong> Using assistive
                technologies to navigate
              </li>
              <li>
                <strong>Keyboard-only testing:</strong> Navigating without a
                mouse
              </li>
              <li>
                <strong>Color blindness simulation:</strong> Testing with
                different color vision deficiencies
              </li>
              <li>
                <strong>Zoom testing:</strong> Ensuring usability at higher zoom
                levels
              </li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
