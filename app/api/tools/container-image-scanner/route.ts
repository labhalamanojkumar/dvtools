import { NextRequest, NextResponse } from "next/server";

interface Vulnerability {
  id: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  package: string;
  version: string;
  fixedVersion?: string;
  description: string;
  cvssScore: number;
  publishedDate: string;
  references: string[];
}

interface ScanResult {
  imageName: string;
  scanId: string;
  status: "completed" | "in-progress" | "failed";
  vulnerabilities: Vulnerability[];
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    total: number;
  };
  scanTime: string;
  complianceIssues: {
    standard: string;
    violations: string[];
  }[];
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Container Image Scanner API",
    description: "Scan Docker container images for vulnerabilities and security issues",
    endpoints: {
      POST: "/api/tools/container-image-scanner"
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, imageName, imageId, complianceStandard = "CIS-Docker" } = body;

    switch (action) {
      case "scan":
        if (!imageName && !imageId) {
          return NextResponse.json({
            success: false,
            error: "Either imageName or imageId is required for scanning"
          }, { status: 400 });
        }

        // Simulate scan processing
        const scanResult: ScanResult = {
          imageName: imageName || `image:${imageId}`,
          scanId: `scan-${Date.now()}`,
          status: "completed",
          vulnerabilities: [
            {
              id: "CVE-2023-12345",
              severity: "CRITICAL",
              package: "openssl",
              version: "1.1.1f",
              fixedVersion: "1.1.1n",
              description: "OpenSSL 1.1.1f contains a critical buffer overflow vulnerability",
              cvssScore: 9.8,
              publishedDate: "2023-01-15T00:00:00Z",
              references: ["https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2023-12345"]
            },
            {
              id: "CVE-2023-23456",
              severity: "HIGH",
              package: "libcurl",
              version: "7.68.0",
              fixedVersion: "7.87.0",
              description: "libcurl vulnerable to TLS certificate verification bypass",
              cvssScore: 7.5,
              publishedDate: "2023-02-20T00:00:00Z",
              references: ["https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2023-23456"]
            },
            {
              id: "CVE-2023-34567",
              severity: "MEDIUM",
              package: "glibc",
              version: "2.31",
              fixedVersion: "2.35",
              description: "glibc buffer overflow in string processing functions",
              cvssScore: 5.4,
              publishedDate: "2023-03-10T00:00:00Z",
              references: ["https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2023-34567"]
            },
            {
              id: "CVE-2023-45678",
              severity: "LOW",
              package: "ca-certificates",
              version: "20200601",
              fixedVersion: "20230311",
              description: "Outdated CA certificates bundle",
              cvssScore: 3.7,
              publishedDate: "2023-04-05T00:00:00Z",
              references: ["https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2023-45678"]
            }
          ],
          summary: {
            critical: 1,
            high: 1,
            medium: 1,
            low: 1,
            total: 4
          },
          scanTime: new Date().toISOString(),
          complianceIssues: [
            {
              standard: "CIS Docker Benchmark",
              violations: [
                "Container should not run as root user",
                "Container should have a non-root user",
                "Container should restrict Linux capabilities"
              ]
            },
            {
              standard: "Docker Security Best Practices",
              violations: [
                "Image should not use 'latest' tag",
                "Container should define healthcheck"
              ]
            }
          ]
        };

        return NextResponse.json({
          success: true,
          result: scanResult
        });

      case "get-scan-status":
        const { scanId: statusId } = body;
        if (!statusId) {
          return NextResponse.json({
            success: false,
            error: "scanId is required for status check"
          }, { status: 400 });
        }

        return NextResponse.json({
          success: true,
          status: "completed",
          scanId: statusId,
          progress: 100,
          estimatedCompletionTime: new Date().toISOString()
        });

      case "list-images":
        return NextResponse.json({
          success: true,
          images: [
            {
              id: "sha256:abc123",
              name: "nginx:latest",
              size: "145MB",
              created: "2024-01-10T00:00:00Z",
              lastScan: "2024-01-15T10:30:00Z",
              vulnerabilities: { critical: 0, high: 1, medium: 2, low: 3 }
            },
            {
              id: "sha256:def456",
              name: "redis:alpine",
              size: "32MB",
              created: "2024-01-12T00:00:00Z",
              lastScan: "2024-01-15T11:45:00Z",
              vulnerabilities: { critical: 0, high: 0, medium: 1, low: 2 }
            },
            {
              id: "sha256:ghi789",
              name: "python:3.9-slim",
              size: "124MB",
              created: "2024-01-08T00:00:00Z",
              lastScan: null,
              vulnerabilities: null
            }
          ]
        });

      case "compliance-check":
        const { standard = complianceStandard } = body;
        const complianceResults = {
          standard,
          score: 75,
          passedChecks: [
            "Image built from official base image",
            "Image has a maintainer label",
            "Image doesn't expose unnecessary ports",
            "Image uses specific version tags"
          ],
          failedChecks: [
            "Container runs as root user",
            "No user defined in Dockerfile",
            "Missing healthcheck instruction"
          ],
          recommendations: [
            "Add USER instruction to Dockerfile",
            "Create non-root user for application",
            "Add healthcheck instruction",
            "Use multi-stage builds to reduce image size"
          ]
        };

        return NextResponse.json({
          success: true,
          compliance: complianceResults
        });

      default:
        return NextResponse.json({
          success: false,
          error: "Invalid action. Supported actions: scan, get-scan-status, list-images, compliance-check"
        }, { status: 400 });
    }

  } catch (error) {
    console.error("Container Image Scanner API error:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error"
    }, { status: 500 });
  }
}
