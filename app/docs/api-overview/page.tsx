import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Zap,
  Shield,
  Key,
  Clock,
  Code,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "API Overview | DvTools Documentation",
  description: "Complete API reference for DvTools. Learn about authentication, endpoints, rate limits, and integration options.",
  keywords: ["API", "documentation", "endpoints", "authentication", "integration"],
  openGraph: {
    title: "API Overview | DvTools Documentation",
    description: "Complete API reference for DvTools. Learn about authentication, endpoints, rate limits, and integration options.",
    type: "article",
    url: "/docs/api-overview",
    siteName: "DvTools",
  },
  twitter: {
    card: "summary_large_image",
    title: "API Overview | DvTools Documentation",
    description: "Complete API reference for DvTools. Learn about authentication, endpoints, rate limits, and integration options.",
  },
  alternates: {
    canonical: "/docs/api-overview",
  },
};

const apiEndpoints = [
  {
    method: "POST",
    path: "/api/tools/json",
    description: "Format and validate JSON data",
    auth: false,
    rateLimit: "100/hour",
  },
  {
    method: "POST",
    path: "/api/tools/base64",
    description: "Encode/decode Base64 strings",
    auth: false,
    rateLimit: "100/hour",
  },
  {
    method: "POST",
    path: "/api/tools/jwt",
    description: "Decode and validate JWT tokens",
    auth: false,
    rateLimit: "50/hour",
  },
  {
    method: "POST",
    path: "/api/tools/url",
    description: "Encode/decode URLs",
    auth: false,
    rateLimit: "100/hour",
  },
  {
    method: "POST",
    path: "/api/tools/regexp",
    description: "Test regular expressions",
    auth: false,
    rateLimit: "100/hour",
  },
];

const authenticationMethods = [
  {
    name: "API Key",
    description: "Simple API key authentication for higher rate limits",
    pros: ["Easy to implement", "No expiration", "Higher rate limits"],
    cons: ["Less secure", "Harder to rotate"],
    recommended: false,
  },
  {
    name: "OAuth 2.0",
    description: "Industry standard authentication with token refresh",
    pros: ["Secure", "Token refresh", "Granular permissions"],
    cons: ["More complex setup"],
    recommended: true,
  },
  {
    name: "JWT Bearer",
    description: "Use JWT tokens for API authentication",
    pros: ["Stateless", "Self-contained", "Industry standard"],
    cons: ["Token management required"],
    recommended: true,
  },
];

