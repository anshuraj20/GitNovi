'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { commandCatalog } from '@/lib/git-engine/command-catalog';

export function CommandExplorer() {
  const [q, setQ] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [expandedCmd, setExpandedCmd] = useState<string | null>(null);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    return commandCatalog.filter((c) => {
      const matchesQuery =
        !query ||
        c.name.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.syntax.toLowerCase().includes(query) ||
        c.examples.some((ex) => ex.toLowerCase().includes(query));

      const matchesCategory =
        filterCategory === 'all' ||
        (filterCategory === 'dangerous' ? c.dangerous : c.category === filterCategory);

      return matchesQuery && matchesCategory;
    });
  }, [q, filterCategory]);

  return (
    <div className="space-y-4">
      {/* Search Bar & Filter Row */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter commands by name, syntax, or keyword (init, rebase, plumbing)..."
          className="flex-1 rounded-md border border-[#293542] bg-[#11161D] px-3 py-2 text-xs font-mono text-[#E6EDF3] placeholder-[#737F8C] outline-none focus:border-[#22D3EE]/50"
        />

        <div className="flex items-center gap-1 text-xs overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All' },
            { id: 'porcelain', label: 'Porcelain' },
            { id: 'plumbing', label: 'Plumbing' },
            { id: 'dangerous', label: 'Dangerous' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilterCategory(cat.id)}
              className={`rounded px-2.5 py-1 text-xs transition cursor-pointer ${
                filterCategory === cat.id
                  ? 'bg-[#083344] text-[#22D3EE] font-medium'
                  : 'text-[#737F8C] hover:text-[#E6EDF3] hover:bg-[#11161D]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs text-[#737F8C] font-mono">
        Showing {results.length} of {commandCatalog.length} commands
      </div>

      {/* Compact Reference Table / List */}
      <div className="rounded-lg border border-[#293542] divide-y divide-[#202934] bg-[#11161D] overflow-hidden">
        {results.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#737F8C] font-mono">
            No commands match &quot;{q}&quot;.
          </div>
        ) : (
          results.map((c) => {
            const isExpanded = expandedCmd === c.name;

            return (
              <div
                key={c.name}
                className="p-3 sm:p-4 hover:bg-[#171D25] transition"
              >
                <div
                  onClick={() => setExpandedCmd(isExpanded ? null : c.name)}
                  className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 cursor-pointer"
                >
                  <div className="flex items-baseline gap-2.5 flex-wrap">
                    <code className="font-mono text-xs font-bold text-[#E6EDF3]">
                      {c.name}
                    </code>
                    <span className="text-xs text-[#A7B0BC] leading-normal">
                      {c.description}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono text-[#737F8C] shrink-0 pt-1 sm:pt-0">
                    <span className="capitalize">{c.category}</span>
                    {c.dangerous && (
                      <span className="text-[#FBBF24] font-semibold">dangerous</span>
                    )}
                    <span className="text-[#22D3EE] font-sans font-medium text-xs">
                      {isExpanded ? 'Hide' : 'Details'}
                    </span>
                  </div>
                </div>

                {/* Expanded Syntax & Examples */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-[#202934] space-y-2 text-xs">
                    <div>
                      <div className="font-mono text-[10px] text-[#737F8C] uppercase">
                        Syntax
                      </div>
                      <code className="block mt-0.5 rounded border border-[#202934] bg-[#090D12] p-2 font-mono text-xs text-[#E6EDF3] overflow-x-auto whitespace-pre">
                        {c.syntax}
                      </code>
                    </div>

                    {c.examples && c.examples.length > 0 && (
                      <div>
                        <div className="font-mono text-[10px] text-[#737F8C] uppercase">
                          Examples
                        </div>
                        <div className="mt-0.5 space-y-1">
                          {c.examples.map((ex, i) => (
                            <code
                              key={i}
                              className="block rounded border border-[#202934] bg-[#090D12] p-2 font-mono text-xs text-[#A7B0BC] overflow-x-auto whitespace-pre"
                            >
                              {ex}
                            </code>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-1 flex items-center justify-between text-xs text-[#737F8C]">
                      <div>{c.difficulty && <span className="capitalize">Level: {c.difficulty}</span>}</div>
                      <Link
                        href="/terminal"
                        className="text-[#22D3EE] hover:underline"
                      >
                        Try in sandbox →
                      </Link>
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
