import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Get total users
    const totalUsers = await prisma.user.count();

    // Get total tool sessions
    const totalToolUses = await prisma.toolSession.count();

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

    // Get average session duration
    const avgDurationResult = await prisma.toolSession.aggregate({
      _avg: {
        duration: true,
      },
    });

    const avgDuration = avgDurationResult._avg.duration || 0;

    // Calculate change percentages (mock for now, could compare with previous period)
    const stats = {
      totalUsers: {
        value: totalUsers,
        change: "+12%", // TODO: calculate real change
      },
      totalToolUses: {
        value: totalToolUses,
        change: "+8%", // TODO: calculate real change
      },
      popularTool: {
        value: popularTool[0]?.toolType || "None",
        percentage: popularTool[0]
          ? Math.round((popularTool[0]._count.toolType / totalToolUses) * 100)
          : 0,
      },
      avgSessionTime: {
        value: Math.round(avgDuration / 1000), // in seconds
        change: "+5%", // TODO: calculate real change
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
