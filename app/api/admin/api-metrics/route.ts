import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Get recent tool sessions as API requests
    const recentSessions = await prisma.toolSession.findMany({
      take: 20,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    // Calculate metrics
    const totalRequests = await prisma.toolSession.count();
    const avgResponseTime = await prisma.toolSession.aggregate({
      _avg: {
        duration: true,
      },
    });

    // Mock error rate (in real app, track errors)
    const errorRate = 2.3;

    // Calculate requests per minute (last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentCount = await prisma.toolSession.count({
      where: {
        createdAt: {
          gte: oneHourAgo,
        },
      },
    });
    const requestsPerMinute = Math.round(recentCount / 60);

    // Top endpoints (tools)
    const topTools = await prisma.toolSession.groupBy({
      by: ["toolType"],
      _count: {
        toolType: true,
      },
      _avg: {
        duration: true,
      },
      orderBy: {
        _count: {
          toolType: "desc",
        },
      },
      take: 5,
    });

    const topEndpoints = topTools.map((tool) => ({
      endpoint: `/api/tools/${tool.toolType.toLowerCase().replace("_", "-")}`,
      count: tool._count.toolType,
      avgTime: Math.round(tool._avg.duration || 0),
    }));

    // Recent requests
    const recentRequests = recentSessions.map((session) => ({
      id: session.id,
      method: "POST" as const,
      endpoint: `/api/tools/${session.toolType.toLowerCase().replace("_", "-")}`,
      status: session.success ? 200 : 500,
      responseTime: session.duration || 100,
      timestamp: session.createdAt.toISOString(),
      userAgent: session.userAgent || "Unknown",
      ip: session.ipAddress || "Unknown",
    }));

    const metrics = {
      totalRequests,
      avgResponseTime: Math.round(avgResponseTime._avg.duration || 0),
      errorRate,
      requestsPerMinute,
      topEndpoints,
      recentRequests,
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error("Error fetching API metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch API metrics" },
      { status: 500 },
    );
  }
}
