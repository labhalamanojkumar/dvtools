import { NextRequest, NextResponse } from "next/server";
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role");
    const status = searchParams.get("status");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role && role !== "all") {
      where.role = role;
    }

    if (status && status !== "all") {
      where.status = status;
    }

    // Get users with counts
    const users = await prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            toolSessions: true,
            apiKeys: true,
            auditLogs: true,
          },
        },
      },
    });

    // Get total count for pagination
    const totalUsers = await prisma.user.count({ where });

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total: totalUsers,
        pages: Math.ceil(totalUsers / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "SUPERADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Super admin access required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, name, role, status } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Validate role
    if (role && !["USER", "ADMIN", "SUPERADMIN"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be USER, ADMIN, or SUPERADMIN" },
        { status: 400 }
      );
    }

    // Validate status
    if (status && !["ACTIVE", "SUSPENDED", "BANNED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be ACTIVE, SUSPENDED, or BANNED" },
        { status: 400 }
      );
    }

    // Prevent super admin from demoting themselves
    if (userId === session.user.id && role && role !== "SUPERADMIN") {
      return NextResponse.json(
        { error: "You cannot change your own super admin role" },
        { status: 400 }
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name }),
        ...(role && { role }),
        ...(status && { status }),
        updatedAt: new Date(),
      },
      include: {
        _count: {
          select: {
            toolSessions: true,
            apiKeys: true,
            auditLogs: true,
          },
        },
      },
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "USER_UPDATED",
        details: `Updated user ${updatedUser.email}: ${JSON.stringify({
          name: name !== undefined,
          role: role !== undefined,
          status: status !== undefined,
        })}`,
        ipAddress: request.headers.get("x-forwarded-for") ||
                  request.headers.get("x-real-ip") ||
                  "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      },
    });

    return NextResponse.json({
      user: updatedUser,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "SUPERADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Super admin access required." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Prevent super admin from deleting themselves
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: "You cannot delete your own account" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Soft delete by setting status to BANNED (or you could hard delete)
    // For now, we'll use soft delete to preserve data integrity
    await prisma.user.update({
      where: { id: userId },
      data: {
        status: "BANNED",
        updatedAt: new Date(),
      },
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "USER_BANNED",
        details: `Banned user ${user.email}`,
        ipAddress: request.headers.get("x-forwarded-for") ||
                  request.headers.get("x-real-ip") ||
                  "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      },
    });

    return NextResponse.json({
      message: "User banned successfully",
    });
  } catch (error) {
    console.error("Error banning user:", error);
    return NextResponse.json(
      { error: "Failed to ban user" },
      { status: 500 }
    );
  }
}
