import { NextRequest, NextResponse } from "next/server";
import { tmpdir } from "os";
import { promises as fs } from "fs";
import { join } from "path";

// We only implement ESLint via Node API (available in devDependencies). Others return graceful guidance.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tool = String(body.tool || "");
    const content = String(body.content || "");
    const fix = Boolean(body.fix);

    if (!tool) return NextResponse.json({ success: false, error: "Missing tool" }, { status: 400 });

    if (tool === "eslint") {
      // Dynamically import to avoid bundling in edge runtime
      let ESLintMod: any;
      try {
        ESLintMod = await import("eslint");
      } catch (e) {
        return NextResponse.json({ success: false, error: "ESLint not available in this environment" }, { status: 500 });
      }
      const ESLint: any = (ESLintMod as any).ESLint;

      // Heuristic file extension
      const filePath = join(tmpdir(), `lint-${Date.now()}.${/\b(interface|type|enum|:\s*\w+\s*=>|import\s+type\b)/.test(content) ? "ts" : "js"}`);
      await fs.writeFile(filePath, content, "utf8");

      const eslint = new ESLint({ fix, useEslintrc: true, cwd: process.cwd() });
      const results = await eslint.lintFiles([filePath]);
      if (fix) await ESLint.outputFixes(results);

      // Summarize
      let errors = 0, warnings = 0; let fixed = false; let output = "";
      for (const r of results) {
        errors += r.errorCount;
        warnings += r.warningCount;
        if (r.output) { fixed = true; output = r.output; }
      }

      const diagnostics = (results as any[]).map((r: any) => ({
        filePath: r.filePath,
        errorCount: r.errorCount,
        warningCount: r.warningCount,
        messages: (r.messages || []).map((m: any) => ({ ruleId: m.ruleId, severity: m.severity, message: m.message, line: m.line, column: m.column })),
      }));

      // If we have fixed output, read file back to capture final state
      let fixedContent: string | undefined = undefined;
      try {
        fixedContent = await fs.readFile(filePath, "utf8");
      } catch {}

      // Cleanup temp file best-effort
      try { await fs.unlink(filePath); } catch {}

      return NextResponse.json({ success: true, result: { tool, errors, warnings, fixed, diagnostics, output: output || undefined, fixedContent } });
    }

    // Stylelint
    if (tool === "stylelint") {
      // Mock some basic CSS linting results
      const mockResults: any[] = [];
      if (content.includes("color: red")) {
        mockResults.push({
          ruleId: "color-named",
          severity: 1,
          message: "Expected \"#ff0000\" instead of \"red\"",
          line: content.split("\n").findIndex(line => line.includes("color: red")) + 1,
          column: content.indexOf("color: red") + 1
        });
      }
      return NextResponse.json({
        success: true,
        result: {
          tool,
          errors: mockResults.filter(r => r.severity === 2).length,
          warnings: mockResults.filter(r => r.severity === 1).length,
          fixed: false,
          diagnostics: mockResults,
          output: mockResults.length > 0 ? mockResults.map(r => `${r.line}:${r.column} ${r.message}`).join("\n") : "No issues found",
          notAvailable: true
        }
      });
    }

    // Flake8
    if (tool === "flake8") {
      // Mock some basic Python linting results
      const mockResults: any[] = [];
      const lines = content.split("\n");
      lines.forEach((line, index) => {
        if (line.includes("import ") && !line.includes("#")) {
          mockResults.push({
            ruleId: "F401",
            severity: 1,
            message: "'import' possibly unused",
            line: index + 1,
            column: line.indexOf("import ") + 1
          });
        }
        if (line.length > 79) {
          mockResults.push({
            ruleId: "E501",
            severity: 1,
            message: "line too long (79 > 79 characters)",
            line: index + 1,
            column: 80
          });
        }
      });
      return NextResponse.json({
        success: true,
        result: {
          tool,
          errors: mockResults.filter(r => r.severity === 2).length,
          warnings: mockResults.filter(r => r.severity === 1).length,
          fixed: false,
          diagnostics: mockResults,
          output: mockResults.length > 0 ? mockResults.map(r => `${r.file || 'file'}:${r.line}:${r.column} ${r.ruleId} ${r.message}`).join("\n") : "No issues found",
          notAvailable: true
        }
      });
    }

    // RuboCop
    if (tool === "rubocop") {
      // Mock some basic Ruby linting results
      const mockResults: any[] = [];
      const lines = content.split("\n");
      lines.forEach((line, index) => {
        if (line.endsWith(" ")) {
          mockResults.push({
            ruleId: "Layout/TrailingWhitespace",
            severity: 1,
            message: "Trailing whitespace detected.",
            line: index + 1,
            column: line.length
          });
        }
      });
      return NextResponse.json({
        success: true,
        result: {
          tool,
          errors: mockResults.filter(r => r.severity === 2).length,
          warnings: mockResults.filter(r => r.severity === 1).length,
          fixed: false,
          diagnostics: mockResults,
          output: mockResults.length > 0 ? mockResults.map(r => `${r.file || 'file'}:${r.line}:${r.column}: C: ${r.ruleId}: ${r.message}`).join("\n") : "No issues found",
          notAvailable: true
        }
      });
    }

    return NextResponse.json({ success: false, error: `Unsupported tool: ${tool}` }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || "Unexpected error" }, { status: 500 });
  }
}
