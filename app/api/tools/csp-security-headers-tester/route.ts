import { NextRequest, NextResponse } from "next/server";

interface SecurityHeader {
  name: string;
  value: string;
  status: "present" | "missing" | "insecure";
  severity: "critical" | "high" | "medium" | "low";
  recommendation: string;
  description: string;
}

interface CspIssue {
  type: "directive" | "syntax" | "security";
  severity: "critical" | "high" | "medium" | "low";
  message: string;
  directive?: string;
  recommendation: string;
}

interface ScanResult {
  url: string;
  securityScore: number;
  headers: SecurityHeader[];
  cspPolicy: string | null;
  cspIssues: CspIssue[];
  mixedContent: string[];
  scanTime: number;
  overallRisk: "critical" | "high" | "medium" | "low";
}

// Mock security headers analysis - in a real implementation, this would make HTTP requests
const MOCK_SECURITY_HEADERS = {
  "Strict-Transport-Security": {
    description: "Enforces HTTPS connections and prevents protocol downgrade attacks",
    critical: true,
    validate: (value: string) => {
      if (!value) return { status: "missing", severity: "critical", recommendation: "Add HSTS header with max-age=31536000; includeSubDomains" };
      if (!value.includes("max-age=")) return { status: "insecure", severity: "high", recommendation: "Include max-age directive with at least 31536000 seconds" };
      if (!value.includes("includeSubDomains")) return { status: "insecure", severity: "medium", recommendation: "Add includeSubDomains to protect all subdomains" };
      return { status: "present", severity: "low", recommendation: "HSTS is properly configured" };
    }
  },
  "X-Frame-Options": {
    description: "Prevents clickjacking attacks by controlling iframe embedding",
    critical: true,
    validate: (value: string) => {
      if (!value) return { status: "missing", severity: "high", recommendation: "Add X-Frame-Options: DENY or SAMEORIGIN" };
      if (value.toLowerCase().includes("allow")) return { status: "insecure", severity: "medium", recommendation: "Consider DENY instead of ALLOW-FROM for better security" };
      return { status: "present", severity: "low", recommendation: "X-Frame-Options is properly configured" };
    }
  },
  "X-Content-Type-Options": {
    description: "Prevents MIME type sniffing attacks",
    critical: true,
    validate: (value: string) => {
      if (!value || !value.toLowerCase().includes("nosniff")) return { status: "missing", severity: "high", recommendation: "Add X-Content-Type-Options: nosniff" };
      return { status: "present", severity: "low", recommendation: "X-Content-Type-Options is properly configured" };
    }
  },
  "Referrer-Policy": {
    description: "Controls how much referrer information is sent with requests",
    critical: false,
    validate: (value: string) => {
      if (!value) return { status: "missing", severity: "medium", recommendation: "Add Referrer-Policy: strict-origin-when-cross-origin" };
      if (value.toLowerCase().includes("unsafe")) return { status: "insecure", severity: "medium", recommendation: "Avoid unsafe referrer policies" };
      return { status: "present", severity: "low", recommendation: "Referrer-Policy is configured" };
    }
  },
  "Permissions-Policy": {
    description: "Controls access to browser features and APIs",
    critical: false,
    validate: (value: string) => {
      if (!value) return { status: "missing", severity: "low", recommendation: "Consider adding Permissions-Policy to restrict browser features" };
      return { status: "present", severity: "low", recommendation: "Permissions-Policy is configured" };
    }
  },
  "Content-Security-Policy": {
    description: "Controls which resources can be loaded and executed",
    critical: false,
    validate: (value: string) => {
      if (!value) return { status: "missing", severity: "high", recommendation: "Implement a Content Security Policy" };
      return { status: "present", severity: "low", recommendation: "CSP is implemented" };
    }
  }
};

function analyzeCspPolicy(cspPolicy: string): CspIssue[] {
  const issues: CspIssue[] = [];

  if (!cspPolicy || cspPolicy.trim() === "") {
    return [{
      type: "security",
      severity: "high",
      message: "No Content Security Policy implemented",
      recommendation: "Implement a comprehensive CSP to prevent XSS and other injection attacks"
    }];
  }

  // Check for dangerous directives
  if (cspPolicy.includes("'unsafe-inline'")) {
    issues.push({
      type: "security",
      severity: "high",
      message: "CSP allows unsafe inline scripts",
      directive: "script-src",
      recommendation: "Remove 'unsafe-inline' and use nonces or hashes for inline scripts"
    });
  }

  if (cspPolicy.includes("'unsafe-eval'")) {
    issues.push({
      type: "security",
      severity: "high",
      message: "CSP allows unsafe eval() execution",
      directive: "script-src",
      recommendation: "Remove 'unsafe-eval' and avoid eval() in your code"
    });
  }

  // Check for missing default-src
  if (!cspPolicy.includes("default-src")) {
    issues.push({
      type: "directive",
      severity: "medium",
      message: "Missing default-src directive",
      recommendation: "Add default-src directive as a fallback for other resource types"
    });
  }

  // Check for overly permissive wildcards
  const wildcardMatches = cspPolicy.match(/\b\*\b/g);
  if (wildcardMatches && wildcardMatches.length > 2) {
    issues.push({
      type: "security",
      severity: "medium",
      message: "Overly permissive wildcard usage",
      recommendation: "Replace wildcards (*) with specific allowed domains"
    });
  }

  // Check for report-uri
  if (!cspPolicy.includes("report-uri") && !cspPolicy.includes("report-to")) {
    issues.push({
      type: "directive",
      severity: "low",
      message: "No CSP violation reporting configured",
      recommendation: "Add report-uri or report-to directive to monitor policy violations"
    });
  }

  return issues;
}

