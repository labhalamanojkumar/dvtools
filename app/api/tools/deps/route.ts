import { NextResponse } from "next/server";
import { exec as execCb } from "child_process";
import { promisify } from "util";
import { readFile } from "fs/promises";
import { join } from "path";

const exec = promisify(execCb);

export async function GET() {
  try {
    // Try npm outdated and npm audit. These may fail in restricted environments.
    let outdated: any = null;
    let audit: any = null;
    try {
      const { stdout } = await exec("npm outdated --json", { cwd: process.cwd(), timeout: 20_000, maxBuffer: 1024 * 1024 });
      outdated = stdout ? JSON.parse(stdout) : {};
    } catch (e) {
      outdated = null;
    }

    try {
      const { stdout } = await exec("npm audit --json", { cwd: process.cwd(), timeout: 30_000, maxBuffer: 1024 * 1024 });
      audit = stdout ? JSON.parse(stdout) : null;
    } catch (e) {
      audit = null;
    }

    // Fallback: read package.json deps to at least show something
    if (!outdated) {
      try {
        const pkg = JSON.parse(await readFile(join(process.cwd(), "package.json"), "utf8"));
        outdated = Object.assign({}, pkg.dependencies || {}, pkg.devDependencies || {});
      } catch {}
    }

    return NextResponse.json({ success: true, result: { outdated, audit } });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || "Unexpected error" }, { status: 500 });
  }
}
