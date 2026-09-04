import { requireUser } from '@/lib/supabase/server';
import { GitTutor } from '@/components/ai/GitTutor';
import Link from 'next/link';

export default async function AIPage() {
  await requireUser();

  return (
    <div className="mx-auto max-w-7xl px-3 py-4 sm:px-5 lg:px-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#A7B0BC] hover:text-[#22D3EE] transition group"
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
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-medium text-[#737F8C]">
          <span className="h-2 w-2 rounded-full bg-[#34D399]" />
          <span>Interactive Assistant</span>
        </div>
      </div>

      <GitTutor />
    </div>
  );
}
