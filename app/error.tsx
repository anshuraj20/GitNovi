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
        <div className="rounded-lg border border-[#F87171]/40 bg-[#090D12] p-6 text-left font-mono">
          <div className="flex items-center justify-between border-b border-[#202934] pb-3 mb-4 text-xs text-[#737F8C]">
            <span className="text-[#F87171] font-semibold">gitnovi ~ runtime-error</span>
            <span className="text-[10px]">panic</span>
          </div>

          <div className="text-xs space-y-2">
            <p className="text-[#A7B0BC]">
              <span className="text-[#22D3EE] font-bold">$</span> git diagnostics --check
            </p>
            <p className="text-[#F87171] font-semibold">
              fatal: an unexpected state discrepancy occurred.
            </p>
            {error?.message && (
              <p className="text-[#737F8C] text-[11px] truncate" title={error.message}>
                {error.message}
              </p>
            )}
          </div>
        </div>

        <h1 className="mt-6 text-2xl font-bold text-[#E6EDF3]">
          Something went off track
        </h1>
        <p className="mt-2 text-xs text-[#A7B0BC] leading-relaxed">
          Don&apos;t worry — your repository progress and streak data are safely stored in your account.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="rounded-md bg-[#22D3EE] hover:bg-[#67E8F9] px-4 py-2 text-xs font-semibold text-[#090D12] transition cursor-pointer"
          >
            Try Again (Reset State)
          </button>
          <Link
            href="/dashboard"
            className="rounded-md border border-[#293542] hover:border-[#354352] bg-[#11161D] hover:bg-[#171D25] px-4 py-2 text-xs font-semibold text-[#E6EDF3] transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
