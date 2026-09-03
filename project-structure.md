# GitNovi Project Structure

## Overview
GitNovi is a Next.js app built to teach Git through a hands-on learning workflow. It combines structured learning modules, interactive challenges, a terminal simulator, AI tutoring, user auth, progress tracking, and course content.

---

## App entry points

### `app/`
This folder contains the route-based app structure.

- `app/page.tsx` — landing page
- `app/learn/page.tsx` — learning roadmap
- `app/learn/pre-git/page.tsx` — Pre-Git module page
- `app/learn/beginner/page.tsx` — Beginner module page
- `app/learn/intermediate/page.tsx` — Intermediate module page
- `app/learn/advanced/page.tsx` — Advanced module page
- `app/terminal/page.tsx` — terminal/simulator page
- `app/challenges/page.tsx` — challenges page
- `app/dashboard/page.tsx` — user dashboard
- `app/profile/page.tsx` — profile page
- `app/progress/page.tsx` — progress page
- `app/ai/page.tsx` — AI tutor interface
- `app/api/` — backend API routes for AI, conversations, profile, progress, and terminal sessions
- `app/auth/` — signup/login/password reset/auth callback flow

### `components/`
Reusable UI building blocks.

- `components/ui/` — navigation, progress bars, shared UI
- `components/ai/` — AI tutor UI and chat logic
- `components/learning/` — course modules and lesson cards
- `components/terminal/` — terminal display and input components
- `components/challenges/` — challenge actions and validation UI
- `components/dashboard/` — dashboard cards and summary components
- `components/profile/` — profile forms and settings

### `lib/`
Application logic and data access.

- `lib/ai/` — AI tutor and conversation logic
- `lib/course/` — course module fetching
- `lib/git-engine/` — simulator command logic and Git engine
- `lib/progress/` — user progress and streak logic
- `lib/streaks/` — streak calculation logic
- `lib/supabase/` — browser and server Supabase clients
- `lib/utils/` — shared utility functions

### `data/`
Static content and curriculum seed data.

- `data/course/` — course module metadata and lesson content
- `data/challenges/` — challenge definitions
- `data/commands/` — Git command catalog
- `data/quizzes/` — quiz/test content

### `supabase/`
Database and auth-related configuration.

- `supabase/config.toml` — Supabase local config
- `supabase/migrations/` — migration files for schema changes
- `supabase/seed.sql` — seed data setup

### `tests/`
Automated project tests.

- `tests/git-engine/`
- `tests/progress/`
- `tests/streaks/`
- `tests/terminal/`

---

## Current architecture summary

### Frontend
- Next.js App Router
- React + TypeScript
- Tailwind CSS for styling
- Client components for interactive experiences

### Backend
- Route handlers under `app/api/`
- Supabase server logic for auth and data access
- AI endpoints using Groq API
- Protected server operations for private resources

### Learning model
- Course modules: Pre-Git, Beginner, Intermediate, Advanced
- Lessons are stored and fetched through the course layer
- Progress and completion are tracked per user

### AI model
- AI tutor flows through `/api/ai`
- Conversations are stored in Supabase
- Messages are protected by authenticated user ownership
- Streaming responses are rendered in the chat UI

---

## Current status
The project already has the following foundations:

- app structure and routes
- authentication and protected pages
- AI tutor interface and backend
- project data and course scaffolding
- terminal and command simulation foundation
- progress/challenges infrastructure

The work still in progress is mainly around:

- making the AI chat feel like a polished real app
- deepening the learning content by level
- improving terminal behavior and simulator realism
- validating challenges and progress more meaningfully
- polishing the final product UX and user flow

---

## Recommended next work order
1. Improve learning content depth for each module
2. Finalize AI chat polish
3. Harden terminal and simulator behavior
4. Improve challenge validation
5. Improve progress and achievements logic
6. Run full app validation and UX review

---

## Notes
This project is already a strong base, but it still needs a proper product-level pass to become a polished Git education platform. The focus should stay on real learning outcomes, human-friendly UX, and practical Git workflows rather than visual decoration alone.
