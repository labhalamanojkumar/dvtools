import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const provider = (String(body.provider || "ngrok") as "ngrok" | "cloudflared");
    const action = (String(body.action || "start") as "start" | "stop");
    const port = Number(body.port || 3000);

    if (!port || port < 1 || port > 65535) return NextResponse.json({ success: false, error: "Invalid port" }, { status: 400 });

    // For security and hosting compatibility, we don't actually spawn long-lived tunnel processes here.
    // Instead, we return the exact command to run locally and a friendly message.
    const command = provider === "ngrok" ? `ngrok http ${port}` : `cloudflared tunnel --url http://localhost:${port}`;

    if (action === "start") {
      return NextResponse.json({ success: true, result: { provider, message: `Run this command locally to start a secure tunnel.`, command } });
    } else {
      return NextResponse.json({ success: true, result: { provider, message: `Stop the tunnel by terminating the process in your terminal.`, command } });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || "Unexpected error" }, { status: 500 });
  }
}
