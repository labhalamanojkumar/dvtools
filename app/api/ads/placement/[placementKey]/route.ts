import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { placementKey: string } }
) {
  try {
    const { placementKey } = params

    // Get current page URL for targeting
    const { searchParams } = new URL(request.url)
    const pageUrl = searchParams.get('page') || ''
    const userAgent = request.headers.get('user-agent') || ''

    // Detect device type
    const deviceType = userAgent.match(/(mobile|android|iphone)/i) ? 'mobile' :
                      userAgent.match(/(tablet|ipad)/i) ? 'tablet' : 'desktop'

    // Fetch the placement configuration
    const placement = await prisma.adPlacement.findUnique({
      where: { key: placementKey },
      include: {
        vendor: true,
        campaigns: {
          where: {
            status: 'ACTIVE',
            startDate: { lte: new Date() },
            endDate: { gte: new Date() }
          },
          include: {
            vendor: {
              select: {
                id: true,
                name: true,
                type: true
              }
            }
          },
          orderBy: [
            { isFeatured: 'desc' },
            { priority: 'desc' },
            { createdAt: 'desc' }
          ]
        }
      }
    })

    if (!placement || !placement.isActive) {
      return NextResponse.json({
        success: false,
        placement: null,
        campaigns: [],
        message: 'Placement not found or inactive'
      })
    }

    let filteredCampaigns = placement.campaigns

    // Filter by device type if specified
    if (placement.deviceTypes && Array.isArray(placement.deviceTypes)) {
      const allowedDevices = placement.deviceTypes as string[]
      if (!allowedDevices.includes(deviceType)) {
        return NextResponse.json({
          success: false,
          placement: null,
          campaigns: [],
          message: 'Device type not allowed for this placement'
        })
      }
    }

    // Filter by page if specified
    if (placement.pages && Array.isArray(placement.pages)) {
      const allowedPages = placement.pages as string[]
      const isPageAllowed = allowedPages.some(pagePattern => {
        if (pagePattern === '/*') return true
        if (pagePattern.endsWith('/*')) {
          const basePath = pagePattern.slice(0, -2)
          return pageUrl.startsWith(basePath)
        }
        return pageUrl === pagePattern
      })

      if (!isPageAllowed) {
        return NextResponse.json({
          success: false,
          placement: null,
          campaigns: [],
          message: 'Page not allowed for this placement'
        })
      }
    }

    // Limit campaigns based on maxAds setting
    if (placement.maxAds && placement.maxAds > 0) {
      filteredCampaigns = filteredCampaigns.slice(0, placement.maxAds)
    }

    return NextResponse.json({
      success: true,
      placement: {
        id: placement.id,
        key: placement.key,
        name: placement.name,
        type: placement.type,
        width: placement.width,
        height: placement.height,
        htmlClass: placement.htmlClass,
        responsive: placement.responsive,
        refreshInterval: placement.refreshInterval
      },
      campaigns: filteredCampaigns.map(campaign => ({
        id: campaign.id,
        name: campaign.name,
        title: campaign.title,
        contentDescription: campaign.contentDescription,
        imageUrl: campaign.imageUrl,
        fallbackImage: campaign.fallbackImage,
        videoUrl: campaign.videoUrl,
        htmlCode: campaign.htmlCode,
        linkUrl: campaign.linkUrl,
        callToAction: campaign.callToAction,
        priority: campaign.priority,
        isFeatured: campaign.isFeatured,
        responsive: campaign.responsive,
        vendor: campaign.vendor
      }))
    })

  } catch (error) {
    console.error('Ad placement API error:', error)
    return NextResponse.json({
      success: false,
      placement: null,
      campaigns: [],
      message: 'Internal server error'
    }, { status: 500 })
  }
}