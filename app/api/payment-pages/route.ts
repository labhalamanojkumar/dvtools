import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET - Fetch public payment pages
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get('includeInactive') === 'true'

    const pages = await prisma.paymentPage.findMany({
      where: includeInactive ? {} : { isActive: true, isPublic: true },
      select: {
        id: true,
        title: true,
        description: true,
        amount: true,
        currency: true,
        slug: true,
        imageUrl: true,
        customMessage: true,
        successMessage: true,
        redirectUrl: true,
        donationCount: true,
        totalRaised: true,
        viewCount: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    // Increment view count for all pages
    for (const page of pages) {
      await prisma.paymentPage.update({
        where: { id: page.id },
        data: { viewCount: { increment: 1 } }
      })
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