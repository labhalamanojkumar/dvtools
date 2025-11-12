import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET - Retrieve vendor verification file by filename
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('file')

    if (!filename) {
      return new NextResponse('Filename parameter required', { status: 400 })
    }

    // Find vendor that has a verification file in config
    const vendors = await prisma.adVendor.findMany({
      where: { isActive: true },
      select: { name: true, config: true }
    })

    // Search through configs for a matching filename
    let matched: { filename?: string; content?: string; contentType?: string } | null = null
    for (const v of vendors) {
      const cfgRaw = (v as { config: unknown }).config
      const cfg = (typeof cfgRaw === 'object' && cfgRaw !== null)
        ? (cfgRaw as Record<string, unknown>)
        : {}

      const fileRaw = cfg['verificationFile'] ?? cfg['verification_file']
      if (!fileRaw) continue

      let fileData: unknown
      try {
        fileData = typeof fileRaw === 'string' ? JSON.parse(fileRaw) : fileRaw
      } catch (err) {
        // skip invalid JSON entries
        continue
      }

      if (typeof fileData === 'object' && fileData !== null) {
        const fd = fileData as Record<string, unknown>
        if (typeof fd['filename'] === 'string' && fd['filename'] === filename) {
          matched = {
            filename: fd['filename'] as string,
            content: typeof fd['content'] === 'string' ? (fd['content'] as string) : undefined,
            contentType: typeof fd['contentType'] === 'string' ? (fd['contentType'] as string) : undefined,
          }
          break
        }
      }
    }

    if (!matched) {
      return new NextResponse('Verification file not found', { status: 404 })
    }

    return new NextResponse(matched.content, {
      headers: {
        'Content-Type': matched.contentType || 'text/html',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Error serving verification file:', error)
    return new NextResponse('Error serving verification file', { status: 500 })
  }
}
