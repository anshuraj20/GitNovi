import { getModuleLessons } from '@/lib/course/server';
import { ModuleLessons } from '@/components/learning/ModuleLessons';
import { requireUser } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function PreGitPage() {
  const { user } = await requireUser();
  const courseModule = await getModuleLessons('pre-git', user.id);

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      <Link
        href="/learn"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#A7B0BC] hover:text-[#22D3EE] transition mb-6 group"
      >
        <svg
          className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-[#22D3EE]"
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

      <div className="text-[#22D3EE] text-xs font-mono font-bold tracking-wider uppercase">GITNOVI / PRE-GIT</div>
      <h1 className="text-3xl sm:text-4xl font-extrabold mt-2 text-[#E6EDF3]">
        {courseModule?.title ?? 'Pre-Git Foundations'}
      </h1>
      <p className="text-[#A7B0BC] mt-2 text-sm sm:text-base max-w-2xl">
        {courseModule?.description ?? 'Prerequisites, filesystem mental models, and CLI navigation before learning Git.'}
      </p>
      <ModuleLessons lessons={courseModule?.lessons ?? []} />
    </div>
  );
}
