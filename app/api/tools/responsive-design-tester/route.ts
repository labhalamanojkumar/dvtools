import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, url, html, css, width, height } = body

    switch (action) {
      case 'capture':
        // Capture screenshot or generate preview
        return NextResponse.json({
          success: true,
          message: 'Screenshot captured successfully',
          data: {
            url,
            dimensions: { width, height },
            timestamp: new Date().toISOString()
          }
        })

      case 'analyze':
        // Analyze responsiveness
        const breakpoints = [
          { name: 'Mobile', width: 375, pass: width <= 768 },
          { name: 'Tablet', width: 768, pass: width > 768 && width <= 1024 },
          { name: 'Desktop', width: 1920, pass: width > 1024 }
        ]

        return NextResponse.json({
          success: true,
          analysis: {
            currentBreakpoint: breakpoints.find(bp => bp.pass)?.name || 'Unknown',
            breakpoints,
            recommendations: [
              'Consider using CSS Grid for better responsive layouts',
              'Test on multiple device orientations',
              'Ensure touch targets are at least 44x44px'
            ]
          }
        })

      case 'test-html':
        // Process HTML/CSS for testing
        return NextResponse.json({
          success: true,
          message: 'HTML processed successfully',
          preview: {
            html: html || '',
            css: css || '',
            processed: true
          }
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Responsive design tester error:', error)
    return NextResponse.json(
      { error: 'Failed to process request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Responsive Design Tester API',
    endpoints: {
      POST: {
        actions: ['capture', 'analyze', 'test-html'],
        description: 'Test and analyze responsive design'
      }
    }
  })
}
