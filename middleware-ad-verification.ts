import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This middleware will inject ad vendor verification meta tags into HTML responses
export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Only process HTML pages
  const url = request.nextUrl
  if (url.pathname.startsWith('/api') || 
      url.pathname.startsWith('/_next') ||
      url.pathname.includes('.')) {
    return response
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
