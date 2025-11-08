import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - Fetch all payment pages
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
    const includeStats = searchParams.get('includeStats') === 'true'

    let pages = await prisma.paymentPage.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        campaign: {
          select: {
            id: true,
            title: true,
          }
        }
      }
    })

    // Calculate live stats if requested
    if (includeStats) {
      for (const page of pages) {
        const stats = await prisma.donation.aggregate({
          where: { 
            message: { contains: `payment_page_${page.id}` }
          },
          _count: { id: true },
          _sum: { amount: true }
        })
        page.donationCount = stats._count.id
        page.totalRaised = stats._sum.amount || 0
      }
    }

    return NextResponse.json({ pages })
  } catch (error) {
    console.error('Error fetching payment pages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment pages' },
      { status: 500 }
    )
  }
}

// POST - Create a new payment page
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
      title,
      description,
      amount,
      currency = 'USD',
      slug,
      imageUrl,
      customMessage,
      successMessage,
      redirectUrl,
      metadata,
      campaignId,
      isActive = true,
      isPublic = true
    } = body

    // Validate required fields
    if (!title || !slug) {
      return NextResponse.json(
        { error: 'Title and slug are required' },
        { status: 400 }
      )
    }

    // Validate slug format
    const slugRegex = /^[a-z0-9-]+$/
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        { error: 'Slug must contain only lowercase letters, numbers, and hyphens' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingPage = await prisma.paymentPage.findUnique({
      where: { slug }
    })

    if (existingPage) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 }
      )
    }

    // Create the payment page
    const page = await prisma.paymentPage.create({
      data: {
        title,
        description,
        amount,
        currency,
        slug,
        imageUrl,
        customMessage,
        successMessage,
        redirectUrl,
        metadata,
        campaignId,
        isActive,
        isPublic,
        createdBy: session.user?.email || 'system',
      }
    })

    return NextResponse.json({
      success: true,
      page,
    })
  } catch (error) {
    console.error('Error creating payment page:', error)
    return NextResponse.json(
      { error: 'Failed to create payment page' },
      { status: 500 }
    )
  }
}

// PUT - Update an existing payment page
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
      title,
      description,
      amount,
      currency,
      slug,
      imageUrl,
      customMessage,
      successMessage,
      redirectUrl,
      metadata,
      campaignId,
      isActive,
      isPublic
    } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Page ID is required' },
        { status: 400 }
      )
    }

    // Check if page exists
    const existingPage = await prisma.paymentPage.findUnique({
      where: { id }
    })

    if (!existingPage) {
      return NextResponse.json(
        { error: 'Payment page not found' },
        { status: 404 }
      )
    }

    // Validate slug format if being updated
    if (slug && slug !== existingPage.slug) {
      const slugRegex = /^[a-z0-9-]+$/
      if (!slugRegex.test(slug)) {
        return NextResponse.json(
          { error: 'Slug must contain only lowercase letters, numbers, and hyphens' },
          { status: 400 }
        )
      }

      // Check if new slug already exists
      const slugExists = await prisma.paymentPage.findUnique({
        where: { slug }
      })

      if (slugExists) {
        return NextResponse.json(
          { error: 'Slug already exists' },
          { status: 400 }
        )
      }
    }

    // Update the payment page
    const page = await prisma.paymentPage.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(amount !== undefined && { amount }),
        ...(currency && { currency }),
        ...(slug && { slug }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(customMessage !== undefined && { customMessage }),
        ...(successMessage !== undefined && { successMessage }),
        ...(redirectUrl !== undefined && { redirectUrl }),
        ...(metadata !== undefined && { metadata }),
        ...(campaignId !== undefined && { campaignId }),
        ...(isActive !== undefined && { isActive }),
        ...(isPublic !== undefined && { isPublic }),
        updatedAt: new Date(),
      }
    })

    return NextResponse.json({
      success: true,
      page,
    })
  } catch (error) {
    console.error('Error updating payment page:', error)
    return NextResponse.json(
      { error: 'Failed to update payment page' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a payment page
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
        { error: 'Page ID is required' },
        { status: 400 }
      )
    }

    // Check if page exists
    const existingPage = await prisma.paymentPage.findUnique({
      where: { id }
    })

    if (!existingPage) {
      return NextResponse.json(
        { error: 'Payment page not found' },
        { status: 404 }
      )
    }

    await prisma.paymentPage.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Payment page deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting payment page:', error)
    return NextResponse.json(
      { error: 'Failed to delete payment page' },
      { status: 500 }
    )
  }
}