import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET - Fetch a specific payment page by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    const page = await prisma.paymentPage.findUnique({
      where: { slug },
      include: {
        campaign: {
          select: {
            id: true,
            title: true,
            description: true,
            goalAmount: true,
          }
        }
      }
    })

    if (!page) {
      return NextResponse.json(
        { error: 'Payment page not found' },
        { status: 404 }
      )
    }

    if (!page.isActive || !page.isPublic) {
      return NextResponse.json(
        { error: 'Payment page is not available' },
        { status: 404 }
      )
    }

    // Calculate campaign progress if campaign exists
    let campaignData = null;
    if (page.campaign) {
      const campaignStats = await prisma.donation.aggregate({
        where: {
          campaignId: page.campaign.id,
          status: "COMPLETED"
        },
        _count: { id: true },
        _sum: { amount: true }
      });

      const uniqueDonors = await prisma.donation.findMany({
        where: {
          campaignId: page.campaign.id,
          status: "COMPLETED"
        },
        select: { donorEmail: true },
        distinct: ["donorEmail"]
      });

      // Calculate campaign stats
      const totalRaised = campaignStats._sum?.amount || 0;
      const donorCount = uniqueDonors.length;
      const progressPercentage = page.campaign.goalAmount
        ? Math.min((totalRaised / page.campaign.goalAmount) * 100, 100)
        : 0;

      campaignData = {
        ...page.campaign,
        totalRaised,
        donorCount,
        progressPercentage,
      };
    }

    // Increment view count
    await prisma.paymentPage.update({
      where: { id: page.id },
      data: { viewCount: { increment: 1 } }
    })

    // Return page data with campaign information
    const responseData = {
      ...page,
      campaign: campaignData,
    };

    return NextResponse.json({ page: responseData })
  } catch (error) {
    console.error('Error fetching payment page:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment page' },
      { status: 500 }
    )
  }
}