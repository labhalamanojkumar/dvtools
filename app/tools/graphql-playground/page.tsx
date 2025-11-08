import type { Metadata } from "next";
import GraphQLPlaygroundClient from "@/components/tools/graphql-playground-client";

export const metadata: Metadata = {
  title: "GraphQL Playground - GraphQL Query Editor & Explorer | Malti Tool Platform",
  description: "Explore GraphQL schemas, test queries and mutations, view documentation, and trace performance. Complete GraphQL development environment in your browser.",
  keywords: [
    "GraphQL playground",
    "GraphQL editor",
    "GraphQL query",
    "GraphQL mutation",
    "schema explorer",
    "GraphQL testing",
    "GraphQL introspection",
    "query builder",
    "GraphQL documentation",
    "performance tracing",
    "GraphQL IDE",
    "API testing"
  ],
  openGraph: {
    title: "GraphQL Playground - GraphQL Query Editor & Explorer",
    description: "Explore GraphQL schemas, test queries, and trace performance in a complete GraphQL development environment.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GraphQL Playground",
    description: "Complete GraphQL development environment with schema exploration and performance tracing.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const features = [
  {
    title: "Schema Explorer",
    description: "Browse and search GraphQL schema types, queries, mutations, and subscriptions with auto-documentation.",
  },
  {
    title: "Query Editor",
    description: "Write queries with syntax highlighting, auto-completion, and validation against schema.",
  },
  {
    title: "Variables & Headers",
    description: "Configure query variables and custom HTTP headers for authentication and testing.",
  },
  {
    title: "Response Viewer",
    description: "View formatted JSON responses with collapsible sections and error highlighting.",
  },
  {
    title: "Performance Tracing",
    description: "Analyze query execution time, resolver performance, and identify bottlenecks.",
  },
  {
    title: "Query History",
    description: "Save and recall previous queries with automatic history tracking.",
  },
];

export default function GraphQLPlaygroundPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            GraphQL Playground
          </h1>
          <p className="text-xl text-muted-foreground">
            Explore schemas, test queries, and trace performance in a complete GraphQL development environment.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              Schema Explorer
            </span>
            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              Query Editor
            </span>
            <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
              Performance Tracing
            </span>
            <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
              Auto-complete
            </span>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg border bg-background p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">How to Use</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">1. Connect to GraphQL Endpoint</h3>
              <p className="text-muted-foreground">
                Enter your GraphQL endpoint URL and configure authentication headers if needed. The playground will fetch the schema via introspection.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">2. Write Queries</h3>
              <p className="text-muted-foreground">
                Use the query editor with syntax highlighting and auto-completion. Press Ctrl+Space to see available fields and types from your schema.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">3. Configure Variables</h3>
              <p className="text-muted-foreground">
                Define query variables in JSON format and customize HTTP headers for authentication tokens, API keys, or custom headers.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">4. Execute & Analyze</h3>
              <p className="text-muted-foreground">
                Execute queries and view formatted responses. Enable performance tracing to analyze query execution time and identify slow resolvers.
              </p>
            </div>
          </div>
        </div>

        <GraphQLPlaygroundClient />

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Does this support subscriptions?</h3>
              <p className="text-muted-foreground">
                Currently, the playground supports queries and mutations. WebSocket-based subscription support is planned for a future release.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How does schema introspection work?</h3>
              <p className="text-muted-foreground">
                The playground sends an introspection query to your GraphQL endpoint to fetch the complete schema, including types, queries, mutations, and descriptions.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Can I save my queries?</h3>
              <p className="text-muted-foreground">
                Yes, queries are automatically saved in your browser's local storage. You can also export query collections as JSON files.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Is my data secure?</h3>
              <p className="text-muted-foreground">
                All GraphQL requests are made directly from your browser to your endpoint. We don't store or proxy any query data or responses.
              </p>
            </div>
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "GraphQL Playground",
            "description": "Explore GraphQL schemas, test queries, and trace performance",
            "applicationCategory": "DeveloperApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "GraphQL schema exploration",
              "Query editor with auto-completion",
              "Variables and headers configuration",
              "Response viewer with formatting",
              "Performance tracing",
              "Query history tracking"
            ]
          })
        }}
      />
    </div>
  );
}
