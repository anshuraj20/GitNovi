'use client';

import { useEffect, useState, useMemo } from 'react';
import { courseCatalog } from '@/lib/course/courseCatalog';
import { challengesCatalog } from '@/lib/challenges/challengeCatalog';
import { getLocalStreak } from '@/lib/progress/streak';
import { syncUserProgressWithServer } from '@/lib/storage/userCache';
import { ProgressBar } from '@/components/ui/ProgressBar';
import Link from 'next/link';

export function DashboardLiveView({
  userId,
  initialProfile,
  initialStreak,
  initialCompletedLessonIds = [],
  initialCompletedChallengeIds = [],
  serverActivity = [],
  initialAchievementsCount = 0,
}: {
  userId?: string;
  initialProfile?: { display_name?: string; email?: string; current_level?: string } | null;
  initialStreak?: { current_streak?: number; longest_streak?: number } | null;
  initialCompletedLessonIds?: string[];
  initialCompletedChallengeIds?: string[];
  serverActivity?: any[];
  initialAchievementsCount?: number;
}) {
  const allLessons = useMemo(() => Object.values(courseCatalog).flatMap((m) => m.lessons), []);
  const totalLessons = allLessons.length;
  const totalChallenges = challengesCatalog.length;

  const [completedLessonSet, setCompletedLessonSet] = useState<Set<string>>(() => new Set(initialCompletedLessonIds));
  const [completedChallengeSet, setCompletedChallengeSet] = useState<Set<string>>(() => new Set(initialCompletedChallengeIds));
  const [streakData, setStreakData] = useState(() => ({
    current_streak: initialStreak?.current_streak ?? 1,
    longest_streak: initialStreak?.longest_streak ?? 1,
  }));

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (userId) {
        syncUserProgressWithServer(userId, initialCompletedLessonIds, initialCompletedChallengeIds);
      }

      const local = getLocalStreak();
      setStreakData({
        current_streak: Math.max(initialStreak?.current_streak ?? 0, local.current_streak || 1),
        longest_streak: Math.max(initialStreak?.longest_streak ?? 0, local.longest_streak || 1),
      });

      const lessonDone = new Set<string>(initialCompletedLessonIds);
      allLessons.forEach((l) => {
        const saved = localStorage.getItem(`gitnovi_lesson_${l.id}`);
        if (saved === 'true') lessonDone.add(l.id);
        else if (saved === 'false') lessonDone.delete(l.id);
      });
      setCompletedLessonSet(lessonDone);

      const challengeDone = new Set<string>(initialCompletedChallengeIds);
      challengesCatalog.forEach((c) => {
        const saved = localStorage.getItem(`gitnovi_challenge_${c.id}`);
        if (saved === 'true') challengeDone.add(c.id);
        else if (saved === 'false') challengeDone.delete(c.id);
      });
      setCompletedChallengeSet(challengeDone);
    }
  }, [allLessons, userId, initialCompletedLessonIds, initialCompletedChallengeIds, initialStreak]);

  const completedLessonCount = completedLessonSet.size;
  const completedChallengeCount = completedChallengeSet.size;
  const percent = totalLessons > 0 ? Math.round((completedLessonCount / totalLessons) * 100) : 0;

  const [resolvedName, setResolvedName] = useState(
    initialProfile?.display_name || initialProfile?.email?.split('@')[0] || 'Developer'
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('gitnovi_profile_name');
      if (local && local !== initialProfile?.email?.split('@')[0]) {
        setResolvedName(local);
      } else if (initialProfile?.display_name) {
        setResolvedName(initialProfile.display_name);
      }
    }
  }, [initialProfile]);

  const currentStreak = streakData.current_streak;
  const longestStreak = streakData.longest_streak;

  const modules = [
    { slug: 'pre-git', name: 'Pre-Git Foundations', data: courseCatalog['pre-git'] },
    { slug: 'beginner', name: 'Beginner Git', data: courseCatalog['beginner'] },
    { slug: 'intermediate', name: 'Intermediate Git', data: courseCatalog['intermediate'] },
    { slug: 'advanced', name: 'Advanced Git', data: courseCatalog['advanced'] },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 border-b border-[#202934] pb-4">
        <div>
          <div className="text-xs font-mono text-[#737F8C]">Workspace</div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#E6EDF3] mt-0.5">
            Welcome, {resolvedName}
          </h1>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#737F8C] font-mono">
          <span>Streak: <strong className="text-[#E6EDF3]">{currentStreak} days</strong></span>
          <span>·</span>
          <span>Best: <strong className="text-[#E6EDF3]">{longestStreak} days</strong></span>
        </div>
      </div>

      {/* Progress Summary Card */}
      <div className="rounded-lg border border-[#293542] bg-[#11161D] p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-[#737F8C]">Curriculum Progress</div>
            <div className="text-base sm:text-lg font-bold text-[#E6EDF3] mt-0.5">
              {completedLessonCount} of {totalLessons} lessons completed
            </div>
          </div>
          <span className="text-xl font-bold text-[#22D3EE] font-mono">{percent}%</span>
        </div>

        <ProgressBar value={percent} />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-[#202934] pt-3 text-xs">
          <div>
            <div className="text-[#737F8C]">Lessons</div>
            <div className="font-mono font-semibold text-[#E6EDF3] mt-0.5">{completedLessonCount} / {totalLessons}</div>
          </div>
          <div>
            <div className="text-[#737F8C]">Challenges</div>
            <div className="font-mono font-semibold text-[#E6EDF3] mt-0.5">{completedChallengeCount} / {totalChallenges}</div>
          </div>
          <div>
            <div className="text-[#737F8C]">Milestones</div>
            <div className="font-mono font-semibold text-[#E6EDF3] mt-0.5">{initialAchievementsCount}</div>
          </div>
          <div>
            <div className="text-[#737F8C]">Activity</div>
            <div className="font-mono font-semibold text-[#E6EDF3] mt-0.5">{currentStreak}d streak</div>
          </div>
        </div>
      </div>

      {/* Curriculum Tracks */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-[#737F8C] uppercase tracking-wider font-mono">
            Track Progress
          </h2>
          <Link href="/learn" className="text-xs text-[#22D3EE] hover:underline">
            All lessons →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {modules.map(({ slug, name, data }) => {
            const modLessons = data?.lessons ?? [];
            const modDone = modLessons.filter((l) => completedLessonSet.has(l.id)).length;
            const modTotal = modLessons.length;
            const modPercent = modTotal > 0 ? Math.round((modDone / modTotal) * 100) : 0;

            return (
              <Link
                key={slug}
                href={`/learn/${slug}`}
                className="rounded-lg border border-[#293542] bg-[#11161D] p-4 flex flex-col justify-between hover:border-[#22D3EE]/40 hover:bg-[#171D25] transition"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-[#737F8C]">
                    <span>Level {data?.level ?? 0}</span>
                    <span>{modDone}/{modTotal}</span>
                  </div>

                  <h3 className="text-sm font-semibold text-[#E6EDF3] mt-1.5">
                    {name}
                  </h3>

                  <div className="mt-3 h-1 w-full bg-[#090D12] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#22D3EE]"
                      style={{ width: `${modPercent}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3 text-xs font-medium text-[#22D3EE]">
                  {modPercent === 100 ? 'Review ✓' : 'Continue →'}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
