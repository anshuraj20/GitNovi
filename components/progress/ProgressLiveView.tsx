'use client';

import { useEffect, useState, useMemo } from 'react';
import { courseCatalog } from '@/lib/course/courseCatalog';
import { challengesCatalog } from '@/lib/challenges/challengeCatalog';
import { getLocalStreak } from '@/lib/progress/streak';
import { syncUserProgressWithServer } from '@/lib/storage/userCache';
import { ProgressBar } from '@/components/ui/ProgressBar';
import Link from 'next/link';

export function ProgressLiveView({
  userId,
  initialCompletedLessonIds = [],
  initialCompletedChallengeIds = [],
  initialStreak,
  serverActivity = [],
  initialAchievementsCount = 0,
}: {
  userId?: string;
  initialCompletedLessonIds?: string[];
  initialCompletedChallengeIds?: string[];
  initialStreak?: { current_streak?: number; longest_streak?: number } | null;
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
  const overallPercent = totalLessons > 0 ? Math.round((completedLessonCount / totalLessons) * 100) : 0;

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
      {/* Top Global Metric Card */}
      <div className="rounded-lg border border-[#293542] bg-[#11161D] p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-[#737F8C]">Curriculum Overview</div>
            <div className="text-base sm:text-lg font-bold text-[#E6EDF3] mt-0.5">
              {completedLessonCount} of {totalLessons} lessons completed
            </div>
          </div>
          <span className="text-xl font-bold text-[#22D3EE] font-mono">{overallPercent}%</span>
        </div>

        <ProgressBar value={overallPercent} />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-[#202934] pt-3 text-xs">
          <div>
            <div className="text-[#737F8C]">Lessons Completed</div>
            <div className="font-mono font-semibold text-[#E6EDF3] mt-0.5">{completedLessonCount} / {totalLessons}</div>
          </div>
          <div>
            <div className="text-[#737F8C]">Challenges Passed</div>
            <div className="font-mono font-semibold text-[#E6EDF3] mt-0.5">{completedChallengeCount} / {totalChallenges}</div>
          </div>
          <div>
            <div className="text-[#737F8C]">Current Streak</div>
            <div className="font-mono font-semibold text-[#E6EDF3] mt-0.5">{currentStreak} days</div>
          </div>
          <div>
            <div className="text-[#737F8C]">Best Streak</div>
            <div className="font-mono font-semibold text-[#E6EDF3] mt-0.5">{longestStreak} days</div>
          </div>
        </div>
      </div>

      {/* Track by Track Breakdown */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-[#737F8C] uppercase tracking-wider font-mono">
          Track Completion
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {modules.map(({ slug, name, data }) => {
            const modLessons = data?.lessons ?? [];
            const modDone = modLessons.filter((l) => completedLessonSet.has(l.id)).length;
            const modTotal = modLessons.length;
            const modPercent = modTotal > 0 ? Math.round((modDone / modTotal) * 100) : 0;

            return (
              <div
                key={slug}
                className="rounded-lg border border-[#293542] bg-[#11161D] p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-[#737F8C]">
                    <span>Level {data?.level ?? 0}</span>
                    <span>{modPercent}%</span>
                  </div>

                  <h3 className="text-sm font-semibold text-[#E6EDF3] mt-1">
                    {name}
                  </h3>

                  <div className="mt-2.5">
                    <ProgressBar value={modPercent} />
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-[#202934] pt-2 text-xs text-[#737F8C] font-mono">
                  <span>{modDone} / {modTotal} lessons</span>
                  <Link href={`/learn/${slug}`} className="text-[#22D3EE] hover:underline font-sans">
                    Review →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
