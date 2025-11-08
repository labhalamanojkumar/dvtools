import { Metadata } from 'next'
import ABTestManagerClient from '@/components/tools/ABTestManagerClient'
import { SHARED_METADATA } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'A/B Test Manager - Professional Experiment Management Tool | Multi Tool Platform',
  description: 'Create, manage, and analyze A/B tests with statistical significance testing, real-time results, and comprehensive experiment tracking. Perfect for product managers and data scientists.',
  keywords: [
    'A/B testing',
    'experiment management',
    'statistical analysis',
    'conversion optimization',
    'hypothesis testing',
    'split testing',
    'multivariate testing',
    'experiment tracking',
    'statistical significance',
    'conversion rate optimization',
    'product experimentation',
    'data-driven decisions',
    'A/B test calculator',
    'experiment analysis',
    'statistical testing',
    'confidence intervals',
    'p-value calculation',
    'sample size calculator',
    'experiment design',
    'variant testing',
    'user experience testing',
    'website optimization',
    'product analytics',
    'growth hacking',
    'conversion funnel analysis'
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://multitoolplatform.com'),
  alternates: {
    canonical: '/tools/ab-test-manager',
  },
  openGraph: {
    title: 'A/B Test Manager - Professional Experiment Management Tool | Multi Tool Platform',
    description: 'Create, manage, and analyze A/B tests with statistical significance testing, real-time results, and comprehensive experiment tracking.',
    url: '/tools/ab-test-manager',
    siteName: 'Multi Tool Platform',
    images: [
      {
        url: '/og-ab-test-manager.jpg',
        width: 1200,
        height: 630,
        alt: 'A/B Test Manager - Professional Experiment Management Tool',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'A/B Test Manager - Professional Experiment Management Tool',
    description: 'Create, manage, and analyze A/B tests with statistical significance testing, real-time results, and comprehensive experiment tracking.',
    images: ['/og-ab-test-manager.jpg'],
    creator: '@multitoolplatform',
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
  category: 'productivity tools',
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "A/B Test Manager - Professional Experiment Management Tool",
  "description": "Create, manage, and analyze A/B tests with statistical significance testing, real-time results, and comprehensive experiment tracking.",
  "url": "https://multitoolplatform.com/tools/ab-test-manager",
  "applicationCategory": "ExperimentManagementTool",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "Statistical significance testing",
    "Real-time experiment tracking",
    "Multiple testing methodologies",
    "Conversion funnel analysis",
    "Sample size calculations",
    "Confidence interval reporting",
    "Experiment result visualization",
    "Automated winner determination",
    "Multi-variant testing support",
    "Historical experiment data",
    "Integration with analytics platforms",
    "Custom metric definitions"
  ],
  "screenshot": "/og-ab-test-manager.jpg",
  "author": {
    "@type": "Organization",
    "name": "Multi Tool Platform"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Multi Tool Platform"
  },
  "datePublished": new Date().toISOString().split('T')[0],
  "dateModified": new Date().toISOString().split('T')[0]
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://multitoolplatform.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Tools",
      "item": "https://multitoolplatform.com/tools"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "A/B Test Manager",
      "item": "https://multitoolplatform.com/tools/ab-test-manager"
    }
  ]
};