function calculateSecurityScore(headers: SecurityHeader[], cspIssues: CspIssue[], mixedContent: string[]): number {
  let score = 100;

  // Deduct points for missing critical headers
  const criticalHeaders = headers.filter(h => MOCK_SECURITY_HEADERS[h.name as keyof typeof MOCK_SECURITY_HEADERS]?.critical);
  const missingCritical = criticalHeaders.filter(h => h.status === "missing").length;
  score -= missingCritical * 20;

  // Deduct points for insecure configurations
  const insecureHeaders = headers.filter(h => h.status === "insecure").length;
  score -= insecureHeaders * 10;

  // Deduct points for CSP issues
  const highSeverityCsp = cspIssues.filter(i => i.severity === "high" || i.severity === "critical").length;
  score -= highSeverityCsp * 15;

  const mediumSeverityCsp = cspIssues.filter(i => i.severity === "medium").length;
  score -= mediumSeverityCsp * 5;

  // Deduct points for mixed content
  score -= mixedContent.length * 10;

  return Math.max(0, score);
}

function getOverallRisk(score: number): "critical" | "high" | "medium" | "low" {
  if (score < 40) return "critical";
  if (score < 70) return "high";
  if (score < 85) return "medium";
  return "low";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, cspPolicy, testOptions } = body;

    const startTime = Date.now();

    let headers: SecurityHeader[] = [];
    let cspIssues: CspIssue[] = [];
    let mixedContent: string[] = [];
    let actualCspPolicy: string | null = null;

    // Analyze URL if provided
    if (url && testOptions.includes("headers")) {
      // Mock header analysis - in real implementation, make HTTP request
      headers = Object.entries(MOCK_SECURITY_HEADERS).map(([name, config]) => {
        // Simulate some headers being present/missing based on URL
        const isPresent = Math.random() > 0.3; // 70% chance of being present
        const mockValue = isPresent ? getMockHeaderValue(name) : "";

        const validation = config.validate(mockValue);

        return {
          name,
          value: mockValue,
          status: validation.status as "present" | "missing" | "insecure",
          severity: validation.severity as "critical" | "high" | "medium" | "low",
          recommendation: validation.recommendation,
          description: config.description,
        };
      });

      // Extract CSP if present
      const cspHeader = headers.find(h => h.name === "Content-Security-Policy");
      if (cspHeader && cspHeader.value) {
        actualCspPolicy = cspHeader.value;
      }
    }

    // Analyze CSP policy if provided directly or extracted from headers
    const policyToAnalyze = cspPolicy || actualCspPolicy;
    if (policyToAnalyze && testOptions.includes("csp")) {
      cspIssues = analyzeCspPolicy(policyToAnalyze);
    }

    // Mock mixed content detection
    if (testOptions.includes("mixed_content") && url && url.startsWith("https://")) {
      // Simulate some mixed content issues
      if (Math.random() > 0.7) {
        mixedContent = [
          "http://cdn.example.com/script.js",
          "http://images.example.com/banner.png"
        ];
      }
    }

    const securityScore = calculateSecurityScore(headers, cspIssues, mixedContent);
    const overallRisk = getOverallRisk(securityScore);
    const scanTime = Date.now() - startTime;

    const result: ScanResult = {
      url: url || "",
      securityScore,
      headers,
      cspPolicy: policyToAnalyze || null,
      cspIssues,
      mixedContent,
      scanTime,
      overallRisk,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in CSP security headers tester:", error);
    return NextResponse.json(
      { error: "Failed to analyze security configuration" },
      { status: 500 }
    );
  }
}

function getMockHeaderValue(headerName: string): string {
  const mockValues: { [key: string]: string[] } = {
    "Strict-Transport-Security": ["max-age=31536000; includeSubDomains", "max-age=31536000", ""],
    "X-Frame-Options": ["DENY", "SAMEORIGIN", "ALLOW-FROM https://trusted.com", ""],
    "X-Content-Type-Options": ["nosniff", ""],
    "Referrer-Policy": ["strict-origin-when-cross-origin", "no-referrer-when-downgrade", ""],
    "Permissions-Policy": ["geolocation=(), microphone=()", ""],
    "Content-Security-Policy": ["default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.example.com; style-src 'self' 'unsafe-inline';", ""],
  };

  const values = mockValues[headerName] || [""];
  return values[Math.floor(Math.random() * values.length)];
}