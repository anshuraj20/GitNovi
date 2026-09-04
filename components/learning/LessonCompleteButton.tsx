'use client';

import { useState, useEffect } from 'react';
import { recordStreakActivity } from '@/lib/progress/streak';

export function LessonCompleteButton({
  lessonId,
  initialCompleted = false,
}: {
  lessonId: string;
  initialCompleted?: boolean;
}) {
  const [done, setDone] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`gitnovi_lesson_${lessonId}`);
      if (saved !== null) {
        setDone(saved === 'true');
      }
    }
  }, [lessonId]);

  const toggle = async () => {
    if (loading) return;
    setLoading(true);

    const nextState = !done;

    // Optimistic local update
    setDone(nextState);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`gitnovi_lesson_${lessonId}`, nextState ? 'true' : 'false');
        if (nextState) {
          recordStreakActivity('lesson');
        }
      } catch {
        // LocalStorage quota or access error
      }
    }

    try {
      const res = await fetch('/api/progress/lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, percent: nextState ? 100 : 0 }),
      });

      if (!res.ok) {
        console.warn('Progress API non-ok response, preserved local toggle state.');
      }
    } catch (err) {
      console.warn('Network error while toggling progress, preserved local state:', err);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <button
        onClick={toggle}
        disabled={loading}
        title="Click to mark as incomplete"
        aria-label="Lesson completed. Click to mark as incomplete."
        className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#34D399]/40 bg-[#34D399]/10 hover:bg-[#34D399]/20 hover:border-[#34D399] text-xs font-medium text-[#34D399] transition cursor-pointer"
      >
        {loading ? (
          <span className="w-3 h-3 rounded-full border-2 border-[#34D399] border-t-transparent animate-spin" />
        ) : (
          <svg
            className="w-3.5 h-3.5 text-[#34D399]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
        <span>Completed</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#293542] bg-[#11161D] hover:bg-[#171D25] hover:border-[#22D3EE]/50 text-xs font-medium text-[#E6EDF3] hover:text-[#22D3EE] transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <span className="w-3 h-3 rounded-full border-2 border-[#22D3EE] border-t-transparent animate-spin" />
          Saving...
        </>
      ) : (
        'Mark as Completed'
      )}
    </button>
  );
}
