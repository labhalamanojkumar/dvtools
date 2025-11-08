import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Get tool usage stats for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get tool usage grouped by tool type
    const toolUsage = await prisma.toolSession.groupBy({
      by: ["toolType"],
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      _count: {
        toolType: true,
      },
      orderBy: {
        _count: {
          toolType: "desc",
        },
      },
      take: 6, // Top 6 tools
    });

    // Get previous period data for comparison
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const previousToolUsage = await prisma.toolSession.groupBy({
      by: ["toolType"],
      where: {
        createdAt: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo,
        },
      },
      _count: {
        toolType: true,
      },
    });

    // Calculate change percentages
    const calculateChange = (current: number, previous: number): string => {
      if (previous === 0) return current > 0 ? "+100%" : "0%";
      const change = ((current - previous) / previous) * 100;
      const sign = change >= 0 ? "+" : "";
      return `${sign}${change.toFixed(1)}%`;
    };

    // Map tool types to display names and colors
    const toolDisplayNames: Record<string, string> = {
      "json-formatter": "JSON Formatter",
      "base64": "Base64 Encoder",
      "jwt-decoder": "JWT Decoder",
      "regexp-tester": "RegExp Tester",
      "url-encoder": "URL Encoder",
      "hash-generator": "Hash Generator",
      "code-formatting": "Code Formatting",
      "linter-runner": "Linter Runner",
      "mock-data-generator": "Mock Data Generator",
      "api-simulator": "API Simulator",
      "image-editor": "Image Editor",
      "color-palette-studio": "Color Palette Studio",
    };

    const toolColors: Record<string, string> = {
      "json-formatter": "bg-blue-500",
      "base64": "bg-green-500",
      "jwt-decoder": "bg-purple-500",
      "regexp-tester": "bg-orange-500",
      "url-encoder": "bg-red-500",
      "hash-generator": "bg-yellow-500",
      "code-formatting": "bg-indigo-500",
      "linter-runner": "bg-pink-500",
      "mock-data-generator": "bg-teal-500",
      "api-simulator": "bg-cyan-500",
      "image-editor": "bg-lime-500",
      "color-palette-studio": "bg-emerald-500",
    };

    const stats = toolUsage.map((tool) => {
      const previousCount = previousToolUsage.find(p => p.toolType === tool.toolType)?._count.toolType || 0;
      const change = calculateChange(tool._count.toolType, previousCount);
      const trend = change.startsWith("+") ? "up" : "down";

      return {
        tool: toolDisplayNames[tool.toolType] || tool.toolType,
        calls: tool._count.toolType,
        change,
        trend,
        color: toolColors[tool.toolType] || "bg-gray-500",
      };
    });

    // Get total monthly usage for progress calculation
    const totalMonthlyUsage = await prisma.toolSession.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    // Assume monthly limit is 300 for demo purposes
    const monthlyLimit = 300;
    const usagePercentage = Math.min((totalMonthlyUsage / monthlyLimit) * 100, 100);

    return NextResponse.json({
      stats,
      monthlyUsage: {
        current: totalMonthlyUsage,
        limit: monthlyLimit,
        percentage: usagePercentage,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard usage stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch usage stats" },
      { status: 500 },
    );
  }
}