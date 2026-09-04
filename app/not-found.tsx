import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-5 py-12">
      <div className="max-w-md w-full text-center">
        {/* Terminal Box */}
        <div className="rounded-lg border border-[#293542] bg-[#090D12] p-6 text-left font-mono">
          <div className="flex items-center justify-between border-b border-[#202934] pb-3 mb-4 text-xs text-[#737F8C]">
            <span className="text-[#22D3EE] font-semibold">gitnovi ~ 404</span>
            <span className="text-[10px]">detached HEAD</span>
          </div>

          <div className="text-xs space-y-2">
            <p className="text-[#A7B0BC]">
              <span className="text-[#22D3EE] font-bold">$</span> git checkout HEAD~404
            </p>
            <p className="text-[#F87171] font-semibold">
              fatal: pathspec not found in working tree or repository history.
            </p>
            <p className="text-[#737F8C] text-[11px] pt-2">
              # The requested route does not exist or has been moved.
            </p>
          </div>
        </div>

        <h1 className="mt-6 text-2xl font-bold text-[#E6EDF3]">
          Branch or Page Not Found
        </h1>
        <p className="mt-2 text-xs text-[#A7B0BC] leading-relaxed">
          The commit, branch, or page you were looking for is detached or has been pruned from the tree.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-md bg-[#22D3EE] hover:bg-[#67E8F9] px-4 py-2 text-xs font-semibold text-[#090D12] transition cursor-pointer"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/learn"
            className="rounded-md border border-[#293542] hover:border-[#354352] bg-[#11161D] hover:bg-[#171D25] px-4 py-2 text-xs font-semibold text-[#E6EDF3] transition"
          >
            Explore Curriculum
          </Link>
        </div>
      </div>
    </div>
  );
}
