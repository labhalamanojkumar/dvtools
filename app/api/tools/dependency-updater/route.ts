import { NextRequest, NextResponse } from "next/server";

interface Dependency {
  name: string;
  currentVersion: string;
  latestVersion: string;
  type: 'direct' | 'dev' | 'peer' | 'optional';
  isOutdated: boolean;
  severity?: 'low' | 'moderate' | 'high' | 'critical';
  vulnerabilities?: Vulnerability[];
  changelog?: string;
  breakingChanges?: boolean;
}

interface Vulnerability {
  id: string;
  title: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  description: string;
  cvssScore: number;
  affectedVersions: string;
  fixedVersions: string;
  references: string[];
}

interface ScanResult {
  dependencies: Dependency[];
  totalDependencies: number;
  outdatedCount: number;
  vulnerableCount: number;
  scanTime: number;
  packageManager: string;
}

interface ScanRequest {
  action: 'scan';
  packageJson: any;
  packageManager: string;
}

interface UpdateRequest {
  action: 'update';
  packageJson: any;
  packageManager: string;
  dependencies: string[];
  strategy: 'patch' | 'minor' | 'major' | 'latest';
}

type DependencyRequest = ScanRequest | UpdateRequest;

// Mock package registry data - in production, you'd use npm registry API
const MOCK_PACKAGE_DATA: Record<string, { latest: string; vulnerabilities: Vulnerability[] }> = {
  "react": {
    latest: "18.2.0",
    vulnerabilities: []
  },
  "next": {
    latest: "14.0.0",
    vulnerabilities: []
  },
  "express": {
    latest: "4.18.2",
    vulnerabilities: []
  },
  "lodash": {
    latest: "4.17.21",
    vulnerabilities: [{
      id: "CVE-2021-23337",
      title: "Prototype Pollution in lodash",
      severity: "high",
      description: "Prototype pollution vulnerability in lodash utility functions",
      cvssScore: 7.5,
      affectedVersions: "<4.17.21",
      fixedVersions: ">=4.17.21",
      references: ["https://nvd.nist.gov/vuln/detail/CVE-2021-23337"]
    }]
  },
  "axios": {
    latest: "1.6.0",
    vulnerabilities: [{
      id: "CVE-2023-45857",
      title: "Server-Side Request Forgery in axios",
      severity: "moderate",
      description: "Server-Side Request Forgery vulnerability in axios proxy configuration",
      cvssScore: 6.1,
      affectedVersions: "<1.6.0",
      fixedVersions: ">=1.6.0",
      references: ["https://nvd.nist.gov/vuln/detail/CVE-2023-45857"]
    }]
  },
  "typescript": {
    latest: "5.3.0",
    vulnerabilities: []
  },
  "eslint": {
    latest: "8.55.0",
    vulnerabilities: []
  },
  "@types/react": {
    latest: "18.2.0",
    vulnerabilities: []
  },
  "@types/node": {
    latest: "20.10.0",
    vulnerabilities: []
  },
  "tailwindcss": {
    latest: "3.3.6",
    vulnerabilities: []
  },
  "prisma": {
    latest: "5.6.0",
    vulnerabilities: []
  },
  "jest": {
    latest: "29.7.0",
    vulnerabilities: []
  },
  "webpack": {
    latest: "5.89.0",
    vulnerabilities: []
  },
  "babel-core": {
    latest: "7.23.0",
    vulnerabilities: []
  }
};

function parseVersion(version: string): number[] {
  return version.replace(/[\^~]/g, '').split('.').map(Number);
}

function compareVersions(current: string, latest: string): { isOutdated: boolean; type: 'major' | 'minor' | 'patch' } {
  const currentParts = parseVersion(current);
  const latestParts = parseVersion(latest);

  if (latestParts[0] > currentParts[0]) {
    return { isOutdated: true, type: 'major' };
  } else if (latestParts[1] > currentParts[1]) {
    return { isOutdated: true, type: 'minor' };
  } else if (latestParts[2] > currentParts[2]) {
    return { isOutdated: true, type: 'patch' };
  }

  return { isOutdated: false, type: 'patch' };
}

function isVersionVulnerable(version: string, vulnerabilities: Vulnerability[]): boolean {
  return vulnerabilities.some(vuln => {
    // Simple version range check - in production, use proper semver
    const current = parseVersion(version)[0];
    const affected = vuln.affectedVersions.includes('<') ?
      parseInt(vuln.affectedVersions.replace('<', '')) : 0;
    return current < affected;
  });
}

