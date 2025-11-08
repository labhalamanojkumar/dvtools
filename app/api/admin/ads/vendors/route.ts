import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - Fetch all ad vendors for admin
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
    const isActive = searchParams.get('isActive')
    const type = searchParams.get('type')

    const where: any = {}
    
    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }
    
    if (type) {
      where.type = type
    }

    const vendors = await prisma.adVendor.findMany({
      where,
      orderBy: [
        { isActive: 'desc' },
        { name: 'asc' }
      ],
      include: {
        _count: {
          select: {
            campaigns: true,
            placements: true
          }
        }
      }
    })

    return NextResponse.json({ vendors })
  } catch (error) {
    console.error('Error fetching ad vendors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ad vendors' },
      { status: 500 }
    )
  }
}

// POST - Create a new ad vendor (admin only)
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
      type,
      description,
      isActive = true,
      config = {}
    } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    if (!type) {
      return NextResponse.json(
        { error: 'Type is required' },
        { status: 400 }
      )
    }

    // Create the vendor
    const vendor = await prisma.adVendor.create({
      data: {
        name,
        type,
        description,
        isActive,
        config
      }
    })

    return NextResponse.json({
      success: true,
      vendor,
    })
  } catch (error) {
    console.error('Error creating ad vendor:', error)
    return NextResponse.json(
      { error: 'Failed to create ad vendor' },
      { status: 500 }
    )
  }
}

// PUT - Update an existing ad vendor
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
      type,
      description,
      isActive,
      config
    } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Vendor ID is required (query param or request body)' },
        { status: 400 }
      )
    }

    // Check if vendor exists
    const existingVendor = await prisma.adVendor.findUnique({
      where: { id }
    })

    if (!existingVendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    // Update the vendor
    const vendor = await prisma.adVendor.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(type && { type }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive }),
        ...(config && { config }),
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      vendor,
    })
  } catch (error) {
    console.error('Error updating ad vendor:', error)
    return NextResponse.json(
      { error: 'Failed to update ad vendor' },
      { status: 500 }
    )
  }
}

// DELETE - Delete an ad vendor
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
        { error: 'Vendor ID is required' },
        { status: 400 }
      )
    }

    // Check if vendor exists
    const existingVendor = await prisma.adVendor.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            campaigns: true,
            placements: true
          }
        }
      }
    })

    if (!existingVendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    // Check if vendor has associated campaigns or placements
    if (existingVendor._count.campaigns > 0 || existingVendor._count.placements > 0) {
      return NextResponse.json(
        { error: 'Cannot delete vendor with associated campaigns or placements' },
        { status: 400 }
      )
    }

    await prisma.adVendor.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Vendor deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting ad vendor:', error)
    return NextResponse.json(
      { error: 'Failed to delete ad vendor' },
      { status: 500 }
    )
  }
}