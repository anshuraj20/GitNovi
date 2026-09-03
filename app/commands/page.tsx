import { CommandExplorer } from '@/components/commands/CommandExplorer';
import { requireUser } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function CommandsPage() {
  await requireUser();

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      {/* Back Button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-300 transition mb-6 group"
      >
        <svg
          className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-cyan-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <span>Back to Dashboard</span>
      </Link>

      <div className="text-xs uppercase tracking-[0.2em] font-mono text-cyan-400">
        Reference Catalog
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
        Command Explorer
      </h1>
      <p className="text-slate-400 mt-2 text-sm sm:text-base max-w-2xl">
        Search the GitNovi command catalog, including porcelain workflows, plumbing commands, and reference documentation.
      </p>

      <div className="mt-8">
        <CommandExplorer />
      </div>
    </div>
  );
}
