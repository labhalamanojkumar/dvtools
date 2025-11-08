import type { Metadata } from "next";
import InfrastructureBlueprinkerClient from "@/components/tools/infrastructure-blueprinter-client";

export const metadata: Metadata = {
  title: "Infrastructure Blueprinter - Visual IaC Editor | Malti Tool Platform",
  description: "Visual Infrastructure as Code editor for Terraform with syntax validation, drift detection, resource visualization, and best practices analyzer. Build cloud infrastructure visually.",
  keywords: [
    "infrastructure as code",
    "terraform editor",
    "IaC visual editor",
    "terraform validation",
    "drift detection",
    "cloud infrastructure",
    "terraform blueprints",
    "infrastructure visualization",
    "terraform best practices",
    "IaC templates",
    "cloud automation",
    "terraform syntax"
  ],
  openGraph: {
    title: "Infrastructure Blueprinter - Visual IaC Editor",
    description: "Visual editor for Terraform with drift detection and resource visualization.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Infrastructure Blueprinter",
    description: "Build and validate Terraform infrastructure with visual tools and drift detection.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const features = [
  {
    title: "Visual IaC Editor",
    description: "Edit Terraform configurations with syntax highlighting, auto-completion, and real-time validation.",
  },
  {
    title: "Drift Detection",
    description: "Detect configuration drift between your Terraform state and actual cloud resources.",
  },
  {
    title: "Resource Visualization",
    description: "Visualize infrastructure dependencies and resource relationships in interactive diagrams.",
  },
  {
    title: "Best Practices Analyzer",
    description: "Automated checks for Terraform best practices, security vulnerabilities, and optimization opportunities.",
  },
  {
    title: "Template Library",
    description: "Pre-built Terraform templates for common infrastructure patterns across AWS, Azure, and GCP.",
  },
  {
    title: "State Management",
    description: "Import and analyze Terraform state files to understand current infrastructure configuration.",
  },
];

export default function InfrastructureBlueprinkerPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Infrastructure Blueprinter
          </h1>
          <p className="text-xl text-muted-foreground">
            Visual Infrastructure as Code editor for Terraform with drift detection and resource visualization.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              Terraform
            </span>
            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              Drift Detection
            </span>
            <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
              Visual Editor
            </span>
            <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
              Best Practices
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
              <h3 className="text-lg font-semibold mb-2">1. Upload Terraform Configuration</h3>
              <p className="text-muted-foreground">
                Upload your Terraform .tf files or paste configuration directly. The editor supports HCL syntax highlighting and validation.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">2. Validate & Analyze</h3>
              <p className="text-muted-foreground">
                Run syntax validation and best practices analysis. Get instant feedback on security issues, optimization opportunities, and compliance.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">3. Visualize Resources</h3>
              <p className="text-muted-foreground">
                Generate visual diagrams showing resource dependencies, data flow, and infrastructure topology. Export diagrams for documentation.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">4. Detect Drift</h3>
              <p className="text-muted-foreground">
                Upload or connect to Terraform state to detect configuration drift. See exactly what changed between your code and deployed resources.
              </p>
            </div>
          </div>
        </div>

        <InfrastructureBlueprinkerClient />

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">What Terraform versions are supported?</h3>
              <p className="text-muted-foreground">
                The blueprinter supports Terraform 0.12+ with full HCL2 syntax. We recommend using Terraform 1.0+ for the best experience.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How does drift detection work?</h3>
              <p className="text-muted-foreground">
                Upload your terraform.tfstate file to compare declared resources against actual state. The tool highlights added, modified, and deleted resources.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Can I export visualizations?</h3>
              <p className="text-muted-foreground">
                Yes, you can export infrastructure diagrams as PNG, SVG, or DOT format for documentation and presentations.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Are my Terraform files secure?</h3>
              <p className="text-muted-foreground">
                All files are processed client-side or in temporary memory. We never store your Terraform configurations or state files permanently.
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
            "name": "Infrastructure Blueprinter",
            "description": "Visual IaC editor for Terraform with drift detection",
            "applicationCategory": "DeveloperApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "Visual Terraform editor",
              "Drift detection",
              "Resource visualization",
              "Best practices analyzer",
              "Template library",
              "State management"
            ]
          })
        }}
      />
    </div>
  );
}
