import { requireUser } from '@/lib/supabase/server';
import { DashboardLiveView } from '@/components/dashboard/DashboardLiveView';

export default async function Dashboard() {
  const { user, supabase } = await requireUser();

  const [
    { data: profileData },
    { data: streakData },
    { data: activityData },
    { count: userAchievements },
    { data: lessonsProgress },
    { data: challengeProgress },
  ] = await Promise.all([
    supabase.from('profiles').select('display_name,email,current_level').eq('id', user.id).maybeSingle(),
    supabase.from('user_streaks').select('current_streak,longest_streak').eq('user_id', user.id).maybeSingle(),
    supabase
      .from('daily_activity')
      .select('activity_date,commands,lessons,challenges,minutes')
      .eq('user_id', user.id)
      .order('activity_date', { ascending: false })
      .limit(7),
    supabase.from('user_achievements').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('lesson_progress').select('lesson_id').eq('user_id', user.id).eq('completed', true),
    supabase.from('challenge_progress').select('challenge_id').eq('user_id', user.id).eq('completed', true),
  ]);

  const completedLessonIds = (lessonsProgress ?? []).map((l) => l.lesson_id);
  const completedChallengeIds = (challengeProgress ?? []).map((c) => c.challenge_id);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <DashboardLiveView
        userId={user.id}
        initialProfile={profileData}
        initialStreak={streakData}
        initialCompletedLessonIds={completedLessonIds}
        initialCompletedChallengeIds={completedChallengeIds}
        serverActivity={activityData ?? []}
        initialAchievementsCount={userAchievements ?? 0}
      />
    </div>
  );
}
