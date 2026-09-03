# Authentication

GitNovi uses Supabase Auth with email/password authentication.

## Access model

- `/` is public.
- `/auth/login`, `/auth/signup`, `/auth/reset-password` and `/auth/callback` are public auth routes.
- The learning workspace and API routes require an authenticated Supabase user.
- `proxy.ts` refreshes the Supabase session and redirects unauthenticated requests to `/auth/login`.
- Protected server components also call `requireUser()` for defense in depth.
- Supabase RLS restricts private rows to `auth.uid() = user_id`.

## Account lifecycle

1. Sign up with email/password.
2. Supabase creates `auth.users`.
3. The `handle_new_user` trigger creates `profiles`.
4. Email confirmation may be required depending on Supabase settings.
5. Login establishes a persistent browser session.
6. Logout invalidates the session.
7. Password reset uses Supabase recovery flow.

## Security

Never expose `SUPABASE_SERVICE_ROLE_KEY` in client code. The browser only uses the public Supabase URL and anon/publishable key. All private progress mutations are authorized server-side and constrained by RLS.
