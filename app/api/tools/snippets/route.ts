import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";

const SNIPPETS_PATH = join(process.cwd(), "data", "snippets.json");

async function readSnippets() {
  try {
    const data = await fs.readFile(SNIPPETS_PATH, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeSnippets(list: any[]) {
  await fs.writeFile(SNIPPETS_PATH, JSON.stringify(list, null, 2), "utf8");
}

export async function GET() {
  const snippets = await readSnippets();
  return NextResponse.json({ success: true, snippets });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const title = String(body.title || "").trim();
    const language = String(body.language || "").trim() || "text";
    const content = String(body.content || "").trim();

    if (!title || !content) return NextResponse.json({ success: false, error: "Missing title or content" }, { status: 400 });

    const snippets = await readSnippets();
    const snip = { id: randomUUID(), title, language, content, createdAt: new Date().toISOString() };
    snippets.unshift(snip);
    await writeSnippets(snippets);

    return NextResponse.json({ success: true, snippet: snip });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || "Unexpected error" }, { status: 500 });
  }
}
