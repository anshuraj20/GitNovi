'use client';

import { useState } from 'react';
import Link from 'next/link';

const trackItems = [
  {
    level: '0',
    slug: 'pre-git',
    title: 'Pre-Git Foundations',
    lessons: '10 lessons',
    desc: 'Terminal mechanics, filesystems, absolute/relative paths, and shell fundamentals before using Git.',
  },
  {
    level: '1',
    slug: 'beginner',
    title: 'Beginner Git',
    lessons: '16 lessons',
    desc: 'Repository initialization, staging index, atomic commits, diffs, history logs, and branching.',
  },
  {
    level: '2',
    slug: 'intermediate',
    title: 'Intermediate Git',
    lessons: '16 lessons',
    desc: 'Team workflows: fast-forward vs 3-way merges, rebasing, stash stacks, reflog recovery, and remotes.',
  },
  {
    level: '3',
    slug: 'advanced',
    title: 'Advanced & Plumbing',
    lessons: '30 lessons',
    desc: 'Object storage (blobs, trees, commits), multiple worktrees, rerere, and low-level plumbing commands.',
  },
];

const terminalTabs = [
  {
    id: 'workflow',
    label: 'Everyday Workflow',
    code: `$ git init my-project
Initialized empty Git repository in /my-project/.git/
$ git status
On branch main (root-commit)
$ git add .
$ git commit -m "feat: initial commit"
[main (root-commit) 8a2c1f0] feat: initial commit
$ git log --oneline
8a2c1f0 (HEAD -> main) feat: initial commit`,
  },
  {
    id: 'branching',
    label: 'Branch & Merge',
    code: `$ git switch -c feature/login
Switched to a new branch 'feature/login'
$ git commit -am "feat: add user login"
[feature/login 3b9e4a1] feat: add user login
$ git switch main
Switched to branch 'main'
$ git merge --no-ff feature/login
Merge made by the 'ort' strategy.`,
  },
  {
    id: 'recovery',
    label: 'Reflog & Recovery',
    code: `$ git reset --hard HEAD~1
HEAD is now at 8a2c1f0 feat: initial commit
# Recover accidental reset using reflog:
$ git reflog
8a2c1f0 (HEAD -> main) HEAD@{0}: reset: moving to HEAD~1
3b9e4a1 HEAD@{1}: commit: feat: add user login
$ git reset --hard HEAD@{1}
HEAD is now at 3b9e4a1 (Commit recovered)`,
  },
  {
    id: 'plumbing',
    label: 'Internals & Objects',
    code: `$ echo "Hello Git" | git hash-object -w --stdin
8ab686eafeb1f44702738c8b0f24f2567c36da6d
$ git cat-file -t 8ab686e
blob
$ git cat-file -p 8ab686e
Hello Git`,
  },
];

export function HomeInteractiveView() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      {/* Intro Section */}
      <section className="space-y-4 max-w-2xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#E6EDF3] tracking-tight">
          Learn and practice Git in your browser.
        </h1>
        <p className="text-sm leading-relaxed text-[#A7B0BC]">
          GitNovi is a practical learning platform. Work through 72 structured lessons from filesystem basics to low-level plumbing internals, practice in a safe virtual terminal sandbox, and solve scenario challenges.
        </p>
        <div className="pt-2 flex flex-wrap gap-2.5">
          <Link
            href="/learn"
            className="rounded-md bg-[#22D3EE] px-4 py-2 text-xs font-semibold text-[#0B0F14] hover:bg-[#67E8F9] transition"
          >
            Start Learning (72 Lessons) →
          </Link>
          <Link
            href="/terminal"
            className="rounded-md border border-[#293542] bg-[#11161D] px-4 py-2 text-xs font-medium text-[#E6EDF3] hover:border-[#22D3EE]/50 transition"
          >
            Open Sandbox Terminal
          </Link>
        </div>
      </section>

      {/* Curriculum Tracks */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#202934] pb-2">
          <h2 className="text-sm font-semibold text-[#E6EDF3] uppercase tracking-wider font-mono">
            Curriculum Tracks
          </h2>
          <Link href="/learn" className="text-xs text-[#22D3EE] hover:underline">
            View all 72 lessons →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {trackItems.map((track) => (
            <Link
              href={`/learn/${track.slug}`}
              key={track.slug}
              className="rounded-lg border border-[#293542] bg-[#11161D] p-4 flex flex-col justify-between hover:border-[#22D3EE]/40 hover:bg-[#171D25] transition"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#737F8C] font-mono">
                  <span>Level {track.level}</span>
                  <span>{track.lessons}</span>
                </div>
                <h3 className="mt-2 text-sm font-semibold text-[#E6EDF3]">
                  {track.title}
                </h3>
                <p className="mt-1.5 text-xs text-[#A7B0BC] leading-relaxed">
                  {track.desc}
                </p>
              </div>
              <div className="mt-4 text-xs font-medium text-[#22D3EE]">
                Open track →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Terminal Sandbox Teaser */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#202934] pb-2">
          <h2 className="text-sm font-semibold text-[#E6EDF3] uppercase tracking-wider font-mono">
            Terminal Sandbox Preview
          </h2>
          <Link href="/terminal" className="text-xs text-[#22D3EE] hover:underline">
            Open full sandbox →
          </Link>
        </div>

        <div className="rounded-lg border border-[#293542] bg-[#11161D] overflow-hidden">
          {/* Workflow Tabs */}
          <div className="flex items-center border-b border-[#202934] bg-[#0B0F14] px-2 py-1 overflow-x-auto gap-1">
            {terminalTabs.map((tab, idx) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`rounded px-2.5 py-1 text-xs font-mono transition whitespace-nowrap cursor-pointer ${
                  activeTab === idx
                    ? 'bg-[#083344] text-[#22D3EE] font-medium'
                    : 'text-[#737F8C] hover:text-[#E6EDF3]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Terminal Screen */}
          <div className="p-4 bg-[#090D12]">
            <pre className="font-mono text-xs text-[#E6EDF3] leading-relaxed overflow-x-auto whitespace-pre">
              {terminalTabs[activeTab].code}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}
