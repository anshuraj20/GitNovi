# GitNovi

GitNovi is an authenticated, interactive Git learning platform: Pre-Git foundations through advanced Git internals, a safe browser Git simulator, practical challenges, persistent progress, streaks, achievements, command reference, and a Git-focused Groq AI tutor.

## Core experience

1. Public landing page explains GitNovi.
2. Login or sign up is required before entering the learning workspace.
3. Supabase Auth owns the account/session.
4. Protected Next.js routes require an authenticated user.
5. Supabase Row Level Security isolates each learner's private progress.
6. Lessons can be marked complete and are persisted per user.
7. Terminal commands count as learning activity and the virtual repository session is persisted.
8. Challenges can be marked complete and contribute to streak/activity.
9. Dashboard, Progress, Achievements and Profile are account-specific.

## Stack

- Next.js 16 App Router
- React 19.2
- TypeScript strict mode
- Tailwind CSS 4
- Supabase Auth + PostgreSQL + RLS
- Groq API for the Git tutor
- Vitest
- ESLint 10

Next.js 16 is the current Active LTS line; the project uses the current stable 16.3 security line rather than the older Next 15 dependency that originally produced the PostCSS/sharp audit findings.

## Requirements

- Node.js 20.19+ (Node 22 LTS is recommended)
- npm
- A Supabase project
- A Groq API key for AI tutor functionality

## Install

```bash
npm install
cp .env.example .env.local
```

On Windows PowerShell, copy the environment file with:

```powershell
Copy-Item .env.example .env.local
```

## Environment

Set these in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (reserved for future server-only administrative jobs; never expose it to the browser)
- `GROQ_API_KEY` (server-side only)

## Supabase setup

1. Create a Supabase project.
2. Open **SQL Editor**.
3. Run `supabase/migrations/001_initial.sql`.
4. Run `supabase/migrations/002_auth_progress.sql`.
5. Run `supabase/seed.sql`.
6. In **Authentication → URL Configuration**, add your local site URL, normally `http://localhost:3000`.
7. Allow email/password authentication.
8. If email confirmation is enabled, users must confirm their email before the first authenticated session.

The auth trigger creates a `profiles` row for each new Supabase user. Private tables use RLS so a learner can only read/write their own progress, activity, achievements and terminal sessions.

## Run

```bash
npm run dev
```

Open `http://localhost:3000`.

The intended flow is:

`Landing page → Login/Sign up → Dashboard → Learn / Terminal / Challenges / AI → persistent account progress`

## Quality checks

```bash
npm run lint
npm test
npm run build
```

## Git terminal

The terminal is a safe in-browser simulator. It never executes learner input on the host OS or accesses the learner's real filesystem.

The virtual repository models working tree, index, commits, branches, refs, reflogs, remotes, stash and selected Git internals. Unsupported commands receive an educational response rather than being executed.

The terminal state is persisted per authenticated user through `terminal_sessions`.

## Authentication architecture

- `lib/supabase/browser.ts` — browser Supabase client.
- `lib/supabase/server.ts` — server client and `requireUser()` helper.
- `proxy.ts` — authentication gate and session cookie refresh.
- `app/auth/*` — login, signup, password reset and callback.
- Protected pages use `requireUser()` as a second server-side authorization check.
- API routes call `requireUser()` before mutating learner data.

## Progress architecture

- `lesson_progress` — per-user lesson completion.
- `challenge_progress` — per-user challenge completion.
- `daily_activity` — learning activity by calendar day.
- `user_streaks` — current and longest streak.
- `user_achievements` — earned milestones.
- `terminal_sessions` — per-user virtual terminal state.

`record_learning_activity()` is a security-definer PostgreSQL function that requires the authenticated Supabase user to match the target user ID and updates daily activity/streak data atomically.

## AI tutor

The AI endpoint is authenticated and server-side. The browser never receives the Groq API key. The tutor is scoped to Git/version-control education and receives contextual lesson/terminal information when supplied.

## Course content

Seeded curriculum covers Pre-Git, Beginner, Intermediate and Advanced modules. The content model is database-backed and extensible: add rows to `lessons`, quizzes and challenges without changing the terminal engine.

## Tests

Tests live under `tests/` and cover Git engine behavior, terminal behavior, progress calculations and streak calculations.

## Deployment

Deploy the Next.js application to a Node-compatible host such as Vercel or another Next.js platform. Configure all `.env.local` values as production environment variables and add the production callback URL to Supabase Auth URL configuration.

## Security notes

- Never commit `.env.local`.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` or `GROQ_API_KEY` to client components.
- Do not replace RLS with client-side checks.
- Do not change the terminal into an OS shell.
- Review dependency updates regularly.
