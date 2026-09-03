'use client';

import { useState } from 'react';
import Link from 'next/link';

const trackItems = [
  {
    level: '01',
    slug: 'pre-git',
    title: 'Pre-Git Foundations',
    lessons: '10 Lessons',
    desc: 'Build fundamental CLI mental models: filesystems, directory trees, absolute/relative paths, shell mechanics, and immutable snapshots.',
    badge: 'Level 0',
  },
  {
    level: '02',
    slug: 'beginner',
    title: 'Beginner Fundamentals',
    lessons: '16 Commands',
    desc: 'Master everyday repository essentials: configuration, initialization, cloning, staging index, atomic commits, diffs, log graphs, and branch management.',
    badge: 'Level 1',
  },
  {
    level: '03',
    slug: 'intermediate',
    title: 'Intermediate Collaboration',
    lessons: '16 Commands',
    desc: 'Team branching workflows: remotes, safe fetching, rebasing, interactive squash, fast-forward vs 3-way merges, stash stacks, reflog recovery, and bisecting.',
    badge: 'Level 2',
  },
  {
    level: '04',
    slug: 'advanced',
    title: 'Advanced & Plumbing',
    lessons: '30 Commands',
    desc: 'Deep dive into Git internals: object database (blobs, trees, commits), low-level plumbing, multiple worktrees, sparse checkouts, submodules, rerere, and gc.',
    badge: 'Level 3',
  },
];

const highlights = [
  {
    num: '72',
    label: 'Interactive Lessons',
    desc: 'Structured step-by-step guides with real-world scenarios and common pitfall warnings.',
  },
  {
    num: '62',
    label: 'Git Commands',
    desc: 'Exhaustive command encyclopedia covering porcelain workflows and low-level plumbing.',
  },
  {
    num: '18',
    label: 'Hands-On Labs',
    desc: 'Live terminal challenges with automated state verification and XP tracking.',
  },
  {
    num: '7',
    label: 'AI Tutor Models',
    desc: 'Intelligent AI mentorship with automatic fallback cascading for uninterrupted guidance.',
  },
];

const terminalTabs = [
  {
    id: 'workflow',
    label: '1. Everyday Workflow',
    code: `$ git init my-project
Initialized empty Git repository in /my-project/.git/
$ git status
On branch main (root-commit)
$ git add .
$ git commit -m "feat: initialize project architecture"
[main (root-commit) 8a2c1f0] feat: initialize project architecture
$ git log --oneline
8a2c1f0 (HEAD -> main) feat: initialize project architecture`,
  },
  {
    id: 'branching',
    label: '2. Branch & Switch',
    code: `$ git switch -c feature/oauth-auth
Switched to a new branch 'feature/oauth-auth'
$ git commit -am "feat: add Google and GitHub 1-click login"
[feature/oauth-auth 3b9e4a1] feat: add Google and GitHub 1-click login
$ git switch main
Switched to branch 'main'
$ git merge --no-ff feature/oauth-auth
Merge made by the 'ort' strategy.`,
  },
  {
    id: 'recovery',
    label: '3. Time-Travel & Recovery',
    code: `$ git reset --hard HEAD~1
HEAD is now at 8a2c1f0 feat: initialize project architecture
# Oops! Accidental reset? Use the Reflog time machine:
$ git reflog
8a2c1f0 (HEAD -> main) HEAD@{0}: reset: moving to HEAD~1
3b9e4a1 HEAD@{1}: commit: feat: add Google and GitHub 1-click login
$ git reset --hard HEAD@{1}
HEAD is now at 3b9e4a1 (Commit recovered successfully!)`,
  },
  {
    id: 'plumbing',
    label: '4. Internals & Plumbing',
    code: `$ echo "Hello Git Internals" | git hash-object -w --stdin
e69de29bb2d1d6434b8b29ae775ad8c2e48c5391
$ git cat-file -t e69de29
blob
$ git write-tree
d8329fc1cc938780ffdd9f94e0d364e0ea74f579
$ git cat-file -p HEAD^{tree}
100644 blob e69de29bb2d1d6434b8b29ae775ad8c2e48c5391    README.md`,
  },
];

