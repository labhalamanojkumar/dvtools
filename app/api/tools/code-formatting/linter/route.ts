import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

interface LintRequest {
  code: string;
  language: string;
  linter: string;
}

interface LintResult {
  file: string;
  line: number;
  column: number;
  severity: "error" | "warning" | "info";
  message: string;
  rule?: string;
  fix?: {
    range: [number, number];
    text: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: LintRequest = await request.json();
    const { code, language, linter } = body;

    if (!code) {
      return NextResponse.json(
        { error: "Code is required" },
        { status: 400 }
      );
    }

    let results: LintResult[] = [];
    let formattedCode = code;

    switch (linter) {
      case "eslint":
        const eslintResults = await runESLint(code, language);
        results = eslintResults.results;
        formattedCode = eslintResults.formattedCode;
        break;

      case "flake8":
        results = await runFlake8(code);
        break;

      case "rubocop":
        results = await runRuboCop(code);
        break;

      case "stylelint":
        results = await runStylelint(code);
        break;

      default:
        return NextResponse.json(
          { error: "Unsupported linter" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      results,
      formattedCode,
    });

  } catch (error: any) {
    console.error("Linter error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

async function runESLint(code: string, language: string): Promise<{ results: LintResult[]; formattedCode: string }> {
  const tempFileName = `temp-${uuidv4()}.${language === "typescript" ? "ts" : "js"}`;
  const tempFilePath = join(tmpdir(), tempFileName);

  try {
    // Write code to temp file
    await writeFile(tempFilePath, code, "utf-8");

    // For demo purposes, return mock results since ESLint integration is complex
    // In production, you'd properly configure ESLint
    const results: LintResult[] = [];

    // Simple checks for common issues
    const lines = code.split("\n");
    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      // Check for console.log statements
      if (line.includes("console.log") && !line.includes("//")) {
        results.push({
          file: tempFileName,
          line: lineNumber,
          column: line.indexOf("console.log") + 1,
          severity: "warning",
          message: "Unexpected console statement",
          rule: "no-console",
        });
      }

      // Check for missing semicolons (simplified)
      if (line.trim().match(/^(var|let|const|return|throw)\s+.*[^;{}\s]$/) && !line.includes("//")) {
        results.push({
          file: tempFileName,
          line: lineNumber,
          column: line.length,
          severity: "error",
          message: "Missing semicolon",
          rule: "semi",
        });
      }
    });

    return {
      results,
      formattedCode: code, // In production, you'd apply ESLint fixes
    };

  } finally {
    // Clean up temp file
    try {
      await unlink(tempFilePath);
    } catch (error) {
      // Ignore cleanup errors
    }
  }
}

async function runFlake8(code: string): Promise<LintResult[]> {
  // Mock Flake8 results for demo - in production, you'd run the actual flake8 command
  const results: LintResult[] = [];

  // Simple checks for common Python issues
  const lines = code.split("\n");
  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    // Check for unused imports (simplified)
    if (line.includes("import") && !line.includes("#")) {
      // This is a very basic check - real Flake8 would be much more sophisticated
      results.push({
        file: "code.py",
        line: lineNumber,
        column: 1,
        severity: "warning",
        message: "F401 'import' possibly unused",
        rule: "F401",
      });
    }

    // Check for long lines
    if (line.length > 88) {
      results.push({
        file: "code.py",
        line: lineNumber,
        column: 89,
        severity: "warning",
        message: "E501 line too long (88 > 79 characters)",
        rule: "E501",
      });
    }
  });

  return results;
}

async function runRuboCop(code: string): Promise<LintResult[]> {
  // Mock RuboCop results for demo
  const results: LintResult[] = [];

  const lines = code.split("\n");
  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    // Check for trailing whitespace
    if (line.endsWith(" ")) {
      results.push({
        file: "code.rb",
        line: lineNumber,
        column: line.length,
        severity: "warning",
        message: "Layout/TrailingWhitespace: Trailing whitespace detected.",
        rule: "Layout/TrailingWhitespace",
      });
    }
  });

  return results;
}

async function runStylelint(code: string): Promise<LintResult[]> {
  // Mock Stylelint results for demo
  const results: LintResult[] = [];

  const lines = code.split("\n");
  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    // Check for missing semicolons in CSS
    if (line.includes("{") && !line.includes("}") && !line.trim().endsWith(";") && line.trim() !== "") {
      results.push({
        file: "code.css",
        line: lineNumber,
        column: line.length,
        severity: "warning",
        message: "CssSyntaxError: Missing semicolon",
        rule: "CssSyntaxError",
      });
    }
  });

  return results;
}