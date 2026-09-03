'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import { createClient } from '@/lib/supabase/browser';
import { OAuthButtons } from '@/components/auth/OAuthButtons';

function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<{ text: string; type: 'error' | 'success' | 'rate_limit' } | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const displayName = name.trim() || email.split('@')[0];

    const { data, error } = await createClient().auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    if (error) {
      if (error.message.toLowerCase().includes('rate limit')) {
        setMsg({
          text: 'Email rate limit reached. You can immediately register and log in using Google or GitHub above.',
          type: 'rate_limit',
        });
      } else {
        setMsg({ text: error.message, type: 'error' });
      }
    } else if (data.session) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('gitnovi_profile_name', displayName);
      }
      router.replace('/dashboard');
      router.refresh();
    } else {
      setMsg({
        text: 'Account created! If email confirmation is enabled in your database, please check your inbox to confirm.',
        type: 'success',
      });
    }

    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-md px-5 py-16 sm:py-24">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-300 transition mb-6 group"
      >
        <svg
          className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-cyan-400"
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
        <span>Back to Home</span>
      </Link>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7 sm:p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] font-mono text-cyan-400">
          <span>GitNovi</span>
          <span>•</span>
          <span>Register</span>
        </div>

        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Create Account
        </h1>

        <p className="mt-1.5 text-xs sm:text-sm text-slate-400 leading-relaxed">
          Sign up to unlock the complete Git & GitHub curriculum, terminal sandbox, and AI tutor.
        </p>

        {/* 1-Click Instant OAuth Registration */}
        <div className="mt-6">
          <OAuthButtons onError={(err) => setMsg({ text: err, type: 'error' })} />
        </div>

        {/* Divider */}
        <div className="relative my-6 text-center text-xs">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <span className="relative bg-slate-900/90 px-3 font-mono uppercase text-slate-500 text-[10px] tracking-wider">
            Or with email & password
          </span>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-mono mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Linus"
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 shadow-inner outline-none transition focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-mono mb-1.5">
              Email Address
            </label>
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="developer@example.com"
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 shadow-inner outline-none transition focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-mono mb-1.5">
              Password
            </label>
            <input
              required
              minLength={8}
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 shadow-inner outline-none transition focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40"
            />
            <span className="mt-1 block text-[11px] text-slate-500 font-mono">
              At least 8 characters.
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-cyan-500 py-3 text-xs sm:text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400 active:scale-[0.99] disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                <span>Creating Account...</span>
              </>
            ) : (
              'Create Account with Email'
            )}
          </button>
        </form>

        {/* Message Alert */}
        {msg && (
          <div
            className={`mt-4 rounded-xl p-3.5 text-xs leading-relaxed ${
              msg.type === 'rate_limit'
                ? 'border border-amber-500/30 bg-amber-500/10 text-amber-300'
                : msg.type === 'success'
                ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                : 'border border-rose-500/30 bg-rose-500/10 text-rose-300'
            }`}
          >
            {msg.text}
          </div>
        )}

        {/* Switch to Login */}
        <div className="mt-6 border-t border-slate-800/80 pt-4 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-cyan-400 font-bold hover:text-cyan-300">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
}
