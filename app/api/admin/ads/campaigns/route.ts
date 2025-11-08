import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - Fetch all ad campaigns for admin
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - SUPERADMIN access required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const vendorId = searchParams.get('vendorId')
    const isActive = searchParams.get('isActive')

    const where: any = {}
    
    if (status) {
      where.status = status
    }
    
    if (vendorId) {
      where.vendorId = vendorId
    }

    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }

    const campaigns = await prisma.adCampaign.findMany({
      where,
      orderBy: [
        { isFeatured: 'desc' },
        { priority: 'desc' },
        { createdAt: 'desc' }
      ],
      select: {
        id: true,
        name: true,
        status: true,
        title: true,
        contentDescription: true,
        imageUrl: true,
        fallbackImage: true,
        videoUrl: true,
        htmlCode: true,
        linkUrl: true,
        callToAction: true,
        views: true,
        clicks: true,
        conversions: true,
        revenue: true,
        priority: true,
        isFeatured: true,
        responsive: true,
        deviceTypes: true,
        startDate: true,
        endDate: true,
        budget: true,
        impressions: true,
        targetClicks: true,
        createdAt: true,
        updatedAt: true,
        vendor: {
          select: {
            id: true,
            name: true,
            type: true
          }
        },
        placements: {
          select: {
            id: true,
            key: true,
            name: true
          }
        },
        _count: {
          select: {
            analytics: true
          }
        }
      }
    })

    return NextResponse.json({ campaigns })
  } catch (error) {
    console.error('Error fetching ad campaigns:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ad campaigns' },
      { status: 500 }
    )
  }
}

// POST - Create a new ad campaign (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - SUPERADMIN access required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      name,
      vendorId,
      status = 'DRAFT',
      title,
      contentDescription,
      imageUrl,
      fallbackImage,
      videoUrl,
      htmlCode,
      linkUrl,
      callToAction,
      startDate,
      endDate,
      budget,
      impressions,
      targetClicks,
      priority = 0,
      isFeatured = false,
      responsive = true,
      deviceTypes = [],
      placementIds = []
    } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    if (!vendorId) {
      return NextResponse.json(
        { error: 'Vendor ID is required' },
        { status: 400 }
      )
    }

    // Check if vendor exists
    const vendor = await prisma.adVendor.findUnique({
      where: { id: vendorId }
    })

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    // Create the campaign
    const campaign = await prisma.adCampaign.create({
      data: {
        name,
        vendorId,
        status,
        title,
        contentDescription,
        imageUrl,
        fallbackImage,
        videoUrl,
        htmlCode,
        linkUrl,
        callToAction,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        budget,
        impressions,
        targetClicks,
        priority,
        isFeatured,
        responsive,
        deviceTypes: deviceTypes.length > 0 ? deviceTypes : null
      }
    })

    // Connect to placements if provided
    if (placementIds.length > 0) {
      await prisma.adCampaign.update({
        where: { id: campaign.id },
        data: {
          placements: {
            connect: placementIds.map((id: string) => ({ id }))
          }
        }
      })
    }

    return NextResponse.json({
      success: true,
      campaign,
    })
  } catch (error) {
    console.error('Error creating ad campaign:', error)
    return NextResponse.json(
      { error: 'Failed to create ad campaign' },
      { status: 500 }
    )
  }
}

// PUT - Update an existing ad campaign
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - SUPERADMIN access required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const body = await request.json()
    
    // Support ID from both query params and request body
    const id = searchParams.get('id') || body.id
    
    const {
      name,
      status,
      title,
      contentDescription,
      imageUrl,
      fallbackImage,
      videoUrl,
      htmlCode,
      linkUrl,
      callToAction,
      startDate,
      endDate,
      budget,
      impressions,
      targetClicks,
      priority,
      isFeatured,
      responsive,
      deviceTypes,
      placementIds
    } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Campaign ID is required (query param or request body)' },
        { status: 400 }
      )
    }

    // Check if campaign exists
    const existingCampaign = await prisma.adCampaign.findUnique({
      where: { id }
    })

    if (!existingCampaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }

    // Update the campaign
    const campaign = await prisma.adCampaign.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(status && { status }),
        ...(title !== undefined && { title }),
        ...(contentDescription !== undefined && { contentDescription }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(fallbackImage !== undefined && { fallbackImage }),
        ...(videoUrl !== undefined && { videoUrl }),
        ...(htmlCode !== undefined && { htmlCode }),
        ...(linkUrl !== undefined && { linkUrl }),
        ...(callToAction !== undefined && { callToAction }),
        ...(startDate !== undefined && { startDate: startDate ? new Date(startDate) : null }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
        ...(budget !== undefined && { budget }),
        ...(impressions !== undefined && { impressions }),
        ...(targetClicks !== undefined && { targetClicks }),
        ...(priority !== undefined && { priority }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(responsive !== undefined && { responsive }),
        ...(deviceTypes && { deviceTypes }),
        updatedAt: new Date()
      }
    })

    // Update placements if provided
    if (placementIds) {
      await prisma.adCampaign.update({
        where: { id },
        data: {
          placements: {
            set: [], // Clear existing connections
            connect: placementIds.map((id: string) => ({ id }))
          }
        }
      })
    }

    return NextResponse.json({
      success: true,
      campaign,
    })
  } catch (error) {
    console.error('Error updating ad campaign:', error)
    return NextResponse.json(
      { error: 'Failed to update ad campaign' },
      { status: 500 }
    )
  }
}

// DELETE - Delete an ad campaign
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - SUPERADMIN access required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      )
    }

    // Check if campaign exists
    const existingCampaign = await prisma.adCampaign.findUnique({
      where: { id }
    })

    if (!existingCampaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }

    await prisma.adCampaign.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Campaign deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting ad campaign:', error)
    return NextResponse.json(
      { error: 'Failed to delete ad campaign' },
      { status: 500 }
    )
  }
}