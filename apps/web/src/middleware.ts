import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as Sentry from '@sentry/nextjs';
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
  
  // Sentry transaction for monitoring
  const transaction = Sentry.startTransaction({
    op: 'middleware',
    name: `Middleware: ${path}`,
  });

  try {
    // Skip middleware for API routes and static files
    if (path.startsWith('/api/') || path.startsWith('/_next/')) {
      transaction.finish();
      return NextResponse.next();
    }

    // Check if the path is protected
    const isProtectedPath = protectedPaths.some((p) => path.startsWith(p));
    
    if (isProtectedPath) {
      // Check if user is logged in (via cookie)
      const userCookie = request.cookies.get('user')?.value;
      
      if (!userCookie) {
        // Not logged in, redirect to login
        transaction.finish();
        return NextResponse.redirect(new URL('/login', request.url));
      }

      // Check if user has access to this path based on their role
      try {
        const user = JSON.parse(userCookie);
        const allowedPaths = RoleAccess[user.role as keyof typeof RoleAccess] || [];
        
        if (!allowedPaths.some((p) => path.startsWith(p))) {
          // User doesn't have access to this path, redirect to home
          transaction.finish();
          return NextResponse.redirect(new URL('/', request.url));
        }
      } catch (e) {
        // Invalid user data, redirect to login
        Sentry.captureException(e, {
          contexts: {
            middleware: {
              path,
              error: 'Invalid user data',
            },
          },
        });
        transaction.finish();
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

    transaction.finish();
    return NextResponse.next();
  } catch (error) {
    Sentry.captureException(error, {
      contexts: {
        middleware: {
          path,
          error: 'Middleware error',
        },
      },
    });
    transaction.finish();
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

// Export Sentry for use in other files
export { Sentry };
