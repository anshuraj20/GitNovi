import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#070b14]/90 py-12 mt-20">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800/60">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-black text-lg tracking-tight text-white group">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-500/10 font-mono text-cyan-400 group-hover:border-cyan-400 transition">
                λ
              </span>
              <span>
                Git<span className="text-cyan-400">Novi</span>
              </span>
            </Link>
            <p className="mt-3 text-xs text-slate-400 leading-relaxed max-w-xs">
              Interactive Git academy combining 72 lessons, 62 command encyclopedia, 18 hands-on challenges, and multi-model AI mentoring.
            </p>
          </div>

          {/* Curriculum Tracks */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono mb-3">
              Curriculum
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/learn/pre-git" className="hover:text-cyan-300 transition">
                  Pre-Git Foundations
                </Link>
              </li>
              <li>
                <Link href="/learn/beginner" className="hover:text-cyan-300 transition">
                  Beginner Git
                </Link>
              </li>
              <li>
                <Link href="/learn/intermediate" className="hover:text-cyan-300 transition">
                  Intermediate Git
                </Link>
              </li>
              <li>
                <Link href="/learn/advanced" className="hover:text-cyan-300 transition">
                  Advanced & Plumbing
                </Link>
              </li>
            </ul>
          </div>

          {/* Interactive Tools */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono mb-3">
              Practice Tools
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/terminal" className="hover:text-cyan-300 transition">
                  Sandbox Terminal
                </Link>
              </li>
              <li>
                <Link href="/challenges" className="hover:text-cyan-300 transition">
                  Hands-On Challenges
                </Link>
              </li>
              <li>
                <Link href="/commands" className="hover:text-cyan-300 transition">
                  62-Command Explorer
                </Link>
              </li>
              <li>
                <Link href="/ai" className="hover:text-cyan-300 transition">
                  AI Git Mentor
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Creator */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono mb-3">
              Creator & Connect
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="text-white font-semibold">Anshu Raj</li>
              <li>
                <a
                  href="https://github.com/anshuraj20"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-300 transition flex items-center gap-1.5"
                >
                  <span>GitHub:</span>
                  <span className="text-cyan-400 font-mono">@anshuraj20</span>
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/anshuraj20"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-300 transition flex items-center gap-1.5"
                >
                  <span>LinkedIn:</span>
                  <span className="text-blue-400 font-mono">anshuraj20</span>
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/anshuraj_ar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-300 transition flex items-center gap-1.5"
                >
                  <span>Instagram:</span>
                  <span className="text-pink-400 font-mono">@anshuraj_ar</span>
                </a>
              </li>
              <li className="pt-1">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1 text-cyan-400 font-semibold hover:text-cyan-300 transition"
                >
                  <span>Send Direct Message</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-3">
          <div>
            © {new Date().getFullYear()} GitNovi. Built & Engineered by{' '}
            <span className="text-slate-300 font-semibold">Anshu Raj</span>.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
