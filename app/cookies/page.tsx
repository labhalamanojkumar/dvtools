import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Cookie,
  Settings,
  BarChart3,
  Shield,
  Eye,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cookie Policy | DevTools Hub - Cookie Usage & Preferences',
  description: 'Learn about how DevTools Hub uses cookies and similar technologies. Manage your cookie preferences and understand our data collection practices.',
  keywords: [
    'cookie policy',
    'cookie preferences',
    'privacy cookies',
    'tracking cookies',
    'cookie consent',
    'data collection',
    'web analytics'
  ],
  openGraph: {
    title: 'Cookie Policy | DevTools Hub - Cookie Usage & Preferences',
    description: 'Learn about how DevTools Hub uses cookies and manage your preferences.',
    type: 'website',
    url: '/cookies',
    siteName: 'DevTools Hub',
    images: [
      {
        url: '/cookies-og.jpg',
        width: 1200,
        height: 630,
        alt: 'DevTools Hub Cookie Policy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cookie Policy | DevTools Hub - Cookie Usage & Preferences',
    description: 'Learn about how DevTools Hub uses cookies and manage your preferences.',
    images: ['/cookies-og.jpg'],
  },
  alternates: {
    canonical: '/cookies',
  },
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
};

const cookieCategories = [
  {
    id: 'essential',
    title: 'Essential Cookies',
    type: 'Required',
    icon: <Shield className="h-5 w-5" />,
    description: 'These cookies are necessary for the website to function and cannot be switched off in our systems.',
    purpose: 'Enable core functionality like security, network management, and accessibility.',
    examples: [
      'Session management and authentication',
      'Security features and fraud prevention',
      'Load balancing and performance optimization',
      'Remembering your cookie preferences'
    ],
    duration: 'Session or up to 1 year',
    required: true
  },
  {
    id: 'analytics',
    title: 'Analytics Cookies',
    type: 'Optional',
    icon: <BarChart3 className="h-5 w-5" />,
    description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
    purpose: 'Analyze website usage, improve performance, and develop new features.',
    examples: [
      'Page views and session duration',
      'Traffic sources and user journey',
      'Device and browser information',
      'Error tracking and debugging'
    ],
    duration: 'Up to 2 years',
    required: false
  },
  {
    id: 'functional',
    title: 'Functional Cookies',
    type: 'Optional',
    icon: <Settings className="h-5 w-5" />,
    description: 'These cookies enable the website to provide enhanced functionality and personalization.',
    purpose: 'Remember your preferences and provide personalized features.',
    examples: [
      'Language and region settings',
      'Theme preferences (light/dark mode)',
      'Tool configurations and settings',
      'Saved preferences and customizations'
    ],
    duration: 'Up to 1 year',
    required: false
  },
  {
    id: 'marketing',
    title: 'Marketing Cookies',
    type: 'Optional',
    icon: <Eye className="h-5 w-5" />,
    description: 'These cookies are used to track visitors across websites to display relevant advertisements.',
    purpose: 'Deliver targeted advertising and measure campaign effectiveness.',
    examples: [
      'Advertising campaign tracking',
      'Social media integration',
      'Retargeting and personalization',
      'Conversion measurement'
    ],
    duration: 'Up to 2 years',
    required: false
  }
];

const thirdPartyServices = [
  {
    name: 'Google Analytics',
    purpose: 'Website analytics and performance monitoring',
    type: 'Analytics',
    privacyPolicy: 'https://policies.google.com/privacy',
    optOut: 'https://tools.google.com/dlpage/gaoptout'
  },
  {
    name: 'Vercel Analytics',
    purpose: 'Performance monitoring and error tracking',
    type: 'Analytics',
    privacyPolicy: 'https://vercel.com/legal/privacy-policy',
    optOut: null
  },
  {
    name: 'Stripe',
    purpose: 'Payment processing for premium subscriptions',
    type: 'Functional',
    privacyPolicy: 'https://stripe.com/privacy',
    optOut: null
  }
];

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Cookie Policy - DevTools Hub",
            "description": "DevTools Hub cookie policy and privacy preferences",
            "url": "https://devtoolshub.com/cookies",
            "publisher": {
              "@type": "Organization",
              "name": "DevTools Hub",
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "privacy@devtoolshub.com",
                "contactType": "cookie policy"
              }
            }
          })
        }}
      />

      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn about how we use cookies and similar technologies to improve your experience.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
            <span>Last updated: October 27, 2025</span>
            <Badge variant="outline">GDPR Compliant</Badge>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cookie className="h-5 w-5" />
            What Are Cookies?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Cookies are small text files that are stored on your device when you visit our website.
            They help us provide you with a better browsing experience by remembering your preferences
            and understanding how you use our site.
          </p>

          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border-l-4 border-blue-500">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Your Privacy Matters</h4>
                <p className="text-blue-800 dark:text-blue-200 text-sm mt-1">
                  We respect your privacy and give you control over your cookie preferences.
                  Essential cookies cannot be disabled as they are required for the site to function.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cookie Categories */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Types of Cookies We Use</h2>
        <div className="grid gap-6">
          {cookieCategories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-primary">
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="text-lg">{category.title}</h3>
                      <Badge variant={category.required ? "default" : "secondary"} className="mt-1">
                        {category.type}
                      </Badge>
                    </div>
                  </div>
                  {category.required && (
                    <Badge variant="outline" className="text-xs">
                      Required
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{category.description}</p>

                <div>
                  <h4 className="font-semibold mb-2">Purpose:</h4>
                  <p className="text-sm text-muted-foreground">{category.purpose}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Examples:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {category.examples.map((example, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm font-medium">Duration:</span>
                  <span className="text-sm text-muted-foreground">{category.duration}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Third-Party Services */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Third-Party Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            We may use third-party services that set their own cookies. These services help us
            analyze website usage, process payments, and improve our services.
          </p>

          <div className="space-y-4">
            {thirdPartyServices.map((service, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold">{service.name}</h4>
                  <Badge variant="outline">{service.type}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{service.purpose}</p>
                <div className="flex gap-4 text-sm">
                  <a
                    href={service.privacyPolicy}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </a>
                  {service.optOut && (
                    <a
                      href={service.optOut}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Opt Out
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Managing Cookies */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Managing Your Cookie Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>You have several options for managing cookies:</p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Browser Settings</h4>
              <p className="text-sm text-muted-foreground">
                Most web browsers allow you to control cookies through their settings preferences.
                You can usually find these settings in the &apos;Options&apos; or &apos;Preferences&apos; menu.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Cookie Consent Banner</h4>
              <p className="text-sm text-muted-foreground">
                When you first visit our site, you&apos;ll see a cookie consent banner where you can
                choose which types of cookies to accept.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Opt-Out Links</h4>
              <p className="text-sm text-muted-foreground">
                For third-party services, you can use the opt-out links provided above to disable
                their cookies.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Contact Us</h4>
              <p className="text-sm text-muted-foreground">
                If you have questions about our cookie practices, please contact our privacy team.
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border-l-4 border-yellow-500 mt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">Important Note</h4>
                <p className="text-yellow-800 dark:text-yellow-200 text-sm mt-1">
                  Disabling certain cookies may affect the functionality of our website and limit your user&apos;s experience.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Updates to Policy */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Updates to This Policy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            We may update this Cookie Policy from time to time to reflect changes in our practices
            or for other operational, legal, or regulatory reasons. We will notify you of any material
            changes by posting the updated policy on this page and updating the &quot;Last Updated&quot; date.
          </p>
        </CardContent>
      </Card>

      {/* Contact CTA */}
      <Card className="mt-12 bg-primary/5 border-primary/20">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-semibold mb-4">Questions About Cookies?</h3>
          <p className="text-muted-foreground mb-6">
            If you have any questions about our cookie policy or need help managing your preferences,
            please contact our privacy team.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="mailto:privacy@devtoolshub.com">
                Contact Privacy Team
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/privacy">
                View Privacy Policy
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}