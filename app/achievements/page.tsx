import { requireUser } from '@/lib/supabase/server';
import { AchievementsLiveView } from '@/components/achievements/AchievementsLiveView';
import Link from 'next/link';

export default async function AchievementsPage() {
  const { user, supabase } = await requireUser();

  const { data: earned } = await supabase
    .from('user_achievements')
    .select('achievement_id')
    .eq('user_id', user.id);

  const earnedIds = (earned ?? []).map((a) => a.achievement_id);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      {/* Back Button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#A7B0BC] hover:text-[#22D3EE] transition mb-6 group"
      >
        <svg
          className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-[#22D3EE]"
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

      <div className="flex flex-col gap-2">
        <div className="text-xs font-bold uppercase tracking-[0.2em] font-mono text-[#22D3EE]">
          GitNovi / Achievements
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#E6EDF3] tracking-tight">
          Your Earned Milestones
        </h1>
        <p className="mt-1 text-[#A7B0BC] text-sm sm:text-base max-w-2xl">
          Unlock achievements as you learn concepts, master Git commands in the terminal, and complete hands-on challenges.
        </p>
      </div>

      <div className="mt-8">
        <AchievementsLiveView initialEarnedIds={earnedIds} />
      </div>
    </div>
  );
}
