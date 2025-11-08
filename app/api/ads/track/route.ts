import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// POST - Track ad events (views, clicks, conversions)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      campaignId,
      placementId,
      eventType,
      revenue,
      metadata,
      sessionId,
      pageUrl,
      deviceType
    } = body

    if (!campaignId || !eventType) {
      return NextResponse.json(
        { error: 'Campaign ID and event type are required' },
        { status: 400 }
      )
    }

    // Get session for user tracking (optional)
    const session = await getServerSession(authOptions)

    // Get client information
    const userAgent = request.headers.get('user-agent') || ''
    const referrer = request.headers.get('referer') || ''
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'

    // Create analytics record
    await prisma.adAnalytics.create({
      data: {
        campaignId,
        placementId,
        eventType,
        revenue: revenue || 0,
        metadata: metadata || {},
        userId: session?.user?.id,
        sessionId: sessionId || '',
        ipAddress,
        userAgent,
        referrer,
        pageUrl: pageUrl || '',
        deviceType: deviceType || 'unknown'
      }
    })

    // Update campaign statistics
    const campaign = await prisma.adCampaign.findUnique({
      where: { id: campaignId }
    })

    if (campaign) {
      const updateData: any = {}
      
      if (eventType === 'view') {
        updateData.views = { increment: 1 }
      } else if (eventType === 'click') {
        updateData.clicks = { increment: 1 }
      } else if (eventType === 'conversion') {
        updateData.conversions = { increment: 1 }
        if (revenue) {
          updateData.revenue = { increment: revenue }
        }
      }

      await prisma.adCampaign.update({
        where: { id: campaignId },
        data: updateData
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Event tracked successfully'
    })
  } catch (error) {
    console.error('Error tracking ad event:', error)
    return NextResponse.json(
      { error: 'Failed to track ad event' },
      { status: 500 }
    )
  }
}

// GET - Get analytics data for a campaign or placement
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get('campaignId')
    const placementId = searchParams.get('placementId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const eventType = searchParams.get('eventType')
    const limit = parseInt(searchParams.get('limit') || '100')

    const where: any = {}
    
    if (campaignId) where.campaignId = campaignId
    if (placementId) where.placementId = placementId
    if (eventType) where.eventType = eventType
    
    if (startDate || endDate) {
      where.timestamp = {}
      if (startDate) where.timestamp.gte = new Date(startDate)
      if (endDate) where.timestamp.lte = new Date(endDate)
    }

    const analytics = await prisma.adAnalytics.findMany({
      where,
      include: {
        campaign: {
          select: {
            id: true,
            name: true,
            title: true
          }
        },
        placement: {
          select: {
            id: true,
            key: true,
            name: true
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: limit || 100
    })

    // Calculate summary statistics
    const summary = {
      totalViews: analytics.filter((a: typeof analytics[0]) => a.eventType === 'view').length,
      totalClicks: analytics.filter((a: typeof analytics[0]) => a.eventType === 'click').length,
      totalConversions: analytics.filter((a: typeof analytics[0]) => a.eventType === 'conversion').length,
      totalRevenue: analytics.reduce((sum: number, a: typeof analytics[0]) => sum + (a.revenue || 0), 0),
      ctr: 0,
      conversionRate: 0
    }

    if (summary.totalViews > 0) {
      summary.ctr = (summary.totalClicks / summary.totalViews) * 100
    }
    if (summary.totalClicks > 0) {
      summary.conversionRate = (summary.totalConversions / summary.totalClicks) * 100
    }

    return NextResponse.json({
      analytics,
      summary
    })
  } catch (error) {
    console.error('Error fetching ad analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ad analytics' },
      { status: 500 }
    )
  }
}