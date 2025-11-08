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
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (status && status !== "all") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { donorName: { contains: search, mode: "insensitive" } },
        { donorEmail: { contains: search, mode: "insensitive" } },
        { tierId: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get donations with pagination
    const donations = await prisma.donation.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    // Get total count for pagination
    const totalDonations = await prisma.donation.count({ where });

    return NextResponse.json({
      donations,
      pagination: {
        page,
        limit,
        total: totalDonations,
        pages: Math.ceil(totalDonations / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching donations:", error);
    return NextResponse.json(
      { error: "Failed to fetch donations" },
      { status: 500 }
    );
  }
}

// PATCH - Update donation status
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
    const { donationId, status } = body;

    if (!donationId) {
      return NextResponse.json(
        { error: "Donation ID is required" },
        { status: 400 }
      );
    }

    // Validate status
    if (status && !["PENDING", "COMPLETED", "FAILED", "REFUNDED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be PENDING, COMPLETED, FAILED, or REFUNDED" },
        { status: 400 }
      );
    }

    // Update donation
    const updatedDonation = await prisma.donation.update({
      where: { id: donationId },
      data: {
        ...(status && { status }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      donation: updatedDonation,
      message: "Donation updated successfully",
    });
  } catch (error) {
    console.error("Error updating donation:", error);
    return NextResponse.json(
      { error: "Failed to update donation" },
      { status: 500 }
    );
  }
}