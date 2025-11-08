import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/db";

// GET - Fetch public donation campaigns
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeStats = searchParams.get("includeStats") === "true";
    const featured = searchParams.get("featured");
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: any = {
      isActive: true,
      isPublic: true
    };
    
    if (featured === "true") {
      where.featured = true;
    }
    
    if (category) {
      where.category = category;
    }

    // Filter out expired campaigns
    const now = new Date();
    where.OR = [
      { endDate: null },
      { endDate: { gte: now } }
    ];

    let campaigns = await prisma.donationCampaign.findMany({
      where,
      orderBy: [
        { featured: "desc" },
        { priority: "desc" },
        { createdAt: "desc" }
      ],
      take: limit,
      include: {
        paymentPages: {
          where: {
            isActive: true,
            isPublic: true
          },
          select: {
            id: true,
            title: true,
            slug: true,
            amount: true,
            currency: true,
            imageUrl: true,
            customMessage: true
          }
        }
      }
    });

    // Calculate live stats if requested
    if (includeStats) {
      for (const campaign of campaigns) {
        const donationStats = await prisma.donation.aggregate({
          where: { 
            campaignId: campaign.id,
            status: "COMPLETED"
          },
          _count: { id: true },
          _sum: { amount: true }
        });

        const uniqueDonorStats = await prisma.donation.findMany({
          where: {
            campaignId: campaign.id,
            status: "COMPLETED"
          },
          select: { donorEmail: true },
          distinct: ["donorEmail"]
        });

        // Type assertion for campaign with additional properties
        const campaignWithStats = campaign as any;
        campaignWithStats.donationCount = donationStats._count.id;
        campaignWithStats.totalRaised = donationStats._sum.amount || 0;
        campaignWithStats.donorCount = uniqueDonorStats.length;

        // Calculate progress percentage
        if (campaign.goalAmount && campaign.goalAmount > 0) {
          campaignWithStats.progressPercentage = Math.min(100, (campaignWithStats.totalRaised / campaign.goalAmount) * 100);
        } else {
          campaignWithStats.progressPercentage = 0;
        }
      }
    }

    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error("Error fetching donation campaigns:", error);
    return NextResponse.json(
      { error: "Failed to fetch donation campaigns" },
      { status: 500 }
    );
  }
}