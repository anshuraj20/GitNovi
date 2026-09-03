# Architecture
GitNovi uses Next.js App Router for the product shell, React components for interactive learning UI, Supabase/Postgres for identity and persistence, and a pure TypeScript virtual Git engine for safe browser practice. The engine is deliberately independent from React so it can be tested in isolation.

## Boundaries
- `app/`: routes and server endpoints.
- `components/`: presentation and interaction.
- `lib/git-engine/`: deterministic educational repository model and command dispatcher.
- `lib/supabase/`: browser/server clients.
- `lib/ai/`: server-side Groq integration.
- `data/`: seed-friendly course metadata.
- `supabase/`: database schema and seed.
