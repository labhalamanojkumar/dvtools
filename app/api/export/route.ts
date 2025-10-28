import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Validation schema
const exportRequestSchema = z.object({
  type: z.enum(["usage-data", "api-calls", "tool-sessions", "account-data"]),
});

// POST /api/export - Export user data
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type } = exportRequestSchema.parse(body);

    const userId = session.user.id;
    let exportData: any = {};
    let fileName = "";

    switch (type) {
      case "usage-data":
        // Export usage statistics
        const toolUsageStats = await prisma.toolSession.groupBy({
          by: ["toolType"],
          where: { userId },
          _count: { id: true },
          _sum: { duration: true },
        });

        const totalSessions = await prisma.toolSession.count({
          where: { userId },
        });
        const totalDuration = await prisma.toolSession.aggregate({
          where: { userId },
          _sum: { duration: true },
        });

        exportData = {
          type: "usage-data",
          totalSessions,
          totalDurationMs: totalDuration._sum.duration || 0,
          toolBreakdown: toolUsageStats.map((stat) => ({
            toolType: stat.toolType,
            sessions: stat._count.id,
            totalDurationMs: stat._sum.duration || 0,
          })),
        };
        fileName = `usage-data-export-${new Date().toISOString().split("T")[0]}.json`;
        break;

      case "api-calls":
        // Export API call logs (from audit logs)
        const apiCallLogs = await prisma.auditLog.findMany({
          where: {
            userId,
            action: { in: ["API_KEY_CREATED", "API_KEY_REVOKED", "TOOL_USED"] },
          },
          select: {
            action: true,
            resource: true,
            resourceId: true,
            details: true,
            createdAt: true,
            ipAddress: true,
          },
          orderBy: { createdAt: "desc" },
          take: 1000, // Limit to last 1000 entries
        });

        exportData = {
          type: "api-calls",
          logs: apiCallLogs,
        };
        fileName = `api-calls-export-${new Date().toISOString().split("T")[0]}.json`;
        break;

      case "tool-sessions":
        // Export tool usage sessions
        const toolSessions = await prisma.toolSession.findMany({
          where: { userId },
          select: {
            id: true,
            toolType: true,
            duration: true,
            success: true,
            errorMsg: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 1000, // Limit to last 1000 sessions
        });

        exportData = {
          type: "tool-sessions",
          sessions: toolSessions,
        };
        fileName = `tool-sessions-export-${new Date().toISOString().split("T")[0]}.json`;
        break;

      case "account-data":
        // Export account information (excluding sensitive data)
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            status: true,
            emailVerified: true,
            twoFactorEnabled: true,
            createdAt: true,
            updatedAt: true,
            lastLoginAt: true,
            _count: {
              select: {
                toolSessions: true,
                apiKeys: true,
              },
            },
          },
        });

        if (!user) {
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 },
          );
        }

        exportData = {
          type: "account-data",
          user: {
            ...user,
            // Remove sensitive information
            password: undefined,
            twoFactorSecret: undefined,
          },
        };
        fileName = `account-data-export-${new Date().toISOString().split("T")[0]}.json`;
        break;

      default:
        return NextResponse.json(
          { error: "Invalid export type" },
          { status: 400 },
        );
    }

    // Add metadata to the export
    const exportMetadata = {
      exportedAt: new Date().toISOString(),
      userId,
      exportType: type,
      version: "1.0",
    };

    const finalExportData = {
      metadata: exportMetadata,
      data: exportData,
    };

    // Create the JSON blob
    const jsonString = JSON.stringify(finalExportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });

    // In a real implementation, you might want to:
    // 1. Save the export to a temporary file/storage
    // 2. Generate a download URL
    // 3. Send an email with the download link
    // For now, we'll return the data directly

    // Log the export action
    await prisma.auditLog.create({
      data: {
        userId,
        action: "SETTING_CHANGED", // Using existing audit action
        resource: "export",
        resourceId: type,
        details: { exportType: type, fileName },
      },
    });

    return NextResponse.json({
      success: true,
      fileName,
      data: finalExportData,
      message: "Data exported successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 },
      );
    }

    console.error("Error exporting data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// GET /api/export/status - Check export status (for future use with async exports)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // For now, just return available export types
    const availableExports = [
      {
        id: "usage-data",
        title: "Usage Data",
        description: "Export your tool usage statistics and analytics",
      },
      {
        id: "api-calls",
        title: "API Call History",
        description: "Export your API call logs and history",
      },
      {
        id: "tool-sessions",
        title: "Tool Sessions",
        description: "Export your tool usage sessions and timestamps",
      },
      {
        id: "account-data",
        title: "Account Data",
        description: "Export your profile and account information",
      },
    ];

    return NextResponse.json({ availableExports });
  } catch (error) {
    console.error("Error fetching export status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
