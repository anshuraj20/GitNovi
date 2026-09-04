import { requireUser } from '@/lib/supabase/server';
import { ProgressLiveView } from '@/components/progress/ProgressLiveView';
import Link from 'next/link';

export default async function ProgressPage() {
  const { user, supabase } = await requireUser();

  const [
    { data: streakData },
    { data: activityData },
    { count: userAchievements },
    { data: lessonsProgress },
    { data: challengeProgress },
  ] = await Promise.all([
    supabase.from('user_streaks').select('current_streak,longest_streak').eq('user_id', user.id).maybeSingle(),
    supabase
      .from('daily_activity')
      .select('activity_date,commands,lessons,challenges,minutes')
      .eq('user_id', user.id)
      .order('activity_date', { ascending: false })
      .limit(14),
    supabase.from('user_achievements').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('lesson_progress').select('lesson_id').eq('user_id', user.id).eq('completed', true),
    supabase.from('challenge_progress').select('challenge_id').eq('user_id', user.id).eq('completed', true),
  ]);

  const completedLessonIds = (lessonsProgress ?? []).map((l) => l.lesson_id);
  const completedChallengeIds = (challengeProgress ?? []).map((c) => c.challenge_id);

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

      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="text-xs font-bold uppercase tracking-[0.22em] font-mono text-[#22D3EE]">
          GitNovi / Progress & Analytics
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#E6EDF3] tracking-tight">
          Your Learning Progress
        </h1>
        <p className="mt-1 text-[#A7B0BC] text-sm sm:text-base max-w-2xl">
          Detailed metrics of your lessons, challenges, terminal commands, active streaks, and momentum.
        </p>
      </div>

      <ProgressLiveView
        userId={user.id}
        initialCompletedLessonIds={completedLessonIds}
        initialCompletedChallengeIds={completedChallengeIds}
        initialStreak={streakData}
        serverActivity={activityData ?? []}
        initialAchievementsCount={userAchievements ?? 0}
      />
    </div>
  );
}
