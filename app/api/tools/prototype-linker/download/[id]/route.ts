import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic';
import { findPrototype } from '../../store'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const parts = url.pathname.split('/')
    const id = parts[parts.length - 1]

    const proto = findPrototype(id)
    if (!proto) return NextResponse.json({ success: false, message: 'Prototype not found' }, { status: 404 })

    const filename = `${proto.name.toLowerCase().replace(/\s+/g, '-') || id}-prototype.json`
    return NextResponse.json(proto, {
      headers: {
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      }
    })
  } catch (err) {
    console.error('Download error', err)
    return NextResponse.json({ success: false, message: 'Failed to generate download' }, { status: 500 })
  }
}
