'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { commandCatalog } from '@/lib/git-engine/command-catalog';

export function CommandExplorer() {
  const [q, setQ] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    return commandCatalog.filter((c) => {
      const matchesQuery =
        !query ||
        c.name.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.syntax.toLowerCase().includes(query) ||
        c.examples.some((ex) => ex.toLowerCase().includes(query));

      const matchesDifficulty =
        filterDifficulty === 'all' || c.difficulty === filterDifficulty;

      const matchesCategory =
        filterCategory === 'all' ||
        (filterCategory === 'dangerous' ? c.dangerous : c.category === filterCategory);

      return matchesQuery && matchesDifficulty && matchesCategory;
    });
  }, [q, filterDifficulty, filterCategory]);

  return (
    <div className="mt-8">
      {/* Search & Filters */}
      <div className="flex flex-col gap-4">
        <div className="relative">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search commands, syntax, or keywords (e.g. init, commit, rebase, plumbing)..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 pl-11 text-sm text-slate-100 placeholder-slate-500 shadow-inner outline-none transition focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40"
          />
          <svg
            className="absolute left-4 top-3.5 h-4 w-4 text-slate-500"
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
          {q && (
            <button
              onClick={() => setQ('')}
              className="absolute right-3 top-3 text-xs text-slate-500 hover:text-slate-300 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap gap-1.5">
            {['all', 'beginner', 'intermediate', 'advanced'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterDifficulty(lvl)}
                className={`rounded-lg px-3 py-1.5 capitalize transition cursor-pointer ${
                  filterDifficulty === lvl
                    ? 'border border-cyan-500/50 bg-cyan-500/20 font-semibold text-cyan-300'
                    : 'border border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'All types' },
              { id: 'porcelain', label: 'Porcelain' },
              { id: 'plumbing', label: 'Plumbing' },
              { id: 'dangerous', label: 'Dangerous' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`rounded-lg px-3 py-1.5 transition cursor-pointer ${
                  filterCategory === cat.id
                    ? 'border border-cyan-500/50 bg-cyan-500/20 font-semibold text-cyan-300'
                    : 'border border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing {results.length} of {commandCatalog.length} commands
        </span>
        {(q || filterDifficulty !== 'all' || filterCategory !== 'all') && (
          <button
            onClick={() => {
              setQ('');
              setFilterDifficulty('all');
              setFilterCategory('all');
            }}
            className="text-cyan-400 hover:underline cursor-pointer"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Command Cards Grid */}
      <div className="mt-4 grid gap-4">
        {results.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-8 text-center text-sm text-slate-400">
            No Git commands found matching &quot;{q}&quot;. Try searching for another term.
          </div>
        ) : (
          results.map((c) => (
            <div
              key={c.name}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-lg shadow-slate-950/20 transition hover:border-slate-700/80"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <code className="text-base font-bold text-cyan-300">{c.name}</code>

                  {/* Difficulty Badge */}
                  <span
                    className={`rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                      c.difficulty === 'beginner'
                        ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                        : c.difficulty === 'intermediate'
                        ? 'border border-cyan-500/30 bg-cyan-500/10 text-cyan-400'
                        : 'border border-purple-500/30 bg-purple-500/10 text-purple-400'
                    }`}
                  >
                    {c.difficulty}
                  </span>

                  {/* Category Badge */}
                  <span className="rounded-md border border-slate-800 bg-slate-950/60 px-2 py-0.5 text-[11px] uppercase tracking-wider text-slate-400">
                    {c.category}
                  </span>

                  {c.dangerous && (
                    <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-amber-300">
                      dangerous
                    </span>
                  )}

                  {!c.implemented && (
                    <span className="rounded-md border border-slate-800 bg-slate-950/80 px-2 py-0.5 text-[11px] text-slate-500">
                      reference only
                    </span>
                  )}
                </div>

                {c.version && (
                  <span className="text-[11px] text-slate-600 font-mono">
                    Git {c.version}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="mt-3 text-sm leading-6 text-slate-300">{c.description}</p>

              {/* Syntax */}
              <div className="mt-4 rounded-xl border border-slate-800/80 bg-slate-950/60 p-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Syntax
                </div>
                <code className="mt-1 block overflow-x-auto text-xs font-medium text-slate-200">
                  {c.syntax}
                </code>
              </div>

              {/* Examples */}
              {c.examples && c.examples.length > 0 && (
                <div className="mt-3 rounded-xl border border-slate-800/60 bg-slate-950/40 p-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400/80">
                    Examples
                  </div>
                  <div className="mt-1 space-y-1">
                    {c.examples.map((ex, i) => (
                      <code
                        key={i}
                        className="block text-xs font-mono text-slate-300 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800/40"
                      >
                        {ex}
                      </code>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Links */}
              <div className="mt-4 flex items-center justify-between border-t border-slate-800/60 pt-3 text-xs">
                <Link
                  href={`/learn/${c.difficulty}`}
                  className="inline-flex items-center gap-1 font-semibold text-cyan-400 hover:text-cyan-300 transition"
                >
                  <span>Learn in {c.difficulty}</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/terminal"
                  className="inline-flex items-center gap-1 font-medium text-slate-400 hover:text-slate-200 transition"
                >
                  <span>Sandbox Terminal</span>
                  <span>↗</span>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
