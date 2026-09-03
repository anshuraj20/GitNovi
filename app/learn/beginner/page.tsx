import { getModuleLessons } from '@/lib/course/server';
import { ModuleLessons } from '@/components/learning/ModuleLessons';
import { requireUser } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function BeginnerPage() {
  const { user } = await requireUser();
  const courseModule = await getModuleLessons('beginner', user.id);
  const lessons = courseModule?.lessons ?? [];

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      <Link
        href="/learn"
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
        <span>Back to Learning Roadmap</span>
      </Link>

      <div className="text-cyan-400 text-xs font-mono font-bold tracking-wider uppercase">GITNOVI / BEGINNER</div>
      <h1 className="text-3xl sm:text-4xl font-extrabold mt-2 text-white">
        {courseModule?.title ?? 'Beginner Git Fundamentals'}
      </h1>
      <p className="text-slate-400 mt-2 text-sm sm:text-base max-w-2xl">
        {courseModule?.description ?? 'Core everyday Git commands: initialization, staging, committing, inspecting history, and branching.'}
      </p>

      <div className="mt-8">
        <ModuleLessons lessons={lessons} />
      </div>
    </div>
  );
}
