'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { GitDispatcher } from '@/lib/git-engine/dispatcher';
import { recordStreakActivity } from '@/lib/progress/streak';

import { TerminalInput } from './TerminalInput';
import { TerminalOutput } from './TerminalOutput';
import { TerminalPrompt } from './TerminalPrompt';

const quickCommandGroups = [
  { label: 'Everyday', commands: ['git init', 'git status', 'git add .', 'git commit -m "feat: initial commit"', 'git log --oneline'] },
  { label: 'Branching', commands: ['git branch', 'git switch -c feature/login', 'git merge feature/login', 'git switch main'] },
  { label: 'Internals', commands: ['git rev-parse HEAD', 'git cat-file -p HEAD', 'git ls-tree HEAD', 'git reflog'] },
];

export function GitTerminal() {
  const [dispatcher] = useState(() => new GitDispatcher());
  const [lines, setLines] = useState<{ input: string; output: string; error?: boolean }[]>([]);
  const [branch, setBranch] = useState('main');
  const [activeGroup, setActiveGroup] = useState(0);

  useEffect(() => {
    fetch('/api/terminal/session')
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (payload?.state) {
          dispatcher.state = payload.state;
          setBranch(dispatcher.state.detached ? 'HEAD' : dispatcher.state.branch);
        }
      })
      .catch(() => undefined);
  }, [dispatcher]);

  const run = (input: string) => {
    const result = dispatcher.execute(input);
    setLines((current) => [...current, { input, output: result.output, error: result.error }]);
    setBranch(dispatcher.state.detached ? 'HEAD' : dispatcher.state.branch);
    recordStreakActivity('command');

    const achievementId =
      !result.error && input.trim().startsWith('git commit')
        ? 'first-commit'
        : !result.error && /git (cat-file|hash-object|ls-tree|rev-parse|rev-list|show-ref)/.test(input)
          ? 'internals-explorer'
          : !result.error && /git (reset|reflog)/.test(input)
            ? 'recovery-expert'
            : !result.error && /git (branch|switch|checkout)/.test(input)
              ? 'branch-explorer'
              : undefined;

    void fetch('/api/progress/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: 'command', minutes: 1, achievementId }),
    });

    void fetch('/api/terminal/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state: dispatcher.state }),
    });
  };

  const reset = () => {
    dispatcher.reset();
    setLines([]);
    setBranch('main');

    void fetch('/api/terminal/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state: dispatcher.state }),
    });
  };

  return (
    <div className="rounded-lg border border-[#293542] bg-[#090D12] overflow-hidden">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#293542] bg-[#11161D] px-4 py-2.5 gap-2">
        <div className="font-mono text-xs text-[#E6EDF3] flex items-center gap-2">
          <span>gitnovi ~/sandbox</span>
          <span className="text-[#67E8F9]">({branch})</span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Link
            href="/challenges"
            className="rounded border border-[#293542] bg-[#171D25] px-2.5 py-1 text-[#E6EDF3] hover:border-[#22D3EE]/50 transition"
          >
            Challenges Lab →
          </Link>
          <Link
            href="/commands"
            className="rounded border border-[#293542] bg-[#171D25] px-2.5 py-1 text-[#A7B0BC] hover:text-[#E6EDF3] transition"
          >
            Commands
          </Link>
          <button
            type="button"
            onClick={reset}
            className="rounded border border-[#293542] bg-[#171D25] px-2.5 py-1 text-[#737F8C] hover:text-[#F87171] transition cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Preset Command Bar */}
      <div className="border-b border-[#202934] bg-[#0B0F14] px-3 py-1.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs">
        {/* Group Selector */}
        <div className="flex items-center gap-1">
          {quickCommandGroups.map((grp, idx) => (
            <button
              key={grp.label}
              type="button"
              onClick={() => setActiveGroup(idx)}
              className={`rounded px-2 py-0.5 font-mono text-[11px] transition cursor-pointer ${
                activeGroup === idx
                  ? 'bg-[#083344] text-[#22D3EE]'
                  : 'text-[#737F8C] hover:text-[#E6EDF3]'
              }`}
            >
              {grp.label}
            </button>
          ))}
        </div>

        {/* Command Buttons */}
        <div className="flex flex-wrap gap-1">
          {quickCommandGroups[activeGroup].commands.map((cmd) => (
            <button
              key={cmd}
              type="button"
              onClick={() => run(cmd)}
              className="rounded border border-[#293542] bg-[#11161D] px-2 py-0.5 font-mono text-[11px] text-[#A7B0BC] hover:text-[#E6EDF3] hover:border-[#22D3EE]/40 transition cursor-pointer"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal Screen */}
      <div className="bg-[#090D12] p-3 sm:p-4 font-mono text-xs">
        <div className="min-h-[260px] max-h-[420px] overflow-y-auto p-1">
          {lines.length === 0 ? (
            <div className="text-xs text-[#737F8C] leading-relaxed py-4">
              <div className="text-[#E6EDF3] font-semibold mb-1">Git in-browser virtual environment ready.</div>
              <div>Type any Git command below or click a quick command above.</div>
              <div className="mt-2 text-[#737F8C]">Common starting commands: <code className="text-[#22D3EE]">git init</code>, <code className="text-[#22D3EE]">git status</code>, <code className="text-[#22D3EE]">git commit</code>, <code className="text-[#22D3EE]">git log</code></div>
            </div>
          ) : (
            <TerminalOutput lines={lines} />
          )}

          <TerminalPrompt branch={branch} />
          <TerminalInput onSubmit={run} />
        </div>
      </div>
    </div>
  );
}
