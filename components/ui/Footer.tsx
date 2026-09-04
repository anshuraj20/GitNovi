import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-[#202934] bg-[#0B0F14] py-10 mt-16 text-xs text-[#737F8C]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-6 border-b border-[#202934]">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-2">
            <Link href="/" className="font-bold text-sm text-[#E6EDF3]">
              <span className="font-mono text-[#22D3EE]">&gt;_ </span>GitNovi
            </Link>
            <p className="text-xs leading-relaxed text-[#A7B0BC]">
              A practical in-browser learning platform for Git fundamentals and internals.
            </p>
          </div>

          {/* Curriculum */}
          <div className="space-y-1.5">
            <div className="font-semibold text-[#A7B0BC]">Curriculum</div>
            <ul className="space-y-1">
              <li><Link href="/learn/pre-git" className="hover:text-[#E6EDF3]">Pre-Git Foundations</Link></li>
              <li><Link href="/learn/beginner" className="hover:text-[#E6EDF3]">Beginner Git</Link></li>
              <li><Link href="/learn/intermediate" className="hover:text-[#E6EDF3]">Intermediate Git</Link></li>
              <li><Link href="/learn/advanced" className="hover:text-[#E6EDF3]">Advanced & Plumbing</Link></li>
            </ul>
          </div>

          {/* Tools */}
          <div className="space-y-1.5">
            <div className="font-semibold text-[#A7B0BC]">Tools</div>
            <ul className="space-y-1">
              <li><Link href="/terminal" className="hover:text-[#E6EDF3]">Terminal Sandbox</Link></li>
              <li><Link href="/challenges" className="hover:text-[#E6EDF3]">Hands-On Labs</Link></li>
              <li><Link href="/commands" className="hover:text-[#E6EDF3]">Command Reference</Link></li>
              <li><Link href="/ai" className="hover:text-[#E6EDF3]">AI Tutor</Link></li>
            </ul>
          </div>

          {/* Creator */}
          <div className="space-y-1.5">
            <div className="font-semibold text-[#A7B0BC]">Creator</div>
            <ul className="space-y-1">
              <li className="text-[#E6EDF3]">Anshu Raj</li>
              <li><a href="https://github.com/anshuraj20" target="_blank" rel="noopener noreferrer" className="hover:text-[#E6EDF3]">GitHub: @anshuraj20</a></li>
              <li><a href="https://linkedin.com/in/anshuraj20" target="_blank" rel="noopener noreferrer" className="hover:text-[#E6EDF3]">LinkedIn: anshuraj20</a></li>
              <li><Link href="/contact" className="text-[#22D3EE] hover:underline">Contact Creator →</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
          <div>© {new Date().getFullYear()} GitNovi · Built by Anshu Raj</div>
          <div className="flex items-center gap-1.5 text-[#737F8C]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#34D399]"></span>
            <span>Zero-risk client-side Git sandbox</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
