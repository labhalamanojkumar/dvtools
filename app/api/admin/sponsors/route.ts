import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - Fetch all sponsors for admin
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
    const tier = searchParams.get('tier')
    const featured = searchParams.get('featured')

    const where: any = {}
    
    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }
    
    if (tier) {
      where.tier = tier
    }
    
    if (featured !== null) {
      where.isFeatured = featured === 'true'
    }

    const sponsors = await prisma.sponsor.findMany({
      where,
      orderBy: [
        { isFeatured: 'desc' },
        { displayOrder: 'asc' },
        { createdAt: 'desc' }
      ],
      include: {
        donation: {
          select: {
            id: true,
            amount: true,
            donorName: true,
            donorEmail: true,
            createdAt: true
          }
        }
      }
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

// POST - Create a new sponsor (admin only)
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
      isActive = true
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
        isActive
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

// PUT - Update an existing sponsor
export async function PUT(request: NextRequest) {
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
      id,
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
      startDate,
      endDate,
      isActive
    } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Sponsor ID is required' },
        { status: 400 }
      )
    }

    // Check if sponsor exists
    const existingSponsor = await prisma.sponsor.findUnique({
      where: { id }
    })

    if (!existingSponsor) {
      return NextResponse.json(
        { error: 'Sponsor not found' },
        { status: 404 }
      )
    }

    // Update the sponsor
    const sponsor = await prisma.sponsor.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email !== undefined && { email }),
        ...(company !== undefined && { company }),
        ...(website !== undefined && { website }),
        ...(logo !== undefined && { logo }),
        ...(amount !== undefined && { amount }),
        ...(tier !== undefined && { tier }),
        ...(description !== undefined && { description }),
        ...(message !== undefined && { message }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(displayOrder !== undefined && { displayOrder }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
        ...(isActive !== undefined && { isActive }),
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      sponsor,
    })
  } catch (error) {
    console.error('Error updating sponsor:', error)
    return NextResponse.json(
      { error: 'Failed to update sponsor' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a sponsor
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
        { error: 'Sponsor ID is required' },
        { status: 400 }
      )
    }

    // Check if sponsor exists
    const existingSponsor = await prisma.sponsor.findUnique({
      where: { id }
    })

    if (!existingSponsor) {
      return NextResponse.json(
        { error: 'Sponsor not found' },
        { status: 404 }
      )
    }

    await prisma.sponsor.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Sponsor deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting sponsor:', error)
    return NextResponse.json(
      { error: 'Failed to delete sponsor' },
      { status: 500 }
    )
  }
}