import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Get current period stats
    const totalUsers = await prisma.user.count();
    const totalToolUses = await prisma.toolSession.count();

    // Get previous period stats (last 30 days vs previous 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    // Previous period user count
    const previousUsers = await prisma.user.count({
      where: {
        createdAt: {
          lt: thirtyDaysAgo,
          gte: sixtyDaysAgo,
        },
      },
    });

    // Previous period tool uses
    const previousToolUses = await prisma.toolSession.count({
      where: {
        createdAt: {
          lt: thirtyDaysAgo,
          gte: sixtyDaysAgo,
        },
      },
    });

    // Previous period average session duration
    const previousAvgDurationResult = await prisma.toolSession.aggregate({
      where: {
        createdAt: {
          lt: thirtyDaysAgo,
          gte: sixtyDaysAgo,
        },
      },
      _avg: {
        duration: true,
      },
    });

    const previousAvgDuration = previousAvgDurationResult._avg.duration || 0;

    // Get popular tool
    const popularTool = await prisma.toolSession.groupBy({
      by: ["toolType"],
      _count: {
        toolType: true,
      },
      orderBy: {
        _count: {
          toolType: "desc",
        },
      },
      take: 1,
    });

    // Get average session duration for current period
    const avgDurationResult = await prisma.toolSession.aggregate({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      _avg: {
        duration: true,
      },
    });

    const avgDuration = avgDurationResult._avg.duration || 0;

    // Calculate change percentages
    const calculateChange = (current: number, previous: number): string => {
      if (previous === 0) return current > 0 ? "+100%" : "0%";
      const change = ((current - previous) / previous) * 100;
      const sign = change >= 0 ? "+" : "";
      return `${sign}${change.toFixed(1)}%`;
    };

    const stats = {
      totalUsers: {
        value: totalUsers,
        change: calculateChange(totalUsers, previousUsers),
      },
      totalToolUses: {
        value: totalToolUses,
        change: calculateChange(totalToolUses, previousToolUses),
      },
      popularTool: {
        value: popularTool[0]?.toolType || "None",
        percentage: popularTool[0]
          ? Math.round((popularTool[0]._count.toolType / totalToolUses) * 100)
          : 0,
      },
      avgSessionTime: {
        value: Math.round(avgDuration / 1000), // in seconds
        change: calculateChange(avgDuration, previousAvgDuration),
      },
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 },
    );
  }
}
