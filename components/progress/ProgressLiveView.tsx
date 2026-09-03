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

  // Sync client-side localStorage and isolate user
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
  const challengePercent = totalChallenges > 0 ? Math.round((completedChallengeCount / totalChallenges) * 100) : 0;

  const currentStreak = streakData.current_streak;
  const longestStreak = streakData.longest_streak;

  const commandsCount = (serverActivity ?? []).reduce((acc, row) => acc + (row.commands ?? 0), 0);
  const minutesCount = (serverActivity ?? []).reduce((acc, row) => acc + (row.minutes ?? 0), 0);

  const modules = [
    { slug: 'pre-git', name: 'Pre-Git Foundations', data: courseCatalog['pre-git'] },
    { slug: 'beginner', name: 'Beginner Git', data: courseCatalog['beginner'] },
    { slug: 'intermediate', name: 'Intermediate Git', data: courseCatalog['intermediate'] },
    { slug: 'advanced', name: 'Advanced Git', data: courseCatalog['advanced'] },
  ];

  return (
    <div className="mt-8 space-y-8">
      {/* Top Global Metric Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-xl shadow-slate-950/20">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Course Completion
            </span>
            <div className="text-xl font-bold text-white mt-0.5">Full Curriculum Progress</div>
          </div>
          <span className="text-3xl font-extrabold text-cyan-400 font-mono">{overallPercent}%</span>
        </div>

        <div className="mt-4">
          <ProgressBar value={overallPercent} />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-800/80 pt-5 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <div className="text-xs text-slate-500">Lessons Completed</div>
            <div className="mt-1 text-2xl font-black text-slate-100 font-mono">
              {completedLessonCount} <span className="text-xs text-slate-500 font-normal">/ {totalLessons}</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <div className="text-xs text-slate-500">Challenges Verified</div>
            <div className="mt-1 text-2xl font-black text-slate-100 font-mono">
              {completedChallengeCount} <span className="text-xs text-slate-500 font-normal">/ {totalChallenges}</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <div className="text-xs text-slate-500">Commands Run</div>
            <div className="mt-1 text-2xl font-black text-cyan-300 font-mono">{commandsCount}</div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <div className="text-xs text-slate-500">Active Streak</div>
            <div className="mt-1 text-2xl font-black text-amber-400 font-mono">🔥 {currentStreak} days</div>
          </div>
        </div>
      </div>

      {/* Module-by-Module Progress Breakdown */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-4">
          Curriculum Tier Breakdown
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {modules.map(({ slug, name, data }) => {
            const modLessons = data?.lessons ?? [];
            const modDone = modLessons.filter((l) => completedLessonSet.has(l.id)).length;
            const modTotal = modLessons.length;
            const modPercent = modTotal > 0 ? Math.round((modDone / modTotal) * 100) : 0;

            return (
              <div
                key={slug}
                className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-lg shadow-slate-950/20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                      Level {data?.level ?? 0}
                    </span>
                    <h3 className="text-base font-bold text-slate-100 mt-0.5">{name}</h3>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-cyan-300 font-mono">{modPercent}%</span>
                    <div className="text-xs text-slate-500 font-mono">{modDone} / {modTotal} lessons</div>
                  </div>
                </div>

                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full bg-cyan-400 transition-all duration-300"
                    style={{ width: `${modPercent}%` }}
                  />
                </div>

                <div className="mt-4 flex items-center justify-between text-xs">
                  <Link
                    href={`/learn/${slug}`}
                    className="font-semibold text-cyan-400 hover:text-cyan-300 transition"
                  >
                    View lessons →
                  </Link>
                  <span className="text-slate-500 font-mono">
                    {modPercent === 100 ? '✓ Complete' : `${modTotal - modDone} remaining`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Challenges & Momentum Row */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Challenges Lab Progress */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg shadow-slate-950/20">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Hands-on Challenges Lab</h3>
            <span className="text-base font-bold text-cyan-300 font-mono">{challengePercent}%</span>
          </div>

          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${challengePercent}%` }}
            />
          </div>

          <p className="mt-3 text-xs leading-relaxed text-slate-400">
            Practice real terminal operations in the sandbox and verify your repository state.
          </p>

          <div className="mt-5 flex items-center justify-between border-t border-slate-800/80 pt-4 text-xs">
            <span className="font-mono text-slate-300">{completedChallengeCount} of {totalChallenges} passed</span>
            <Link
              href="/challenges"
              className="font-bold text-cyan-400 hover:text-cyan-300 transition"
            >
              Open Challenges →
            </Link>
          </div>
        </div>

        {/* Activity & Streaks History */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg shadow-slate-950/20">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Activity Momentum</h3>
            <span className="text-xs font-mono text-slate-500">{longestStreak} day record</span>
          </div>

          <div className="mt-4 space-y-2.5">
            {(serverActivity ?? []).length === 0 ? (
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-center text-xs text-slate-400">
                No activity logged yet. Practice in the terminal or complete a lesson to track activity.
              </div>
            ) : (
              (serverActivity ?? []).slice(0, 5).map((row) => (
                <div
                  key={row.activity_date}
                  className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/50 px-3.5 py-2 text-xs"
                >
                  <span className="font-medium text-slate-200">{String(row.activity_date)}</span>
                  <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                    <span>{row.lessons ?? 0} lessons</span>
                    <span>•</span>
                    <span>{row.commands ?? 0} commands</span>
                    <span>•</span>
                    <span>{row.challenges ?? 0} challenges</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
