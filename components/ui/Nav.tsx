'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';
import { clearLocalProgressCache } from '@/lib/storage/userCache';

export function Nav() {
  const router = useRouter();
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    clearLocalProgressCache();
    await createClient().auth.signOut();
    setUserEmail(null);
    router.replace('/');
    router.refresh();
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/learn', label: 'Learn' },
    { href: '/terminal', label: 'Terminal' },
    { href: '/commands', label: 'Commands' },
    { href: '/challenges', label: 'Challenges' },
    { href: '/ai', label: 'AI Tutor' },
    { href: '/progress', label: 'Progress' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#070b14]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tight text-white group">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-500/10 font-mono text-cyan-400 group-hover:border-cyan-400 transition">
              λ
            </span>
            <span>
              Git<span className="text-cyan-400">Novi</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-3 py-2 transition ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-300 font-bold border border-cyan-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-3">
          {userEmail ? (
            <>
              <Link
                href="/profile"
                className="text-xs font-mono text-slate-400 hover:text-cyan-300 transition max-w-40 truncate"
                title={userEmail}
              >
                {userEmail}
              </Link>
              <button
                onClick={logout}
                className="rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-1.5 text-xs font-medium text-slate-400 hover:border-slate-700 hover:text-slate-200 transition cursor-pointer"
              >
                Log out
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="rounded-xl px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition"
              >
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-xl bg-cyan-500 px-4 py-1.5 text-xs font-bold text-slate-950 shadow transition hover:bg-cyan-400 active:scale-[0.99]"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg border border-slate-800 p-2 text-slate-400 hover:text-white focus:outline-none"
            aria-label="Toggle Navigation"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-800 bg-[#070b14]/95 p-5 lg:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                  pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                    ? 'bg-cyan-500/10 text-cyan-300 font-bold border border-cyan-500/20'
                    : 'text-slate-300 hover:bg-slate-900/80 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-3 border-t border-slate-800/80 pt-3 flex flex-col gap-2">
              {userEmail ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs font-mono text-slate-400 truncate"
                  >
                    👤 {userEmail}
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/80 py-2.5 text-xs font-semibold text-rose-400"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <div className="flex gap-2">
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center rounded-xl border border-slate-800 bg-slate-900/60 py-2.5 text-xs font-semibold text-slate-300"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center rounded-xl bg-cyan-500 py-2.5 text-xs font-bold text-slate-950"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
