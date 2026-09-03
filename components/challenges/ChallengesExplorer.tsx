'use client';

import { useMemo, useState, useEffect } from 'react';
import { challengesCatalog, Challenge } from '@/lib/challenges/challengeCatalog';
import { CompleteChallengeButton } from './CompleteChallengeButton';
import Link from 'next/link';

export function ChallengesExplorer({
  initialCompletedIds = [],
  repoState,
}: {
  initialCompletedIds?: string[];
  repoState?: any;
}) {
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [completedSet, setCompletedSet] = useState<Set<string>>(() => new Set(initialCompletedIds));
  const [activeHint, setActiveHint] = useState<string | null>(null);

  // Synchronize with local storage on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedDone = new Set<string>(initialCompletedIds);
      challengesCatalog.forEach((c) => {
        const saved = localStorage.getItem(`gitnovi_challenge_${c.id}`);
        if (saved === 'true') {
          storedDone.add(c.id);
        } else if (saved === 'false') {
          storedDone.delete(c.id);
        }
      });
      setCompletedSet(storedDone);
    }
  }, [initialCompletedIds]);

  const filteredChallenges = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return challengesCatalog.filter((c) => {
      const matchesSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.goal.toLowerCase().includes(q) ||
        c.requiredCommands.some((cmd) => cmd.toLowerCase().includes(q));

      const matchesLevel =
        filterLevel === 'all' ||
        (filterLevel === 'completed' ? completedSet.has(c.id) : false) ||
        (filterLevel === 'incomplete' ? !completedSet.has(c.id) : false) ||
        c.level === filterLevel;

      return matchesSearch && matchesLevel;
    });
  }, [searchQuery, filterLevel, completedSet]);

  const totalXP = challengesCatalog.reduce((acc, c) => acc + c.xp, 0);
  const earnedXP = challengesCatalog
    .filter((c) => completedSet.has(c.id))
    .reduce((acc, c) => acc + c.xp, 0);
  const percent = Math.round((completedSet.size / challengesCatalog.length) * 100);

  return (
    <div className="mt-8 space-y-6">
      {/* Progress Metric Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-slate-950/80 p-5 shadow-lg shadow-slate-950/30">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400">
              Lab Mastery
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                {completedSet.size} / {challengesCatalog.length}
              </span>
              <span className="text-xs text-slate-400">challenges completed</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                XP Earned
              </div>
              <div className="text-lg font-bold text-cyan-300">
                {earnedXP} / {totalXP} XP
              </div>
            </div>

            <div className="h-10 w-10 rounded-full border-2 border-cyan-500/40 bg-cyan-500/10 flex items-center justify-center font-bold text-xs text-cyan-300">
              {percent}%
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-950">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search challenges (e.g. branch, merge, rebase, stash)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 pl-10 text-xs text-white placeholder-slate-500 shadow-inner outline-none transition focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40"
          />
          <svg
            className="absolute left-3.5 top-3 h-4 w-4 text-slate-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Level Filters */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          {['all', 'beginner', 'intermediate', 'advanced', 'completed'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`rounded-lg px-3 py-1.5 capitalize transition cursor-pointer ${
                filterLevel === lvl
                  ? 'border border-cyan-500/50 bg-cyan-500/20 font-semibold text-cyan-300'
                  : 'border border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Challenges List */}
      <div className="grid gap-4">
        {filteredChallenges.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-8 text-center text-xs text-slate-400">
            No challenges found matching your criteria.
          </div>
        ) : (
          filteredChallenges.map((challenge) => {
            const isDone = completedSet.has(challenge.id);
            const isHintOpen = activeHint === challenge.id;

            return (
              <div
                key={challenge.id}
                className={`rounded-2xl border p-5 sm:p-6 transition shadow-lg ${
                  isDone
                    ? 'border-emerald-500/30 bg-slate-900/40 shadow-emerald-950/10'
                    : 'border-slate-800 bg-slate-900/60 shadow-slate-950/20 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          challenge.level === 'beginner'
                            ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                            : challenge.level === 'intermediate'
                            ? 'border border-cyan-500/30 bg-cyan-500/10 text-cyan-400'
                            : 'border border-purple-500/30 bg-purple-500/10 text-purple-400'
                        }`}
                      >
                        {challenge.level}
                      </span>

                      <span className="text-xs font-bold text-slate-400 font-mono">
                        +{challenge.xp} XP
                      </span>

                      {isDone && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 font-mono">
                          <span>✓</span>
                          <span>Completed</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white">
                      {challenge.title}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                      {challenge.goal}
                    </p>

                    {/* Required Commands Checklist */}
                    <div className="pt-2 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono mr-1">
                        Commands:
                      </span>
                      {challenge.requiredCommands.map((cmd) => (
                        <code
                          key={cmd}
                          className="rounded-md border border-slate-800 bg-slate-950 px-2 py-0.5 font-mono text-[11px] text-cyan-300"
                        >
                          {cmd}
                        </code>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:items-end gap-2.5 shrink-0 pt-2 sm:pt-0">
                    <div className="flex items-center gap-2">
                      <Link
                        href="/terminal"
                        className="rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:border-slate-700 hover:text-white"
                      >
                        Open Terminal →
                      </Link>

                      <CompleteChallengeButton
                        challengeId={challenge.id}
                        challengeSlug={challenge.slug}
                        initialCompleted={isDone}
                        repoState={repoState}
                        onCompleted={(isNowDone) => {
                          setCompletedSet((prev) => {
                            const next = new Set(prev);
                            if (isNowDone) next.add(challenge.id);
                            else next.delete(challenge.id);
                            return next;
                          });
                        }}
                      />
                    </div>

                    {/* Hint Toggle */}
                    <button
                      type="button"
                      onClick={() => setActiveHint(isHintOpen ? null : challenge.id)}
                      className="text-[11px] text-slate-500 hover:text-cyan-400 transition font-mono self-start sm:self-auto cursor-pointer"
                    >
                      {isHintOpen ? 'Hide Hint ▲' : 'Show Solution Hint ▼'}
                    </button>
                  </div>
                </div>

                {/* Solution Hint Box */}
                {isHintOpen && (
                  <div className="mt-4 rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-4 text-xs text-slate-300 animate-fadeIn">
                    <div className="font-bold text-cyan-300 font-mono text-[11px] uppercase tracking-wider mb-1">
                      💡 Challenge Hint & Steps
                    </div>
                    <div className="leading-relaxed whitespace-pre-line text-slate-300 font-mono text-[11px]">
                      {challenge.hint}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
