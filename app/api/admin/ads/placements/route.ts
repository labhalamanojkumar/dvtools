import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - Fetch all ad placements for admin
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
    const type = searchParams.get('type')
    const isActive = searchParams.get('isActive')

    const where: any = {}
    
    if (type) {
      where.type = type
    }
    
    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }

    const placements = await prisma.adPlacement.findMany({
      where,
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' }
      ],
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            type: true
          }
        },
        campaigns: {
          select: {
            id: true,
            name: true,
            status: true
          }
        },
        _count: {
          select: {
            campaigns: true,
            analytics: true
          }
        }
      }
    })

    return NextResponse.json({ placements })
  } catch (error) {
    console.error('Error fetching ad placements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ad placements' },
      { status: 500 }
    )
  }
}

// POST - Create a new ad placement (admin only)
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
      key,
      description,
      type,
      width,
      height,
      htmlClass,
      isActive = true,
      sortOrder = 0,
      maxAds = 1,
      refreshInterval,
      responsive = true,
      fallbackImage,
      fallbackUrl,
      vendorId,
      pages = [],
      deviceTypes = [],
      targetingRules = {}
    } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    if (!key) {
      return NextResponse.json(
        { error: 'Key is required' },
        { status: 400 }
      )
    }

    if (!type) {
      return NextResponse.json(
        { error: 'Type is required' },
        { status: 400 }
      )
    }

    // Check if key is unique
    const existingPlacement = await prisma.adPlacement.findUnique({
      where: { key }
    })

    if (existingPlacement) {
      return NextResponse.json(
        { error: 'Placement key already exists' },
        { status: 400 }
      )
    }

    // Check if vendor exists (if provided)
    if (vendorId) {
      const vendor = await prisma.adVendor.findUnique({
        where: { id: vendorId }
      })

      if (!vendor) {
        return NextResponse.json(
          { error: 'Vendor not found' },
          { status: 404 }
        )
      }
    }

    // Create the placement
    const placement = await prisma.adPlacement.create({
      data: {
        name,
        key,
        description,
        type,
        width: width ? parseInt(width) : null,
        height: height ? parseInt(height) : null,
        htmlClass,
        isActive,
        sortOrder: parseInt(sortOrder) || 0,
        maxAds: parseInt(maxAds) || 1,
        refreshInterval: refreshInterval ? parseInt(refreshInterval) : null,
        responsive,
        fallbackImage,
        fallbackUrl,
        vendorId,
        pages: pages.length > 0 ? pages : null,
        deviceTypes: deviceTypes.length > 0 ? deviceTypes : null,
        targetingRules: Object.keys(targetingRules).length > 0 ? targetingRules : null
      }
    })

    return NextResponse.json({
      success: true,
      placement,
    })
  } catch (error) {
    console.error('Error creating ad placement:', error)
    return NextResponse.json(
      { error: 'Failed to create ad placement' },
      { status: 500 }
    )
  }
}

// PUT - Update an existing ad placement
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
      key,
      description,
      type,
      width,
      height,
      htmlClass,
      isActive,
      sortOrder,
      maxAds,
      refreshInterval,
      responsive,
      fallbackImage,
      fallbackUrl,
      vendorId,
      pages,
      deviceTypes,
      targetingRules
    } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Placement ID is required (query param or request body)' },
        { status: 400 }
      )
    }

    // Check if placement exists
    const existingPlacement = await prisma.adPlacement.findUnique({
      where: { id }
    })

    if (!existingPlacement) {
      return NextResponse.json(
        { error: 'Placement not found' },
        { status: 404 }
      )
    }

    // Check if key is unique (if changed)
    if (key && key !== existingPlacement.key) {
      const keyExists = await prisma.adPlacement.findUnique({
        where: { key }
      })

      if (keyExists) {
        return NextResponse.json(
          { error: 'Placement key already exists' },
          { status: 400 }
        )
      }
    }

    // Update the placement
    const placement = await prisma.adPlacement.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(key && { key }),
        ...(description !== undefined && { description }),
        ...(type && { type }),
        ...(width !== undefined && { width: width ? parseInt(width) : null }),
        ...(height !== undefined && { height: height ? parseInt(height) : null }),
        ...(htmlClass !== undefined && { htmlClass }),
        ...(isActive !== undefined && { isActive }),
        ...(sortOrder !== undefined && { sortOrder: parseInt(sortOrder) || 0 }),
        ...(maxAds !== undefined && { maxAds: parseInt(maxAds) || 1 }),
        ...(refreshInterval !== undefined && { refreshInterval: refreshInterval ? parseInt(refreshInterval) : null }),
        ...(responsive !== undefined && { responsive }),
        ...(fallbackImage !== undefined && { fallbackImage }),
        ...(fallbackUrl !== undefined && { fallbackUrl }),
        ...(vendorId !== undefined && { vendorId }),
        ...(pages !== undefined && { pages: pages.length > 0 ? pages : null }),
        ...(deviceTypes !== undefined && { deviceTypes: deviceTypes.length > 0 ? deviceTypes : null }),
        ...(targetingRules !== undefined && { targetingRules: Object.keys(targetingRules).length > 0 ? targetingRules : null }),
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      placement,
    })
  } catch (error) {
    console.error('Error updating ad placement:', error)
    return NextResponse.json(
      { error: 'Failed to update ad placement' },
      { status: 500 }
    )
  }
}

// DELETE - Delete an ad placement
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
        { error: 'Placement ID is required' },
        { status: 400 }
      )
    }

    // Check if placement exists
    const existingPlacement = await prisma.adPlacement.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            campaigns: true,
            analytics: true
          }
        }
      }
    })

    if (!existingPlacement) {
      return NextResponse.json(
        { error: 'Placement not found' },
        { status: 404 }
      )
    }

    // Check if placement has associated campaigns or analytics
    if (existingPlacement._count.campaigns > 0) {
      return NextResponse.json(
        { error: 'Cannot delete placement with associated campaigns' },
        { status: 400 }
      )
    }

    await prisma.adPlacement.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Placement deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting ad placement:', error)
    return NextResponse.json(
      { error: 'Failed to delete ad placement' },
      { status: 500 }
    )
  }
}