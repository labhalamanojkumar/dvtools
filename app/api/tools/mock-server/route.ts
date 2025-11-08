import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import { randomBytes } from "crypto";

interface MockEndpoint {
  id: string;
  path: string;
  method: string;
  statusCode: number;
  responseBody: string;
  responseHeaders: Record<string, string>;
  delay: number;
}

interface MockServer {
  id: string;
  name: string;
  baseUrl: string;
  endpoints: MockEndpoint[];
  createdAt: Date;
  requestCount: number;
}

// In-memory storage (in production, use Redis or database)
const mockServers = new Map<string, MockServer>();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const server = mockServers.get(id);
      if (!server) {
        return NextResponse.json(
          { error: "Server not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ server });
    }

    // Return all servers
    const servers = Array.from(mockServers.values());
    return NextResponse.json({ servers });
  } catch (error) {
    console.error("Mock Server GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, name, endpoints } = await request.json();

    if (action === "create") {
      if (!name || !endpoints || endpoints.length === 0) {
        return NextResponse.json(
          { error: "Server name and at least one endpoint required" },
          { status: 400 }
        );
      }

      // Validate endpoints
      for (const endpoint of endpoints) {
        if (!endpoint.path || !endpoint.method) {
          return NextResponse.json(
            { error: "Each endpoint must have path and method" },
            { status: 400 }
          );
        }

        // Validate JSON response body
        try {
          JSON.parse(endpoint.responseBody);
        } catch {
          return NextResponse.json(
            { error: `Invalid JSON in endpoint ${endpoint.path}` },
            { status: 400 }
          );
        }
      }

      // Generate unique server ID
      const serverId = randomBytes(16).toString("hex");
      const baseUrl = `${process.env.APP_URL || "http://localhost:3000"}/api/mock/${serverId}`;

      // Add IDs to endpoints
      const endpointsWithIds = endpoints.map((ep: any) => ({
        ...ep,
        id: randomBytes(8).toString("hex")
      }));

      const server: MockServer = {
        id: serverId,
        name,
        baseUrl,
        endpoints: endpointsWithIds,
        createdAt: new Date(),
        requestCount: 0
      };

      mockServers.set(serverId, server);

      return NextResponse.json({
        server,
        message: "Mock server created successfully"
      });
    }

    if (action === "request") {
      // Handle mock request
      const { serverId, path, method } = await request.json();
      const server = mockServers.get(serverId);

      if (!server) {
        return NextResponse.json(
          { error: "Server not found" },
          { status: 404 }
        );
      }

      // Find matching endpoint
      const endpoint = server.endpoints.find(
        ep => ep.path === path && ep.method === method
      );

      if (!endpoint) {
        return NextResponse.json(
          { error: "Endpoint not found" },
          { status: 404 }
        );
      }

      // Update request count
      server.requestCount++;

      // Apply delay if specified
      if (endpoint.delay > 0) {
        await new Promise(resolve => setTimeout(resolve, endpoint.delay));
      }

      // Parse and return response
      const responseBody = JSON.parse(endpoint.responseBody);
      
      return NextResponse.json(responseBody, {
        status: endpoint.statusCode,
        headers: endpoint.responseHeaders
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Mock Server POST error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Server ID required" },
        { status: 400 }
      );
    }

    if (!mockServers.has(id)) {
      return NextResponse.json(
        { error: "Server not found" },
        { status: 404 }
      );
    }

    mockServers.delete(id);

    return NextResponse.json({
      message: "Server deleted successfully"
    });
  } catch (error) {
    console.error("Mock Server DELETE error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
