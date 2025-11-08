import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPERADMIN";

    // Get user's tool sessions for the current month
    const currentMonth = new Date();
    currentMonth.setDate(1); // Start of current month

    const toolSessions = await prisma.toolSession.count({
      where: {
        userId,
        createdAt: {
          gte: currentMonth,
        },
      },
    });

    // Get total tool sessions for the user
    const totalSessions = await prisma.toolSession.count({
      where: {
        userId,
      },
    });

    // Get unique tools used this month
    const uniqueToolsThisMonth = await prisma.toolSession.findMany({
      where: {
        userId,
        createdAt: {
          gte: currentMonth,
        },
      },
      select: {
        toolType: true,
      },
      distinct: ["toolType"],
    });

    // Get last activity
    const lastActivity = await prisma.toolSession.findFirst({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        createdAt: true,
      },
    });

    // Get user's API keys count
    const apiKeysCount = await prisma.apiKey.count({
      where: {
        userId,
      },
    });

    // For storage, we'll use a mock calculation since we don't have file storage tracking
    // In a real app, you'd track uploaded files, snippets, etc.
    const storageUsed = Math.max(0.1, (apiKeysCount * 0.01) + (totalSessions * 0.001));

    const userStats = {
      totalApiCalls: totalSessions,
      monthlyLimit: isAdmin ? -1 : 300, // -1 means unlimited
      storageUsed: Math.round(storageUsed * 100) / 100, // Round to 2 decimal places
      storageLimit: isAdmin ? -1 : 1, // GB
      toolsUsed: uniqueToolsThisMonth.length,
      apiKeysCount,
      lastActivity: lastActivity?.createdAt?.toISOString() || null,
      isAdmin,
    };

    return NextResponse.json(userStats);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch user stats" },
      { status: 500 },
    );
  }
}