import Link from 'next/link';
import { requireUser } from '@/lib/supabase/server';
import { courseCatalog } from '@/lib/course/courseCatalog';

export default async function Learn() {
  await requireUser();
  const moduleOrder = ['pre-git', 'beginner', 'intermediate', 'advanced'] as const;

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
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

      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="text-xs uppercase tracking-[0.2em] font-mono text-cyan-400">
          Curriculum & Roadmap
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          Git Learning Roadmap
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-1">
          Master Git from terminal prerequisites to plumbing internals through structured, pedagogical lessons with real-world practice.
        </p>
      </div>

      {/* Module Grid */}
      <div className="grid md:grid-cols-2 gap-5 mt-10">
        {moduleOrder.map((slug) => {
          const mod = courseCatalog[slug];
          if (!mod) return null;

          const totalMinutes = mod.lessons.reduce((acc, l) => acc + (l.estimated_minutes || 15), 0);
          const hours = (totalMinutes / 60).toFixed(1);

          return (
            <Link
              href={`/learn/${slug}`}
              key={slug}
              className="group relative rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg shadow-slate-950/20 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-500/50 hover:bg-slate-900/70"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  Level {mod.level}
                </span>

                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <span>{mod.lessons.length} lessons</span>
                  <span>•</span>
                  <span>~{hours} hrs</span>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-100 mt-4 group-hover:text-cyan-300 transition">
                {mod.title}
              </h2>

              <p className="text-slate-400 text-sm leading-relaxed mt-2 line-clamp-2">
                {mod.description}
              </p>

              <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-cyan-400 group-hover:text-cyan-300">
                <span>Start module</span>
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
