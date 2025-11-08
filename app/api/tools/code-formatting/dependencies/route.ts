import { NextRequest, NextResponse } from "next/server";

interface DependencyRequest {
  packageJson: any;
}

interface DependencyInfo {
  name: string;
  current: string;
  latest: string;
  type: "major" | "minor" | "patch";
  vulnerable?: boolean;
  severity?: "low" | "moderate" | "high" | "critical";
}

interface VulnerabilityInfo {
  package: string;
  severity: "low" | "moderate" | "high" | "critical";
  title: string;
  url?: string;
  vulnerable_versions: string;
  patched_versions: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: DependencyRequest = await request.json();
    const { packageJson } = body;

    if (!packageJson || !packageJson.dependencies) {
      return NextResponse.json(
        { error: "Valid package.json with dependencies is required" },
        { status: 400 }
      );
    }

    const dependencies = await scanDependencies(packageJson.dependencies);
    const vulnerabilities = await scanVulnerabilities(packageJson.dependencies);

    return NextResponse.json({
      success: true,
      dependencies,
      vulnerabilities,
    });

  } catch (error: any) {
    console.error("Dependencies scan error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

async function scanDependencies(deps: Record<string, string>): Promise<DependencyInfo[]> {
  const results: DependencyInfo[] = [];

  for (const [name, version] of Object.entries(deps)) {
    try {
      // Mock dependency scanning - in production, you'd use npm registry API
      const mockLatestVersions: Record<string, string> = {
        "react": "18.2.0",
        "next": "14.0.0",
        "express": "4.18.2",
        "lodash": "4.17.21",
        "axios": "1.6.0",
        "typescript": "5.3.0",
        "eslint": "8.55.0",
        "@types/node": "20.10.0",
        "tailwindcss": "3.3.6",
        "prisma": "5.6.0",
      };

      const currentVersion = version.replace(/[\^~]/g, "");
      const latestVersion = mockLatestVersions[name] || currentVersion;

      const currentParts = currentVersion.split(".").map(Number);
      const latestParts = latestVersion.split(".").map(Number);

      let type: "major" | "minor" | "patch" = "patch";

      if (latestParts[0] > currentParts[0]) {
        type = "major";
      } else if (latestParts[1] > currentParts[1]) {
        type = "minor";
      }

      results.push({
        name,
        current: currentVersion,
        latest: latestVersion,
        type,
        vulnerable: Math.random() > 0.7, // Mock vulnerability flag
      });

    } catch (error) {
      // Skip problematic dependencies
      continue;
    }
  }

  return results;
}

async function scanVulnerabilities(deps: Record<string, string>): Promise<VulnerabilityInfo[]> {
  const vulnerabilities: VulnerabilityInfo[] = [];

  // Mock vulnerabilities - in production, you'd use npm audit or Snyk API
  const mockVulnerabilities: Record<string, VulnerabilityInfo> = {
    "lodash": {
      package: "lodash",
      severity: "high",
      title: "Prototype Pollution in lodash",
      url: "https://nvd.nist.gov/vuln/detail/CVE-2021-23337",
      vulnerable_versions: "<4.17.21",
      patched_versions: ">=4.17.21",
    },
    "axios": {
      package: "axios",
      severity: "moderate",
      title: "Server-Side Request Forgery in axios",
      url: "https://nvd.nist.gov/vuln/detail/CVE-2023-45857",
      vulnerable_versions: "<1.6.0",
      patched_versions: ">=1.6.0",
    },
  };

  for (const [name] of Object.entries(deps)) {
    if (mockVulnerabilities[name]) {
      vulnerabilities.push(mockVulnerabilities[name]);
    }
  }

  return vulnerabilities;
}