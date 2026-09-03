'use client';

import { useEffect, useState } from 'react';
import { achievementDefinitions, AchievementId } from '@/lib/achievements/definitions';
import { courseCatalog } from '@/lib/course/courseCatalog';
import { challengesCatalog } from '@/lib/challenges/challengeCatalog';
import { getLocalStreak } from '@/lib/progress/streak';
import Link from 'next/link';

export function AchievementsLiveView({
  initialEarnedIds = [],
}: {
  initialEarnedIds?: string[];
}) {
  const [earnedSet, setEarnedSet] = useState<Set<string>>(() => new Set(initialEarnedIds));

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const unlocked = new Set<string>(initialEarnedIds);

    // Check client stats
    const allLessons = Object.values(courseCatalog).flatMap((m) => m.lessons);
    const completedLessons = allLessons.filter((l) => localStorage.getItem(`gitnovi_lesson_${l.id}`) === 'true').length;
    const completedChallenges = challengesCatalog.filter((c) => localStorage.getItem(`gitnovi_challenge_${c.id}`) === 'true').length;
    const streak = getLocalStreak();

    // Auto-unlock conditions based on verified local/cloud progress
    if (completedLessons >= 1) unlocked.add('first-lesson');
    if (completedLessons >= allLessons.length) unlocked.add('course-complete');
    if (completedChallenges >= 1) unlocked.add('first-commit');
    if (completedChallenges >= 5) unlocked.add('terminal-warrior');
    if (streak.longest_streak >= 7 || streak.current_streak >= 7) unlocked.add('streak-7');
    if (streak.longest_streak >= 30 || streak.current_streak >= 30) unlocked.add('streak-30');

    // Also check any explicitly saved achievements
    Object.keys(achievementDefinitions).forEach((id) => {
      if (localStorage.getItem(`gitnovi_achievement_${id}`) === 'true') {
        unlocked.add(id);
      }
    });

    setEarnedSet(unlocked);
  }, [initialEarnedIds]);

  const achievementsList = Object.values(achievementDefinitions);
  const totalCount = achievementsList.length;
  const earnedCount = earnedSet.size;
  const percent = totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0;

  return (
    <div className="mt-8 space-y-8">
      {/* Progress Metric Banner */}
      <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-900/90 via-cyan-950/20 to-slate-950/90 p-6 shadow-xl shadow-slate-950/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] font-mono text-cyan-400">
              Milestone Badges
            </div>
            <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">
              {earnedCount} <span className="text-base text-slate-400 font-normal">/ {totalCount} Unlocked</span>
            </div>
          </div>
          <div className="text-4xl sm:text-5xl">🏆</div>
        </div>

        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>{percent}% of badges earned</span>
          <span>{totalCount - earnedCount} badges remaining</span>
        </div>
      </div>

      {/* Grid of Badges */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {achievementsList.map((a) => {
          const isUnlocked = earnedSet.has(a.id);

          return (
            <div
              key={a.id}
              className={`rounded-2xl border p-5 transition flex flex-col justify-between ${
                isUnlocked
                  ? 'border-cyan-500/40 bg-gradient-to-b from-cyan-950/20 to-slate-900/60 shadow-lg shadow-cyan-950/10'
                  : 'border-slate-800/80 bg-slate-900/30 opacity-70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{a.icon}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      isUnlocked
                        ? 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                        : 'border border-slate-700 bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isUnlocked ? '✓ Unlocked' : 'Locked'}
                  </span>
                </div>

                <h3 className="mt-3 text-base font-bold text-slate-100">{a.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">{a.description}</p>
              </div>

              <div className="mt-4 border-t border-slate-800/60 pt-3 text-[11px] font-mono text-slate-500">
                Condition: <span className="text-slate-300">{a.condition}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white">Keep Learning & Unlocking</h3>
          <p className="mt-0.5 text-xs text-slate-400">
            Practice Git commands in the terminal and complete interactive lessons to unlock the rest.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/learn"
            className="rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-cyan-400"
          >
            Go to Lessons
          </Link>
          <Link
            href="/challenges"
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 transition hover:border-cyan-500/40 hover:text-cyan-300"
          >
            Try Challenges
          </Link>
        </div>
      </div>
    </div>
  );
}
