import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Get recent tool sessions (last 5 activities)
    const recentSessions = await prisma.toolSession.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    // Map tool types to display names and icons
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

    const toolIcons: Record<string, string> = {
      "json-formatter": "FileText",
      "base64": "Key",
      "jwt-decoder": "Code",
      "regexp-tester": "Code",
      "url-encoder": "Globe",
      "hash-generator": "Shield",
      "code-formatting": "Code",
      "linter-runner": "CheckCircle",
      "mock-data-generator": "Database",
      "api-simulator": "Zap",
      "image-editor": "Image",
      "color-palette-studio": "Palette",
    };

    const toolColors: Record<string, string> = {
      "json-formatter": "text-blue-500",
      "base64": "text-green-500",
      "jwt-decoder": "text-purple-500",
      "regexp-tester": "text-red-500",
      "url-encoder": "text-orange-500",
      "hash-generator": "text-yellow-500",
      "code-formatting": "text-indigo-500",
      "linter-runner": "text-pink-500",
      "mock-data-generator": "text-teal-500",
      "api-simulator": "text-cyan-500",
      "image-editor": "text-lime-500",
      "color-palette-studio": "text-emerald-500",
    };

    const activities = recentSessions.map((session, index) => {
      const toolName = toolDisplayNames[session.toolType] || session.toolType;
      const action = `Used ${toolName}`;
      const timestamp = getRelativeTime(session.createdAt);

      return {
        id: session.id,
        action,
        tool: toolName,
        timestamp,
        icon: toolIcons[session.toolType] || "Activity",
        color: toolColors[session.toolType] || "text-gray-500",
      };
    });

    return NextResponse.json({
      activities,
      total: activities.length,
    });
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent activity" },
      { status: 500 },
    );
  }
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString();
}