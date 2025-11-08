import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/tools/stats - Get tool usage statistics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30d"; // 7d, 30d, 90d

    // Calculate date range
    const now = new Date();
    const startDate = new Date();

    switch (period) {
      case "7d":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Get tool usage statistics
    const toolStats = await prisma.toolSession.groupBy({
      by: ["toolType"],
      where: {
        userId,
        createdAt: {
          gte: startDate,
        },
      },
      _count: { id: true },
      _sum: { duration: true },
      _avg: { duration: true },
    });

    // Get total sessions and average performance
    const totalStats = await prisma.toolSession.aggregate({
      where: {
        userId,
        createdAt: {
          gte: startDate,
        },
      },
      _count: { id: true },
      _sum: { duration: true },
      _avg: { duration: true },
    });

    // Get success rate
    const successStats = await prisma.toolSession.groupBy({
      by: ["success"],
      where: {
        userId,
        createdAt: {
          gte: startDate,
        },
      },
      _count: { id: true },
    });

    const totalSessions = totalStats._count.id;
    const successfulSessions =
      successStats.find((s) => s.success)?._count.id || 0;
    const successRate =
      totalSessions > 0 ? (successfulSessions / totalSessions) * 100 : 0;

    // Format the response
    const formattedStats = toolStats.map((stat) => ({
      toolType: stat.toolType,
      sessions: stat._count.id,
      totalDuration: stat._sum.duration || 0,
      averageDuration: Math.round(stat._avg.duration || 0),
      successRate: 100, // Individual tool success rates would need more complex calculation
    }));

    return NextResponse.json({
      period,
      startDate: startDate.toISOString(),
      endDate: now.toISOString(),
      summary: {
        totalSessions,
        totalDuration: totalStats._sum.duration || 0,
        averageDuration: Math.round(totalStats._avg.duration || 0),
        successRate: Math.round(successRate * 100) / 100,
        uniqueTools: toolStats.length,
      },
      tools: formattedStats,
    });
  } catch (error) {
    console.error("Error fetching tool stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
