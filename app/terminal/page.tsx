import { GitTerminal } from '@/components/terminal/GitTerminal';
import { requireUser } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function TerminalPage() {
  await requireUser();

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
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

      <div className="mb-6 max-w-2xl">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
          Git sandbox
        </div>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Practice Git without risk
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-400">
          This terminal is a safe learning environment. You can try commands, inspect state,
          make mistakes, and recover in a virtual repository without affecting your real machine.
        </p>
      </div>

      <GitTerminal />
    </div>
  );
}
