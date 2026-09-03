import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-5 py-12">
      <div className="max-w-md w-full text-center">
        {/* Terminal Header */}
        <div className="rounded-2xl border border-slate-800 bg-[#070b14] p-6 shadow-2xl shadow-cyan-950/20 text-left font-mono">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4 text-xs text-slate-500">
            <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-2 text-slate-400">gitnovi ~ 404</span>
          </div>

          <div className="text-xs space-y-2">
            <p className="text-slate-400">
              <span className="text-cyan-400 font-bold">$</span> git checkout HEAD~404
            </p>
            <p className="text-rose-400 font-semibold">
              fatal: pathspec not found in working tree or repository history.
            </p>
            <p className="text-slate-500 text-[11px] pt-2">
              # The requested route does not exist or has been moved.
            </p>
          </div>
        </div>

        <h1 className="mt-6 text-2xl font-black text-white">
          Branch or Page Not Found
        </h1>
        <p className="mt-2 text-xs text-slate-400 leading-relaxed">
          The commit, branch, or page you were looking for is detached or has been pruned from the tree.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-xl bg-cyan-500 hover:bg-cyan-400 px-5 py-2.5 text-xs font-bold text-slate-950 transition shadow-lg shadow-cyan-500/20"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/learn"
            className="rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 px-5 py-2.5 text-xs font-semibold text-slate-300 transition"
          >
            Explore Curriculum
          </Link>
        </div>
      </div>
    </div>
  );
}
