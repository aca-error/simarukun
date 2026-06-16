import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { RoleAccess } from '@/types/user';

// Daftar path yang memerlukan autentikasi
const protectedPaths = [
  '/warga',
  '/iuran',
  '/aduan',
  '/pengaturan',
  '/laporan',
  '/backup',
  '/webhook',
  '/server'
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
    // Check if user is logged in (via cookie)
    const userCookie = request.cookies.get('user')?.value;
    
    if (!userCookie) {
      // Not logged in, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check if user has access to this path based on their role
    try {
      const user = JSON.parse(userCookie);
      const allowedPaths = RoleAccess[user.role as keyof typeof RoleAccess] || [];
      
      if (!allowedPaths.some((p) => path.startsWith(p))) {
        // User doesn't have access to this path, redirect to home
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (e) {
      // Invalid user data, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};