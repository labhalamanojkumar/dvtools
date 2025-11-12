import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Serve ads.txt file from /ads.txt route
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'ads.txt')
    
    // Check if file exists
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8')
      
      return new NextResponse(content, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      })
    }
    
    // Return 404 if file doesn't exist
    return new NextResponse('ads.txt not found', { status: 404 })
  } catch (error) {
    console.error('Error serving ads.txt:', error)
    return new NextResponse('Error serving ads.txt', { status: 500 })
  }
}
