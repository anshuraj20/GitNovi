import { ChallengesExplorer } from '@/components/challenges/ChallengesExplorer';
import { requireUser } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function ChallengesPage() {
  const { user, supabase } = await requireUser();

  const [{ data: progress }, { data: terminalSession }] = await Promise.all([
    supabase
      .from('challenge_progress')
      .select('challenge_id')
      .eq('user_id', user.id)
      .eq('completed', true),
    supabase
      .from('terminal_sessions')
      .select('state')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const initialCompletedIds = (progress ?? []).map((p) => p.challenge_id);
  const repoState = terminalSession?.state ?? null;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      {/* Back Button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-300 transition mb-6 group"
      >
        <svg
          className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-cyan-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <span>Back to Dashboard</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="text-xs uppercase tracking-[0.2em] font-mono text-cyan-400">
          Hands-On Lab
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Git Terminal Challenges
        </h1>
        <p className="mt-1 text-slate-400 text-sm sm:text-base max-w-2xl">
          Apply your Git knowledge to real-world scenarios. Practice each challenge in the Sandbox Terminal and click Verify to validate your repository state.
        </p>
      </div>

      {/* Challenges Explorer */}
      <ChallengesExplorer
        initialCompletedIds={initialCompletedIds}
        repoState={repoState}
      />
    </div>
  );
}
