import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET - Fetch active vendor verification codes for meta tags
export async function GET() {
  try {
    const vendors = await prisma.adVendor.findMany({
      where: { isActive: true },
      select: { name: true, type: true, config: true }
    })

    const tags = vendors
      .map((v) => {
        const cfgRaw = (v as { config: unknown }).config
        const cfg = (typeof cfgRaw === 'object' && cfgRaw !== null)
          ? (cfgRaw as Record<string, unknown>)
          : {}

        const code = (cfg['verificationCode'] ?? cfg['verification_code'] ?? cfg['code']) as string | undefined
        if (code) {
          return { name: v.name, type: v.type, code }
        }
        return null
      })
      .filter(Boolean)

    return NextResponse.json({ tags })
  } catch (error) {
    console.error('Error fetching verification tags:', error)
    return NextResponse.json({ tags: [] }, { status: 500 })
  }
}