export default function ABTestManagerPage() {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            A/B Test Manager
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Professional experiment management platform for creating, running, and analyzing A/B tests
            with statistical rigor. Make data-driven decisions with confidence using advanced statistical
            testing, real-time tracking, and comprehensive experiment analytics for product optimization.
          </p>

          {/* Key Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold mb-1">Statistical Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Advanced statistical testing with significance calculations
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-semibold mb-1">Real-time Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Live experiment monitoring and instant result updates
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-semibold mb-1">Conversion Optimization</h3>
              <p className="text-sm text-muted-foreground">
                Optimize conversion rates with data-driven insights
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">📈</div>
              <h3 className="font-semibold mb-1">Experiment Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive reporting and experiment performance metrics
              </p>
            </div>
          </div>
        </div>

        {/* Tool Component */}
        <ABTestManagerClient />

        {/* Documentation Section */}
        <div className="mt-16 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">How to Use</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Follow these steps to design, execute, and analyze effective A/B tests for your product
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Getting Started */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">1. Define Your Hypothesis</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Clearly state what you want to test and why</p>
                  <p>• Define measurable success metrics</p>
                  <p>• Determine the expected impact and significance level</p>
                  <p>• Set up proper control and treatment groups</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">2. Design Your Experiment</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Choose appropriate test methodology (A/B, multivariate)</p>
                  <p>• Calculate required sample size for statistical power</p>
                  <p>• Set experiment duration and traffic allocation</p>
                  <p>• Define experiment segments and targeting rules</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">3. Set Up Tracking</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Configure event tracking and conversion goals</p>
                  <p>• Set up proper analytics integration</p>
                  <p>• Define guardrail metrics to monitor</p>
                  <p>• Establish data quality checks</p>
                </div>
              </div>
            </div>

            {/* Advanced Features */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">4. Launch & Monitor</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Start the experiment with proper randomization</p>
                  <p>• Monitor real-time results and statistical significance</p>
                  <p>• Watch for unexpected trends or issues</p>
                  <p>• Ensure proper data collection and quality</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">5. Analyze Results</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Calculate statistical significance and confidence intervals</p>
                  <p>• Analyze secondary metrics and user behavior</p>
                  <p>• Consider practical significance vs statistical significance</p>
                  <p>• Document insights and learnings</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">6. Implement & Iterate</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Roll out winning variations to all users</p>
                  <p>• Monitor long-term impact and performance</p>
                  <p>• Use insights to inform future experiments</p>
                  <p>• Continuously optimize based on data</p>
                </div>
              </div>
            </div>
          </div>

          {/* Testing Methodologies */}
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Supported Testing Methodologies</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">A/B</span>
                </div>
                <div>
                  <div className="font-medium">A/B Testing</div>
                  <div className="text-sm text-muted-foreground">Compare two variants</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">MV</span>
                </div>
                <div>
                  <div className="font-medium">Multivariate Testing</div>
                  <div className="text-sm text-muted-foreground">Test multiple variables</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-purple-600 dark:text-purple-400">SS</span>
                </div>
                <div>
                  <div className="font-medium">Split Testing</div>
                  <div className="text-sm text-muted-foreground">URL-based testing</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-orange-600 dark:text-orange-400">SR</span>
                </div>
                <div>
                  <div className="font-medium">Sequential Testing</div>
                  <div className="text-sm text-muted-foreground">Continuous monitoring</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">BR</span>
                </div>
                <div>
                  <div className="font-medium">Bayesian Testing</div>
                  <div className="text-sm text-muted-foreground">Probability-based decisions</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">CU</span>
                </div>
                <div>
                  <div className="font-medium">Custom Testing</div>
                  <div className="text-sm text-muted-foreground">Flexible experiment design</div>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center">How It Works</h3>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h4 className="font-semibold mb-2">1. Design Experiment</h4>
                <p className="text-sm text-muted-foreground">
                  Define your hypothesis, select testing methodology,
                  and configure experiment parameters with statistical rigor.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h4 className="font-semibold mb-2">2. Run & Monitor</h4>
                <p className="text-sm text-muted-foreground">
                  Execute experiments with real-time tracking, statistical
                  significance testing, and automated result monitoring.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h4 className="font-semibold mb-2">3. Analyze & Optimize</h4>
                <p className="text-sm text-muted-foreground">
                  Generate insights from experiment results and implement
                  winning variations to drive continuous improvement.
                </p>
              </div>
            </div>
          </div>

          {/* Use Cases */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Common Use Cases</h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Website Optimization</h4>
                <p className="text-sm text-muted-foreground">
                  Test different layouts, copy, images, and calls-to-action
                  to improve conversion rates and user engagement.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Product Features</h4>
                <p className="text-sm text-muted-foreground">
                  Evaluate new features, UI changes, and user flows
                  to determine which variations provide the best user experience.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Pricing Strategy</h4>
                <p className="text-sm text-muted-foreground">
                  Test different pricing models, discount structures,
                  and payment flows to optimize revenue and conversion.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Email Marketing</h4>
                <p className="text-sm text-muted-foreground">
                  Optimize email subject lines, content, send times,
                  and design elements to improve open rates and conversions.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Mobile App Testing</h4>
                <p className="text-sm text-muted-foreground">
                  Test app store descriptions, onboarding flows,
                  feature placements, and user interface elements.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Content Strategy</h4>
                <p className="text-sm text-muted-foreground">
                  Test different content formats, headlines, and messaging
                  to determine what resonates best with your audience.
                </p>
              </div>
            </div>
          </div>

          {/* Best Practices */}
          <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <div className="text-blue-600 dark:text-blue-400 mt-0.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  A/B Testing Best Practices
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
                  <div>
                    <strong>Statistical Significance:</strong> Always wait for proper statistical significance before declaring winners.
                  </div>
                  <div>
                    <strong>Sample Size:</strong> Calculate appropriate sample sizes to ensure reliable results.
                  </div>
                  <div>
                    <strong>Control Contamination:</strong> Avoid testing multiple changes simultaneously that might interact.
                  </div>
                  <div>
                    <strong>Seasonal Effects:</strong> Consider time-based variations and external factors affecting results.
                  </div>
                  <div>
                    <strong>Practical Significance:</strong> Focus on changes that create meaningful business impact.
                  </div>
                  <div>
                    <strong>Continuous Testing:</strong> Treat experimentation as an ongoing process, not one-time events.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Frequently Asked Questions</h3>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">How do I know when my A/B test has enough data?</h4>
                <p className="text-sm text-muted-foreground">
                  The tool automatically calculates statistical significance and provides recommendations
                  based on your desired confidence level and minimum detectable effect size.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">What statistical methods does the tool use?</h4>
                <p className="text-sm text-muted-foreground">
                  The tool uses industry-standard statistical tests including chi-square tests for proportions,
                  t-tests for continuous metrics, and Bayesian analysis for probability-based decisions.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Can I run multiple experiments simultaneously?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, you can run multiple experiments concurrently. The tool helps you manage experiment
                  interactions and provides guidance on avoiding conflicts between simultaneous tests.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">How does the tool handle early stopping?</h4>
                <p className="text-sm text-muted-foreground">
                  The tool implements proper statistical corrections for early stopping and provides
                  conservative estimates to avoid false positives when peeking at results.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Can I integrate with my existing analytics platform?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, the tool supports integration with popular analytics platforms including Google Analytics,
                  Mixpanel, Amplitude, and custom data sources through APIs.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">What about mobile app A/B testing?</h4>
                <p className="text-sm text-muted-foreground">
                  The tool supports mobile app testing through SDK integrations and provides specialized
                  analysis for app-specific metrics like retention, engagement, and in-app conversions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
