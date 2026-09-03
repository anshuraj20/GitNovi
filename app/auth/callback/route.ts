import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');
  let next = requestUrl.searchParams.get('next') || '/dashboard';

  // Ensure next path is relative and safe
  if (!next.startsWith('/')) {
    next = '/dashboard';
  }

  if (error) {
    console.error('OAuth callback error:', error, errorDescription);
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(errorDescription || error)}`, requestUrl.origin)
    );
  }

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignore if called from server component
            }
          },
        },
      }
    );

    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError);
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent(exchangeError.message)}`, requestUrl.origin)
      );
    }

    // If new user via OAuth, ensure a profile record exists
    if (data?.user) {
      try {
        const displayName =
          data.user.user_metadata?.full_name ||
          data.user.user_metadata?.name ||
          data.user.user_metadata?.user_name ||
          data.user.email?.split('@')[0] ||
          'Developer';

        await supabase.from('profiles').upsert(
          {
            id: data.user.id,
            email: data.user.email,
            display_name: displayName,
            avatar_url: data.user.user_metadata?.avatar_url || null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );
      } catch (profileErr) {
        console.warn('Could not auto-upsert OAuth profile:', profileErr);
      }
    }

    const forwardedHost = request.headers.get('x-forwarded-host');
    const isLocalEnv = process.env.NODE_ENV === 'development';

    if (isLocalEnv) {
      return NextResponse.redirect(`${requestUrl.origin}${next}`);
    } else if (forwardedHost) {
      return NextResponse.redirect(`https://${forwardedHost}${next}`);
    } else {
      return NextResponse.redirect(`${requestUrl.origin}${next}`);
    }
  }

  return NextResponse.redirect(new URL('/auth/login', requestUrl.origin));
}
