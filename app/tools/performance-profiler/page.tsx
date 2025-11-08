import { Metadata } from "next";
import PerformanceProfilerClient from "@/components/tools/performance-profiler-client";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Performance Profiler - Website Speed Test & Core Web Vitals Analysis | Multi-Tool Platform",
  description: "Free online performance profiler for website speed testing. Analyze Core Web Vitals, identify bottlenecks, and get optimization recommendations. Improve page load times, LCP, FID, CLS scores.",
  keywords: [
    "performance profiler",
    "website speed test",
    "Core Web Vitals",
    "page speed optimization",
    "website performance",
    "load time analysis",
    "performance monitoring",
    "LCP optimization",
    "FID improvement",
    "CLS reduction",
    "web vitals checker",
    "site speed analyzer"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multitoolplatform.com"),
  alternates: {
    canonical: "/tools/performance-profiler",
  },
  openGraph: {
    title: "Performance Profiler - Website Speed Test & Core Web Vitals Analysis",
    description: "Analyze website performance, Core Web Vitals metrics, and get actionable optimization recommendations for faster loading times.",
    url: "/tools/performance-profiler",
    siteName: "Multi Tool Platform",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-performance-profiler.png",
        width: 1200,
        height: 630,
        alt: "Performance Profiler Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Performance Profiler - Website Speed Test & Core Web Vitals Analysis",
    description: "Analyze website performance, Core Web Vitals metrics, and get actionable optimization recommendations for faster loading times.",
    images: ["/og-performance-profiler.png"],
    creator: "@multitoolplatform",
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
  category: "development tools",
};

export default function PerformanceProfilerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Performance Profiler",
    "description": "Comprehensive website performance analysis tool with Core Web Vitals testing, speed optimization recommendations, and detailed performance metrics for modern web development.",
    "url": "https://multitoolplatform.com/tools/performance-profiler",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "Comprehensive Core Web Vitals analysis (LCP, FID, CLS)",
      "Real-time website speed testing and performance metrics",
      "Detailed bottleneck identification and analysis",
      "Actionable optimization recommendations with priority levels",
      "Resource loading analysis and waterfall charts",
      "Mobile and desktop performance comparison",
      "Historical performance tracking and trends",
      "Integration with popular performance monitoring tools",
      "Custom performance budgets and alerting",
      "Export detailed performance reports"
    ],
    "screenshot": "/og-performance-profiler.png",
    "author": {
      "@type": "Organization",
      "name": "Multi-Tool Platform",
    },
  };

  const breadcrumbLd = {
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
        "name": "Performance Profiler",
        "item": "https://multitoolplatform.com/tools/performance-profiler"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbLd),
        }}
      />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
              Performance Profiler
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Comprehensive website performance analysis tool. Test Core Web Vitals, identify bottlenecks, and get actionable recommendations
              to improve page load times and user experience across all devices.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Core Web Vitals
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Speed Analysis
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Optimization Guide
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                Performance Monitoring
              </span>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Core Web Vitals Analysis</h3>
              <p className="text-muted-foreground">
                Comprehensive analysis of LCP, FID, and CLS metrics with detailed scoring and improvement recommendations for better search rankings.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-time Speed Testing</h3>
              <p className="text-muted-foreground">
                Instant performance testing with detailed metrics including First Contentful Paint, Time to Interactive, and Total Blocking Time.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0V1m10 3V1m0 3l1 1v16a2 2 0 01-2 2H6a2 2 0 01-2-2V5l1-1z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Bottleneck Detection</h3>
              <p className="text-muted-foreground">
                Advanced analysis to identify performance bottlenecks including slow resources, render-blocking assets, and optimization opportunities.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Optimization Recommendations</h3>
              <p className="text-muted-foreground">
                Prioritized action items with specific code examples and implementation guides to improve performance scores and loading times.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Resource Analysis</h3>
              <p className="text-muted-foreground">
                Detailed breakdown of all resources with loading waterfalls, size analysis, and caching recommendations for optimal delivery.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Performance Monitoring</h3>
              <p className="text-muted-foreground">
                Continuous monitoring with historical data, trend analysis, and alerts for performance regressions and improvements.
              </p>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6">How to Use Performance Profiler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">1. Enter Website URL</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Enter the URL of the website to analyze</li>
                  <li>• Support for HTTP and HTTPS websites</li>
                  <li>• Test single pages or entire applications</li>
                  <li>• Include query parameters if needed</li>
                  <li>• Test from different geographical locations</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">2. Configure Test Settings</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Choose device type (mobile, desktop, tablet)</li>
                  <li>• Select network conditions (fast, slow, custom)</li>
                  <li>• Enable/disable specific tests</li>
                  <li>• Set performance budgets and thresholds</li>
                  <li>• Configure advanced analysis options</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">3. Run Performance Test</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Start comprehensive performance analysis</li>
                  <li>• Monitor real-time testing progress</li>
                  <li>• View live Core Web Vitals measurements</li>
                  <li>• Analyze resource loading in real-time</li>
                  <li>• Generate performance waterfall charts</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">4. Review Results & Optimize</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Analyze detailed performance reports</li>
                  <li>• Review prioritized optimization recommendations</li>
                  <li>• Compare results across different devices</li>
                  <li>• Export reports and share findings</li>
                  <li>• Track improvements over time</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-8 border mb-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Analyze Your Website Performance?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Start testing your website's Core Web Vitals and performance metrics now. Get detailed analysis and actionable recommendations to improve loading times.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Start Performance Test
                </button>
                <button className="border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 px-6 py-3 rounded-lg font-medium transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* Performance Profiler Component */}
          <PerformanceProfilerClient />

          {/* Educational Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* About Core Web Vitals */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4">Understanding Core Web Vitals</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p>
                  Core Web Vitals are a set of specific factors that Google considers important in a webpage's overall user experience.
                  These metrics help quantify the experience of your site's visitors and are crucial for SEO and user satisfaction.
                </p>

                <h3>Why Core Web Vitals Matter</h3>
                <ul>
                  <li><strong>SEO Impact:</strong> Core Web Vitals are ranking factors in Google's algorithm</li>
                  <li><strong>User Experience:</strong> Better metrics correlate with improved user satisfaction</li>
                  <li><strong>Conversion Rates:</strong> Faster sites typically have higher conversion rates</li>
                  <li><strong>Mobile Performance:</strong> Critical for mobile search rankings</li>
                  <li><strong>Industry Standard:</strong> Widely adopted performance measurement framework</li>
                </ul>
              </div>
            </div>

            {/* Core Web Vitals Metrics */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Core Web Vitals Metrics</h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Largest Contentful Paint (LCP)</h4>
                  <p className="text-sm text-muted-foreground">
                    Measures loading performance - main content should load within 2.5 seconds
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">First Input Delay (FID)</h4>
                  <p className="text-sm text-muted-foreground">
                    Measures interactivity - page should respond within 100 milliseconds
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950 dark:to-violet-900 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Cumulative Layout Shift (CLS)</h4>
                  <p className="text-sm text-muted-foreground">
                    Measures visual stability - layout should shift less than 0.1
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Optimization Areas */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Performance Optimization Areas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Code Optimization</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Minify and compress CSS, JavaScript, and HTML</li>
                  <li>• Remove unused code and dependencies</li>
                  <li>• Implement code splitting and lazy loading</li>
                  <li>• Enable GZIP/Brotli compression on server</li>
                  <li>• Optimize JavaScript execution and parsing</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Resource Optimization</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Compress and optimize images (WebP, AVIF)</li>
                  <li>• Implement proper caching headers</li>
                  <li>• Use Content Delivery Networks (CDNs)</li>
                  <li>• Preload critical resources</li>
                  <li>• Optimize font loading and rendering</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Rendering Optimization</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Eliminate render-blocking resources</li>
                  <li>• Optimize CSS delivery and critical CSS</li>
                  <li>• Reduce layout shifts and reflows</li>
                  <li>• Implement virtual scrolling for large lists</li>
                  <li>• Use CSS containment for performance</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Network Optimization</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Use HTTP/2 or HTTP/3 protocols</li>
                  <li>• Implement resource hints (preload, prefetch)</li>
                  <li>• Optimize DNS lookup times</li>
                  <li>• Reduce server response times</li>
                  <li>• Implement service workers for caching</li>
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-card rounded-lg p-8 border mt-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What are Core Web Vitals?</h3>
                <p className="text-muted-foreground">
                  Core Web Vitals are a set of three performance metrics that measure key aspects of the user experience: loading (LCP), interactivity (FID), and visual stability (CLS). They are part of Google's page experience signals used for search ranking.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">How do Core Web Vitals affect SEO?</h3>
                <p className="text-muted-foreground">
                  Core Web Vitals are a confirmed ranking factor in Google's search algorithm. Websites with good Core Web Vitals scores are more likely to rank higher in search results, especially for mobile searches.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">What is a good Core Web Vitals score?</h3>
                <p className="text-muted-foreground">
                  Good scores are: LCP ≤ 2.5 seconds, FID ≤ 100 milliseconds, and CLS ≤ 0.1. Scores between the good and poor thresholds are considered "needs improvement," while scores above the poor thresholds need urgent attention.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">How often should I test performance?</h3>
                <p className="text-muted-foreground">
                  Test performance whenever you make significant changes to your website, and at least monthly for ongoing monitoring. Set up automated monitoring to catch performance regressions early.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I improve Core Web Vitals without coding?</h3>
                <p className="text-muted-foreground">
                  Yes, many improvements can be made without coding, such as optimizing images, using better hosting, implementing caching, and using a Content Delivery Network (CDN). However, some optimizations require code changes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
