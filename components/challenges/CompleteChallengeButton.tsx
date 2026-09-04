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
          className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
            done
              ? 'border border-[#34D399]/40 bg-[#34D399]/10 text-[#34D399] hover:bg-[#34D399]/20'
              : 'bg-[#22D3EE] text-[#0B0F14] hover:bg-[#67E8F9]'
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
            className="text-[11px] text-[#737F8C] hover:text-[#A7B0BC] transition underline underline-offset-2 cursor-pointer p-1"
          >
            Mark done
          </button>
        )}
      </div>

      {/* Verification Message Alert */}
      {message && (
        <div
          className={`absolute right-0 top-full mt-2 z-20 w-72 rounded-md p-3 text-xs leading-relaxed border bg-[#11161D] ${
            message.type === 'error'
              ? 'border-[#F87171]/40 text-[#F87171]'
              : 'border-[#34D399]/40 text-[#34D399]'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <span>{message.text}</span>
            <button
              onClick={() => setMessage(null)}
              className="text-[#737F8C] hover:text-[#E6EDF3] shrink-0 cursor-pointer"
            >
              ✕
            </button>
          </div>
          {message.type === 'error' && (
            <div className="mt-2 pt-2 border-t border-[#202934] flex items-center justify-between text-[11px]">
              <Link href="/terminal" className="text-[#22D3EE] hover:underline">
                Open Sandbox Terminal →
              </Link>
              <button
                onClick={() => void verifyAndComplete(true)}
                className="text-[#A7B0BC] hover:text-[#E6EDF3] underline cursor-pointer"
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
