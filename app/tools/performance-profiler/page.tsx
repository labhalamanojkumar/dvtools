import { Metadata } from 'next';
import PerformanceProfilerClient from '@/components/tools/performance-profiler-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Performance Profiler - Website Speed Test & Optimization',
  description: 'Free online performance profiler. Test website speed, analyze Core Web Vitals, identify bottlenecks, and get optimization recommendations. Improve page load times and user experience.',
  keywords: ['performance profiler', 'website speed test', 'Core Web Vitals', 'page speed optimization', 'website performance', 'load time analysis', 'performance monitoring'],
  openGraph: {
    title: 'Performance Profiler - Website Speed Test & Optimization',
    description: 'Analyze website performance, Core Web Vitals, and get optimization recommendations',
    type: 'website',
  },
  alternates: {
    canonical: '/tools/performance-profiler',
  },
};

const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Performance Profiler',
  applicationCategory: 'DeveloperApplication',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  description: 'Website performance analysis tool with Core Web Vitals testing and optimization recommendations',
};

export default function PerformanceProfilerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />
      <div className="tool-container">
        <div className="tool-header">
          <h1 className="tool-title">Performance Profiler</h1>
          <p className="tool-description">
            Analyze your website&apos;s performance, measure Core Web Vitals, and get actionable recommendations to improve speed and user experience
          </p>
        </div>

        <PerformanceProfilerClient />

        {/* SEO Content */}
        <section className="mt-12 space-y-6">
          <div>
            <h2 className="mb-4 text-2xl font-bold">About Website Performance</h2>
            <p className="text-muted-foreground">
              Website performance directly impacts user experience, conversion rates, and search engine rankings.
              Fast-loading websites keep visitors engaged and improve business outcomes. Our performance profiler
              analyzes key metrics and provides specific recommendations for optimization.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-semibold">Core Web Vitals</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-blue-600">Largest Contentful Paint (LCP)</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Measures loading performance. Should occur within 2.5 seconds.
                </p>
                <div className="text-xs text-muted-foreground">
                  <strong>Good:</strong> ≤2.5s<br />
                  <strong>Needs work:</strong> 2.5-4s<br />
                  <strong>Poor:</strong> &gt;4s
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-green-600">First Input Delay (FID)</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Measures interactivity. Should be less than 100 milliseconds.
                </p>
                <div className="text-xs text-muted-foreground">
                  <strong>Good:</strong> ≤100ms<br />
                  <strong>Needs work:</strong> 100-300ms<br />
                  <strong>Poor:</strong> &gt;300ms
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-purple-600">Cumulative Layout Shift (CLS)</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Measures visual stability. Should be less than 0.1.
                </p>
                <div className="text-xs text-muted-foreground">
                  <strong>Good:</strong> ≤0.1<br />
                  <strong>Needs work:</strong> 0.1-0.25<br />
                  <strong>Poor:</strong> &gt;0.25
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-semibold">Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Loading Metrics</h4>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li><strong>First Contentful Paint (FCP):</strong> First content appears</li>
                  <li><strong>Largest Contentful Paint (LCP):</strong> Main content loads</li>
                  <li><strong>Time to Interactive (TTI):</strong> Page becomes fully interactive</li>
                  <li><strong>Total Blocking Time (TBT):</strong> Time spent blocking interactions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Resource Metrics</h4>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li><strong>Total Requests:</strong> Number of HTTP requests</li>
                  <li><strong>Total Size:</strong> Combined size of all resources</li>
                  <li><strong>Resource Timing:</strong> Load time for each asset</li>
                  <li><strong>Cache Efficiency:</strong> How well resources are cached</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-semibold">Performance Optimization Areas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">🚀 Code Optimization</h4>
                <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground">
                  <li>Minify CSS/JavaScript</li>
                  <li>Remove unused code</li>
                  <li>Use code splitting</li>
                  <li>Enable compression</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">🖼️ Image Optimization</h4>
                <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground">
                  <li>Compress images</li>
                  <li>Use modern formats</li>
                  <li>Implement lazy loading</li>
                  <li>Responsive images</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">🌐 Network Optimization</h4>
                <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground">
                  <li>Use HTTP/2 or HTTP/3</li>
                  <li>Implement caching</li>
                  <li>CDN deployment</li>
                  <li>Resource hints</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">⚡ Rendering Optimization</h4>
                <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground">
                  <li>Eliminate render blocking</li>
                  <li>Optimize fonts</li>
                  <li>Reduce layout shifts</li>
                  <li>Critical CSS</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">💾 Browser Optimization</h4>
                <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground">
                  <li>Service workers</li>
                  <li>Progressive loading</li>
                  <li>Bundle analysis</li>
                  <li>Memory management</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">📊 Monitoring</h4>
                <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground">
                  <li>Real user monitoring</li>
                  <li>Performance budgets</li>
                  <li>Automated testing</li>
                  <li>Continuous monitoring</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-semibold">Performance Impact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">User Experience</h4>
                <p className="text-sm text-muted-foreground">
                  Slow websites frustrate users and increase bounce rates. Studies show that 53% of mobile users
                  abandon sites that take longer than 3 seconds to load. Fast sites improve user satisfaction and engagement.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Business Impact</h4>
                <p className="text-sm text-muted-foreground">
                  Performance directly affects revenue. Amazon found that every 100ms of latency cost them 1% in sales.
                  Google research shows that faster sites have higher conversion rates and better user retention.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">SEO Benefits</h4>
                <p className="text-sm text-muted-foreground">
                  Page speed is a confirmed ranking factor in Google&apos;s algorithm. Core Web Vitals are part of
                  the page experience signals that influence search rankings. Fast sites rank better in search results.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Mobile Performance</h4>
                <p className="text-sm text-muted-foreground">
                  Mobile users expect fast experiences. With 60% of Google searches coming from mobile devices,
                  optimizing for mobile performance is crucial for reaching and retaining mobile audiences.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-semibold">Testing Best Practices</h3>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li><strong>Test on real devices:</strong> Use actual devices for accurate performance measurements</li>
              <li><strong>Consider network conditions:</strong> Test on various connection speeds (3G, 4G, 5G)</li>
              <li><strong>Monitor over time:</strong> Performance can vary based on server load and caching</li>
              <li><strong>Use multiple tools:</strong> Combine automated testing with real user monitoring</li>
              <li><strong>Set performance budgets:</strong> Define acceptable limits for key metrics</li>
              <li><strong>Continuous monitoring:</strong> Regularly test and monitor performance changes</li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}