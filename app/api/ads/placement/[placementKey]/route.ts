import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET - Fetch ad placement data and campaigns
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
        placement: null,
        campaigns: []
      })
    }

    // Filter campaigns based on targeting rules
    let filteredCampaigns = placement.campaigns

    // Check device targeting
    if (placement.deviceTypes && Array.isArray(placement.deviceTypes)) {
      const allowedDevices = placement.deviceTypes as string[]
      filteredCampaigns = filteredCampaigns.filter((campaign: any) => {
        if (!campaign.deviceTypes || !Array.isArray(campaign.deviceTypes)) {
          return true // No device restriction
        }
        return allowedDevices.includes(deviceType) ||
               (campaign.deviceTypes as string[]).includes(deviceType)
      })
    }

    // Check page targeting
    if (placement.pages && Array.isArray(placement.pages)) {
      const allowedPages = placement.pages as string[]
      const matchesPage = allowedPages.some(pattern => {
        if (pattern.endsWith('*')) {
          return pageUrl.startsWith(pattern.slice(0, -1))
        }
        return pageUrl === pattern
      })
      
      if (!matchesPage) {
        filteredCampaigns = []
      }
    }

    // Shuffle campaigns for rotation if multiple exist
    if (filteredCampaigns.length > 1) {
      filteredCampaigns = [...filteredCampaigns].sort(() => Math.random() - 0.5)
    }

    // Limit to maxAds
    filteredCampaigns = filteredCampaigns.slice(0, placement.maxAds)

    return NextResponse.json({
      placement: {
        id: placement.id,
        key: placement.key,
        name: placement.name,
        type: placement.type,
        width: placement.width,
        height: placement.height,
        htmlClass: placement.htmlClass,
        maxAds: placement.maxAds,
        refreshInterval: placement.refreshInterval,
        responsive: placement.responsive,
        fallbackImage: placement.fallbackImage,
        fallbackUrl: placement.fallbackUrl,
        vendorId: placement.vendorId,
        pages: placement.pages,
        deviceTypes: placement.deviceTypes,
        targetingRules: placement.targetingRules
      },
      campaigns: filteredCampaigns.map((campaign: any) => ({
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
        vendor: {
          id: campaign.vendor.id,
          name: campaign.vendor.name,
          type: campaign.vendor.type
        }
      }))
    })
  } catch (error) {
    console.error('Error fetching ad placement:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ad placement' },
      { status: 500 }
    )
  }
}