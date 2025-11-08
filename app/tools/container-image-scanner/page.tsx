import type { Metadata } from "next";
import ContainerImageScannerClient from "@/components/tools/container-image-scanner-client";

export const metadata: Metadata = {
  title: "Container Image Scanner - Vulnerability & Provenance Scanner | Malti Tool Platform",
  description: "Scan container images for vulnerabilities, generate provenance reports, check base image layers, and ensure supply chain security. Supports Docker, OCI, and container registries.",
  keywords: [
    "container scanner",
    "docker security",
    "vulnerability scan",
    "image provenance",
    "container security",
    "CVE scanner",
    "docker image scanner",
    "OCI images",
    "supply chain security",
    "SBOM",
    "container compliance",
    "image layers"
  ],
  openGraph: {
    title: "Container Image Scanner - Vulnerability & Provenance Scanner",
    description: "Scan container images for vulnerabilities and generate provenance reports.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Container Image Scanner",
    description: "Security scanning and provenance reports for container images.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const features = [
  {
    title: "Vulnerability Scanning",
    description: "Detect CVEs and security vulnerabilities in container images with severity ratings and remediation guidance.",
  },
  {
    title: "Provenance Reports",
    description: "Generate detailed provenance reports showing image history, build process, and supply chain metadata.",
  },
  {
    title: "Layer Analysis",
    description: "Inspect individual image layers to identify bloat, unnecessary packages, and security risks.",
  },
  {
    title: "Base Image Detection",
    description: "Identify base images and check for outdated or vulnerable parent images.",
  },
  {
    title: "SBOM Generation",
    description: "Create Software Bill of Materials (SBOM) listing all packages and dependencies in the image.",
  },
  {
    title: "Compliance Checking",
    description: "Verify images against security policies, CIS benchmarks, and regulatory requirements.",
  },
];

export default function ContainerImageScannerPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Container Image Scanner
          </h1>
          <p className="text-xl text-muted-foreground">
            Scan container images for vulnerabilities and generate comprehensive provenance reports.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              Security Scanning
            </span>
            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              Provenance
            </span>
            <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
              CVE Detection
            </span>
            <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
              SBOM
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
              <h3 className="text-lg font-semibold mb-2">1. Specify Container Image</h3>
              <p className="text-muted-foreground">
                Enter image name with tag (e.g., nginx:latest, ubuntu:22.04) or upload a Docker image tarball for offline scanning.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">2. Run Security Scan</h3>
              <p className="text-muted-foreground">
                Execute vulnerability scan to detect CVEs, misconfigurations, and security issues. View results with severity ratings.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">3. Generate Provenance</h3>
              <p className="text-muted-foreground">
                Create provenance reports showing image build history, layers, base images, and supply chain metadata for compliance.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">4. Review & Export</h3>
              <p className="text-muted-foreground">
                Review scan results, download SBOM reports, and export findings in JSON, PDF, or SARIF format for CI/CD integration.
              </p>
            </div>
          </div>
        </div>

        <ContainerImageScannerClient />

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">What registries are supported?</h3>
              <p className="text-muted-foreground">
                The scanner supports Docker Hub, AWS ECR, Google GCR, Azure ACR, GitHub Container Registry, and private registries with authentication.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How are vulnerabilities detected?</h3>
              <p className="text-muted-foreground">
                We use CVE databases (NVD, GitHub Advisory) and package managers to identify known vulnerabilities in OS packages and application dependencies.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What is image provenance?</h3>
              <p className="text-muted-foreground">
                Provenance is a verifiable record of where and how an image was built, including source code, build environment, and dependencies - crucial for supply chain security.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Can I scan private images?</h3>
              <p className="text-muted-foreground">
                Yes, provide registry credentials or upload image tarballs. Credentials are used only for the scan and never stored permanently.
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
            "name": "Container Image Scanner",
            "description": "Vulnerability scanning and provenance reports for container images",
            "applicationCategory": "DeveloperApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "Vulnerability scanning",
              "Provenance reports",
              "Layer analysis",
              "Base image detection",
              "SBOM generation",
              "Compliance checking"
            ]
          })
        }}
      />
    </div>
  );
}
