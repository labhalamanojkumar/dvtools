import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET - Fetch all donation campaigns
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "SUPERADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - SUPERADMIN access required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const includeStats = searchParams.get("includeStats") === "true";
    const isActive = searchParams.get("isActive");
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    const where: any = {};
    
    if (isActive !== null) {
      where.isActive = isActive === "true";
    }
    
    if (category) {
      where.category = category;
    }
    
    if (featured !== null) {
      where.featured = featured === "true";
    }

    let campaigns = await prisma.donationCampaign.findMany({
      where,
      orderBy: [
        { featured: "desc" },
        { priority: "desc" },
        { createdAt: "desc" }
      ],
      include: {
        paymentPages: {
          select: {
            id: true,
            title: true,
            slug: true,
            isActive: true,
            isPublic: true
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

        // Type-safe access to aggregate results
        campaign.donationCount = (donationStats._count && typeof donationStats._count === 'object')
          ? (donationStats._count as any).id || 0
          : 0;
        campaign.totalRaised = donationStats._sum?.amount || 0;
        campaign.donorCount = uniqueDonorStats.length;
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

// POST - Create a new donation campaign
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "SUPERADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - SUPERADMIN access required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      goalAmount,
      currency = "USD",
      startDate,
      endDate,
      imageUrl,
      category,
      tags,
      featured = false,
      priority = 0,
      customSettings,
      isActive = true,
      isPublic = true
    } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // Validate goal amount if provided
    if (goalAmount && goalAmount < 0) {
      return NextResponse.json(
        { error: "Goal amount cannot be negative" },
        { status: 400 }
      );
    }

    // Validate dates
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return NextResponse.json(
        { error: "End date must be after start date" },
        { status: 400 }
      );
    }

    // Create the campaign
    const campaign = await prisma.donationCampaign.create({
      data: {
        title,
        description,
        goalAmount,
        currency,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        imageUrl,
        category,
        tags,
        featured,
        priority,
        customSettings,
        isActive,
        isPublic,
        createdBy: session.user?.email || "system",
      },
      include: {
        paymentPages: {
          select: {
            id: true,
            title: true,
            slug: true,
            isActive: true,
            isPublic: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      campaign,
    });
  } catch (error) {
    console.error("Error creating donation campaign:", error);
    return NextResponse.json(
      { error: "Failed to create donation campaign" },
      { status: 500 }
    );
  }
}