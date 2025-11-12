import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import fs from 'fs'
import path from 'path'

// GET - Generate and serve ads.txt based on active vendors
export async function GET() {
  try {
    // Fetch all active vendors with publisher IDs
    const vendors = await prisma.adVendor.findMany({
      where: {
        isActive: true
      },
      select: {
        name: true,
        type: true,
        publisherId: true,
        config: true
      }
    })

    // Build ads.txt content
    let content = '# ads.txt for dvtools.in\n'
    content += '# This file declares authorized digital sellers for ad inventory\n'
    content += '# Format: domain, publisher_id, relationship_type, certification_authority_id\n\n'

    // Add vendor entries (read adsTxtEntry from config JSON)
    vendors.forEach((vendor) => {
      const cfgRaw = (vendor as { config: unknown }).config
      const cfg = (typeof cfgRaw === 'object' && cfgRaw !== null)
        ? (cfgRaw as Record<string, unknown>)
        : {}

      // support several possible keys for backwards/forwards compatibility
      const entry = (cfg['adsTxtEntry'] ?? cfg['ads_txt'] ?? cfg['adsTxt']) as string | undefined
      const verified = Boolean(cfg['isVerified'] ?? cfg['verified'])

      if (entry) {
        content += `# ${vendor.name} (${verified ? 'Verified' : 'Pending'})\n`
        content += `${entry}\n\n`
      }
    })

    content += `# Contact: admin@dvtools.in\n`
    content += `# Last Updated: ${new Date().toISOString()}\n`

    // Save to public/ads.txt
    const filePath = path.join(process.cwd(), 'public', 'ads.txt')
    fs.writeFileSync(filePath, content, 'utf-8')

    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=300', // 5 minutes cache
      },
    })
  } catch (error) {
    console.error('Error generating ads.txt:', error)
    return new NextResponse('Error generating ads.txt', { status: 500 })
  }
}

// POST - Regenerate ads.txt (admin only)
export async function POST() {
  try {
    const session = await import('next-auth').then(m => m.getServerSession)
    const { authOptions } = await import('@/lib/auth')
    const user = await session(authOptions)

    if (!user || user.user?.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - SUPERADMIN access required' },
        { status: 401 }
      )
    }

    // Regenerate ads.txt (re-use GET logic)
    await GET()

    return NextResponse.json({ success: true, message: 'ads.txt regenerated successfully' })
  } catch (error) {
    console.error('Error regenerating ads.txt:', error)
    return NextResponse.json(
      { error: 'Failed to regenerate ads.txt' },
      { status: 500 }
    )
  }
}
