import { NextRequest, NextResponse } from "next/server";

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number | string;
    yearly: number | string;
    currency: string;
  };
  features: string[];
  popular?: boolean;
  cta: {
    text: string;
    href: string;
    variant?: string;
  };
  limits?: {
    apiCalls: number;
    storage: string;
    users: number;
  };
}

const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "Limited Time - All Features Free",
    price: {
      monthly: 0,
      yearly: 0,
      currency: "USD",
    },
    features: [
      "All basic tools (JSON, Base64, JWT, RegExp)",
      "Up to 300 API calls per month",
      "Community support",
      "Basic documentation",
      "Standard response times",
      "Browser-based processing",
      "Limited storage (1GB)",
    ],
    popular: true,
    cta: {
      text: "Get Started Free",
      href: "/auth/signin",
      variant: "default",
    },
    limits: {
      apiCalls: 300,
      storage: "1GB",
      users: 1,
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
    popular: false,
    cta: {
      text: "Coming Soon",
      href: "#",
      variant: "outline",
    },
    limits: {
      apiCalls: -1, // unlimited
      storage: "10GB",
      users: 5,
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
    cta: {
      text: "Coming Soon",
      href: "#",
      variant: "outline",
    },
    limits: {
      apiCalls: -1, // unlimited
      storage: "Unlimited",
      users: -1, // unlimited
    },
  },
];

interface FAQ {
  question: string;
  answer: string;
}

const pricingFAQs: FAQ[] = [
  {
    question: "Can I change my plan at any time?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated.",
  },
  {
    question: "Is there a free trial for paid plans?",
    answer:
      "Yes, we offer a 14-day free trial for both Pro and Enterprise plans. No credit card required to start.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for Enterprise customers.",
  },
  {
    question:
      "Do you offer discounts for non-profits or educational institutions?",
    answer:
      "Yes, we offer special pricing for non-profits, educational institutions, and open-source projects. Contact our sales team for details.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Absolutely. You can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your billing period.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, security is our top priority. All data is encrypted in transit and at rest. We comply with industry standards and regulations.",
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeFaqs = searchParams.get("faqs") === "true";

    const response: any = {
      plans: pricingPlans,
    };

    if (includeFaqs) {
      response.faqs = pricingFAQs;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching pricing data:", error);
    return NextResponse.json(
      { error: "Failed to fetch pricing data" },
      { status: 500 },
    );
  }
}
