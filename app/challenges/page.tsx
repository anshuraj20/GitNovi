import { ChallengesExplorer } from '@/components/challenges/ChallengesExplorer';
import { requireUser } from '@/lib/supabase/server';

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
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-10 space-y-6">
      <div className="space-y-1.5 max-w-2xl">
        <div className="text-xs font-mono text-[#737F8C]">
          Hands-On Labs
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#E6EDF3] tracking-tight">
          Git Scenario Challenges
        </h1>
        <p className="text-xs sm:text-sm text-[#A7B0BC] leading-relaxed">
          18 practical scenarios. Execute the steps in the Sandbox Terminal and verify your repository state to earn XP.
        </p>
      </div>

      <ChallengesExplorer
        initialCompletedIds={initialCompletedIds}
        repoState={repoState}
      />
    </div>
  );
}
