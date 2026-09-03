'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { GitDispatcher } from '@/lib/git-engine/dispatcher';
import { recordStreakActivity } from '@/lib/progress/streak';

import { TerminalInput } from './TerminalInput';
import { TerminalOutput } from './TerminalOutput';
import { TerminalPrompt } from './TerminalPrompt';

const quickCommandGroups = [
  { label: 'Beginner', commands: ['git init', 'git status', 'git add .', 'git commit -m "feat: first commit"', 'git log --oneline'] },
  { label: 'Branching', commands: ['git branch', 'git switch -c feature/auth', 'git merge feature/auth', 'git switch main'] },
  { label: 'Plumbing', commands: ['git rev-parse HEAD', 'git cat-file -p HEAD', 'git ls-tree HEAD', 'git reflog'] },
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
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl shadow-cyan-950/10">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 bg-slate-900/70 px-4 py-3 gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-100 flex items-center gap-2 font-mono">
              <span>GitNovi Virtual Shell</span>
              <span className="text-cyan-400 font-normal">[{branch}]</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
              Safe In-Memory Sandbox · 0 Risk
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/challenges"
            className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
          >
            Challenges Lab →
          </Link>
          <Link
            href="/commands"
            className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-[11px] font-medium text-slate-300 transition hover:border-slate-700 hover:text-white"
          >
            All 62 Commands
          </Link>
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-[11px] font-medium text-rose-300 transition hover:bg-rose-500/20 cursor-pointer"
          >
            Reset repo
          </button>
        </div>
      </div>

      {/* Quick Command Toolbar */}
      <div className="border-b border-slate-800 bg-slate-950/90 px-4 py-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {/* Group Switcher */}
          <div className="flex items-center gap-1">
            {quickCommandGroups.map((grp, idx) => (
              <button
                key={grp.label}
                type="button"
                onClick={() => setActiveGroup(idx)}
                className={`rounded-md px-2.5 py-1 text-[11px] font-mono font-semibold transition cursor-pointer ${
                  activeGroup === idx
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {grp.label}
              </button>
            ))}
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-1.5">
            {quickCommandGroups[activeGroup].commands.map((cmd) => (
              <button
                key={cmd}
                type="button"
                onClick={() => run(cmd)}
                className="rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1 font-mono text-[11px] text-slate-300 transition hover:border-cyan-500/40 hover:text-cyan-200 cursor-pointer"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Terminal Screen */}
      <div className="bg-[#070b14] p-4 font-mono text-sm">
        <div className="mb-4 min-h-[320px] max-h-[440px] overflow-y-auto rounded-xl border border-slate-800/80 bg-[#070b14] p-4">
          {lines.length === 0 ? (
            <div className="flex h-full min-h-[250px] items-center justify-center">
              <div className="max-w-md text-center">
                <div className="text-base font-bold text-slate-200 font-mono">⚡ Git Virtual Sandbox Ready</div>
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Type any of the <span className="text-cyan-300 font-semibold">62 Git commands</span> or click any quick command above.
                  Your working tree, staging index, commit DAG, branches, and reflog are fully simulated in real time.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-500">
                  <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">git init</span>
                  <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">git add .</span>
                  <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">git commit</span>
                  <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">git log</span>
                </div>
              </div>
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
