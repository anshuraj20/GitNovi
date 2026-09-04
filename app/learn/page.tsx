import Link from 'next/link';
import { requireUser } from '@/lib/supabase/server';
import { courseCatalog } from '@/lib/course/courseCatalog';

export default async function Learn() {
  await requireUser();
  const moduleOrder = ['pre-git', 'beginner', 'intermediate', 'advanced'] as const;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="text-xs font-mono text-[#737F8C]">
          Curriculum
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#E6EDF3] tracking-tight">
          Git Learning Roadmap
        </h1>
        <p className="text-sm text-[#A7B0BC] max-w-xl">
          72 structured lessons across 4 sequential tracks. Work through each concept, try the commands in the sandbox, and verify your understanding.
        </p>
      </div>

      {/* Module List */}
      <div className="space-y-3">
        {moduleOrder.map((slug) => {
          const mod = courseCatalog[slug];
          if (!mod) return null;

          const totalMinutes = mod.lessons.reduce((acc, l) => acc + (l.estimated_minutes || 15), 0);
          const hours = (totalMinutes / 60).toFixed(1);

          return (
            <Link
              href={`/learn/${slug}`}
              key={slug}
              className="block rounded border border-[#293542] bg-[#11161D] p-4 sm:p-5 hover:border-[#22D3EE]/50 hover:bg-[#171D25] transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#737F8C]">
                    <span className="text-[#22D3EE] font-semibold">Level {mod.level}</span>
                    <span>·</span>
                    <span>{mod.lessons.length} lessons</span>
                    <span>·</span>
                    <span>~{hours} hrs</span>
                  </div>

                  <h2 className="text-base sm:text-lg font-bold text-[#E6EDF3] mt-1">
                    {mod.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#A7B0BC] mt-1 leading-relaxed max-w-2xl">
                    {mod.description}
                  </p>
                </div>

                <div className="shrink-0 text-xs font-semibold text-[#22D3EE] sm:self-center">
                  Start Track →
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
