'use client';

import { useMemo, useState, useEffect } from 'react';
import { challengesCatalog } from '@/lib/challenges/challengeCatalog';
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

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Filter challenges (branch, merge, rebase, stash)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 rounded-md border border-[#293542] bg-[#11161D] px-3 py-2 text-xs font-mono text-[#E6EDF3] placeholder-[#737F8C] outline-none focus:border-[#22D3EE]/50"
        />

        <div className="flex items-center gap-1 text-xs overflow-x-auto pb-1 sm:pb-0">
          {['all', 'beginner', 'intermediate', 'advanced', 'completed'].map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setFilterLevel(lvl)}
              className={`rounded px-2.5 py-1 text-xs capitalize transition cursor-pointer ${
                filterLevel === lvl
                  ? 'bg-[#083344] text-[#22D3EE] font-medium'
                  : 'text-[#737F8C] hover:text-[#E6EDF3] hover:bg-[#11161D]'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-[#737F8C] font-mono">
        <span>{completedSet.size} of {challengesCatalog.length} challenges passed</span>
        <span>Showing {filteredChallenges.length} scenarios</span>
      </div>

      {/* Challenges List */}
      <div className="space-y-3">
        {filteredChallenges.length === 0 ? (
          <div className="rounded-lg border border-[#293542] bg-[#11161D] p-6 text-center text-xs text-[#737F8C] font-mono">
            No challenges found matching your filter.
          </div>
        ) : (
          filteredChallenges.map((challenge) => {
            const isDone = completedSet.has(challenge.id);
            const isHintOpen = activeHint === challenge.id;

            return (
              <div
                key={challenge.id}
                className="rounded-lg border border-[#293542] bg-[#11161D] p-4 sm:p-5 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-[#737F8C]">
                      <span className="capitalize text-[#22D3EE]">{challenge.level}</span>
                      <span>·</span>
                      <span>+{challenge.xp} XP</span>
                      {isDone && (
                        <>
                          <span>·</span>
                          <span className="text-[#34D399] font-semibold">✓ Passed</span>
                        </>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-[#E6EDF3] mt-1">
                      {challenge.title}
                    </h3>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0 flex items-center gap-2 pt-1 sm:pt-0">
                    <CompleteChallengeButton
                      challengeId={challenge.id}
                      challengeSlug={challenge.slug}
                      initialCompleted={isDone}
                      repoState={repoState}
                    />

                    <Link
                      href="/terminal"
                      className="text-xs text-[#22D3EE] hover:underline"
                    >
                      Terminal →
                    </Link>
                  </div>
                </div>

                {/* Objective */}
                <p className="text-xs sm:text-sm text-[#A7B0BC] leading-relaxed">
                  {challenge.goal}
                </p>

                {/* Task Instructions */}
                <div className="space-y-1 text-xs">
                  <div className="font-mono text-[10px] text-[#737F8C] uppercase">
                    Steps to Complete:
                  </div>
                  <ul className="space-y-1 text-[#A7B0BC]">
                    {challenge.instructions.map((inst, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="font-mono text-[#22D3EE]">•</span>
                        <span>{inst}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Collapsible Hint */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setActiveHint(isHintOpen ? null : challenge.id)}
                    className="text-xs text-[#737F8C] hover:text-[#E6EDF3] cursor-pointer"
                  >
                    {isHintOpen ? '▾ Hide hint' : '▸ Show hint'}
                  </button>

                  {isHintOpen && (
                    <div className="mt-2 rounded border border-[#202934] bg-[#090D12] p-2.5 font-mono text-xs text-[#E6EDF3]">
                      {challenge.hint}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
