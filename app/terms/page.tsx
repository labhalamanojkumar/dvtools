import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Scale,
  Users,
  Lock,
  Ban,
  DollarSign,
  Globe,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | DevTools Hub - Usage Agreement",
  description:
    "Read DevTools Hub's Terms of Service. Understand your rights and responsibilities when using our developer tools and services.",
  keywords: [
    "terms of service",
    "terms and conditions",
    "usage agreement",
    "developer tools terms",
    "service agreement",
    "legal terms",
  ],
  openGraph: {
    title: "Terms of Service | DevTools Hub - Usage Agreement",
    description:
      "Read DevTools Hub's Terms of Service and understand your rights and responsibilities.",
    type: "website",
    url: "/terms",
    siteName: "DevTools Hub",
    images: [
      {
        url: "/terms-og.jpg",
        width: 1200,
        height: 630,
        alt: "DevTools Hub Terms of Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | DevTools Hub - Usage Agreement",
    description:
      "Read DevTools Hub's Terms of Service and understand your rights and responsibilities.",
    images: ["/terms-og.jpg"],
  },
  alternates: {
    canonical: "/terms",
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
    id: "acceptance",
    title: "Acceptance of Terms",
    icon: <CheckCircle className="h-5 w-5" />,
    content: `
      <p>By accessing and using DevTools Hub ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.</p>

      <p>If you do not agree to abide by the above, please do not use this service. These Terms of Service apply to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content.</p>

      <div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border-l-4 border-blue-500 my-6">
        <div class="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 class="font-semibold text-blue-900 dark:text-blue-100">Agreement</h4>
            <p class="text-blue-800 dark:text-blue-200 text-sm mt-1">By using DevTools Hub, you acknowledge that you have read, understood, and agree to be bound by these terms.</p>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: "description-of-service",
    title: "Description of Service",
    icon: <FileText className="h-5 w-5" />,
    content: `
      <p>DevTools Hub provides a comprehensive suite of developer tools and utilities designed to assist developers in their work.</p>

      <h3>Service Features</h3>
      <ul>
        <li>JSON formatting and validation tools</li>
        <li>Code formatting and beautification utilities</li>
        <li>API testing and documentation tools</li>
        <li>Development productivity tools</li>
        <li>Code generation and conversion utilities</li>
      </ul>

      <h3>Service Availability</h3>
      <p>We strive to provide continuous availability of our services but do not guarantee uninterrupted access. We reserve the right to modify or discontinue services at any time.</p>
    `,
  },
  {
    id: "user-accounts",
    title: "User Accounts",
    icon: <Users className="h-5 w-5" />,
    content: `
      <h3>Account Creation</h3>
      <p>To access certain features, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials.</p>

      <h3>Account Responsibilities</h3>
      <ul>
        <li>Provide accurate and complete information during registration</li>
        <li>Maintain the security of your password and account</li>
        <li>Notify us immediately of any unauthorized use</li>
        <li>Accept responsibility for all activities under your account</li>
      </ul>

      <h3>Account Termination</h3>
      <p>We reserve the right to terminate or suspend accounts that violate these terms or engage in prohibited activities.</p>
    `,
  },
  {
    id: "acceptable-use",
    title: "Acceptable Use Policy",
    icon: <Shield className="h-5 w-5" />,
    content: `
      <p>You agree to use DevTools Hub only for lawful purposes and in accordance with these terms.</p>

      <h3>Permitted Use</h3>
      <ul>
        <li>Personal and commercial development work</li>
        <li>Educational and learning purposes</li>
        <li>Professional software development</li>
        <li>Testing and validation of code and data</li>
      </ul>

      <h3>Prohibited Activities</h3>
      <ul>
        <li>Violating any applicable laws or regulations</li>
        <li>Infringing intellectual property rights</li>
        <li>Distributing malware or harmful code</li>
        <li>Attempting to gain unauthorized access</li>
        <li>Interfering with service operation</li>
        <li>Using the service for illegal activities</li>
      </ul>

      <div class="bg-red-50 dark:bg-red-950 p-4 rounded-lg border-l-4 border-red-500 my-6">
        <div class="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
          <div>
            <h4 class="font-semibold text-red-900 dark:text-red-100">Important</h4>
            <p class="text-red-800 dark:text-red-200 text-sm mt-1">Violation of these terms may result in immediate account suspension or termination.</p>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    icon: <Lock className="h-5 w-5" />,
    content: `
      <h3>Our Intellectual Property</h3>
      <p>The Service and its original content, features, and functionality are owned by DevTools Hub and are protected by copyright, trademark, and other intellectual property laws.</p>

      <h3>User Content</h3>
      <p>You retain ownership of content you submit to the Service. By submitting content, you grant us a license to use, display, and distribute your content in connection with the Service.</p>

      <h3>License Grant</h3>
      <p>Subject to these terms, we grant you a limited, non-exclusive, non-transferable license to use the Service for your personal or commercial use.</p>
    `,
  },
  {
    id: "privacy-and-data",
    title: "Privacy and Data Protection",
    icon: <Lock className="h-5 w-5" />,
    content: `
      <p>Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these terms by reference.</p>

      <h3>Data Processing</h3>
      <p>All tool processing occurs client-side in your browser. Your sensitive data never reaches our servers.</p>

      <h3>Data Security</h3>
      <p>We implement appropriate technical and organizational measures to protect your data against unauthorized access, alteration, or disclosure.</p>

      <p>For more information about how we handle your data, please review our <a href="/privacy" class="text-primary hover:underline">Privacy Policy</a>.</p>
    `,
  },
  {
    id: "billing-and-payment",
    title: "Billing and Payment",
    icon: <DollarSign className="h-5 w-5" />,
    content: `
      <h3>Free Tier</h3>
      <p>Basic features are available free of charge with reasonable usage limits.</p>

      <h3>Premium Subscriptions</h3>
      <p>Premium features require a paid subscription. Pricing and features are subject to change with notice.</p>

      <h3>Payment Terms</h3>
      <ul>
        <li>All fees are non-refundable unless otherwise stated</li>
        <li>Subscriptions auto-renew unless cancelled</li>
        <li>Payment information is processed securely</li>
        <li>Late payments may result in service suspension</li>
      </ul>

      <p>For detailed pricing information, please visit our <a href="/pricing" class="text-primary hover:underline">Pricing page</a>.</p>
    `,
  },
  {
    id: "disclaimers",
    title: "Disclaimers and Limitations",
    icon: <AlertTriangle className="h-5 w-5" />,
    content: `
      <h3>Service "As Is"</h3>
      <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, expressed or implied, regarding the service's operation or availability.</p>

      <h3>Limitation of Liability</h3>
      <p>To the maximum extent permitted by law, DevTools Hub shall not be liable for any indirect, incidental, special, consequential, or punitive damages.</p>

      <h3>Service Interruptions</h3>
      <p>We do not guarantee uninterrupted or error-free service. We may perform maintenance or updates that temporarily disrupt service availability.</p>
    `,
  },
  {
    id: "termination",
    title: "Termination",
    icon: <Ban className="h-5 w-5" />,
    content: `
      <h3>Termination by User</h3>
      <p>You may terminate your account at any time by contacting us or using account settings.</p>

      <h3>Termination by Us</h3>
      <p>We may terminate or suspend your account immediately for violations of these terms or illegal activity.</p>

      <h3>Effect of Termination</h3>
      <p>Upon termination, your right to use the Service ceases immediately. We may delete your account data after a reasonable period.</p>
    `,
  },
  {
    id: "governing-law",
    title: "Governing Law",
    icon: <Scale className="h-5 w-5" />,
    content: `
      <p>These Terms of Service are governed by and construed in accordance with applicable laws.</p>

      <h3>Jurisdiction</h3>
      <p>Any disputes arising from these terms shall be resolved in the appropriate courts.</p>

      <h3>International Users</h3>
      <p>If you are accessing the Service from outside our jurisdiction, you are responsible for compliance with local laws.</p>
    `,
  },
  {
    id: "changes-to-terms",
    title: "Changes to Terms",
    icon: <FileText className="h-5 w-5" />,
    content: `
      <p>We reserve the right to modify these Terms of Service at any time.</p>

      <h3>Notification</h3>
      <ul>
        <li>Changes will be posted on this page</li>
        <li>We will update the "Last Updated" date</li>
        <li>Continued use constitutes acceptance</li>
      </ul>

      <p>For significant changes, we may provide additional notice through email or service notifications.</p>
    `,
  },
  {
    id: "contact-information",
    title: "Contact Information",
    icon: <Globe className="h-5 w-5" />,
    content: `
      <p>If you have questions about these Terms of Service, please contact us:</p>

      <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg my-6">
        <h4 class="font-semibold mb-2">DevTools Hub Support</h4>
        <p><strong>Email:</strong> legal@devtoolshub.com</p>
        <p><strong>Support:</strong> support@devtoolshub.com</p>
        <p><strong>Address:</strong> [Company Address]</p>
      </div>

      <p>We will respond to your inquiries within a reasonable timeframe.</p>
    `,
  },
];

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Terms of Service - DevTools Hub",
            description: "DevTools Hub terms of service and usage agreement",
            url: "https://devtoolshub.com/terms",
            publisher: {
              "@type": "Organization",
              name: "DevTools Hub",
              contactPoint: {
                "@type": "ContactPoint",
                email: "legal@devtoolshub.com",
                contactType: "terms of service",
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
            Terms of Service
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Please read these terms carefully before using DevTools Hub
            services.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
            <span>Last updated: October 27, 2025</span>
            <Badge variant="outline">Legally Binding</Badge>
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
            Questions About These Terms?
          </h3>
          <p className="text-muted-foreground mb-6">
            If you have any questions about these Terms of Service or need
            clarification, please contact our legal team.
          </p>
          <Button asChild>
            <Link href="mailto:legal@devtoolshub.com">Contact Legal Team</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