export function HomeInteractiveView() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="space-y-24 py-10">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-5 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-mono font-semibold mb-6">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            Interactive Git & Version Control Academy
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-white">
            Master Git from <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">zero</span> to plumbing internals.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed">
            A comprehensive interactive academy built with 72 structured lessons, a zero-risk simulated terminal sandbox, practical conflict labs, and a multi-model AI mentor.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/learn"
              className="px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-cyan-500/20"
            >
              Start Learning (72 Lessons) →
            </Link>
            <Link
              href="/terminal"
              className="px-6 py-3.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 text-slate-200 font-semibold text-sm transition hover:bg-slate-900"
            >
              Open Sandbox Terminal
            </Link>
          </div>
        </div>

        {/* Interactive Live Terminal Preview Card */}
        <div className="rounded-2xl border border-slate-800/90 bg-slate-950 shadow-2xl shadow-cyan-950/30 overflow-hidden">
          {/* Terminal Window Header */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-3 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 text-slate-300 font-semibold">gitnovi-sandbox ~ bash</span>
            </div>
            <span className="text-cyan-400 font-semibold text-[11px]">Interactive Preview</span>
          </div>

          {/* Clickable Workflow Tabs */}
          <div className="flex items-center border-b border-slate-800/80 bg-slate-950/90 px-3 py-2 overflow-x-auto gap-1">
            {terminalTabs.map((tab, idx) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-mono font-medium transition whitespace-nowrap cursor-pointer ${
                  activeTab === idx
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Terminal Screen Body */}
          <div className="p-4 bg-[#070b14] min-h-[220px]">
            <pre className="font-mono text-xs sm:text-[13px] text-slate-200 leading-relaxed overflow-x-auto whitespace-pre">
              {terminalTabs[activeTab].code}
            </pre>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="max-w-7xl mx-auto px-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {highlights.map((h) => (
            <div
              key={h.label}
              className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 shadow-lg"
            >
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300 font-mono">
                {h.num}+
              </div>
              <div className="mt-2 text-sm font-bold text-white">{h.label}</div>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4 Tracks Roadmap Section */}
      <section className="max-w-7xl mx-auto px-5">
        <div className="flex flex-col gap-2 mb-10">
          <div className="text-xs uppercase tracking-[0.2em] font-mono text-cyan-400 font-bold">
            Curriculum Structure
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            One Roadmap. 4 Structured Learning Tracks.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
            From filesystem foundations to low-level cryptographic object storage, each track is crafted for complete mastery.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {trackItems.map((track) => (
            <Link
              href={`/learn/${track.slug}`}
              key={track.title}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg transition duration-200 hover:-translate-y-1 hover:border-cyan-500/50 hover:bg-slate-900/70"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 rounded-md">
                    {track.badge}
                  </span>
                  <span className="text-xs font-mono text-slate-500">{track.lessons}</span>
                </div>

                <h3 className="text-xl font-bold text-white mt-4 group-hover:text-cyan-300 transition">
                  {track.title}
                </h3>

                <p className="text-slate-400 mt-2 text-xs leading-relaxed">
                  {track.desc}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                <span>Start track</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Call to Action Banner & Contact Link */}
      <section className="max-w-7xl mx-auto px-5">
        <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40 p-8 sm:p-12 shadow-2xl shadow-cyan-950/20 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ready to master Git version control?
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Join GitNovi Academy today. Explore all 72 lessons, 62 commands, and sandbox challenges.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/auth/signup"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold text-sm transition hover:brightness-110 shadow-lg shadow-cyan-500/20"
            >
              Get Started Free →
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3.5 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-200 font-semibold text-sm transition hover:border-cyan-500 hover:text-white"
            >
              Contact Creator ↗
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
