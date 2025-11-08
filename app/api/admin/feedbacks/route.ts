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
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const feedbackType = searchParams.get("feedbackType");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (status && status !== "all") {
      where.status = status;
    }

    if (feedbackType && feedbackType !== "all") {
      where.feedbackType = feedbackType;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { feedback: { contains: search, mode: "insensitive" } },
        { toolUsed: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get feedbacks with pagination
    const feedbacks = await prisma.feedback.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    // Get total count for pagination
    const totalFeedbacks = await prisma.feedback.count({ where });

    return NextResponse.json({
      feedbacks,
      pagination: {
        page,
        limit,
        total: totalFeedbacks,
        pages: Math.ceil(totalFeedbacks / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedbacks" },
      { status: 500 }
    );
  }
}

// PATCH - Update feedback status
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
    const { feedbackId, status, notes } = body;

    if (!feedbackId) {
      return NextResponse.json(
        { error: "Feedback ID is required" },
        { status: 400 }
      );
    }

    // Update feedback
    const updatedFeedback = await prisma.feedback.update({
      where: { id: feedbackId },
      data: {
        ...(status && { status }),
        ...(notes && { notes }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      feedback: updatedFeedback,
      message: "Feedback updated successfully",
    });
  } catch (error) {
    console.error("Error updating feedback:", error);
    return NextResponse.json(
      { error: "Failed to update feedback" },
      { status: 500 }
    );
  }
}