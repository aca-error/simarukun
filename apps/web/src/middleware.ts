import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Daftar path yang memerlukan autentikasi
const protectedPaths = [
  '/warga',
  '/iuran',
  '/aduan',
  '/pengaturan',
];

// Daftar path admin-only
const adminOnlyPaths = [
  '/warga',
  '/iuran',
  '/aduan',
];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Skip middleware for API routes and static files
  if (path.startsWith('/api/') || path.startsWith('/_next/')) {
    return NextResponse.next();
  }

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some((p) => path.startsWith(p));
  
  if (isProtectedPath) {
    // Check if user is logged in (via cookie or localStorage simulation)
    // Note: In Next.js middleware, we can't directly access localStorage,
    // so we use cookies for server-side auth check
    const userCookie = request.cookies.get('user')?.value;
    
    if (!userCookie) {
      // Not logged in, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check if the path is admin-only
    const isAdminOnlyPath = adminOnlyPaths.some((p) => path.startsWith(p));
    if (isAdminOnlyPath) {
      try {
        const user = JSON.parse(userCookie);
        if (user.role !== 'admin') {
          // Not admin, redirect to home
          return NextResponse.redirect(new URL('/', request.url));
        }
      } catch (e) {
        // Invalid user data, redirect to login
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};