'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { createClient } from '@/lib/supabase/browser';
import { OAuthButtons } from '@/components/auth/OAuthButtons';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<{ text: string; type: 'error' | 'info' | 'rate_limit' } | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const { error } = await createClient().auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      if (error.message.toLowerCase().includes('rate limit')) {
        setMsg({
          text: 'Email rate limit reached. You can sign in using Google or GitHub above.',
          type: 'rate_limit',
        });
      } else {
        setMsg({ text: error.message, type: 'error' });
      }
    } else {
      const next = searchParams.get('next') || '/dashboard';
      router.replace(next);
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-12 sm:py-16">
      <div className="rounded border border-[#293542] bg-[#11161D] p-5 sm:p-6 space-y-4">
        {/* Header */}
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#E6EDF3]">
            Sign in to GitNovi
          </h1>
          <p className="text-xs text-[#A7B0BC] mt-0.5">
            Access your courses, virtual sandbox, and scenario labs.
          </p>
        </div>

        {/* OAuth Buttons */}
        <OAuthButtons onError={(err) => setMsg({ text: err, type: 'error' })} />

        {/* Divider */}
        <div className="relative my-3 text-center text-xs">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#293542]" />
          </div>
          <span className="relative bg-[#11161D] px-2 font-mono text-[#737F8C] text-[10px]">
            or with email
          </span>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-[#E6EDF3] mb-1">
              Email
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full rounded border border-[#293542] bg-[#090D12] px-3 py-1.5 text-xs text-[#E6EDF3] placeholder-[#737F8C] outline-none focus:border-[#22D3EE]/60 transition"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-[#E6EDF3]">
                Password
              </label>
              <Link
                href="/auth/reset-password"
                className="text-[11px] text-[#22D3EE] hover:text-[#67E8F9] hover:underline transition"
              >
                Forgot?
              </Link>
            </div>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded border border-[#293542] bg-[#090D12] px-3 py-1.5 text-xs text-[#E6EDF3] placeholder-[#737F8C] outline-none focus:border-[#22D3EE]/60 transition"
            />
          </div>

          {msg && (
            <div
              className={`rounded border p-2 text-xs font-mono ${
                msg.type === 'error'
                  ? 'border-[#F87171]/40 bg-[#090D12] text-[#F87171]'
                  : 'border-[#FBBF24]/40 bg-[#090D12] text-[#FBBF24]'
              }`}
            >
              {msg.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-[#22D3EE] py-2 text-xs font-semibold text-[#090D12] hover:bg-[#67E8F9] disabled:opacity-50 transition cursor-pointer"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-[#737F8C]">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-[#22D3EE] hover:text-[#67E8F9] hover:underline font-medium transition whitespace-nowrap">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#737F8C] font-mono">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
