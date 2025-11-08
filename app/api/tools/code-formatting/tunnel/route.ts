import { NextRequest, NextResponse } from "next/server";

interface TunnelRequest {
  service: "ngrok" | "cloudflared";
  port: number;
  subdomain?: string;
  region?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: TunnelRequest = await request.json();
    const { service, port, subdomain, region } = body;

    if (!service || !port) {
      return NextResponse.json(
        { error: "Service and port are required" },
        { status: 400 }
      );
    }

    const commands = generateTunnelCommands(service, port, subdomain, region);

    return NextResponse.json({
      success: true,
      commands,
    });

  } catch (error: any) {
    console.error("Tunnel command generation error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

function generateTunnelCommands(
  service: "ngrok" | "cloudflared",
  port: number,
  subdomain?: string,
  region?: string
): string[] {
  const commands: string[] = [];

  if (service === "ngrok") {
    // ngrok commands
    let ngrokCommand = `ngrok http ${port}`;

    if (subdomain) {
      ngrokCommand += ` --subdomain=${subdomain}`;
    }

    if (region) {
      ngrokCommand += ` --region=${region}`;
    }

    commands.push(
      `# Install ngrok (if not already installed)`,
      `npm install -g ngrok`,
      ``,
      `# Start tunnel`,
      ngrokCommand,
      ``,
      `# Alternative: using npx`,
      `npx ngrok http ${port}${subdomain ? ` --subdomain=${subdomain}` : ""}${region ? ` --region=${region}` : ""}`,
      ``,
      `# To stop the tunnel, press Ctrl+C`,
      ``,
      `# Useful ngrok commands:`,
      `# ngrok http 3000                    # Basic HTTP tunnel`,
      `# ngrok tcp 22                       # TCP tunnel for SSH`,
      `# ngrok tls 443                      # TLS tunnel`,
      `# ngrok --config ~/.ngrok2/ngrok.yml http 3000  # Custom config`
    );

  } else if (service === "cloudflared") {
    // cloudflared commands
    commands.push(
      `# Install cloudflared (if not already installed)`,
      `# macOS:`,
      `brew install cloudflare/cloudflare/cloudflared`,
      ``,
      `# Linux:`,
      `wget -qO- https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb | sudo dpkg -i -`,
      ``,
      `# Or using npm:`,
      `npm install -g cloudflared`,
      ``,
      `# Start tunnel`,
      `cloudflared tunnel --url http://localhost:${port}`,
      ``,
      `# With custom domain (requires cloudflare account):`,
      `cloudflared tunnel --url http://localhost:${port} --hostname ${subdomain || "your-domain.com"}`,
      ``,
      `# Login to Cloudflare (required for custom domains):`,
      `cloudflared tunnel login`,
      ``,
      `# Create a tunnel:`,
      `cloudflared tunnel create my-tunnel`,
      ``,
      `# Route to your domain:`,
      `cloudflared tunnel route dns my-tunnel ${subdomain || "your-domain.com"}`,
      ``,
      `# Start the tunnel:`,
      `cloudflared tunnel run my-tunnel`,
      ``,
      `# To stop, press Ctrl+C`
    );
  }

  return commands;
}