function getHighestSeverity(vulnerabilities: Vulnerability[]): 'low' | 'moderate' | 'high' | 'critical' | undefined {
  const severityOrder = { low: 1, moderate: 2, high: 3, critical: 4 };
  const highest = vulnerabilities.reduce((max, vuln) => {
    return severityOrder[vuln.severity] > severityOrder[max] ? vuln.severity : max;
  }, 'low' as keyof typeof severityOrder);

  return vulnerabilities.length > 0 ? highest : undefined;
}

async function scanDependencies(packageJson: any, packageManager: string): Promise<ScanResult> {
  const startTime = Date.now();
  const dependencies: Dependency[] = [];

  // Process regular dependencies
  if (packageJson.dependencies) {
    for (const [name, version] of Object.entries(packageJson.dependencies)) {
      const packageData = MOCK_PACKAGE_DATA[name] || { latest: version as string, vulnerabilities: [] };
      const comparison = compareVersions(version as string, packageData.latest);

      dependencies.push({
        name,
        currentVersion: version as string,
        latestVersion: packageData.latest,
        type: 'direct',
        isOutdated: comparison.isOutdated,
        vulnerabilities: packageData.vulnerabilities,
        severity: getHighestSeverity(packageData.vulnerabilities),
        breakingChanges: comparison.type === 'major'
      });
    }
  }

  // Process dev dependencies
  if (packageJson.devDependencies) {
    for (const [name, version] of Object.entries(packageJson.devDependencies)) {
      const packageData = MOCK_PACKAGE_DATA[name] || { latest: version as string, vulnerabilities: [] };
      const comparison = compareVersions(version as string, packageData.latest);

      dependencies.push({
        name,
        currentVersion: version as string,
        latestVersion: packageData.latest,
        type: 'dev',
        isOutdated: comparison.isOutdated,
        vulnerabilities: packageData.vulnerabilities,
        severity: getHighestSeverity(packageData.vulnerabilities),
        breakingChanges: comparison.type === 'major'
      });
    }
  }

  const outdatedCount = dependencies.filter(dep => dep.isOutdated).length;
  const vulnerableCount = dependencies.filter(dep => dep.vulnerabilities && dep.vulnerabilities.length > 0).length;

  return {
    dependencies,
    totalDependencies: dependencies.length,
    outdatedCount,
    vulnerableCount,
    scanTime: Date.now() - startTime,
    packageManager
  };
}

function updateDependencies(packageJson: any, dependenciesToUpdate: string[], strategy: string): any {
  const updatedPackageJson = { ...packageJson };

  // Update regular dependencies
  if (updatedPackageJson.dependencies) {
    for (const dep of dependenciesToUpdate) {
      if (updatedPackageJson.dependencies[dep]) {
        const packageData = MOCK_PACKAGE_DATA[dep];
        if (packageData) {
          const currentVersion = updatedPackageJson.dependencies[dep];
          const comparison = compareVersions(currentVersion, packageData.latest);

          // Apply update strategy
          if (strategy === 'latest' ||
              (strategy === 'major' && comparison.type === 'major') ||
              (strategy === 'minor' && (comparison.type === 'major' || comparison.type === 'minor')) ||
              (strategy === 'patch' && comparison.isOutdated)) {
            updatedPackageJson.dependencies[dep] = `^${packageData.latest}`;
          }
        }
      }
    }
  }

  // Update dev dependencies
  if (updatedPackageJson.devDependencies) {
    for (const dep of dependenciesToUpdate) {
      if (updatedPackageJson.devDependencies[dep]) {
        const packageData = MOCK_PACKAGE_DATA[dep];
        if (packageData) {
          const currentVersion = updatedPackageJson.devDependencies[dep];
          const comparison = compareVersions(currentVersion, packageData.latest);

          // Apply update strategy
          if (strategy === 'latest' ||
              (strategy === 'major' && comparison.type === 'major') ||
              (strategy === 'minor' && (comparison.type === 'major' || comparison.type === 'minor')) ||
              (strategy === 'patch' && comparison.isOutdated)) {
            updatedPackageJson.devDependencies[dep] = `^${packageData.latest}`;
          }
        }
      }
    }
  }

  return updatedPackageJson;
}

export async function POST(request: NextRequest) {
  try {
    const body: DependencyRequest = await request.json();

    if (body.action === 'scan') {
      const result = await scanDependencies(body.packageJson, body.packageManager);
      return NextResponse.json({
        success: true,
        result
      });
    } else if (body.action === 'update') {
      const updatedPackageJson = updateDependencies(
        body.packageJson,
        body.dependencies,
        body.strategy
      );

      return NextResponse.json({
        success: true,
        updatedPackageJson
      });
    } else {
      return NextResponse.json(
        { error: "Invalid action. Must be 'scan' or 'update'" },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error("Dependency updater error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}