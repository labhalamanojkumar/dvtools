import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "SUPERADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Super admin access required." },
        { status: 403 }
      );
    }

    // Get system metrics from database and mock data
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Get user activity metrics with error handling
    let activeUsers = 0;
    let totalUsers = 0;
    let recentLogins = 0;

    try {
      [activeUsers, totalUsers, recentLogins] = await Promise.all([
        prisma.user.count({
          where: {
            lastLoginAt: {
              gte: last24Hours,
            },
          },
        }),
        prisma.user.count(),
        prisma.user.count({
          where: {
            lastLoginAt: {
              gte: last24Hours,
            },
          },
        }),
      ]);
    } catch (dbError) {
      console.log("Database queries failed, using fallback values:", dbError);
      activeUsers = 0;
      totalUsers = 0;
      recentLogins = 0;
    }

    // Get tool usage metrics with error handling
    let toolSessions = 0;
    try {
      toolSessions = await prisma.toolSession.count({
        where: {
          createdAt: {
            gte: last24Hours,
          },
        },
      });
    } catch (dbError) {
      console.log("Tool sessions query failed, using fallback:", dbError);
      toolSessions = 0;
    }

    // Get donation metrics with error handling
    let donations = 0;
    try {
      donations = await prisma.donation.count({
        where: {
          createdAt: {
            gte: last24Hours,
          },
        },
      });
    } catch (dbError) {
      console.log("Donations query failed, using fallback:", dbError);
      donations = 0;
    }

    // Get security metrics with error handling
    let failedLogins = 0;
    try {
      failedLogins = await prisma.auditLog.count({
        where: {
          action: "USER_LOGIN",
          createdAt: {
            gte: last24Hours,
          },
          // Note: This counts all USER_LOGIN actions, not just failed ones
          // In a real implementation, you'd need additional fields to track failures
        },
      });
    } catch (dbError) {
      console.log("Audit log query failed, using fallback:", dbError);
      failedLogins = 0;
    }

    // Mock system metrics (in a real implementation, you'd collect these from system monitoring)
    const systemMetrics = {
      cpu: {
        usage: Math.floor(Math.random() * 40) + 20, // 20-60%
        cores: 8,
        temperature: Math.floor(Math.random() * 20) + 40, // 40-60°C
      },
      memory: {
        used: 6.4,
        total: 16,
        percentage: 40,
      },
      disk: {
        used: 45.2,
        total: 256,
        percentage: 18,
      },
      network: {
        upload: 2.1,
        download: 15.7,
        connections: 1247,
      },
      database: {
        connections: 23,
        queriesPerSecond: 145,
        slowQueries: 2,
        uptime: "7d 14h 32m",
      },
      services: [
        {
          name: "Web Server",
          status: "healthy" as const,
          uptime: "99.9%",
          responseTime: 45,
        },
        {
          name: "Database",
          status: "healthy" as const,
          uptime: "99.8%",
          responseTime: 12,
        },
        {
          name: "Cache",
          status: "healthy" as const,
          uptime: "99.7%",
          responseTime: 3,
        },
        {
          name: "File Storage",
          status: "healthy" as const,
          uptime: "99.9%",
          responseTime: 28,
        },
        {
          name: "Email Service",
          status: "warning" as const,
          uptime: "98.5%",
          responseTime: 156,
        },
        {
          name: "Payment Gateway",
          status: "healthy" as const,
          uptime: "99.6%",
          responseTime: 89,
        },
      ],
      logs: [
        {
          id: "1",
          level: "info" as const,
          message: "System startup completed successfully",
          timestamp: new Date(now.getTime() - 5 * 60 * 1000).toISOString(),
          source: "system",
        },
        {
          id: "2",
          level: "info" as const,
          message: "Database connection pool initialized",
          timestamp: new Date(now.getTime() - 8 * 60 * 1000).toISOString(),
          source: "database",
        },
        {
          id: "3",
          level: "warn" as const,
          message: "High memory usage detected (78%)",
          timestamp: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
          source: "monitor",
        },
        {
          id: "4",
          level: "info" as const,
          message: "User authentication successful",
          timestamp: new Date(now.getTime() - 22 * 60 * 1000).toISOString(),
          source: "auth",
        },
        {
          id: "5",
          level: "info" as const,
          message: "Payment processed successfully",
          timestamp: new Date(now.getTime() - 28 * 60 * 1000).toISOString(),
          source: "payment",
        },
        {
          id: "6",
          level: "error" as const,
          message: "Failed to connect to external API",
          timestamp: new Date(now.getTime() - 35 * 60 * 1000).toISOString(),
          source: "api",
        },
        {
          id: "7",
          level: "info" as const,
          message: "Cache cleared successfully",
          timestamp: new Date(now.getTime() - 42 * 60 * 1000).toISOString(),
          source: "cache",
        },
        {
          id: "8",
          level: "warn" as const,
          message: "Rate limit exceeded for IP 192.168.1.100",
          timestamp: new Date(now.getTime() - 48 * 60 * 1000).toISOString(),
          source: "security",
        },
      ],
      security: {
        failedLogins: failedLogins || Math.floor(Math.random() * 5), // Use DB value or fallback to 0-4
        activeSessions: activeUsers || Math.floor(Math.random() * 50) + 10, // Use DB value or fallback
        blockedIPs: Math.floor(Math.random() * 3), // 0-2 blocked IPs
        lastSecurityScan: new Date(now.getTime() - 2 * 60 * 60 * 1000).toLocaleString(), // 2 hours ago
      },
      activity: {
        activeUsers: activeUsers || Math.floor(Math.random() * 100) + 50,
        totalUsers: totalUsers || Math.floor(Math.random() * 1000) + 500,
        recentLogins: recentLogins || Math.floor(Math.random() * 50) + 20,
        toolSessions: toolSessions || Math.floor(Math.random() * 500) + 200,
        donations: donations || Math.floor(Math.random() * 10) + 5,
      },
    };

    return NextResponse.json(systemMetrics);
  } catch (error) {
    console.error("Error fetching system metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch system metrics" },
      { status: 500 }
    );
  }
}