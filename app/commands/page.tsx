import { CommandExplorer } from '@/components/commands/CommandExplorer';
import { requireUser } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function CommandsPage() {
  await requireUser();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
      <div className="space-y-1.5 max-w-2xl">
        <div className="text-xs font-mono text-[#737F8C]">
          Reference
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#E6EDF3] tracking-tight">
          Git Command Reference
        </h1>
        <p className="text-xs sm:text-sm text-[#A7B0BC] leading-relaxed">
          Quickly search and scan 62 Git commands, including everyday porcelain workflows and low-level plumbing utilities.
        </p>
      </div>

      <CommandExplorer />
    </div>
  );
}
