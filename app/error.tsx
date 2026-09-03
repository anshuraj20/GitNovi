'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('GitNovi Runtime Error:', error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-5 py-12">
      <div className="max-w-md w-full text-center">
        {/* Terminal Header */}
        <div className="rounded-2xl border border-rose-500/30 bg-[#070b14] p-6 shadow-2xl shadow-rose-950/20 text-left font-mono">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4 text-xs text-slate-500">
            <span className="h-3 w-3 rounded-full bg-rose-500 inline-block" />
            <span className="h-3 w-3 rounded-full bg-amber-500 inline-block" />
            <span className="h-3 w-3 rounded-full bg-emerald-500 inline-block" />
            <span className="ml-2 text-rose-400 font-semibold">gitnovi ~ runtime-error</span>
          </div>

          <div className="text-xs space-y-2">
            <p className="text-slate-400">
              <span className="text-cyan-400 font-bold">$</span> git diagnostics --check
            </p>
            <p className="text-rose-400 font-semibold">
              fatal: an unexpected state discrepancy occurred.
            </p>
            {error?.message && (
              <p className="text-slate-500 text-[11px] truncate" title={error.message}>
                {error.message}
              </p>
            )}
          </div>
        </div>

        <h1 className="mt-6 text-2xl font-black text-white">
          Something went off track
        </h1>
        <p className="mt-2 text-xs text-slate-400 leading-relaxed">
          Don't worry — your repository progress and streak data are safely stored in your account.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="rounded-xl bg-cyan-500 hover:bg-cyan-400 px-5 py-2.5 text-xs font-bold text-slate-950 transition shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            Try Again (Reset State)
          </button>
          <Link
            href="/dashboard"
            className="rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 px-5 py-2.5 text-xs font-semibold text-slate-300 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
