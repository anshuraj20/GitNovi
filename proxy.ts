import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_PATHS = new Set([
  '/',
  '/contact',
  '/auth/login',
  '/auth/signup',
  '/auth/reset-password',
  '/auth/callback',
]);

const AUTH_PAGES = new Set([
  '/auth/login',
  '/auth/signup',
  '/auth/reset-password',
]);

async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isPublicStatic =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico';

  if (isPublicStatic) {
    return NextResponse.next({ request });
  }

  const response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is unauthenticated and attempting to access any course / app route
  if (!user && !PUBLIC_PATHS.has(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  // If logged-in user visits auth pages, redirect to dashboard
  if (user && AUTH_PAGES.has(pathname) && pathname !== '/auth/reset-password') {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return response;
}

export default proxy;

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)'],
};
