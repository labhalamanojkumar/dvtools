import { Metadata } from "next";
import DevTunnelerClient from "@/components/tools/dev-tunneler-client";
import { SHARED_METADATA } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dev Tunneler - Local Development Tunneling | Multi-Tool Platform",
  description: "Professional development tunneling tool for exposing local servers. Support for ngrok, Cloudflare Tunnel, LocalTunnel, and more with custom domains, authentication, and monitoring.",
  keywords: [
    "dev tunneling",
    "ngrok alternative",
    "local development",
    "tunnel localhost",
    "cloudflare tunnel",
    "localtunnel",
    "development server",
    "expose local port",
    "webhook testing",
    "API testing",
    "development tools",
    "tunnel service",
    "local server",
    "port forwarding",
    "secure tunneling",
    "development proxy",
    "web development",
    "backend development",
    "testing tools",
    "development workflow"
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://multi-tool-platform.com"),
  alternates: {
    canonical: "/tools/dev-tunneler",
  },
  openGraph: {
    title: "Dev Tunneler - Local Development Tunneling",
    description: "Expose your local development servers securely with professional tunneling tools and custom domains.",
    url: "/tools/dev-tunneler",
    siteName: "Multi Tool Platform",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-dev-tunneler.png",
        width: 1200,
        height: 630,
        alt: "Dev Tunneler Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dev Tunneler - Local Development Tunneling",
    description: "Professional tunneling tool for exposing local development servers with custom domains and security.",
    images: ["/og-dev-tunneler.png"],
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

export default function DevTunnelerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Dev Tunneler",
    "description": "Professional development tunneling tool for exposing local servers. Support for ngrok, Cloudflare Tunnel, LocalTunnel, and more with custom domains, authentication, and monitoring.",
    "url": "https://multi-tool-platform.com/tools/dev-tunneler",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "Multiple tunneling providers (ngrok, Cloudflare, LocalTunnel)",
      "Custom domain support and SSL certificates",
      "Authentication and access control",
      "Traffic monitoring and analytics",
      "Webhook and API endpoint testing",
      "Secure HTTPS tunnels for local development",
      "Port forwarding and reverse proxy",
      "Team collaboration and sharing",
      "Request/response inspection and logging",
      "Integration with popular frameworks and tools"
    ],
    "screenshot": "/og-dev-tunneler.png",
    "author": {
      "@type": "Organization",
      "name": "Multi-Tool Platform",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Multi-Tool Platform",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
              Dev Tunneler
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Professional development tunneling tool for exposing local servers. Support for ngrok, Cloudflare Tunnel,
              LocalTunnel, and more with custom domains, authentication, and monitoring.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                ngrok
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Cloudflare
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                LocalTunnel
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                Custom Domains
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                HTTPS Secure
              </span>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Multiple Providers</h3>
              <p className="text-muted-foreground">
                Support for popular tunneling services including ngrok, Cloudflare Tunnel, LocalTunnel,
                and Serveo with automatic provider switching.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure HTTPS</h3>
              <p className="text-muted-foreground">
                Automatic SSL certificate generation and HTTPS encryption for all tunnels.
                Secure communication between local servers and external clients.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-1.657 0-3-1.343-3-3s1.343-3 3-3m0-9c1.657 0 3 1.343 3 3s-1.343 3-3 3m-9 9a9 9 0 01-9-9m9 9c-1.657 0-3-1.343-3-3s1.343-3 3-3m0-9c-1.657 0-3 1.343-3 3s1.343 3-3 3" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Custom Domains</h3>
              <p className="text-muted-foreground">
                Use your own custom domains with automatic DNS configuration and SSL certificate management.
                Professional branding for your development projects.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Authentication</h3>
              <p className="text-muted-foreground">
                Built-in authentication and access control. Protect your development endpoints with passwords,
                API keys, or IP whitelisting.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Traffic Monitoring</h3>
              <p className="text-muted-foreground">
                Real-time traffic monitoring and analytics. Track requests, response times, and error rates
                for your tunneled applications.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Webhook Testing</h3>
              <p className="text-muted-foreground">
                Perfect for testing webhooks and API integrations. Receive webhooks from external services
                and forward them to your local development server.
              </p>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-card rounded-lg p-8 border mb-12">
            <h2 className="text-2xl font-bold mb-6">How to Use Dev Tunneler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">1. Configure Tunnel</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Select tunneling provider (ngrok, Cloudflare, etc.)</li>
                  <li>• Specify local port and protocol (HTTP/HTTPS/TCP)</li>
                  <li>• Configure authentication and access control</li>
                  <li>• Set up custom domain (optional)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">2. Start Tunneling</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Click start to create the tunnel</li>
                  <li>• Get the public URL for your local server</li>
                  <li>• Monitor tunnel status and traffic</li>
                  <li>• Share the URL with team members or clients</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">3. Monitor & Debug</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• View real-time request logs</li>
                  <li>• Monitor response times and error rates</li>
                  <li>• Inspect request/response headers</li>
                  <li>• Debug webhook payloads and API calls</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">4. Manage Tunnels</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Save tunnel configurations for reuse</li>
                  <li>• Start/stop tunnels with one click</li>
                  <li>• View tunnel history and analytics</li>
                  <li>• Clean up unused tunnels</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Dev Tunneler Component */}
          <DevTunnelerClient />

          {/* FAQ Section */}
          <div className="bg-card rounded-lg p-8 border mt-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What tunneling providers are supported?</h3>
                <p className="text-muted-foreground">
                  Dev Tunneler supports ngrok, Cloudflare Tunnel, LocalTunnel, Serveo, and localhost.run.
                  Each provider has different features and limitations, with automatic fallback options.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Do I need API keys for each provider?</h3>
                <p className="text-muted-foreground">
                  Some providers like ngrok and Cloudflare require API keys for advanced features, but basic tunneling
                  works without authentication. The tool guides you through the setup process for each provider.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I use custom domains?</h3>
                <p className="text-muted-foreground">
                  Yes, you can configure custom domains with automatic DNS setup and SSL certificate provisioning.
                  This is particularly useful for branded development environments and client demonstrations.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Is the tunneling secure?</h3>
                <p className="text-muted-foreground">
                  All tunnels use HTTPS encryption by default. You can add additional authentication layers including
                  passwords, API keys, and IP restrictions to further secure your development endpoints.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I monitor traffic through the tunnel?</h3>
                <p className="text-muted-foreground">
                  Yes, the tool provides real-time traffic monitoring including request/response logs, response times,
                  error rates, and detailed analytics. You can inspect headers, payloads, and debug issues.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}