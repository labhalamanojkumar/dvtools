import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const formatter = String(body.formatter || "");
    const config = body.config || {};
    const content = String(body.content || "");
    if (!formatter) return NextResponse.json({ success: false, error: "Missing formatter" }, { status: 400 });

    if (formatter === "prettier") {
      try {
        const prettier = await import("prettier");
        // Choose a parser heuristically. Users can extend later by passing config.parser
        const parser = (config && config.parser) || (/(^|\n)\s*<\/?[a-zA-Z]/.test(content) ? "html" : /(\{|\}|;)/.test(content) && /function|const|let|=>|import|export|class/.test(content) ? "babel" : "babel");
        const output = await prettier.format(content, { ...config, parser } as any);
        return NextResponse.json({ success: true, result: { output } });
      } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message || "Prettier failed" }, { status: 500 });
      }
    }

    if (formatter === "black") {
      // We cannot run Black in Node.js environment. Return a suggested command.
      const cmd = "black -q -"; // stdin
      return NextResponse.json({ success: true, result: { output: content, message: `Black formatting not executed in this environment. Run locally: ${cmd}` } });
    }

    return NextResponse.json({ success: false, error: `Unsupported formatter: ${formatter}` }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || "Unexpected error" }, { status: 500 });
  }
}
