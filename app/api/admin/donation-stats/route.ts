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

    // Get donation statistics
    const [
      totalDonations,
      totalAmount,
      donorCount,
      pendingContacts,
      pendingFeedback,
    ] = await Promise.all([
      // Total donations
      prisma.donation.count(),
      
      // Total donation amount (completed donations only)
      prisma.donation.aggregate({
        where: { status: "COMPLETED" },
        _sum: { amount: true },
      }),
      
      // Unique donor count
      prisma.donation.findMany({
        where: { status: "COMPLETED" },
        select: { donorEmail: true },
        distinct: ["donorEmail"],
      }).then(donations => donations.length),
      
      // Pending contacts
      prisma.contact.count({
        where: { status: "PENDING" },
      }),
      
      // Pending feedback
      prisma.feedback.count({
        where: { status: "PENDING" },
      }),
    ]);

    const stats = {
      totalDonations,
      totalAmount: totalAmount._sum.amount || 0,
      donorCount,
      pendingContacts,
      pendingFeedback,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching donation stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch donation stats" },
      { status: 500 }
    );
  }
}