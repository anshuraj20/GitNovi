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
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resolveUser = async (user: any) => {
      if (!user) {
        setUserEmail(null);
        setDisplayName(null);
        return;
      }

      setUserEmail(user.email ?? null);

      // 1. Check user_metadata (from Google/GitHub OAuth or email signup)
      const metaName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.user_metadata?.display_name ||
        (user.user_metadata?.given_name
          ? `${user.user_metadata.given_name} ${user.user_metadata.family_name || ''}`.trim()
          : null) ||
        user.user_metadata?.user_name;

      // 2. Check localStorage
      const localName = typeof window !== 'undefined' ? localStorage.getItem('gitnovi_profile_name') : null;

      if (localName && localName !== user.email?.split('@')[0]) {
        setDisplayName(localName);
      } else if (metaName) {
        setDisplayName(metaName);
        if (typeof window !== 'undefined') {
          localStorage.setItem('gitnovi_profile_name', metaName);
        }
      } else if (localName) {
        setDisplayName(localName);
      } else {
        setDisplayName(user.email?.split('@')[0] ?? 'Developer');
      }

      // 3. Query profiles table for custom updated name
      try {
        const { data: prof } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', user.id)
          .maybeSingle();

        if (prof?.display_name && prof.display_name !== user.email?.split('@')[0]) {
          setDisplayName(prof.display_name);
          if (typeof window !== 'undefined') {
            localStorage.setItem('gitnovi_profile_name', prof.display_name);
          }
        } else if (metaName && (!prof?.display_name || prof.display_name === user.email?.split('@')[0])) {
          setDisplayName(metaName);
          // Auto-sync OAuth name to profiles table if table has fallback email
          await supabase.from('profiles').upsert(
            {
              id: user.id,
              email: user.email,
              display_name: metaName,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'id' }
          );
        }
      } catch {
        // Guest / offline
      }
    };

    supabase.auth.getUser().then(({ data }) => resolveUser(data.user));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      resolveUser(session?.user ?? null);
    });

    const handleProfileUpdate = () => {
      const updated = localStorage.getItem('gitnovi_profile_name');
      if (updated) setDisplayName(updated);
    };

    window.addEventListener('gitnovi_profile_updated', handleProfileUpdate);
    window.addEventListener('storage', handleProfileUpdate);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('gitnovi_profile_updated', handleProfileUpdate);
      window.removeEventListener('storage', handleProfileUpdate);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const logout = async () => {
    clearLocalProgressCache();
    await createClient().auth.signOut();
    setUserEmail(null);
    setDisplayName(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gitnovi_profile_name');
    }
    router.replace('/');
    router.refresh();
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/learn', label: 'Learn' },
    { href: '/terminal', label: 'Terminal' },
    { href: '/challenges', label: 'Challenges' },
    { href: '/commands', label: 'Commands' },
    { href: '/ai', label: 'AI Tutor' },
    { href: '/progress', label: 'Progress' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#202934] bg-[#0B0F14]">
      <div className="mx-auto flex h-13 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold tracking-tight text-[#E6EDF3] hover:text-white transition">
            <span className="font-mono text-xs text-[#22D3EE] font-bold">&gt;_</span>
            <span className="font-mono tracking-tight font-bold text-sm">
              Git<span className="text-[#22D3EE]">Novi</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-0.5 text-xs">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded px-2.5 py-1 transition ${
                    isActive
                      ? 'bg-[#083344]/60 text-[#22D3EE] font-medium'
                      : 'text-[#A7B0BC] hover:text-[#E6EDF3] hover:bg-[#11161D]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Section (Desktop) */}
        <div className="hidden sm:flex items-center gap-3">
          {userEmail ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="rounded border border-[#293542] bg-[#11161D] px-2.5 py-1 text-xs font-medium text-[#E6EDF3] hover:border-[#22D3EE]/40 transition max-w-44 truncate"
                title={userEmail ? `${displayName || userEmail.split('@')[0]} (${userEmail})` : 'Profile'}
              >
                {displayName || userEmail.split('@')[0]}
              </Link>
              <button
                type="button"
                onClick={logout}
                className="rounded px-2 py-1 text-xs text-[#737F8C] hover:text-[#F87171] transition cursor-pointer"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="px-2.5 py-1 text-xs text-[#A7B0BC] hover:text-[#E6EDF3] transition"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="rounded border border-[#22D3EE]/40 bg-[#11161D] px-3 py-1 text-xs font-medium text-[#22D3EE] hover:bg-[#22D3EE] hover:text-[#0B0F14] transition"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 xl:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded border border-[#293542] bg-[#11161D] text-[#A7B0BC] hover:text-[#E6EDF3] transition focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-[#202934] bg-[#0B0F14] px-4 py-3 xl:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex min-h-[44px] items-center justify-between rounded px-3 text-xs font-medium transition ${
                    isActive
                      ? 'bg-[#083344]/60 text-[#22D3EE]'
                      : 'text-[#A7B0BC] hover:bg-[#11161D] hover:text-[#E6EDF3]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="font-mono text-[#22D3EE]">●</span>}
                </Link>
              );
            })}

            <div className="mt-2 border-t border-[#202934] pt-2 flex flex-col gap-2">
              {userEmail ? (
                <>
                  <Link
                    href="/profile"
                    className="flex min-h-[44px] items-center rounded border border-[#293542] bg-[#11161D] px-3 text-xs font-medium text-[#E6EDF3] truncate"
                  >
                    User: {displayName || userEmail}
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="flex min-h-[44px] items-center justify-center rounded border border-[#293542] bg-[#11161D] text-xs font-medium text-[#F87171] cursor-pointer"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <div className="flex gap-2">
                  <Link
                    href="/auth/login"
                    className="flex min-h-[44px] flex-1 items-center justify-center rounded border border-[#293542] bg-[#11161D] text-xs font-medium text-[#A7B0BC]"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="flex min-h-[44px] flex-1 items-center justify-center rounded border border-[#22D3EE]/40 bg-[#11161D] text-xs font-medium text-[#22D3EE]"
                  >
                    Get Started
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
