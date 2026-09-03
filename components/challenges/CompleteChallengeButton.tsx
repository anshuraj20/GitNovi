'use client';

import { useEffect, useState } from 'react';
import { validateChallengeState } from '@/lib/challenges/validators';
import { recordStreakActivity } from '@/lib/progress/streak';
import Link from 'next/link';

export function CompleteChallengeButton({
  challengeId,
  challengeSlug,
  initialCompleted = false,
  repoState,
  onCompleted,
}: {
  challengeId: string;
  challengeSlug: string;
  initialCompleted?: boolean;
  repoState?: any;
  onCompleted?: (completed: boolean) => void;
}) {
  const [done, setDone] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' | 'info' } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`gitnovi_challenge_${challengeId}`);
      if (saved !== null) {
        setDone(saved === 'true');
      }
    }
  }, [challengeId]);

  const verifyAndComplete = async (forceBypass = false) => {
    if (loading) return;

    // Toggle back to incomplete if already done
    if (done && !forceBypass) {
      setDone(false);
      setMessage(null);
      onCompleted?.(false);
      if (typeof window !== 'undefined') {
        localStorage.setItem(`gitnovi_challenge_${challengeId}`, 'false');
      }
      try {
        await fetch('/api/progress/challenge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ challengeId, completed: false, score: 0 }),
        });
      } catch {
        // Local state preserved
      }
      return;
    }

    setLoading(true);
    setMessage(null);

    let activeState = repoState;
    if (!activeState || forceBypass) {
      try {
        const res = await fetch('/api/terminal/session');
        if (res.ok) {
          const data = await res.json();
          activeState = data?.state;
        }
      } catch {
        // Sandbox fetch error
      }
    }

    const validation = validateChallengeState(challengeSlug, activeState);

    if (!validation.valid && !forceBypass) {
      setMessage({
        text: validation.reason ?? 'Challenge conditions not met in Sandbox Terminal.',
        type: 'error',
      });
      setLoading(false);
      return;
    }

    // Success
    setDone(true);
    setMessage({ text: '🎉 Challenge verified and completed!', type: 'success' });
    onCompleted?.(true);

    if (typeof window !== 'undefined') {
      localStorage.setItem(`gitnovi_challenge_${challengeId}`, 'true');
      recordStreakActivity('challenge');
    }

    try {
      await fetch('/api/progress/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId, score: validation.score || 100, completed: true }),
      });
    } catch {
      // Local state preserved
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => void verifyAndComplete(false)}
          disabled={loading}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition shadow cursor-pointer ${
            done
              ? 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
              : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-cyan-500/20'
          }`}
        >
          {loading ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span>Verifying state...</span>
            </>
          ) : done ? (
            <>
              <span>✓</span>
              <span>Completed (Click to Reset)</span>
            </>
          ) : (
            <>
              <span>Verify Solution</span>
              <span>→</span>
            </>
          )}
        </button>

        {/* Manual Mark Complete option if stuck on virtual terminal quirks */}
        {!done && (
          <button
            type="button"
            onClick={() => void verifyAndComplete(true)}
            title="Mark as completed manually"
            className="text-[11px] text-slate-500 hover:text-slate-300 transition underline underline-offset-2 cursor-pointer p-1"
          >
            Mark done
          </button>
        )}
      </div>

      {/* Verification Message Alert */}
      {message && (
        <div
          className={`absolute right-0 top-full mt-2 z-20 w-72 rounded-xl p-3 text-xs leading-relaxed shadow-xl border ${
            message.type === 'error'
              ? 'border-rose-500/30 bg-slate-950 text-rose-300 shadow-rose-950/40'
              : 'border-emerald-500/30 bg-slate-950 text-emerald-300 shadow-emerald-950/40'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <span>{message.text}</span>
            <button
              onClick={() => setMessage(null)}
              className="text-slate-500 hover:text-white shrink-0 cursor-pointer"
            >
              ✕
            </button>
          </div>
          {message.type === 'error' && (
            <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <Link href="/terminal" className="text-cyan-400 hover:underline">
                Open Sandbox Terminal →
              </Link>
              <button
                onClick={() => void verifyAndComplete(true)}
                className="text-slate-400 hover:text-white underline cursor-pointer"
              >
                Bypass & Complete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
