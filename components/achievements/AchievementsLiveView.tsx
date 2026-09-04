'use client';

import { useEffect, useState } from 'react';
import { achievementDefinitions } from '@/lib/achievements/definitions';
import { courseCatalog } from '@/lib/course/courseCatalog';
import { challengesCatalog } from '@/lib/challenges/challengeCatalog';
import { getLocalStreak } from '@/lib/progress/streak';

export function AchievementsLiveView({
  initialEarnedIds = [],
}: {
  initialEarnedIds?: string[];
}) {
  const [earnedSet, setEarnedSet] = useState<Set<string>>(() => new Set(initialEarnedIds));

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const unlocked = new Set<string>(initialEarnedIds);

      const allLessons = Object.values(courseCatalog).flatMap((m) => m.lessons);
      const completedLessons = allLessons.filter((l) => localStorage.getItem(`gitnovi_lesson_${l.id}`) === 'true').length;
      const completedChallenges = challengesCatalog.filter((c) => localStorage.getItem(`gitnovi_challenge_${c.id}`) === 'true').length;
      const streak = getLocalStreak();

      if (completedLessons >= 1) unlocked.add('first-lesson');
      if (completedLessons >= allLessons.length) unlocked.add('course-complete');
      if (completedChallenges >= 1) unlocked.add('first-commit');
      if (completedChallenges >= 5) unlocked.add('terminal-warrior');
      if (streak.longest_streak >= 7 || streak.current_streak >= 7) unlocked.add('streak-7');
      if (streak.longest_streak >= 30 || streak.current_streak >= 30) unlocked.add('streak-30');

      Object.keys(achievementDefinitions).forEach((id) => {
        if (localStorage.getItem(`gitnovi_achievement_${id}`) === 'true') {
          unlocked.add(id);
        }
      });

      setEarnedSet(unlocked);
    }
  }, [initialEarnedIds]);

  const achievementsList = Object.values(achievementDefinitions);
  const totalCount = achievementsList.length;
  const earnedCount = earnedSet.size;
  const percent = totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header Metric */}
      <div className="rounded-lg border border-[#293542] bg-[#11161D] p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-[#737F8C]">Milestone Badges</div>
            <div className="text-base sm:text-lg font-bold text-[#E6EDF3] mt-0.5">
              {earnedCount} of {totalCount} unlocked
            </div>
          </div>
          <span className="text-xl font-bold text-[#22D3EE] font-mono">{percent}%</span>
        </div>

        <div className="h-1.5 w-full bg-[#090D12] rounded-full overflow-hidden">
          <div className="h-full bg-[#22D3EE] transition-all" style={{ width: `${percent}%` }} />
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {achievementsList.map((a) => {
          const isUnlocked = earnedSet.has(a.id);

          return (
            <div
              key={a.id}
              className={`rounded-lg border p-4 flex flex-col justify-between ${
                isUnlocked
                  ? 'border-[#293542] bg-[#11161D]'
                  : 'border-[#202934] bg-[#0B0F14] opacity-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-lg">{a.icon}</span>
                  <span className={`text-[11px] font-mono ${isUnlocked ? 'text-[#34D399] font-medium' : 'text-[#737F8C]'}`}>
                    {isUnlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-[#E6EDF3] mt-2">
                  {a.title}
                </h3>

                <p className="text-xs text-[#A7B0BC] mt-1 leading-relaxed">
                  {a.description}
                </p>
              </div>

              <div className="mt-3 border-t border-[#202934] pt-2 text-[11px] text-[#737F8C] font-mono">
                {a.condition}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
