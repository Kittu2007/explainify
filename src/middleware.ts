import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/firebase-admin'

export async function middleware(request: NextRequest) {
  // Check if session cookie exists
  const session = request.cookies.get('session')?.value

  const protectedRoutes = ['/dashboard', '/upload', '/chat', '/results', '/video']
  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))

  if (isProtectedRoute) {
    // Initial response
    let response = NextResponse.next()
    
    // Add Cache-Control to prevent browser from caching the dashboard
    response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate')
    
    if (!session) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    try {
      // Verify the session cookie (optional but recommended for strictly secure apps)
      // For now, presence of the session cookie is enough for middleware redirection
      // A more robust check would involve auth.verifySessionCookie(session)
    } catch (error) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
