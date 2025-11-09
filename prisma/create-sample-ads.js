const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSampleAdData() {
  try {
    console.log('Creating sample ad data...');

    // Clean up existing data
    await prisma.adAnalytics.deleteMany();
    await prisma.adCampaign.deleteMany();
    await prisma.adPlacement.deleteMany();
    await prisma.adVendor.deleteMany();

    // Create Ad Vendors
    const googleAdSense = await prisma.adVendor.create({
      data: {
        name: 'Google AdSense',
        type: 'GOOGLE_ADSENSE',
        description: 'Google\'s advertising platform for websites',
        isActive: true,
        config: {
          publisherId: 'pub-1234567890123456',
          clientId: 'ca-pub-1234567890123456',
          adSlot: '1234567890'
        }
      }
    });

    const monetage = await prisma.adVendor.create({
      data: {
        name: 'Monetage',
        type: 'MONETAGE',
        description: 'Monetage ad network for publishers',
        isActive: true,
        config: {
          publisherId: 'mnt-123456',
          siteId: 'site-789012'
        }
      }
    });

    const customHtml = await prisma.adVendor.create({
      data: {
        name: 'Custom HTML Ads',
        type: 'CUSTOM_HTML',
        description: 'Custom HTML ad templates',
        isActive: true,
        config: {}
      }
    });

    // Create Ad Placements
    const headerBanner = await prisma.adPlacement.create({
      data: {
        name: 'Header Banner',
        key: 'header_banner',
        description: 'Main banner at the top of the page',
        type: 'HEADER_BANNER',
        width: 728,
        height: 90,
        htmlClass: 'ad-header-banner',
        isActive: true,
        sortOrder: 1,
        maxAds: 1,
        responsive: true,
        pages: ['/*', '/tools/*', '/blog/*'],
        deviceTypes: ['desktop', 'tablet', 'mobile']
      }
    });

    const sidebar = await prisma.adPlacement.create({
      data: {
        name: 'Sidebar Ad',
        key: 'sidebar_ad',
        description: 'Sidebar advertisement space',
        type: 'SIDEBAR',
        width: 300,
        height: 250,
        htmlClass: 'ad-sidebar',
        isActive: true,
        sortOrder: 2,
        maxAds: 1,
        refreshInterval: 30,
        responsive: true,
        fallbackImage: '/placeholder-ad.jpg',
        pages: ['/*', '/tools/*'],
        deviceTypes: ['desktop']
      }
    });

    const contentMiddle = await prisma.adPlacement.create({
      data: {
        name: 'Content Middle',
        key: 'content_middle',
        description: 'Ad space in the middle of content',
        type: 'CONTENT_MIDDLE',
        width: 336,
        height: 280,
        htmlClass: 'ad-content-middle',
        isActive: true,
        sortOrder: 3,
        maxAds: 1,
        responsive: true,
        pages: ['/blog/*', '/tools/*'],
        deviceTypes: ['desktop', 'tablet', 'mobile']
      }
    });

    const mobileBanner = await prisma.adPlacement.create({
      data: {
        name: 'Mobile Banner',
        key: 'mobile_banner',
        description: 'Mobile-optimized banner ads',
        type: 'MOBILE_BANNER',
        width: 320,
        height: 50,
        htmlClass: 'ad-mobile-banner',
        isActive: true,
        sortOrder: 4,
        maxAds: 1,
        responsive: true,
        pages: ['/*'],
        deviceTypes: ['mobile']
      }
    });

    const toolPageTop = await prisma.adPlacement.create({
      data: {
        name: 'Tool Page Top',
        key: 'tool_page_top',
        description: 'Top banner on tool pages',
        type: 'TOOL_PAGE_TOP',
        width: 728,
        height: 90,
        htmlClass: 'ad-tool-page-top',
        isActive: true,
        sortOrder: 5,
        maxAds: 1,
        responsive: true,
        pages: ['/tools/*'],
        deviceTypes: ['desktop', 'tablet', 'mobile']
      }
    });

    // Create Ad Campaigns
    const campaign1 = await prisma.adCampaign.create({
      data: {
        name: 'Summer Sale Campaign',
        vendorId: googleAdSense.id,
        status: 'ACTIVE',
        title: 'Summer Sale - Up to 50% Off!',
        contentDescription: 'Amazing summer deals on all products',
        imageUrl: '/placeholder-ad.jpg',
        linkUrl: 'https://example.com/summer-sale',
        callToAction: 'Shop Now',
        priority: 10,
        isFeatured: true,
        responsive: true,
        deviceTypes: ['desktop', 'tablet'],
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        views: 1250,
        clicks: 45,
        conversions: 8,
        revenue: 125.50
      }
    });

    const campaign2 = await prisma.adCampaign.create({
      data: {
        name: 'JavaScript Tools Promotion',
        vendorId: customHtml.id,
        status: 'ACTIVE',
        title: 'Best JavaScript Development Tools',
        contentDescription: 'Professional JS tools for developers',
        imageUrl: '/placeholder-ad.jpg',
        linkUrl: 'https://example.com/js-tools',
        callToAction: 'Try Now',
        priority: 8,
        isFeatured: false,
        responsive: true,
        deviceTypes: ['desktop'],
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        views: 890,
        clicks: 32,
        conversions: 5,
        revenue: 89.25
      }
    });

    const campaign3 = await prisma.adCampaign.create({
      data: {
        name: 'Mobile App Campaign',
        vendorId: monetage.id,
        status: 'ACTIVE',
        title: 'Download Our Mobile App',
        contentDescription: 'Get the app for easy access on the go',
        htmlCode: '<div style="background: linear-gradient(45deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center;"><h3>📱 Get Our Mobile App</h3><p>Access all features on your mobile device</p><button style="background: white; color: #667eea; padding: 10px 20px; border: none; border-radius: 5px; font-weight: bold; cursor: pointer;">Download Now</button></div>',
        linkUrl: 'https://example.com/mobile-app',
        callToAction: 'Download',
        priority: 6,
        isFeatured: false,
        responsive: true,
        deviceTypes: ['mobile', 'tablet'],
        startDate: new Date(),
        endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        views: 420,
        clicks: 18,
        conversions: 3,
        revenue: 45.75
      }
    });

    const campaign4 = await prisma.adCampaign.create({
      data: {
        name: 'API Documentation Ad',
        vendorId: googleAdSense.id,
        status: 'ACTIVE',
        title: 'Complete API Documentation',
        contentDescription: 'Learn how to integrate with our API',
        imageUrl: '/placeholder-ad.jpg',
        linkUrl: 'https://example.com/api-docs',
        callToAction: 'View Docs',
        priority: 7,
        isFeatured: false,
        responsive: true,
        deviceTypes: ['desktop', 'tablet', 'mobile'],
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        views: 675,
        clicks: 22,
        conversions: 4,
        revenue: 67.80
      }
    });

    // Connect campaigns to placements
    await prisma.adCampaign.update({
      where: { id: campaign1.id },
      data: {
        placements: {
          connect: [
            { id: headerBanner.id },
            { id: toolPageTop.id }
          ]
        }
      }
    });

    await prisma.adCampaign.update({
      where: { id: campaign2.id },
      data: {
        placements: {
          connect: [{ id: sidebar.id }]
        }
      }
    });

    await prisma.adCampaign.update({
      where: { id: campaign3.id },
      data: {
        placements: {
          connect: [{ id: mobileBanner.id }]
        }
      }
    });

    await prisma.adCampaign.update({
      where: { id: campaign4.id },
      data: {
        placements: {
          connect: [{ id: contentMiddle.id }]
        }
      }
    });

    // Create sample analytics data
    const analyticsData = [];
    for (let i = 0; i < 50; i++) {
      const randomDate = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000); // Last 7 days
      const campaigns = [campaign1, campaign2, campaign3, campaign4];
      const randomCampaign = campaigns[Math.floor(Math.random() * campaigns.length)];
      const placements = [headerBanner, sidebar, contentMiddle, mobileBanner];
      const randomPlacement = placements[Math.floor(Math.random() * placements.length)];
      const eventTypes = ['view', 'click', 'conversion'];
      const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];

      analyticsData.push({
        campaignId: randomCampaign.id,
        placementId: randomPlacement.id,
        eventType: randomEvent,
        revenue: randomEvent === 'conversion' ? Math.random() * 10 : 0,
        timestamp: randomDate,
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        referrer: 'https://google.com',
        pageUrl: '/tools/json-formatter',
        deviceType: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)]
      });
    }

    await prisma.adAnalytics.createMany({
      data: analyticsData
    });

    console.log('✅ Sample ad data created successfully!');
    console.log('\nCreated:');
    console.log(`- ${await prisma.adVendor.count()} ad vendors`);
    console.log(`- ${await prisma.adPlacement.count()} ad placements`);
    console.log(`- ${await prisma.adCampaign.count()} ad campaigns`);
    console.log(`- ${await prisma.adAnalytics.count()} analytics records`);

  } catch (error) {
    console.error('Error creating sample ad data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleAdData();