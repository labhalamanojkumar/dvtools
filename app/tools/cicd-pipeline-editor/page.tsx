import { Metadata } from "next";
import CICDPipelineEditorClient from "@/components/tools/cicd-pipeline-editor-client";

export const metadata: Metadata = {
  title: "CI/CD Pipeline Editor - Pipeline Visualization & Management Tool | Malti Tool Platform",
  description: "Visual CI/CD pipeline editor supporting GitLab CI, GitHub Actions, and Jenkins. Edit pipelines, view run history, explore job artifacts, and debug build failures with comprehensive pipeline management tools.",
  keywords: [
    "cicd pipeline",
    "gitlab ci",
    "github actions",
    "jenkins pipeline",
    "pipeline editor",
    "build automation",
    "deployment pipeline",
    "pipeline visualization",
    "job artifacts",
    "build history",
    "continuous integration",
    "devops automation"
  ],
  openGraph: {
    title: "CI/CD Pipeline Editor - Visual Pipeline Management",
    description: "Edit, visualize, and manage CI/CD pipelines with support for GitLab CI, GitHub Actions, and Jenkins",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "CI/CD Pipeline Editor",
  description: "Comprehensive CI/CD pipeline editor with visualization, run history, and artifact exploration for GitLab CI, GitHub Actions, and Jenkins",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Pipeline Visualization",
    "YAML Editor",
    "Run History",
    "Job Artifacts Explorer",
    "Multi-Platform Support",
    "Syntax Validation"
  ],
};

export default function CICDPipelineEditorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">CI/CD Pipeline Editor</h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Visualize, edit, and manage CI/CD pipelines with support for GitLab CI, GitHub Actions, and Jenkins. 
              View run history, explore job artifacts, and debug build failures with comprehensive pipeline management tools.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg space-y-2">
              <h3 className="font-semibold text-lg">Pipeline Visualization</h3>
              <p className="text-sm text-muted-foreground">
                Visual flowchart representation of your CI/CD pipeline stages, jobs, and dependencies
              </p>
            </div>
            <div className="p-6 border rounded-lg space-y-2">
              <h3 className="font-semibold text-lg">YAML Editor</h3>
              <p className="text-sm text-muted-foreground">
                Edit pipeline configuration with syntax highlighting, validation, and auto-completion
              </p>
            </div>
            <div className="p-6 border rounded-lg space-y-2">
              <h3 className="font-semibold text-lg">Run History</h3>
              <p className="text-sm text-muted-foreground">
                View complete pipeline execution history with success rates and duration analytics
              </p>
            </div>
            <div className="p-6 border rounded-lg space-y-2">
              <h3 className="font-semibold text-lg">Job Artifacts</h3>
              <p className="text-sm text-muted-foreground">
                Browse and download build artifacts, test reports, and deployment packages
              </p>
            </div>
            <div className="p-6 border rounded-lg space-y-2">
              <h3 className="font-semibold text-lg">Multi-Platform Support</h3>
              <p className="text-sm text-muted-foreground">
                Works with GitLab CI, GitHub Actions, Jenkins, and other popular CI/CD platforms
              </p>
            </div>
            <div className="p-6 border rounded-lg space-y-2">
              <h3 className="font-semibold text-lg">Error Debugging</h3>
              <p className="text-sm text-muted-foreground">
                Quick access to job logs and error messages for faster troubleshooting
              </p>
            </div>
          </div>

          {/* Main Tool */}
          <CICDPipelineEditorClient />

          {/* Usage Guide */}
          <div className="space-y-6 pt-8 border-t">
            <h2 className="text-2xl font-semibold">How to Use the CI/CD Pipeline Editor</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1. Load Your Pipeline</h3>
                <p className="text-muted-foreground">
                  Upload your pipeline configuration file (.gitlab-ci.yml, .github/workflows/*.yml, or Jenkinsfile) 
                  or select from recent pipelines. The editor supports all major CI/CD platforms.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">2. Edit and Validate</h3>
                <p className="text-muted-foreground">
                  Use the YAML editor to modify your pipeline configuration. Real-time syntax validation helps catch 
                  errors before committing. The visual diagram updates automatically to reflect changes.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. Review Run History</h3>
                <p className="text-muted-foreground">
                  Analyze previous pipeline runs to identify patterns, bottlenecks, and failure trends. View detailed 
                  logs for each job and stage to debug issues quickly.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">4. Manage Artifacts</h3>
                <p className="text-muted-foreground">
                  Browse and download build artifacts, test reports, coverage data, and deployment packages. Keep track 
                  of artifact sizes and retention policies.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="space-y-6 pt-8 border-t">
            <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Which CI/CD platforms are supported?</h3>
                <p className="text-muted-foreground">
                  The editor supports GitLab CI (.gitlab-ci.yml), GitHub Actions (.github/workflows/*.yml), Jenkins 
                  (Jenkinsfile), CircleCI, Travis CI, and Azure Pipelines. Each platform's specific syntax and 
                  features are fully supported.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Can I edit pipelines directly in the browser?</h3>
                <p className="text-muted-foreground">
                  Yes! The built-in YAML editor provides syntax highlighting, validation, and auto-completion. Changes 
                  can be downloaded or committed directly to your repository (requires authentication).
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">How do I access pipeline run history?</h3>
                <p className="text-muted-foreground">
                  Connect your CI/CD platform via API token to fetch pipeline run history, job logs, and artifacts. 
                  The tool displays execution timelines, success rates, and performance metrics.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Are job artifacts stored in this tool?</h3>
                <p className="text-muted-foreground">
                  No, artifacts remain in your CI/CD platform's storage. The tool provides a unified interface to 
                  browse and download artifacts from multiple platforms without storing them locally.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
