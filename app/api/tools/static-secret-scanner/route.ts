import { NextRequest, NextResponse } from "next/server";

// Secret patterns for different types of credentials
const SECRET_PATTERNS = {
  api_keys: [
    // Generic API keys
    /\b(?:api[_-]?key|apikey)\s*[=:]\s*["']?([A-Za-z0-9_-]{20,})["']?/gi,
    // AWS access keys
    /\bAKIA[0-9A-Z]{16}\b/g,
    // Google API keys
    /\bAIza[0-9A-Za-z_-]{35}\b/g,
    // Stripe keys
    /\bsk_(?:live|test)_[0-9a-zA-Z]{24}\b/g,
    /\bpk_(?:live|test)_[0-9a-zA-Z]{24}\b/g,
    // GitHub tokens
    /\bghp_[0-9a-zA-Z]{36}\b/g,
    /\bgithub_pat_[0-9a-zA-Z_-]{82,255}\b/g,
    // Slack tokens
    /\bxox[baprs]-[0-9a-zA-Z-]{10,}\b/g,
  ],
  passwords: [
    // Password patterns
    /\b(?:password|passwd|pwd)\s*[=:]\s*["']?([^"'\s]{8,})["']?/gi,
    /\b(?:db[_-]?password|dbpasswd)\s*[=:]\s*["']?([^"'\s]{8,})["']?/gi,
    // Connection strings with passwords
    /postgresql:\/\/[^:]+:([^@]+)@/gi,
    /mysql:\/\/[^:]+:([^@]+)@/gi,
    /mongodb:\/\/[^:]+:([^@]+)@/gi,
  ],
  tokens: [
    // JWT tokens
    /\beyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*\b/g,
    // Bearer tokens
    /\bBearer\s+[A-Za-z0-9_-]{20,}\b/gi,
    // OAuth tokens
    /\b(?:access[_-]?token|auth[_-]?token)\s*[=:]\s*["']?([A-Za-z0-9_-]{20,})["']?/gi,
  ],
  private_keys: [
    // SSH private keys
    /-----BEGIN\s+(?:RSA|DSA|EC|OPENSSH)\s+PRIVATE\s+KEY-----[\s\S]*?-----END\s+(?:RSA|DSA|EC|OPENSSH)\s+PRIVATE\s+KEY-----/g,
    // PGP private keys
    /-----BEGIN\s+PGP\s+PRIVATE\s+KEY\s+BLOCK-----[\s\S]*?-----END\s+PGP\s+PRIVATE\s+KEY\s+BLOCK-----/g,
  ],
  credentials: [
    // Database credentials
    /\b(?:user|username)\s*[=:]\s*["']?([^"'\s]+)["']?\s*(?:password|passwd)\s*[=:]\s*["']?([^"'\s]+)["']?/gi,
    // Connection strings
    /(?:mongodb|postgresql|mysql):\/\/([^:]+):([^@]+)@/gi,
  ],
};

interface SecretFinding {
  id: string;
  type: string;
  value: string;
  line: number;
  column: number;
  file: string;
  severity: "high" | "medium" | "low";
  context: string;
  redacted: string;
}

function calculateEntropy(str: string): number {
  const charCount: { [key: string]: number } = {};
  for (const char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
  }

  let entropy = 0;
  const len = str.length;
  for (const count of Object.values(charCount)) {
    const p = count / len;
    entropy -= p * Math.log2(p);
  }

  return entropy;
}

function redactSecret(value: string, type: string): string {
  if (value.length <= 8) return "*".repeat(value.length);

  switch (type) {
    case "api_keys":
      return value.substring(0, 4) + "*".repeat(value.length - 8) + value.substring(value.length - 4);
    case "passwords":
      return "*".repeat(value.length);
    case "tokens":
      return value.substring(0, 6) + "*".repeat(value.length - 12) + value.substring(value.length - 6);
    case "private_keys":
      return "[REDACTED PRIVATE KEY]";
    case "credentials":
      return "[REDACTED CREDENTIALS]";
    default:
      return "*".repeat(Math.min(value.length, 20));
  }
}

function scanText(text: string, fileName: string, enabledTypes: string[]): SecretFinding[] {
  const findings: SecretFinding[] = [];
  const lines = text.split("\n");

  lines.forEach((line, lineIndex) => {
    enabledTypes.forEach((type) => {
      const patterns = SECRET_PATTERNS[type as keyof typeof SECRET_PATTERNS] || [];
      patterns.forEach((pattern) => {
        let match;
        while ((match = pattern.exec(line)) !== null) {
          const secretValue = match[1] || match[0];
          const entropy = calculateEntropy(secretValue);

          // Skip low entropy values (likely not real secrets)
          if (entropy < 3.5 && secretValue.length < 20) continue;

          // Skip common test/example values
          if (/^(?:test|example|sample|demo|placeholder|your[_-])/.test(secretValue.toLowerCase())) continue;

          const finding: SecretFinding = {
            id: `${fileName}-${lineIndex}-${pattern.lastIndex}-${type}`,
            type,
            value: secretValue,
            line: lineIndex + 1,
            column: match.index + 1,
            file: fileName,
            severity: entropy > 4.5 ? "high" : entropy > 3.5 ? "medium" : "low",
            context: line.trim(),
            redacted: redactSecret(secretValue, type),
          };

          findings.push(finding);
        }
      });
    });
  });

  return findings;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const input = formData.get("input") as string;
    const secretTypes = JSON.parse(formData.get("secretTypes") as string || "[]");
    const files = formData.getAll("files") as File[];

    const startTime = Date.now();
    const allFindings: SecretFinding[] = [];

    // Scan text input
    if (input && input.trim()) {
      const findings = scanText(input, "input.txt", secretTypes);
      allFindings.push(...findings);
    }

    // Scan uploaded files
    for (const file of files) {
      try {
        const text = await file.text();
        const findings = scanText(text, file.name, secretTypes);
        allFindings.push(...findings);
      } catch (error) {
        console.error(`Error scanning file ${file.name}:`, error);
      }
    }

    const scanTime = Date.now() - startTime;

    const result = {
      totalFiles: files.length + (input ? 1 : 0),
      totalSecrets: allFindings.length,
      findings: allFindings,
      scanTime,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in static secret scanner:", error);
    return NextResponse.json(
      { error: "Failed to scan for secrets" },
      { status: 500 }
    );
  }
}