export default function APIOverviewPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/docs" className="hover:text-primary">
              Docs
            </Link>
          </li>
          <li>/</li>
          <li className="text-foreground font-medium">API Overview</li>
        </ol>
      </nav>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline: "DvTools API Overview",
            description: "Complete API reference for DvTools developer tools platform",
            url: "https://devtoolshub.com/docs/api-overview",
            publisher: {
              "@type": "Organization",
              name: "DvTools",
            },
          }),
        }}
      />

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <header className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              API Overview
            </h1>
            <p className="text-xl text-muted-foreground">
              Integrate DvTools into your applications with our comprehensive REST API.
              Access all tools programmatically with authentication, rate limiting, and detailed responses.
            </p>
          </header>

          {/* Base URL */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Base URL
              </CardTitle>
            </CardHeader>
            <CardContent>
              <code className="bg-muted px-3 py-2 rounded text-sm block">
                https://api.devtoolshub.com/v1
              </code>
              <p className="text-sm text-muted-foreground mt-2">
                All API endpoints are prefixed with the base URL above.
              </p>
            </CardContent>
          </Card>

          {/* Authentication */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Authentication</h2>

            <Tabs defaultValue="oauth" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="oauth">OAuth 2.0</TabsTrigger>
                <TabsTrigger value="jwt">JWT Bearer</TabsTrigger>
                <TabsTrigger value="api-key">API Key</TabsTrigger>
              </TabsList>

              {authenticationMethods.map((method) => (
                <TabsContent key={method.name.toLowerCase().replace(" ", "-")} value={method.name.toLowerCase().replace(" ", "-")}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        {method.name}
                        {method.recommended && (
                          <Badge variant="secondary">Recommended</Badge>
                        )}
                      </CardTitle>
                      <p className="text-muted-foreground">{method.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-green-600 mb-2">Pros</h4>
                          <ul className="space-y-1">
                            {method.pros.map((pro, index) => (
                              <li key={index} className="text-sm flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-red-600 mb-2">Cons</h4>
                          <ul className="space-y-1">
                            {method.cons.map((con, index) => (
                              <li key={index} className="text-sm flex items-center gap-2">
                                <AlertTriangle className="h-3 w-3 text-red-600" />
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </section>

          {/* API Endpoints */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">API Endpoints</h2>

            <div className="space-y-4">
              {apiEndpoints.map((endpoint, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge
                            variant={endpoint.method === "GET" ? "secondary" : "default"}
                            className={
                              endpoint.method === "POST"
                                ? "bg-green-600 hover:bg-green-700"
                                : endpoint.method === "PUT"
                                ? "bg-blue-600 hover:bg-blue-700"
                                : endpoint.method === "DELETE"
                                ? "bg-red-600 hover:bg-red-700"
                                : ""
                            }
                          >
                            {endpoint.method}
                          </Badge>
                          <code className="text-sm font-mono">{endpoint.path}</code>
                        </div>
                        <p className="text-muted-foreground mb-3">{endpoint.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Shield className="h-4 w-4" />
                            {endpoint.auth ? "Requires Auth" : "No Auth Required"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {endpoint.rateLimit}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Docs
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Rate Limiting */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Rate Limiting</h2>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Rate Limits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-primary">100</div>
                      <div className="text-sm text-muted-foreground">Requests/hour</div>
                      <div className="text-xs">Anonymous users</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-primary">1000</div>
                      <div className="text-sm text-muted-foreground">Requests/hour</div>
                      <div className="text-xs">Authenticated users</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-primary">10000</div>
                      <div className="text-sm text-muted-foreground">Requests/hour</div>
                      <div className="text-xs">Enterprise plans</div>
                    </div>
                  </div>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Rate limits are enforced per IP address for anonymous requests and per API key for authenticated requests.
                      When you exceed the limit, you'll receive a 429 (Too Many Requests) response with a Retry-After header.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Error Handling */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Error Handling</h2>

            <Card>
              <CardHeader>
                <CardTitle>HTTP Status Codes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">200</Badge>
                      <span>Success</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Request processed successfully</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <Badge variant="destructive">400</Badge>
                      <span>Bad Request</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Invalid request parameters</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <Badge variant="destructive">401</Badge>
                      <span>Unauthorized</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Authentication required</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <Badge variant="destructive">429</Badge>
                      <span>Too Many Requests</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Rate limit exceeded</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <Badge variant="destructive">500</Badge>
                      <span>Internal Server Error</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Server-side error</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* SDKs */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">SDKs & Libraries</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    JavaScript/TypeScript
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Official SDK for Node.js, browsers, and React applications.
                  </p>
                  <Button asChild>
                    <Link href="https://github.com/dvtools/js-sdk" target="_blank">
                      View on GitHub
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Python
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Python SDK for data science, automation, and backend services.
                  </p>
                  <Button asChild>
                    <Link href="https://github.com/dvtools/python-sdk" target="_blank">
                      View on GitHub
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" asChild>
                  <Link href="/tools">
                    Try Tools
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/docs/api-endpoints">
                    API Endpoints
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/docs/api-limits">
                    Rate Limits
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* API Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">API Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">All systems operational</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Uptime: 99.9% (30 days)
                </p>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/docs/faq">
                    API FAQ
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/docs/support">
                    Developer Support
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}