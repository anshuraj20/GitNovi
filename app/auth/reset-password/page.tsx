'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [status, setStatus] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // Check if coming from password recovery link
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
        setRecoveryMode(true);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        // If query string has type=recovery or hash has access_token
        if (
          typeof window !== 'undefined' &&
          (window.location.hash.includes('type=recovery') ||
            window.location.search.includes('type=recovery') ||
            window.location.hash.includes('access_token'))
        ) {
          setRecoveryMode(true);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Password strength check
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialOrUpper = /[A-Z!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  // Request password reset email
  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setStatus(null);

    try {
      const redirectUrl =
        typeof window !== 'undefined'
          ? `${window.location.origin}/auth/reset-password`
          : 'http://localhost:3000/auth/reset-password';

      const { error } = await createClient().auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });

      if (error) {
        setStatus({ text: error.message, type: 'error' });
      } else {
        setEmailSent(true);
        setStatus({
          text: `Recovery email sent to ${email}. Please check your inbox and click the reset link to proceed.`,
          type: 'success',
        });
      }
    } catch {
      setStatus({ text: 'Unable to send recovery email right now. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Update password with new credentials
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasMinLength) {
      setStatus({ text: 'Password must be at least 8 characters long.', type: 'error' });
      return;
    }
    if (password !== confirmPassword) {
      setStatus({ text: 'Passwords do not match. Please verify your entries.', type: 'error' });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const { error } = await createClient().auth.updateUser({ password });

      if (error) {
        setStatus({ text: error.message, type: 'error' });
      } else {
        setStatus({
          text: '✓ Password updated successfully! Redirecting you to the dashboard...',
          type: 'success',
        });
        setTimeout(() => {
          router.replace('/dashboard');
        }, 2000);
      }
    } catch {
      setStatus({ text: 'Failed to update password. Please try requesting a new reset link.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-5 py-16 sm:py-24">
      {/* Back Link */}
      <Link
        href="/auth/login"
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
        <span>Back to Login</span>
      </Link>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7 sm:p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] font-mono text-cyan-400">
          <span>GitNovi</span>
          <span>•</span>
          <span>Security</span>
        </div>

        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {recoveryMode ? 'Set New Password' : 'Reset Your Password'}
        </h1>

        <p className="mt-1.5 text-xs sm:text-sm text-slate-400 leading-relaxed">
          {recoveryMode
            ? 'Enter your new account password below to regain full access to your workspace.'
            : 'Enter the email associated with your GitNovi account and we will send you a secure recovery link.'}
        </p>

        {/* Form Mode 1: Request Reset Link */}
        {!recoveryMode ? (
          <form onSubmit={handleSendResetEmail} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-mono mb-1.5">
                Account Email Address
              </label>
              <div className="relative">
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="developer@example.com"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 pl-10 text-sm text-white placeholder-slate-500 shadow-inner outline-none transition focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40"
                />
                <svg
                  className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full rounded-xl bg-cyan-500 py-3 text-xs sm:text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400 active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                  <span>Sending Recovery Link...</span>
                </>
              ) : emailSent ? (
                'Resend Recovery Link'
              ) : (
                'Send Recovery Link'
              )}
            </button>
          </form>
        ) : (
          /* Form Mode 2: Enter New Password */
          <form onSubmit={handleUpdatePassword} className="mt-6 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                  New Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                required
                minLength={8}
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 shadow-inner outline-none transition focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-mono mb-1.5">
                Confirm New Password
              </label>
              <input
                required
                minLength={8}
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 shadow-inner outline-none transition focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40"
              />
            </div>

            {/* Password Validation Checklist */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 space-y-1.5 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className={hasMinLength ? 'text-emerald-400' : 'text-slate-500'}>
                  {hasMinLength ? '✓' : '○'}
                </span>
                <span className={hasMinLength ? 'text-slate-200' : 'text-slate-400'}>
                  At least 8 characters
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={hasNumber ? 'text-emerald-400' : 'text-slate-500'}>
                  {hasNumber ? '✓' : '○'}
                </span>
                <span className={hasNumber ? 'text-slate-200' : 'text-slate-400'}>
                  Contains at least one number
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={passwordsMatch ? 'text-emerald-400' : 'text-slate-500'}>
                  {passwordsMatch ? '✓' : '○'}
                </span>
                <span className={passwordsMatch ? 'text-slate-200' : 'text-slate-400'}>
                  Passwords match
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !hasMinLength || !passwordsMatch}
              className="w-full rounded-xl bg-cyan-500 py-3 text-xs sm:text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400 active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                  <span>Updating Password...</span>
                </>
              ) : (
                'Save New Password & Continue'
              )}
            </button>
          </form>
        )}

        {/* Status Message Alert */}
        {status && (
          <div
            className={`mt-4 rounded-xl p-3.5 text-xs leading-relaxed ${
              status.type === 'error'
                ? 'border border-rose-500/30 bg-rose-500/10 text-rose-300'
                : 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
            }`}
          >
            {status.text}
          </div>
        )}

        {/* Bottom Helper Links */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-4 text-xs">
          <Link href="/auth/login" className="text-slate-400 hover:text-cyan-300 transition">
            Remember your password? <span className="text-cyan-400 font-semibold">Log in</span>
          </Link>
          <Link href="/auth/signup" className="text-slate-400 hover:text-cyan-300 transition">
            New here? <span className="text-cyan-400 font-semibold">Sign up</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
