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
  const percent = totalLessons > 0 ? Math.round((completedLessonCount / totalLessons) * 100) : 0;

  const displayName = initialProfile?.display_name || initialProfile?.email?.split('@')[0] || 'Learner';
  const currentStreak = streakData.current_streak;
  const longestStreak = streakData.longest_streak;

  const currentTier =
    percent >= 75 ? 'Advanced Git' : percent >= 45 ? 'Intermediate Git' : percent >= 20 ? 'Beginner Git' : 'Pre-Git Foundations';

  const nextGoal =
    percent >= 100
      ? '🏆 Mastery achieved! You completed the full curriculum.'
      : percent >= 75
      ? 'Master plumbing internals, custom worktrees, and monorepo scaling.'
      : percent >= 45
      ? 'Practice merging, rebasing, and emergency recovery in the sandbox.'
      : 'Build your fundamentals through basic commits, branching, and diffs.';

  const modules = [
    { slug: 'pre-git', name: 'Pre-Git Foundations', data: courseCatalog['pre-git'] },
    { slug: 'beginner', name: 'Beginner Git', data: courseCatalog['beginner'] },
    { slug: 'intermediate', name: 'Intermediate Git', data: courseCatalog['intermediate'] },
    { slug: 'advanced', name: 'Advanced Git', data: courseCatalog['advanced'] },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-slate-950/90 p-6 shadow-xl shadow-slate-950/20">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] font-mono font-bold text-cyan-400">
            Interactive Learning Hub
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Welcome, {displayName}
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-400 max-w-xl">
            Track your Git mastery across interactive modules, hands-on challenges, and sandbox practice.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2.5 text-sm font-bold text-cyan-300 flex items-center gap-2">
            <span className="text-base">🔥</span>
            <span>{currentStreak} Day Streak</span>
          </div>

          <Link
            href="/terminal"
            className="rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-cyan-500/50 hover:text-white"
          >
            Open Sandbox ↗
          </Link>
        </div>
      </div>

      {/* Main Metric Stats */}
      <div className="grid gap-5 md:grid-cols-3">
        {/* Course Progress Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg shadow-slate-950/20 md:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Overall Curriculum Progress
                </span>
                <div className="text-lg font-bold text-slate-100 mt-0.5">{currentTier}</div>
              </div>
              <span className="text-2xl font-extrabold text-cyan-400 font-mono">{percent}%</span>
            </div>

            <div className="mt-4">
              <ProgressBar value={percent} />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-800/80 pt-4 sm:grid-cols-4">
            <div>
              <div className="text-xs text-slate-500">Lessons Completed</div>
              <div className="mt-1 text-xl font-bold text-slate-100 font-mono">
                {completedLessonCount} <span className="text-xs text-slate-500 font-normal">/ {totalLessons}</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Challenges Passed</div>
              <div className="mt-1 text-xl font-bold text-slate-100 font-mono">
                {completedChallengeCount} <span className="text-xs text-slate-500 font-normal">/ {totalChallenges}</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Earned Badges</div>
              <div className="mt-1 text-xl font-bold text-slate-100 font-mono">
                {initialAchievementsCount}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Best Streak</div>
              <div className="mt-1 text-xl font-bold text-slate-100 font-mono">
                {longestStreak} <span className="text-xs text-slate-500 font-normal">days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Focus Mission */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg shadow-slate-950/20 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
              Current Mission
            </div>
            <h2 className="mt-2 text-xl font-bold text-white">{currentTier}</h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-300">{nextGoal}</p>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <Link
              href="/learn"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow transition hover:bg-cyan-400 active:scale-[0.99]"
            >
              <span>Continue Learning</span>
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <Link
              href="/challenges"
              className="inline-flex w-full items-center justify-center rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2 text-xs font-medium text-slate-400 transition hover:border-slate-700 hover:text-slate-200"
            >
              Practice Challenges →
            </Link>
          </div>
        </div>
      </div>

      {/* Module Breakdown Grid */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-4">
          Course Roadmap & Tier Breakdown
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map(({ slug, name, data }) => {
            const modLessons = data?.lessons ?? [];
            const modDone = modLessons.filter((l) => completedLessonSet.has(l.id)).length;
            const modTotal = modLessons.length;
            const modPercent = modTotal > 0 ? Math.round((modDone / modTotal) * 100) : 0;

            return (
              <Link
                key={slug}
                href={`/learn/${slug}`}
                className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:border-cyan-500/40 hover:bg-slate-900/60 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-cyan-400">Level {data?.level ?? 0}</span>
                    <span className="font-mono text-slate-500">{modDone}/{modTotal}</span>
                  </div>

                  <h3 className="mt-2 text-base font-bold text-slate-100 group-hover:text-cyan-300 transition">
                    {name}
                  </h3>

                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full bg-cyan-400 transition-all duration-300"
                      style={{ width: `${modPercent}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-400 group-hover:text-cyan-300">
                  <span>{modPercent === 100 ? 'Completed ✓' : 'Continue module'}</span>
                  <span>→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Tools & Practice Hub */}
      <div className="grid gap-5 md:grid-cols-3">
        <Link
          href="/terminal"
          className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow transition hover:border-cyan-500/40"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 font-mono text-lg font-bold">
              &gt;_
            </div>
            <div>
              <h3 className="font-bold text-slate-100 group-hover:text-cyan-300 transition">
                Sandbox Terminal
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Practice Git commands in a safe, risk-free virtual engine.
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/commands"
          className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow transition hover:border-cyan-500/40"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 font-mono text-lg font-bold">
              ⌘
            </div>
            <div>
              <h3 className="font-bold text-slate-100 group-hover:text-cyan-300 transition">
                Command Explorer
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Search 50+ Git commands with full syntax and examples.
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/ai"
          className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow transition hover:border-cyan-500/40"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 font-mono text-lg font-bold">
              ✦
            </div>
            <div>
              <h3 className="font-bold text-slate-100 group-hover:text-cyan-300 transition">
                GitNovi AI Tutor
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Ask questions, debug merge issues, and understand internals.
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
