import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Check,
  Star,
  Zap,
  Shield,
  Users,
  Headphones,
  ArrowRight,
  Lock,
  Globe,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing | DvTools - Developer Tools Pricing Plans",
  description:
    "Choose the perfect plan for your development needs. From free tier to enterprise solutions, get access to professional developer tools with flexible pricing.",
  keywords: [
    "developer tools pricing",
    "JSON formatter pricing",
    "Base64 encoder plans",
    "JWT decoder pricing",
    "developer tools subscription",
    "API pricing",
    "coding tools plans",
  ],
  openGraph: {
    title: "Pricing | DvTools - Developer Tools Pricing Plans",
    description:
      "Choose the perfect plan for your development needs. From free tier to enterprise solutions.",
    type: "website",
    url: "/pricing",
    siteName: "DvTools",
    images: [
      {
        url: "/pricing-og.jpg",
        width: 1200,
        height: 630,
        alt: "DvTools Pricing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing | DvTools - Developer Tools Pricing Plans",
    description:
      "Choose the perfect plan for your development needs. From free tier to enterprise solutions.",
    images: ["/pricing-og.jpg"],
  },
  alternates: {
    canonical: "/pricing",
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

const pricingPlans = [
  {
    id: "free",
    name: "Free",
    description: "Limited Time - All Features Free",
    price: {
      monthly: 0,
      yearly: 0,
      currency: "USD",
    },
    icon: <Zap className="h-8 w-8" />,
    popular: true,
    features: [
      "All basic tools (JSON, Base64, JWT, RegExp)",
      "Up to 300 API calls per month",
      "Community support",
      "Basic documentation",
      "Standard response times",
      "Browser-based processing",
      "Limited storage (1GB)",
    ],
    limits: {
      apiCalls: 300,
      storage: "1GB",
      users: 1,
    },
    cta: {
      text: "Get Started Free",
      href: "/auth/signin",
      variant: "default" as const,
    },
  },
  {
    id: "pro",
    name: "Pro",
    description:
      "Advanced features for professional developers and small teams",
    price: {
      monthly: "Coming Soon",
      yearly: "Coming Soon",
      currency: "USD",
    },
    icon: <Star className="h-8 w-8" />,
    popular: false,
    features: [
      "All Free features",
      "Unlimited API calls",
      "Priority email support",
      "Advanced documentation",
      "Custom integrations",
      "Team collaboration tools",
      "API rate limiting controls",
      "Usage analytics dashboard",
      "Export functionality",
      "Advanced formatting options",
      "Bulk processing",
      "API key management",
    ],
    limits: {
      apiCalls: -1, // unlimited
      storage: "10GB",
      users: 5,
    },
    cta: {
      text: "Coming Soon",
      href: "#",
      variant: "outline" as const,
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description:
      "Complete solution for large organizations with advanced needs",
    price: {
      monthly: "Coming Soon",
      yearly: "Coming Soon",
      currency: "USD",
    },
    icon: <Shield className="h-8 w-8" />,
    popular: false,
    features: [
      "All Pro features",
      "Unlimited everything",
      "Dedicated support manager",
      "Custom integrations",
      "On-premise deployment option",
      "Advanced security features",
      "Compliance tools (GDPR, HIPAA)",
      "Custom branding",
      "API management",
      "Advanced analytics",
      "24/7 phone support",
      "SLA guarantees",
      "Custom contracts",
      "Training sessions",
      "Migration assistance",
    ],
    limits: {
      apiCalls: -1, // unlimited
      storage: "Unlimited",
      users: -1, // unlimited
    },
    cta: {
      text: "Coming Soon",
      href: "#",
      variant: "outline" as const,
    },
  },
];

const faqs = [
  {
    question: "Can I change my plan at any time?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated. Your data and settings are preserved during plan changes.",
  },
  {
    question: "Is there a free trial for paid plans?",
    answer:
      "Yes, we offer a 14-day free trial for both Pro and Enterprise plans. No credit card required to start your trial. You'll get full access to all features during the trial period.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for Enterprise customers. All payments are processed securely through Stripe.",
  },
  {
    question:
      "Do you offer discounts for non-profits or educational institutions?",
    answer:
      "Yes, we offer special pricing for non-profits, educational institutions, and open-source projects. Contact our sales team for details and eligibility requirements.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Absolutely. You can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your billing period. No cancellation fees.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, security is our top priority. All data is encrypted in transit and at rest. We comply with industry standards including SOC 2, GDPR, and CCPA. Your data is never shared with third parties.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied with our service, contact support within 30 days of your first payment for a full refund.",
  },
  {
    question: "What happens if I exceed my plan limits?",
    answer:
      "If you exceed your API call limits, your requests will be throttled. You'll receive notifications when approaching limits. You can upgrade your plan at any time to increase your limits.",
  },
];

const features = [
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Lightning Fast",
    description:
      "Client-side processing ensures instant results without server delays",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Privacy First",
    description:
      "Your data never leaves your browser. No tracking, no storage, no compromises",
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Works Everywhere",
    description:
      "Fully responsive design works perfectly on desktop, tablet, and mobile",
  },
  {
    icon: <Headphones className="h-6 w-6" />,
    title: "24/7 Support",
    description:
      "Get help whenever you need it with our comprehensive support system",
  },
  {
    icon: <Lock className="h-6 w-6" />,
    title: "Enterprise Security",
    description:
      "Bank-level security with end-to-end encryption and compliance standards",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Team Collaboration",
    description: "Share tools and results with your team members seamlessly",
  },
];

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "DvTools",
            description:
              "Professional developer tools platform with flexible pricing plans",
            offers: pricingPlans
              .filter((plan) => typeof plan.price.monthly === "number")
              .map((plan) => ({
                "@type": "Offer",
                name: plan.name,
                description: plan.description,
                price: plan.price.monthly,
                priceCurrency: plan.price.currency,
                availability: "https://schema.org/InStock",
              })),
          }),
        }}
      />

      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Choose Your <span className="text-primary">Perfect Plan</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          From individual developers to large enterprises, we have a plan that
          fits your needs. Start free and scale as you grow.
        </p>

        {/* Billing Note */}
        <div className="mb-8">
          <p className="text-sm text-muted-foreground">
            🎉 <strong>Limited Time:</strong> All features are completely free!
            Pro and Enterprise plans coming soon.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {pricingPlans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground px-4 py-1">
                  Most Popular
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-8">
              <div className="text-primary mb-4 flex justify-center">
                {plan.icon}
              </div>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <p className="text-muted-foreground">{plan.description}</p>

              <div className="mt-6">
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold">
                    {typeof plan.price.monthly === "string"
                      ? plan.price.monthly
                      : `$${plan.price.monthly}`}
                  </span>
                  <span className="text-muted-foreground ml-2">
                    {typeof plan.price.monthly === "number" &&
                    plan.price.monthly > 0
                      ? "/month"
                      : ""}
                  </span>
                </div>
                {typeof plan.price.yearly === "number" &&
                  plan.price.yearly > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      ${plan.price.yearly}/year when billed annually
                    </p>
                  )}
              </div>
            </CardHeader>

            <CardContent>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.limits && (
                <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2 text-sm">Plan Limits:</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>API Calls:</span>
                      <span>
                        {plan.limits.apiCalls === -1
                          ? "Unlimited"
                          : plan.limits.apiCalls.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Storage:</span>
                      <span>{plan.limits.storage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Users:</span>
                      <span>
                        {plan.limits.users === -1
                          ? "Unlimited"
                          : plan.limits.users}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <Button
                className="w-full"
                variant={plan.cta.variant}
                size="lg"
                asChild
              >
                <Link href={plan.cta.href}>
                  {plan.cta.text}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose DvTools?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="text-primary mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center bg-primary text-primary-foreground rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
          Take advantage of our limited time free offer! All features are
          available at no cost. Pro and Enterprise plans will be available soon.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" asChild>
            <Link href="/auth/signin">
              Start Using Free Tools
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
            asChild
          >
            <Link href="/contact">Get Notified for Pro Plans</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
