import { GitTerminal } from '@/components/terminal/GitTerminal';
import { requireUser } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function TerminalPage() {
  await requireUser();

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-10 space-y-6">
      <div className="space-y-1.5 max-w-2xl">
        <div className="text-xs font-mono text-[#737F8C]">
          Sandbox Environment
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#E6EDF3] tracking-tight">
          Terminal Sandbox
        </h1>
        <p className="text-xs sm:text-sm text-[#A7B0BC] leading-relaxed">
          A safe virtual Git repository running in your browser. Practice commands, experiment with branches, and inspect history without affecting any local machine files.
        </p>
      </div>

      <GitTerminal />
    </div>
  );
}
