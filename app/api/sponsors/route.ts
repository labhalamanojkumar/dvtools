import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
export const dynamic = 'force-dynamic';

// GET - Fetch all active sponsors
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const tier = searchParams.get('tier')
    const limit = searchParams.get('limit')

    const where: any = {
      isActive: true
    }

    if (featured === 'true') {
      where.isFeatured = true
    }

    if (tier) {
      where.tier = tier
    }

    const sponsors = await prisma.sponsor.findMany({
      where,
      orderBy: [
        { isFeatured: 'desc' },
        { displayOrder: 'asc' },
        { createdAt: 'desc' }
      ],
      take: limit ? parseInt(limit) : undefined
    })

    return NextResponse.json({ sponsors })
  } catch (error) {
    console.error('Error fetching sponsors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sponsors' },
      { status: 500 }
    )
  }
}

// POST - Create a new sponsor (public endpoint for automatic creation from donations)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      company,
      website,
      logo,
      amount,
      tier,
      description,
      message,
      isFeatured = false,
      displayOrder = 0,
      startDate,
      endDate,
      donationId
    } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    // Create the sponsor
    const sponsor = await prisma.sponsor.create({
      data: {
        name,
        email,
        company,
        website,
        logo,
        amount,
        tier,
        description,
        message,
        isFeatured,
        displayOrder,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        donationId
      }
    })

    return NextResponse.json({
      success: true,
      sponsor,
    })
  } catch (error) {
    console.error('Error creating sponsor:', error)
    return NextResponse.json(
      { error: 'Failed to create sponsor' },
      { status: 500 }
    )
  }
}