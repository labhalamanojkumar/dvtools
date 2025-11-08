import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Eye,
  Database,
  Users,
  Mail,
  Cookie,
  FileText,
  ArrowLeft,
  Globe,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | DvTools - Data Protection & Privacy",
  description:
    "Learn how DvTools protects your privacy and handles your data. We are committed to transparency, security, and compliance with privacy regulations.",
  keywords: [
    "privacy policy",
    "data protection",
    "GDPR compliance",
    "privacy rights",
    "data security",
    "developer tools privacy",
    "data handling",
  ],
  openGraph: {
    title: "Privacy Policy | DvTools - Data Protection & Privacy",
    description:
      "Learn how DvTools protects your privacy and handles your data.",
    type: "website",
    url: "/privacy",
    siteName: "DvTools",
    images: [
      {
        url: "/privacy-og.jpg",
        width: 1200,
        height: 630,
        alt: "DvTools Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | DvTools - Data Protection & Privacy",
    description:
      "Learn how DvTools protects your privacy and handles your data.",
    images: ["/privacy-og.jpg"],
  },
  alternates: {
    canonical: "/privacy",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const sections = [
  {
    id: "introduction",
    title: "Introduction",
    icon: <Shield className="h-5 w-5" />,
    content: `
      <p>At DvTools, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.</p>

      <p>This policy applies to all users of DvTools, including visitors to our website and registered users of our services. By using our services, you agree to the collection and use of information in accordance with this policy.</p>

      <div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border-l-4 border-blue-500 my-6">
        <div class="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 class="font-semibold text-blue-900 dark:text-blue-100">Our Commitment</h4>
            <p class="text-blue-800 dark:text-blue-200 text-sm mt-1">We process all data client-side in your browser. Your sensitive data never reaches our servers.</p>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: "information-we-collect",
    title: "Information We Collect",
    icon: <Database className="h-5 w-5" />,
    content: `
      <h3>What We Collect</h3>
      <ul>
        <li><strong>Account Information:</strong> Email address, name, and profile information when you create an account</li>
        <li><strong>Usage Data:</strong> Tool usage statistics, session data, and performance metrics</li>
        <li><strong>Technical Data:</strong> IP address, browser type, device information, and cookies</li>
        <li><strong>Communication Data:</strong> Messages sent through our support channels</li>
      </ul>

      <h3>How We Collect Information</h3>
      <ul>
        <li><strong>Direct Collection:</strong> Information you provide when registering or contacting us</li>
        <li><strong>Automatic Collection:</strong> Data collected through cookies, web beacons, and analytics tools</li>
        <li><strong>Third-Party Sources:</strong> Information from social media platforms when you connect accounts</li>
      </ul>

      <div class="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border-l-4 border-yellow-500 my-6">
        <div class="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 class="font-semibold text-yellow-900 dark:text-yellow-100">Important Note</h4>
            <p class="text-yellow-800 dark:text-yellow-200 text-sm mt-1">Your tool input data (JSON, code, etc.) is processed entirely in your browser and is never stored or transmitted to our servers.</p>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: "how-we-use-information",
    title: "How We Use Your Information",
    icon: <Eye className="h-5 w-5" />,
    content: `
      <p>We use the information we collect for the following purposes:</p>

      <h3>Service Provision</h3>
      <ul>
        <li>To provide and maintain our developer tools and services</li>
        <li>To process transactions and manage subscriptions</li>
        <li>To provide customer support and technical assistance</li>
        <li>To send service-related notifications and updates</li>
      </ul>

      <h3>Service Improvement</h3>
      <ul>
        <li>To analyze usage patterns and improve our services</li>
        <li>To develop new features and functionality</li>
        <li>To conduct research and analytics</li>
        <li>To monitor and prevent technical issues</li>
      </ul>

      <h3>Legal Compliance</h3>
      <ul>
        <li>To comply with legal obligations and regulatory requirements</li>
        <li>To protect our rights and prevent fraud</li>
        <li>To enforce our Terms of Service</li>
      </ul>
    `,
  },
  {
    id: "information-sharing",
    title: "Information Sharing and Disclosure",
    icon: <Users className="h-5 w-5" />,
    content: `
      <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>

      <h3>With Your Consent</h3>
      <p>When you explicitly agree to share your information with third parties.</p>

      <h3>Service Providers</h3>
      <p>With trusted third-party service providers who assist us in operating our services, subject to confidentiality agreements.</p>

      <h3>Legal Requirements</h3>
      <p>When required by law, court order, or government regulation to disclose information.</p>

      <h3>Business Transfers</h3>
      <p>In connection with a merger, acquisition, or sale of assets, where user information may be transferred as part of the transaction.</p>

      <div class="bg-green-50 dark:bg-green-950 p-4 rounded-lg border-l-4 border-green-500 my-6">
        <div class="flex items-start gap-3">
          <Lock className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <h4 class="font-semibold text-green-900 dark:text-green-100">Data Protection</h4>
            <p class="text-green-800 dark:text-green-200 text-sm mt-1">We implement industry-standard security measures to protect your data against unauthorized access, alteration, or disclosure.</p>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: "data-retention",
    title: "Data Retention",
    icon: <Database className="h-5 w-5" />,
    content: `
      <p>We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.</p>

      <h3>Account Data</h3>
      <p>Account information is retained while your account is active and for a reasonable period after account closure for legal and regulatory purposes.</p>

      <h3>Usage Data</h3>
      <p>Anonymous usage statistics may be retained indefinitely for analytics and service improvement purposes.</p>

      <h3>Legal Obligations</h3>
      <p>Certain information may be retained longer if required by applicable laws, regulations, or legal proceedings.</p>
    `,
  },
  {
    id: "your-rights",
    title: "Your Rights and Choices",
    icon: <FileText className="h-5 w-5" />,
    content: `
      <p>You have certain rights regarding your personal information. Depending on your location, these rights may include:</p>

      <h3>Access Rights</h3>
      <ul>
        <li><strong>Right to Access:</strong> Request a copy of the personal information we hold about you</li>
        <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete information</li>
        <li><strong>Right to Erasure:</strong> Request deletion of your personal information in certain circumstances</li>
      </ul>

      <h3>Control Rights</h3>
      <ul>
        <li><strong>Right to Restriction:</strong> Request limitation of how we process your information</li>
        <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
        <li><strong>Right to Data Portability:</strong> Request transfer of your data in a structured format</li>
      </ul>

      <h3>How to Exercise Your Rights</h3>
      <p>To exercise any of these rights, please contact us using the information provided in the "Contact Us" section below.</p>
    `,
  },
  {
    id: "cookies",
    title: "Cookies and Tracking",
    icon: <Cookie className="h-5 w-5" />,
    content: `
      <p>We use cookies and similar technologies to enhance your experience on our website.</p>

      <h3>Types of Cookies We Use</h3>
      <ul>
        <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
        <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
        <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
        <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
      </ul>

      <h3>Managing Cookies</h3>
      <p>You can control cookie settings through your browser preferences. However, disabling certain cookies may affect website functionality.</p>

      <p>For more detailed information about our cookie practices, please see our <a href="/cookies" class="text-primary hover:underline">Cookie Policy</a>.</p>
    `,
  },
  {
    id: "international-transfers",
    title: "International Data Transfers",
    icon: <Globe className="h-5 w-5" />,
    content: `
      <p>Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws.</p>

      <h3>Data Transfer Mechanisms</h3>
      <ul>
        <li>Adequacy decisions by relevant authorities</li>
        <li>Standard contractual clauses</li>
        <li>Binding corporate rules</li>
        <li>Your explicit consent</li>
      </ul>

      <p>We implement appropriate safeguards to ensure the security and protection of your personal information during international transfers.</p>
    `,
  },
  {
    id: "childrens-privacy",
    title: "Children's Privacy",
    icon: <Users className="h-5 w-5" />,
    content: `
      <p>Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.</p>

      <p>If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information promptly.</p>

      <p>Parents and guardians who believe their child has provided us with personal information should contact us immediately.</p>
    `,
  },
  {
    id: "changes-to-policy",
    title: "Changes to This Privacy Policy",
    icon: <FileText className="h-5 w-5" />,
    content: `
      <p>We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements.</p>

      <h3>Notification of Changes</h3>
      <ul>
        <li>We will post the updated policy on this page</li>
        <li>We will update the "Last Updated" date below</li>
        <li>For significant changes, we may provide additional notice</li>
      </ul>

      <p>Your continued use of our services after any changes indicates your acceptance of the updated Privacy Policy.</p>
    `,
  },
  {
    id: "contact-us",
    title: "Contact Us",
    icon: <Mail className="h-5 w-5" />,
    content: `
      <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>

      <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg my-6">
        <h4 class="font-semibold mb-2">DvTools Privacy Team</h4>
        <p><strong>Email:</strong> privacy@devtoolshub.com</p>
        <p><strong>Address:</strong> [Company Address]</p>
        <p><strong>Data Protection Officer:</strong> dpo@devtoolshub.com</p>
      </div>

      <p>We will respond to your inquiries within 30 days of receipt.</p>

      <p>If you are located in the EEA, you also have the right to lodge a complaint with your local data protection authority.</p>
    `,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Privacy Policy - DvTools",
            description:
              "DvTools privacy policy and data protection information",
            url: "https://devtoolshub.com/privacy",
            publisher: {
              "@type": "Organization",
              name: "DvTools",
              contactPoint: {
                "@type": "ContactPoint",
                email: "privacy@devtoolshub.com",
                contactType: "privacy policy",
              },
            },
          }),
        }}
      />

      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-muted-foreground hover:text-primary mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we
            collect, use, and protect your information.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
            <span>Last updated: October 27, 2025</span>
            <Badge variant="outline">GDPR Compliant</Badge>
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Table of Contents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <nav className="grid md:grid-cols-2 gap-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-2 p-2 rounded hover:bg-muted transition-colors"
              >
                {section.icon}
                <span className="text-sm">{section.title}</span>
              </a>
            ))}
          </nav>
        </CardContent>
      </Card>

      {/* Content Sections */}
      <div className="space-y-8">
        {sections.map((section) => (
          <Card key={section.id} id={section.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="text-primary">{section.icon}</div>
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact CTA */}
      <Card className="mt-12 bg-primary/5 border-primary/20">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-semibold mb-4">
            Questions About Your Privacy?
          </h3>
          <p className="text-muted-foreground mb-6">
            If you have any questions about this Privacy Policy or how we handle
            your data, please don&apos;t hesitate to contact us.
          </p>
          <Button asChild>
            <Link href="mailto:privacy@devtoolshub.com">
              Contact Privacy Team
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
